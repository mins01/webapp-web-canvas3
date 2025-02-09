// import NamedSelectableArray from "./lib/NamedSelectableArray.js";
// import SelectableArray from "./lib/SelectableArray.js";
import PointerEventHandler from "./lib/PointerEventHandler.js";

import Context2dConfig from "./lib/Context2dConfig.js";
import Context2dTextConfig from "./lib/Context2dTextConfig.js";

import Documents from "./element/Editor/Documents.js";

// import jsColor from "./lib/jsColor.js";
import Tools from "./tool/Tools.js";
import HtmlUtil from "./lib/HtmlUtil.js";

import Document from "./element/Document.js";

import EditorConfig from "./lib/EditorConfig.js";

export default class Editor{
    brush = null;
    brushEraser = null;
    editorConfig = null;
    modalHandler = null;
    temp = null

    utt = null;
    constructor(target){
        this.temp = {}
        this.editorConfig = new EditorConfig()
        this.target = target;
        // this.documents = new NamedSelectableArray('document');
        this.documents = new Documents(this);
        this.target.querySelectorAll('canvas[is="wc-document"]').forEach(el => {
            this.documents.add(el)
        });
        this.activeTool = null;
        this.peh = new PointerEventHandler(this);
        this.peh.onpointerdown = this.onpointerdown;
        this.peh.onpointermove = this.onpointermove;
        this.peh.onpointerup = this.onpointerup;
        this.peh.addEventListener(target)

        // this.tool = null;
        this.tools = new Tools(this);
        // this.tools.select('Rectangle');
        // this.tools.active('line');
        // this.tool = new Line(this);

        // this.documents.documentIndex = 0;

        this.contextConfig = new Context2dConfig();
        this.textConfig = new Context2dTextConfig();
    }

    get tool(){ return this?.tools?.tool; }
    
    /**
     * Description placeholder
     *
     * @readonly
     * @type {HTMLCanvasElement|Document}
     */
    get document(){ return this?.documents?.selected??null; }

    // get contextConf(){
    //     return {
    //         strokeStyle:this.strokeStyleColor.toHex(),
    //         fillStyle :this.fillStyleColor.toHex(),
    //     }
    // }


    initConfigs(){
        this.setEditorConfig(JSON.parse(localStorage.getItem('editorConfig')??'{}'));
        this.setBrushConfig(JSON.parse(localStorage.getItem('brushConfig')??'{}'));
        this.setEraserConfig(JSON.parse(localStorage.getItem('eraserConfig')??'{}'));
    }

    setEditorConfig(conf){
        this.editorConfig.assignFrom(conf);
        localStorage.setItem('editorConfig',JSON.stringify(this.editorConfig))
    }
    setContextConfig(conf){
        // Object.assign(this.contextConfig,conf);
        this.contextConfig.assignFrom(conf);
        this.document?.setContextConfig(this.contextConfig.toObject());
        this.brush.contextConfig.foreColor =this.contextConfig.foreColor;
        this.brush.contextConfig.backColor =this.contextConfig.backColor;
        this.brush.flush();
        if(window.document.querySelector('#btn-palette')){
            window.document.querySelector('#btn-palette').style.backgroundColor = this.contextConfig.foreColor
        }
        
    }
    setTextConfig(conf){
        // Object.assign(this.textConfig,conf);        
        this.textConfig.assignFrom(conf);
        this.document?.setTextConfig(this.textConfig.toObject());
    }
    setBrushConfig(conf){
        if(this?.brush){
            this.brush?.setBrushConfig(conf);
            this.brush.flush();
            localStorage.setItem('brushConfig',JSON.stringify(this.brush.brushConfig))
            // console.log('x',JSON.stringify(this.brush.brushConfig));
            
        }
    }
    setEraserConfig(conf){
        if(this?.brushEraser){
            this.brushEraser?.setBrushConfig(conf);
            this.brushEraser.contextConfig.foreColor='#fff'
            this.brushEraser.flush();
            localStorage.setItem('eraserConfig',JSON.stringify(this.brushEraser.brushConfig))
            // console.log('x',JSON.stringify(this.brushEraser.brushConfig));
        }
    }
    
    
    

    addEventListener(){
        this.peh.addEventListener(this.target);
        this.target.addEventListener('dblclick',(event)=>{ 
            if(this.peh.maxPointers===1 ){
                if(this?.tool?.ondblclick) this?.tool?.ondblclick(event) 
            }else if(this.peh.maxPointers >= 2){
                if(this.peh.pointers.size===2){
                    
                }
            }
        })
    }
    removeEventListener(){
        this.peh.removeEventListener(this.target);
    }
    // @deprecated
    getXYFromEvent(event){
        let doc = this.document;
        let layer = this.document.layer;
        // let dl = doc.drawLayer;
        // let x = event.x - doc.offsetLeft - dl.x + window.scrollX;
        // let y = event.y - doc.offsetTop - dl.y + window.scrollY;
        // let x = event.x - doc.offsetLeft  + window.scrollX;
        // let y = event.y - doc.offsetTop  + window.scrollY;
        let x = event.x - doc.offsetLeft - layer.left + window.scrollX;
        let y = event.y - doc.offsetTop - layer.top + window.scrollY;
        return {x:x,y:y};
    }

    onpointerdown=(event)=>{
        this.target.dataset.pointerEventType = event.type;
        if(this.peh.maxPointers===1 ){
            this.tool.start();
            this.tool.onpointerdown(event);
        }else if(this.peh.maxPointers >= 2){
            if(this.tool.downAt){
                this.tool.cancel();
            }
            if(this.peh.pointers.size===2){
                // 줌 처리
                this.temp.document_zoom = this.document.zoom;
                const points = Array.from(this.peh.pointers.values());
                this.temp.touchStartDistance = Math.hypot(
                    points[1].x - points[0].x,
                    points[1].y - points[0].y
                );
            }
        }
        
        
    }
    onpointermove=(event)=>{
        this.target.dataset.pointerEventType = event.type;
        if(this.peh.maxPointers===1 ){
            this.tool.onpointermove(event);
        }else if(this.peh.maxPointers >= 2){
            if(this.peh.pointers.size===2){
                // 줌 처리
                this.temp.document_zoom = this.document.zoom;
                const points = Array.from(this.peh.pointers.values());
                const currentDistance = Math.hypot( points[1].x - points[0].x, points[1].y - points[0].y );
                const scale = Math.round(((currentDistance / this.temp.touchStartDistance) - 1)*100)/1000;
                const zoom = Math.min(3,Math.max(0.1,this.temp.document_zoom + scale));
                // console.log(this.document.zoom-zoom,zoom);
                
                if(Math.abs(this.document.zoom-zoom)>0.01){
                    this.document.zoom = zoom
                    this.document.flush();
                }
            }
        }
    }
    onpointerup=(event)=>{
        // this.target.dataset.pointerEventType = event.type;
        delete this.target.dataset.pointerEventType
        if(this.peh.maxPointers===1 ){
            this.tool.onpointerup(event);
            this.tool.end();
        }else if(this.maxPointers>=2 && this.peh.pointers.size===2 ){
            
        }
    }

    // document가 변경되면 불러야한다.
    onchangeDocument(document){
        // console.log('onchangeDocument',document.id,document.layer.id)
    }
    // 레이어가 선택되면 불려야한다. (순서 변경 때도)
    onselectLayer(layer){
        // console.log('onselectLayer',layer.id)
    }




    /**
     * Description placeholder
     *
     * @param {string} [type='wc3.json'] 
     * @param {string} [filename=null] 
     * @returns {boolean} 
     */
    saveDocument(type='wc3.json',filename=null){
        if(!this.document){return false;}
        if(filename===null){ filename = this.document.name }
        filename = filename.trim().replace(/[\\\/\:\*\?\"\<\>]|/g,''); //OS 금지 글자 제거
        if(filename.length==0) filename = Date.now();
        if(filename != this.document.name){ this.document.name = filename; }

        console.log(filename);

        let ext = '';
        let mimetype = null;
        if(type==='wc3.json'){
            ext = 'wc3.json';
            mimetype = 'application/json';
            const cb = (blob)=>{ HtmlUtil.saveAsFile(blob, filename+'.'+ext , mimetype); }
            this.document.toBlob(cb,mimetype)
        }else if(type==='png'){
            ext = 'png';
            mimetype = 'image/png';
            const cb = (blob)=>{ HtmlUtil.saveAsFile(blob, filename+'.'+ext , mimetype); }
            this.document.toBlob(cb,mimetype)
        }else{
            console.error('지원되지 않는 타입')
        }
        // console.log(ep);  
    }
    /**
     * Description placeholder
     *
     * @param {string} [type='wc3.json'] 
     * @param {string} [filename=null] 
     * @returns {boolean} 
     */
    uploadDocument(type='wc3.json',filename=null){
        if(!this.document){return false;}
        if(filename===null){ filename = this.document.name }
        filename = filename.trim().replace(/[\\\/\:\*\?\"\<\>]|/g,''); //OS 금지 글자 제거
        if(filename.length==0) filename = Date.now();
        if(filename != this.document.name){ this.document.name = filename; }

        console.log(filename);

        let ext = '';
        let mimetype = null;
        if(type==='wc3.json'){
            ext = 'wc3.json';
            mimetype = 'application/json';
            const cb = (blob)=>{ this.upload(blob, filename+'.'+ext); }
            this.document.toBlob(cb,mimetype)
        }else if(type==='png'){
            ext = 'png';
            mimetype = 'image/png';
            const cb = (blob)=>{ this.upload(blob, filename+'.'+ext); }
            this.document.toBlob(cb,mimetype)
        }else{
            console.error('지원되지 않는 타입')
        }
        // console.log(ep);  
    }    
    loadDocument(file){
        this.closeDocument();
        // console.log(file);
        if(file.name.match(/wc3\.json$/)){
            HtmlUtil.asyncLoadFile(file).then((text)=>{
                const conf = JSON.parse(text);
                const document = Document.importFrom(conf)
                this.documents.add(document);
            })
        }else if(file.type.match(/^image\//)){
            const imageURL = URL.createObjectURL(file);
            const image = new Image();
            image.onload=(event)=>{
                const target = event.target;
                URL.revokeObjectURL(imageURL);
                const document = Document.fromImage(target);
                this.documents.add(document);
            }
            image.src = imageURL;
        }
    }
    closeDocument(){
        if(this.document){
            this.documents.remove();
        }
    }
    newDocument(width,height){
        // 다중 document 우선 지원하지 말자.
        this.closeDocument();
        this.documents.create(width,height);
        // const document = new Document(width,height);
        // document.layers[0].fill('#fff')
        // document.addEmptyLayer();
        // this.documents.add(document);
    }
    previewDocument(){
        if(this?.document){
            const url = this.document.toDataURL('image/png');
            this.previewImage(url);
        }
    }

    previewImage(url){
        const imgPreview = window.document.querySelector('#img-preview');
        imgPreview.src = url;
        imgPreview.addEventListener('load',(event)=>{
            let target = event.target;
            let modalNode = target.closest('.modal');
            modalNode.querySelector('#img-preview-size').textContent = `${target.naturalWidth}px x ${target.naturalHeight}px`;
            const modal = bootstrap.Modal.getInstance(modalNode)
            editor.modalHandler.hideAll();
            modal.show()
        },{once:true})
    }

    saveHistory(title='no-title'){
        if(!this.document) return;
        this.document.history.save(title);
    }




    readyLayer(){
        console.log('Editor.readyLayer()')
        const document = this.document
        const modalHandler = this.modalHandler;

        const layerBoxContainer = window.document.querySelector('.layer-box-container');
        const templateLayerBox = window.document.querySelector('#template-layer-box');
        
        layerBoxContainer.innerHTML = '';

        // const layers = [document.drawLayer].concat(document.layers);
        const selectedIndex = document.layers.selectedIndex;
        document.layers.forEach((layer,index)=>{
            const layerBoxNode = window.document.importNode(templateLayerBox.content,true);
            const layerBox = layerBoxNode.querySelector('.layer-box');
            const content = layerBoxNode.querySelector('.layer-box-content');
            const preview = layerBoxNode.querySelector('.layer-box-preview');
            const detail = layerBoxNode.querySelector('.layer-box-detail');
            const eye = layerBoxNode.querySelector('.layer-box-eye');
            const config = layerBoxNode.querySelector('.layer-box-config');

            const label = layerBoxNode.querySelector('.layer-box-detail-label');
            const size = layerBoxNode.querySelector('.layer-box-detail-size');
            const zoom = layerBoxNode.querySelector('.layer-box-detail-zoom');
            const alpha = layerBoxNode.querySelector('.layer-box-detail-alpha');

            label.textContent = layer.constructor.name
            size.textContent = layer.width+'x'+layer.height
            zoom.textContent = Math.floor(layer.zoom*100)+'%'
            alpha.textContent = Math.floor(layer.alpha*100)+'%'

            if(selectedIndex == index){
                layerBox.classList.add('active')
            }
            content.onclick = (event)=>{
                layer.parent.select(index);
            }
            eye.onclick = (event)=>{
                event.stopPropagation()
                layer.visible = !layer.visible;
                layer.flush();
                layer?.parent?.readyLayer();
                layer?.parent?.history.save('layer.visible')
            }
            config.layer = layer;
            config.onclick = (event)=>{
                this.showModalLayerProperty(layer);
            }   
            layerBox.dataset.wcLayerVisible = layer.visible;

            preview.innerHTML = '';
            preview.append(layer);
            layerBoxContainer.prepend(layerBox)

            
        })



        if(this?.document?.layer){
            const layerAlpha = window.document.querySelector('#layer-alpha')
            layerAlpha.value = this?.document?.layer.alpha
            UiInputStepper.syncDataValue(layerAlpha)
        }

        this?.tool?.ready();

    }

    

    upload(file,filename){
        console.log(upload,file,filename);
      
        //재선언해야함.
    }


    showModalLayerProperty(layer){
        this.temp.selectedLayer = layer;
        this.modalHandler.hideAll();
        this.modalHandler.get('modal-layer-config').show();
    }

    readyUtt(){
        if(!this?.document?.layer) return;
        const layer = this.document.layer;
        console.log(layer);
        
        this.utt.left =layer.left
        this.utt.top =layer.top
    }
}
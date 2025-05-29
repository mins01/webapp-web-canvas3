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
import Layer from "./element/Layer.js";
import LayerKind from "./lib/LayerKind.js";
import Context2dUtil from "./lib/Context2dUtil.js";

export default class Editor{
    brush = null;
    brush1 = null;
    brush2 = null;
    brush3 = null;
    eraser = null;
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

        // @deprecated
        // this.setBrushConfig(JSON.parse(localStorage.getItem('brushConfig')??'{}'),'brush');
        // this.setBrushConfig(JSON.parse(localStorage.getItem('brush1Config')??'{}'),'brush1');
        // this.setBrushConfig(JSON.parse(localStorage.getItem('brush2Config')??'{}'),'brush2');
        // this.setBrushConfig(JSON.parse(localStorage.getItem('brush3Config')??'{}'),'brush3');
        // this.setBrushConfig(JSON.parse(localStorage.getItem('eraserConfig')??'{}'),'eraser');

        this.brush.loadBrushConfig();this.brush.flush();
        // this.brush1.loadBrushConfig();this.brush1.flush();
        this.brush2.loadBrushConfig();this.brush2.flush();
        this.brush3.loadBrushConfig();this.brush3.flush();
        this.eraser.loadBrushConfig();this.eraser.flush();
    }

    setEditorConfig(conf){
        this.editorConfig.assignFrom(conf);
        localStorage.setItem('editorConfig',JSON.stringify(this.editorConfig))
    }
    setContextConfig(conf){
        // Object.assign(this.contextConfig,conf);
        this.contextConfig.assignFrom(conf);
        this.document?.setContextConfig(this.contextConfig.toObject());

        [this?.brush,this?.brush1,this?.brush2,this?.brush3].forEach(brush=>{
            if(brush){
                brush.contextConfig.foreColor =this.contextConfig.foreColor;
                brush.contextConfig.backColor =this.contextConfig.backColor;
                brush.flush();
            }
        })

        document.querySelectorAll('.wc-bg-foreColor').forEach(el=>{
            el.style.backgroundColor = this.contextConfig.foreColor
        })
    }
    setTextConfig(conf){
        if(this.document.layer.kind != LayerKind.TEXT){
            return;
        }
        // Object.assign(this.textConfig,conf);        
        // this.textConfig.assignFrom(conf);
        // this.document?.setTextConfig(this.textConfig.toObject());
        this.document.layer.textConfig.assignFrom(conf)
        console.log(this.document.layer,this.document.layer.textConfig);
        
        this.document.layer.flush();
        document.querySelectorAll('.wc-bg-textColor').forEach(el=>{
            el.style.backgroundColor = this.document.layer.textConfig.textColor
        })
    }

    // @deprecated
    setBrushConfig(conf,brushKey='0'){
        let brush = this?.[brushKey];
        let key = brushKey+'Config';
        if(brush){
            brush?.setBrushConfig(conf);
            if(brushKey.startsWith('eraser')) brush.contextConfig.foreColor='#666'
            brush.saveBrushConfig();
            brush.flush();
            // localStorage.setItem(key,JSON.stringify(brush.brushConfig))
        }
    }
    // @deprecated
    resetBrushConfig(brushKey='0'){
        let brush = this?.[brushKey];
        let key = brushKey+'Config';
        if(brush){
            brush?.resetBrushConfig();
            if(brushKey.startsWith('eraser')) brush.contextConfig.foreColor='#666'
            brush.saveBrushConfig();
            brush.flush();
            // localStorage.setItem(key,JSON.stringify(brush.brushConfig))
        }
    }
    // setEraserConfig(conf){
    //     if(this?.eraser){
    //         this.eraser?.setBrushConfig(conf);
    //         this.eraser.contextConfig.foreColor='#666'
    //         this.eraser.flush();
    //         localStorage.setItem('eraserConfig',JSON.stringify(this.eraser.brushConfig))
    //         // console.log('x',JSON.stringify(this.eraser.brushConfig));
    //     }
    // }
    
    
    

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
        // let dl = doc.drawingLayer;
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
                const document = this?.document
                if(!document){ console.warn('document is not exists'); return;}
                this.temp.document_zoom = this.document.zoom;
                const points = Array.from(this.peh.pointers.values());
                this.temp.touchStartDistance = Math.hypot( points[1].x - points[0].x, points[1].y - points[0].y );
                this.temp.documentHypot = Math.hypot( document.width, document.height );
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
                const document = this?.document
                if(!document){ console.warn('document is not exists'); return;}
                const touchStartDistance = this.temp.touchStartDistance
                // const baseWidth = Math.min(document.width,document.height)
                const baseWidth = this.temp.documentHypot;
                

                // this.temp.document_zoom = this.document.zoom;
                const points = Array.from(this.peh.pointers.values());
                const currentDistance = Math.hypot( points[1].x - points[0].x, points[1].y - points[0].y );
                const moveDistance = currentDistance - touchStartDistance;
                const scale = moveDistance/baseWidth;
                // const scale = Math.round(((currentDistance / this.temp.touchStartDistance) - 1)*100)/1000;
                const zoom = Math.ceil(Math.min(3,Math.max(0.1,this.temp.document_zoom + scale))*100)/100;
                // console.log(this.document.zoom-zoom,zoom);
                // console.log('moveDistance',moveDistance,scale,zoom);
                
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
     * Alias of {@link saveDocument}.  
     * Downloads the current document by saving it with the specified type, filename, and quality.
     *
     */
    downloadDocument(type='wc3.json',filename=null,quality=0.5){
        return this.saveDocument(type,filename,quality);
    }
    /**
     * Saves the current document in the specified format with optional filename and image quality.
     *
     * @param {string} [type='wc3.json'] - Format to save the document as. Supports: 'wc3.json', 'png', 'jpg', 'webp'.
     * @param {string|null} [filename=null] - Filename to use. Defaults to the document's current name.
     * @param {number} [quality=0.5] - Image quality (0.0–1.0). Used only for image formats.
     * @returns {boolean|Promise<void>} Returns false if no document exists, otherwise a promise that resolves after saving.
     */
    saveDocument(type='wc3.json',filename=null,quality=0.5){
        if(!this.document){return false;}
        if(filename===null){ filename = this.document.name }
        filename = filename.trim().replace(/[\\\/\:\*\?\"\<\>]|/g,''); //OS 금지 글자 제거
        if(filename.length==0) filename = Date.now();
        if(filename != this.document.name){ this.document.name = filename; }

        quality = parseFloat(quality);

        
        let ext = '';
        let mimetype = null;
        if(type==='wc3.json'){
            ext = 'wc3.json';
            mimetype = 'application/json';            
        }else if(type==='png'){
            ext = 'png';
            mimetype = 'image/png';
        }else if(type==='jpg'){
            ext = 'jpg';
            mimetype = 'image/jpeg';
        }else if(type==='webp'){
            ext = 'webp';
            mimetype = 'image/webp';
        }
        if(mimetype){
            this.document.toBlobAsync(mimetype,quality).then((blob)=>{ HtmlUtil.saveAsFile(blob, filename+'.'+ext , mimetype);}).catch(e=>{console.error(e);})
        }else {
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
    async uploadDocument(type='wc3.json',filename=null,quality=0.5){
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
        }else if(type==='png'){
            ext = 'png';
            mimetype = 'image/png';
        }else if(type==='jpg'){
            ext = 'jpg';
            mimetype = 'image/jpeg';
        }else if(type==='webp'){
            ext = 'webp';
            mimetype = 'image/webp';
        }
        if(mimetype){
            try{
                const blob = await this.document.toBlobAsync(mimetype,quality)//.then((blob)=>{ this.upload(blob, filename+'.'+ext); }).catch(e=>{console.error(e);})
                return this.upload(blob, filename+'.'+ext);
            }catch(e){
                throw new Error(e);
            }
        }else {
            throw new Error('지원되지 않는 타입');
        }
    }    
    async loadDocument(file){
        if(file instanceof File){
            return this.loadDocumentByFile(file); //File 객체로 처리한다.
        }else{
            return this.loadDocumentByUrl(file); //URL 로 처리한다.
        }
    }
    async loadDocumentByFile(file){
        // console.log(file);
        if(file.name.match(/wc3\.json$/)){
            return HtmlUtil.loadJsonFile(file).then((conf)=>{
                this.closeDocument();
                this.loadJson(conf);
            })
        }else if(file.type.match(/^image\//)){
            const imageURL = URL.createObjectURL(file);
            return HtmlUtil.loadImageUrl(imageURL).then((image)=>{               
                this.closeDocument();
                const document = Document.fromImage(image);
                this.documents.add(document);
                URL.revokeObjectURL(imageURL);
            })
        }
    }
    async loadDocumentByUrl(url){
        // console.log(file);
        if(url.match(/wc3\.json/)){ // JSON 형식인가?
            return HtmlUtil.loadJsonUrl(url).then((conf)=>{
                this.closeDocument();
                this.loadJson(conf);
            }).catch((e)=>{
                alert(e.message);
                console.warn(e);
                throw e;
            });
        }else{ // 이미지로 보고 진행
            const imageURL = url;
            return HtmlUtil.loadImageUrl(imageURL).then((image)=>{               
                this.closeDocument();
                const document = Document.fromImage(image);
                this.documents.add(document);
            }).catch((e)=>{
                alert(e.message??'An error occurred while loading the image.');
                console.warn(e);
                throw e;
            });
        }
    }
    loadDocumentJson(json){
        this.closeDocument();
        this.loadJson(json);
    }
    loadJson(json){
        const document = Document.importFrom(json)
        this.documents.add(document);
        return document;
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
        return this.document;
    }
    previewDocument(){
        if(this?.document){
            const url = this.document.toDataURL('image/png');
            this.previewImage(url);
        }
    }

    insertLayerFromFile(file){
        if(file.type.match(/^image\//)){
            const imageURL = URL.createObjectURL(file);
            HtmlUtil.loadImageUrl(imageURL).then((image)=>{
                const layer = Layer.fromImage(image)
                this.document.add(layer);
                this.ready()
                URL.revokeObjectURL(imageURL);
            })
        }else{
            console.error('It is not an image file',file);
        }
    }

    previewImage(url){
        const imgPreview = window.document.querySelector('#img-preview');
        imgPreview.src = url;
        imgPreview.addEventListener('load',(event)=>{
            let target = event.target;
            let modalNode = target.closest('.modal');
            setTimeout(()=>{
                const rect = target.getBoundingClientRect()                
                modalNode.querySelector('#img-preview-natural-size').textContent = `${target.naturalWidth}px x ${target.naturalHeight}px`;
                modalNode.querySelector('#img-preview-size').textContent = `(${rect.width.toFixed(0)}px x ${rect.height.toFixed(0)}px)`;
            },500)
            
            const modal = bootstrap.Modal.getInstance(modalNode)
            editor.modalHandler.hideAll();
            modal.show()
        },{once:true})
    }

    saveHistory(title='no-title'){
        if(!this.document) return;
        this.document.history.save(title);
    }



    ready(){
        console.log('editor.ready()');
        this.readyEditor();    
    }
    readyEditor(){
        this.readyLayer();
        this?.tool?.inactivate();
        this?.tool?.activate();
    }
    readyLayer(){
        console.log('editor.readyLayer()')
        const document = this.document
        const modalHandler = this.modalHandler;

        const layerBoxContainer = window.document.querySelector('.layer-box-container');
        const templateLayerBox = window.document.querySelector('#template-layer-box');
        
        layerBoxContainer.innerHTML = '';

        // const layers = [document.drawingLayer].concat(document.layers);
        const selectedIndex = document.layers.selectedIndex;
        document.layers.forEach((layer,index)=>{
            const layerBoxNode = window.document.importNode(templateLayerBox.content,true);
            const layerBox = layerBoxNode.querySelector('.layer-box');
            const content = layerBoxNode.querySelector('.layer-box-content');
            const preview = layerBoxNode.querySelector('.layer-box-preview');
            const detail = layerBoxNode.querySelector('.layer-box-detail');
            const eye = layerBoxNode.querySelector('.layer-box-eye');
            const config = layerBoxNode.querySelector('.layer-box-config');

            // const label = layerBoxNode.querySelector('.layer-box-detail-label');
            const name = layerBoxNode.querySelector('.layer-box-detail-name');
            const size = layerBoxNode.querySelector('.layer-box-detail-size');
            const zoom = layerBoxNode.querySelector('.layer-box-detail-zoom');
            const alpha = layerBoxNode.querySelector('.layer-box-detail-alpha');
            layerBox.dataset.flipX = layer.flipX;
            layerBox.dataset.flipY = layer.flipY;

            // label.textContent = layer.constructor.name
            name.textContent = layer.name
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
                layer?.parent?.ready();
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

            const layerCompositeOperation = window.document.querySelector('#layer-composite-operation')
            layerCompositeOperation.value = this?.document?.layer.compositeOperation
            UiInputStepper.syncDataValue(layerCompositeOperation)
        }

       

    }

    

    upload(file,filename){
        console.log('재선언해야함',file,filename);
        // alert('업로드가 지원되지 않는 상태입니다.')
        throw new Error('업로드가 지원되지 않는 상태입니다.');
        
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




    dispatchEvent(event,detail=null){       
        const ce = (event instanceof CustomEvent)?event:(new CustomEvent(event,{detail,bubbles:true,cancelable:true,composed:true,}));
        return this.target.dispatchEvent(ce)
    }
}
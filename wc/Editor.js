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

export default class Editor{
    brush = null;
    modalHandler = null;
    constructor(target){
        this.target = target;
        // this.documents = new NamedSelectableArray('document');
        this.documents = new Documents(this);
        this.target.querySelectorAll('canvas[is="wc-document"]').forEach(el => {
            this.documents.add(el)
        });
        this.activeTool = null;
        this.peh = new PointerEventHandler(target);
        this.peh.onpointerdown = this.onpointerdown;
        this.peh.onpointermove = this.onpointermove;
        this.peh.onpointerup = this.onpointerup;

        // this.tool = null;
        this.tools = new Tools(this);
        // this.tools.select('Rectangle');
        // this.tools.active('line');
        // this.tool = new Line(this);

        // this.documents.documentIndex = 0;

        this.contextConfig = new Context2dConfig();
        this.textConfig = new Context2dTextConfig();
    }

    get tool(){ return this.tools.selected; }
    get document(){ return this.documents.selected; }

    // get contextConf(){
    //     return {
    //         strokeStyle:this.strokeStyleColor.toHex(),
    //         fillStyle :this.fillStyleColor.toHex(),
    //     }
    // }


    setContextConfig(conf){
        // Object.assign(this.contextConfig,conf);
        this.contextConfig.assignFrom(conf);
        this.document?.setContextConfig(this.contextConfig.toObject());
        this.brush.contextConfig.foreColor =this.contextConfig.foreColor;
        this.brush.contextConfig.backColor =this.contextConfig.backColor;
        this.brush.flush();
    }
    setTextConfig(conf){
        // Object.assign(this.textConfig,conf);        
        this.textConfig.assignFrom(conf);
        this.document?.setTextConfig(this.textConfig.toObject());
    }
    setBrushConfig(conf){
        // Object.assign(this.brushConfig,conf);        
        // this.brush?.setBrushConfig(this.brushConfig.toObject());
        this.brush?.setBrushConfig(conf);
    }

    addEventListener(){
        this.peh.addEventListener(this.target);
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
        this.tool.start();
        this.tool.onpointerdown(event);
    }
    onpointermove=(event)=>{
        this.tool.onpointermove(event);
    }
    onpointerup=(event)=>{
        this.tool.onpointerup(event);
        this.tool.end();
    }



    // document가 변경되면 불러야한다.
    onchangeDocument(document){
        console.log('onchangeDocument',document.id,document.layer.id)
    }
    // 레이어가 선택되면 불려야한다. (순서 변경 때도)
    onselectLayer(layer){
        console.log('onselectLayer',layer.id)
    }




    saveDocument(type='wc3.json',filename=null){
        if(!this.document){return false;}
        if(filename===null){ filename = Date.now() }
        let data = null;
        let ext = '';
        let mimetype = null;
        if(type==='wc3.json'){
            data = JSON.stringify(this.document.export(),null,4);
            ext = 'wc3.json';
            mimetype = 'application/json';
            HtmlUtil.saveAsFile(data, filename+'.'+ext , mimetype);
        }else if(type==='png'){
            ext = 'png';
            mimetype = 'image/png';
            const cb = (blob)=>{
                HtmlUtil.saveAsFile(blob, filename+'.'+ext , mimetype);
            }
            data = this.document.toBlob(cb,'image/png')
        }else{
            console.error('지원되지 않는 타입')
        }
        // console.log(ep);
        
        
        
    }
    loadDocument(file){
        HtmlUtil.asyncLoadFile(file).then((text)=>{
            // console.log(file,text);
            const conf = JSON.parse(text);
            // console.log(conf);
            const document = Document.importFrom(conf)
            // console.log(document.layers);
            this.documents.add(document);
            // window.document.querySelector('#wc-editor').append(document);
            
            
        })
    }
    closeDocument(){
        if(this.document){
            this.documents.remove();
        }
    }
    newDocument(width,height){
        // 다중 document 우선 지원하지 말자.
        if(this?.document){ this.documents.remove(); }
        const document = new Document(width,height);
        document.layers[0].fill('#fff')
        this.documents.add(document);
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

    }

    



}
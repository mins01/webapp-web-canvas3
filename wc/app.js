
const Wc = {}
if(!globalThis.Wc) globalThis.Wc = Wc


import HtmlUtil from "./lib/HtmlUtil.js";
Wc.HtmlUtil = HtmlUtil;


//-- editor.js 생성시작
import Canvas from "./element/Canvas.js";
import Layer from "./element/Layer.js";
import Document from "./element/Document.js";
import TextLayer from "./element/TextLayer.js";
import RectangleLayer from "./element/RectangleLayer.js";
import EllipseLayer from "./element/EllipseLayer.js";
import Brush from "./element/Brush.js";

Canvas.defineCustomElements();
Layer.defineCustomElements();
Document.defineCustomElements();
TextLayer.defineCustomElements();
RectangleLayer.defineCustomElements();
EllipseLayer.defineCustomElements();
Brush.defineCustomElements();

Wc.Canvas = Canvas;
Wc.Layer = Layer;
Wc.Document = Document;
Wc.TextLayer = TextLayer;
Wc.RectangleLayer = RectangleLayer;
Wc.EllipseLayer = EllipseLayer;



import ModalHandler from "./ui/ModalHandler.js"
Wc.ModalHandler = ModalHandler;


import Editor from "./Editor.js";

const editor = globalThis.editor = new Editor(document.querySelector('#wc-editor'));
//-- 모달 핸들러
const modalHandler = globalThis.modalHandler = new ModalHandler();
editor.modalHandler = modalHandler;
editor.modalHandler.collectModals();

// 브러시들
const brush0 = globalThis.brush0 = document.querySelector('#brush0');
brush0.contextConfig.foreColor="#f00"
brush0.size = 10
brush0.flush();
// const brush1 = globalThis.brush1 = document.querySelector('#brush1');
// brush1.contextConfig.foreColor="#f00"
// brush1.size = 10
// brush1.flush();
const brush2 = globalThis.brush2 = document.querySelector('#brush2');
brush2.contextConfig.foreColor="#f00"
brush2.size = 10
brush2.flush();
const brush3 = globalThis.brush3 = document.querySelector('#brush3');
brush3.contextConfig.foreColor="#f00"
brush3.size = 10
brush3.flush();
const eraser1 = globalThis.eraser1 = document.querySelector('#eraser1');
eraser1.contextConfig.foreColor="#f00"
eraser1.size = 10
eraser1.flush();

editor.brush = globalThis.brush0 =  brush0
// editor.brush1 = brush1
editor.brush2 = brush2
editor.brush3 = brush3
editor.brushEraser = globalThis.eraser1 = eraser1


//-- new document
editor.newDocument(300,300);

// ui-transform-tool
editor.utt = document.querySelector('#utt01');

// let divForDebug = document.querySelector('#div-for-debug');

const foreColor = localStorage.getItem('foreColor')??'#000000';
const obj = {'foreColor':foreColor}
editor.setContextConfig(obj)

editor.initConfigs();



//-- upload, Wg2Uploder 가 있다면
if(globalThis?.Wg2Uploder??false){
    editor.upload = function(file,filename){
        const resJson = globalThis.Wg2Uploder.upload(file,filename)
        resJson.then((obj)=>{
            if(!obj[0]){ return; }
            const uploaded = obj[0];
            console.log(uploaded);

            if(uploaded.previewurl){
                editor.previewImage(uploaded.previewurl);
            }

        }).catch(e => {
            console.error(e);
        })
    }
}












import WcSyncHandler from "./lib/WcSyncHandler.js";
Wc.WcSyncHandler = WcSyncHandler;
const wcSyncHandler = globalThis.wcSyncHandler = new WcSyncHandler();
wcSyncHandler.addEventListener();
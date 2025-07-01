
const Wc = {}
if(!globalThis.Wc) globalThis.Wc = Wc


import HtmlUtil from "./lib/HtmlUtil.js";
Wc.HtmlUtil = HtmlUtil;
import BrushConfigurator from "./lib/BrushConfigurator.js";
Wc.BrushConfigurator = BrushConfigurator;


//-- editor.js 생성시작
import Canvas from "./element/Canvas.js";
import Layer from "./element/Layer.js";
import Document from "./element/Document.js";
import TextLayer from "./element/TextLayer.js";
import RectangleLayer from "./element/RectangleLayer.js";
import EllipseLayer from "./element/EllipseLayer.js";
import Brush from "./element/Brush.js";
import Eraser from "./element/Eraser.js";

Canvas.defineCustomElements();
Layer.defineCustomElements();
Document.defineCustomElements();
TextLayer.defineCustomElements();
RectangleLayer.defineCustomElements();
EllipseLayer.defineCustomElements();
Brush.defineCustomElements();
Eraser.defineCustomElements();

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

globalThis.window.addEventListener('load',(event)=>{
    setTimeout(()=>{
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
        const eraser = globalThis.eraser = document.querySelector('#eraser');
        eraser.contextConfig.foreColor="#f00"
        eraser.size = 10
        eraser.flush();
        
        editor.brush = globalThis.brush0 =  brush0
        // editor.brush1 = brush1
        editor.brush2 = brush2
        editor.brush3 = brush3
        editor.eraser = globalThis.eraser = eraser
        

        // ui-transform-tool
        editor.utt = document.querySelector('#utt01');
        
        // let divForDebug = document.querySelector('#div-for-debug');
        
        const foreColor = localStorage.getItem('foreColor')??'#000000';
        const obj = {'foreColor':foreColor}
        editor.setContextConfig(obj)
        
        editor.initConfigs();

        globalThis.document.querySelector('.checkbox-tool[value="Brush"]').click(); // 최초 선택 툴




        // 쿼리스트링 확인해서 로드 동작        
        const params = new URLSearchParams(globalThis.location.search);
        {
            const url = params.get('url')

            if(url){
                editor.loadDocument(url).then(()=>{}).catch(()=>{
                    // 이미지로드 에러처리
                    //-- new document
                    editor.newDocument(300,300);
                })
            }else{
                //-- new document
                editor.newDocument(300,300);
            }
        }

    },500)

    
})



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






//-- UI sync
import WcSyncHandler from "./lib/WcSyncHandler.js";
Wc.WcSyncHandler = WcSyncHandler;
const wcSyncHandler = globalThis.wcSyncHandler = editor.wcSyncHandler = new WcSyncHandler();
wcSyncHandler.addEventListener();
Wc.wcSyncHandler = wcSyncHandler;



//-- AutoSave
import AutoSave from './lib/AutoSave.js';
Wc.AutoSave = AutoSave
const autoSave = new AutoSave(editor,60*1000*5); //5분에 한번씩 저장함
Wc.autoSave = autoSave
autoSave.activate();
editor.autoSave = autoSave 
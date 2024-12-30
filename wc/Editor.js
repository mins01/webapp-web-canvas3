// import NamedSelectableArray from "./lib/NamedSelectableArray.js";
import SelectableArray from "./lib/SelectableArray.js";
import PointerEventHandler from "./lib/PointerEventHandler.js";

// import jsColor from "./lib/jsColor.js";
import Tools from "./tool/Tools.js";

export default class Editor{
    constructor(target){
        this.target = target;
        // this.documents = new NamedSelectableArray('document');
        this.documents = new SelectableArray();
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

        this.contextConf = {
            strokeStyle:'#000000',
            fillStyle:'#ffffff',
            lineWidth:3,
        }


    }

    get tool(){ return this.tools.selected; }
    get document(){ return this.documents.selected; }

    // get contextConf(){
    //     return {
    //         strokeStyle:this.strokeStyleColor.toHex(),
    //         fillStyle :this.fillStyleColor.toHex(),
    //     }
    // }

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
        let x = event.x - doc.offsetLeft - layer.x + window.scrollX;
        let y = event.y - doc.offsetTop - layer.y + window.scrollY;
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



    
}
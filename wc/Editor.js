// import NamedSelectableArray from "./lib/NamedSelectableArray.js";
import SelectableArray from "./lib/SelectableArray.js";
import PointerEventHandler from "./lib/PointerEventHandler.js";

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
        this.peh.ondown = this.ondown;
        this.peh.onmove = this.onmove;
        this.peh.onup = this.onup;
        
        // this.tool = null;
        this.tools = new Tools(this);
        // this.tools.select('Rectangle');
        // this.tools.active('line');
        // this.tool = new Line(this);

        // this.documents.documentIndex = 0;
    }

    get tool(){ return this.tools.selected; }
    get document(){ return this.documents.selected; }

    addEventListener(){
        this.peh.addEventListener(this.target);
    }
    removeEventListener(){
        this.peh.removeEventListener(this.target);
    }
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
    ondown=(event)=>{
        const p = this.getXYFromEvent(event)
        this.tool.start();
        this.tool.down(event);
    }
    onmove=(event)=>{
        const p = this.getXYFromEvent(event)

        this.tool.move(event);
    }
    onup=(event)=>{
        const p = this.getXYFromEvent(event)
        this.tool.up(event);
        this.tool.end();        
    }



    
}
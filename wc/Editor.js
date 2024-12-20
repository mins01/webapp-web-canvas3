import NamedSelectableArray from "./libs/NamedSelectableArray.js";
import PointerEventHandler from "./libs/PointerEventHandler.js";

import Tools from "./tools/Tools.js";

export default class Editor{
    constructor(target){
        this.target = target;
        this.documents = new NamedSelectableArray('document');
        this.target.querySelectorAll('canvas[is="wc-document"]').forEach(el => {
            this.documents.add(el)
        });
        this.activeTool = null;
        this.peh = new PointerEventHandler(target);
        this.peh.ondown = this.ondown;
        this.peh.onmove = this.onmove;
        this.peh.onup = this.onup;
        
        this.tool = null;
        this.tools = new Tools(this);
        this.tools.active('line');
        // this.tool = new Line(this);

        // this.documents.selectedIndex = 0;
    }    

    addEventListener(){
        this.peh.addEventListener(this.target);
    }
    removeEventListener(){
        this.peh.removeEventListener(this.target);
    }
    getXYFromEvent(event){
        let doc = this.documents.document;
        let dl = doc.drawLayer;
        let x = event.x - doc.offsetLeft - dl.x + window.scrollX;
        let y = event.y - doc.offsetTop - dl.y + window.scrollY;
        return {x:x,y:y};
    }
    ondown=(event)=>{
        const p = this.getXYFromEvent(event)
        this.tool.start();
        this.tool.down(p.x,p.y);
    }
    onmove=(event)=>{
        const p = this.getXYFromEvent(event)

        this.tool.move(p.x,p.y);
    }
    onup=(event)=>{
        const p = this.getXYFromEvent(event)
        this.tool.up(p.x,p.y);
        this.tool.end();        
    }



    
}
import PointerEventHandler from "./PointerEventHandler.js";

import Tools from "./tools/Tools.js";

export default class Editor{
    constructor(target){
        this.target = target;
        this.documents = [];
        this.target.querySelectorAll('canvas[is="wc-document"]').forEach(el => {
            this.documents.push(el)
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
        this.active(0);
    }
    active(index=null){
        if(index==null){
            index = this.activeIndex;
        }else{
            this.activeIndex = index;
        }
        let activeCanvas = this.documents[index]??null;
        
        activeCanvas.drawLayer.ctx.strokeStyle = '#000000'

       return activeCanvas;
    }
    

    addEventListener(){
        this.peh.addEventListener(this.target);
    }
    removeEventListener(){
        this.peh.removeEventListener(this.target);
    }
    getXYFromEvent(event){
        let wc = this.active();
        let dl = wc.drawLayer;
        let x = event.x - wc.offsetLeft - dl.x + window.scrollX;
        let y = event.y - wc.offsetTop - dl.y + window.scrollY;
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
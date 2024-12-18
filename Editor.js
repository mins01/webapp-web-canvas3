import PointerEventHandler from "./PointerEventHandler.js";

export default class Editor{
    constructor(target){
        this.target = target;
        this.wcCanvases = [];
        this.target.querySelectorAll('canvas[is="wc-canvas"]').forEach(el => {
            this.wcCanvases.push(el)
        });
        this.activeTool = null;
        this.peh = new PointerEventHandler(target);
        this.peh.ondown = this.ondown;
        this.peh.onmove = this.onmove;
        this.peh.onup = this.onup;


        this.active(0);
    }
    active(index=null){
        if(index==null){
            index = this.activeIndex;
        }else{
            this.activeIndex = index;
        }
        let activeCanvas = this.wcCanvases[index]??null;
       return activeCanvas;
    }

    addEventListener(){
        this.peh.addEventListener(this.target);
    }
    removeEventListener(){
        this.peh.removeEventListener(this.target);
    }
    ondown=(event)=>{
        let wc = this.active();
        let dl = wc.drawLayer;
        let x = event.x - wc.offsetLeft - dl.x + window.scrollX;
        let y = event.y - wc.offsetTop - dl.y + window.scrollY;
        console.log('editor-ondown',this.active(),x,y);
    }
    // onmove=(event)=>{console.log('editor-onmove',this.active());}
    // onup=(event)=>{console.log('editor-onup',this.active());}



    
}
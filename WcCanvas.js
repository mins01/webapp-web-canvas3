import WcLayer from "./WcLayer.js";

class WcCanvas extends WcLayer{
    static counter = 0;

    constructor(w=null,h=null){
        super(w,h);
        this.id =  'wc-canvas-'+(this.constructor.counter++);
        this.wcLayers = [];
        this.activeIndex = -1;
        this.wcCanvas = this;
        this.syncing = false;

        this.drawLayer = new WcLayer(w,h);
        this.drawLayer.wcCanvas = this;

        this.init();
    }

    init(){
        this.add(new WcLayer(this.width,this.height));
        this.draw()
    }
    active(index=null){
        if(index==null){
            index = this.activeIndex;
        }else{
            this.activeIndex = index;
        }
        let activeLayer = this.wcLayers[index]??null;
        if(activeLayer){
            this.drawLayer.x = activeLayer.x;
            this.drawLayer.y = activeLayer.y;
            this.drawLayer.width = activeLayer.width;
            this.drawLayer.height = activeLayer.height;
        }
        

        return activeLayer??null;
    }
    add(wcLayer){
        if(this.activeIndex < 0){
            this.wcLayers.push(wcLayer);
            // this.activeIndex = 0;
            this.active(0)
        }else{
            this.wcLayers.splice(this.activeIndex+1,0,wcLayer);
            // this.activeIndex++;
            this.active(this.activeIndex+1)
        }
        wcLayer.wcCanvas = this;
        this.draw()
        return true;
    }
    order(index){
        index = Math.min(Math.max(0,index),this.wcLayers.length-1);
        if(index === this.activeIndex){ return false; }
        const activeLayer = this.active();
        this.wcLayers[this.activeIndex] = this.wcLayers[index]
        this.wcLayers[index] = activeLayer;
        this.active(index)
        this.draw()
        return true;
    }
    remove(){
        if(this.wcLayers.length <= 1){
            console.warn('wcLayer를 제거할 수 없습니다. 최소 1개의 wcLayer가 있어야 합니다.');
            return false;
        }
        this.wcLayers.splice(this.activeIndex,1);
        this.activeIndex = Math.max(this.activeIndex-1,0);
        this.draw()
        return true;
    }
    sync(){
        if(!this.syncing){ 
            this.syncing = !this.syncing;
            this.draw() 
            this.syncing = !this.syncing;
        }
    }
    // flush(){
    //     this.ctxUpdatedAtTime = Date.now();
    //     // console.log('ctxUpdatedAtTime',this.ctxUpdatedAtTime);
    //     this.sync();
    // }
    draw(){
        this.clear()
        this.ctx.save();
        this.wcLayers.forEach((wcLayer,index)=>{
            this.ctx.globalCompositeOperation = wcLayer.compositeOperation
            this.ctx.globalAlpha = wcLayer.alpha
            this.ctxCommand('drawImage',wcLayer, wcLayer.x, wcLayer.y, wcLayer.width, wcLayer.height);

            if(index == this.activeIndex){
                this.ctx.globalCompositeOperation = wcLayer.compositeOperation
                this.ctx.globalAlpha = wcLayer.alpha
                this.ctxCommand('drawImage',this.drawLayer, this.drawLayer.x, this.drawLayer.y, this.drawLayer.width, this.drawLayer.height);
            }
        })
        this.ctx.restore()
    }

}

export default WcCanvas;
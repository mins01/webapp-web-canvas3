import Canvas from "./Canvas.js";

export default class Document extends Canvas{
    static counter = 0;

    constructor(w=null,h=null){
        super(w,h);
        this.id =  'wc-document-'+(this.constructor.counter++);
        this.layers = [];
        this.activeIndex = -1;
        this.document = this;
        this.syncing = false;

        this.drawLayer = new Canvas(w,h);
        this.drawLayer.document = this;

        this.init();
    }

    init(){
        this.add(new Canvas(this.width,this.height));
        this.draw()
    }
    active(index=null){
        let activeLayer = null;
        if(index===null){
            index = this.activeIndex;
            activeLayer = this.layers[index]??null;
        }else{
            this.activeIndex = index;
            activeLayer = this.layers[index]??null;
            if(activeLayer){
                this.drawLayer.x = activeLayer.x;
                this.drawLayer.y = activeLayer.y;
                this.drawLayer.width = activeLayer.width;
                this.drawLayer.height = activeLayer.height;
            }
        }
        
        
        this.draw()
        return activeLayer??null;
    }
    add(wcLayer){
        if(this.activeIndex < 0){
            this.layers.push(wcLayer);
            // this.activeIndex = 0;
            this.active(0)
        }else{
            this.layers.splice(this.activeIndex+1,0,wcLayer);
            // this.activeIndex++;
            this.active(this.activeIndex+1)
        }
        wcLayer.document = this;
        this.sync()
        return true;
    }
    order(index){
        index = Math.min(Math.max(0,index),this.layers.length-1);
        if(index === this.activeIndex){ return false; }
        const activeLayer = this.active();
        this.layers[this.activeIndex] = this.layers[index]
        this.layers[index] = activeLayer;
        this.active(index)
        this.sync()
        return true;
    }
    remove(){
        if(this.layers.length <= 1){
            console.warn('layer를 제거할 수 없습니다. 최소 1개의 wcLayer가 있어야 합니다.');
            return false;
        }
        this.layers.splice(this.activeIndex,1);
        this.activeIndex = Math.max(this.activeIndex-1,0);
        this.sync()
        return true;
    }
    sync(){
        this.draw();
    }
    apply(){
        // this.active().ctxCommand('drawImage',this.drawLayer,0,0,100,100);
        this.active().ctxCommand('drawImage',this.drawLayer, 0, 0, this.drawLayer.width, this.drawLayer.height);
        // this.active().flush();
        this.drawLayer.clear();
        this.sync();        
    }
    // flush(){
    //     this.ctxUpdatedAtTime = Date.now();
    //     // console.log('ctxUpdatedAtTime',this.ctxUpdatedAtTime);
    //     this.sync();
    // }
    draw(){
        this.clear()
        this.ctx.save();
        this.layers.forEach((wcLayer,index)=>{
            this.ctx.globalCompositeOperation = wcLayer.compositeOperation
            this.ctx.globalAlpha = wcLayer.alpha
            this.ctxCommand('drawImage',wcLayer, wcLayer.x, wcLayer.y, wcLayer.width, wcLayer.height);

            if(index == this.activeIndex){
                // this.ctx.globalCompositeOperation = 'source-over'
                // this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = wcLayer.compositeOperation
                this.ctx.globalAlpha = wcLayer.alpha
                this.ctxCommand('drawImage',this.drawLayer, this.drawLayer.x, this.drawLayer.y, this.drawLayer.width, this.drawLayer.height);
            }
        })
        this.ctx.restore()
    }

}
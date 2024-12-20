import NamedSelectableArray from "../libs/NamedSelectableArray.js";
import Canvas from "./Canvas.js";

export default class Document extends Canvas{
    static counter = 0;

    constructor(w=null,h=null){
        super(w,h);
        this.id =  'wc-document-'+(this.constructor.counter++);
        this.layers = new NamedSelectableArray('layer');
        this.document = this;
        this.syncing = false;
        this.drawLayer = new Canvas(w,h);
        this.drawLayer.document = this;

        this.init();
    }

    init(){
        this.add(new Canvas(this.width,this.height));
        // this.select(0);
        this.draw()
    }
    select(index=null){
        const activeLayer = this.layers.select(index);
        if(index !== null && activeLayer){
            this.syncDrawLayer(activeLayer);
        }
        return activeLayer;
    }
    // active(index=null){
    //     alert('active');
    //     return this.select(index);
    // }
    add(layer){
        layer.document = this;
        this.layers.add(layer);
        this.syncDrawLayer(layer);
        this.sync()
        return true;
    }
    remove(){
        this.layers.remove();
        this.syncDrawLayer(this.layers.layer);
        this.sync()
        return true;
    }
    move(index){
        this.layers.move(index);
        this.sync()
        return true;
    }

    syncDrawLayer(layer){
        this.drawLayer.x = layer.x;
        this.drawLayer.y = layer.y;
        this.drawLayer.width = layer.width;
        this.drawLayer.height = layer.height;
    }
    sync(){
        this.draw();
    }
    apply(){
        // console.log(this.layers.layer);
        this.layers.layer.ctxCommand('drawImage',this.drawLayer, 0, 0, this.drawLayer.width, this.drawLayer.height);        
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
        this.layers.all().forEach((wcLayer,index)=>{
            this.ctx.globalCompositeOperation = wcLayer.compositeOperation
            this.ctx.globalAlpha = wcLayer.alpha
            this.ctxCommand('drawImage',wcLayer, wcLayer.x, wcLayer.y, wcLayer.width, wcLayer.height);

            if(index == this.layers.selectedIndex){
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
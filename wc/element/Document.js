import NamedSelectableArray from "../lib/NamedSelectableArray.js";
import SelectableArray from "../lib/SelectableArray.js";
import Canvas from "./Canvas.js";
import Layer from "./Layer.js";

export default class Document extends Layer{
    static counter = 0;

    constructor(w=null,h=null){
        super(w,h);
        this.id =  'wc-document-'+(this.constructor.counter++);
        this.layers = new SelectableArray();
        this.parent = null;
        this.syncing = false;
        this.drawLayer = new Layer(w,h);
        this.drawLayer.parent = this;
        this.drawLayer.setContext2D({"alpha":true,"antialias":true,"depth":true,"willReadFrequently": true,})

        this.init();
    }
    static defineCustomElements(name='wc-document'){
        super.defineCustomElements(name);
    }

    init(){
        this.add(new Layer(this.width,this.height));
        // this.select(0);
        this.draw()
    }


    get layer(){ return this.layers.selected; }

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
        layer.parent = this;
        this.layers.add(layer);
        this.syncDrawLayer(layer);
        this.draw();
        return true;
    }
    remove(){
        this.layers.remove();
        this.syncDrawLayer(this.layer);
        this.draw();
        return true;
    }
    move(index){
        this.layers.move(index);
        this.draw();
        return true;
    }

    syncDrawLayer(layer=null){
        if(!layer) layer = this.layer
        if(!layer) return;
        this.drawLayer.x = layer.x;
        this.drawLayer.y = layer.y;
        this.drawLayer.width = layer.width;
        this.drawLayer.height = layer.height;
    }
    ready(){
        this.syncDrawLayer();
        this.sync();
    }
    sync(){
        this.flush();
        this.draw();
        this.parentSync();
    }
    apply(){
        // console.log(this.layer);
        // this.layer.ctxCommand('drawImage',this.drawLayer, 0, 0, this.drawLayer.width, this.drawLayer.height);        
        this.sync();
        this.syncDrawLayer();
    }
    flush(){
        if(this.layers){
            this.ctxUpdatedAtTime = Math.max(... this.layers.map((layer)=>{ return layer.ctxUpdatedAtTime; }))
        }else{
            this.ctxUpdatedAtTime = Date.now();
        }
    }
    draw(){
        this.clear()       
        this.ctx.save();
        this.layers.forEach((layer,index)=>{
            this.ctx.globalCompositeOperation = layer.compositeOperation
            this.ctx.globalAlpha = layer.alpha
            this.ctxCommand('drawImage',layer, layer.x, layer.y, layer.width, layer.height);

            if(index == this.layers.selectedIndex){
                // this.ctx.globalCompositeOperation = 'source-over'
                // this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = layer.compositeOperation
                this.ctx.globalAlpha = layer.alpha
                this.ctxCommand('drawImage',this.drawLayer, this.drawLayer.x, this.drawLayer.y, this.drawLayer.width, this.drawLayer.height);
            }
        })
        this.ctx.restore()
    }

}
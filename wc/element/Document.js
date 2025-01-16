import NamedSelectableArray from "../lib/NamedSelectableArray.js";
// import SelectableArray from "../lib/SelectableArray.js";
import Layers from "./Document/Layers.js";
import History from "./Document/History.js";
import Canvas from "./Canvas.js";
import Layer from "./Layer.js";
import Context2dUtil from "../lib/Context2dUtil.js";

export default class Document extends Layer{
    static get keys(){
        return super.keys.concat(['layers'])
    }

    layers = null;
    history = null;
    drawLayer = null;
    editor = null;
    constructor(w=null,h=null){
        super(w,h);
        // this.layers = new SelectableArray();
        this.layers = new Layers()
        this.history = new History(this,5);
        this.layers.document = this;
        this.parent = null;
        // this.syncing = false;
        this.drawLayer = new Layer(w,h);
        this.drawLayer.parent = this;
        // this.drawLayer.setContext2d()

        this.editor = null;

        this.init();
    }
    static defineCustomElements(name='wc-document'){
        super.defineCustomElements(name);
    }

    init(){
        this.add(new Layer(this.width,this.height));
        // this.select(0);
        this.flush()
    }


    get layer(){ return this.layers.selected; }

    select(index=null){
        const activeLayer = this.layers.select(index);
        if(index !== null && activeLayer){
            this.syncDrawLayer(activeLayer);
            this?.editor?.onselectLayer(this.layer);
        }
        return activeLayer;
    }
    // active(index=null){
    //     alert('active');
    //     return this.select(index);
    // }
    add(layer){
        return this.layers.add(layer);
    }
    remove(){
        return this.layers.remove();
    }
    move(index){
        return this.layers.move(index);
        // this.flush();
        // this?.editor?.onselectLayer(this.layer);
        // return true;
    }

    setContextConfig(conf){
        this.layer?.setContextConfig(conf);
        // this.layer?.flush();
        this.layer?.draw();
        this.drawLayer?.setContextConfig(conf);
        this.drawLayer?.draw();
        // this.drawLayer?.flush();
        this.flush();
    }
    setTextConfig(conf){
        if(this?.layer?.textConfig){
            this.layer?.setTextConfig(conf);
            // this.layer?.flush();
            this.layer?.draw();
        }
        if(this?.drawLayer?.textConfig){
            this.drawLayer?.setTextConfig(conf);
            // this.drawLayer?.flush();
            this.drawLayer?.draw();
        }
        this.flush();
    }

    syncDrawLayer(layer=null){
        if(!layer) layer = this.layer
        if(!layer) return;
        this.drawLayer.left = layer.left;
        this.drawLayer.top = layer.top;
        this.drawLayer.width = layer.width;
        this.drawLayer.height = layer.height;
    }
    ready(){
        this.syncDrawLayer();
        this.sync();
    }

    apply(){
        // console.log(this.layer);
        // this.layer.ctx.drawImage(this.drawLayer, 0, 0, this.drawLayer.width, this.drawLayer.height);        
        this.sync();
        this.syncDrawLayer();
    }
    flush(){
        this?.editor?.onchangeDocument(this);
        super.flush();
    }
    draw(){
        this.ctx.save();
        this.ctx.clearRect(0,0,this.width,this.height);
        this.layers.forEach((layer,index)=>{
            this.ctx.globalCompositeOperation = layer.compositeOperation
            this.ctx.globalAlpha = layer.alpha
            this.ctx.drawImage(layer, layer.left, layer.top, layer.width, layer.height);

            if(index == this.layers.selectedIndex){
                // this.ctx.globalCompositeOperation = 'source-over'
                // this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = layer.compositeOperation
                this.ctx.globalAlpha = layer.alpha
                this.ctx.drawImage(this.drawLayer, this.drawLayer.left, this.drawLayer.top, this.drawLayer.width, this.drawLayer.height);
            }
        })
        this.ctx.restore()
    }

}
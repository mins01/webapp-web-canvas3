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
    frame = null;
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
    get left(){ return super.left; }
    get top(){ return super.top; }
    set left(v){ super.left = v; this.style.left=`${this.left}px` }
    set top(v){ super.top = v;  this.style.top=`${this.top}px` }

    init(){
        this.classList.add('wc-document')
        this.add(new Layer(this.width,this.height));
        this.flush()

        this.frame = this.closest('.wc-frame')??null;
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
        this.drawLayer.zoom = layer.zoom;
        this.drawLayer.angle = layer.angle;
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
        const ctx = this.ctx;
        ctx.save();
        ctx.clearRect(0,0,this.width,this.height);
        this.layers.forEach((layer,index)=>{
            // const ctx = layer.ctx;

            ctx.save();
            ctx.globalCompositeOperation = layer.compositeOperation
            ctx.globalAlpha = layer.alpha
            ctx.translate(layer.left, layer.top)
            if(layer.zoom !== 1){ ctx.scale(layer.zoom,layer.zoom); }
            ctx.translate(layer.width/2, layer.height/2)
            if(layer.angle !== 0){ ctx.rotate(layer.angle * Math.PI); }
            ctx.translate(-layer.width/2, -layer.height/2)
            if(layer.visible){
                // ctx.drawImage(layer, -layer.width/2, -layer.height/2, layer.width, layer.height);
                ctx.drawImage(layer, 0, 0, layer.width, layer.height);
            }            
            ctx.translate(-layer.left, -layer.top)
            
            
            ctx.restore()

            if(index == this.layers.selectedIndex){
                ctx.save();
                ctx.globalCompositeOperation = layer.compositeOperation
                ctx.globalAlpha = layer.alpha
                ctx.translate(layer.left, layer.top)
                ctx.translate(layer.width/2, layer.height/2)
                // ctx.translate(layer.left, layer.top)
                if(layer.zoom !== 1){ ctx.scale(layer.zoom,layer.zoom); }
                if(layer.angle !== 0){ ctx.rotate(layer.angle * Math.PI); }
                ctx.drawImage(this.drawLayer, -layer.width/2, -layer.height/2, layer.width, layer.height);                
                ctx.translate(-layer.width/2, -layer.height/2)

                ctx.restore()
            }
        })
        ctx.restore()
        this.style.zoom = this.zoom;
        this.style.transform = `rotate(${this.angle*Math.PI}rad)`;
        // this.style.transform = `scale(${this.zoom}) rotate(${this.angle*Math.PI}rad)`;
    }

}
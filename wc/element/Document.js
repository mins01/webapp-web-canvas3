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
    }


    get layer(){ return this.layers.selected; }

    select(index=null){
        return this.layers.select(index);
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
    readyTool(){ // 툴을 사용할 준비
        this.drawLayer.clear();
        this.syncDrawLayer();
        this.sync();
    }
    readyLayer(){ // 레이어 변화후 준비 처리
        console.log('Document.readyLayer()')
        this.syncDrawLayer();
        this.editor?.readyLayer();
    }
    
    ready(){ // 문서를 사용할 준비. 레이어의 순서 등이 바뀌면.
        this.readyLayer();
    }

    
    /** Description placeholder
     * 
     * @deprecated 대신 readyTool()를 하자. 
     */
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
        const drawLayer = this.drawLayer;
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
                ctx.drawImage(layer, 0, 0, layer.width, layer.height);
                if(index == this.layers.selectedIndex){
                    ctx.drawImage(drawLayer, 0, 0, layer.width, layer.height);
                }
            }
            ctx.translate(-layer.left, -layer.top)


            ctx.restore()

            // if(index == this.layers.selectedIndex){
            //     ctx.save();
            //     ctx.globalCompositeOperation = layer.compositeOperation
            //     ctx.globalAlpha = layer.alpha
            //     ctx.translate(layer.left, layer.top)
            //     if(layer.zoom !== 1){ ctx.scale(layer.zoom,layer.zoom); }
            //     ctx.translate(layer.width/2, layer.height/2)
            //     if(layer.angle !== 0){ ctx.rotate(layer.angle * Math.PI); }
            //     ctx.translate(-layer.width/2, -layer.height/2)

            //     ctx.translate(-layer.left, -layer.top)

            //     ctx.restore()
            // }
        })
        ctx.restore()
        this.style.zoom = this.zoom;
        this.style.transform = `rotate(${this.angle*Math.PI}rad)`;
        // this.style.transform = `scale(${this.zoom}) rotate(${this.angle*Math.PI}rad)`;
    }

}
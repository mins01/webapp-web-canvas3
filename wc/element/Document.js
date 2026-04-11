import NamedSelectableArray from "../lib/NamedSelectableArray.js";
// import SelectableArray from "../lib/SelectableArray.js";
import Layers from "./Document/Layers.js";
import History from "./Document/History.js";
import Canvas from "./Canvas.js";
import Layer from "./Layer.js";
import Context2dUtil from "../lib/Context2dUtil.js";
import LayerKind from "../lib/LayerKind.js";

export default class Document extends Layer{
    static get keys(){
        return super.keys.concat(['layers'])
    }

    kind = LayerKind.GROUP;
    layers = null;
    history = null;
    drawingLayer = null; // 부가적인 내용을 그리는 레이어. 20260307 현재 사용 안되는 듯.
    editor = null;
    stage = null;
    wrapper = null;
    selectionLayer = null;

    constructor(w=null,h=null){
        super(w,h);

        const d = new Date();
        const rand = (Math.floor(Math.random()*1000000)).toString().padStart(6,'0');
        this.name = 'Document-'+[ d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), ].map(v=>{return v.toString().padStart(2,0)}).join('')+'-'+rand;

        // this.layers = new SelectableArray();
        this.layers = new Layers()
        this.history = new History(this,20);
        this.layers.document = this;
        this.parent = null;
        // this.syncing = false;
        this.drawingLayer = new Layer(w,h);
        this.drawingLayer.parent = this;
        // this.drawingLayer.setContext2d()

        this.editor = null;

        this.init();
    }
    static defineCustomElements(name='wc-document'){
        super.defineCustomElements(name);
    }
    
    getLocalRect() {  return new DOMRect( this.left, this.top, this.width, this.height) }
    getViewportRect() { 
        const rect = this.getBoundingClientRect();
        const bounds = {
            left:rect.left + rect.width / 2 - this.width / 2,
            top:rect.top + rect.height / 2 - this.height / 2,
            width:this.width,
            height:this.height,
        }
        return new DOMRect( bounds.left , bounds.top, bounds.width, bounds.height);
    }
    getPageRect() { 
        const rect = this.getBoundingClientRect();
        const bounds = {
            left:rect.left + rect.width / 2 - this.width / 2,
            top:rect.top + rect.height / 2 - this.height / 2,
            width:this.width,
            height:this.height,
        }
        return new DOMRect( bounds.left + window.scrollX , bounds.top + window.scrollY, bounds.width, bounds.height);
    }


    init(){
        this.classList.add('wc-document')
        this.add(new Layer(this.width,this.height));
        this.flush()
    }

    // 연결된 요소들 정리
    dispose(){       
        
        this.layers.forEach(layer=>{ layer.remove(); }); //레이어들 해제
        this.layers.document = null;
        this.layers = null;
        this.history = null;
        this.parent = null;
        this.drawingLayer.parent = null;
        this.drawingLayer = null;
        this.editor = null;

        console.log('document.dispose()');
    }

    get layer(){ return this.layers.selected; }

    select(index=null){
        return this.layers.select(index);
    }
    // active(index=null){
    //     alert('active');
    //     return this.select(index);
    // }
    add(layer,withoutHistory=false){
        return this.layers.add(layer,withoutHistory);
    }
    addEmptyLayer(){
        const layer = new Layer(this.width,this.height)
        this.add(layer);
        return layer;
    }
    remove(){
        return this.layers.remove();
    }
    move(index){
        return this.layers.move(index);
    }

    setContextConfig(conf){
        this.layer?.setContextConfig(conf);
        // this.layer?.flush();
        this.layer?.draw();
        this.drawingLayer?.setContextConfig(conf);
        this.drawingLayer?.draw();
        // this.drawingLayer?.flush();
        this.flush();
    }
    setTextConfig(conf){
        if(this?.layer?.textConfig){
            this.layer?.setTextConfig(conf);
            // this.layer?.flush();
            this.layer?.draw();
        }
        if(this?.drawingLayer?.textConfig){
            this.drawingLayer?.setTextConfig(conf);
            this.drawingLayer?.draw();
        }
        this.flush();
    }

    ready(){
        console.log('Document.ready()');
        // ready 할 동작이 있다면 이곳에 적자.
    }
    
    scheduled = false;
    flush() {
        if (this.scheduled) return;
        this.scheduled = true;

        queueMicrotask(() => { // document.flush는 tick 동안 최종 한번만 flush 하게한다.
            this.scheduledFlush();
        });
    }

    scheduledFlush() {
        this.scheduled = false;

        this?.editor?.onchangeDocument(this);
        super.flush();
        console.log('document.scheduledFlush');
    }


    draw(){
        // console.log('Document.draw()'); //너무 많이 나온다.
        const ctx = this.ctx;
        const drawingLayer = this.drawingLayer;
        ctx.save();
        ctx.clearRect(0,0,this.width,this.height);
        this.layers.forEach((layer,index)=>{
            // const ctx = layer.ctx;
            
            const targetLayer = layer

            if(targetLayer.visibleByTool){
                this.drawLayerTo(targetLayer);
            }

            if(index == this.layers.selectedIndex){
                const targetLayer = drawingLayer
                if(targetLayer.visibleByTool){
                    this.drawLayerTo(targetLayer);
                }    
            }

        })
        ctx.restore()
        // this.style.zoom = this.zoom;

        if(this.wrapper){
            this.wrapper.style.setProperty('--width',this.width+'px');
            this.wrapper.style.setProperty('--height',this.height+'px');
            this.wrapper.style.setProperty('--zoom',this.zoom);
            this.wrapper.style.setProperty('--angle',this.angle+'deg');
            this.wrapper.style.setProperty('--left',this.left+'px');
            this.wrapper.style.setProperty('--top',this.top+'px');
        }
        super.draw();
    }

    resize(width,height){
        this.width = width;
        this.height = height;
        this.flush();
        this?.selectionLayer?.resize(this.width,this.height)
        this?.selectionLayer?.flush();
        this.history.save();
    }

    
    /**
     * Description placeholder
     *
     * @static
     * @param {HTMLImageElement|HTMLCanvasElement} image 
     */
    static fromImage(image){
        const c = new this(image.width,image.height);
        c.layer.ctx.drawImage(image, 0, 0, image.width, image.height);
        c.history.clear();
        c.history.save();
        return c;
    }


    
}
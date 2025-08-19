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
    drawingLayer = null;
    editor = null;
    frame = null;
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
    get left(){ return super.left; }
    get top(){ return super.top; }
    set left(v){ super.left = v; this.style.left=`${this.left}px` }
    set top(v){ super.top = v;  this.style.top=`${this.top}px` }

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

    syncDrawingLayer(layer=null){
        return false; // 더 이상 쓰지 말자
        if(!layer) layer = this.layer
        if(!layer) return;
        this.drawingLayer.alpha = layer.alpha;
        this.drawingLayer.left = layer.left;
        this.drawingLayer.top = layer.top;
        this.drawingLayer.width = layer.width;
        this.drawingLayer.height = layer.height;
        this.drawingLayer.zoom = layer.zoom;
        this.drawingLayer.angle = layer.angle;
    }


    ready(){
        console.log('Document.ready()');
        // ready 할 동작이 있다면 이곳에 적자.
    }
    
    flush(){
        this?.editor?.onchangeDocument(this);
        super.flush();
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
                this.drawLayer(targetLayer);
            }

            if(index == this.layers.selectedIndex){
                const targetLayer = drawingLayer
                if(targetLayer.visibleByTool){
                    this.drawLayer(targetLayer);
                }    
            }

        })
        ctx.restore()
        // this.style.zoom = this.zoom;

        this.style.setProperty('--width',this.width+'px');
        this.style.setProperty('--height',this.height+'px');
        this.style.setProperty('--zoom',this.zoom);
        this.style.setProperty('--angle',this.angle+'deg');
        this.style.setProperty('--left',this.left+'px');
        this.style.setProperty('--top',this.top+'px');
    }

    resize(width,height){
        this.width = width;
        this.height = height;
        this.flush();
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
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
    drawLayer = null;
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
        this.drawLayer.alpha = layer.alpha;
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
            
            let targetLayer = layer

            ctx.save();
            ctx.globalCompositeOperation = targetLayer.compositeOperation
            ctx.globalAlpha = targetLayer.alpha
            ctx.translate(targetLayer.left, targetLayer.top)
            if(targetLayer.zoom !== 1){
                ctx.scale(targetLayer.zoom,targetLayer.zoom); 
            }
            ctx.translate(targetLayer.width/2, targetLayer.height/2)
            ctx.scale(targetLayer.flipX,targetLayer.flipY);
            if(targetLayer.angle !== 0){ ctx.rotate(targetLayer.angle * Math.PI / 180); }
            ctx.translate(-targetLayer.width/2, -targetLayer.height/2)
            if(targetLayer.visible && targetLayer.visibleByTool && targetLayer.width && targetLayer.height){
                
                ctx.drawImage(targetLayer, 0, 0, targetLayer.width, targetLayer.height);
            }
            ctx.translate(-targetLayer.left, -targetLayer.top)
            ctx.restore()


            if(index == this.layers.selectedIndex){
                targetLayer = drawLayer

                ctx.save();
                ctx.globalCompositeOperation = targetLayer.compositeOperation
                ctx.globalAlpha = targetLayer.alpha
                ctx.translate(targetLayer.left, targetLayer.top)
                if(targetLayer.zoom !== 1){ ctx.scale(targetLayer.zoom,targetLayer.zoom); }
                ctx.translate(targetLayer.width/2, targetLayer.height/2)
                if(targetLayer.angle !== 0){ ctx.rotate(targetLayer.angle * Math.PI / 180); }
                ctx.translate(-targetLayer.width/2, -targetLayer.height/2)
                if(targetLayer.visible && targetLayer.visibleByTool && targetLayer.width && targetLayer.height){
                    ctx.drawImage(targetLayer, 0, 0, targetLayer.width, targetLayer.height);
                }
                ctx.translate(-targetLayer.left, -targetLayer.top)
                ctx.restore()                
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
     * @param {Function} callback 
     * @param {string} type 
     * @param {any} quality 
     */
    toBlob(callback, type, quality){
        if(type==='wc3.json' || type=== 'application/json'){
            this.toBlobJson(callback, type, quality);
        }else{
            super.toBlob(...arguments)
        }
    }

    toBlobJson(callback, type, quality){
        const blob = new Blob([JSON.stringify(this.export(),null,4)])
        callback(blob);
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
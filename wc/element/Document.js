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


    get layer(){ return this.layers.selected; }

    select(index=null){
        return this.layers.select(index);
        const activeLayer = this.layers.select(index);
        if(index !== null && activeLayer){
            this.syncDrawingLayer(activeLayer);
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
            // this.drawingLayer?.flush();
            this.drawingLayer?.draw();
        }
        this.flush();
    }

    syncDrawingLayer(layer=null){
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


    ready(){ // 문서를 사용할 준비. 레이어의 순서 등이 바뀌면.
        console.log('Document.ready()');
        this.readyLayer();
        this?.editor?.ready();
    }

    readyTool(){ // 툴을 사용할 준비
        this.drawingLayer.clear();
        this.syncDrawingLayer();
        this.sync();
    }
    readyLayer(){ // 레이어 변화후 준비 처리
        this.syncDrawingLayer();       
    }
    
    

    
    /** Description placeholder
     * 
     * @deprecated 대신 readyTool()를 하자. 
     */
    apply(){
        // console.log(this.layer);
        // this.layer.ctx.drawImage(this.drawingLayer, 0, 0, this.drawingLayer.width, this.drawingLayer.height);
        this.sync();
        this.syncDrawingLayer();
    }
    flush(){
        this?.editor?.onchangeDocument(this);
        super.flush();
    }
    draw(){
        const ctx = this.ctx;
        const drawingLayer = this.drawingLayer;
        ctx.save();
        ctx.clearRect(0,0,this.width,this.height);
        this.layers.forEach((layer,index)=>{
            // const ctx = layer.ctx;
            
            let targetLayer = layer
            // if(index == this.layers.selectedIndex){ // 이 방법 너무 느림!
            //     const parenttLayer = layer.clone();
            //     targetLayer = drawingLayer;
            //     const ctx = parenttLayer.ctx;
            //     ctx.save();
            //     ctx.globalCompositeOperation = targetLayer.compositeOperation
            //     // ctx.globalAlpha = targetLayer.alpha //alpha는 무시한다 layer에 종속적으로 동작해야하기 때문
            //     ctx.translate(targetLayer.left, targetLayer.top)
            //     if(targetLayer.zoom !== 1){ ctx.scale(targetLayer.zoom,targetLayer.zoom); }
            //     ctx.translate(targetLayer.width/2, targetLayer.height/2)
            //     if(targetLayer.angle !== 0){ ctx.rotate(targetLayer.angle * Math.PI / 180); }
            //     ctx.translate(-targetLayer.width/2, -targetLayer.height/2)
            //     if(targetLayer.visible && targetLayer.visibleByTool && targetLayer.width && targetLayer.height){
            //         ctx.drawImage(targetLayer, 0, 0, targetLayer.width, targetLayer.height);
            //     }
            //     ctx.translate(-targetLayer.left, -targetLayer.top)
            //     ctx.restore()
            //     targetLayer = parenttLayer;
            // }

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
                const targetLayer = drawingLayer

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
    toBlob(callback, type = 'image/png', quality = 1.0){
        if(type==='wc3.json' || type=== 'application/json'){
            this.toBlobJson(callback, type, quality);
        }else{
            super.toBlob(...arguments)
        }
    }

    toBlobJson(callback, type = 'image/png', quality = 1.0){
        const blob = new Blob([JSON.stringify(this.export(),null,4)],{ type })
        callback(blob);
    }

    toBlobJsonAsync(type, quality){
        return new Promise((resolve, reject) => {
            this.toBlobJson(blob => {
                if (blob) { resolve(blob); } 
                else { reject(new Error('Error toBlob')); }
            }, type, quality);
        });
    }

    toBlobAsync(type = 'image/png', quality = 1.0){
        if(type==='wc3.json' || type=== 'application/json'){
            return this.toBlobJsonAsync(...arguments);
        }else{
            return super.toBlobAsync(...arguments)
        }
        return null;
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
import BaseConfig from "../lib/BaseConfig.js";
import Context2dConfig from "../lib/Context2dConfig.js";
import Context2dUtil from "../lib/Context2dUtil.js";
import HtmlUtil from "../lib/HtmlUtil.js";

class Canvas extends HTMLCanvasElement{
    static context2dOptions = {"alpha":true,"antialias":true,"depth":true,"willReadFrequently": false,};

    static get keys(){
        return ['name', 'width', 'height', 'drawable', 'label', 'contextConfig', 'createdAt','updatedAt',];
    }
    // static get observedAttributes() { return ['width', 'height']; }

    static getIdCounter(){
        if(Canvas._idCounter === undefined){ Canvas._idCounter = 0;}
        return ++ Canvas._idCounter;
    }
    static defineCustomElements(name='wc-canvas'){
        if(!globalThis.window){return;}
        window.customElements.define(name, this,{ extends: "canvas" });
        console.log('namenamename',name);
    }
    static getDefaultName(prefix){
        const rand = (Math.floor(Math.random()*1000000)).toString().padStart(6,'0');
        return `${prefix}-${rand}`;
    }


    name = null;
    ctx = null;
    drawable = true;
    // #left;
    // #top;
    constructor(w=null,h=null){
        super();

        this.drawable = true; // 그리기 가능한가? 그리기 툴에서 체크.

        const rand = (Math.floor(Math.random()*1000000)).toString().padStart(6,'0');
        if(this.id === undefined || this.id === '') this.id =  'wc-'+this.constructor.name.toLocaleLowerCase()+'-'+this.constructor.getIdCounter()+'-'+rand;
        
        const d = new Date();
        // this.name = [ d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), ].map(v=>{return v.toString().padStart(2,0)}).join('')+'-'+rand;
        // this.name = `Canvas-${Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}`;
        this.name = this.constructor.getDefaultName(this.constructor.name);


        this.label = "created at "+(d).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');
        this.contextConfig = new Context2dConfig();

        Object.defineProperty(this,'ctx',{ enumerable: false, configurable: true, writable: true, value: null, })
        Object.defineProperty(this, 'parent', { enumerable: false, configurable: true, writable: true, value: null, })
        // this.parent = null

        this.updatedAt = this.createdAt = Date.now();
        this.setContext2d();

        if(w && w != this.width) this.width = w;
        if(h && h != this.height) this.height = h;
    }







    connectedCallback(){

    }
    disconnectedCallback(){

    }
    adoptedCallback(){

    }
    attributeChangedCallback(name, oldValue, newValue){
        // console.log(...arguments);
        // this.flush()
    }

    setContext2d(options=Canvas.context2dOptions){
        this.ctx = this.getContext2d(options)
        return this.ctx;
    }
    getContext2d(options=Canvas.context2dOptions){
        return this.getContext('2d',options)
    }

    getContextConfig(){
        return this.contextConfig.toObject();
    }
    setContextConfig(conf){
        this.contextConfig.assignFrom(conf);
    }

    /**
     * @deprecated
     */
    ctxCommand(){
        let inArgs = [...arguments];
        const method = inArgs[0]??null;
        const args = (inArgs??[]).slice(1);
        // console.log(method,args,this);
        if (typeof this.ctx[method] === "function") {
            this.ctx[method].apply(this.ctx,args);
        }else{
            console.error('error: ctxCommand',inArgs);
        }
        // console.log(method);

    }

    draw(){ // 따로 그리기 동작이 있을 경우.
        // this.contextConfig.assignTo(ctx,true);
        this.dispatchEvent( new CustomEvent("draw", {bubbles:true,cancelable:true}) );
    }
    flush(){
        this.draw();
        this.updatedAt = Date.now();
        this.sync();
        this.dispatchEvent( new CustomEvent("flush", {bubbles:true,cancelable:true}) );
        // console.log('flush',this,this.updatedAt);
    }
    sync(){
        this.parentFlush();
    }

    parentFlush(){
        this?.parent?.flush();
    }

    fill(color){
        const ctx = this.ctx;
        this.ctx.save();
        ctx.fillStyle = color;
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.restore();
    }
    stroke(color,lineWidth=1){
        const ctx = this.ctx;
        this.ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(0,0,this.width,this.height);
        this.ctx.restore();
        console.log('stroke',color,lineWidth);
        
    }
    clear(){
        this.ctx.save();
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.restore();
    }


    clone(){
        const newCanvas = new this.constructor(this.width,this.height);
        newCanvas.import(this.snapshot())
        // newCanvas.import(this.export())
        // newCanvas.ctx.drawImage(this,0,0)
        newCanvas.name = newCanvas.name.substr(0,40)+' cloned'
        return newCanvas;
    }
    resize(width,height){
        const cloned = this.clone();
        this.width = width;
        this.height = height;
        this.ctx.drawImage(cloned, 0, 0, width, height);
    }



    toObject(){
        const r = {}
        this.constructor.keys.forEach((k)=>{
            r[k] = this[k];
        })
        return r;
    }
    toJSON(){
        return this.export();
    }

    export(){
        return this.constructor.export(this);
    }
    static export(obj){
        const r = obj.toObject();
        r.exportVersion = '20250115';
        r.__class__ = obj.constructor.name;
        r.dataUrl = obj.toDataURL('image/png')
        return r;
    }

    // 우선 쓰지말자. export 를 좀 더 개선후 보자.
    // async exportWithFile(){
    //     return await this.constructor.exportWithFile(this);
    // }
    // // dataUrl 대신 파일 객체로
    // static async exportWithFile(obj){
    //     const r = obj.toObject();
    //     r.exportVersion = '20250710';
    //     r.__class__ = obj.constructor.name;
    //     await obj.toBlob((blob)=>{ r.__file__ = new File([blob],`${obj.id}.png`,{ type: blob.type, lastModified: Date.now() }) },'image/png');
    //     return r;
    // }
    
    snapshot(){
        return this.constructor.snapshot(this);
    }
    static snapshot(obj){
        const ctx = obj.ctx;
        const r = obj.toObject();
        for(let k in r){ // 히스토리용이기 때문에 참고 값을 끊는 작업을 한다.
            if(r[k]?.toObject){r[k] = r[k].toObject()}
        }
        r.snapshotVersion = '20250116';
        r.__class__ = obj.constructor.name;
        r.imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        return r;
    }


    // async 비동기로 하지 말자. dataUrl이 있는 경우는 wc3.json으로 저장했을 때 뿐이다. 즉, 그 때 빼고는 전부 동기로 가능하다.
    static import(obj,conf){
        obj.constructor.keys.forEach((k)=>{
            if(conf?.[k] === undefined){return;}
            if(obj?.[k] === undefined){return;}
            if(obj[k]?.import !== undefined){
                obj[k].import(conf[k]);return;
            }
            obj[k] = conf[k];
        })

        if(conf?.imageData !== undefined){
            obj.ctx.putImageData(conf?.imageData, 0, 0);
            obj.flush();
        }else if(conf?.dataUrl !== undefined){
            HtmlUtil.loadImageUrl(conf.dataUrl).then((img)=>{
                obj.ctx.drawImage(img,0,0);
                obj.flush();
            }).catch((event)=>{
                console.log(event)
            })
        }else{
            obj.flush();
        }
    }
    import(conf){
        return this.constructor.import(this,conf);
    }

    static importFrom(conf){
        const c = new this()
        c.import(conf)
        return c;
    }

    /**
     * Description placeholder
     *
     * @static
     * @param {HTMLImageElement|HTMLCanvasElement} image 
     */
    static fromImage(image){
        const c = new this(image.width,image.height);
        c.ctx.drawImage(image, 0, 0, image.width, image.height);
        return c
    }



    toBlobAsync(type = 'image/png', quality = 1.0) {
        return new Promise((resolve, reject) => {
            this.toBlob(blob => {
                if (blob) { resolve(blob); } 
                else { reject(new Error('Error toBlob')); }
            }, type, quality);
        });
    }
}


export default Canvas;
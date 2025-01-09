import Context2dConfig from "../lib/Context2dConfig.js";


class Canvas extends HTMLCanvasElement{
    ctx = null;
    drawable = true;
    constructor(w=null,h=null,bgColor=null,label=null){
        super();

        this.drawable = true; // 그리기 가능한가? 그리기 툴에서 체크.
        this.id =  'wc-'+this.constructor.name.toLocaleLowerCase()+'-'+this.constructor.getIdCounter()+'-'+(Math.floor(Math.random()*1000000)).toString().padStart(6,'0');
        this.label = label??"created at "+(new Date()).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');
        this.contextConfig = new Context2dConfig();
        
        Object.defineProperty(this,'ctx',{ enumerable: false, configurable: true, writable: true, value: null, })

        
        this.ctxUpdatedAtTime = Date.now();
        
        this.setContext2D();
        this.parent = null

        if(w && w != this.width) this.width = w;
        if(h && h != this.height) this.height = h;

        if(bgColor) this.fill(bgColor)
        
    }
    
    static getIdCounter(){
        if(Canvas._idCounter === undefined){ Canvas._idCounter = 0;}
        return ++ Canvas._idCounter;
    }
    static defineCustomElements(name='wc-canvas'){
        if(!globalThis.window){return;}
        window.customElements.define(name, this,{ extends: "canvas" });
    }

    static get observedAttributes() { return ['width', 'height']; }

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


    get width(){       
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width');
        return desc.get.apply(this);
    }
    /**
     * @param {number} v
     */
    set width(v){
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width');
        let conf = this.getContextConfig();
        desc.set.apply(this,[v]); 
        this.setContextConfig(conf);
        // this.flush(); 
    }

    get height(){       
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'height');
        return desc.get.apply(this); 
    }
    /**
     * @param {number} v
     */
    set height(v){
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'height');
        let conf = this.getContextConfig();
        desc.set.apply(this,[v]); 
        this.setContextConfig(conf);
        // this.flush(); 
    }

    setContext2D(options={"alpha":true,"antialias":true,"depth":true,"willReadFrequently": true,}){
        this.ctx = this.getContext2D(options)
        return this.ctx;
    }
    getContext2D(options={"alpha":true,"antialias":true,"depth":true,"willReadFrequently": true,}){       
        return this.getContext('2d',options)
    }

    getContextConfig(){
        return this.contextConfig.toObject();
        // let keys = Object.keys(Object.getPrototypeOf(this.ctx));
        // let conf = {};
        // keys.forEach(key => {
        //     if(key==='canvas'){return;}
        //     if (typeof this.ctx[key] === 'function') {return;}
        //     conf[key] = this.ctx[key];
        // });
        // return conf
    }
    setContextConfig(conf){
        Object.assign(this.contextConfig,conf)
        Object.assign(this.ctx,conf)
        if(conf.backColor) this.ctx.fillStyle = conf.backColor;
        if(conf.foreColor) this.ctx.strokeStyle = conf.foreColor;
    }

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

    }
    flush(){
        this.draw();
        this.ctxUpdatedAtTime = Date.now();
        this.sync();
        // console.log('flush',this,this.ctxUpdatedAtTime);
    }
    sync(){
        this.parentFlush();
    }
    
    parentFlush(){
        this?.parent?.flush();
    }

    fill(color){
        const ctx = this.ctx;
        this.ctxCommand('save');
        ctx.fillStyle = color;
        // ctx.fillRect(0,0,this.width,this.height);
        this.ctxCommand('fillRect',0,0,this.width,this.height);
        this.ctxCommand('restore');
        // this.flush();
    }
    clear(){
        this.ctxCommand('save');
        this.ctxCommand('clearRect',0,0,this.width,this.height);
        this.ctxCommand('restore');
    }

    merge(canvas){
        const xmin = Math.min(this.x,canvas.x)
        const ymin = Math.min(this.y,canvas.y)
        const xmax = Math.max(this.x+this.width,canvas.x+canvas.width)
        const ymax = Math.max(this.y+this.height,canvas.y+canvas.height)
        const w = xmax-xmin;
        const h = ymax-ymin;

        
        const imageData = this.ctx.getImageData(0,0,this.width,this.height);
        let dx = this.x-xmin;
        let dy = this.y-ymin;
        
        this.x = xmin;
        this.y = ymin;
        this.width = w;
        this.height = h;
        // this.fill('#00ee0033');

        this.ctx.putImageData(imageData,dx,dy);

        dx = canvas.x-xmin;
        dy = canvas.y-ymin;
        this.ctxCommand('drawImage',canvas, dx, dy, canvas.width, canvas.height);        

        // this.flush();
    }
    clone(){
        const newCanvas = new this.constructor(this.width,this.height);
        Object.assign(newCanvas,this);
        newCanvas.label +=' cloned'
        // newCanvas.setContextConfig(this.getContextConfig());
        this.ctx.save();
        newCanvas.ctx.putImageData(this.ctx.getImageData(0,0,this.width,this.height),0,0);
        this.ctx.restore();
        return newCanvas;
    }
    resize(width,height){
        const cloned = this.clone();
        this.width = width;
        this.height = height;
        this.ctx.drawImage(cloned, 0, 0, width, height);
    }
}

// ['width','height'].forEach((v)=>{
// 	const d = Object.getOwnPropertyDescriptor(Canvas.prototype,v); d.enumerable=true; Object.defineProperty(Canvas.prototype,v,d);
// })




export default Canvas;
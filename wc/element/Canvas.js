// WcLayer를 wc/element/Canvas로 변경

export default class Canvas extends HTMLCanvasElement{
    static counter = 0;
    constructor(w=null,h=null,bgColor=null,label=null){
        super();
        this.id =  'wc-canvas-'+(this.constructor.counter++);
        this.label = label??"created at "+(new Date()).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');

        // this._x = 0;
        // this._y = 0;
        // this._compositeOperation = 'source-over';
        // this._alpha = 1;
        
        // this.compositeOperation = 'source-over';
        // this.alpha = 1;

        this.ctxUpdatedAtTime = Date.now();
        
        this.setContext2D();
        this.parent = null

        if(w) this.width = w;
        if(h) this.height = h;

        if(bgColor) this.fill(bgColor)
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
        let conf = this.getContextConf();
        desc.set.apply(this,[v]); 
        this.setContextConf(conf);
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
        let conf = this.getContextConf();
        desc.set.apply(this,[v]); 
        this.setContextConf(conf);
        // this.flush(); 
    }

    setContext2D(options={"alpha":true,"antialias":true,"depth":true,"willReadFrequently": true,}){
        this.ctx = this.getContext2D(options)
        return this.ctx;
    }
    getContext2D(options={"alpha":true,"antialias":true,"depth":true,"willReadFrequently": true,}){       
        return this.getContext('2d',options)
    }

    getContextConf(){
        let keys = Object.keys(Object.getPrototypeOf(this.ctx));
        let conf = {};
        keys.forEach(key => {
            if(key==='canvas'){return;}
            conf[key] = this.ctx[key];
        });
        return conf
    }
    setContextConf(conf){
        let keys = Object.keys(Object.getPrototypeOf(this.ctx));
        keys.forEach(key => {
            if(key==='canvas'){return;}
            this.ctx[key] = conf[key];
        });
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
        console.log('flush',this,this.ctxUpdatedAtTime);
    }
    sync(){
        this.parentFlush();
    }
    
    parentFlush(){
        if(this.parent && this.parent.flush) this.parent.flush();
    }

    fill(color){
        const ctx = this.ctx;
        this.ctxCommand('save');
        ctx.fillStyle = color;
        // ctx.fillRect(0,0,this.width,this.height);
        this.ctxCommand('fillRect',0,0,this.width,this.height);
        this.ctxCommand('restore');
        this.flush();
    }
    clear(){
        this.ctxCommand('save');
        this.ctxCommand('clearRect',0,0,this.width,this.height);
        this.ctxCommand('restore');
        this.flush();
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

        this.flush();
    }
}

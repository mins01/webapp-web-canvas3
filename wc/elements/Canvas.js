// WcLayer를 wc/elements/Canvas로 변경

export default class Canvas extends HTMLCanvasElement{
    static counter = 0;
    constructor(w=null,h=null,bgColor=null,label=null){
        super();
        this.id =  'wc-canvas-'+(this.constructor.counter++);
        this.label = label??"created at "+(new Date()).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');

        this._x = 0;
        this._y = 0;
        this._compositeOperation = 'source-over';
        this._alpha = 1;
        
        this.compositeOperation = 'source-over';
        this.alpha = 1;

        this.ctxUpdatedAtTime = Date.now();
        
        this.setContext2D();
        this.parent = null

        this.width = w??400;
        this.height = h??300;

        if(bgColor) this.fill(bgColor)
    }
    setContext2D(options={"alpha":true,"antialias":true,"depth":true}){
        this.ctx = this.getContext2D(options)
        return this.ctx;
    }
    getContext2D(options={"alpha":true,"antialias":true,"depth":true}){
        return this.getContext('2d',options)
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
    clear(color){
        this.ctxCommand('save');
        this.ctxCommand('clearRect',0,0,this.width,this.height);
        this.ctxCommand('restore');
        this.flush();
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
    flush(){
        this.ctxUpdatedAtTime = Date.now();
        // console.log('ctxUpdatedAtTime',this.ctxUpdatedAtTime);
        // if(this.parent) this.parentSync();
    }
    parentSync(){
        // if(this.parent && this.parent.sync) this.parent.sync();
    }
    
    get x(){ return this._x; }
    set x(x){ this._x = x; this.flush(); }
    get y(){ return this._y; }
    set y(y){ this._y = y; this.flush(); }

    get compositeOperation(){ return this._compositeOperation; }
    set compositeOperation(compositeOperation){ this._compositeOperation = compositeOperation; this.flush(); }
    // get opacity(){ return this._opacity; }
    // set opacity(opacity){ this._opacity = opacity; this.flush(); }
    get alpha(){ return this._alpha; }
    set alpha(alpha){ this._alpha = alpha; this.flush(); }

    get width(){       
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width');
        return desc.get.apply(this); 
    }
    /**
     * @param {number} v
     */
    set width(v){
        const desc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width');
        desc.set.apply(this,[v]); 
        this.flush(); 
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
        desc.set.apply(this,[v]); 
        this.flush(); 
    }

}

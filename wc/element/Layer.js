// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"

export default class Layer extends Canvas{
    static counter = 0;
    constructor(w=null,h=null,bgColor=null,label=null){
        super(w,h,bgColor,label);
        this.id =  'wc-layer-'+(this.constructor.counter++);
        this.label = label??"created at "+(new Date()).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');

        // this._x = 0;
        // this._y = 0;
        // this._compositeOperation = 'source-over';
        // this._alpha = 1;
        
        this.x = 0;
        this.y = 0;
        this.compositeOperation = 'source-over';
        this.alpha = 1;
    }
    static defineCustomElements(name='wc-layer'){
        super.defineCustomElements(name);
    }
        
    // get x(){ return this._x; }
    // set x(x){ this._x = x; }
    // get y(){ return this._y; }
    // set y(y){ this._y = y; }

    // get compositeOperation(){ return this._compositeOperation; }
    // set compositeOperation(compositeOperation){ this._compositeOperation = compositeOperation; }
    // get opacity(){ return this._opacity; }
    // set opacity(opacity){ this._opacity = opacity; this.flush(); }
    // get alpha(){ return this._alpha; }
    // set alpha(alpha){ this._alpha = alpha; }
}

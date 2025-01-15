// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"

export default class Layer extends Canvas{

    static get keys(){
        return super.keys.concat(['left', 'top','compositeOperation','alpha'])
    }

    // x = null;
    // y = null;
    left = null;
    top = null;
    compositeOperation = null;
    alpha = null;
    constructor(w=null,h=null){
        super(w,h);
        
        this.left = 0;
        this.top = 0;
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

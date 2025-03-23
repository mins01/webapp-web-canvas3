// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"
import LayerKind from "../lib/LayerKind.js";

export default class Layer extends Canvas{

    static get keys(){
        return super.keys.concat(['left', 'top','compositeOperation','alpha','angle','zoom','visible','flipX','flipY'])
    }
    static defineCustomElements(name='wc-layer'){
        super.defineCustomElements(name);
    }

    
    kind = LayerKind.NORMAL; 
    

    // x = null;
    // y = null;
    // left = null;
    // top = null;
    compositeOperation = null;
    alpha = null;
    // zoom = null;
    angle = null;
    #left;
    #top;
    #zoom;
    #flipX;
    #flipY;
    #visible;
    visibleByTool = true; // 강제로 숨긴다. (외부에서 설정하지 마라, 툴에서 제어한다.)
    constructor(w=null,h=null){
        super(w,h);
        // this.name = '';// 자동으로 설정됨
        
        this.left = 0;
        this.top = 0;
        this.compositeOperation = 'source-over';
        this.alpha = 1;
        this.zoom = 1;
        this.flipX = 1;
        this.flipY = 1;
        this.visible = true;
        this.angle = 0;
        this.visibleByTool = true;
    }

    get left(){ return this.#left; }
    set left(v){ this.#left = parseFloat(v); this.setAttribute('left',this.#left) }
    get top(){ return this.#top; }
    set top(v){ this.#top = parseFloat(v); this.setAttribute('top',this.#top) }
    get zoom(){ return this.#zoom; }
    set zoom(v){ this.#zoom = parseFloat(v); this.setAttribute('zoom',this.#zoom) }
    get flipX(){ return this.#flipX; }
    set flipX(v){ this.#flipX = parseFloat(v); this.setAttribute('flipX',this.#flipX) }
    get flipY(){ return this.#flipY; }
    set flipY(v){ this.#flipY = parseFloat(v); this.setAttribute('flipY',this.#flipY) }
    get visible(){ return this.#visible; }
    set visible(v){ 
        this.#visible = v==='true'?true:(v==='false')?false:(!!v);
        if(this.#visible){
            this.setAttribute('visible','') 
        }else if(this.hasAttribute('visible') ){
            this.removeAttribute('visible') 
        }
    }

    postion(left,top){
        this.left = left;
        this.top = top;
    }

    postionCenterCenter(){
        if(!this?.parent) return false;
        const left = (this.parent.width - this.width*this.zoom) / 2
        this.left = left;
        const top = (this.parent.height - this.height*this.zoom) / 2
        this.top = top;
    }

    
    /**
     * resize 후 위치정보(left,top) 기반으로 이미지를 붙임
     *
     * @param {*} width 
     * @param {*} height 
     */
    adjustSize(width,height){
        const cloned = this.clone();
        this.width = width;
        this.height = height;
        this.ctx.drawImage(cloned, this.left, this.top, cloned.width, cloned.height);
        this.left = 0;
        this.top = 0;
    }

    merge(canvas){
        const xmin = Math.min(this.left,canvas.left)
        const ymin = Math.min(this.top,canvas.top)
        const xmax = Math.max(this.left+this.width,canvas.left+canvas.width)
        const ymax = Math.max(this.top+this.height,canvas.top+canvas.height)
        const w = xmax-xmin;
        const h = ymax-ymin;

        const imageData = this.ctx.getImageData(0,0,this.width,this.height);
        let dx = this.left-xmin;
        let dy = this.top-ymin;

        this.left = xmin;
        this.top = ymin;
        this.width = w;
        this.height = h;
        // this.stroke('#00ee0033');

        this.ctx.putImageData(imageData,dx,dy);

        dx = canvas.left-xmin;
        dy = canvas.top-ymin;
        this.ctx.drawImage(canvas, dx, dy, canvas.width, canvas.height);

        // this.flush();
    }
}

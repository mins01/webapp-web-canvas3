// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"

export default class Layer extends Canvas{

    static get keys(){
        return super.keys.concat(['left', 'top','compositeOperation','alpha','angle','zoom'])
    }
    static defineCustomElements(name='wc-layer'){
        super.defineCustomElements(name);
    }
    
    // x = null;
    // y = null;
    // left = null;
    // top = null;
    compositeOperation = null;
    alpha = null;
    zoom = null;
    angle = null;
    #left;
    #top;
    constructor(w=null,h=null){
        super(w,h);
        
        this.left = 0;
        this.top = 0;
        this.compositeOperation = 'source-over';
        this.alpha = 1;
        this.zoom = 1;
        this.angle = 0;
    }

    get left(){ return this.#left; }
    get top(){ return this.#top; }
    set left(v){ this.#left = parseFloat(v); this.setAttribute('left',this.#left) }
    set top(v){ this.#top = parseFloat(v); this.setAttribute('top',this.#top) }

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
        // this.fill('#00ee0033');

        this.ctx.putImageData(imageData,dx,dy);

        dx = canvas.left-xmin;
        dy = canvas.top-ymin;
        this.ctx.drawImage(canvas, dx, dy, canvas.width, canvas.height);

        // this.flush();
    }
}

// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"
import LayerKind from "../lib/LayerKind.js";
import Context2dUtil from "../lib/Context2dUtil.js";

export default class Layer extends Canvas{

    static get keys(){
        return super.keys.concat(['left', 'top','compositeOperation','alpha','angle','rotation','zoom','visible','flipX','flipY'])
    }
    static register(name='wc-layer'){
        super.register(name);
    }

    
    kind = LayerKind.NORMAL; 
    

    // x = null;
    // y = null;
    // left = null;
    // top = null;
    compositeOperation = null;
    alpha = null;
    // zoom = null;
    #rotation = 0;
    // angle = null; // rotation의 별칭
    #left;
    #top;
    #zoom;  // @deprecated. 사용하지 말자. 별 의미가 없다. 처리도 힘들고.
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
    get flipX(){ return this.#flipX; } // 1 or -1
    set flipX(v){ this.#flipX = parseFloat(v); this.setAttribute('flip-x',this.#flipX) }
    get flipY(){ return this.#flipY; } // 1 or -1
    set flipY(v){ this.#flipY = parseFloat(v); this.setAttribute('flip-x',this.#flipY) }
    get visible(){ return this.#visible; }
    set visible(v){ 
        this.#visible = v==='true'?true:(v==='false')?false:(!!v);
        if(this.#visible){
            this.setAttribute('visible','') 
        }else if(this.hasAttribute('visible') ){
            this.removeAttribute('visible') 
        }
    }
    get angle(){ return this.rotation; }
    set angle(v){ this.rotation = Number(v); }
    get rotation(){ return this.#rotation; }
    set rotation(v){ this.#rotation = Number(v); }


    // getLocalRect(){ return {left:0,top:0,width:this.width,height:this.height} }
    getLocalRect() {  return new DOMRect( this.left, this.top, this.width, this.height) }
    getViewportRect() { 
        const parent = this.parent.getViewportRect();
        return new DOMRect( this.left + parent.left, this.top + parent.top, this.width, this.height)
    }
    getPageRect() { 
        const parent = this.parent.getPageRect();
        return new DOMRect( this.left + parent.left, this.top + parent.top, this.width, this.height)
    }



    position(left,top){
        this.left = left;
        this.top = top;
    }

    positionCenterCenter(){
        if(!this?.parent) return false;
        const left = (this.parent.width - this.width*this.zoom) / 2
        this.left = left;
        const top = (this.parent.height - this.height*this.zoom) / 2
        this.top = top;
    }

    
    /**
     * 현재의 내용을 가만히 놔두면서 레이어를 부모에 맞추는 효과
     * 부모 기준으로 레이어 너비를 바꾸고,현재의 left,top 기준으로 내용을 옮기고, left,top을 0으로 바꾼다.
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

    
    /**
     * 현재 레이어와 타겟 레이어를 합친다.
     * 현재 레이어의 크기가 커질 수 있다. !이 부분이 특징임
     * 현재 실제 사용처가 없는데.. 지울지 고민해보자.
     * drawLayerTo(targetLayer) 와 차이가 없네. 이걸 대신 사용하자
     *
     * @param {*} canvas 
     */
    merge(targetLayer){
        const xmin = Math.min(this.left,targetLayer.left)
        const ymin = Math.min(this.top,targetLayer.top)
        const xmax = Math.max(this.left+this.width,targetLayer.left+targetLayer.width)
        const ymax = Math.max(this.top+this.height,targetLayer.top+targetLayer.height)
        const w = xmax-xmin;
        const h = ymax-ymin;

        // const imageData = this.ctx.getImageData(0,0,this.width,this.height);
        const cloned = this.clone();
        let dx = this.left-xmin;
        let dy = this.top-ymin;

        this.left = xmin;
        this.top = ymin;
        this.width = w;
        this.height = h;
        // this.stroke('#00ee0033');

        // this.ctx.putImageData(imageData,dx,dy);
        this.ctx.drawImage(cloned, dx, dy);

        dx = targetLayer.left-xmin;
        dy = targetLayer.top-ymin;
        this.ctx.drawImage(targetLayer, dx, dy, targetLayer.width, targetLayer.height);

        // this.flush();
    }

    
    /**
     * 현재 레이어에 타겟 레이어를 그린다.
     * merge 효과와 같다.
     * 
     * @param {*} targetLayer 
     * @returns {boolean} 
     */
    drawLayerTo(targetLayer){
        if( !targetLayer
            || !targetLayer.visible 
            // || !targetLayer.visibleByTool 
            || !targetLayer.width 
            || !targetLayer.height){
                return false;
        }
        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = targetLayer.compositeOperation
         
        ctx.globalAlpha = targetLayer.alpha
        const tranLeft = Math.round(targetLayer.left-(this.kind===LayerKind.GROUP?0:this.left))
        const tranTop = Math.round(targetLayer.top-(this.kind===LayerKind.GROUP?0:this.top));
        ctx.translate(tranLeft, tranTop)
        if(targetLayer.zoom !== 1){ ctx.scale(targetLayer.zoom,targetLayer.zoom); }
        ctx.translate(targetLayer.width/2, targetLayer.height/2)
        ctx.scale(targetLayer.flipX,targetLayer.flipY);
        if(targetLayer.angle !== 0){ ctx.rotate(targetLayer.angle * Math.PI / 180); }
        ctx.translate(-targetLayer.width/2, -targetLayer.height/2)
        ctx.drawImage(targetLayer, 0, 0, targetLayer.width, targetLayer.height);
        ctx.translate(-tranLeft, -tranTop)
        ctx.restore()
    }





    trim(){
        // Context2dUtil.selfTrim(this.ctx);
        const rect = Context2dUtil.getTrimBoundingBox(this.ctx);
        this.left+=rect.x;
        this.top+=rect.y;
        super.trim();
    }
}

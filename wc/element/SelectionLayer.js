// WcLayer를 wc/element/Canvas로 변경

import Canvas from "./Canvas.js"
import LayerKind from "../lib/LayerKind.js";
import Layer from "./Layer.js";
import Context2dUtil from "../lib/Context2dUtil.js";

export default class SelectionLayer extends Layer{

    #isEmpty = true; // 레이어가 비어있는가?
    get isEmpty(){
        return this.#isEmpty
    }
    set isEmpty(b){
        this.#isEmpty = b;
        this.dataset.isEmpty = b
    }
    static get keys(){
        return super.keys.concat(['isEmpty'])
    }
    static defineCustomElements(name='wc-selectionlayer'){
        super.defineCustomElements(name);
    }

    constructor(w=null,h=null){
        super(w,h);
        this.drawable = true; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.

        this.isEmpty = Context2dUtil.isEmpty(this.ctx);
    }

    draw(){ // 따로 그리기 동작이 있을 경우.
        this.isEmpty = Context2dUtil.isEmpty(this.ctx);        
        super.draw();
    }
}

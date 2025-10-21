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
        this.initPattern();

        this.ctx.fillStyle = this.pattern;

        this.isEmpty = Context2dUtil.isEmpty(this.ctx);
    }

    pattern = null;
    initPattern(){
        const halfWidth = 4
        const halfHeight = 4;
        const patternCanvas = new Canvas(halfWidth*2,halfHeight*2);
        patternCanvas.ctx.fillStyle = "#ffffff"; // 흰색
        patternCanvas.ctx.fillRect(0, 0, halfWidth, halfHeight); // 좌상단
        patternCanvas.ctx.fillRect(halfWidth, halfHeight, halfWidth, halfHeight); // 우하단

        patternCanvas.ctx.fillStyle = "#000000"; // 검은색
        patternCanvas.ctx.fillRect(halfWidth, 0, halfWidth, halfHeight); // 우상단
        patternCanvas.ctx.fillRect(0, halfHeight, halfWidth, halfHeight); // 좌하단

        this.pattern = this.ctx.createPattern(patternCanvas, "repeat");
    }

    draw(){ // 따로 그리기 동작이 있을 경우.
        this.isEmpty = Context2dUtil.isEmpty(this.ctx);        
        super.draw();
    }

    eraseLayer(layer){
        const ctx=  layer.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out"; /// 기존 그림과 겹치는 않은 부분만 남김
        ctx.drawImage(this,-layer.left,-layer.top);
        ctx.restore();
    }

    copyToLayer(layer){
        const newLayer = layer.clone(`${layer.title}-copy`);
        const document = layer.parent;
        const ctx=  newLayer.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "destination-in"; // 기존 그림과 겹치는 부분만 남김
        ctx.drawImage(this,-newLayer.left,-newLayer.top);
        ctx.restore();
        newLayer.adjustSize(layer.parent.width,layer.parent.height);
        document.layers.add(newLayer);
    }

    cutToLayer(layer){
        {
            const newLayer = layer.clone(`${layer.title}-copy`);
            const document = layer.parent;
            const ctx=  newLayer.ctx;
            ctx.save();
            ctx.globalCompositeOperation = "destination-in"; // 기존 그림과 겹치는 부분만 남김
            ctx.drawImage(this,-newLayer.left,-newLayer.top);
            ctx.restore();
            newLayer.adjustSize(layer.parent.width,layer.parent.height);
            document.layers.add(newLayer);
        }
        {
            const ctx=  layer.ctx;
            ctx.save();
            ctx.globalCompositeOperation = "destination-out"; // 기존 그림과 겹치는 않은 부분만 남김
            ctx.drawImage(this,-layer.left,-layer.top);
            ctx.restore();
        }
    }

    // 선택 반전
    invert(){
        if(this.isEmpty){ return; }
        const ctx = this.ctx;
        ctx.save()
        ctx.globalCompositeOperation = "xor"; // 겹치는 부분은 삭제됨
        ctx.fillRect(0,0,this.width,this.height);
        ctx.restore();
    }
}

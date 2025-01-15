// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"
import DrawEllipse from '../draw/DrawEllipse.js';


export default class EllipseLayer extends Layer{
    text = '';
    constructor(w=null,h=null){
        super(w,h);
        this.drawable = false; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.

        this.text = '';
    }
    static defineCustomElements(name='wc-ellipselayer'){
        super.defineCustomElements(name);
    }

    setContextConfig(conf){
        super.setContextConfig(conf);
        
        // this.ctx.fillStyle = conf.foreColor;
        // this.ctx.StrokeStyle = conf.backColor;
    }

    setText(text){
        this.text = text;
    }


    draw(){
        const ctx = this.ctx;
        this.ctx.clearRect(0,0,this.width,this.height);       

        ctx.save();
        this.contextConfig.assignTo(ctx);
        // ctx.globalAlpha = 0.3
        // ctx.lineCap = "butt";
        // ctx.lineJoin = "miter";

        const x = 0;
        const y = 0;
        const w = Math.max(1,ctx.canvas.width);
        const h = Math.max(1,ctx.canvas.height);
        DrawEllipse.draw(ctx,x,y,w,h,0);
        
        ctx.restore();
    }
}

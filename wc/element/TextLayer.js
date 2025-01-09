// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"
import DrawText from '../draw/DrawText.js';
import CssLengthUtil from "../lib/CssLengthUtil.js";

export default class TextLayer extends Layer{
    text = '';
    constructor(w=null,h=null,bgColor=null,label=null){
        super(w,h,bgColor,label);
        this.drawable = false; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.

        this.text = '';
    }
    static defineCustomElements(name='wc-textlayer'){
        super.defineCustomElements(name);
    }

    setContextConfig(conf){
        super.setContextConfig(conf);
        this.ctx.fillStyle = conf.foreColor;
        this.ctx.StrokeStyle = conf.backColor;
    }

    setText(text){
        this.text = text;
    }
    
    // get foreColor(){ return this.fillStyle; }
    // set foreColor(v){ this.fillStyle = v; }

    draw(){
        const ctx = this.ctx;
        this.ctxCommand('clearRect',0,0,this.width,this.height);

        
        //== for debug
        ctx.save();
        ctx.lineWidth = ctx.textPaddingPx*2;       
        ctx.strokeStyle = '#ccbbaa80';
        ctx.fillStyle = '#aabbcc80';
        
        ctx.beginPath();
        ctx.rect(0, 0, this.width,this.height);        
        if(ctx.fillAfterStroke??true){ ctx.fill(); ctx.stroke(); }else{ ctx.stroke(); ctx.fill(); }
        ctx.closePath();
        ctx.restore();
        //== for debug


        ctx.save();
        // ctx.fillStyle = '#ff0000';
        // ctx.font = "20px";
        // if(this.parent){
        //     Object.assign(this.ctx,this.parent.editor.contextConfig.toObject());
        // }
        
        if(this.text?.length){            
            DrawText.draw(ctx,this.text,Math.abs(this.width),Math.abs(this.height),0,0,ctx.lineHeightPx,ctx.textPaddingPx);
        }
        
        ctx.restore();
    }
}

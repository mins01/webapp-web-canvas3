// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"
import DrawText from '../draw/DrawText.js';
import CssLengthUtil from "../lib/CssLengthUtil.js";
import CssFontUtil from "../lib/CssFontUtil.js";
import Context2dTextConfig from "../lib/Context2dTextConfig.js";
import LayerKind from "../lib/LayerKind.js";

export default class TextLayer extends Layer{
    static get keys(){
        return super.keys.concat(['textConfig', 'text'])
    }

    kind = LayerKind.TEXT;
    textConfig = null;
    text = '';
    constructor(w=null,h=null){
        super(w,h);
        this.drawable = false; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.

        this.textConfig = new Context2dTextConfig();
        this.text = '';
        // this.name = '';// 자동으로 설정됨

        // 테스트용 데이터
        this.text ="Test TextLayer\nHello canvas!"
        this.flush();
    }
    static defineCustomElements(name='wc-textlayer'){
        super.defineCustomElements(name);
    }

    setContextConfig(conf){
        super.setContextConfig(conf);
        this.ctx.fillStyle = conf.foreColor;
        this.ctx.StrokeStyle = conf.backColor;
    }
    setTextConfig(conf){
        // console.log('xxxx',conf)
        // Object.assign(this.textConfig,conf)
        this.textConfig.assignFrom(conf);
        this.ctx.fillStyle = this.textConfig.textColor;
    }

    setText(text){
        this.text = text;
    }
    
    // get foreColor(){ return this.fillStyle; }
    // set foreColor(v){ this.fillStyle = v; }

    draw(){
        const ctx = this.ctx;
        this.ctx.clearRect(0,0,this.width,this.height);

        // ctx.save();
        this.contextConfig.assignTo(ctx,true);
        this.textConfig.assignTo(ctx);
        // let {fontSize} = CssFontUtil.parse(ctx.font);        

        if(this.text?.length){
            const textConfig = this.textConfig;            
            DrawText.draw(ctx,textConfig,this.text,Math.abs(this.width),Math.abs(this.height),0,0 );
        }

        this.dispatchEvent( new CustomEvent("draw", {bubbles:true,cancelable:true}) );
    }
}

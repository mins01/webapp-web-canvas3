// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"
import DrawText from '../draw/DrawText.js';


export default class TextLayer extends Layer{
    static counter = 0;
    constructor(w=null,h=null,bgColor=null,label=null){
        super(w,h,bgColor,label);
        this.id =  'wc-textlayer-'+(this.constructor.counter++);
        this.label = label??"created at "+(new Date()).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/,'');
        
        this.compositeOperation = 'source-over';
        this.alpha = 1;



        this.lineHeightPx

        this.text = '';
        this.lineHeightPx = 20;
    }
    static defineCustomElements(name='wc-textlayer'){
        super.defineCustomElements(name);
    }

    setText(text){
        this.text = text;
        this.draw();
        this.sync();
    }
    

    draw(){
        const ctx = this.ctx;
        this.clear();

        ctx.save();
        ctx.strokeStyle = '#ccbbaa';
        ctx.fillStyle = '#aabbcc';
        ctx.beginPath();
        ctx.rect(0, 0, this.width,this.height);        
        if(ctx.fillAfterStroke??true){ ctx.fill(); ctx.stroke(); }else{ ctx.stroke(); ctx.fill(); }
        ctx.closePath();

        ctx.fillStyle = '#ff0000';
        ctx.font = "20px";

        DrawText.draw(ctx,this.text,Math.abs(this.width),Math.abs(this.height),0,0,this.lineHeightPx);
        
        ctx.restore();
    }
}

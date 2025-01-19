import BaseTool from './BaseTool.js';
import DrawText from '../draw/DrawText.js';

import CssLengthUtil from '../lib/CssLengthUtil.js';

export default class Text extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'text';
        this.editor = editor;

        // this.x0 = null;
        // this.y0 = null;
        this.text= null;
    }


    start(){
        super.start();
        this.document.ready();
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointerup(event){
        super.onpointerup(event);
        // const [x,y] = this.getXYForLayer(event);
        // this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    end(){
        super.end();
        // this.document.ready();

    }
    input(event){
        super.input(event);
        this.text = event.target.value??event.target.innerText;
    }

    apply(){
        super.apply();
        this.layer.merge(this.drawLayer)
        this.document.ready();

    }
    

    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = drawLayer.ctx;

        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }

        ctx.save();
        this.prepareLayer(ctx);
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        let w = lx1 - lx0;
        let h = ly1 - ly0;      
        
        drawLayer.clear();

        ctx.beginPath();
        ctx.rect(lx0, ly0, w,h);        
        if(ctx.fillAfterStroke??true){ ctx.fill(); ctx.stroke(); }else{ ctx.stroke(); ctx.fill(); }
        ctx.closePath();

        ctx.canvas.contextConfig.assignTo(ctx,true);


        // console.log(ctx.font,this.editor.contextConfig.lineHeightPx);
        

        let text = 'text text 한글 \n 자동 줄바꿈을 어떻게 하지.자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. \n줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후';

        let xs = Math.min(lx0,lx1);
        let ys = Math.min(ly0,ly1);

        DrawText.draw(ctx,text,Math.abs(w),Math.abs(h),xs,ys,
            CssLengthUtil.pxBasedOnFontSize(ctx.lineHeight,ctx.fontSize),
        );
        
        ctx.restore();

        drawLayer.flush()
    }

    // textToLines(text,w,h){
    //     const ctx = this.drawLayer.ctx;
    //     const lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8;

    //     const lines = [];
    //     let chars = [...text];
    //     // console.log(chars);
        

    //     let line = '';
    //     let h1 = lineHeight;
    //     chars.forEach(ch => {
    //         if(h1>h){
    //             return
    //         }else if(ch==='\n'){
    //             lines.push(line);
    //             h1+=lineHeight;
    //             line = '';
    //         }else if(ctx.measureText(line+ch).width <= w){
    //             line += ch;
    //         }else{
    //             lines.push(line);
    //             h1+=lineHeight;
    //             line = ch;
    //         }
    //     });
    //     if(h1>h){}
    //     else if(line !== ''){ 
    //         lines.push(line); 
    //         h1+=lineHeight; 
    //     }
    //     return lines;
    // }
    // drawTextLines(lines,x,y){
    //     const ctx = this.drawLayer.ctx;
    //     const lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8;
        
        
        
    //     let x1 = x;
    //     let y1 = y+lineHeight;
    //     console.log(lineHeight,x1,y1);

    //     lines.forEach((line,index) => {
    //         console.log(line,x1,y1);
            
    //         ctx.fillStyle = "black";
    //         ctx.fillText(line, x1, y1);
    //         y1+=lineHeight
    //     });
    // }


}
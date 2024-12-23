import BaseTool from './BaseTool.js';
import DrawText from '../draw/DrawText.js';



export default class Rectangle extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'rectangle';
        this.editor = editor;

        // this.x0 = null;
        // this.y0 = null;
        this.text= null;
    }


    start(){
        super.start();
    }
    down(event){
        super.down(event);
        const [x,y] = this.getXYForLayer(event);
        this.x0 = x;
        this.y0 = y;
        this.x = x;
        this.y = y;
        this.draw(x,y,x,y);
    }
    move(event){
        super.move(event);
        const [x,y] = this.getXYForLayer(event);
        this.x = x;
        this.y = y;
        this.draw(this.x0,this.y0,x,y);
    }
    up(event){
        super.up(event);
        // const [x,y] = this.getXYForLayer(event);
        // this.draw(this.x0,this.y0,x,y);
    }
    end(){
        super.end();

    }
    input(event){
        super.input(event);
        this.text = event.target.value??event.target.innerText;
    }

    

    draw(x0,y0,x,y){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = drawLayer.ctx;

        ctx.save();
        // for testing
        ctx.lineWidth = 4;
        ctx.strokeStyle = "orange";
        ctx.fillStyle = "rgba(255,255,255,0.5)";

        let w = x - x0;
        let h = y - y0;      
        
        drawLayer.clear();

        ctx.beginPath();
        ctx.rect(x0, y0, w,h);        
        if(ctx.fillAfterStroke??true){ ctx.fill(); ctx.stroke(); }else{ ctx.stroke(); ctx.fill(); }
        ctx.closePath();

        const lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8;
        ctx.fillStyle = "black";

        let text = 'text text 한글 \n 자동 줄바꿈을 어떻게 하지.자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. \n줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후';

        let xs = Math.min(x0,x);
        let ys = Math.min(y0,y);

        DrawText.draw(ctx,text,Math.abs(w),Math.abs(h),xs,ys,lineHeight);
        
        ctx.restore();

        document.sync()
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
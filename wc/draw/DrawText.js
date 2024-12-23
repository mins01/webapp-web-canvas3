export default class DrawText{

    static draw(ctx,text,w,h,x,y,lineHeight=null){
        if(lineHeight===null){ lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8; }
        let textLines = this.textToLines(ctx,text,w,h,lineHeight);
        this.drawTextLines(ctx,textLines,x,y,lineHeight);
    }

    static textToLines(ctx,text,w,h,lineHeight=null){
        if(lineHeight===null){ lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8; }
        const lines = [];
        let chars = [...text];
        let line = '';
        let h1 = lineHeight;
        chars.forEach(ch => {
            if(h1>h){
                return
            }else if(ch==='\n'){
                lines.push(line);
                h1+=lineHeight;
                line = '';
            }else if(ctx.measureText(line+ch).width <= w){
                line += ch;
            }else{
                lines.push(line);
                h1+=lineHeight;
                line = ch;
            }
        });
        if(h1>h){}
        else if(line !== ''){ 
            lines.push(line); 
            h1+=lineHeight; 
        }
        return lines;
    }

    static drawTextLines(ctx,lines,x,y,lineHeight=null){
        if(lineHeight===null){ lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8; }
        
        let x1 = x;
        let y1 = y+lineHeight;
        lines.forEach((line) => {
            console.log(line,x1,y1);
            ctx.fillText(line, x1, y1);
            y1+=lineHeight
        });
    }
}
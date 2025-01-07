export default class DrawText{

    static draw(ctx,text,w,h,x,y,lineHeight=null,padding=0){
        if(lineHeight===null){ lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8; }
        let textLines = this.textToLines(ctx,text,w-(padding*2),h-(padding*2),lineHeight);
        this.drawTextLines(ctx,textLines,x+padding,y+padding,w-(padding*2),h-(padding*2),lineHeight);
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

    static drawTextLines(ctx,lines,x,y,w,h,lineHeight=null){
        ctx.save();
        if(lineHeight===null){ lineHeight = ctx.lineHeight??parseInt(ctx.font,10)??8; }
        
        let x1 = x;
        let y1 = y+lineHeight;
        
        if(ctx.textAlign=='center'){
            x1 = x+(w / 2);
        }else if(ctx.textAlign=='left'){
            x1 = x;
        }else if(ctx.textAlign=='right'){
            x1 = x+w;
        }else if(ctx.textAlign=='start'){
            if(ctx.direction == 'rtl'){
                x1 = x+w;
            }else{
                x1 = x;
            }
        }else if(ctx.textAlign=='end'){
            if(ctx.direction == 'rtl'){
                x1 = x;
            }else{
                x1 = x+w;
            }
        }
        lines.forEach((line) => {
            ctx.fillText(line, x1, y1);
            y1+=lineHeight
        });
        ctx.restore();
    }
}
export default class DrawText{

    static draw(ctx,textConfig,text,w,h,x,y){
        const padding = textConfig.paddingPx;
        let textLines = this.textToLines(ctx,textConfig,text,w-(padding*2),h-(padding*2));
        this.drawTextLines(ctx,textConfig,textLines,x+padding,y+padding,w-(padding*2),h-(padding*2));
    }

    static textToLines(ctx,textConfig,text,w,h){
        const lineHeight = textConfig.lineHeightPx;
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

    static drawTextLines(ctx,textConfig,lines,x,y,w,h){
        ctx.save();
        const lineHeight = textConfig.lineHeightPx; 
        const verticalAlign = textConfig?.verticalAlign??'top';
        const linesH = lineHeight * lines.length;
        
        let x1 = x;
        let y1 = y+lineHeight;

        if(verticalAlign=='top'){
            
        }else if(verticalAlign=='bottom'){
            y1 += h-linesH
        }else if(verticalAlign=='middle'){
            y1 += Math.round((h-linesH)/2)
        }
        
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
        const textMetrics = ctx.measureText(lines[0]);
        const fontBoundingBoxDescent = textMetrics.fontBoundingBoxDescent??0; //폰트의 baseline 기준 하단 높이 
        lines.forEach((line) => {
            ctx.fillText(line, x1, y1-fontBoundingBoxDescent);
            y1+=lineHeight
        });
        ctx.restore();
    }
}
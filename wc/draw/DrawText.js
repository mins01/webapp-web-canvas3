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
        

        let maxfontBoundingBoxAscent = 0;
        let maxFontBoundingBoxDescent = 0;
        lines.forEach((line) => {
            const textMetrics = ctx.measureText(line);
            const fontBoundingBoxAscent  = textMetrics.fontBoundingBoxAscent ??0; //폰트의 baseline 기준 상단 높이 
            if(maxfontBoundingBoxAscent < fontBoundingBoxAscent ){ maxfontBoundingBoxAscent = fontBoundingBoxAscent ; }
            const fontBoundingBoxDescent = textMetrics.fontBoundingBoxDescent??0; //폰트의 baseline 기준 하단 높이 
            if(maxFontBoundingBoxDescent < fontBoundingBoxDescent){ maxFontBoundingBoxDescent = fontBoundingBoxDescent; }
        });
        const maxFontHeight = maxfontBoundingBoxAscent + maxFontBoundingBoxDescent;
        const marginAscent = (lineHeight-maxFontHeight)/2;

        let x1 = x;
        // let y1 = y+lineHeight;
        let y1 = y + marginAscent + maxfontBoundingBoxAscent; // 이 계산으로 textBaseline 에 상관 없이 lineHeight 기준으로 위치 하게 됨
        // console.log(lineHeight , maxFontHeight , marginAscent,maxfontBoundingBoxAscent);

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
        


        lines.forEach((line) => {
            ctx.fillText(line, x1, y1  );
            y1+=lineHeight
        });
        ctx.restore();
    }
}
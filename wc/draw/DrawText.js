export default class DrawText{

    static draw(ctx,textConfig,text,w,h,x,y){
        const padding = textConfig.paddingPx;
        let textLines = this.textToLines(ctx,textConfig,text,w-(padding*2),h-(padding*2));
        return this.drawTextLines(ctx,textConfig,textLines,x+padding,y+padding,w-(padding*2),h-(padding*2));
    }

    static textToLines(ctx,textConfig,text,w,h){
        const lineHeight = textConfig.lineHeightPx;
        // const lines = [];
        // let chars = [...text];
        let wordBreakGroup = this.splitIntoWordBreakGroup(text,textConfig.wordBreak??'normal')
        let lines = this.wordBreakGroupToLines(ctx,wordBreakGroup,w);
        let lineNumber = Math.floor(h/lineHeight)
        let heightedLines = lines.slice(0,0+lineNumber);
        // console.log(lines);
        return heightedLines;
    }

    static drawTextLines(ctx,textConfig,lines,x,y,w,h){
        // return;
        const lineHeight = textConfig.lineHeightPx; 
        const verticalAlign = textConfig?.verticalAlign??'top';
        const linesH = lineHeight * lines.length;
        
        // const fontSize = textConfig?.fontSize??'10px';
        // const fontFamily = textConfig?.fontFamily??'sans-serif';
            
        ctx.save();     

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


    static splitIntoWordBreakGroup(text,wordBreak='normal'){
        let groups = null;
        if(wordBreak == 'break-all'){
            const regex = /(.)/ug;
            groups = text.match(regex);
        }else if(wordBreak == 'keep-all'){
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F]+)/ug;
            groups = text.match(regex);
        }else{ // (wordBreak == 'normal')
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F])/ug;
            groups = text.match(regex);
        }
        console.log('groups',wordBreak,groups);
        
        return groups;
    }

    static wordBreakGroupToLines(ctx,wordBreakGroup,w){
        let lines = []
        let line = null;
        wordBreakGroup.forEach((str,i)=>{
            if(line === null){ line = str; return; } // null 이면 현재 문자열 넣고 다음으로.
            if(str=='\n'){
                lines.push(line);
                line = null;
            }else if(ctx.measureText(line+str).width > w){
                lines.push(line);
                line = str==' '?null:str; // 마지막 빈칸은 그리지 않는다.
            }else{
                line += str
            }
        })
        if(line.length){
            lines.push(line);
        }
        return lines;
    }
}
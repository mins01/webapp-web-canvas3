export default class DrawText{

    static draw(ctx,textConfig,text,w,h,x,y){
        const padding = textConfig.paddingPx;
        let textLines = this.textToLines(ctx,textConfig,text,w-(padding*2),h-(padding*2));
        return this.drawTextLines(ctx,textConfig,textLines,x+padding,y+padding,w-(padding*2),h-(padding*2));
    }

    static textToLines(ctx,textConfig,text,width,height){
        const lineHeight = textConfig.lineHeightPx;
        // const lines = [];
        // let chars = [...text];
        let lines = [];
        const whiteSpace = textConfig.whiteSpace
        if(whiteSpace=='normal'){ // 공백압축+줄바꿈금지+자동줄바꿈
            let wordBreakGroup = this.splitIntoWordBreakGroup(text.replace(/\r?\n/g,'').replace(/[ \t\v\f]+/g,' '),textConfig.wordBreak??'normal')
            const ignoreWhiteSpaceWidth = false; //공백도 글자처림
            lines = this.wordBreakGroupToLines(ctx,wordBreakGroup,width,textConfig.overflowWrap??'normal',ignoreWhiteSpaceWidth); 
        }else if(whiteSpace=='nowrap'){ // 공백압축+줄바꿈금지
            lines = [text.replace(/\r?\n/g,'').replace(/[ \t\v\f]+/g,' ')];
        }else if(whiteSpace=='pre'){ // 공백유지+줄바꿈허용+공백도글자(공백도 줄바꿈 함)
            lines = text.split(/\r?\n/);

        }else if(whiteSpace=='pre-wrap'){ // 공백유지+줄바꿈허용+자동줄바꿈+뒷공백유지(공백은 줄바꿈 안함)
            let wordBreakGroup = this.splitIntoWordBreakGroup(text,textConfig.wordBreak??'normal')
            const ignoreWhiteSpaceWidth = true; //공백너비 체크 없음. 줄 뒤에 무조건 붙임.
            lines = this.wordBreakGroupToLines(ctx,wordBreakGroup,width,textConfig.overflowWrap??'normal',ignoreWhiteSpaceWidth);            
        }else if(whiteSpace=='pre-line'){ // 공백압축+줄바꿈허용+자동줄바꿈
            let wordBreakGroup = this.splitIntoWordBreakGroup(text.replace(/[ \t\v\f]+/g,' '),textConfig.wordBreak??'normal') //공백을 압축후 처리한다.
            const ignoreWhiteSpaceWidth = true; //공백너비 체크 없음. 줄 뒤에 무조건 붙임. // pre-line이라서 1개의 공백까지만 유지됨
            lines = this.wordBreakGroupToLines(ctx,wordBreakGroup,width,textConfig.overflowWrap??'normal',ignoreWhiteSpaceWidth);            
        }else{  // break-spaces  // 공백유지+줄바꿈허용+자동줄바꿈+공백도글자(공백도 줄바꿈 함)
            let wordBreakGroup = this.splitIntoWordBreakGroup(text,textConfig.wordBreak??'normal')
            const ignoreWhiteSpaceWidth = false; //공백도 글자처림
            lines = this.wordBreakGroupToLines(ctx,wordBreakGroup,width,textConfig.overflowWrap??'normal',ignoreWhiteSpaceWidth);            
        }
        // console.log(textConfig.whiteSpace);
        
        
        let lineNumber = Math.floor(height/lineHeight)
        let heightedLines = lines.slice(0,0+lineNumber);
        // console.log(heightedLines);
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

    /**
     * 주어진 텍스트를 word-break 규칙에 따라 분리된 문자열 그룹으로 나눕니다.
     *
     * @param {string} text - 분할할 대상 문자열입니다.
     * @param {'normal'|'break-all'|'keep-all'|'break-word'} [wordBreak='normal'] - 텍스트 줄바꿈 기준 설정입니다.
     *   - `'break-all'`: 모든 문자 단위로 분할합니다.
     *   - `'keep-all'` 또는 `'break-word'`: 공백과 단어, 비ASCII 등을 기준으로 분할합니다.
     *   - `'normal'`: 일반적인 줄바꿈 규칙에 따라 분할합니다.
     * @param {boolean} [groupedWhiteSpace=false] - true이면 연속된 공백(스페이스, 탭 등)을 하나의 그룹으로 처리합니다.
     * @returns {string[] | null} - 분할된 문자열 그룹 배열. 입력값이 빈 문자열이면 null이 반환될 수 있습니다.
     */
    static splitIntoWordBreakGroup(text,wordBreak='normal'){
        let groups = null;
        if(wordBreak == 'break-all'){
            const regex = /(.)/ug;
            groups = text.match(regex);
        }else if(wordBreak == 'keep-all' || wordBreak == 'break-word'){
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F]+)/ug;
            groups = text.match(regex);
        }else{ // (wordBreak == 'normal')            
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F])/ug;
            groups = text.match(regex);
        }
        // console.log('groups',wordBreak,groups);
        
        return groups;
    }

    /**
     * 주어진 단어 그룹(wordBreakGroup)을 캔버스 컨텍스트(ctx)를 사용해 주어진 폭(width) 안에
     * 여러 줄로 나누어 반환합니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 텍스트 측정을 위한 2D 캔버스 컨텍스트.
     * @param {string[]} wordBreakGroup - 단어 또는 문자열 조각들의 배열.
     * @param {number} width - 한 줄에 허용되는 최대 너비(픽셀).
     * @param {'normal'|'break-word'} [overflowWrap='normal'] - 넘침 시 줄바꿈 처리 방식.
     *   - 'normal': 넘칠 경우 줄바꿈하지 않고 한 줄 유지.
     *   - 'break-word': 단어 단위가 아닌 문자 단위까지 쪼개어 줄바꿈함.
     * @param {boolean} [ignoreWhiteSpaceWidth=false] - 공백 문자열에 대해서 너비 측정을 무시할지 여부.
     * @returns {string[]} - 주어진 너비 안에 맞게 나누어진 텍스트 줄들의 배열.
     */
    static wordBreakGroupToLines(ctx,wordBreakGroup,width,overflowWrap='normal',ignoreWhiteSpaceWidth=false){
        let lines = []
        let line = null;
        // console.log(overflowWrap);
        const pushLines = 
            overflowWrap=='break-word'
            ?(line)=>{
                const currGroup = this.splitIntoWordBreakGroup(line,'break-all');
                const currLines = this.wordBreakGroupToLines(ctx,currGroup,width,overflowWrap,ignoreWhiteSpaceWidth);
                lines.push(...currLines);
            }
            :(line)=>{
                lines.push(line);
            }
        
        wordBreakGroup.forEach((str,i)=>{
            if(line === null){ line = str; return; } // null 이면 현재 문자열 넣고 다음으로.
            if(str=='\n'){
                pushLines(line)
                line = null;
            }else if(ignoreWhiteSpaceWidth && /^[ \t\v\f]+$/.test(str)){ // 전체 공백인 경우
                line += str
            }else if(ctx.measureText(line+str).width > width){
                pushLines(line)
                line = str==' '?null:str; // 마지막 빈칸은 그리지 않는다.
            }else{
                line += str
            }
        })
        if(line && line.length){
            pushLines(line)
        }
        return lines;
    }
}
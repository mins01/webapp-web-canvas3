export default class DrawText{

    static draw(ctx,textConfig,text,width,height,x,y){
        const padding = textConfig.paddingPx;
        const innerWidth = width-(padding*2);
        const innerHeight = height-(padding*2);
        let textLines = this.textToTextLines(ctx,textConfig,text,innerWidth);

        //-- 높이기준 넘치는 line 버리기
        const lineHeight = textConfig.lineHeightPx;
        let lineNumber = Math.floor(innerHeight/lineHeight)
        let heightedLines = textLines.slice(0,0+lineNumber);

        return this.drawTextLines(ctx,textConfig,heightedLines,x+padding,y+padding,innerWidth,innerHeight);
    }

    static textToTextLines(ctx,textConfig,text,width=null){
        if(width === null){ width = ctx.canvas.width - textConfig.paddingPx*2;}
        // const textLines = [];
        // let chars = [...text];
        let textLines = [];
        const whiteSpace = textConfig.whiteSpace
        const wordBreak = textConfig.wordBreak??'normal'
        const overflowWrap = textConfig.overflowWrap??'normal'
        if(whiteSpace=='normal'){ // 공백압축+줄바꿈금지+자동줄바꿈
            let wordBreakGroup = this.splitIntoWordBreakGroup(text.replace(/\r?\n/g,'').replace(/[ \t\v\f]+/g,' '),wordBreak)
            const ignoreWhiteSpaceWidth = false; //공백도 글자처림
            textLines = this.wordBreakGroupToTextLines(ctx,wordBreakGroup,width,overflowWrap,ignoreWhiteSpaceWidth); 
        }else if(whiteSpace=='nowrap'){ // 공백압축+줄바꿈금지
            textLines = [text.replace(/\r?\n/g,'').replace(/[ \t\v\f]+/g,' ')];
        }else if(whiteSpace=='pre'){ // 공백유지+줄바꿈허용+공백도글자(공백도 줄바꿈 함)
            textLines = text.split(/\r?\n/);

        }else if(whiteSpace=='pre-wrap'){ // 공백유지+줄바꿈허용+자동줄바꿈+뒷공백유지(공백은 줄바꿈 안함)
            let wordBreakGroup = this.splitIntoWordBreakGroup(text,wordBreak)
            const ignoreWhiteSpaceWidth = true; //공백너비 체크 없음. 줄 뒤에 무조건 붙임.
            textLines = this.wordBreakGroupToTextLines(ctx,wordBreakGroup,width,overflowWrap,ignoreWhiteSpaceWidth);            
        }else if(whiteSpace=='pre-line'){ // 공백압축+줄바꿈허용+자동줄바꿈
            let wordBreakGroup = this.splitIntoWordBreakGroup(text.replace(/[ \t\v\f]+/g,' '),wordBreak) //공백을 압축후 처리한다.
            const ignoreWhiteSpaceWidth = true; //공백너비 체크 없음. 줄 뒤에 무조건 붙임. // pre-line이라서 1개의 공백까지만 유지됨
            textLines = this.wordBreakGroupToTextLines(ctx,wordBreakGroup,width,overflowWrap,ignoreWhiteSpaceWidth);            
        }else{  // break-spaces  // 공백유지+줄바꿈허용+자동줄바꿈+공백도글자(공백도 줄바꿈 함)
            let wordBreakGroup = this.splitIntoWordBreakGroup(text,wordBreak)
            const ignoreWhiteSpaceWidth = false; //공백도 글자처림
            textLines = this.wordBreakGroupToTextLines(ctx,wordBreakGroup,width,overflowWrap,ignoreWhiteSpaceWidth);            
        }
        // console.log(textConfig.whiteSpace);
        return textLines;
    }

    static drawTextLines(ctx,textConfig,textLines,x=null,y=null,width=null,height=null){
        if(x === null){ x = textConfig.paddingPx;}
        if(y === null){ y = textConfig.paddingPx;}
        if(width === null){ width = ctx.canvas.width - textConfig.paddingPx*2;}
        if(height === null){ height = ctx.canvas.height - textConfig.paddingPx*2;}

        // return;
        const lineHeight = textConfig.lineHeightPx; 
        const verticalAlign = textConfig?.verticalAlign??'top';
        const innerHeight = lineHeight * textLines.length;
        
        // const fontSize = textConfig?.fontSize??'10px';
        // const fontFamily = textConfig?.fontFamily??'sans-serif';
            
        ctx.save();     

        let maxfontBoundingBoxAscent = 0;
        let maxFontBoundingBoxDescent = 0;
        const textMetricsForLines = [];
        textLines.forEach((line) => {
            const textMetrics = ctx.measureText(line);
            textMetricsForLines.push(textMetrics);
            const fontBoundingBoxAscent  = textMetrics.fontBoundingBoxAscent??0; //폰트의 baseline 기준 상단 높이 
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
            y1 += height-innerHeight
        }else if(verticalAlign=='middle'){
            y1 += Math.round((height-innerHeight)/2)
        }
        
        if(ctx.textAlign=='center'){
            x1 = x+(width / 2);
        }else if(ctx.textAlign=='left'){
            x1 = x;
        }else if(ctx.textAlign=='right'){
            x1 = x+width;
        }else if(ctx.textAlign=='start'){
            if(ctx.direction == 'rtl'){
                x1 = x+width;
            }else{
                x1 = x;
            }
        }else if(ctx.textAlign=='end'){
            if(ctx.direction == 'rtl'){
                x1 = x;
            }else{
                x1 = x+width;
            }
        }
        

        // normal과 pre-line과 pre-wrap : 뒷 공백은 계산안함. => 즉, 글자 부분만 그려짐.
        // pre, nowrap 는 공백도 영역을 차지한다. 하지만 center나 right로 해도 해당 너비까지만 그려지고 끝.=> left나 center나 right나 모양이 같다.
        // break-space 는 공백도 줄바꿈이기에 이미 줄 바꿈 되어있으므로, 너비를 넘어가지 않는다. 하지만 공백도 크기를 가진다 => 즉, 해당 공백포함 너비 기준으로 정렬된다. (보통은 약간의 오차로 정렬 변경에 차이를 보임)
        
        // break-space 는 따로 처리하지 않는다.
        // normal과 pre-line과 pre-wrap 는 trim 처리
        // pre, nowrap 는 너비가 넘어가면 시작부분에서 그려지게.

        textLines.forEach((line,i) => {
            const textMetrics = textMetricsForLines[i];
            // console.log(`[${line}]`,textMetrics);
            
            if(width < textMetrics.width){
                // console.log('넘침',x);
                const t = ctx.textAlign;
                if(ctx.direction == 'rtl'){ //오른쪽에서 왼쪽시
                    x1 = x+width;
                    ctx.textAlign='right'
                    ctx.fillText(line, x+w, y1  );
                }else{
                    ctx.textAlign='left'
                    ctx.fillText(line, x, y1  );
                }
                ctx.textAlign=t;
                
            }else{
                ctx.fillText(line, x1, y1  );
            }

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
            const regex = /(.)/usg;
            groups = text.match(regex);
        }else if(wordBreak == 'keep-all' || wordBreak == 'break-word'){
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F]+)/ug;
            groups = text.match(regex);
        }else{ // (wordBreak == 'normal')            
            const regex = /(\r?\n|[ \t\v\f]|[!-~]+|[^\x00-\x7F])/ug;
            groups = text.match(regex);
        }
        // console.log('groups',wordBreak,`[${text}]`,groups);
        
        return groups??[];
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
    static wordBreakGroupToTextLines(ctx,wordBreakGroup,width,overflowWrap='normal',ignoreWhiteSpaceWidth=false){
        let textLines = []
        let line = null;
        // console.log(overflowWrap);
        const pushLines = 
            overflowWrap=='break-word'
            ?(line)=>{
                const currGroup = this.splitIntoWordBreakGroup(line,'break-all');
                const currLines = this.wordBreakGroupToTextLines(ctx,currGroup,width,'normal',ignoreWhiteSpaceWidth);
                // console.log('currLines',currLines,'currGroup',currGroup);
                
                textLines.push(...currLines);
            }
            :(line)=>{
                textLines.push(line);
            }
        
        wordBreakGroup.forEach((str,i)=>{
            if(line === null){ 
                if(str=='\n'){  textLines.push(''); return;} // 맨 처음이 줄 바꿈이면
                line = str;  return; 
            } // null 이면 현재 문자열 넣고 다음으로.
            
            
            if(str=='\n'){
                pushLines(line)
                // textLines.push(line);
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
        return textLines;
    }
}
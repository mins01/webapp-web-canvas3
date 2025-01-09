// https://developer.mozilla.org/ko/docs/Web/CSS/font

export default class CssFontUtil{


    /*
    font-style: normal, italic, oblique , oblique 10deg;

    font-variant: normal, small-caps
    font-weight: 1~1000, bold, bolder, lighter

    font-stretch: normal,   ultra-condensed,   extra-condensed,   condensed,   semi-condensed,   semi-expanded,   expanded,   extra-expanded,   ultra-expanded

    font-size: 숫자+단위
    line-height: 숫자, %
    */

    /**
     * css font 축약형 parse
     *
     * @static
     * @param {string} font 
     * @returns {*} 
     */
    static parseFont(font){
        if(font===null|| font===undefined|| !font?.length){return null;}
        const rs = {
            fontStyle:'',
            fontVariant:'',
            fontStretch:'',
            fontWeight:'',
            fontSize:'',
            lineHeight:'',
            fontFamily:'',
        }
        const regexpFontSize = /((?:[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)(?!deg)(?:[a-z]{2,3}|%)|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger)(?!-)(?:\/((?:[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)(?:[a-z]{2,3}|%)?|normal))?(?:\s+)?(.*)?$/
        const match1 = font.match(regexpFontSize);
        if(!match1){ return null;}
        rs.fontSize = match1[1]??'';
        rs.lineHeight = match1[2]??'';
        rs.fontFamily = match1[3]??'';
        if(rs.fontSize=='' ||rs.fontFamily==''){ return null;} //필수값
        
        const fontPre = font.substring(0,match1.index-1);
        
        const regexpFontStyle = /(italic|oblique(?:\s+\d+deg))/;
        let match2 = fontPre.match(regexpFontStyle);
        if(match2) rs.fontStyle = match2[1]??'';

        const regexpFontVariant = /(small-caps)/;
        match2 = fontPre.match(regexpFontVariant);
        if(match2) rs.fontVariant = match2[1]??'';

        const regexpFontStretch = /(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded)/;
        match2 = fontPre.match(regexpFontStretch);
        if(match2) rs.fontStretch = match2[1]??'';

        const regexpFontWeight = /(\d{1,4}|bold|bolder|lighter)/;
        match2 = fontPre.match(regexpFontWeight);
        if(match2) rs.fontWeight = match2[1]??'';

        return rs;
    }
    
}


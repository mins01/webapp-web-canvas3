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
    static parse(font){
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
        let fontWork = font;

        const regexpFontSize = /((?:[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)(?:cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vi|vb|vmin|vmax|px|cm|mm|Q|in|pc|pt|%)|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger)(?![^\/\s])(?:\/((?:[-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)(?:cap|ch|em|ex|ic|lh|rem|rlh|vh|vw|vi|vb|vmin|vmax|px|cm|mm|Q|in|pc|pt|%)?|normal))?(?:\s+)?(.*)?$/
        const match1 = fontWork.match(regexpFontSize);
        if(!match1){ return null;}
        rs.fontSize = match1[1]??'';
        rs.lineHeight = match1[2]??'';
        rs.fontFamily = match1[3]??'';
        if(rs.fontSize=='' ||rs.fontFamily==''){ return null;} //필수값

        fontWork = fontWork.substring(0,rs.index)

        const regexpFontStyle = /(italic|oblique(?:\s+\d+(?:deg|grad|rad|turn))?)/;
        let match2 = fontWork.match(regexpFontStyle);
        if(match2) rs.fontStyle = match2[1]??'';
        if(rs.fontStyle.length){ fontWork = fontWork.replace(rs.fontStyle,'') } 

        const regexpFontVariant = /(small-caps)/;
        match2 = fontWork.match(regexpFontVariant);
        if(match2) rs.fontVariant = match2[1]??'';
        if(rs.fontVariant.length){ fontWork = fontWork.replace(rs.fontVariant,'') } 

        const regexpFontStretch = /(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded)/;
        match2 = fontWork.match(regexpFontStretch);
        if(match2) rs.fontStretch = match2[1]??'';
        if(rs.fontStretch.length){ fontWork = fontWork.replace(rs.fontStretch,'') } 

        const regexpFontWeight = /(\d{1,4}|bold|bolder|lighter)/;
        match2 = fontWork.match(regexpFontWeight);
        if(match2) rs.fontWeight = match2[1]??'';
        if(rs.fontWeight.length){ fontWork = fontWork.replace(rs.fontWeight,'') } 



        return rs;
    }
    
}


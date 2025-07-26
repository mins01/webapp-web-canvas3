import CssLengthUtil from "./CssLengthUtil.js";
import CssFontUtil from "./CssFontUtil.js";
import BaseConfig from "./BaseConfig.js"

class Context2dTextConfig extends BaseConfig{
    // fillAfterStroke = true;

    //-- font
    fontStyle = "normal";
    fontVariant = "normal"; // 사용하지 말자 fontVariantCaps 이걸 대신 사용하라
    // fontStretch = ""; // 기본 값에서 관리하고있음
    fontWeight = "normal";
    // fontSize = "10px"; //px 만 지원하자. 우선은...
    fontSizeNumber = "10"; //px 만 지원하자. 우선은...
    fontSizeUnit = "px"  //px 만 사용해라. pt로 해도 px로 자동 변환된다.
    // lineHeight = "1.5em";
    lineHeightNumber = "1.5";
    lineHeightUnit = "em";
    fontFamily = "sans-serif";
    //-- font

    // textColor = "#000000";
    color = "#000000";
    // padding = "0px";
    paddingNumber = "0";
    paddingUnit = "px";
    textAlign = "start";
    textBaseline = "alphabetic"; //lineHeight 기준으로 위치하게 됨. 이 설정은 의미가 없음.
    direction = "ltr";
    fontKerning = "auto";
    fontStretch = "normal";
    fontVariantCaps = "normal"; //fontVariant 가 small-caps 라면 small-caps 가 저장됨. 그외는 따로 저장.
    // letterSpacing = "0px";
    letterSpacingNumber = "0";
    letterSpacingUnit = "px";
    textRendering = "optimizeLegibility"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
    wordSpacing = "0px"; //20250107. 사파리에서 지원 안됨.

    verticalAlign = "top"; //top, middle, bottom

    // 최대한 자동 줄 바꿈이 되도록 설정한다.
    wordBreak = 'break-all'; // normal | break-all | keep-all | break-word;
    overflowWrap = 'break-word'; // normal | break-word;
    whiteSpace = 'break-spaces'; // break-spaces(자동줄바꿈+줄바꿈O+공백압축X+끝의공백유지) (이게 기본) | pre(줄바꿈O+공백압축X)    |이 뒤로는 지원 안함 normal (자동줄바꿈+공백압축O) | nowrap(줄바꿈X+공백압축O) |  | pre-wrap(자동줄바꿈+줄바꿈O+공백압축X+끝의공백사라짐)   | pre-line(자동줄바꿈+줄바꿈O+공백압축O) | 
    //whiteSpace 는 break-spaces 로 고정하자. 답이 없다.


    constructor(ctx=null){
        const proxyConfig = {
            number:['fontSizeNumber','lineHeightNumber','paddingNumber','letterSpacingNumber',],
            boolean:null,
            keys:['font','fontStretch','lineHeight','color','padding','textAlign','textBaseline','direction','fontKerning','fontVariantCaps','letterSpacing','textRendering','wordSpacing','verticalAlign','wordBreak','overflowWrap','whiteSpace']
        }
        const proxy = super(proxyConfig);
        proxy.reset();
        return proxy;
    }
    get font(){
        const r = [];
        
        if(this.fontStyle !=='' && this.fontStyle != 'normal'){ r.push(this.fontStyle);} 
        if(this.fontVariant !=='' && this.fontVariant != 'normal'){ r.push(this.fontVariant); } // 따로 관리됨 fontVariantCaps
        if(this.fontStretch !=='' && this.fontStretch != 'normal'){ r.push(this.fontStretch); } // 따로 관리됨 fontStretch
        if(this.fontWeight !=='' && this.fontWeight != 'normal'){ r.push(this.fontWeight); }
        // if(this.fontSize != '') r.push(this.fontSize);
        if(this.lineHeight !== null){ r.push(this.fontSize+'/'+this.lineHeight); } 
        else{ r.push(this.fontSize); } 
        if(this.fontFamily != '' && this.fontFamily !== null){ r.push(this.fontFamily); }
        else{ r.push('sans-serif'); }
        return r.join(' ');
    }
    set font(v){
        const r = CssFontUtil.parse(v);
        if(r===null){ throw new Error("This format is not allowed. "+v); }

        this.fontStyle = r.fontStyle??'normal';
        this.fontVariant = r.fontVariant??'normal';
        this.fontStretch = r.fontStretch??'normal';
        this.fontWeight = r.fontWeight??'normal';
        this.fontSize = r.fontSize??null;
        if(r.lineHeight !== null) this.lineHeight = r.lineHeight??null;
        this.fontFamily = r.fontFamily??null;

        if(r.fontFamily === null){ r.fontFamily = 'sans-serif'; } //이전에 에러나야함

    }
    get fontSize(){
        return this.fontSizeNumber+this.fontSizeUnit;
    }
    set fontSize(v){ 
        const r = CssLengthUtil.parse(v); this.fontSizeNumber = r.number; this.fontSizeUnit = r.unit;
    }
    get fontSizePx(){
        return CssLengthUtil.convertToPx(this.fontSize);
    }
    get lineHeight(){
        return this.lineHeightNumber+this.lineHeightUnit;
    }
    set lineHeight(v){ 
        const r = CssLengthUtil.parse(v); this.lineHeightNumber = r.number; this.lineHeightUnit = r.unit;
    }
    get lineHeightPx(){
        return CssLengthUtil.pxBasedOnFontSize(this.lineHeight,this.fontSize);
    }
    get padding(){
        return this.paddingNumber+this.paddingUnit;
    }
    set padding(v){ 
        const r = CssLengthUtil.parse(v); this.paddingNumber = r.number; this.paddingUnit = r.unit; 
    }
    get paddingPx(){
        return CssLengthUtil.pxBasedOnFontSize(this.padding,this.fontSize);
    }
    get letterSpacing(){
        return this.letterSpacingNumber+this.letterSpacingUnit;
    }
    set letterSpacing(v){ 
        const r = CssLengthUtil.parse(v); this.letterSpacingNumber = r.number; this.letterSpacingUnit = r.unit; 
    }
    get letterSpacingPx(){
        return CssLengthUtil.pxBasedOnFontSize(this.letterSpacing,this.fontSize);
    }


    /**
     * 텍스트 색상을 설정합니다.
     * @param {string} v - 설정할 색상 값 (예: '#ff0000', 'red' 등)
     * @alias color
     */
    set textColor(v) {
        this.color = v;
    }

    /**
     * 현재 텍스트 색상을 반환합니다.
     * @returns {string} 현재 설정된 색상 값
     * @alias color
     */
    get textColor() {
        return this.color;
    }

    // /**
    //  * 텍스트 색상을 설정합니다.
    //  * @param {string} v - 설정할 색상 값 (예: '#ff0000', 'red' 등)
    //  * @alias textColor
    //  */
    // set color(v) {
    //     this.textColor = v;
    // }

    // /**
    //  * 현재 텍스트 색상을 반환합니다.
    //  * @returns {string} 현재 설정된 색상 값
    //  * @alias textColor
    //  */
    // get color() {
    //     return this.textColor;
    // }
    

    reset(){
        this.font = "20px sans-serif";
        // this.fontStyle = "";
        // this.fontFamily = "sans-serif";
        this.fontSize = "20px"; //px 만 지원하자. 우선은...
        // this.fontSizeNumber = "10"; //px 만 지원하자. 우선은...
        // this.fontSizeUnit = "px"; //px 만 지원하자. 우선은...
        this.color = "#000000";
        // this.textColor = "#000000";
        this.padding = "0px";
        // this.paddingNumber = "0";
        // this.paddingUnit = "px";
        this.textAlign = "start";
        this.lineHeight = "1.5em"
        // this.lineHeightNumber = "1.5";
        // this.lineHeightUnit = "em";
        this.textBaseline = "alphabetic";
        this.direction = "ltr";
        this.fontKerning = "auto";
        this.fontStretch = "normal";
        this.fontVariantCaps = "normal";
        this.letterSpacing = "0px";
        // this.letterSpacingNumber = "0";
        // this.letterSpacingUnit = "px";
        this.textRendering = "optimizeLegibility"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
        this.wordSpacing = "0px";
        this.verticalAlign = "top";
        this.wordBreak = 'break-all';
        this.overflowWrap = 'break-word';
        this.whiteSpace = 'break-spaces';
        
    }

    assignTo(context){
        super.assignTo(context);
        context.fillStyle = this.textColor;
    }

    exportToStyleObject(){
        return {
            font:this.font,
            fontSize:this.fontSize,
            textColor:this.textColor,
            color:this.color,
            padding:this.padding,
            textAlign:this.textAlign,
            lineHeight:this.lineHeight,
            textBaseline:this.textBaseline,
            direction:this.direction,
            // fontKerning:this.fontKerning,
            // fontStretch:this.fontStretch,
            // fontVariantCaps:this.fontVariantCaps,
            letterSpacing:this.letterSpacing,
            textRendering:this.textRendering,
            wordSpacing:this.wordSpacing,
            // verticalAlign:this.verticalAlign,
            wordBreak:this.wordBreak,
            overflowWrap:this.overflowWrap,
            whiteSpace:this.whiteSpace,
        }
    }

}


// enumerable. 열거가능처리. proxy의 keys 에서 처리함
// ['font','fontSize','lineHeight','padding', 'letterSpacing',].forEach((v)=>{
// 	const d = Object.getOwnPropertyDescriptor(Context2dTextConfig.prototype,v); d.enumerable=true; Object.defineProperty(Context2dTextConfig.prototype,v,d);   
// })


export default Context2dTextConfig;
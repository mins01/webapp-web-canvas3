import CssLengthUtil from "./CssLengthUtil.js";

class Context2dConfig{
    // fillAfterStroke = true;

    globalAlpha = 1;
    globalCompositeOperation = "source-over";
    filter = "none";
    imageSmoothingEnabled = "true";
    imageSmoothingQuality = "low";
    strokeStyle = "#000000";
    fillStyle = "#ffffff";
    shadowOffsetX = 0;
    shadowOffsetY = 0;
    shadowBlur = 0;
    shadowColor = "rgba(0, 0, 0, 0)";
    lineWidth = 1;

    lineCap = "round";
    lineJoin = "round";
    miterLimit = 10;
    lineDashOffset = 0;
    //font
    fontStyle = "";
    fontFamily = "sans-serif";
    // fontSize = "10px"; //px 만 지원하자. 우선은...
    fontSizeNumber = "10"; //px 만 지원하자. 우선은...
    fontSizeUnit = "px"  //px 만 사용해라. pt로 해도 px로 자동 변환된다.
    // textPadding = "0px";
    textPaddingNumber = "0";
    textPaddingUnit = "px";
    textAlign = "start";
    // lineHeight = "1.5em";
    lineHeightNumber = "1.5";
    lineHeightUnit = "em";
    textBaseline = "alphabetic";
    direction = "ltr";
    fontKerning = "auto";
    fontStretch = "normal";
    fontVariantCaps = "normal";
    // letterSpacing = "0px";
    letterSpacingNumber = "0";
    letterSpacingUnit = "px";
    textRendering = "optimizeLegibility"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
    wordSpacing = "0px"; //20250107. 사파리에서 지원 안됨.

    // fillAfterStroke = true;
    // disableStroke = false;
    // disableFill = false;
    #fillAfterStroke = true;
    #disableStroke = false;
    #disableFill = false;

    strokeLocation = 'inside';


    constructor(ctx=null){
        this.reset();
    }
    get font(){
        return `${this.fontStyle} ${this.fontSize} ${this.fontFamily}`.trim();
    }
    set font(v){
        // console.log(v);
        
        const r = this.constructor.parseFont(v);
        if((r?.fontStyle??null) != null){this.fontStyle = r.fontStyle;}
        if((r?.fontSize??null) != null){this.fontSize = r.fontSize;}
        if((r?.fontFamily??null) != null){this.fontFamily = r.fontFamily;}
        if((r?.lineHeight??null) != null){this.lineHeight = r.lineHeight;}
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
    get textPadding(){
        return this.textPaddingNumber+this.textPaddingUnit;
    }
    set textPadding(v){ 
        const r = CssLengthUtil.parse(v); this.textPaddingNumber = r.number; this.textPaddingUnit = r.unit; 
    }
    get letterSpacing(){
        return this.letterSpacingNumber+this.letterSpacingUnit;
    }
    set letterSpacing(v){ 
        const r = CssLengthUtil.parse(v); this.letterSpacingNumber = r.number; this.letterSpacingUnit = r.unit; 
    }
    
    get lineHeightPx(){
        const r = CssLengthUtil.sizeBasedOnFontSize(this.lineHeight,this.fontSize);
        if(r === null){ return null; }
        return CssLengthUtil.convertToPx(r);
    }
    get textPaddingPx(){
        const r = CssLengthUtil.sizeBasedOnFontSize(this.textPadding,this.fontSize);
        if(r === null){ return null; }
        return CssLengthUtil.convertToPx(r);
    }

    get fillAfterStroke(){
        return this.#fillAfterStroke;
    }
    set fillAfterStroke(v){ 
        if(v==='true') this.#fillAfterStroke = true;
        else if(v==='false') this.#fillAfterStroke = false;
        else this.#fillAfterStroke = !!v;
    }
    get disableStroke(){
        return this.#disableStroke;
    }
    set disableStroke(v){ 
        if(v==='true') this.#disableStroke = true;
        else if(v==='false') this.#disableStroke = false;
        else this.#disableStroke = !!v;
    }
    get disableFill(){
        return this.#disableFill;
    }
    set disableFill(v){ 
        if(v==='true') this.#disableFill = true;
        else if(v==='false') this.#disableFill = false;
        else this.#disableFill = !!v;
    }





    toObject(){
        const robj = {}
        for(let k in this){
            robj[k] = this[k];
        }
        return robj;
    }
    toJSON(){
        return this.toObject();
    }

    reset(){
        this.fillAfterStroke = true;

        this.globalAlpha = 1;
        this.globalCompositeOperation = "source-over";
        this.filter = "none";
        this.imageSmoothingEnabled = "true";
        this.imageSmoothingQuality = "low";
        this.strokeStyle = "#000000";
        this.fillStyle = "#ffffff";
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.shadowBlur = 0;
        this.shadowColor = "rgba(0, 0, 0, 0)";
        this.lineWidth = 1;
        // this.lineCap = "butt";
        // this.lineJoin = "miter";
        this.lineCap = "round";
        this.lineJoin = "round";
        this.miterLimit = 10;
        this.lineDashOffset = 0;
        this.font = "10px sans-serif";
        // this.fontStyle = "";
        // this.fontFamily = "sans-serif";
        this.fontSize = "10px"; //px 만 지원하자. 우선은...
        // this.fontSizeNumber = "10"; //px 만 지원하자. 우선은...
        // this.fontSizeUnit = "px"; //px 만 지원하자. 우선은...
        this.textPadding = "0px";
        // this.textPaddingNumber = "0";
        // this.textPaddingUnit = "px";
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

        this.fillAfterStroke = true;
        this.disableStroke = false;
        this.disableFill = false;

        this.strokeLocation = 'inside';// inside 로 고정
    }

    static parseFont(v){
        const parts = v.split(/\s+/);
        // console.log(parts);
        let fontStyles = [];
        let fontSize = null;
        let lineHeight = null;
        let fontFamilies = [];
        parts.forEach(part => {
            if(part.match(/\d/)){  //숫자가 있다면 폰트 사이즈로 처리.
                let subpart = part.split('/');
                if(subpart.length>=2){
                    fontSize = subpart[0]
                    lineHeight = subpart[1]
                }else{
                    fontSize = part;
                }
            }else{
                if(fontSize === null){
                    fontStyles.push(part);
                }else{
                    fontFamilies.push(part);
                }
            }
        });
        return {
            fontStyle:fontStyles.join(' '),
            fontSize,
            lineHeight:lineHeight,
            fontFamily:fontFamilies.join(', '),
        }
    }

}


// enumerable. 열거가능처리.
['font','fontSize','lineHeight','textPadding',
    // 'lineHeightPx','textPaddingPx',
    'letterSpacing','fillAfterStroke','disableStroke','disableFill'].forEach((v)=>{
	const d = Object.getOwnPropertyDescriptor(Context2dConfig.prototype,v); d.enumerable=true; Object.defineProperty(Context2dConfig.prototype,v,d);   
})


export default Context2dConfig;
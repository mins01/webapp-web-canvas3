import CssLengthUtil from "./CssLengthUtil.js";
import CssFontUtil from "./CssFontUtil.js";

class Context2dTextConfig{
    // fillAfterStroke = true;

    //-- font
    fontStyle = "";
    fontVariant = ""; // 사용하지 말자 fontVariantCaps 이걸 대신 사용하라
    // fontStretch = ""; // 기본 값에서 관리하고있음
    fontWeight = "";
    // fontSize = "10px"; //px 만 지원하자. 우선은...
    fontSizeNumber = "10"; //px 만 지원하자. 우선은...
    fontSizeUnit = "px"  //px 만 사용해라. pt로 해도 px로 자동 변환된다.
    // lineHeight = "1.5em";
    lineHeightNumber = "1.5";
    lineHeightUnit = "em";
    fontFamily = "";
    //-- font

    textColor = "#000000";
    // textPadding = "0px";
    textPaddingNumber = "0";
    textPaddingUnit = "px";
    textAlign = "start";
    textBaseline = "alphabetic";
    direction = "ltr";
    fontKerning = "auto";
    fontStretch = "normal";
    fontVariantCaps = "normal"; //fontVariant 가 small-caps 라면 small-caps 가 저장됨. 그외는 따로 저장.
    // letterSpacing = "0px";
    letterSpacingNumber = "0";
    letterSpacingUnit = "px";
    textRendering = "optimizeLegibility"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
    wordSpacing = "0px"; //20250107. 사파리에서 지원 안됨.
    

    constructor(ctx=null){
        this.reset();
    }
    get font(){
        const r = [];
        
        if(this.fontStyle != ''){ r.push(this.fontStyle);} 
        if(this.fontVariant != '' && this.fontVariant !='normal'){ r.push(this.fontVariant); } // 따로 관리됨 fontVariantCaps
        if(this.fontStretch != '' && this.fontStretch !='normal'){ r.push(this.fontStretch); } // 따로 관리됨 fontStretch
        if(this.fontWeight != '' && this.fontWeight !='normal'){ r.push(this.fontWeight); }
        // if(this.fontSize != '') r.push(this.fontSize);
        if(this.lineHeight != ''){ r.push(this.fontSize+'/'+this.lineHeight); } 
        else{ r.push(this.fontSize); } 
        if(this.fontFamily != ''){ r.push(this.fontFamily); }
        else{ r.push('sans-serif'); }
        return r.join(' ');
    }
    set font(v){
        const r = CssFontUtil.parse(v);
        if(r===null){ throw new Error("This format is not allowed. "+v); }

        this.fontStyle = r.fontStyle;
        this.fontVariant = r.fontVariant;
        this.fontStretch = r.fontStretch;
        this.fontWeight = r.fontWeight;
        this.fontSize = r.fontSize;
        if(r.lineHeight.length) this.lineHeight = r.lineHeight;
        this.fontFamily = r.fontFamily;

        if(r.fontFamily==''){ r.fontFamily = 'sans-serif'; }

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
    
    // @deprecated
    get lineHeightPx(){
        const r = CssLengthUtil.sizeBasedOnFontSize(this.lineHeight,this.fontSize);
        if(r === null){ return null; }
        return CssLengthUtil.convertToPx(r);
    }
    // @deprecated
    get textPaddingPx(){
        const r = CssLengthUtil.sizeBasedOnFontSize(this.textPadding,this.fontSize);
        if(r === null){ return null; }
        return CssLengthUtil.convertToPx(r);
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
        this.font = "10px sans-serif";
        // this.fontStyle = "";
        // this.fontFamily = "sans-serif";
        this.fontSize = "10px"; //px 만 지원하자. 우선은...
        // this.fontSizeNumber = "10"; //px 만 지원하자. 우선은...
        // this.fontSizeUnit = "px"; //px 만 지원하자. 우선은...
        this.textColor = "#000";
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
    }

    assign(context,foreColorToFillStyle=false){
        for(let k in this){
            if(context[k] !== undefined){
                context[k] = this[k];                
            }
        }
        context.fillStyle = this.textColor;
    }

}


// enumerable. 열거가능처리.
['font','fontSize','lineHeight','textPadding', 'letterSpacing',].forEach((v)=>{
	const d = Object.getOwnPropertyDescriptor(Context2dTextConfig.prototype,v); d.enumerable=true; Object.defineProperty(Context2dTextConfig.prototype,v,d);   
})


export default Context2dTextConfig;
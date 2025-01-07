class Context2dConfig{
    fillAfterStroke = true;

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
    fontSize = "10px"; //px 만 지원하자. 우선은...
    textAlign = "start";
    lineHeight = "1.5em";
    textBaseline = "alphabetic";
    direction = "ltr";
    fontKerning = "auto";
    fontStretch = "normal";
    fontVariantCaps = "normal";
    letterSpacing = "0px";
    textRendering = "auto"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
    wordSpacing = "0px";

    constructor(ctx=null){
        this.reset();
    }
    get font(){
        return `${this.fontStyle} ${this.fontSize} ${this.fontFamily}`.trim();
    }
    set font(v){
        const r = this.constructor.parseFont(v);
        if((r?.fontStyle??null) != null){this.fontStyle = r.fontStyle;}
        if((r?.fontSize??null) != null){this.fontSize = r.fontSize;}
        if((r?.fontFamily??null) != null){this.fontFamily = r.fontFamily;}
        if((r?.lineHeight??null) != null){this.lineHeight = r.lineHeight;}
    }
    get fontSizePx(){
        return parseInt(this.fontSize);
    }
    get lineHeightPx(){
        return parseInt(this.constructor.parseLineHeight(this.lineHeight,this.fontSize));
    }

    toObject(){
        const robj = {}
        for(let k in this){
            robj[k] = this[k];
        }
        return robj;
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
        // this.font = "10px sans-serif";
        this.fontStyle = "";
        this.fontFamily = "sans-serif";
        this.fontSize = "10px"; //px 만 지원하자. 우선은...
        this.textAlign = "start";
        this.lineHeight = "1.5em"
        this.textBaseline = "alphabetic";
        this.direction = "ltr";
        this.fontKerning = "auto";
        this.fontStretch = "normal";
        this.fontVariantCaps = "normal";
        this.letterSpacing = "0px";
        this.textRendering = "auto"; // auto,optimizeSpeed,optimizeLegibility,geometricPrecision
        this.wordSpacing = "0px";
    }

    static parseFont(v){
        const parts = v.split(/\s+/);
        console.log(parts);
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
            // lineHeight:this.parseLineHeight(lineHeight,fontSize),
            lineHeight:lineHeight,
            fontFamily:fontFamilies.join(', '),
        }
    }
    static parseLineHeight(lineHeight,fontSize){
        
        const lhr = lineHeight.matchAll(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/g);
        const lhrs = [...lhr]; if(!lhrs || !lhrs[0]){ return null}
        const lineHeightNumber = parseFloat(lhrs[0][1]);
        const lineHeightUnit = (lhrs[0][2]??null);
        const fsr = fontSize.matchAll(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/g);
        const fsrs = [...fsr]; if(!fsrs || !fsrs[0]){ return null}
        const fontSizeNumber = parseFloat(fsrs[0][1]);
        const fontSizeUnit = (fsrs[0][2]??null);

        // console.log(lhrs,fsrs);

        // const fsrr = fsr[0]??null;
        let r = '';
        if(!lineHeightUnit){
            r = (lineHeightNumber*fontSizeNumber)+fontSizeUnit;
        }else if(lineHeightUnit=='em'){
            r = (lineHeightNumber*fontSizeNumber)+fontSizeUnit;
        }else if(lineHeightUnit=='%'){
            r = (lineHeightNumber*fontSizeNumber/100)+fontSizeUnit;
        }else{
            r = lineHeight;
        }
        return r;
        
    }
}

// enumerable. 열거가능처리.
['font','lineHeightPx'].forEach((v)=>{
	const d = Object.getOwnPropertyDescriptor(Context2dConfig.prototype,v); d.enumerable=true; Object.defineProperty(Context2dConfig.prototype,v,d);   
})


export default Context2dConfig;
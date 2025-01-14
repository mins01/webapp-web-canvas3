import BaseConfig from "./BaseConfig.js"

class Context2dConfig extends BaseConfig{
    globalAlpha = 1;
    globalCompositeOperation = "source-over";
    filter = "none";
    imageSmoothingEnabled = true;
    imageSmoothingQuality = "high"; // default: low
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
    
    fillAfterStroke = true;
    disableStroke = false;
    disableFill = false;

    strokeLocation = 'inside';

    constructor(ctx=null){
        const proxyConfig = {
            number:['globalAlpha','shadowOffsetX','shadowOffsetY','shadowBlur','lineWidth','miterLimit','lineDashOffset',],
            boolean:['imageSmoothingEnabled','fillAfterStroke','disableStroke','disableFill',],
        }
        const proxy = super(proxyConfig);
        this.reset();
        return proxy;
    }
    
    reset(){

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

        this.fillAfterStroke = true;
        this.disableStroke = false;
        this.disableFill = false;

        this.strokeLocation = 'inside';// inside 로 고정
    }

    assignTo(context,foreColorToFillStyle=false){
        super.assignTo(context);
        if(!foreColorToFillStyle){
            context.strokeStyle = this.foreColor;
            context.fillStyle = this.backColor;
        }else{
            context.strokeStyle = this.backColor;
            context.fillStyle = this.foreColor;
        }
    }


}


// enumerable. 열거가능처리.
// [
//     // 'font','fontSize','lineHeight','textPadding',
//     // 'lineHeightPx','textPaddingPx',
//     // 'letterSpacing',
//     'fillAfterStroke','disableStroke','disableFill'].forEach((v)=>{
// 	const d = Object.getOwnPropertyDescriptor(Context2dConfig.prototype,v); d.enumerable=true; Object.defineProperty(Context2dConfig.prototype,v,d);   
// })


export default Context2dConfig;
import CssLengthUtil from "./CssLengthUtil.js";
import CssFontUtil from "./CssFontUtil.js";


import ProxyConfig from "./ProxyConfig.js"

class BrushConfig extends ProxyConfig{
    // 브러시 모양: Brush Tip Shape
    size = 50; //크기 px . diameter
    angle = 0; //각도 deg 
    roundness = 1; // 원형율
    flipX = false; //x 뒤집기. 사용안할 예정
    flipY = false; //y 뒤집기. 사용안할 예정
    hardness = 1; // 경도
    spacing = 0.25; //간격
    // 모양: Shape Dynamics
    sizeJitter = 0; //크기 지터
    sizeControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumDiameter = 0.25; //최소 크기
    angleJitter = 0; //각도 지터
    angleControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    roundnessJitter = 0;
    roundnessControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumRoundness = 0.25; //최소 크기
    // transfer
    opacity = 1; // 전체적 불투명도
    opacityJitter = 0
    opacityControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    flow = 1; // 하나의 투명도
    flowJitter = 0
    flowControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...

    // 기타
    solidColor = false; //색이 있는 부분을 픽셀화 함. alpha 값이 0 아니면 255가 됨
    

    constructor(){
        const proxyConfig = {
            number:['size','angle','roundness','hardness','spacing','sizeJitter','mininumDiameter','angleJitter','roundnessJitter','mininumRoundness','opacity','opacityJitter','flow','flowJitter',],
            boolean:['flipX','flipY','solidColor',]
        }
        return super(proxyConfig);
        
    }
    
    reset(){
        // 브러시 모양: Brush Tip Shape
        this.size = 50; //크기 px . diameter
        this.angle = 0; //각도 deg 
        this.roundness = 1; // 원형율
        this.flipX = false; //x 뒤집기. 사용안할 예정
        this.flipY = false; //y 뒤집기. 사용안할 예정
        this.hardness = 1; // 경도
        this.spacing = 0.25; //간격
        // 모양: Shape Dynamics
        this.sizeJitter = 0; //크기 지터
        this.sizeControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.mininumDiameter = 0.25; //최소 크기
        this.angleJitter = 0; //각도 지터
        this.angleControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.roundnessJitter = 0;
        this.roundnessControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.mininumRoundness = 0.25; //최소 크기
        // transfer
        this.opacity = 1; // 전체적 불투명도
        this.opacityJitter = 0
        this.opacityControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.flow = 1; // 하나의 투명도
        this.flowJitter = 0
        this.flowControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    }



}


// enumerable. 열거가능처리.
// [].forEach((v)=>{
// 	const d = Object.getOwnPropertyDescriptor(BrushConfig.prototype,v); d.enumerable=true; Object.defineProperty(BrushConfig.prototype,v,d);   
// })


export default BrushConfig;
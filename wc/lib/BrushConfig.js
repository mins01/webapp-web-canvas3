import BaseConfig from "./BaseConfig.js"

class BrushConfig extends BaseConfig{
    // 브러시 모양: Brush Tip Shape
    shape = 'circle'; //원
    size = 5; //크기 px . diameter
    angle = 0; //각도 0~1
    roundness = 1; // 원형율 @deprecated . Please use scaleX, scaleY
    scaleX = 1; // 너비 배율
    scaleY = 1; // 높이 배율
    flipX = false; //x 뒤집기. 사용안할 예정
    flipY = false; //y 뒤집기. 사용안할 예정
    hardness = 1; // 경도
    spacing = 0.1; //간격
    // 모양: Shape Dynamics
    sizeJitter = 0; //크기 지터
    sizeControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumSizeRatio = 0.25; //최소 크기
    angleJitter = 0; //각도 지터
    angleControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    roundnessJitter = 0; // 이거 구현 힘드네..  나중에 하자.
    
    
    roundnessControl = 'off'; // @deprecated 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumRoundness = 0.25; //@deprecated 최소 크기

    scaleYControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumScaleY = 0.25; //최소 크기
    // transfer
    opacity = 1; // 전체적 불투명도
    opacityJitter = 0
    opacityControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
    mininumOpacity = 0.25; //최소 불투명도
    flow = 1; // 하나의 투명도 // 이거 어떻게 할지 모르겠다. 나중에 다시보자.
    flowJitter = 0
    flowControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...

    //color
    hueJitter = 0;
    saturationJitter = 0;
    brightnessJitter = 0;

    // 기타
    flattenOpacity = false; //색이 있는 부분을 픽셀화 함. alpha 값이 0 아니면 255가 됨
    

    constructor(){
        const proxyConfig = {
            number:['size','angle','roundness','scaleX','sacleY','hardness','spacing','sizeJitter','mininumSizeRatio','angleJitter','roundnessJitter','mininumRoundness','opacity','opacityJitter','flow','flowJitter','hueJitter','saturationJitter','brightnessJitter'],
            boolean:['flipX','flipY','flattenOpacity',],
        }
        const proxy = super(proxyConfig);
        this.reset();
        return proxy;
    }
    
    reset(){
        // 브러시 모양: Brush Tip Shape
        this.shape = 'circle'; //원
        this.size = 5; //크기 px . diameter
        this.angle = 0; //각도 deg 
        this.roundness = 1; // 원형율 @deprecated .  Please use scaleX, scaleY
        this.scaleX = 1; // 너비 배율
        this.scaleY = 1; // 높이 배율
        this.flipX = false; //x 뒤집기. 사용안할 예정
        this.flipY = false; //y 뒤집기. 사용안할 예정
        this.hardness = 1; // 경도
        this.spacing = 0.1; //간격
        // 모양: Shape Dynamics
        this.sizeJitter = 0; //크기 지터
        this.sizeControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.mininumSizeRatio = 0.25; //최소 크기
        this.angleJitter = 0; //각도 지터
        this.angleControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.roundnessJitter = 0;
        
        // this.roundnessControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...        
        // this.mininumRoundness = 0.25; //최소 크기
        
        this.scaleYControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.mininumScaleY = 0.25; //최소 크기

        // transfer
        this.opacity = 1; // 전체적 불투명도
        this.opacityJitter = 0
        this.opacityControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this.mininumOpacity = 0.25; //최소 불투명도
        this.flow = 1; // 하나의 투명도
        this.flowJitter = 0 // 구현 안했네.. 뭐하는거지?
        this.flowControl = 'off'; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...

        // color
        this.hueJitter = 0;
        this.saturationJitter = 0;
        this.brightnessJitter = 0;
    }



}


// enumerable. 열거가능처리.
// [].forEach((v)=>{
// 	const d = Object.getOwnPropertyDescriptor(BrushConfig.prototype,v); d.enumerable=true; Object.defineProperty(BrushConfig.prototype,v,d);   
// })


export default BrushConfig;
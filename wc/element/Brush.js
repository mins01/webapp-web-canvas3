import Layer from "./Layer.js";
import DrawCircle from "../draw/DrawCircle.js"

export default class Brush extends Layer{

    constructor(w=null,h=null){
        super(w,h);
        this.parent = null;
        
        // 브러시 모양: Brush Tip Shape
        this._size = 50; //크기 px
        this._angle = 0; //각도 deg 
        this._roundness = 1; // 원형율
        this._flipX = false; //x 뒤집기. 사용안할 예정
        this._flipY = false; //y 뒤집기. 사용안할 예정
        this._hardness = 1; // 경도
        this._spacing = 0.25; //간격
        // 모양: Shape Dynamics
        this._sizeJitter = 0; //크기 지터
        this._sizeControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this._mininumDiameter = 0.25; //최소 크기
        this._angleJitter = 0; //각도 지터
        this._angleControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this._roundnessJitter = 0;
        this._roundnessControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this._mininumRoundness = 0.25; //최소 크기
        // transfer
        this._opacity = 1; // 전체적 투명도
        this._opacityJitter = 0
        this._opacityControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        this._flow = 1; // 하나의 투명도
        this._flowJitter = 0
        this._flowControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...

        this.init();

        this.draw();


    }
    static defineCustomElements(name='wc-brush'){
        super.defineCustomElements(name);
    }

    init(){
        
    }





    get size(){ return this._size; }
    get angle(){ return this._angle; }
    get roundness(){ return this._roundness; }
    get flipX(){ return this._flipX; }
    get flipY(){ return this._flipY; }
    get hardness(){ return this._hardness; }
    get spacing(){ return this._spacing; }
    
    get sizeJitter(){ return this._sizeJitter; }
    get sizeControl(){ return this._sizeControl; }
    get mininumDiameter(){ return this._mininumDiameter; }
    get angleJitter(){ return this._angleJitter; }
    get angleControl(){ return this._angleControl; }
    get roundnessJitter(){ return this._roundnessJitter; }
    get roundnessControl(){ return this._roundnessControl; }
    get mininumRoundness(){ return this._mininumRoundness; }
    
    get opacity(){ return this._opacity; }
    get opacityJitter(){ return this._opacityJitter; }
    get opacityControl(){ return this._opacityControl; }
    get flow(){ return this._flow; }
    get flowJitter(){ return this._flowJitter; }
    get flowControl(){ return this._flowControl; }

    set size(v){ this._size = v; this.draw(); }
    set angle(v){ this._angle = v; this.draw(); }
    set roundness(v){ this._roundness = v; this.draw(); }
    set flipX(v){ this._flipX = v; this.draw(); }
    set flipY(v){ this._flipY = v; this.draw(); }
    set hardness(v){ this._hardness = v; this.draw(); }
    set spacing(v){ this._spacing = v; this.draw(); }

    set sizeJitter(v){ this._sizeJitter = v; this.draw(); }
    set sizeControl(v){ this._sizeControl = v; this.draw(); }
    set mininumDiameter(v){ this._mininumDiameter = v; this.draw(); }
    set angleJitter(v){ this._angleJitter = v; this.draw(); }
    set angleControl(v){ this._angleControl = v; this.draw(); }
    set roundnessJitter(v){ this._roundnessJitter = v; this.draw(); }
    set roundnessControl(v){ this._roundnessControl = v; this.draw(); }
    set mininumRoundness(v){ this._mininumRoundness = v; this.draw(); }

    set opacity(v){ this._opacity = v; this.draw(); }
    set opacityJitter(v){ this._opacityJitter = v; this.draw(); }
    set opacityControl(v){ this._opacityControl = v; this.draw(); }
    set flow(v){ this._flow = v; this.draw(); }
    set flowJitter(v){ this._flowJitter = v; this.draw(); }
    set flowControl(v){ this._flowControl = v; this.draw(); }


    createRadialGradient(ctx,r){
        // const ctx = this.ctx;
        const gradient = ctx.createRadialGradient(r, r, 0, r, r, r*2);

        gradient.addColorStop(0, ctx.fillStyle);
        if(this.hardness !== 1){
            gradient.addColorStop(this.hardness, '#00000000');
            gradient.addColorStop(1, '#00000000');
        }else{
            gradient.addColorStop(1, ctx.fillStyle);
        }
        return gradient;
    }
    draw(){
        this.width = this.size;
        this.height = this.size;
        const ctx = this.ctx;
        const r = this.size/2
        const x = r, y = r;
        
        ctx.fillStyle ='#ffcc9999';

        const gradient = this.createRadialGradient(ctx,r);
        ctx.save();
        ctx.fillStyle = gradient;
        DrawCircle.draw(this.ctx,x,y,r,{disableStroke:true})
        ctx.restore();
    }

}
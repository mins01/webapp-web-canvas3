import Layer from "./Layer.js";
import DrawCircle from "../draw/DrawCircle.js"

import DrawEllipse from "../draw/DrawEllipse.js";

import PathShape from "../draw/PathShape.js";
import jsColor from "../lib/jsColor.js";
import Canvas from "./Canvas.js";

import BrushConfig from "../lib/BrushConfig.js";

export default class Brush extends Layer{

    margin = 2;
    constructor(w=null,h=null){
        super(w,h);
        this.parent = null;
        
        // 브러시 모양: Brush Tip Shape
        // this._size = 50; //크기 px . diameter
        // this._angle = 0; //각도 deg 
        // this._roundness = 1; // 원형율
        // this._flipX = false; //x 뒤집기. 사용안할 예정
        // this._flipY = false; //y 뒤집기. 사용안할 예정
        // this._hardness = 1; // 경도
        // this._spacing = 0.25; //간격
        // // 모양: Shape Dynamics
        // this._sizeJitter = 0; //크기 지터
        // this._sizeControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        // this._mininumDiameter = 0.25; //최소 크기
        // this._angleJitter = 0; //각도 지터
        // this._angleControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        // this._roundnessJitter = 0;
        // this._roundnessControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        // this._mininumRoundness = 0.25; //최소 크기
        // // transfer
        // this._opacity = 1; // 전체적 불투명도
        // this._opacityJitter = 0
        // this._opacityControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...
        // this._flow = 1; // 하나의 투명도
        // this._flowJitter = 0
        // this._flowControl = ''; // 크기 조절. off, fade,  penPressure, penTilt , stylusWheel ...

        this.brushConfig = new BrushConfig();
        this.shapeCanvas = new Canvas();
        this.init();

        this.draw();


    }
    static defineCustomElements(name='wc-brush'){
        super.defineCustomElements(name);
    }

    init(){
        
    }

    setBrushConfig(conf){
        Object.assign(this.brushConfig,conf)
    }




    // get size(){ return this._size; }
    // get angle(){ return this._angle; }
    // get roundness(){ return this._roundness; }
    // get flipX(){ return this._flipX; }
    // get flipY(){ return this._flipY; }
    // get hardness(){ return this._hardness; }
    // get spacing(){ return this._spacing; }
    
    // get sizeJitter(){ return this._sizeJitter; }
    // get sizeControl(){ return this._sizeControl; }
    // get mininumDiameter(){ return this._mininumDiameter; }
    // get angleJitter(){ return this._angleJitter; }
    // get angleControl(){ return this._angleControl; }
    // get roundnessJitter(){ return this._roundnessJitter; }
    // get roundnessControl(){ return this._roundnessControl; }
    // get mininumRoundness(){ return this._mininumRoundness; }
    
    // get opacity(){ return this._opacity; }
    // get opacityJitter(){ return this._opacityJitter; }
    // get opacityControl(){ return this._opacityControl; }
    // get flow(){ return this._flow; }
    // get flowJitter(){ return this._flowJitter; }
    // get flowControl(){ return this._flowControl; }

    // set size(v){ this._size = v; this.draw(); }
    // set angle(v){ this._angle = v; this.draw(); }
    // set roundness(v){ this._roundness = v; this.draw(); }
    // set flipX(v){ this._flipX = v; this.draw(); }
    // set flipY(v){ this._flipY = v; this.draw(); }
    // set hardness(v){ this._hardness = v; this.draw(); }
    // set spacing(v){ this._spacing = v; this.draw(); }

    // set sizeJitter(v){ this._sizeJitter = v; this.draw(); }
    // set sizeControl(v){ this._sizeControl = v; this.draw(); }
    // set mininumDiameter(v){ this._mininumDiameter = v; this.draw(); }
    // set angleJitter(v){ this._angleJitter = v; this.draw(); }
    // set angleControl(v){ this._angleControl = v; this.draw(); }
    // set roundnessJitter(v){ this._roundnessJitter = v; this.draw(); }
    // set roundnessControl(v){ this._roundnessControl = v; this.draw(); }
    // set mininumRoundness(v){ this._mininumRoundness = v; this.draw(); }

    // set opacity(v){ this._opacity = v; this.draw(); }
    // set opacityJitter(v){ this._opacityJitter = v; this.draw(); }
    // set opacityControl(v){ this._opacityControl = v; this.draw(); }
    // set flow(v){ this._flow = v; this.draw(); }
    // set flowJitter(v){ this._flowJitter = v; this.draw(); }
    // set flowControl(v){ this._flowControl = v; this.draw(); }


    createRadialGradient(ctx,x0, y0, r0, x1, y1, r1){
        // const ctx = this.ctx;
        const brushConfig = this.brushConfig;
        const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        const c = jsColor.Color.from(ctx.fillStyle);
        c.a = 0;
        gradient.addColorStop(0, ctx.fillStyle);
        if(brushConfig.hardness < 1){
            gradient.addColorStop(brushConfig.hardness, ctx.fillStyle);
            gradient.addColorStop(1, c.toHexa());
        }else{
            gradient.addColorStop(1, ctx.fillStyle);
        }
        return gradient;
    }

    applyShapeCanvas(){
        const brushConfig = this.brushConfig;
        const shape = this.shapeCanvas;
        const ctx = shape.ctx;
        const size = parseFloat(brushConfig.size);
        

        shape.width = size + this.margin * 2;
        shape.height = size + this.margin * 2;
        const r = size/2;
        const x = shape.width/2;
        const y = x;

        this.contextConfig.assign(ctx,true);
        // console.log(ctx.fillStyle);

        const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, r);
        ctx.save();
        ctx.globalAlpha = parseFloat(this.flow)
        // ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        PathShape.circle(ctx,x,y,r)
        ctx.closePath();
        ctx.fill()
        // ctx.stroke()
        ctx.restore();
    }

    draw(){
        const brushConfig = this.brushConfig;
        const shape = this.shapeCanvas;
        const ctx = this.ctx;
        const size = parseFloat(brushConfig.size);

        this.width = size + this.margin * 2;
        this.height = size + this.margin * 2;
        
        
        this.contextConfig.disableStroke = true;
        this.contextConfig.assign(ctx,true);

        this.applyShapeCanvas()


        const dw = this.width;
        const dh = this.height * brushConfig.roundness;
        const dx = 0 - this.margin;
        const dy = (this.height-dh)/2 - this.margin;

        const tx = Math.floor(this.width/2) +this.margin;
        const ty = Math.floor(this.height/2) +this.margin;

        ctx.save();
        // ctx.filter = 'hue-rotate(180deg)';
        // ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = parseFloat(brushConfig.opacity)        
        ctx.translate(tx, ty); // 회전할 중심(기준점) 설정 (캔버스 중앙으로 이동)
        ctx.rotate(Math.PI * brushConfig.angle); // 45도 회전 (Math.PI / 4 라디안)
        ctx.translate(this.width/-2, this.height/-2); // 중심을 원래 위치로 되돌림
        ctx.drawImage(shape,0,0,shape.width,shape.height,dx,dy,dw,dh);
        ctx.restore();
    }


    drawOnLine(ctx,x0, y0, x1, y1 , remainInterval = 0) {
        const image = this
        const brushConfig = this.brushConfig;
        const interval = brushConfig.size * Math.max(0.001,brushConfig.spacing);
        // 선의 길이를 계산
        let r = brushConfig.size / 2;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < interval){
            if(interval<=remainInterval){
                let x = x0 + 0 * dx;
                let y = y0 + 0 * dy;   
                // 이미지 그리기
                // ctx.imageSmoothingEnabled = false;

                ctx.drawImage(image, x - r, y - r);
                return remainInterval-interval;
            }else{
                return remainInterval+distance;
            }
            
        }else{
            // 선의 길이에 맞춰 이미지가 반복되도록 반복문을 돌린다
            let steps = Math.floor(distance / interval);
    
            for (let i = 0; i < steps; i++) {
                // 선 상의 각 점 계산
                let t = i / steps;
                let x = x0 + t * dx;
                let y = y0 + t * dy;   
                // 이미지 그리기
                // ctx.imageSmoothingEnabled = false;

                ctx.drawImage(image, x - r, y - r);
            }

            remainInterval = distance % interval
            return remainInterval;
            
        }

    }

}
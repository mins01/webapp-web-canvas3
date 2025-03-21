import Layer from "./Layer.js";
import DrawCircle from "../draw/DrawCircle.js"

import DrawEllipse from "../draw/DrawEllipse.js";

import PathShape from "../draw/PathShape.js";
import jsColor from "../lib/jsColor.js";
import Canvas from "./Canvas.js";

import BrushConfig from "../lib/BrushConfig.js";

import Context2dUtil from "../lib/Context2dUtil.js";


export default class Brush extends Layer{

    margin = 2;
    pointerEvent = null
    constructor(w=null,h=null){
        super(w,h);
        this.parent = null;

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
    ready(){
        this.pointerEvent = null
    }

    setBrushConfig(conf){
        this.brushConfig.assignFrom(conf)
    }
    resetBrushConfig(){
        this.brushConfig.reset()
    }

    createRadialGradient(ctx,x0, y0, r0, x1, y1, r1){
        // const ctx = this.ctx;
        const brushConfig = this.brushConfig;
        const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        const c = jsColor.Color.from(ctx.fillStyle);
        c.a = 0;
        gradient.addColorStop(0, ctx.fillStyle);
        if(brushConfig.hardness < 1){
            gradient.addColorStop(brushConfig.hardness, ctx.fillStyle);
            gradient.addColorStop(1, c.toRgba());
        }else{
            gradient.addColorStop(1, ctx.fillStyle);
        }
        return gradient;
    }

    applyShapeCanvas(){
        const brushConfig = this.brushConfig;
        const shapeCanvas = this.shapeCanvas;
        const ctx = shapeCanvas.ctx;
        const size = Math.max(1,parseFloat(brushConfig.size));       
        const shape = brushConfig.shape;
        
        this.margin = Math.ceil((Math.hypot(size,size) - size) / 2);

        shapeCanvas.width = size + this.margin * 2;
        shapeCanvas.height = size + this.margin * 2;
        const r = size/2;
        const x = shapeCanvas.width/2;
        const y = x;

        this.contextConfig.assignTo(ctx,true);
        // console.log(ctx.fillStyle);

        ctx.save();
        ctx.globalAlpha = parseFloat(this.flow)
        // ctx.imageSmoothingEnabled = false;
        
        
        if(shape=='square' || size==1){
            const diagonal  = Math.hypot(size,size);
            const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, Math.ceil(diagonal/2));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            PathShape.rect(ctx,this.margin,this.margin,size,size);
            ctx.closePath();
            ctx.fill()
        }else if(shape=='circle'){
            const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, r);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            PathShape.circle(ctx,x,y,r);
            ctx.closePath();
            ctx.fill()
        }else{
            const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, r);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            PathShape.circle(ctx,x,y,r);
            ctx.closePath();
            ctx.fill()
            console.error(`This shape(${shape}) is not supported.`);
        }
        
        
        // ctx.stroke()
        ctx.restore();
    }

    draw(){
        const brushConfig = this.brushConfig;
        const shape = this.shapeCanvas;
        const ctx = this.ctx;
        const size = Math.max(1,parseFloat(brushConfig.size));

        this.width = size + this.margin * 2;
        this.height = size + this.margin * 2;
        
        
        this.contextConfig.disableStroke = true;
        this.contextConfig.assignTo(ctx,true);

        this.applyShapeCanvas()


        const dw = this.width;
        const dh = this.height * brushConfig.roundness;
        // const dx = 0 - this.margin;
        // const dy = (this.height-dh)/2 - this.margin;
        const dx = 0
        const dy = (this.height-dh)/2;

        // const tx = Math.floor(this.width/2) + this.margin;
        // const ty = Math.floor(this.height/2) + this.margin;
        const tx = this.width/2;
        const ty = this.height/2;

        ctx.save();
        // ctx.filter = 'hue-rotate(180deg)';
        // ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = parseFloat(brushConfig.opacity)        
        ctx.translate(tx, ty); // 회전할 중심(기준점) 설정 (캔버스 중앙으로 이동)
        ctx.rotate(brushConfig.angle * Math.PI / 180); // 45도 회전 (Math.PI / 4 라디안)
        ctx.translate(-tx, -ty); // 중심을 원래 위치로 되돌림
        ctx.drawImage(shape,0,0,shape.width,shape.height,dx,dy,dw,dh);
        ctx.restore();

        if(brushConfig.flattenOpacity){
            const c = jsColor.Color.from(ctx.fillStyle);
            const o = Math.round(brushConfig.opacity*255);           
            Context2dUtil.flattenOpacity(ctx,c.r,c.g,c.b,o,170)
        }
        this.dispatchEvent( new CustomEvent("draw", { }) );
    }

    /**
     * Description placeholder
     *
     * @param {CanvasRenderingContext2D } ctx 
     * @param {number} x 
     * @param {number} y 
     */
    dot(ctx,x,y){
        const image = this
        const brushConfig = this.brushConfig;
        const pointerEvent = this.pointerEvent

        let gx = image.width/2;
        let gy = image.height/2;

        ctx.save();
        // 중앙으로 이동
        // ctx.translate(x + gx, y + gy);
        ctx.translate(x, y);
        //색상 랜덤
        const filters = [];
        if(brushConfig.hueJitter>0){ const v = (Math.floor(Math.random()*361)-180)*brushConfig.hueJitter; filters.push(`hue-rotate(${v}deg)`); }
        if(brushConfig.saturationJitter>0){ const v = 100 - (Math.floor(Math.random()*201)-100)*brushConfig.saturationJitter; filters.push(`saturate(${v}%)`); }
        if(brushConfig.brightnessJitter>0){ const v = 100 - (Math.floor(Math.random()*201)-100)*brushConfig.brightnessJitter; filters.push(`brightness(${v}%)`); }


        // pointerType :  "mouse"
        // altitudeAngle :  1.5707963267948966
        // azimuthAngle :  0
        // pressure :  0.5

        const sizeControl = brushConfig.sizeControl
        if(sizeControl==='off'){ // 아무 설정이 없을 경우
            if(brushConfig.sizeJitter > 0 && brushConfig.mininumSizeRatio < 1){
                const v = Math.max(1 - Math.random()*brushConfig.sizeJitter, brushConfig.mininumSizeRatio); ctx.scale(v,v)
            }
        }else if(pointerEvent && sizeControl==='penPressure'){
            const pressure = pointerEvent.pressure;
            if(pointerEvent.pointerType=='pen'){
                const v = Math.max(pressure, brushConfig.mininumSizeRatio); ctx.scale(v,v)
            }
        }

        const opacityControl = brushConfig.opacityControl
        if(opacityControl==='off'){ // 아무 설정이 없을 경우
            if(brushConfig.opacityJitter>0 && brushConfig.mininumOpacity < 1){ 
                const v = 100 - (Math.floor(Math.random()*201)-100)*brushConfig.opacityJitter; filters.push(`opacity(${v}%)`); 
            }
        }else if(pointerEvent && opacityControl==='penPressure'){
            const pressure = pointerEvent.pressure;
            if(pointerEvent.pointerType=='pen'){
                const v = Math.round(Math.max(pressure, brushConfig.mininumOpacity) * 100); filters.push(`opacity(${v}%)`); 
            }
        }

        const angleControl = brushConfig.angleControl
        if(angleControl==='off'){ // 아무 설정이 없을 경우

        }else if(pointerEvent && angleControl==='penTilt'){
            const azimuthAngle = pointerEvent.azimuthAngle;
            if(pointerEvent.pointerType=='pen'){
                const v = azimuthAngle; ctx.rotate(azimuthAngle)
                // console.log('azimuthAngle',azimuthAngle);
            }
        }

        const roundnessControl = brushConfig.roundnessControl
        if(roundnessControl==='off'){ // 아무 설정이 없을 경우

        }else if(pointerEvent && roundnessControl==='penTilt'){
            const altitudeAngle = pointerEvent.altitudeAngle;
            if(pointerEvent.pointerType=='pen' && brushConfig.mininumRoundness < 1){
                const v = Math.max(altitudeAngle/(Math.PI/2),brushConfig.mininumRoundness); ctx.scale(1,v)
                // console.log('altitudeAngle',altitudeAngle,Math.PI,altitudeAngle/(Math.PI/2),v,brushConfig.mininumRoundness);
            }
        }



        if(brushConfig.angleJitter > 0){ 
            const v = (Math.random() * 2 - 1)*brushConfig.angleJitter; 
            ctx.rotate(Math.PI * v); // 45도 회전 (Math.PI / 4 라디안)
        }

                
        

        if(filters.length){ ctx.filter = filters.join(' '); }
        ctx.drawImage(image, -gx,-gy,image.width,image.height );


        ctx.restore();

    }

    drawOnLine(ctx,x0, y0, x1, y1 , remainInterval = 0) {
        const image = this
        const brushConfig = this.brushConfig;
        const pointerEvent = this.pointerEvent
        let size = Math.max(1,parseFloat(brushConfig.size));
        
        
        const sizeControl = brushConfig.sizeControl
        if(sizeControl==='off'){ // 아무 설정이 없을 경우
        }else if(pointerEvent && sizeControl==='penPressure'){
            const pressure = pointerEvent.pressure;
            if(pointerEvent.pointerType=='pen'){
                const v = Math.max(pressure, brushConfig.mininumSizeRatio); 
                size *= v;
            }
        }



        const interval = size * Math.max(0.001,parseFloat(brushConfig.spacing));
        // 선의 길이를 계산
        let r = size / 2;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let distance2 = distance + remainInterval
        // console.log(distance,remainInterval,distance2,'>=',interval);
        
        if(distance2 < interval){
            return distance2;
            
        }else{
            let steps = Math.floor(distance2 / interval);   
            for (let i = 0; i < steps; i++) {
                let t = i / steps;
                let x = x0 + t * dx;
                let y = y0 + t * dy;   
                this.dot(ctx,x,y);
            }

            remainInterval = distance2 % interval;
            this.lastSize = size;
            return remainInterval;
            
        }

    }
}
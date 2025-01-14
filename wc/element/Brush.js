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

    setBrushConfig(conf){
        Object.assign(this.brushConfig,conf)
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
        const shape = this.shapeCanvas;
        const ctx = shape.ctx;
        const size = Math.max(1,parseFloat(brushConfig.size));       

        shape.width = size + this.margin * 2;
        shape.height = size + this.margin * 2;
        const r = size/2;
        const x = shape.width/2;
        const y = x;

        this.contextConfig.assignTo(ctx,true);
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
        ctx.rotate(Math.PI * brushConfig.angle); // 45도 회전 (Math.PI / 4 라디안)
        ctx.translate(-tx, -ty); // 중심을 원래 위치로 되돌림
        ctx.drawImage(shape,0,0,shape.width,shape.height,dx,dy,dw,dh);
        ctx.restore();

        if(brushConfig.solidColor){
            const c = jsColor.Color.from(ctx.fillStyle);
            const o = Math.round(brushConfig.opacity*255);
            Context2dUtil.solidColor(ctx,c.r,c.g,c.b,o,o/2)
        }
    }

    dot(ctx,x,y){
        const image = this

        ctx.drawImage(image, x - image.width/2, y - image.height/2 );

    }
    drawOnLine(ctx,x0, y0, x1, y1 , remainInterval = 0) {
        const image = this
        const brushConfig = this.brushConfig;
        const size = Math.max(1,parseFloat(brushConfig.size));

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
            // 선의 길이에 맞춰 이미지가 반복되도록 반복문을 돌린다
            let steps = Math.floor(distance2 / interval);
    
            for (let i = 0; i < steps; i++) {
                // 선 상의 각 점 계산
                let t = i / steps;
                let x = x0 + t * dx;
                let y = y0 + t * dy;   
                // 이미지 그리기
                // ctx.imageSmoothingEnabled = false;

                // ctx.drawImage(image, x - r, y - r);
                this.dot(ctx,x,y);
            }

            remainInterval = distance2 % interval
            return remainInterval;
            
        }

    }
}
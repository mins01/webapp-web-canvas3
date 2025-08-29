// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"

import LayerKind from "../lib/LayerKind.js";
import ShapePath2D from "../draw/ShapePath2D.js";

export default class ShapePath2DLayer extends Layer{
    static get keys(){
        return super.keys.concat(['commands','drawMode'])
    }

    kind = LayerKind.PATH;
    drawMode = 'fill'; //fill, stroek, fill-stroke, stroke-fill
    commands = null; // [{closed:boolean,,method:string,args:array}]
    constructor(w=null,h=null){
        super(w,h);
        this.drawable = false; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.
        this.drawMode = 'fill'
        this.commands = [
            
        ];
        this.flush();

        console.log(JSON.stringify(Reflect.ownKeys(ShapePath2D).filter(name => typeof ShapePath2D[name] === "function" && name !== "prototype").map(name => ({
        name,
        requiredArgs: ShapePath2D[name].length
        })),null,2));
    }

    get path2D(){
        // const path2D = new Path2D();
        const subPath2Ds = []
        this.commands.forEach(command => {
            const {closed=false,method,args} = command;
            if(!ShapePath2D[method]){ throw new Error(`${method} is not supported`); }
            const subPath2D = ShapePath2D[method](...args);
            console.log(method,args);
            
            if(closed) subPath2D.closePath();
            subPath2Ds.push(subPath2D);
        });
        if(subPath2Ds.length){
            return ShapePath2D.merge(...subPath2Ds);
        }else{
            return new Path2D();
        }
    }

    static defineCustomElements(name='wc-shapepath2dlayer'){
        super.defineCustomElements(name);
    }


    draw(){
        const ctx = this.ctx;
        const path2D = this.path2D;
        ctx.save();
        this.contextConfig.assignTo(ctx,true);        

        switch(this.drawMode){
            case 'fill':ctx.fill(path2D);break;
            case 'stroke':ctx.stroke(path2D);break;
            case 'fill-stroke':ctx.fill(path2D);ctx.stroke(path2D);break;
            case 'stroke-fill':ctx.stroke(path2D);ctx.fill(path2D);break;
        }
        ctx.restore();
        super.draw()
    }
}

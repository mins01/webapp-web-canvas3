import ShapePath2D from '../draw/ShapePath2D.js';
import BaseDrawTool from './BaseDrawTool.js';

export default class Rectangle extends BaseDrawTool{
    
    // orignalSnapshot = null
    // workingLayer = null;
    radii = 0;
    // opacity = 1;
    originPoint = 'topleft';
    constructor(editor){
        super(editor);
        this.name = 'Rectangle';
    }


    drawContent(ctx, x0, y0, x1, y1) {
        this.editor.contextConfig.assignTo(ctx,true);
        let w = x1 - x0;
        let h = y1 - y0;
        const radii = this.radii;
        let x = x0;
        let y = y0;
        if(this.originPoint =='topleft'){

        }else if(this.originPoint =='center'){
            x = Math.ceil(x0 - w);
            y = Math.ceil(y0 - h);
            w *= 2;
            h *= 2;
        }
        
        ctx.fill(ShapePath2D.roundRect(x,y,w,h,radii));
    }
   

}
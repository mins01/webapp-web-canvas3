import ShapePath2D from '../draw/ShapePath2D.js';
import BaseDrawTool from './BaseDrawTool.js';

export default class Polygon extends BaseDrawTool{
    // orignalSnapshot = null
    // workingLayer = null;
    points = 3;
    // opacity = 1;
    originPoint = 'center';

    constructor(editor){
        super(editor);
        this.name = 'Polygon';
    }

    drawContent(ctx, x0, y0, x1, y1) {
        this.editor.contextConfig.assignTo(ctx,true);
        let w = x1 - x0;
        let h = y1 - y0;
        let x = x0;
        let y = y0;

        const radius = Math.floor(Math.hypot(x0-x1,y0-y1));
        const points = this.points;
        const startAngle = Math.atan2(h, w);
        
        ctx.fill(ShapePath2D.equilateralPolygon(x, y, radius, points , startAngle));
    }
   

}
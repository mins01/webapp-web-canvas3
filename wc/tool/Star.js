import ShapePath2D from '../draw/ShapePath2D.js';
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseDrawTool from './BaseDrawTool.js';

export default class Star extends BaseDrawTool{
    // orignalSnapshot = null
    // workingLayer = null;
    points = 5;
    opacity = 1;
    innerRadiusPercent = 0.5;
    originPoint = 'center';    
    constructor(editor){
        super(editor);
        this.name = 'Star';
    }


    xdraw(x0,y0,x1,y1){
        super.draw(...arguments);
        const layer = this.workingLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        this.workingLayer.clear();

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));
        

        this.editor.contextConfig.assignTo(ctx,true);
        let w = lx1 - lx0;
        let h = ly1 - ly0;

        const x = lx0;
        const y = ly0;
        const radius = Math.floor(Math.hypot(lx0-lx1,ly0-ly1));
        const innerRadius = this.innerRadiusPercent?Math.floor(radius*this.innerRadiusPercent):0;
        const points = this.points;
        const startAngle = Math.atan2(h, w);


        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        
        this.prepareLayer(ctx);
        ctx.fill(ShapePath2D.star(x, y, radius,innerRadius, points , startAngle));
        ctx.restore();

        this.mergeFromWorkingLayer();
        
        return true;
    }
   
    drawContent(ctx, x0, y0, x1, y1) {
        this.editor.contextConfig.assignTo(ctx,true);
        let w = x1 - x0;
        let h = y1 - y0;
        let x = x0;
        let y = y0;

        const radius = Math.floor(Math.hypot(x0-x1,y0-y1));
        const innerRadius = this.innerRadiusPercent?Math.floor(radius*this.innerRadiusPercent):0;
        const points = this.points;
        const startAngle = Math.atan2(h, w);
        
        ctx.fill(ShapePath2D.star(x, y, radius,innerRadius, points , startAngle));
    }

}
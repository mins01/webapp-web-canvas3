import ShapePath2D from '../draw/ShapePath2D.js';
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
// import BaseTool from './BaseTool.js';
import BaseDrawTool from './BaseDrawTool.js';
export default class Line extends BaseDrawTool {

    lineWidth = 3;
    lineCap = "round"; //"butt,round,square"
    // lineJoin = "round"; //"miter,round,bevel" // 여기선 사용 안됨
    // miterLimit = 10;  // lineJoin가 miter 일 때 동작, 여기선 사용 안됨
    lineDashDash = 0;
    lineDashGap = 0;
    lineDashOffset = 0;
    // opacity = 1;

    constructor(editor) {
        super(editor);
        this.name = 'Line';
    }
    drawContent(ctx, x0, y0, x1, y1) {
        this.editor.contextConfig.assignTo(ctx,false);

        ctx.lineWidth = this.lineWidth
        ctx.lineCap = this.lineCap
        // ctx.lineJoin = this.lineJoin
        // ctx.miterLimit = this.miterLimit
        const lineDashGap = Number(this.lineDashGap)||0
        const lineDashDash = Number(this.lineDashDash)||1
        const lineDashOffset = Number(this.lineDashOffset)||0
        if(lineDashGap){
            ctx.setLineDash([lineDashDash, lineDashGap])
            ctx.lineDashOffset = lineDashOffset
        }
        
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

}
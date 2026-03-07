import ShapePath2D from '../draw/ShapePath2D.js';
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
// import BaseTool from './BaseTool.js';
import BaseDrawTool from './BaseDrawTool.js';
export default class TestDot extends BaseDrawTool {

    constructor(editor) {
        super(editor);
        this.name = 'TestDot';
    }
    drawContent(ctx, x0, y0, x1, y1) {
        this.editor.contextConfig.assignTo(ctx,true);
        console.log(ctx);
        console.log('drawContent', 'ctx', x0, y0, x1, y1);
        ctx.fillRect(x0,y0,x1-x0,y1-y0);
    }

}
import BaseTool from './BaseTool.js';
import DrawLine from '../draw/DrawLine.js';

export default class Brush extends BaseTool{
    remainInterval = 0;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Brush';
    }

    start(){
        super.start();
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXyFromEvent(event);
        
        this.x0 = x; this.y0 = y; this.x = x; this.y = y;
        this.remainInterval = 0;
        // this.draw(x,y,x,y);
        this.drawForDown(x,y)
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x = x; this.y = y;
        this.draw(this.x0,this.y0,x,y);
        this.x0 = x; this.y0 = y;

    }
    onpointerup(event){
        super.onpointerup(event);
    }
    end(){
        super.end();
        this.apply();
    }

    sync(){
        super.sync();
        this.draw(this.x0,this.y0,this.x,this.y);
    }

    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        const brush = this.editor.brush;      
        ctx.save();
        // this.applyLayerAngle(ctx);
        
        this.remainInterval = brush.drawOnLine(ctx,lx0,ly0,lx1,ly1,this.remainInterval)
        ctx.restore();
        layer.flush();

    }

    drawForDown(x0,y0){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }
        
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        
        const brush = this.editor.brush;      
        ctx.save();
        this.applyLayerAngle(ctx);
        brush.dot(ctx,lx0,ly0);
        ctx.restore();
        layer.flush();

    }


}
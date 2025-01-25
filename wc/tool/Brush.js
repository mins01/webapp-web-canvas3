import BaseTool from './BaseTool.js';

export default class Brush extends BaseTool{
    remainInterval = 0;
    brush = null;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Brush';
    }

    start(){
        super.start();
        this.brush = this.editor.brush;
        this.brush.ready()
        this.ready()
        
    }
    onpointerdown(event){
        if(super.onpointerdown(event)===false){return false;}
        this.brush.pointerEvent = event;
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.remainInterval = 0;
        if(event.pointerType!=='touch'){
            this.drawForDown(this.x0,this.y0)
        }
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        this.brush.pointerEvent = event;
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
        this.x0 = x; this.y0 = y;
        return;
    }
    onpointerup(event){
        this.brush.pointerEvent = event;
        return super.onpointerup(event);
    }
    end(){
        if(super.end()===false){return false;}
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready();
    }
    cancel(){
        super.cancel();
        this.document.history.reload();
    }

    /** @deprecated */
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

        const brush = this.brush;
        ctx.save();
        this.prepareLayer(ctx);
        // console.log(lx0,ly0,lx1,ly1);
        // console.log(this.lastEvent);

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
        
        const brush = this.brush;
        ctx.save();
        this.prepareLayer(ctx);
        // console.log(x0,y0,lx0,ly0);
        brush.dot(ctx,lx0,ly0);
        ctx.restore();
        layer.flush();

    }


}
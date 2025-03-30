import BaseTool from './BaseTool.js';
import DrawCircle from '../draw/DrawCircle.js';


export default class Rectangle extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'rectangle';
        this.editor = editor;

        this.x0 = null;
        this.y0 = null;
    }


    conf(){

    }

    start(){
        super.start();
        this.ready()
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointerup(event){
        super.onpointerup(event);
    }
    end(){
        super.end();
        this.layer.merge(this.drawLayer)
        this.ready()
        this.document.history.save(`Tool.${this.constructor.name}`);
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
        const ctx = drawLayer.ctx;

        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        ctx.canvas.contextConfig.assignTo(ctx);

        let w = lx1 - lx1;
        let h = ly1 - ly0;
        let r =  Math.sqrt(w * w + h * h);

        drawLayer.clear();
        ctx.save();
        this.prepareLayer(ctx);
        DrawCircle.draw(ctx,lx0,ly0,r);
        ctx.restore();
        drawLayer.flush()
    }


}
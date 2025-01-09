import BaseTool from './BaseTool.js';
import DrawRectangle from '../draw/DrawRectangle.js';


export default class Rectangle extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'rectangle';
        this.editor = editor;

        this.x0 = null;
        this.y0 = null;
    }


    start(){
        super.start();
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXYForLayer(event);
        this.x0 = x; this.y0 = y; this.x = x; this.y = y;
        this.draw(x,y,x,y);
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXYForLayer(event);
        this.x = x; this.y = y;
        this.draw(this.x0,this.y0,x,y);
    }
    onpointerup(event){
        super.onpointerup(event);
        // const [x,y] = this.getXYForLayer(event);
        // this.draw(this.x0,this.y0,x,y);
    }
    end(){
        super.end();
        this.apply();
    }

    sync(){
        super.sync();
        this.draw(this.x0,this.y0,this.x,this.y);
    }
    
    draw(x0,y0,x,y){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = drawLayer.ctx;

        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }


        ctx.canvas.contextConfig.assign(ctx);
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        
        let w = x - x0;
        let h = y - y0;
        
        drawLayer.clear();
        DrawRectangle.draw(ctx,x0,y0,w,h);
        drawLayer.flush()
    }


}
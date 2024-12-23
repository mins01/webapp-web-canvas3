import BaseTool from './BaseTool.js';
import DrawLine from '../draw/DrawLine.js';

export default class Line extends BaseTool{
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Line';
    }

    start(){
        super.start();
    }
    down(event){
        super.down(event);
        const [x,y] = this.getXYForLayer(event);
        this.x0 = x; this.y0 = y; this.x = x; this.y = y;
        this.draw(x,y,x,y);
    }
    move(event){
        super.move(event);
        const [x,y] = this.getXYForLayer(event);
        this.x = x; this.y = y;
        this.draw(this.x0,this.y0,x,y);
    }
    up(event){
        super.up(event);
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
        
        // for testing
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 26;

        drawLayer.clear();
        DrawLine.draw(ctx,x0,y0,x,y);
        document.sync()
    }


}
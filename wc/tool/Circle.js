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
        ctx.lineWidth = 4;
        ctx.strokeStyle = "orange";

        let w = x - x0;
        let h = y - y0;
        let r =  Math.sqrt(w * w + h * h);       

        drawLayer.clear();
        DrawCircle.draw(ctx,x0,y0,r);
        document.sync()
    }


}
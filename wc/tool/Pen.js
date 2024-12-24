import BaseTool from './BaseTool.js';
import DrawLine from '../draw/DrawLine.js';

export default class Pen extends BaseTool{
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Pen';

        this.coordinates = [];
    }

    start(){
        super.start();
        this.coordinates = [];
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXYForLayer(event);
        this.coordinates.push(x);
        this.coordinates.push(y);
        this.draw();
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXYForLayer(event);
        this.coordinates.push(x);
        this.coordinates.push(y);
        this.draw();
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

    draw(){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = drawLayer.ctx;
        
        // for testing
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        drawLayer.clear();
        DrawLine.drawByCoordinates(ctx,this.coordinates);
        document.sync()
    }


}
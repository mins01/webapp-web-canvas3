import BaseTool from './BaseTool.js';
import DrawLine from '../draw/DrawLine.js';

export default class Eraser extends BaseTool{
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Eraser';

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
        // this.apply();
        this.document.apply();
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
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }

        ctx.save();
        ctx.canvas.contextConfig.assign(ctx);
        // for testing
        // ctx.strokeStyle = "blue";
        // ctx.lineWidth = 4;
        // ctx.lineCap = "round";
        // ctx.lineJoin = "round";
        ctx.globalCompositeOperation = 'destination-out';

        // drawLayer.clear();
        DrawLine.drawByCoordinates(ctx,this.coordinates);
        ctx.restore();
        layer.flush()
        // drawLayer.flush()
    }


}
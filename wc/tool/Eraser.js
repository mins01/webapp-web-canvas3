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
        this.document.ready()
        this.coordinates = [];
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXyFromEvent(event);
        this.coordinates.push(x);
        this.coordinates.push(y);
        this.draw();
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXyFromEvent(event);
        this.coordinates.push(x);
        this.coordinates.push(y);
        this.draw();
    }
    onpointerup(event){
        super.onpointerup(event);
    }
    end(){
        super.end();
        this.layer.merge(this.drawLayer)
        this.document.ready()
        this.document.history.save(`Tool.${this.constructor.name}`);
    }

    sync(){
        super.sync();
    }

    draw(){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }

        ctx.save();
        this.prepareLayer(ctx);
        ctx.canvas.contextConfig.assignTo(ctx);
        ctx.globalCompositeOperation = 'destination-out';

        // drawLayer.clear();
        const lCoordinates = [];
        for(let i =0,m=this.coordinates.length;i<m;i+=2){
            const x =this.coordinates[i];
            const y =this.coordinates[i+1];
            const [lx,ly] = this.getXyInLayer(...this.getXyInDocument(x,y));
            lCoordinates.push(lx,ly);
        }        
        // DrawLine.drawByCoordinates(ctx,this.coordinates);
        DrawLine.drawByCoordinates(ctx,lCoordinates);
        ctx.restore();
        layer.flush()
        // drawLayer.flush()
    }


}
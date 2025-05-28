// import BaseTool from './BaseTool.js';
import Brush from './Brush.js';

export default class Eraser extends Brush{
    remainInterval = 0;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Eraser';
        this.brush = this.editor.eraser;
    }

    // start(){
    //     super.start();
    //     this.brush.ready();
    //     this.ready();
    // }

    // draw(x0,y0,x1,y1){
    //     const ctx = this.layer.ctx;
    //     ctx.save();
    //     ctx.globalCompositeOperation = 'destination-out';
    //     super.draw(x0,y0,x1,y1)
    //     ctx.restore();
    // }

    // drawForDown(x0,y0){      
    //     // console.log(this.brush );
    //     const ctx = this.layer.ctx;
    //     ctx.save();
    //     ctx.globalCompositeOperation = 'destination-out';
    //     super.drawForDown(x0,y0)
    //     ctx.restore();
    // }


    mergeFromWorkingLayer(){
        const from = this.workingLayer;
        const to = this.drawingLayer;
        const ctx = to.ctx;
        to.clear()
        ctx.drawImage(this.layer,0,0);
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = from.alpha
        ctx.drawImage(from,0,0);
        ctx.restore(); 
        to.flush();
    }
}
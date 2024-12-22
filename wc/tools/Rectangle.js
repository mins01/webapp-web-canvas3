import BaseTool from './BaseTool.js';

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
    down(x,y,event){
        super.down(x,y,event);
        this.x0 = x;
        this.y0 = y;
        this.draw(x,y,event);
    }
    move(x,y,event){
        super.move(x,y,event);
        this.draw(x,y,event);
    }
    up(x,y,event){
        super.up(x,y,event);
    }
    end(){
        super.end();
        this.layer.merge(this.drawLayer)
        this.drawLayer.clear();
        this.document.apply();
    }

    draw(x,y,event){
        const document = this.editor.document;
        const drawLayer = document.drawLayer;

        let xs = -1,ys = -1,xe = -1,ye = -1;
        let xmin = -1,ymin = -1,xmax = -1,ymax = -1;
        if(this.x0 < x){ xs = 0; xe = x - this.x0; xmin = this.x0; xmax = x;  } else{ xs = this.x0 - x; xe = 0; xmax = this.x0; xmin = x; }          
        if(this.y0 < y){ ys = 0; ye = y - this.y0; ymin = this.y0; ymax = y; } else{ ys = this.y0 - y; ye = 0; ymax = this.y0; ymin = y; }
        let w = xmax-xmin;
        let h = ymax-ymin

        if(w<=0 || h<=0){ return; }
        drawLayer.x = xmin;
        drawLayer.y = ymin;
        drawLayer.width = w;
        drawLayer.height = h;

        const ctx = drawLayer.ctx;
        if(ctx.fillAfterStroke??true){
            drawLayer.ctxCommand('fillRect',xs, ys,xe - xs, ye - ys);
            drawLayer.ctxCommand('strokeRect',xs, ys,xe - xs, ye - ys);
        }else{
            drawLayer.ctxCommand('strokeRect',xs, ys,xe - xs, ye - ys);
            drawLayer.ctxCommand('fillRect',xs, ys,xe - xs, ye - ys);
        }
        document.sync()
    }


}
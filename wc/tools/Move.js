import BaseTool from './BaseTool.js';

export default class Move extends BaseTool{
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Move';

        this.layerX0 = null;
        this.layerY0 = null;
    }

    start(){
        super.start();
        
        this.layerX0 = this.layer.x;
        this.layerY0 = this.layer.y;
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
        this.document.apply();
    }

    draw(x,y,event){
        super.draw(x,y,event);
        const dx = x - this.x0;
        const dy = y - this.y0;

        this.layer.x = this.layerX0 + dx;
        this.layer.y = this.layerY0 + dy;

        this.document.sync()
    }


}
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
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXYForDocument(event);
        this.x0 = x; this.y0 = y; this.x = x; this.y = y;
        this.draw(x,y,x,y);
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXYForDocument(event);
        this.x = x; this.y = y;
        this.draw(this.x0,this.y0,x,y);
    }
    onpointerup(event){
        super.onpointerup(event);
        // const [x,y] = this.getXYForDocument(event);
        // this.draw(this.x0,this.y0,x,y);
    }
    end(){
        super.end();
        this.document.apply();
    }

    draw(x0,y0,x,y){
        super.draw(...arguments);
        
        const dx = x - x0;
        const dy = y - y0;

        this.layer.x = this.layerX0 + dx;
        this.layer.y = this.layerY0 + dy;

        this.document.sync()
    }


}
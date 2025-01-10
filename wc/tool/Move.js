import BaseTool from './BaseTool.js';

export default class Move extends BaseTool{
    layerLeft0 = null;
    layerTop0 = null;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Move';

        this.layerLeft0 = null;
        this.layerTop0 = null;
    }

    start(){
        super.start();
        
        this.layerLeft0 = this.layer.left;
        this.layerTop0 = this.layer.top;
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

        this.layer.left = this.layerLeft0 + dx;
        this.layer.top = this.layerTop0 + dy;

        this.document.flush()
    }


}
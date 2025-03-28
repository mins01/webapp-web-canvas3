import BaseTool from './BaseTool.js';

export default class Move extends BaseTool{
    layerLeft0 = null;
    layerTop0 = null;
    constructor(editor){
        super(editor);
        this.name = 'Move';

        this.layerLeft0 = null;
        this.layerTop0 = null;
    }

    start(){
        super.start();
        this.ready()
        this.layerLeft0 = this.layer.left;
        this.layerTop0 = this.layer.top;
    }
    onpointerdown(event){
        if(super.onpointerdown(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
        return;
    }
    onpointerup(event){
        return super.onpointerup(event);
    }
    end(){
        if(super.end()===false){return false;}
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready()
    }
    cancel(){
        super.cancel();
        this.document.history.reload();
    }

    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        const dx = lx1 - lx0;
        const dy = ly1 - ly0;

        this.layer.left = this.layerLeft0 + dx;
        this.layer.top = this.layerTop0 + dy;

        this.document.flush()
    }


}
import BaseTool from './BaseTool.js';

export default class Hand extends BaseTool{
    left0 = null;
    top0 = null;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Hand';

        this.left0 = null;
        this.top0 = null;
    }

    start(){
        super.start();
        this.ready()
        this.left0 = this.document.left;
        this.top0 = this.document.top;
        // this.left0 = this.document.frame.scrollLeft;
        // this.top0 = this.document.frame.scrollTop;
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
        // this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready()
    }
    cancel(){
        super.cancel();
        this.document.history.reload();
    }

    draw(x0,y0,x1,y1){
        const document = this.document
        super.draw(...arguments);
        
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInDocument(x0,y0);
        const [lx1,ly1] = this.getXyInDocument(x1,y1);

        const dx = lx1 - lx0;
        const dy = ly1 - ly0;

        document.left = this.left0 + dx;
        document.top = this.top0 + dy;

        // document.frame.scrollLeft = this.left0 - dx;
        // document.frame.scrollTop = this.top0 - dy;
        

        document.flush()
    }



    ondblclick(event){
        const document = this.editor.document
        document.left = 0;
        document.top = 0;
        document.flush()
    }

}
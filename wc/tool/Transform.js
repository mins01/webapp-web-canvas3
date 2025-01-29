import BaseTool from './BaseTool.js';

export default class Transform extends BaseTool{
    left0 = null;
    top0 = null;
    utt = null;
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Transform';

        this.left0 = null;
        this.top0 = null;
        this.utt = editor.utt;

        this.init();
    }

    ready(){
        super.ready();
        console.log(this.documentRect);
        const documentRect = this.documentRect;
        const layer = this.document.layer;
        this.utt.left = layer.left + documentRect.left;
        this.utt.top = layer.top + documentRect.top;
        this.utt.width = layer.width;
        this.utt.height = layer.height;
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
        
    }


    onmoveend(){
        this.onresizeend()
        
    }
    onresizeend(){
        const utt = this.utt;
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer
        const [left,top] = this.getXyInDocument(utt.left,utt.top)
        const width = utt.width;
        const height = utt.height;

        drawLayer.ctx.save();
        drawLayer.clear();
        drawLayer.ctx.drawImage(layer,left-layer.left,top-layer.top,width,height)
        drawLayer.ctx.restore();
        drawLayer.flush();  
    }

    apply(){
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer
        layer.ctx.save();
        layer.resize(drawLayer.width,drawLayer.height)
        layer.clear();
        drawLayer.ctx.drawImage(drawLayer,0,0);
        layer.ctx.restore();
        layer.flush();
        this.ready();
    }

 
}
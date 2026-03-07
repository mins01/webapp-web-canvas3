import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class BaseDrawTool extends BaseTool{
    originalSnapshot = null
    workingLayer = null;
    opacity = 1;

    constructor(editor){
        super(editor);
        this.name = 'BaseDrawTool';
        this.workingLayer = new Layer(100,100);
    }

    start(){
        this.ready()
        super.start();
    }

    ready(){
		super.ready();
        if(!this.layer || !this.editor?.document){ return false; }
        this.workingLayer.width = this.layer.width;
        this.workingLayer.height = this.layer.height;
        this.originalSnapshot = this.layer?.clone()??null
	}

    /** 
     * 활성화 : 툴이 선택 되면
     */
    activate(cb=null){
        super.activate(()=>{
            if(!this.layer || this.layer.kind != LayerKind.NORMAL){
                console.warn(`Only normal layer are supported. (${this?.layer?.kind})`);
                this.enable = false;
            }else{
                this.enable = true;
            }
            if(cb) cb();
        });
    }

    inactivate(){
        super.inactivate();
        if(this.layer && this.originalSnapshot) this.layer.import(this.originalSnapshot); // 되돌린다.
        this.originalSnapshot = null;
    }

    onpointerdown(event){
        if(!this.enable){console.warn('툴을 사용할 수 없습니다.');return false;}
        if(super.onpointerdown(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        
        if(this.draw(this.x0,this.y0,this.x1,this.y1)){
            // this.x0 = x; this.y0 = y;            
        }
        return;
    }
    onpointerup(event){
        if(super.onpointerup(event)===false){return false;}       
        this.mergeFromWorkingLayer();
        return;
    }

    mergeFromWorkingLayer(){
        const from = this.workingLayer;
        const to = this.layer;
        const selectionLayer = this.selectionLayer;
        
        this.maksingLayer(from,selectionLayer,-to.left,-to.top);
        
        if(this.originalSnapshot) to.import(this.originalSnapshot);
        
        const ctx = to.ctx;        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(from,0,0);
        ctx.restore(); 
        to.flush();
    }

    
    end(){
        if(super.end()===false){return false;}
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.originalSnapshot = this.layer?.clone()??null
        this.ready();
    }
    cancel(){
        super.cancel();
        this.document.history.reload();
    }


    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const layer = this.workingLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.error('drawable',layer.drawable); return false; }
        layer.clear();

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));       

        ctx.save();
        this.prepareLayer(ctx);

        
        this.drawContent(ctx,lx0,ly0,lx1,ly1);

        ctx.restore();
        this.mergeFromWorkingLayer();       
        return true;
    }
    drawContent(ctx,x0,y0,x1,y1){
        this.editor.contextConfig.assignTo(ctx,true);
        console.log('drawContent','ctx',x0,y0,x1,y1);
        // ctx.drawRect(x0,y0,x1-x0,y1-y0);
    }
   

}

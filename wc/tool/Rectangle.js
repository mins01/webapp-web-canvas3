import ShapePath2D from '../draw/ShapePath2D.js';
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class Rectangle extends BaseTool{
    drawCount = 0;
    remainInterval = 0;
    targetLayer = null
    orignalSnapshot = null
    workingLayer = null;
    radii = 0;
    opacity = 1;
    constructor(editor){
        super(editor);
        this.name = 'Rectangle';
        this.workingLayer = new Layer(100,100);
        this.drawCount = 0;
    }

    start(){
        super.start();
        this.ready()
    }

    ready(){
		super.ready();
        if(!this.layer || !this.editor?.document){ return false; }
        this.workingLayer.width = this.layer.width;
        this.workingLayer.height = this.layer.height;
        // this.layer = this.document.layer;
        this.orignalSnapshot = this.layer?.snapshot()??null
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
        if(this.layer && this.orignalSnapshot) this.layer.import(this.orignalSnapshot); // 되돌린다.
        this.orignalSnapshot = null;
    }

    onpointerdown(event){
        if(!this.enable){console.warn('툴을 사용할 수 없습니다.');return false;}
        if(super.onpointerdown(event)===false){return false;}
        this.pointerEvent = new PointerEvent(event.type, event)
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
        // this.workingLayer.clear();
        return;
    }

    mergeFromWorkingLayer(){
        const from = this.workingLayer;
        const to = this.layer;
        const ctx = to.ctx;
        if(this.orignalSnapshot) this.layer.import(this.orignalSnapshot);
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(from,0,0);
        ctx.restore(); 
        to.flush();
    }
    
    end(){
        if(super.end()===false){return false;}
        // this.document.history.save(`Tool.${this.constructor.name}`);
        this.orignalSnapshot = this.layer.snapshot()
        this.document.history.save(`Tool.${this.constructor.name}`);
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
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        this.workingLayer.clear();

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));
        

        this.editor.contextConfig.assignTo(ctx,true);
        let w = lx1 - lx0;
        let h = ly1 - ly0;
        const radii = this.radii;

        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        
        this.prepareLayer(ctx);
        // ctx.fill(ShapePath2D.rect(lx0,ly0,w,h));
        ctx.fill(ShapePath2D.roundRect(lx0,ly0,w,h,radii));
        ctx.restore();

        this.mergeFromWorkingLayer();
        
        return true;
    }
   

}
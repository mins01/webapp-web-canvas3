import ShapePath2D from '../draw/ShapePath2D.js';
// import Layer from '../element/Layer.js';
import Canvas from '../element/Canvas.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class SelectionRectangle extends BaseTool{
    radii = 0;
    pattern = null;
    constructor(editor){
        super(editor);
        this.name = 'SelectionRectangle';
        this.initPattern();
    }

    initPattern(){
        const halfWidth = 4
        const halfHeight = 4;
        const patternCanvas = new Canvas(halfWidth*2,halfHeight*2);
        patternCanvas.ctx.fillStyle = "#ffffff"; // 흰색
        patternCanvas.ctx.fillRect(0, 0, halfWidth, halfHeight); // 좌상단
        patternCanvas.ctx.fillRect(halfWidth, halfHeight, halfWidth, halfHeight); // 우하단

        patternCanvas.ctx.fillStyle = "#000000"; // 검은색
        patternCanvas.ctx.fillRect(halfWidth, 0, halfWidth, halfHeight); // 우상단
        patternCanvas.ctx.fillRect(0, halfHeight, halfWidth, halfHeight); // 좌하단

        this.pattern = patternCanvas.ctx.createPattern(patternCanvas, "repeat");
    }

    start(){
        super.start();
        this.ready()
    }

    ready(){
		super.ready();
        if(!this.selectionLayer || !this.editor?.document){ return false; }
        if(this.selectionLayer.width != this.document.width || this.selectionLayer.height != this.document.height)
            {
                this.selectionLayer.width = this.document.width;
                this.selectionLayer.height = this.document.height;
            } 
	}

    /** 
     * 활성화 : 툴이 선택 되면
     */
    activate(cb=null){
        super.activate(()=>{
            if(!this.selectionLayer || this.layer.kind != LayerKind.NORMAL){
                console.warn(`Only normal selectionLayer are supported. (${this?.selectionLayer?.kind})`);
                this.enable = false;
            }else{
                this.enable = true;
            }
            if(cb) cb();
        });
    }

    inactivate(){
        super.inactivate();
    }

    onpointerdown(event){
        if(!this.enable){console.warn('툴을 사용할 수 없습니다.');return false;}
        if(super.onpointerdown(event)===false){return false;}
        this.pointerEvent = new PointerEvent(event.type, event)
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        if(this.draw(this.x0,this.y0,this.x1,this.y1)){
            // this.x0 = x; this.y0 = y;
        }
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
        return;
    }
    
    end(){
        if(super.end()===false){return false;}
        // this.document.history.save(`Tool.${this.constructor.name}`);
        // this.ready();
    }


    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const layer = this.selectionLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        layer.clear();

        // 레이어 기준으로 좌표 재계산
        // const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        // const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));
        const [lx0,ly0] = this.getXyInDocument(x0,y0);
        const [lx1,ly1] = this.getXyInDocument(x1,y1);
        console.log(lx0);
        
        

        this.editor.contextConfig.assignTo(ctx,true);
        let w = lx1 - lx0;
        let h = ly1 - ly0;
        const radii = this.radii;

        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        
        // this.prepareLayer(ctx); // 레이어 기준이 아니라서 동작하면 안된다.
        // ctx.fill(ShapePath2D.rect(lx0,ly0,w,h));
        ctx.fillStyle = this.pattern;
        ctx.fill(ShapePath2D.roundRect(lx0,ly0,w,h,radii));
        ctx.restore();
        layer.flush();
        
        return true;
    }
   

}
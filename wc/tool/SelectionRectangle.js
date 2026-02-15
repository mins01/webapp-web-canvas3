import ShapePath2D from '../draw/ShapePath2D.js';
// import Layer from '../element/Layer.js';
import Canvas from '../element/Canvas.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class SelectionRectangle extends BaseTool{
    radii = 0;
    // mode = 'add';
    mode = 'new';
    blurSize = 2;
    mosaicSize = 4;
    selectionLayerOrg = null;
    constructor(editor){
        super(editor);
        this.name = 'SelectionRectangle';
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
        this.selectionLayerOrg = this.selectionLayer.clone();
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
        this.selectionLayerOrg = null;
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
        layer.import(this.selectionLayerOrg);
        // console.log(layer.pattern);
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        if(this.mode=='new'){
            layer.clear();
        }

        const ctx = layer.ctx;

        // 레이어 기준으로 좌표 재계산
        // const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        // const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));
        let [lx0,ly0] = this.getXyInDocument(x0,y0);
        let [lx1,ly1] = this.getXyInDocument(x1,y1);
        lx0 = Math.round(lx0);
        ly0 = Math.round(ly0);
        lx1 = Math.round(lx1);
        ly1 = Math.round(ly1);
        // console.log(lx0,ly0,lx1,ly1);   
        

        // this.editor.contextConfig.assignTo(ctx,true);
        let w = lx1 - lx0;
        let h = ly1 - ly0;
        const radii = this.radii;

        ctx.save();
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";

        switch(this.mode){
            case 'new': ctx.globalCompositeOperation="source-over";break;
            case 'add': ctx.globalCompositeOperation="source-over";break;
            case 'subtract': ctx.globalCompositeOperation="destination-out";break;
            case 'intersect': ctx.globalCompositeOperation="source-in";break;
        }

        
        // this.prepareLayer(ctx); // 레이어 기준이 아니라서 동작하면 안된다.
        // ctx.fill(ShapePath2D.rect(lx0,ly0,w,h));
        // ctx.fillStyle = layer.pattern;
        ctx.fill(ShapePath2D.roundRect(lx0,ly0,w,h,radii));
        ctx.restore();
        layer.flush();
        
        return true;
    }
   

}
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class Brush extends BaseTool{
    remainInterval = 0;
    brush = null;
    workingLayer = null;
    pointerEvent = null;
    lastPointerEvent = null;
    tmBuildUp = null;
    constructor(editor){
        super(editor);
        this.name = 'Brush';
        this.brush = this.editor.brush;
        this.workingLayer = new Layer(100,100);
    }

    start(){
        super.start();
        this.brush.ready()        
        this.ready()
    }

    ready(){
		super.ready();
        // this.workingLayer.parent = this.drawingLayer;
        this.workingLayer.width = this.layer.width;
        this.workingLayer.height = this.layer.height;
        // globalThis.document.body.append(this.workingLayer)
        // this.drawingLayer.ctx.drawImage(this.layer,0,0)
        this.drawingLayer.import(this.layer.snapshot())
        this.drawingLayer.flush();
        
        this.stopBuildUp();
	}

    /** 
     * 활성화 : 툴이 선택 되면
     */
    activate(cb=null){        
        super.activate(()=>{
            if(!this.layer || this.layer.kind != LayerKind.NORMAL){
                console.warn(`Only normal layer are supported. (${this.layer.kind})`);
                this.enable = false;
            }else{
                this.enable = true;
                if(this.layer) this.layer.visibleByTool = false;
            }
            if(cb) cb();
        });
    }

    inactivate(){
        super.inactivate();
        if(this.layer) this.layer.visibleByTool = true;
        if(this.drawingLayer) this.drawingLayer.clear();
    }

    onpointerdown(event){
        if(!this.enable){console.warn('툴을 사용할 수 없습니다.');return false;}
        if(super.onpointerdown(event)===false){return false;}
        this.drawingLayer.alpha = this.layer.alpha;        
        this.brush.ready()
        this.pointerEvent = new PointerEvent(event.type, event)
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.remainInterval = 0;
        if(event.pointerType!=='touch'){
            this.drawForDown(this.x0,this.y0)
        }
        this.lastPointerEvent = this.pointerEvent;

        this.startBuildUp();
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        this.pointerEvent = new PointerEvent(event.type, event)
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
        this.lastPointerEvent = this.pointerEvent;
        this.x0 = x; this.y0 = y;
        return;
    }
    onpointerup(event){
        this.stopBuildUp();
        this.pointerEvent = new PointerEvent(event.type, event)
        this.mergeFromWorkingLayer();
        this.mergeFromDrawingLayer();
        
        return super.onpointerup(event);
    }

    mergeFromWorkingLayer(){
        const from = this.workingLayer;
        const to = this.drawingLayer;
        const ctx = to.ctx;
        to.clear()
        ctx.drawImage(this.layer,0,0);
        ctx.save();
        ctx.globalAlpha = from.alpha
        ctx.drawImage(from,0,0);
        ctx.restore(); 
        to.flush();
    }
    mergeFromDrawingLayer(){
        const from = this.drawingLayer;
        const to = this.layer;
        const ctx = to.ctx;
        to.clear()
        ctx.save();
        // ctx.globalAlpha = from.alpha
        ctx.drawImage(from,0,0);
        ctx.restore(); 
        // to.flush();
    }
    end(){
        if(super.end()===false){return false;}
        // this.document.history.save(`Tool.${this.constructor.name}`);
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready();
    }
    cancel(){
        super.cancel();
        this.document.history.reload();
    }


    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const document = this.document;
        // const layer = this.layer;
        // const drawingLayer = this.drawingLayer;
        // const layer = this.drawingLayer;
        const layer = this.workingLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        const brush = this.brush;
        ctx.save();
        this.prepareLayer(ctx);
        // console.log(lx0,ly0,lx1,ly1);
        // console.log(this.lastEvent);
        let remainInterval = this.remainInterval
        const pointerEvent = this.pointerEvent;
        const lastPointerEvent = this.lastPointerEvent
        this.remainInterval = brush.drawOnLine(ctx,lx0,ly0,lx1,ly1,
                {
                    remainInterval,
                    pointerType:pointerEvent.pointerType,
                    pressure:pointerEvent.pressure,
                    azimuthAngle:pointerEvent.azimuthAngle,
                    lastPressure:lastPointerEvent.pressure,
                    lastAzimuthAngle:lastPointerEvent.azimuthAngle
                }
        )
        ctx.restore();
        layer.flush();
        // drawingLayer.flush();
        this.mergeFromWorkingLayer();
    }

    
    drawForDown(x0,y0){
        super.draw(...arguments);
        const document = this.document;
        // const layer = this.layer;
        // const drawingLayer = this.drawingLayer;
        const layer = this.workingLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return false; }
        
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        
        const brush = this.brush;
        ctx.save();
        this.prepareLayer(ctx);
        // console.log(x0,y0,lx0,ly0);
        const pointerEvent = this.pointerEvent;
        brush.drawOnDot(ctx,lx0,ly0,{
            pointerType:pointerEvent.pointerType,
            pressure:pointerEvent.pressure,
            azimuthAngle:pointerEvent.azimuthAngle
        });
        ctx.restore();
        layer.flush();
        this.mergeFromWorkingLayer();

    }

    // 마지막 점 기준으로 다시 찍는다.
    redrawForDown(){
        const {x0,y0} = this;
        if(x0 === null){ console.log(`x0 is null`); return; } 
        this.drawForDown(x0,y0);
        
    }

    // build up 동작
    startBuildUp(){
        if(this.brush.brushConfig.buildUpInterval !==0){
            this.tmBuildUp = setInterval(()=>{ this.redrawForDown() },this.brush.brushConfig.buildUpInterval*1000);
        }
    }
    stopBuildUp(){
        if(this.tmBuildUp){ clearInterval(this.tmBuildUp); this.tmBuildUp = null; }
    }
    

}
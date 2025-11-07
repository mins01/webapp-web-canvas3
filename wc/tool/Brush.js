import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';

export default class Brush extends BaseTool{
    drawCount = 0;
    remainInterval = 0;
    brush = null;
    workingLayer = null;
    pointerEvent = null;
    lastPointerEvent = null;
    tmBuildUp = null;
    targetLayer = null
    orignalSnapshot = null
    constructor(editor){
        super(editor);
        this.name = 'Brush';
        this.brush = this.editor.brush;
        this.workingLayer = new Layer(100,100);
        this.drawCount = 0;
    }

    start(){
        super.start();
        this.brush.ready()        
        this.ready()
    }

    ready(){
		super.ready();
        if(!this.layer || !this.editor?.document){ return false; }
        this.workingLayer.width = this.layer.width;
        this.workingLayer.height = this.layer.height;
        // this.layer = this.document.layer;
        this.orignalSnapshot = this.layer?.snapshot()??null
        this.stopBuildUp();        
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
        this.drawCount = 0; // 0으로 초기화
        this.brush.ready();
        this.pointerEvent = new PointerEvent(event.type, event)
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.remainInterval = 0;
        // if(event.pointerType!=='touch'){
        //     this.drawForDown(this.x0,this.y0)
        // }
        this.lastPointerEvent = this.pointerEvent;

        this.startBuildUp();
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        
        this.pointerEvent = new PointerEvent(event.type, event)
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        if(this.draw(this.x0,this.y0,this.x1,this.y1)){
            this.lastPointerEvent = this.pointerEvent;
            this.x0 = x; this.y0 = y;
        }
        return;
    }
    onpointerup(event){
        if(super.onpointerup(event)===false){return false;}
        if(this.drawCount===0){
            this.drawForDown(this.x0,this.y0); // 아무 동작 없이 up을 하면 점 하나를 찍는 다.
        }

        this.stopBuildUp();
        this.pointerEvent = new PointerEvent(event.type, event)
        this.mergeFromWorkingLayer();
        this.workingLayer.clear();
        this.drawCount = 0; // 0으로 초기화
        return;
    }

    mergeFromWorkingLayer(){
        const from = this.workingLayer;
        const to = this.layer;
        const selectionLayer = this.selectionLayer;
        const ctx = to.ctx;

        if(selectionLayer && !selectionLayer.isEmpty){ // 선택영역을 마스크로 동작
            from.ctx.save();
            from.ctx.globalCompositeOperation = "destination-in"; // 기존 그림과 겹치는 부분만 남김
            from.ctx.drawImage(selectionLayer,-to.left,-to.top);
            from.ctx.restore();
        }

        if(this.orignalSnapshot) this.layer.import(this.orignalSnapshot);
        
        ctx.save();
        ctx.globalCompositeOperation = this.brush.brushConfig.compositeOperation;        
        ctx.globalAlpha = from.alpha
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

        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        const brush = this.brush;
        
        const pointerEvent = this.pointerEvent;
        const lastPointerEvent = this.lastPointerEvent
        
        let remainInterval = this.remainInterval


        const distance = Math.hypot(lx1 - lx0, ly1 - ly0);
        const interval = brush.calInterval({
                    pressure:pointerEvent.pressure,
                    lastPressure:lastPointerEvent.pressure,
                });
        const remainDistance = brush.remainDistance({remainInterval,interval,distance});

        if(remainDistance < interval){
            this.remainInterval = remainDistance;
            return false;
        }else{

            const lineAngle =  brush.getAngle(lx0,ly0,lx1,ly1);

            ctx.save();
            this.prepareLayer(ctx);
            if(this.drawCount===0){
                this.drawForDown(this.x0,this.y0,lineAngle); // 아무 동작 없으면 점 하나를 찍는 다.
            }
            this.remainInterval = brush.drawOnLine(ctx,lx0,ly0,lx1,ly1,
                {
                    remainInterval,
                    pointerType:pointerEvent.pointerType,
                    pressure:pointerEvent.pressure,
                    azimuthAngle:pointerEvent.azimuthAngle,
                    lastPressure:lastPointerEvent.pressure,
                    lastAzimuthAngle:lastPointerEvent.azimuthAngle,
                    lineAngle,
                    interval,
                    distance,
                    remainDistance,
                }
            )
            ctx.restore();
            layer.flush();
            this.mergeFromWorkingLayer();
            this.drawCount++;
            return true;
        }
        
    }

    
    drawForDown(x0,y0,lineAngle=0){
        super.draw(...arguments);
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
            azimuthAngle:pointerEvent.azimuthAngle,
            lineAngle,
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
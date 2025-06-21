import BaseTool from './BaseTool.js';

export default class Transform extends BaseTool{
    utt = null;
    targetLayer = null;
    constructor(editor){
        super(editor);
        this.name = 'Transform';
        this.utt = editor.utt;
    }

    activate(){
        super.activate();
        if(this.layer) this.layer.visibleByTool = false;
        this.ready();
        this.draw();
    }
    inactivate(){
        super.inactivate();
        if(this.layer) this.layer.visibleByTool = true;
    }

    ready(){
        super.ready();
        this.targetLayer = this.document.drawingLayer;
        this.readyUtt();
        this.draw();
        
    }

    readyUtt(){
        const document = this.document
        // const documentRect = this.documentRect;
        // const layer = this.document.layer;
        const targetLayer = this.targetLayer;
        const mul = document.zoom*targetLayer.zoom

        let [leftC,topC] =this.getPageXyFromDocumentXy(targetLayer.left+targetLayer.width/2,targetLayer.top+targetLayer.height/2)
        
        this.utt.left = Math.round(leftC - targetLayer.width/2*mul);
        this.utt.top = Math.round(topC - targetLayer.height/2*mul);
        
        this.utt.width = targetLayer.width*mul
        this.utt.height = targetLayer.height*mul

    }

    start(){
        
        // this.top0 = this.document.frame.scrollTop;
    }
    onpointerdown(event){
        
    }
    onpointermove(event){
       
    }
    onpointerup(event){
        
    }
    end(){
        
    }
    cancel(){
        super.cancel();
        // this.document.history.reload();
        this.activate();
    }

    center(){
        super.ready();
        const drawingLayer = this.document.drawingLayer
        drawingLayer.postionCenterCenter();
        this.readyUtt();       
        this.draw();
    }



    onuttmove(){
        this.draw()
        
    }
    onuttresize(){
        this.draw()
    }
    onuttmoveend(){
        this.draw()
    }
    onuttresizeend(){
        this.draw()
    }
    draw(){
        const utt = this.utt;
        const document = this.document
        const documentRect = this.documentRect;
        const layer = this.document.layer
        const drawingLayer = this.document.drawingLayer
        const mul = document.zoom / drawingLayer.zoom
        const ctx = drawingLayer.ctx


        let docCenterX = (documentRect.right + documentRect.left) / 2
		let docCenterY = (documentRect.bottom + documentRect.top) / 2

        let leftUttC = utt.left + utt.width/2;
        let topUttC = utt.top + utt.height/2;
        // console.log(leftUttC, utt.width/2);

        [leftUttC,topUttC] = this.rotatePoint(leftUttC, topUttC, docCenterX, docCenterY, -document.angle)


        let [leftLC,topLC] = this.getDocumentXyFromPageXy(leftUttC,topUttC);
        let width = utt.width / mul;      
        let height = utt.height / mul;

        let left = leftLC - width/2;
        let top =  topLC - height/2;

        ctx.save();
        drawingLayer.left = Math.floor(left); //반올림 하면 오차가 나네...뭐지?
        drawingLayer.top = Math.floor(top);
        drawingLayer.width = Math.floor(width);
        drawingLayer.height = Math.floor(height);

        ctx.drawImage(layer,0,0,drawingLayer.width,drawingLayer.height)
        ctx.restore();
        drawingLayer.flush();
    }

    confirm(){
        super.confirm();
        const layer = this.document.layer
        const drawingLayer = this.document.drawingLayer
        console.log(drawingLayer.snapshot());
        
        layer.import(drawingLayer.snapshot())
        this.document.history.save();
        this.ready();
    }

 
}
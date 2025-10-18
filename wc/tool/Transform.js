import BaseTool from './BaseTool.js';

export default class Transform extends BaseTool{
    utt = null;
    targetLayer = null;
    orignalSnapshot = null
    constructor(editor){
        super(editor);
        this.name = 'Transform';
        this.utt = editor.utt;
    }

    activate(){
        super.activate();
        // if(this.layer) this.layer.visibleByTool = false;
        this.ready();
        this.draw();
    }
    inactivate(){
        this.targetLayer.import(this.orignalSnapshot);
        super.inactivate();
        // if(this.layer) this.layer.visibleByTool = true;

    }

    ready(){
        super.ready();
        this.targetLayer = this.document.layer;
        this.orignalSnapshot = this.targetLayer.snapshot()
        this.readyUtt();
        this.draw();
        
    }

    readyUtt(){
        const document = this.document
        const targetLayer = this.targetLayer;
        const mul = document.zoom*targetLayer.zoom

        let [leftC,topC] =this.getPageXyFromDocumentXy(targetLayer.left+targetLayer.width/2,targetLayer.top+targetLayer.height/2)
        
        this.utt.left = Math.ceil(leftC - targetLayer.width/2*mul); //왜인지 모르겠지만, 올림으로 해야 오차가 안생긴다.
        this.utt.top = Math.ceil(topC - targetLayer.height/2*mul);
        
        this.utt.width = targetLayer.width*mul
        this.utt.height = targetLayer.height*mul

    }

    start(){
        
        // this.top0 = this.document.stage.scrollTop;
    }
    onpointerdown(event){
        
    }
    onpointermove(event){
       
    }
    onpointerup(event){
        
    }
    end(){
        
    }

    confirm(){
        super.confirm();
        const layer = this.document.layer
        this.orignalSnapshot = this.targetLayer.snapshot()        
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready();
    }
    cancel(){
        super.cancel();
        this.targetLayer.import(this.orignalSnapshot);
        this.activate();
    }

    center(){
        super.ready();
        this.targetLayer.postionCenterCenter();
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
        const targetLayer = this.targetLayer
        const mul = document.zoom / targetLayer.zoom

        let docCenterX = (documentRect.right + documentRect.left) / 2
		let docCenterY = (documentRect.bottom + documentRect.top) / 2

        let leftUttC = utt.left + utt.width/2;
        let topUttC = utt.top + utt.height/2;

        [leftUttC,topUttC] = this.rotatePoint(leftUttC, topUttC, docCenterX, docCenterY, -document.angle)


        let [leftLC,topLC] = this.getDocumentXyFromPageXy(leftUttC,topUttC);
        let width = utt.width / mul;      
        let height = utt.height / mul;

        let left = leftLC - width/2;
        let top =  topLC - height/2;

        this.targetLayer.import(this.orignalSnapshot);
        this.targetLayer.resize(Math.floor(width),Math.floor(height))
        targetLayer.left = Math.floor(left); //반올림 하면 오차가 나네...뭐지?
        targetLayer.top = Math.floor(top);
        

        targetLayer.flush();
    }



 
}
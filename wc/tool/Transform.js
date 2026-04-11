import BaseTool from './BaseTool.js';

export default class Transform extends BaseTool{
    utt = null;
    uttBroundary = null;
    targetLayer = null;
    orignalSnapshot = null
    constructor(editor){
        super(editor);
        this.name = 'Transform';
        this.utt = editor.utt;
        this.uttBroundary = editor.uttBroundary
    }

    activate(){
        super.activate();
        // if(this.layer) this.layer.visibleByTool = false;
        this.ready();
        this.draw();
    }
    deactivate(){
        this.targetLayer.import(this.orignalSnapshot);
        super.deactivate();
        // if(this.layer) this.layer.visibleByTool = true;

    }

    ready(){
        super.ready();
        this.targetLayer = this.document?.layer;
        if(this.targetLayer){
            this.orignalSnapshot = this?.targetLayer?.snapshot()
            this.readyUtt();
            this.draw();
        }
        
    }

    readyUtt(){
        const document = this.document
        const targetLayer = this.targetLayer;
        const mul = document.zoom*targetLayer.zoom

        {
            const {left,top,width,height} = document.getViewportRect();    
            this.uttBroundary.setRect(left,top,width,height,0);    
        }
        {
            const {left,top,width,height} = targetLayer.getLocalRect();
            const rotation = targetLayer.rotation;
            this.utt.setRect(left,top,width,height,rotation)
        }
        



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
        // const layer = this.document.layer
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
        this.targetLayer.positionCenterCenter();
        this.confirm();
        this.readyUtt();       
        this.draw();
    }
    trim(){
        this.targetLayer.trim();
        this.targetLayer.flush();
        this.confirm();
        super.ready();
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
        this.confirm();
    }
    onuttresizeend(){
        this.draw()
        this.confirm();
    }
    onutttransformupdate(){
        this.draw()
    }
    onutttransformend(){
        this.draw()
        this.confirm();
    }
    draw(){
        const utt = this.utt;
        const document = this.document
        const targetLayer = this.targetLayer
        const mul = document.zoom / targetLayer.zoom
        
        const {left,top,width,height} = utt.getLocalRect();
        this.targetLayer.import(this.orignalSnapshot);
        this.targetLayer.resize((width),(height))
        targetLayer.left = (left); //반올림 하면 오차가 나네...뭐지?
        targetLayer.top = (top);
        targetLayer.rotation = utt.rotation;

        
        targetLayer.flush();
        

    }

    // @deprecated
    draw_old(){
        const utt = this.utt;
        const document = this.document
        const documentRect = this.documentRect;
        const targetLayer = this.targetLayer
        const mul = document.zoom / targetLayer.zoom

        let docCenterX = (documentRect.right + documentRect.left) / 2
		let docCenterY = (documentRect.bottom + documentRect.top) / 2

        let leftUttC = utt.left + utt.width/2;
        let topUttC = utt.top + utt.height/2;
        // console.log('leftUttC,topUttC',leftUttC,topUttC);

        // leftUttC = Math.floor(leftUttC)
        // topUttC = Math.floor(topUttC)

        let [angledLeftUttC,angledTopUttC] = this.rotatePoint(leftUttC, topUttC, docCenterX, docCenterY, -document.angle)
        // console.log('angledLeftUttC,angledTopUttC',angledLeftUttC,angledTopUttC);
        


        let [leftLC,topLC] = this.getDocumentXyFromPageXy(angledLeftUttC,angledTopUttC);
        let width = utt.width / mul;      
        let height = utt.height / mul;

        let left = leftLC - width/2;
        let top =  topLC - height/2;

        this.targetLayer.import(this.orignalSnapshot);
        // this.targetLayer.resize(Math.ceil(width),Math.ceil(height))
        // targetLayer.left = Math.ceil(left); //반올림 하면 오차가 나네...뭐지?
        // targetLayer.top = Math.ceil(top);

        this.targetLayer.resize((width),(height))
        targetLayer.left = (left); //반올림 하면 오차가 나네...뭐지?
        targetLayer.top = (top);
        

        targetLayer.flush();
    }



 
}
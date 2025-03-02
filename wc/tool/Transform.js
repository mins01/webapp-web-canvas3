import BaseTool from './BaseTool.js';

export default class Transform extends BaseTool{
    utt = null;
    constructor(editor){
        super(editor);
        this.name = 'Transform';
        this.utt = editor.utt;
    }

    activate(){
        super.activate();
        this.layer.visibleByTool = false;
        this.ready();
        this.draw();
    }
    inactivate(){
        super.inactivate();
        this.layer.visibleByTool = true;
    }

    ready(){
        super.ready();
        this.readyUtt();
        this.draw();
    }

    readyUtt(){
        const document = this.document
        const documentRect = this.documentRect;
        // const layer = this.document.layer;
        const drawLayer = this.document.drawLayer;
        const mul = document.zoom*drawLayer.zoom

        let [leftC,topC] =this.getPageXyFromDocumentXy(drawLayer.left+drawLayer.width/2,drawLayer.top+drawLayer.height/2)
        
        this.utt.left = Math.round(leftC - drawLayer.width/2*mul);
        this.utt.top = Math.round(topC - drawLayer.height/2*mul);
        
        this.utt.width = drawLayer.width*mul
        this.utt.height = drawLayer.height*mul

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
        this.document.history.reload();
        this.ready();
        this.draw();
    }

    center(){
        super.ready();
        const drawLayer = this.document.drawLayer
        drawLayer.postionCenterCenter();
        this.readyUtt();       
        this.draw();
    }



    onmoveend(){
        this.draw()
        
    }
    onresizeend(){
        this.draw()
    }
    draw(){
        const utt = this.utt;
        const document = this.document
        const documentRect = this.documentRect;
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer
        const mul = document.zoom / drawLayer.zoom
        const ctx = drawLayer.ctx


        let docCenterX = (documentRect.right + documentRect.left) / 2
		let docCenterY = (documentRect.bottom + documentRect.top) / 2

        let leftUttC = utt.left + utt.width/2;
        let topUttC = utt.top + utt.height/2;
        [leftUttC,topUttC] = this.rotatePoint(leftUttC, topUttC, docCenterX, docCenterY, -document.angle)


        let [leftLC,topLC] = this.getDocumentXyFromPageXy(leftUttC,topUttC);
        

        let width = utt.width / mul;      
        let height = utt.height / mul;

        let left = leftLC - width/2;
        let top = topLC - height/2;

        // [left,top] = this.rotatePoint(left, top, topUttC, topUttC, +document.angle)

        // console.log(leftUttC,left,leftLC,documentRect.left+documentRect.width/2,width);


        ctx.save();
        drawLayer.left = Math.round(left);
        drawLayer.top = Math.round(top);
        drawLayer.width = width;
        drawLayer.height = height;
        
        // this.prepareLayer(ctx);
        // drawLayer.fill('#000000f0')
        // drawLayer.stroke('#ff0000',4)
        
        // console.log(drawLayer.left,drawLayer.top,drawLayer.width,drawLayer.height);
        ctx.drawImage(layer,0,0,drawLayer.width,drawLayer.height)
        ctx.restore();
        drawLayer.flush();
    }

    confirm(){
        super.confirm();
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer
        console.log(drawLayer.snapshot());
        
        layer.import(drawLayer.snapshot())
        this.document.history.save();
        this.ready();
    }

 
}
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

        this.utt.left = documentRect.left + drawLayer.left * mul;
        this.utt.top = documentRect.top + drawLayer.top * mul;
        this.utt.width = drawLayer.width * mul;
        this.utt.height = drawLayer.height * mul;
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



    onmoveend(){
        this.draw()
        
    }
    onresizeend(){
        this.draw()
    }
    draw(){
        const utt = this.utt;
        const document = this.document
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer

        const mul = document.zoom * drawLayer.zoom

        const [left,top] = this.getXyInDocument(utt.left,utt.top)
        const width = utt.width;
        const height = utt.height;
        


        drawLayer.ctx.save();
        drawLayer.left = left;
        drawLayer.top = top;
        drawLayer.width = width / mul;
        drawLayer.height = height / mul;
        
        // drawLayer.fill('#000000f0')
        // drawLayer.stroke('#ff0000',4)
        
        // console.log(drawLayer.left,drawLayer.top,drawLayer.width,drawLayer.height);
        drawLayer.ctx.drawImage(layer,0,0,drawLayer.width,drawLayer.height)
        drawLayer.ctx.restore();
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
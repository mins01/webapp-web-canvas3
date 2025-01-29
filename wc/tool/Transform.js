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
        // super.ready();
        this.documentRect = this?.document?.getBoundingClientRect(); // 캐싱용 위치 정보. 매번 불리면 느려진다.

        const documentRect = this.documentRect;
        const layer = this.document.layer;
        this.utt.left = layer.left + documentRect.left;
        this.utt.top = layer.top + documentRect.top;
        this.utt.width = layer.width;
        this.utt.height = layer.height;
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
        const [left,top] = this.getXyInDocument(utt.left,utt.top)
        const width = utt.width;
        const height = utt.height;

        drawLayer.ctx.save();
        drawLayer.left = left;
        drawLayer.top = top;
        drawLayer.width = width;
        drawLayer.height = height;
        
        // drawLayer.fill('#000000f0')
        // drawLayer.stroke('#ff0000',4)
        
        // console.log(drawLayer.left,drawLayer.top,drawLayer.width,drawLayer.height);
        drawLayer.ctx.drawImage(layer,0,0,width,height)
        drawLayer.ctx.restore();
        drawLayer.flush();
    }

    confirm(){
        super.confirm();
        const layer = this.document.layer
        const drawLayer = this.document.drawLayer
        layer.import(drawLayer.snapshot())
        this.ready();
    }

 
}
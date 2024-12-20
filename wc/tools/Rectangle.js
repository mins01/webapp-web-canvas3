export default class Line{
    constructor(editor){
        this.name = 'rectangle';
        this.editor = editor;

        this.x0 = null;
        this.y0 = null;
    }


    conf(){
        
    }

    start(){

    }
    down(x,y){
        this.x0 = x;
        this.y0 = y;

        this.draw(x,y);
    }
    move(x,y){
        this.draw(x,y);
    }
    up(x,y){
        // this.draw(x,y);
    }
    end(){
        // console.log('end');
        this.editor.documents.document.apply();
    }

    draw(x,y){
        // console.log(x,y);
        const document = this.editor.documents.document;
        const drawLayer = document.drawLayer;
        drawLayer.clear();
        const ctx = drawLayer.ctx;
        if(ctx.fillAfterStroke??true){
            drawLayer.ctxCommand('fillRect',this.x0, this.y0,x - this.x0, y - this.y0);
            drawLayer.ctxCommand('strokeRect',this.x0, this.y0,x - this.x0, y - this.y0);
        }else{
            drawLayer.ctxCommand('strokeRect',this.x0, this.y0,x - this.x0, y - this.y0);
            drawLayer.ctxCommand('fillRect',this.x0, this.y0,x - this.x0, y - this.y0);
        }
        document.sync()
    }


}
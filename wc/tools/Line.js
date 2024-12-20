export default class Line{
    constructor(editor){
        this.name = 'line';
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
        drawLayer.ctxCommand('beginPath')
        drawLayer.ctxCommand('moveTo',this.x0, this.y0)
        drawLayer.ctxCommand('lineTo',x,y)
        drawLayer.ctxCommand('stroke')
        drawLayer.ctxCommand('closePath')
        document.sync()
    }


}
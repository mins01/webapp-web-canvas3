import BaseTool from './BaseTool.js';
import Color from '../../third_party/js-color/lib/Color.js';

export default class Spuit extends BaseTool{
    remainInterval = 0;
    brush = null;
    color = null;
    constructor(editor){
        super(editor);
        this.name = 'Brush';
        this.brush = this.editor.brush;
        this.color = new Color()
    }

    start(){
        super.start();
        this.brush.ready()        
        this.ready()
    }
    onpointerdown(event){
        if(super.onpointerdown(event)===false){return false;}
        this.brush.pointerEvent = event;
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.remainInterval = 0;
        this.pick(this.x0,this.y0)
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        this.brush.pointerEvent = event;
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.pick(this.x1,this.y1);
        this.x0 = x; this.y0 = y;
        return;
    }
    onpointerup(event){
        this.brush.pointerEvent = event;

        globalThis.cpForeColor.set(this.color.toHex())
        globalThis.modalHandler.get('modal-color-palette').show()

        const obj = {'foreColor':this.color.toHex()}
        this.editor.setContextConfig(obj);
        localStorage.setItem('foreColor',this.color.toHex())

        return super.onpointerup(event);
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




    pick(x0,y0){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = layer.ctx;
        
        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }
        
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        // console.log(lx0,ly0);
        const imageData = document.ctx.getImageData(lx0,ly0,1,1);
        const [r, g, b, a] = imageData.data; // RGBA 값 추출

        this.color.set(r, g, b);
        // console.log(this.color);
        window.document.querySelector('#btn-palette').style.backgroundColor = this.color.toHex()
    }


}
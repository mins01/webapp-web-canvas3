import BaseTool from './BaseTool.js';
import Color from '../../third_party/js-color/lib/Color.js';

export default class Spuit extends BaseTool{
    remainInterval = 0;
    brush = null;
    color = null;
    constructor(editor){
        super(editor);
        this.name = 'Spuit';
        this.color = new Color()
    }

    onpointerdown(event){
        if(super.onpointerdown(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.pick(this.x0,this.y0)
        return;
    }
    onpointermove(event){
        if(super.onpointermove(event)===false){return false;}
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.pick(this.x1,this.y1);
        this.x0 = x; this.y0 = y;
        return;
    }
    onpointerup(event){
        globalThis.modalHandler.get('modal-color-palette').show()
        globalThis.cpForeColor.setPreview(this.color.toHex())

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
        // this.document.history.reload();
    }




    pick(x0,y0){
        super.draw(...arguments);
        const document = this.document;

        const [lx0,ly0] = this.getXyInDocument(x0,y0)
        const imageData = document.ctx.getImageData(lx0,ly0,1,1);
        const [r, g, b, a] = imageData.data; // RGBA 값 추출
        // console.log(lx0,ly0,r, g, b, a);
        this.color.set(r, g, b);
    }


}
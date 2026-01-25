import BaseTool from './BaseTool.js';
import Color from '../../third_party/js-color/lib/Color.js';

export default class Spuit extends BaseTool{
    remainInterval = 0;
    brush = null;
    color = null;
    buffer = null;
    constructor(editor){
        super(editor);
        this.name = 'Spuit';
        this.color = new Color()
    }

    activate(cb=null){
        this.buffer = this.document.ctx.getImageData(0,0,this.document.width,this.document.height);
		super.activate(cb);
	}
    inactivate(cb=null){
		this.buffer = null
		super.inactivate(cb);
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
        // this.document.history.save(`Tool.${this.constructor.name}`); //히스토리 저장 안한다!
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


        // console.log(this.buffer);
        if(this.buffer){
            const { width, data } = this.buffer;
            const i = (ly0 * width + lx0) * 4; // 1픽셀 = 4바이트
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // const a = data[i + 3];
            this.color.set(r, g, b);
        }else{ //failback
            const imageData = document.ctx.getImageData(lx0,ly0,1,1);
            const [r, g, b, a] = imageData.data; // RGBA 값 추출
            // console.log(lx0,ly0,r, g, b, a);
            this.color.set(r, g, b);
        }
    }


}
import BaseTool from './BaseTool.js';
import DrawText from '../draw/DrawText.js';

import CssLengthUtil from '../lib/CssLengthUtil.js';

export default class Text extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'text';
        this.editor = editor;

        // this.x0 = null;
        // this.y0 = null;
        this.text= null;
    }


    start(){
        super.start();
        this.ready();
    }
    onpointerdown(event){
        super.onpointerdown(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointermove(event){
        super.onpointermove(event);
        const [x,y] = this.getXyFromEvent(event);
        this.x1 = x; this.y1 = y;
        this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointerup(event){
        super.onpointerup(event);
        // const [x,y] = this.getXYForLayer(event);
        // this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    end(){
        super.end();
        // this.ready();

    }
    input(event){
        super.input(event);
        this.text = event.target.value??event.target.innerText;
    }

    commit(){
        super.commit();
        this.layer.merge(this.drawLayer)
        this.ready();
        this.document.history.save(`Tool.${this.constructor.name}`);
    }
    

    draw(x0,y0,x1,y1){
        super.draw(...arguments);
        const document = this.document;
        const layer = this.layer;
        const drawLayer = this.drawLayer;
        const ctx = drawLayer.ctx;

        if(!layer.drawable){ console.log('drawable',layer.drawable); return; }

        ctx.save();
        this.prepareLayer(ctx);
        // 레이어 기준으로 좌표 재계산
        const [lx0,ly0] = this.getXyInLayer(...this.getXyInDocument(x0,y0));
        const [lx1,ly1] = this.getXyInLayer(...this.getXyInDocument(x1,y1));

        let w = lx1 - lx0;
        let h = ly1 - ly0;      
        
        drawLayer.clear();

        ctx.beginPath();
        ctx.rect(lx0, ly0, w,h);        
        if(ctx.fillAfterStroke??true){ ctx.fill(); ctx.stroke(); }else{ ctx.stroke(); ctx.fill(); }
        ctx.closePath();

        ctx.canvas.contextConfig.assignTo(ctx,true);


        // console.log(ctx.font,this.editor.contextConfig.lineHeightPx);
        

        let text = 'text text 한글 \n 자동 줄바꿈을 어떻게 하지.자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. 자동 줄바꿈을 어떻게 하지. \n줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후줄바꿈 후';

        let xs = Math.min(lx0,lx1);
        let ys = Math.min(ly0,ly1);

        DrawText.draw(ctx,text,Math.abs(w),Math.abs(h),xs,ys,
            CssLengthUtil.pxBasedOnFontSize(ctx.lineHeight,ctx.fontSize),
        );
        
        ctx.restore();

        drawLayer.flush()
    }
	ready(){
        const textColor = this?.layer?.textConfig?.textColor??'#000000'
        globalThis.window.document.querySelectorAll('.wc-bg-textColor').forEach(el=>{
            el.style.backgroundColor = textColor
        })
        super.ready();
	}


}
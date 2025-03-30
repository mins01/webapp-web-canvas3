import BaseTool from './BaseTool.js';
import DrawText from '../draw/DrawText.js';

import CssLengthUtil from '../lib/CssLengthUtil.js';
import LayerKind from '../lib/LayerKind.js';

export default class Text extends BaseTool{
    utt = null;
    targetLayer = null;

    constructor(editor){
        super(editor);
        this.name = 'Text';
        this.editor = editor;

        // this.x0 = null;
        // this.y0 = null;
        this.text= null;

        this.utt = editor.utt;
    }


    start(){
        super.start();
        this.ready();
    }

    ready(){
        const textColor = this?.layer?.textConfig?.textColor??'#000000'
        const disabled = !(this?.layer?.textConfig??false)
        globalThis.window.document.querySelectorAll('.wc-bg-textColor').forEach(el=>{
            el.style.backgroundColor = textColor
            el.disabled = disabled;
        })

        super.ready();
        this.targetLayer = this.document.layer;
        this.readyUtt();
        this.draw();
        
    }

	/** 
	 * 활성화 : 툴이 선택 되면
	 */
	activate(cb=null){        
        super.activate(()=>{
            if(this.layer.kind != LayerKind.TEXT){
                console.warn(`Only text layer are supported. (${this.layer.kind})`);
                this.enable = false;
            }else{
                this.enable = true;
            }
            if(cb) cb();
        });
	}

    readyUtt(){
        const document = this.document
        // const documentRect = this.documentRect;
        // const layer = this.document.layer;
        const targetLayer = this.targetLayer;
        const mul = document.zoom*targetLayer.zoom

        let [leftC,topC] =this.getPageXyFromDocumentXy(targetLayer.left+targetLayer.width/2,targetLayer.top+targetLayer.height/2)
        
        this.utt.left = Math.round(leftC - targetLayer.width/2*mul);
        this.utt.top = Math.round(topC - targetLayer.height/2*mul);
        
        this.utt.width = targetLayer.width*mul
        this.utt.height = targetLayer.height*mul

    }


    onpointerdown(event){
        super.onpointerdown(event);
        // const [x,y] = this.getXyFromEvent(event);
        // this.x0 = x; this.y0 = y; this.x1 = x; this.y1 = y;
        // this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointermove(event){
        super.onpointermove(event);
        // const [x,y] = this.getXyFromEvent(event);
        // this.x1 = x; this.y1 = y;
        // this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    onpointerup(event){
        super.onpointerup(event);
        // const [x,y] = this.getXYForLayer(event);
        // this.draw(this.x0,this.y0,this.x1,this.y1);
    }
    end(){
        if(super.end()===false){return false;}
        // this.document.history.save(`Tool.${this.constructor.name}`);
        this.document.history.save(`Tool.${this.constructor.name}`);
        this.ready();
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
        const utt = this.utt;
        const document = this.document
        const documentRect = this.documentRect;
        const layer = this.document.layer
        const targetLayer = this.targetLayer
        const mul = document.zoom / targetLayer.zoom
        const ctx = targetLayer.ctx


        let docCenterX = (documentRect.right + documentRect.left) / 2
		let docCenterY = (documentRect.bottom + documentRect.top) / 2

        let leftUttC = utt.left + utt.width/2;
        let topUttC = utt.top + utt.height/2;
        // console.log(leftUttC, utt.width/2);

        [leftUttC,topUttC] = this.rotatePoint(leftUttC, topUttC, docCenterX, docCenterY, -document.angle)


        let [leftLC,topLC] = this.getDocumentXyFromPageXy(leftUttC,topUttC);
        let width = utt.width / mul;      
        let height = utt.height / mul;

        let left = leftLC - width/2;
        let top =  topLC - height/2;

        ctx.save();
        targetLayer.left = Math.floor(left); //반올림 하면 오차가 나네...뭐지?
        targetLayer.top = Math.floor(top);
        targetLayer.width = Math.floor(width);
        targetLayer.height = Math.floor(height);

        ctx.restore();
        targetLayer.flush();

        super.draw(...arguments);
        
    }


    onuttmove(){
        this.draw()
    }
    onuttresize(){
        this.draw()
    }
    onuttmoveend(){
        this.draw()
        this.document.history.save(`Tool.${this.constructor.name}`);
    }
    onuttresizeend(){
        this.draw()
        this.document.history.save(`Tool.${this.constructor.name}`);
    }


}
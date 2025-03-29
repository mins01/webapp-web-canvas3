import BaseTool from './BaseTool.js';
import DrawText from '../draw/DrawText.js';

import CssLengthUtil from '../lib/CssLengthUtil.js';
import LayerKind from '../lib/LayerKind.js';

export default class Text extends BaseTool{
    constructor(editor){
        super(editor);
        this.name = 'Text';
        this.editor = editor;

        // this.x0 = null;
        // this.y0 = null;
        this.text= null;
    }


    start(){
        super.start();
        this.ready();
    }

	/** 
	 * 활성화 : 툴이 선택 되면
	 */
	activate(cb=null){        
        super.activate(()=>{
            if(this.layer.kind != LayerKind.TEXT){
                console.log(`Only text layer are supported. (${this.layer.kind})`);
                this.enable = false;
            }else{
                this.enable = true;
            }
            if(cb) cb();
        });
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
        
    }
	ready(){
        const textColor = this?.layer?.textConfig?.textColor??'#000000'
        const disabled = !(this?.layer?.textConfig??false)
        globalThis.window.document.querySelectorAll('.wc-bg-textColor').forEach(el=>{
            el.style.backgroundColor = textColor
            el.disabled = disabled;
        })

        super.ready();
	}


}
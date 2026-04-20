
import SelectableMap from "../lib/SelectableMap.js";

// 툴 모듈 들
import Brush from "./Brush.js"
import Eraser from "./Eraser.js"
import Hand from "./Hand.js"
// import Move from "./Move.js"
import Polygon from "./Polygon.js"
import Rectangle from "./Rectangle.js"
import SelectionRectangle from "./SelectionRectangle.js"
import Spuit from "./Spuit.js"
import Star from "./Star.js"
import Text from "./Text.js"
import Transform from "./Transform.js"


export default class Tools extends SelectableMap{
    editor = null;
    toolName = '';
    constructor(editor){
        super();
        this.editor = editor;
        this.toolName = '';

        // 툴 모듈 미리준비
        this.set('Brush', new Brush(this.editor));
        this.set('Eraser', new Eraser(this.editor));
        this.set('Hand', new Hand(this.editor));
        // this.set('Move', new Move(this.editor));
        this.set('Polygon', new Polygon(this.editor));
        this.set('Rectangle', new Rectangle(this.editor));
        this.set('SelectionRectangle', new SelectionRectangle(this.editor));
        this.set('Spuit', new Spuit(this.editor));
        this.set('Star', new Star(this.editor));
        this.set('Text', new Text(this.editor));
        this.set('Transform', new Transform(this.editor));


    }

    get tool(){ return this?.selected??null; }

    /**
     * 툴 선택
     * 로드 안되어있으면 로드한다.
     * 선택 될때마다 inactive,active 를 동작한다.
     *
     * @async
     * @param {*} toolName 
     * @returns {unknown} 
     */
    async select(toolName){
        if(this.tool){ this.tool.deactivate(); }
        if(!this.has(toolName)){
            return await this.load(toolName).then(()=>{
                this.toolName = toolName;
                this.editor.dispatchEvent('wc.tools.load', { toolName:toolName, tool:this.tool } );
                super.select(toolName);
                if(this.tool){
                    this.tool.activate();
                    this.editor.dispatchEvent('wc.tools.select', { toolName:toolName, tool:this.tool } );
                }
                return this.tool;
            }).catch(e=>{console.error(e)});
        }else{
            super.select(toolName);
            if(this.tool){
                this.tool.activate();
                this.editor.dispatchEvent('wc.tools.select', { toolName:toolName, tool:this.tool } );
            }
        }
        return this.tool;
    }
    /**
     * 동적으로 tool 모듈 로딩
     *
     * @async
     * @param {*} toolName 
     * @returns {*} 
     */
    async load(toolName){
        let module = await import(`./${toolName}.js`);
        if(module && module.default){
            console.log('loaded tool: '+toolName);
            this.set(toolName, new module.default(this.editor));
        }
    }
}
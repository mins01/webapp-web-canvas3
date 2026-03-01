// import Line from "./Line.js";
// import Rectangle from "./Rectangle.js";
import SelectableMap from "../lib/SelectableMap.js";
import Brush from "./Brush.js";
import Eraser from "./Eraser.js";
import Transform from "./Transform.js";

export default class Tools extends SelectableMap{
    constructor(editor){
        super();
        this.editor = editor;
        this.toolName = '';
        
        this.set(Brush, new Brush(this.editor));
        this.set(Eraser, new Eraser(this.editor));
        this.set(Transform, new Transform(this.editor));

    }

    get tool(){ return this?.selected??null; }


    
    async select(toolName){
        if(this.tool){ this.tool.inactivate(); }
        if(!this.has(toolName)){
            await this.load(toolName).then(()=>{
                
                this.toolName = toolName;
                super.select(toolName);
                this.editor.dispatchEvent('wc.tools.load', { toolName:toolName, tool:this.tool } );
                if(this.tool){
                    this.editor.dispatchEvent('wc.tools.select', { toolName:toolName, tool:this.tool } );
                    this.tool.activate();
                }
            }).catch(e=>{console.error(e)});
        }else{
            super.select(toolName);
            if(this.tool){
                this.editor.dispatchEvent('wc.tools.select', { toolName:toolName, tool:this.tool } );
                this.tool.activate();
            }
        }
        return this.tool;
    }
    async load(toolName){       
        let module = await import(`./${toolName}.js`);
        if(module && module.default){
            console.log('loaded tool: '+toolName);
            this.set(toolName, new module.default(this.editor));
        }        
    }
}
// import Line from "./Line.js";
// import Rectangle from "./Rectangle.js";
import SelectableMap from "../lib/SelectableMap.js";
import Brush from "./Brush.js";
import Brush1 from "./Brush1.js";
import Brush2 from "./Brush2.js";
import Brush3 from "./Brush3.js";
import Eraser from "./Eraser.js";
import Transform from "./Transform.js";

export default class Tools extends SelectableMap{
    constructor(editor){
        super();
        this.editor = editor;
        this.toolName = '';
        
        this.set(Brush, new Brush(this.editor));
        this.set(Brush1, new Brush1(this.editor));
        this.set(Brush2, new Brush2(this.editor));
        this.set(Brush3, new Brush3(this.editor));
        this.set(Eraser, new Eraser(this.editor));
        this.set(Transform, new Transform(this.editor));

    }

    get tool(){ return this?.selected??null; }


    
    select(toolName){
        if(this.tool){ this.tool.inactivate(); }
        if(!this.has(toolName)){
            this.load(toolName).then(()=>{
                
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
    }
    async load(toolName){       
        let module = await import(`./${toolName}.js`);
        if(module && module.default){
            console.log('loaded tool: '+toolName);
            this.set(toolName, new module.default(this.editor));
        }        
    }
}
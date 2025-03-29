// import Line from "./Line.js";
// import Rectangle from "./Rectangle.js";
import SelectableMap from "../lib/SelectableMap.js";
import Line from "./Line.js"

export default class Tools extends SelectableMap{
    constructor(editor){
        super();
        this.editor = editor;
        this.toolName = '';
        // this.tools = new SelectableMap();

        // this.select('Line');
        // this.set(this.toolName, new Line(this.editor)); // line이 기본 툴이 된다.

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
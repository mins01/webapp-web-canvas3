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
                console.log('selected tool: '+toolName);
                this.toolName = toolName;
                super.select(toolName);
                if(this.tool){
                    this.tool.activate();
                    this.editor.dispatchEvent(new CustomEvent('wc.tools.select',{ bubbles:true,cancelable:true,composed:true, detail: { toolName:toolName, tool:this.tool } }));
                }
            }).catch(e=>{console.error(e)});
        }else{
            super.select(toolName);
            if(this.tool){
                this.tool.activate();
                this.editor.dispatchEvent(new CustomEvent('wc.tools.select',{ bubbles:true,cancelable:true,composed:true, detail: { toolName:toolName, tool:this.tool } }));
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
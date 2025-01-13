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
    select(toolName){
        if(!this.has(toolName)){
            this.load(toolName).then(()=>{
                console.log('selected tool: '+toolName);
                this.toolName = toolName;
                super.select(toolName);
            }).catch(e=>{console.error(e)});
        }else{
            super.select(toolName);
        }
        if(this.selected) this.selected.init();
    }
    async load(toolName){       
        let module = await import(`./${toolName}.js`);
        if(module && module.default){
            console.log('loaded tool: '+toolName);
            this.set(toolName, new module.default(this.editor));
        }        
    }
}
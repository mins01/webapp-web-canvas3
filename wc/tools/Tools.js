// import Line from "./Line.js";
// import Rectangle from "./Rectangle.js";
import SelectableMap from "../libs/SelectableMap.js";

export default class Tools extends SelectableMap{
    constructor(editor){
        super();
        this.editor = editor;
        this.toolName = '';
        // this.tools = new SelectableMap();
        this.select('Line');
    }
    select(toolName){
        if(!this.has(toolName)){
            this.load(toolName).then(()=>{
                console.log('loaded',toolName);
                this.toolName = toolName;
                super.select(toolName);
            }).catch(e=>{console.error(e)});
        }else{
            super.select(toolName);
        }
    }
    async load(toolName){       
        let module = await import(`./${toolName}.js`);
        if(module && module.default){
            console.log('loaded',toolName);
            this.set(toolName, new module.default(this.editor));
        }        
    }
}
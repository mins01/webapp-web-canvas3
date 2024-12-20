import Line from "./Line.js";

export default class Tools{
    constructor(editor){
        this.editor = editor;
        this.toolName = '';
        this.tools = {}
        this.active('line');
    }
    active(toolName=null){
        if(toolName===null){
            toolName = this.toolName;
        }
        if(this.tools[toolName]??false){
            
        }else{
            switch(toolName){
                case 'line':
                    this.tools[toolName] = new Line(this.editor);
                    break;
                default: throw new Error(`[${toolName}]는 지원되지 않는 툴입니다.`); break;
            }
        }
        let tool = this.tools[toolName]??null;
        this.editor.tool = tool;
        return tool;
    }
}
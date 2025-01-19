import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    save(){
        const layers = this.document.layers;
        const snapshot = layers.snapshot();
        super.save(snapshot);
    }
    undo(){
        const layers = this.document.layers;
        const snapshot = super.undo();
        console.log(snapshot);
        
        if(snapshot===null){return false}
        layers.import(snapshot);
        return true;
    }
    redo(){
        const layers = this.document.layers;
        const snapshot = super.redo();
        if(snapshot===null){return false}
        layers.import(snapshot);
        return true;
    }
    
}
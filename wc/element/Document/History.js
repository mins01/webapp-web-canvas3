import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    save(title='no-title'){
        console.log('History:save();',this.currentIndex,this.length);
        const layers = this.document.layers;
        const snapshot = layers.snapshot();
        snapshot.title = title
        super.save(snapshot);
        console.log('END History:save();',snapshot.selectedIndex);
    }
    undo(){
        console.log('History:undo();',this.currentIndex,this.length);
        const layers = this.document.layers;
        const snapshot = super.undo();
        if(snapshot===null){return false}
        console.log('history.undo();',snapshot.title);
        layers.import(snapshot);
        return true;
    }
    redo(){
        console.log('History:redo();',this.currentIndex,this.length);
        const layers = this.document.layers;
        const snapshot = super.redo();
        if(snapshot===null){return false}
        console.log('history.redo();',snapshot.title);
        console.log(snapshot.title);
        layers.import(snapshot);
        return true;
    }

}
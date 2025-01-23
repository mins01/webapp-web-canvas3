import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    save(title='no-title',withoutElements=false){
        console.log('History:save();',this.currentIndex,this.length);
        const layers = this.document.layers;
        const snapshot = layers.snapshot(withoutElements);
        snapshot.title = title
        super.save(snapshot);
        console.log('END History:save();',snapshot.selectedIndex);
    }
    undo(){
        const layers = this.document.layers;
        const snapshot = super.undo();
        if(snapshot===null){return false}
        console.log('history.undo();',this.currentIndex,this.length,snapshot.title);
        layers.import(snapshot);
        return true;
    }
    redo(){
        const layers = this.document.layers;
        const snapshot = super.redo();
        if(snapshot===null){return false}
        console.log('history.redo();',this.currentIndex,this.length,snapshot.title);
        layers.import(snapshot);
        return true;
    }

}
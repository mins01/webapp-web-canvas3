import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    save(title='no-title',withoutElements=false){
        console.log('History:save();',title,this.currentIndex,this.length);
        const layers = this.document.layers;
        const snapshot = layers.snapshot(withoutElements);
        snapshot.title = title
        super.save(snapshot);
    }
    undo(){
        const layers = this.document.layers;
        const snapshot = super.undo();
        if(snapshot===null){return false}
        console.log('history.undo();',snapshot.title,this.currentIndex,this.length);
        layers.import(snapshot);
        this.document.editor?.tool?.init()
        return true;
    }
    redo(){
        const layers = this.document.layers;
        const snapshot = super.redo();
        if(snapshot===null){return false}
        console.log('history.redo();',snapshot.title,this.currentIndex,this.length);
        layers.import(snapshot);
        this.document.editor?.tool?.init()
        return true;
    }
    reload(){
        const layers = this.document.layers;
        const snapshot = super.current();
        if(snapshot===null){return false}
        console.log('history.reload();',snapshot.title,this.currentIndex,this.length);
        layers.import(snapshot);
        this.document.editor?.tool?.init()
        return true;
    }

}
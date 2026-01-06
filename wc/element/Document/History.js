import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    save(title='no-title',withoutElements=false){
        const layers = this.document.layers;
        // const snapshot = layers.snapshot(withoutElements); // @deprecated
        // const snapshot = layers.clone(withoutElements);
        const snapshot = layers.cloneOnlyUpdated(withoutElements);
        snapshot.title = title
        snapshot.updatedAt = snapshot.elements.map(el=>el.updatedAt).reduce((a, b) => Math.max(a, b), 0)??0;
        super.save(snapshot);
        console.log('History:save();',title,`idx:${this.currentIndex},len:${this.length}`);
    }
    undo(){
        const layers = this.document.layers;
        const snapshot = super.undo();
        if(snapshot===null){return false}
        console.log('history.undo();',snapshot.title,`idx:${this.currentIndex},len:${this.length}`);
        layers.import(snapshot);
        setTimeout(()=>{
            this.document.flush();
            this.document.editor?.tool?.activate()
        },20)
        return true;
    }
    redo(){
        const layers = this.document.layers;
        const snapshot = super.redo();
        if(snapshot===null){return false}
        console.log('history.redo();',snapshot.title,`idx:${this.currentIndex},len:${this.length}`);
        layers.import(snapshot);
        this.document.flush();
        this.document.editor?.tool?.activate()
        setTimeout(()=>{
            this.document.flush();
            this.document.editor?.tool?.activate()
        },20)
        return true;
    }
    reload(){
        const layers = this.document.layers;
        const snapshot = super.current();
        if(snapshot===null){return false}
        console.log('history.reload();',snapshot.title,`idx:${this.currentIndex},len:${this.length}`);
        layers.import(snapshot);
        this.document.flush();
        this.document.editor?.tool?.activate()
        return true;
    }

}
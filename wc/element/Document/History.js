import LimitedHistory from "../../lib/LimitedHistory.js";
export default class History extends LimitedHistory{
    document = null;
    useDebugHistoryLayers = false
    constructor(document,maxLength){
        super(maxLength)
        this.document = document;
    }
    debugHistoryLayers(){
        if(!this.useDebugHistoryLayers){ return; }
        const historyLayers = globalThis.document.querySelector('#historyLayers')
        if(!historyLayers){
            console.error('Not exists #historyLayers');
            return false;
        }
        historyLayers.replaceChildren();
        this.history.forEach(history => {
            history.elements.forEach(element=>{
                historyLayers.append(element)
            })
        });
    }
    save(title='no-title',withoutElements=false){
        
        const lastSnapshot = super.current();
        const lastUpdatedAt = lastSnapshot?.lastUpdatedAt??0;
        // console.log('lastUpdatedAt',lastUpdatedAt);
        
        const layers = this.document.layers;
        // const snapshot = layers.snapshot(withoutElements); // @deprecated // 20260122 우선 이걸로 롤백. clone 동작이 이상해서
        // const snapshot = layers.clone(withoutElements);
        const snapshot = layers.cloneOnlyUpdated(withoutElements,lastUpdatedAt); 
        snapshot.title = title
        // snapshot.updatedAt = snapshot.elements.map(el=>el.updatedAt).reduce((a, b) => Math.max(a, b), 0)??0;
        super.save(snapshot);
        console.log('History:save();',title,`idx:${this.currentIndex},len:${this.length}`);
        this.debugHistoryLayers();
    }
    undo(){
        const layers = this.document.layers;
        const snapshot = super.undo();
        console.log('undo.snapshot',snapshot);
        
        

        if(snapshot===null){return false}
        console.log('history.undo();',snapshot.title,`idx:${this.currentIndex},len:${this.length}`);
        layers.import(snapshot);
        setTimeout(()=>{
            this.document.flush();
            this.document.editor?.tool?.activate()
        },20)
        this.debugHistoryLayers();
        return true;
    }
    redo(){
        const layers = this.document.layers;
        const snapshot = super.redo();
        console.log('snapshot',snapshot);
        
        

        if(snapshot===null){return false}
        console.log('history.redo();',snapshot.title,`idx:${this.currentIndex},len:${this.length}`);
        layers.import(snapshot);
        this.document.flush();
        this.document.editor?.tool?.activate()
        setTimeout(()=>{
            this.document.flush();
            this.document.editor?.tool?.activate()
        },20)

        this.debugHistoryLayers();
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
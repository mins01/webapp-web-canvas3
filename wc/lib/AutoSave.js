import AutoSaveDB from "./AutoSaveDB.js";

export default class AutoSave{
  editor = null;
  duration = 60*1000*5; //60sec
  tm = null;
  docId = 'autosave';
  constructor(editor,duration=60*1000*5){
    this.editor = editor;
    this.duration = duration;
  }
  get updatedAt(){
    return parseInt(localStorage.getItem('wc-auto-save-document-updated-at')??0)
  }
  activate(){
    if(this.tm){
      console.warn('AutoSave','Already activated.');
      return;
    }
    this.tm = setInterval(()=>{
      this.autoSave()
    },this.duration);
    console.log('AutoSave','activated.');
  }
  deactivate(){
    if(this.tm){
      clearInterval(this.tm);
      this.tm = null;
      console.log('AutoSave','deactivated.');
      return;
    }
    console.warn('AutoSave','Not activated.');
  }
  save(){
    const updatedAt = this?.editor?.document?.updatedAt
    if(!updatedAt){return false;}    
    localStorage.setItem('wc-auto-save-document-updated-at',updatedAt)

    // const documentJson = JSON.stringify(this.editor.document.exportWithDataUrl());
    const documentJson = JSON.stringify(this.editor.document.exportWithDataUrl());
    AutoSaveDB.put(this.docId, {
      updatedAt: Date.now(),
      content: documentJson
    }).catch(err => {
      console.error('IndexedDB autosave failed', err);
    });

    // try {
    //   localStorage.setItem('wc-auto-save-document-json',JSON.stringify(this.editor.document.exportWithDataUrl()))
    // } catch (e) {
    //   console.error(e)
    //   if (e.name === 'QuotaExceededError') {
    //     console.warn('localStorage quota exceeded, autosave skipped');
    //   }
      
    // }

    console.log('AutoSave.save()',updatedAt);
  }
  async clear(){
    localStorage.removeItem('wc-auto-save-document-updated-at')
    await AutoSaveDB.delete(this.docId);
    // localStorage.removeItem('wc-auto-save-document-json')
  }
  canAutoSave(){
    const updatedAt = this?.editor?.document?.updatedAt
    if(!updatedAt){return false;}
    const lsUpdatedAt = parseInt(localStorage.getItem('wc-auto-save-document-updated-at')??0);
    if(updatedAt > lsUpdatedAt){
      return true;
    }
    console.log('AutoSave','Not save',(updatedAt - lsUpdatedAt));
    return false;
  }

  autoSave(){
    if(this.canAutoSave()){
      this.save();
    }
  }
  async load(){
    const AutoSaveDBData = await AutoSaveDB.get(this.docId);
    const json = JSON.parse(AutoSaveDBData.content); //TODO JSON.parse 안 쓰도록 해보자.
    // console.log(json.name);
    
    // const json = JSON.parse(localStorage.getItem('wc-auto-save-document-json'));
    this.editor.loadDocumentJson(json)
  }

}
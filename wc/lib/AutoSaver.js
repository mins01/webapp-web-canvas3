export default class AutoSaver{
  editor = null;
  duration = 60*1000*5; //60sec
  tm = null;
  constructor(editor,duration=60*1000*5){
    this.editor = editor;
    this.duration = duration;
  }
  get updatedAt(){
    return parseInt(localStorage.getItem('wc-auto-save-document-updated-at')??0)
  }
  activate(){
    if(this.tm){
      console.warn('AutoSaver','Already activated.');
      return;
    }
    this.tm = setInterval(()=>{
      this.autoSave()
    },this.duration);
    console.log('AutoSaver','activated.');
  }
  deactivate(){
    if(this.tm){
      clearInterval(this.tm);
      this.tm = null;
      console.log('AutoSaver','deactivated.');
      return;
    }
    console.warn('AutoSaver','Not activated.');
  }
  save(){
    const updatedAt = this?.editor?.document?.updatedAt
    if(!updatedAt){return false;}    
    localStorage.setItem('wc-auto-save-document-updated-at',updatedAt)
    localStorage.setItem('wc-auto-save-document-json',JSON.stringify(this.editor.document.export()))
    console.log('AutoSaver.save()',updatedAt);
  }
  clear(){
    localStorage.removeItem('wc-auto-save-document-updated-at')
    localStorage.removeItem('wc-auto-save-document-json')
  }
  canAutoSave(){
    const updatedAt = this?.editor?.document?.updatedAt
    if(!updatedAt){return false;}
    const lsUpdatedAt = parseInt(localStorage.getItem('wc-auto-save-document-updated-at')??0);
    if(updatedAt > lsUpdatedAt){
      return true;
    }
    console.log('AutoSaver','Not save',(updatedAt - lsUpdatedAt));
    return false;
  }

  autoSave(){
    if(this.canAutoSave()){
      this.save();
    }
  }
  load(){
    const json = localStorage.getItem('wc-auto-save-document-json');
    this.editor.loadDocumentJson(json)
  }

}
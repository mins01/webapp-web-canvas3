import SelectableArray from "../../lib/SelectableArray.js";
import Document from "../Document.js";


export default class Documents extends SelectableArray{
  editor = null;
  constructor(editor){
    super();
    this.editor = editor;
  }
  add(document){
    if(!(document.stage??false)){
      document.stage = document.closest('.wc-frame , .wc-document-stage')??null;
      if(!document.stage){
          const stage = window.document.createElement('div');
          stage.classList.add('wc-frame');
          stage.classList.add('wc-document-stage');
          const wrapper = window.document.createElement('div');
          wrapper.classList.add('wc-document-wrapper');
          document.stage = stage;
          document.wrapper = wrapper;
          wrapper.append(document)
          stage.append(wrapper)
      }
    }
    const stage = document.stage;
    // console.log(document.stage);
    
    super.add(document);
    document.editor = this.editor;
    this.editor.target.append(stage)
    document.flush();
    document.ready();
    document.history.clear();
    document.history.save('new document');
    setTimeout(()=>{
      stage.scrollLeft = (stage.scrollWidth - stage.offsetWidth) / 2;
      stage.scrollTop = (stage.scrollHeight - stage.offsetHeight) / 2;

      document.history.clear();
      document.history.save('new document');
      this.editor?.tool?.activate();
    },10)
    this.editor.ready();
    this.editor?.tool?.activate();
  }

  create(width,height){
    const document = new Document(width,height);
    document.layers[0].fill('#fff')
    const layer = document.addEmptyLayer();
    layer.postionCenterCenter()
    this.add(document);
    return document;
  }

  remove(){
    if(!this.selected){
      console.error('Not exists a selected document.')
      return false;
    }
    const document = this.selected;
    document.stage.remove();
    document.dispose();
    const r = super.remove();
    if(r>=0){ this.select(r); }
    this.editor.ready();
  }
}
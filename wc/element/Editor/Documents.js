import SelectableArray from "../../lib/SelectableArray.js";
import Document from "../Document.js";


export default class Documents extends SelectableArray{
  editor = null;
  constructor(editor){
    super();
    this.editor = editor;
  }
  add(document){
    if(!(document.frame??false)){
      document.frame = document.closest('.wc-frame')??null;
      if(!document.frame){
          const frame = window.document.createElement('div');
          frame.classList.add('wc-frame');
          document.frame = frame;
          document.frame.append(document)
      }
    }
    const frame = document.frame;
    // console.log(document.frame);
    
    super.add(document);
    document.editor = this.editor;
    // if(!document.frame){
    //   const frame = document.createElement('div');
    //   frame.classList.add('wc-frame');
    //   document.frame = frame;
    // }
    this.editor.target.append(frame)
    // document.scrollIntoView( { behavior:'smooth', block:'center', inline:'center', } );
    document.flush();
    document.ready();
    document.history.clear();
    document.history.save('new document');
    setTimeout(()=>{
      frame.scrollLeft = (frame.scrollWidth - frame.offsetWidth) / 2;
      frame.scrollTop = (frame.scrollHeight - frame.offsetHeight) / 2;

      document.history.clear();
      document.history.save('new document');
      this.editor?.tool?.activate();
    },10)
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
    document.frame.remove();
    const r = super.remove();
    if(r>=0){ this.select(r); }
  }
}
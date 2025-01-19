import SelectableArray from "../../lib/SelectableArray.js";

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
    console.log(document.frame);
    
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
    setTimeout(()=>{
      frame.scrollLeft = (frame.scrollWidth - frame.offsetWidth) / 2;
      frame.scrollTop = (frame.scrollHeight - frame.offsetHeight) / 2;
    },10)    
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
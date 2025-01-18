import SelectableArray from "../../lib/SelectableArray.js";

export default class Documents extends SelectableArray{
  editor = null;
  add(element){
    super.add(element);
    if(!element.frame){
      const frame = document.createElement('div');
      frame.classList.add('wc-frame');
      element.frame = frame;
    }
    this.editor.target.append(element.frame)
    // element.scrollIntoView( { behavior:'smooth', block:'center', inline:'center', } );
    element.flush();
    setTimeout(()=>{
      const frame = element.frame
      frame.scrollLeft = (frame.scrollWidth - frame.offsetWidth) / 2;
      frame.scrollTop = (frame.scrollHeight - frame.offsetHeight) / 2;
    },10)
  
    
  }
}
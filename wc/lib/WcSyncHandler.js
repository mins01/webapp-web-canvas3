export default class WcSyncHandler{
  constructor(){

  }

  addEventListener(){
    window.addEventListener('change',(event)=>{
      const target = event.target;
      if(target.dataset.wcSync){ this.sync(target) }
    })
    window.addEventListener('input',(event)=>{
      const target = event.target;
      if(target.dataset.wcSync){ this.sync(target) }
    })
    window.addEventListener('show.bs.modal',(event)=>{
      const target = event.target;
      target.querySelectorAll('[data-wc-sync]').forEach(el=> {
        this.sync(el);
      });      
    })
  }

  sync(input){
    const wcSync = input.dataset.wcSync;
    const splits = wcSync.split(/\./g);
    const inputType = input.type??'text'

    let v = globalThis;
    splits.forEach((split)=>{
      if(v===null){return;}
      if(!v[split]){ v = null}
      v = v[split];
    })
    if(['checkbox','radio'].includes(inputType)){
      if(input.value == v) input.checked = true;
    }else{
      input.value = v
    }
    
  }
}
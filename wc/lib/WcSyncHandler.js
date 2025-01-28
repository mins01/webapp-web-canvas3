export default class WcSyncFromHandler{
  constructor(){

  }

  addEventListener(){
    // window.addEventListener('change',(event)=>{
    //   const target = event.target;
    //   if(target.dataset.wcSyncFrom){ this.syncFrom(target) }
    // })
    // window.addEventListener('input',(event)=>{
    //   const target = event.target;
    //   if(target.dataset.wcSyncFrom){ this.syncFrom(target) }
    // })
    window.addEventListener('show.bs.modal',(event)=>{
      const target = event.target;
      target.querySelectorAll('[data-wc-sync-from]').forEach(el=> {
        this.syncFrom(el);
      });      
    })
  }

  syncFrom(input){
    const wcSyncFrom = input.dataset.wcSyncFrom;
    const splits = wcSyncFrom.split(/\./g);
    const inputType = input.type??'text'

    let v = globalThis;
    splits.forEach((split)=>{
      if(v===null){return;}
      v = v?.[split]??null;
    })
    if(v===null){
      return;
    }
    if(['checkbox','radio'].includes(inputType)){
      if(input.value == v) input.checked = true;
    }else{
      input.value = v
    }
  }
}
import HtmlUtil from "./HtmlUtil.js"

export default class WcSyncHandler{
  constructor(){

  }

  addEventListener(){
    window.addEventListener('show.bs.modal',(event)=>{
      this.sync(event.target);
    })
  }


  sync(target){
    if(!target){return;}
    
    target.querySelectorAll('[data-wc-sync-from]')?.forEach(el=> {
      this.syncFrom(el);
    });
    target.querySelectorAll('form[data-wc-sync-form]')?.forEach(form=> {
      this.syncForm(form);
    });

    target.querySelectorAll('.ui-input-stepper input')?.forEach((input)=>{
      UiInputStepper.syncDataValue(input);
    })
  }

  /**
   * 설정 값을 가져와서 input.value에 적용
   *
   * @param {HTMLInputElement} input 
   * @param {typeof globalThis} [v=globalThis] 
   */
  syncFrom(input,v=globalThis){
    const wcSyncFrom = input.dataset.wcSyncFrom;
    const splits = wcSyncFrom.split(/\./g);
    const inputType = input.type??'text'

    // let v = globalThis;
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

  /**
   * config의 내용을 form 에 넣음.
   *
   * @param {HTMLFormElement} form 
   */
  syncForm(form){
    const wcSyncForm = form.dataset.wcSyncForm;
    const splits = wcSyncForm.split(/\./g);
    // console.log(splits);
    
    let v = globalThis;
    splits.forEach((split)=>{
      if(v===null){return;}
      v = v?.[split]??null;
    })
    // console.log('v',v);
    if(v===null){ return; }

    // if(v?.toObject){
    //   HtmlUtil.objectToForm(v.toObject(),form)
    // }if(v?.toJSON){
    //   HtmlUtil.objectToForm(v.toJSON(),form)
    // }else{
    //   HtmlUtil.objectToForm({...v},form)
    // }
    HtmlUtil.objectToForm(v,form)
    
  }
}
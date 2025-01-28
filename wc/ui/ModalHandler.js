export default class ModalHandler extends Map{
  constructor(){
    super(...arguments);
  }

  windowOnload(){
    globalThis.window.addEventListener('load',(event)=>{
      this.collectModals()
    })
  }
  collectModals(){
    globalThis.document.querySelectorAll('.modal[id]').forEach(node=>{
        const modal = new bootstrap.Modal(node);
        if(!this.has(node.id)) this.set(node.id,modal);
    })   
  }
  hideAll(){
    this.forEach((modal,k)=>{
      modal.hide();
    })
  }
}
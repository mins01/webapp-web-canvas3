class WcHelper{
  // modal-brush-config 를 복사해서 1,2,3 만든다
  static cloneModalBrushConfig(v,idx){
    const modalBrushConfig = document.querySelector('#modal-brush-config');
    const id = `modal-brush${v}-config`;
    const cloneModalBrushConfig = modalBrushConfig.cloneNode(true);
    const modalConfigTitle = cloneModalBrushConfig.querySelector('.modal-config-title');
    modalConfigTitle.textContent = `Brush${v} config`
    const canvas = cloneModalBrushConfig.querySelector('canvas');
    canvas.removeAttribute('id')
    canvas.id = `brush${v}`;
    const f = cloneModalBrushConfig.querySelector('form');
    cloneModalBrushConfig.id = id;
    f.name +=v
    f.removeAttribute('oninput')
    f.oninput = function(event){
        editor.setBrushConfig(Wc.HtmlUtil.formToObject(this),v); return false
    }
    f.dataset.wcSyncForm = `editor.brush${v}.brushConfig`;
    modalBrushConfig.after(cloneModalBrushConfig)
  }

  static copyFormBrushConfigToFormEraserConfig(){
    const f1 = window.document.formBrushConfig;
    const f2 = window.document.formEraserConfig;
    f2.innerHTML = '';
    f2.append(f1.firstElementChild.cloneNode(true));
  }

  // document의 zoom 화면에 맞추기
  static wcAppZoomFit(type='auto'){
    const document = editor.document;
    const rectBody = wcApp.body.getBoundingClientRect();
    console.log(rectBody);
    
    const rectHeader = wcApp.header.getBoundingClientRect();
    const rectFooter = wcApp.footer.getBoundingClientRect();
    const outlineWidth = parseFloat(window.getComputedStyle(document).outlineWidth);
    const mh = rectBody.height - rectHeader.height - rectFooter.height - outlineWidth * 2 - 5
    const mw = rectBody.width - outlineWidth * 2 - 5
    const w = document.width;
    const h = document.height;
    let z = null;
    if(type=='auto'){
        z = Math.min(mh/h , mw/w);
    }else if(type=='width'){
        z = mw/w
    }else if(type=='height'){
        z = mh/h
    }
    z = Math.floor(z * 100)/100;
    document.zoom = z;
    document.left = 0;
    document.top = 0;
    document.flush();
  }




  static onpaste = (event)=>{
    let target = event.target;
    if(target.value??false){ return; } // 이벤트 발생 부분이 form control 종류면 무시
    // console.log(event);
    const clipboardData = event.clipboardData
    if(clipboardData.files[0] && clipboardData.files[0].type.startsWith('image/')){ // 첨부파일이 있고 이미지 형식이면
      const file = clipboardData.files[0];
      if(!editor.document){
        editor.loadDocument(file)
      }else{
        editor.insertLayerFromFile(file)
      }
      
    }else{

    }    
  }
}
class WcHelper{
  static cloneModalBrushConfigForm(from,to){
    to.innerHTML = '';
    [...from.children].forEach((child)=>{
      to.append(child.cloneNode(true));
    })
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

  static onresize = (event)=>{
    editor?.document.flush();
    editor?.tool?.activate()
  }



  static newForTest(editor){
    const document = editor.newDocument(300,400);
    let layer = new Wc.Layer(60,80);
    layer.fill('#f00')
    layer.left = 200;
    layer.top = 30;
    layer.ctx.fillRect(10,10,10,10);
    

    document.layers.add(layer,false,true)
    
    document.flush();
    document.history.clear();
    document.history.save('new document');
  }

  static newForTest2(editor){
    const document = editor.newDocument(300,400);
    let layer = new Wc.Layer(60,80);
    layer.fill('#f00')
    layer.left = 200;
    layer.top = 30;
    layer.ctx.fillRect(10,10,10,10);  

    document.layers.add(layer,true)
    layer = new Wc.TextLayer(document.width,document.height)
    document.layers.add(layer,true)
    layer = new Wc.TextLayer(document.width,document.height)
    layer.left = 50;
    layer.top = 50;
    layer.flush();
    document.layers.add(layer,true)
    layer = layer.clone();
    document.layers.add(layer,true)
   
    
    document.flush();
    document.history.clear();
    document.history.save('new document');
  }

  static syncModalBrushPreviewCanvas(f,isEraser=false){
    const modal = f.closest('.modal');
    const preview = modal.querySelector('.brush-preview-canvas');
    const brush = modal.querySelector('canvas[is="wc-brush"],canvas[is="wc-eraser"]');    
    preview.width = preview.clientWidth;
    preview.height = preview.clientHeight;

    this.drawBrushPreviewCanvas(brush,preview,isEraser)

  }
  static drawBrushPreviewCanvas(brush,preview,isEraser=false){
    const size = brush.brushConfig.size
    const spacing = brush.brushConfig.spacing
    const usedSizeControl = brush.brushConfig.sizeControl != 'off';

    preview.ctx.save()
    preview.clear();
    
    
    
    if(isEraser){
      preview.fill('#ffffff')
      // preview.ctx.globalCompositeOperation = 'destination-out';
    }

    preview.ctx.globalCompositeOperation = brush.brushConfig.compositeOperation=='destination-out'?'destination-out':'source-over';
    // console.log(brush.brushConfig.compositeOperation);


    let points = this.getSShapePoints(preview.width/2, preview.height/2, (preview.width) - size - 10, preview.height - size - 10,Math.floor(preview.width / 5)/spacing)
                  .map((el)=>{el.x = Math.round(el.x); el.y=Math.round(el.y); return el});
    // console.log(points)
    // let pointerEvent = new PointerEvent('pointerdown',{pressure:0});
    let pressure = 0
    let lastPressure = 0
    
    let p = points[0]
    brush.ready();
    brush.drawOnDot(preview.ctx,p.x,p.y,{pressure});
    lastPressure = pressure
    let m2 = points.length/2;
    let remainInterval = 0;
    for(let i=1,m=points.length;i<m;i++){
      let p1 = points[i];
      let pressure = (i<m2?i:m-i)/m2;
      // console.log(pressure);
      // const pointerEvent = new PointerEvent('pointermove',{pressure:pressure});
      // console.log({x:p1.x,y:p1.y,pressure});
      
      remainInterval = brush.drawOnLine(preview.ctx,p.x,p.y,p1.x,p1.y,{remainInterval,pressure,lastPressure});
      
      lastPressure = pressure
      // console.log({rm});
      
      p = p1;
    }
    preview.ctx.restore()
  }

  static getSShapePoints(h, k, width, height, steps = 100) {
    const points = [];
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2 - Math.PI; // -π에서 π까지 변화
        const x = h + (width / 2) * t / Math.PI; // x 위치 조정
        const y = k + (height / 2) * Math.sin(t); // S 곡선 생성
        points.push({ x, y });
    }

    return points;
  }
  static getBrushCanvas(el){
    return el.closest('.brush-config-container').querySelector('.wc-brush')
  }


  static brushNavTab(navTab){
   const container = navTab.closest('.brush-nav-container');
   container.querySelectorAll('.nav-link').forEach((el)=>{
    el.classList.remove('active');
   })
   navTab.classList.add('active');
   container.dataset.brushTab = navTab.dataset.brushTab
   
  }



  // document.to
  static filesFromExportedData(exportedData){
      // const r = await this.export('file');
      const r = exportedData;
      console.log(r);
      // 파일 뽑기
      const files = []
      files.push(r.__content__);
      r.__content__ = r.__content__.name;
      if(r?.layers){
        r.layers.elements.forEach((layer)=>{
            files.push(layer.__content__);
            layer.__content__ = layer.__content__.name;
        })
      }
      return files;
  }





  static forceFontLoad(textConfig, text = "A") {
    
    const span = document.createElement('span');
    Wc.HtmlUtil.applyStyleObject(span,textConfig.exportToStyleObject())
    span.textContent = text;
    // span.style.font = font;
    span.style.position = 'absolute';
    span.style.opacity = '1';
    span.style.zIndex = '1000';
    span.style.pointerEvents = 'none';
    // span.style.whiteSpace = 'break-spaces';
    document.body.appendChild(span);
    // setTimeout(()=>{span.remove()},1000)
  }





}
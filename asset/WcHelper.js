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
    

    document.layers.add(layer,false,true)
    layer = document.layers.addLayer('TextLayer');
    layer = document.layers.addLayer('TextLayer');
    layer.left = 50;
    layer.top = 50;
    layer.flush();
    document?.layers.cloneLayer();
    

    document.history.clear();
    document.history.save('new document');
  }

  static syncModalBrushPreviewCanvas(f,isEraser=false){
    const modal = f.closest('.modal');
    const preview = modal.querySelector('.brush-preview-canvas');
    const brush = modal.querySelector('canvas[is="wc-brush"]');    
    preview.width = preview.clientWidth;
    preview.height = preview.clientHeight;

    this.drawBrushPreviewCanvas(brush,preview,isEraser)

  }
  static drawBrushPreviewCanvas(brush,preview,isEraser=false){
    const size = brush.brushConfig.size
    const usedSizeControl = brush.brushConfig.sizeControl != 'off';

    preview.ctx.save()
    preview.clear();
    if(isEraser){
      preview.fill('#ffffff')
      preview.ctx.globalCompositeOperation = 'destination-out';
    }


    let points = this.getSShapePoints(preview.width/2, preview.height/2, (preview.width) - size - 10, preview.height - size - 10,Math.floor(preview.width / 5))
                  .map((el)=>{el.x = Math.round(el.x); el.y=Math.round(el.y); return el});
    // console.log(points)
    let pointerEvent = new PointerEvent('pointerdown',{pressure:0});
    let remainInterval = 0;
    let p = points[0]
    brush.ready();
    brush.drawOnDot(preview.ctx,p.x,p.y,{pointerEvent});
    let m2 = points.length/2;
    for(let i=1,m=points.length;i<m;i++){
      let p1 = points[i];
      let pressure = (i<m2?i:m-i)/m2;
      // console.log(pressure);
      
      const pointerEvent = new PointerEvent('pointerdown',{pressure:pressure});
      remainInterval = brush.drawOnLine(preview.ctx,p.x,p.y,p1.x,p1.y,{remainInterval,pointerEvent});
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
}
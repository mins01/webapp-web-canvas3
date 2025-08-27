// import Layer from "./Layer.js";
import PathShape from "../draw/PathShape.js";
import jsColor from "../lib/jsColor.js";
import Canvas from "./Canvas.js";

import BrushConfig from "../lib/BrushConfig.js";
import Context2dUtil from "../lib/Context2dUtil.js";

export default class Brush extends Canvas{
  margin = 4;
  // remainInterval = 0 // @deprecated 2025-05-18
  // lastPressure = 0.5; // @deprecated 2025-05-17
  // lastAzimuthAngle = 0; // @deprecated 2025-05-17
  counter = 0;
  // imageBitmap = null;
  shapeCanvas = null;
  brushConfig = null;
  constructor(w=null,h=null){
    super(w,h);
    this.init();    
  }
  static defineCustomElements(name='wc-brush'){
    super.defineCustomElements(name);
  }
  
  init(){
    this.parent = null;
    this.brushConfig = new BrushConfig();
    this.shapeCanvas = new Canvas();
    this.draw();
  }



  
  ready(){
    // this.lastPressure = 0.5;
    // this.lastAzimuthAngle = 0;
    // this.remainInterval = 0;
    this.counter = 0;
  }
  

  // 로컬 스토리지에 설정 저장
  saveBrushConfig(){
    if(!this.dataset.brushKey){
      console.warn('Attribute [data-brush-key] does not exist');
      return false;
    }
    localStorage.setItem(`wc-brush[${this.dataset.brushKey}]-brushconfig`,JSON.stringify(this.brushConfig));
  }
  // 로컬 스토리지에 설정 읽어오기
  loadBrushConfig(){
    this.setBrushConfig(JSON.parse(localStorage.getItem(`wc-brush[${this.dataset.brushKey}]-brushconfig`)??'{}'));
  }
  setBrushConfig(conf){
    this.brushConfig.assignFrom(conf)
  }
  resetBrushConfig(){
    this.brushConfig.reset()
  }
  
  createRadialGradient(ctx,x0, y0, r0, x1, y1, r1){
    // const ctx = this.ctx;
    const brushConfig = this.brushConfig;
    const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    const c = jsColor.Color.from(ctx.fillStyle);
    c.a = 0;
    gradient.addColorStop(0, ctx.fillStyle);
    if(brushConfig.hardness < 1){
      gradient.addColorStop(brushConfig.hardness, ctx.fillStyle);
      gradient.addColorStop(1, c.toRgba());
    }else{
      gradient.addColorStop(1, ctx.fillStyle);
    }
    return gradient;
  }
  
  applyShapeCanvas(){
    const brushConfig = this.brushConfig;
    const shapeCanvas = this.shapeCanvas;
    const ctx = shapeCanvas.ctx;
    const size = Math.max(1,parseFloat(brushConfig.size));       
    const shape = brushConfig.shape;
    
    // this.margin = Math.ceil((Math.hypot(size,size) - size) / 2); // 밖에서 계산한다.
    
    let tsize = size + this.margin * 2
    if(tsize%2){ tsize++;}
    shapeCanvas.width = tsize;
    shapeCanvas.height = tsize;
    const r = size/2;
    const x = shapeCanvas.width/2;
    const y = x;
    
    this.contextConfig.assignTo(ctx,true);
    // console.log(ctx.fillStyle);
    
    ctx.save();
    ctx.globalAlpha = parseFloat(brushConfig.flow)
    
    // ctx.imageSmoothingEnabled = false;
    
    
    if(shape=='square' || size==1){
      const diagonal  = Math.hypot(size,size);
      const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, Math.ceil(diagonal/2));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      PathShape.rect(ctx,this.margin,this.margin,size,size);
      ctx.fill()
    }else if(shape=='circle'){
      const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, r);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      PathShape.circle(ctx,x,y,r);
      ctx.fill()
    }else{
      if((shape[0]??'')=='#'){ // 이미지 DOM 관련
        const brushShapeImage = globalThis.document.querySelector(shape);
        if(!brushShapeImage || !this.isDrawableElement(brushShapeImage)){
          console.error(`BrushShapeImage(${shape}) not found.`);
          return false;
        }
        ctx.drawImage(brushShapeImage, this.margin,this.margin,size,size);
        
        ctx.globalCompositeOperation = "source-in";
        const diagonal  = Math.hypot(size,size);
        const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, Math.ceil(diagonal/2));
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        PathShape.rect(ctx,this.margin,this.margin,size,size);
        ctx.fill()
        
      }else{ //failback
        const gradient = this.createRadialGradient(ctx,x, y, 0, x, y, r);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        PathShape.circle(ctx,x,y,r);
        ctx.fill()
        console.error(`This shape(${shape}) is not supported.`);
      }
      
    }
    
    
    // ctx.stroke()
    ctx.restore();
    // createImageBitmap(this).then((v)=>{this.imageBitmap = v});
  }
  
  draw(){
    const brushConfig = this.brushConfig;
    const shape = this.shapeCanvas;
    const ctx = this.ctx;
    const size = Math.max(1,parseFloat(brushConfig.size));
    
    
    // this.margin = Math.ceil((Math.hypot(size,size) - size) / 2); // 대각선만큼의 길이 기준으로 해야 angle 적용시 안 짤린다.
    this.margin = Math.ceil(size * 0.25); // 대각선만큼의 길이 기준으로 해야 angle 적용시 안 짤린다. , (1.5 * size - size) / 2; 대각선의 비율이 1.41 이라서.

    let tsize = Math.round(size + this.margin * 2);
    if(tsize%2 !==0){tsize++;} // 짝수로 맞춤. 안 그러면 anti-aliasing 적용되서 흐려짐.
    this.width = tsize;
    this.height = tsize;
    this.contextConfig.disableStroke = true;
    this.contextConfig.assignTo(ctx,true);
    
    
    this.applyShapeCanvas(); // 브러시 모양 재적용
    
    
    // const dw = this.width;
    const dw = this.width * brushConfig.scaleX;
    const dh = this.height * brushConfig.scaleY;
    const dx = (this.width-dw)/2;
    const dy = (this.height-dh)/2;
    const tx = this.width/2;
    const ty = this.height/2;
    
    ctx.save();
    // ctx.filter = 'hue-rotate(180deg)';
    // ctx.imageSmoothingEnabled = false;
    

    ctx.globalAlpha = parseFloat(brushConfig.flow)        
    if(brushConfig.angle){
      ctx.translate(tx, ty); // 회전할 중심(기준점) 설정 (캔버스 중앙으로 이동)
      ctx.rotate(brushConfig.angle * Math.PI / 180); // 45도 회전 (Math.PI / 4 라디안)
      ctx.translate(-tx, -ty); // 중심을 원래 위치로 되돌림
    }
    // ctx.imageSmoothingEnabled = false;
    ctx.drawImage(shape,0,0,shape.width,shape.height,dx,dy,dw,dh);
    // console.log(shape,0,0,shape.width,shape.height,dx,dy,dw,dh);
    ctx.restore();
    
    if(brushConfig.flattenOpacity){
      const c = jsColor.Color.from(ctx.fillStyle);
      const o = Math.round(brushConfig.flow*255);
      Context2dUtil.flattenOpacity(ctx,c.r,c.g,c.b,o,o/10)
    }
    this.dispatchEvent( new CustomEvent("draw", {bubbles:true,cancelable:true}) );
  }
  

  /**
   * Description placeholder
   *
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   * @param {{}} [opts={}] 
   */
  dot(ctx,x,y,opts={}){
    let {
      pointerType = '', // 포인터타입, mouse, touch, pen. '' 이면 설정 안됨을 뜻함
      pressure = 0.5, // 압력
      azimuthAngle = 0, // 수평면 기준 포인터의 각도. 도(°) 단위
      // lastPressure = this.lastPressure??0.5, // 압력
      // lastAzimuthAngle = this.lastAzimuthAngle??0, // 수평면 기준 포인터의 각도. 도(°) 단위

      brushConfig= this.brushConfig,
      image = this,
      // image = this.imageBitmap,
      lineAngle = 0, //그리는 방향
    } = opts;
    // console.log('dot',pressure);
    
    
    let gx = image.width/2;
    let gy = image.height/2;
    
    
    // opacity 적용
    if(ctx.canvas.alpha != brushConfig.opacity){
      ctx.canvas.alpha = brushConfig.opacity;
      if(ctx.canvas.style) ctx.canvas.style.opacity = brushConfig.opacity;
    }
    // console.log(ctx.canvas.style.opacity);
    

    ctx.save();
    // 중앙으로 이동
    // ctx.translate(x + gx, y + gy);
    ctx.translate(x, y);

    
    


    //-- 각도 제어
    const angleControl = brushConfig.angleControl
    {
      if(angleControl==='off'){ // 아무 설정이 없을 경우
        
      }else if(angleControl==='direction'){
        //-- 그리는 선의 방향
        ctx.rotate(lineAngle * Math.PI / 180); 
      }else if(angleControl==='penTilt' && (pointerType=='pen' || pointerType=='')){
        const v = azimuthAngle; //deg
        ctx.rotate(v)
      }
    }

    
    // pointerType :  "mouse"
    // altitudeAngle :  1.5707963267948966
    // azimuthAngle :  0
    // pressure :  0.5
    let size = Math.max(1,parseFloat(brushConfig.size)); // 브러시 사이즈
    //-- size 제어
    const sizeControl = brushConfig.sizeControl
    {
      let v = 1;
      if(sizeControl==='penPressure' && (pointerType=='pen' || pointerType=='')){
        const p = Math.max(pressure , brushConfig.mininumSizeRatio) ;
        v *= p;
      }
      if(brushConfig.sizeJitter > 0){
        const p = Math.random() * brushConfig.sizeJitter;
        v *= (1-p);
      }   
      if(v != 1){
        ctx.scale(v,v)
        // size = size*v;// 사용하는 곳이 없네.
      }
    }
    //-- 높이 제어
    const scaleYControl = brushConfig.scaleYControl
    {
      if(scaleYControl==='off'){ // 아무 설정이 없을 경우
        
      }else if(scaleYControl==='penTilt' && (pointerType=='pen' || pointerType=='')){
        if(brushConfig.mninumScaleY < 1){
          const v = Math.max(azimuthAngle/(Math.PI/2),brushConfig.mninumScaleY); ctx.scale(1,v)
        }
      }
    }
    
    //-- flow 제어
    const flowControl = brushConfig.flowControl
    {
      let v = brushConfig.flow;
      if(flowControl==='penPressure' && (pointerType=='pen' || pointerType=='')){
        const p = Math.max(pressure , brushConfig.mininumFlow) ;
        v *= p;
      }
      if(v != 1){
        // filters.push(`opacity(${v*100}%)`); 
        ctx.globalAlpha = v;
      }
    }
    
    
    
        

    //-- 스케터링
    const scatterAmount  = brushConfig.scatterAmount;
    const scatterAxes = brushConfig.scatterAxes;
    const scatterCount = brushConfig.scatterCount;
    const scatterCountJitter = brushConfig.scatterCountJitter;
    

    const dotCount = Math.max(1,Math.floor(scatterCount - Math.random()*scatterCount*scatterCountJitter));
    for(let i=0;i<dotCount;i++){
      ctx.save()
      if(scatterAmount>0){ // 스케터링
        // if(angleControl!=='direction') ctx.rotate(lineAngle * Math.PI / 180); 
        const initLineAngleRad = angleControl!=='direction'?lineAngle * Math.PI / 180:0; // 이동방향 각도
        // const initLineAngle = 0;
        const tv = ((Math.random()*scatterAmount)-(scatterAmount/2))*size; // 이동거리
        
        // let tAngle = 0;
        // if(scatterAxes == 'x'){ tAngle = 0; }
        // else if(scatterAxes == 'y'){ tAngle = Math.PI / 2 }
        // else if(scatterAxes == 'xy'){
        //   tAngle = Math.random() * 2 * Math.PI; //랜덤 라디안
        // }
        // ctx.rotate(tAngle); 
        // ctx.translate(tv, 0); 
        // ctx.rotate(-tAngle);

        //-- 챗GPT 추천. 이쪽이 빠르다네.
        let angle = 0;
        if (scatterAxes === 'x') angle = 0;
        else if (scatterAxes === 'y') angle = Math.PI / 2;
        else if (scatterAxes === 'xy') angle = Math.random() * 2 * Math.PI;

        let dx = Math.cos(initLineAngleRad + angle) * tv;
        let dy = Math.sin(initLineAngleRad + angle) * tv;

        ctx.translate(dx, dy);

        // if(angleControl!=='direction') ctx.rotate(-lineAngle * Math.PI / 180); 
      }
      this.applyJitter(ctx,brushConfig); // 지터적용
      ctx.drawImage(image, -gx,-gy,image.width,image.height );      
      ctx.restore()
    }
    
    ctx.restore();
    this.counter++
    
  }
  applyJitter(ctx,brushConfig){
    //----------- 지터 적용
    // 지터 - 크기
    if(brushConfig.sizeJitter > 0){
      const p = Math.random() * brushConfig.sizeJitter;
      const v = (1-p);
      if(v != 1){
        ctx.scale(v,v)
        // size = size*v;// 사용하는 곳이 없네.
      }
    }
    // 지터 - flow
    if(brushConfig.flowJitter > 0){
      const p = Math.random() * brushConfig.flowJitter;
      ctx.globalAlpha *= (1-p);
    }
    // 지터 - 각도
    if(brushConfig.angleJitter > 0){ 
      const v = (Math.random() * 2 - 1)*brushConfig.angleJitter; 
      ctx.rotate(Math.PI * v); 
    }
    // 지터 - 필터적용
    const filters = [];
    if(brushConfig.hueJitter>0){ 
      const p = (Math.random() * 2 - 1)*brushConfig.hueJitter; 
      const v = 180 * p; 
      filters.push(`hue-rotate(${v}deg)`); }
    if(brushConfig.saturationJitter>0){ 
      const p = Math.random() * brushConfig.saturationJitter ;
      const v = (1 - p * 2)*100;
      filters.push(`saturate(${v}%)`);  // 0% ~ 200%
    }
    if(brushConfig.brightnessJitter>0){ 
      const p = Math.random() * brushConfig.brightnessJitter;
      const v = (1 + p)*100;
      filters.push(`brightness(${v}%)`); // 100%~ 200%
    }
    if(filters.length > 0){ ctx.filter = filters.join(' '); }
  }
  


  calInterval(opts){
    let {
      brushConfig= this.brushConfig  ,
      pressure = 0.5, // 압력      
      lastPressure = this.lastPressure??0.5, // 압력
    } = opts;
    let size = Math.max(1,parseFloat(brushConfig.size));
    const sizeControl = brushConfig.sizeControl
    // const flowControl = brushConfig.flowControl
    if(sizeControl==='off'){ // 아무 설정이 없을 경우
    }else if(sizeControl==='penPressure'){
      const v = Math.max((lastPressure+pressure) / 2, brushConfig.mininumSizeRatio); 
      size *= v;
    }
    size = Math.max(1,size);

    const interval = Math.max(0.5,size * Math.max(0.001,parseFloat(brushConfig.spacing)));
    return interval;
  }
  remainDistance(opts = {}){
    let {
      brushConfig= this.brushConfig  ,
      remainInterval = 0, 
      // interval = this.calInterval(brushConfig),
      distance = 0,
    } = opts;
    let remainDistance = distance + remainInterval
    return remainDistance
  }

  /**
   * Description placeholder
   *
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x0 
   * @param {number} y0 
   * @param {number} x1 
   * @param {number} y1 
   * @param {{}} [opts={}] 
   * @returns {*} 
   */
  drawOnLine(ctx,x0, y0, x1, y1 , opts = {}) {
    let {
      brushConfig= this.brushConfig  ,
      remainInterval = 0, 
      pointerType = '', // 포인터타입, mouse, touch, pen (code라는 값은 본래 없다.)
      pressure = 0.5, // 압력
      azimuthAngle = 0, // 수평면 기준 포인터의 각도. 도(°) 단위
      // lastPressure = this.lastPressure??0.5, // 압력
      // lastAzimuthAngle = this.lastAzimuthAngle??0, // 수평면 기준 포인터의 각도. 도(°) 단위 // 사용 안할 듯
      lastPressure = 0.5, // 압력
      lastAzimuthAngle = 0, // 수평면 기준 포인터의 각도. 도(°) 단위 // 사용 안할 듯
      lineAngle =  this.getAngle(x0,y0,x1,y1),
      interval = this.calInterval(brushConfig),
      distance = Math.hypot(x1 - x0, y1 - y0),
      remainDistance = this.remainDistance({remainInterval,brushConfig,interval,distance}),
      image = this,
    } = opts;

    const sizeControl = brushConfig.sizeControl
    const flowControl = brushConfig.flowControl
    let dx = x1 - x0;
    let dy = y1 - y0;
    
    if( remainDistance < interval){      
      return remainDistance;
    }else{
      let steps = Math.floor(remainDistance / interval);      
      
      if(sizeControl==='penPressure' || flowControl==='penPressure'){ // 부드러운 압력감지의 변화 처리       
        let fromPressure = lastPressure;
        let toPressure = pressure;
        
        let intervalPressure = (toPressure != fromPressure)?(toPressure - fromPressure)/(steps):0;
        for (let i = 0; i < steps; i++) {
          let t = i / steps;
          let x = x0 + t * dx;
          let y = y0 + t * dy;
          let pressure = fromPressure + intervalPressure * i
          
          this.dot(ctx,x,y,{brushConfig,image,lineAngle,pressure,azimuthAngle,pointerType});
        }
      }else{
        for (let i = 0; i < steps; i++) {
          let t = i / steps;
          let x = x0 + t * dx;
          let y = y0 + t * dy;
          this.dot(ctx,x,y,{brushConfig,image,lineAngle,pressure,azimuthAngle,pointerType});
        }

      }
      
      remainInterval = remainDistance % interval;
      return remainInterval;
      
    }
    
  }
  drawOnDot(ctx,x, y ,opts = {}){
    let {
      pointerType = '', // 포인터타입, mouse, touch, pen (code라는 값은 본래 없다.)
      pressure = 0.5, // 압력
      azimuthAngle = 0, // 수평면 기준 포인터의 각도. 도(°) 단위
      lineAngle =  0,

      brushConfig= this.brushConfig,
      image = this
    } = opts;
    // console.log('drawOnDot',pressure);

    this.dot(ctx,x,y,{brushConfig,image,pointerType,pressure,azimuthAngle,lineAngle});
    // this.lastPressure = pressure;
    // this.lastAzimuthAngle = azimuthAngle;
  }
  
  
  
  
  
  
  
  isDrawableElement(el) {
    return (
      el instanceof HTMLImageElement ||
      el instanceof HTMLVideoElement ||
      el instanceof HTMLCanvasElement ||
      el instanceof ImageBitmap ||
      el instanceof ImageData ||              // raw pixel data
      el instanceof SVGImageElement ||          // <image> in inline SVG (limited support)
      (typeof OffscreenCanvas !== 'undefined' && el instanceof OffscreenCanvas)
    );
  }


  getAngle(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    let radians = Math.atan2(dy, dx); // -PI ~ PI
    let degrees = radians * (180 / Math.PI); // 라디안 -> 도
    if (degrees < 0) {
      degrees += 360; // 0~360도로 변환
    }
    return degrees;
  }
}
// import Layer from "./Layer.js";
// import PathShape from "../draw/PathShape.js";
// import jsColor from "../lib/jsColor.js";
// import Canvas from "./Canvas.js";

// import BrushConfig from "../lib/BrushConfig.js";
// import Context2dUtil from "../lib/Context2dUtil.js";
import EraserConfig from "../lib/EraserConfig.js";
import Brush from "./Brush.js";
import Canvas from "./Canvas.js";

export default class Eraser extends Brush{
  
  static defineCustomElements(name='wc-eraser'){    
    super.defineCustomElements(name);
  }
  constructor(w=null,h=null){
    super(w,h);
  }
  
  init(){
    this.parent = null;
    this.brushConfig = new EraserConfig();
    this.shapeCanvas = new Canvas();
    this.draw();
  }
}
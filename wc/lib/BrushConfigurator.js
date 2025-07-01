class BrushConfigurator{
  static reset(brush){
    brush.brushConfig.reset();
    brush.saveBrushConfig();
    brush.flush();
  }


  // 단순 펜 - 기본
  static pen(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":5,"angle":0,"roundness":1,"scaleX":1,"scaleY":1,"flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":0.1,"hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }
  // 단순 펜 - 기본
  static softPen(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":5,"angle":0,"roundness":1,"scaleX":1,"scaleY":1,"flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":0.4,"flowJitter":0,"flowControl":"off","mininumFlow":0.1,"hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }

  // 단순 붓
  static brush(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":40,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"penPressure","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }
    // 단순 붓
  static softBrush(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":40,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"penPressure","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":0.4,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }

    // 단순 지우개
  static eraser(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"destination-out","shape":"circle","size":10,"angle":0,"roundness":1,"scaleX":1,"scaleY":1,"flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":0.1,"hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }
  // 단순 지우개
  static softEraser(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"destination-out","shape":"circle","size":10,"angle":0,"roundness":1,"scaleX":1,"scaleY":1,"flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":0.4,"flowJitter":0,"flowControl":"off","mininumFlow":0.1,"hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }

  
  





  
  //---- art brush
  // 형광팬
  static highlighter(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"multiply","shape":"square","size":20,"angle":0,"roundness":1,"scaleX":0.5,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":0.5,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }

  // 볼펜
  static ballpen(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":10,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.3,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0.5,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }

  // 연필
  static pencil(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":10,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"penPressure","mininumSizeRatio":0.8,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0.8,"flowControl":"penPressure","mininumFlow":"0.01","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }




  // dipPen 잉크팬
  static dipPen(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":20,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"penPressure","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0,"scatterAxes":"y","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }



  // 수묵화용 붓, 동양 붓
  static inkBrush(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"#brush-shape-brush-01","size":40,"angle":0,"roundness":1,"scaleX":1,"scaleY":"1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0.14,"sizeControl":"penPressure","mininumSizeRatio":0.1,"angleJitter":1,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":1,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":0.2,"scatterAxes":"xy","scatterCount":1,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0}
    )
    brush.saveBrushConfig();
    brush.flush();
  }
  
      // 에어 브러시 처럼
  static airbrush(brush){
    brush.brushConfig.reset();
    brush.setBrushConfig(
      {"compositeOperation":"source-over","shape":"circle","size":20,"angle":0,"roundness":1,"scaleX":0.1,"scaleY":"0.1","flipX":false,"flipY":false,"hardness":1,"spacing":0.1,"sizeJitter":0,"sizeControl":"off","mininumSizeRatio":0.01,"angleJitter":0,"angleControl":"off","roundnessJitter":0,"roundnessControl":"off","mininumRoundness":0.1,"scaleYControl":"off","mininumScaleY":0.1,"opacity":1,"opacityJitter":0,"opacityControl":"off","mininumOpacity":0.1,"flow":0.8,"flowJitter":0,"flowControl":"off","mininumFlow":"0.1","hueJitter":0,"saturationJitter":0,"brightnessJitter":0,"scatterAmount":1,"scatterAxes":"xy","scatterCount":3,"scatterCountJitter":0,"flattenOpacity":true,"buildUpInterval":0.01}
    )
    brush.saveBrushConfig();
    brush.flush();
  }


}
export default BrushConfigurator;
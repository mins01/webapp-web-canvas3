// import BaseConfig from "./BaseConfig.js"
import BrushConfig from "./BrushConfig.js";

class EraserConfig extends BrushConfig{
    // 브러시 모양: Brush Tip Shape
    compositeOperation = 'destination-out'; // source-over,  source-in,  source-out,  source-atop,  destination-over,  destination-in,  destination-out,  destination-atop,  lighter,  copy,  xor,  multiply,  screen,  overlay,  darken,  lighten,  color-dodge,  color-burn,  hard-light,  soft-light,  difference,  exclusion,  hue,  saturation,  color,  luminosity
    reset(){
        super.reset();
        this.compositeOperation = 'destination-out';
    }
}



export default EraserConfig;
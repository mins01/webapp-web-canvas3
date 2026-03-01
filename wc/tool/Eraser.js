// import BaseTool from './BaseTool.js';
import Brush from './Brush.js';

export default class Eraser extends Brush{
    // remainInterval = 0;
    overrideCompositeOperation = 'destination-out';
    constructor(editor){
        super(editor);
        // this.x0 = null;
        // this.y0 = null;
        this.name = 'Eraser';
        // this.brush = this.editor.eraser;
        this.brush = this.editor.brush;
        if(this.brush) this.brush.brushConfig.compositeOperation = this.overrideCompositeOperation;
        
    }

}
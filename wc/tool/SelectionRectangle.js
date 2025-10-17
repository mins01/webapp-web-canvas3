import ShapePath2D from '../draw/ShapePath2D.js';
import Layer from '../element/Layer.js';
import LayerKind from '../lib/LayerKind.js';
import BaseTool from './BaseTool.js';
import Rectangle from './Rectangle.js';

export default class SelectionRectangle extends Rectangle{
    
    constructor(editor){
        super(editor);
        this.name = 'SelectionRectangle';
    }

    get layer(){ return this?.editor?.document?.selectionLayer??null; }  

}
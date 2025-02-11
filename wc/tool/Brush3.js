import Brush from './Brush.js';

export default class Brush2 extends Brush{
    constructor(editor){
        super(editor);
        this.name = 'Brush3';
        this.brush = this.editor.brush3;
    }
}
import Brush from './Brush.js';

export default class Brush1 extends Brush{
    constructor(editor){
        super(editor);
        this.name = 'Brush1';
        this.brush = this.editor.brush1;
    }
}
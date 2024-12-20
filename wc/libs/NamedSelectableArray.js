import SelectableArray from './SelectableArray.js';

export default class NamedSelectableArray extends SelectableArray{
    constructor(...args){
        super(...(args.slice(1)??[]));
        const name = args[0];
        Object.defineProperty(this,name,{
            get(){
                return this.selected;
            },
            set(v){
                this.selected = v;
            }
        });
    }
}
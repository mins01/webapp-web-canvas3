import SelectableArray from "../../lib/SelectableArray.js";
import Layer from "../Layer.js";

const Wc = { Layer };

export default class Layers extends SelectableArray{
    document = null;
    constructor(...elements) {
        super(...elements);
    }
    import(conf){
        console.log(conf);
        this.length = 0;
        conf.elements.forEach(layerConf => {
            const layer = Wc.Layer.from(layerConf);
            this.document.add(layer);
        });
    }
    export(){
        return this.toJSON();
    }
}
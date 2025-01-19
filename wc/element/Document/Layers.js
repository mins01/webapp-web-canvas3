import SelectableArray from "../../lib/SelectableArray.js";
import Canvas from "../Canvas.js";
import Layer from "../Layer.js";
import EllipseLayer from "../EllipseLayer.js";
import RectangleLayer from "../RectangleLayer.js";
import TextLayer from "../TextLayer.js";

const Wc = { Canvas,Layer,EllipseLayer,RectangleLayer,TextLayer };

export default class Layers extends SelectableArray{
    document = null;
    constructor(...elements) {
        super(...elements);
    }
    select(index){
        return super.select(index)
    }
    add(layer){
        const document = this.document
        layer.parent = document;
        const r = super.add(layer);
        document.syncDrawLayer(layer);
        layer.flush();
        // document.flush();
        document?.editor?.onselectLayer(document.layer);
        // document.history.save();
        return true;
    }
    remove(){
        const document = this.document
        super.remove();
        document.syncDrawLayer(document.layer);
        document.flush();
        // document.history.save();
        return true;
    }
    move(index){
        const document = this.document
        super.move(index);
        document.flush();
        document?.editor?.onselectLayer(document.layer);
        document.history.save();
        return true;
    }



    import(conf){
        this.clear();
        // console.log(this,conf);
        // this.length = 0;
        conf.elements.forEach(layerConf => {
            if(layerConf?.__class__===undefined){ throw new Error(`Module name is not exists. - ${layerConf.__class__}`); }
            let module = Wc?.[layerConf.__class__]
            if(!module){ throw new Error(`Module is not exists. - ${layerConf.__class__}`); }
            const layer = module.importFrom(layerConf);
            this.document.add(layer);
        });
        if(conf?.selectedIndex !== undefined) this.select(conf.selectedIndex)
    }
    export(){
        return this.toJSON();
    }
    snapshot(){
        const elements = [];
        this.forEach(element=>{
            elements.push(element.snapshot());
        })
        return {
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }
}
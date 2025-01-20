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
    ready(){ // 변경 작업호 호출하면 문서도 래디 한다.
        console.log('Layers.readyLayer()')
        this.document.readyLayer();
    }
    select(index,withoutHistory=false){
        if(this.selectedIndex != index){
            const r = super.select(index);
            if(!withoutHistory){
                this.ready();
                this.document.history.save('Layers.select',true);
            }
            
        }
    }
    addLayer(){
        const document = this.document
        const layer = new Layer(document.width,document.height)
        this.add(layer);
    }
    add(layer,withoutHistory=false){
        const document = this.document
        layer.parent = document;
        const r = super.add(layer);
        document.syncDrawLayer(layer);
        layer.flush();
        document?.editor?.onselectLayer(document.layer);
        if(!withoutHistory){
            this.ready();
            this.document.history.save('Layers.select',true);
        }
        return true;
    }
    remove(){
        if(this.length===1){ throw new Error("Must be at least one layer."); }
        const document = this.document
        super.remove();
        document.flush();
        this.ready();
        this.document.history.save('Layers.remove');
        return true;
    }
    move(index){
        const document = this.document
        super.move(index);
        document.flush();
        document?.editor?.onselectLayer(document.layer);
        this.ready();
        this.document.history.save('Layers.move');
        return true;
    }
    moveUp(){
        return this.move(this.selectedIndex+1)
    }
    moveDown(){
        return this.move(this.selectedIndex-1)
    }



    import(conf){
        
        if(conf.elements === null){ //레이어의 변화가 없는 경우

        }else{
            this.clear();
            conf.elements.forEach(layerConf => {
                if(layerConf?.__class__===undefined){ throw new Error(`Module name is not exists. - ${layerConf.__class__}`); }
                let module = Wc?.[layerConf.__class__]
                if(!module){ throw new Error(`Module is not exists. - ${layerConf.__class__}`); }
                const layer = module.importFrom(layerConf);
                // this.document.add(layer);
                this.add(layer,true);
            });
        }
        if(conf?.selectedIndex !== undefined) this.select(conf.selectedIndex,true)
        this.ready();
    }
    export(){
        return this.toJSON();
    }
    snapshot(withoutElements=false){
        let elements = null;
        if(!withoutElements){
            elements = []
            this.forEach(element=>{
                elements.push(element.snapshot());
            })
        }
        return {
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }
}
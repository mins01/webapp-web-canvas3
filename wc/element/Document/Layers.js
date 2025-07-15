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
    ready(){
        console.log('Layers.ready()')
    }
    select(index,withoutHistory=false){
        if(this.selectedIndex != index){
            this?.document?.editor?.tool?.inactivate()
            const r = super.select(index);
            if(!withoutHistory){
                this.ready();
                this.document.history.save('Layers.select',true);
            }
            this?.document?.editor?.tool?.activate()
            this?.document?.editor?.dispatchEvent('wc.document.layers.select', {layers:this,layer:this.selected} );
        }
    }
    addLayer(layerClass=null,withoutHistory=false){
        const document = this.document
        const editor = document.editor;
        if(!layerClass) layerClass = 'Layer';
        if(!Wc?.[layerClass]??null){
            throw new Error(`${layerClass}이 없습니다.`);
        }
        const layer = new Wc[layerClass](document.width,document.height)

        if(!layer){
            throw new Error("지정된 레이어 클래스가 없습니다.");
        }
        this?.document?.editor?.tool?.inactivate()
        this.add(layer,withoutHistory);
        this?.document?.editor?.tool?.activate()

        return layer;
    }
    cloneLayer(layer=null,withoutHistory=false){
        const document = this.document
        if(!layer) layer = document.layer;
        const newLayer = layer.clone();
        this?.document?.editor?.tool?.inactivate()
        this.add(newLayer,withoutHistory);
        this?.document?.editor?.tool?.activate()
    }
    add(layer,withoutHistory=false){
        const document = this.document
        layer.parent = document;
        // if(!noPostionCenterCenter){ layer.postionCenterCenter(); }
        const r = super.add(layer);
        // document.syncDrawingLayer(layer);
        // layer.flush();
        document?.editor?.onselectLayer(document.layer);

        this.ready();
        if(!withoutHistory){
            this.document.history.save('Layers.add');
        }
        return true;
    }
    remove(){
        if(this.length===1){ throw new Error("Must be at least one layer."); }
        this?.document?.editor?.tool?.inactivate()
        const document = this.document
        super.remove();
        document.flush();
        this?.document?.editor?.tool?.activate()
        this.ready();
        this.document.history.save('Layers.remove');
        return true;
    }
    move(index){
        const document = this.document
        const r = super.move(index);
        if(r===-1){return false}
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

    mergeDown(){
        console.log(this.selectedIndex);
        if(this.selectedIndex===0){
            alert('No layers available to merge.');
            return false;
        }
        this?.document?.editor?.tool?.inactivate()

        const selectedIndex = this.selectedIndex
        const fromLayer = this[this.selectedIndex];
        const toLayer = this[this.selectedIndex-1];
        console.log(fromLayer,toLayer);
        
        toLayer.drawLayer(fromLayer);
        toLayer.flush();
        //-- 삭제처리
        const document = this.document
        super.remove();
        // document.flush();
        this?.document?.editor?.tool?.activate()

        this.ready();
        
        this.document.history.save('Layers.mergeDown');
        return true;

        
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
                console.log(layerConf);
                
                // this.document.add(layer);
                this.add(layer,true);
            });
        }
        if(conf?.selectedIndex !== undefined) this.select(conf.selectedIndex,true)
        this.ready();
    }
    // export(){
    //     return this.toJSON();
    // }
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

    async export(contentType='dataurl'){
        let elements = null;
        // if(!withoutElements){
            elements = []
            this.forEach(async element=>{
                elements.push(await element.export(contentType));
            })
        // }
        return {
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }    
}
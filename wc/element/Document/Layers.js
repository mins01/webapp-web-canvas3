import SelectableArray from "../../lib/SelectableArray.js";
import Canvas from "../Canvas.js";
import Layer from "../Layer.js";
import EllipseLayer from "../EllipseLayer.js";
import RectangleLayer from "../RectangleLayer.js";
import TextLayer from "../TextLayer.js";
import LayerKind from "../../lib/LayerKind.js";


const Wc = { Canvas,Layer,EllipseLayer,RectangleLayer,TextLayer };

export default class Layers extends SelectableArray{
    document = null;
    constructor(...elements) {
        super(...elements);
    }
    ready(){
        console.log('Layers.ready()')
        this.document?.editor?.ready()
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
        // layer.flush();
        return layer;
    }
    cloneLayer(layer=null,withoutHistory=false){
        const document = this.document
        if(!layer) layer = document.layer;
        const newLayer = layer.clone(true);
        this?.document?.editor?.tool?.inactivate()
        this.add(newLayer,withoutHistory);
        // newLayer.flush();
    }
    add(layer,withoutHistory=false){
        const document = this.document
        layer.parent = document;
        // if(!noPostionCenterCenter){ layer.postionCenterCenter(); }
        const r = super.add(layer);
        // document.syncDrawingLayer(layer);
        document?.editor?.onselectLayer(document.layer);
        // layer.flush();
        this?.document?.editor?.tool?.activate()
        // document.flush();
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
        // document.flush();
        this?.document?.editor?.tool?.activate()
        this.ready();
        this.document.history.save('Layers.remove');
        return true;
    }
    move(index){
        const document = this.document
        const r = super.move(index);
        if(r===-1){return false}
        // document.flush();
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
            alert('No layers available to merge down.');
            return false;
        }
        this?.document?.editor?.tool?.inactivate()

        const selectedIndex = this.selectedIndex
        const fromLayer = this[this.selectedIndex];
        const toLayer = this[this.selectedIndex-1];
        console.log(fromLayer,toLayer);
        if(toLayer.kind !== LayerKind.NORMAL){
            alert('Merge Down is only available on NORMAL layer.');
            return false;
        }
        
        
        toLayer.drawLayer(fromLayer);
        // toLayer.flush();
        //-- 삭제처리
        const document = this.document
        super.remove();
        // document.flush();
        this?.document?.editor?.tool?.activate()

        this.ready();
        
        this.document.history.save('Layers.mergeDown');
        return true;

        
    }

    convertToLayer(layer=null){
        const document = this.document
        if(!layer) layer = document.layer;
        const index = this.indexOf(layer);
        if(index<0){ throw new Error("Not exists layer"); }
        const newLayer = Layer.clone(layer,layer.name);
        newLayer.parent = document;
        this[index] = newLayer;
        
        newLayer.flush();
        this?.document?.editor?.tool?.activate();
        this.ready();
        this.document.history.save('Layers.convertToLayer');
    }





    import(conf){
        
        if(conf.elements === null){ //레이어의 변화가 없는 경우

        }else{
            this.clear();
            conf.elements.forEach(layerConf => {
                if(layerConf instanceof Canvas){ // 객체. 
                    const layer = layerConf
                    this.add(layer,true);
                }else{ // snapshot 기준으로 동작할 때. @deprecated
                    if(layerConf?.__class__===undefined){ throw new Error(`Module name is not exists. - ${layerConf.__class__}`); }
                    let module = Wc?.[layerConf.__class__]
                    if(!module){ throw new Error(`Module is not exists. - ${layerConf.__class__}`); }
                    const layer = module.importFrom(layerConf);
                    console.log(layerConf);
                    
                    // this.document.add(layer);
                    this.add(layer,true);
                }

                
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

    clone(withoutElements=false){
        console.log('layers.clone');
        
        let elements = null;
        if(!withoutElements){
            elements = []
            this.forEach(element=>{
                elements.push(element.clone());
            })
        }
        return {
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }

    // 최종 수정 된 것만 복제한다. 메모리 아껴보자. 개선 더 해야한다.
    cloneOnlyUpdated(withoutElements=false,lastUpdatedAt=0){
        console.log('layers.cloneOnlyUpdated',withoutElements,lastUpdatedAt);
        // console.log('cloneOnlyUpdated.lastUpdatedAt',lastUpdatedAt);

        let elements = null;
        if(!withoutElements){
            elements = []
            this.forEach(element=>{
                if(lastUpdatedAt <= element.updatedAt ){ // lastUpdatedAt 보다 크거가 같다면 변경된 것으로 보고 clone 한다.
                    elements.push(element.clone()); 
                    // console.log('element.clone(O)',element);
                    
                }else{ // 아니다면 원본 Canvas를 유지한다.
                    elements.push(element);
                    // console.log('element.clone(x)',element);
                }
                
            })
        }
        return {
            lastUpdatedAt: this.lastUpdatedAt,
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }

    get lastUpdatedAt(){
        return (this.map(el=>el.updatedAt).reduce((a, b) => Math.max(a, b), 0)??0)
    }

    async export(contentType='dataurl'){
        let elements = null;
        // if(!withoutElements){
            elements = []
            // this.forEach(async element=>{
            //     elements.push(await element.export(contentType));
            // })
            for (const element of this) {
                elements.push(await element.export(contentType));
            }
        // }
        return {
            selectedIndex:this.selectedIndex,
            elements:elements,
        }
    }    
}
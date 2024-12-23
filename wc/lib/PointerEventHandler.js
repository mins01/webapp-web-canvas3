export default class PointerEventHandler{
    constructor(){
        
    }
    addEventListener(target){
        target.addEventListener('pointerdown',this.pointerdown);
    }
    removeEventListener(target){
        target.removeEventListener('pointerdown',this.pointerdown);
        document.removeEventListener('pointermove',this.pointermove)
        document.removeEventListener('pointerup',this.pointerup)
        document.removeEventListener('pointerleave',this.pointerup)
        document.removeEventListener('pointercancel',this.pointerup)
    }
    pointerdown = (event)=>{
        if(this.onpointerdown){this.onpointerdown(event)}
        document.addEventListener('pointermove',this.pointermove)
        document.addEventListener('pointerup',this.pointerup,{once:true})
        document.addEventListener('pointerleave',this.pointerup,{once:true})
        document.addEventListener('pointercancel',this.pointerup,{once:true})
    }
    pointermove = (event)=>{
        if(this.onpointermove){this.onpointermove(event)}
    }
    pointerup = (event)=>{
        if(this.onpointerup){this.onpointerup(event)}
        document.removeEventListener('pointermove',this.pointermove)
        document.removeEventListener('pointerup',this.pointerup)
        document.removeEventListener('pointerleave',this.pointerup)
        document.removeEventListener('pointercancel',this.pointerup)
    }

    onpointerdown(event){
        console.log('onpointerdown');
    };
    onpointermove(event){
        console.log('onpointermove');
    };
    onpointerup(event){
        console.log('onpointerup');
    };
}


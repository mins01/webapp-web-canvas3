export default class PointerEventHandler{
    constructor(){
        
    }
    addEventListener(target){
        target.addEventListener('pointerdown',this.pointerdown);
    }
    removeEventListener(target){
        target.removeEventListener('pointerdown',this.pointerdown);
        window.removeEventListener('pointermove',this.pointermove)
        window.removeEventListener('pointerup',this.pointerup)
        window.removeEventListener('pointerleave',this.pointerup)
        window.removeEventListener('pointercancel',this.pointerup)
    }
    pointerdown = (event)=>{
        if(this.onpointerdown){this.onpointerdown(event)}
        window.addEventListener('pointermove',this.pointermove)
        window.addEventListener('pointerup',this.pointerup,{once:true})
        window.addEventListener('pointerleave',this.pointerup,{once:true})
        window.addEventListener('pointercancel',this.pointerup,{once:true})
    }
    pointermove = (event)=>{
        if(this.onpointermove){this.onpointermove(event)}
    }
    pointerup = (event)=>{
        if(this.onpointerup){this.onpointerup(event)}
        window.removeEventListener('pointermove',this.pointermove)
        window.removeEventListener('pointerup',this.pointerup)
        window.removeEventListener('pointerleave',this.pointerup)
        window.removeEventListener('pointercancel',this.pointerup)
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


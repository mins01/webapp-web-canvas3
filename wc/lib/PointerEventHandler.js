export default class PointerEventHandler{
    constructor(){
        
    }
    addEventListener(target){
        target.addEventListener('pointerdown',this.down);
    }
    removeEventListener(target){
        target.removeEventListener('pointerdown',this.down);
        document.removeEventListener('pointermove',this.move)
        document.removeEventListener('pointerup',this.up)
        document.removeEventListener('pointerleave',this.up)
        document.removeEventListener('pointercancel',this.up)
    }
    down = (event)=>{
        if(this.ondown){this.ondown(event)}
        document.addEventListener('pointermove',this.move)
        document.addEventListener('pointerup',this.up,{once:true})
        document.addEventListener('pointerleave',this.up,{once:true})
        document.addEventListener('pointercancel',this.up,{once:true})
    }
    move = (event)=>{
        if(this.onmove){this.onmove(event)}
    }
    up = (event)=>{
        if(this.onup){this.onup(event)}
        document.removeEventListener('pointermove',this.move)
        document.removeEventListener('pointerup',this.up)
        document.removeEventListener('pointerleave',this.up)
        document.removeEventListener('pointercancel',this.up)
    }

    ondown(event){
        console.log('ondown');
    };
    onmove(event){
        console.log('onmove');
    };
    onup(event){
        console.log('onup');
    };
}


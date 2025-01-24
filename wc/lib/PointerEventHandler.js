export default class PointerEventHandler{
    pointers = null
    maxPointers = 0;
    target = null;
    downAt = null
    constructor(){
        this.pointers = new Map(); // 멀티터치 제어용
        this.maxPointers = 0;
        this.downAt = null;
    }
    addEventListener(target){
        target.addEventListener('pointerdown',this.pointerdown);
        window.addEventListener('pointermove',this.pointermove)
        window.addEventListener('pointerup',this.pointerup)
        window.addEventListener('pointerleave',this.pointerup)
        window.addEventListener('pointercancel',this.pointerup)
    }
    removeEventListener(){
        this.target.removeEventListener('pointerdown',this.pointerdown);
        window.removeEventListener('pointermove',this.pointermove)
        window.removeEventListener('pointerup',this.pointerup)
        window.removeEventListener('pointerleave',this.pointerup)
        window.removeEventListener('pointercancel',this.pointerup)
    }
    pointerdown = (event)=>{
        event.stopPropagation();
		event.preventDefault();
        if(this.pointers.size===0){ this.downAt = Date.now(); this.maxPointers=0; }
        if(!this.pointers.has(event.pointerId)){
            this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            this.maxPointers = Math.max(this.maxPointers,this.pointers.size)       
        }
        
        if(this.onpointerdown){this.onpointerdown(event)}
    }
    pointermove = (event)=>{
        event.stopPropagation();
		event.preventDefault();
        if(this.downAt){
            if(this.pointers.has(event.pointerId)) this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if(this.onpointermove){this.onpointermove(event)}
        }
    }
    pointerup = (event)=>{
        event.stopPropagation();
		event.preventDefault();
        this.pointers.delete(event.pointerId);
        if(this.onpointerup){this.onpointerup(event)}
        if(this.pointers.size===0){this.downAt = null; this.maxPointers=0;}
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


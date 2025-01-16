export default class LimitedQueueArray extends Array {
    size = Infinity;
    constructor(size,...args) {
        if(!Number.isFinite(size) || size<=0){ throw new Error(`Size must be a positive integer. (${size})`); }
        super(...args);
        this.size = size;
        this.limit()
    }
    static from(size,...args){
        return new this(size, ...Array.from(...args));
    }
    push(...args) {
        Array.prototype.push.apply(this,args);
        this.limit()
        return this.length;
    }

    limit(){
        if (this.length > this.size) {
            let v = this.length - this.size;
            if(v===1){
                this.shift();
            }else{
                let v = this.length - this.size;
                this.splice(0,v);
            }
        }
    }
    toJSON(){
        return {
            size:this.size,
            elements:Array.from(this),
        }
    }
}
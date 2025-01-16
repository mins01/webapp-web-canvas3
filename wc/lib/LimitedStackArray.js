export default class LimitedStackArray extends Array {
    maxLength = Infinity;
    constructor(maxLength) {
        if(!Number.isFinite(maxLength)){ throw new Error(`Limit must be a number. (${maxLength})`); }
        super();
        this.maxLength = maxLength;
    }

    push(...args) {
        // if (this.length >= this.maxLength) {
        //   this.shift();
        // }
        Array.prototype.push.apply(this,args);
        this.limit()
        return this.length;
    }

    limit(){
        if (this.length >= this.maxLength) {
            let v = this.length - this.maxLength;
            if(v===1){
                this.shift();
            }else{
                this.splice(0,v);
            }
        }
    }
    toJSON(){
        return {
            maxLength:this.maxLength,
            elements:Array.from(this),
        }
    }
}
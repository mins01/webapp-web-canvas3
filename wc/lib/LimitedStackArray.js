export default class LimitedStackArray extends Array {
    maxLength = Infinity;
    constructor(maxLength) {
        if(!Number.isFinite(maxLength)){ throw new Error(`Limit must be a number. (${maxLength})`); }
        super();
        this.maxLength = maxLength;
    }

    push(element) {
        // if (this.length >= this.maxLength) {
        //   this.shift();
        // }
        this.limit()
        Array.prototype.push.call(this,element);
    }

    limit(){
        if (this.length >= this.maxLength) {
            let v = this.length - this.maxLength + 1;
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
export default class LimitedStackArray extends Array {
    maxLength = Infinity;
    constructor(maxLength,...args) {
        if(!Number.isFinite(maxLength)){ throw new Error(`MaxLength must be a number. (${maxLength})(${args.join()})`); }
        super(...args);
        this.maxLength = maxLength;
        this.limit()
    }
    static from(maxLength,...args){
        return new this(maxLength, ...Array.from(...args));
    }
    push(...args) {
        Array.prototype.push.apply(this,args);
        this.limit()
        return this.length;
    }

    limit(){
        if (this.length > this.maxLength) {
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
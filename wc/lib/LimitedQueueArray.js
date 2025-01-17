
/**
 * push 후 size가 넘어가면 자동으로 앞의 요소부터 버리는 배열
 *
 * @export
 * @class LimitedQueueArray
 * @typedef {LimitedQueueArray}
 * @extends {Array}
 */
export default class LimitedQueueArray extends Array {
    /**
     * 배열의 제한 길이
     *
     * @type {number}
     */
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

    /**
     * Description placeholder
     *
     * @returns {number} 삭제된 요소의 수
     */
    limit(){
        if (this.length > this.size) {
            let v = this.length - this.size;
            if(v===1){
                this.shift();
            }else{
                this.splice(0,v);
            }
            return v;
        }
        return 0;
    }
    toJSON(){
        return {
            size:this.size,
            elements:Array.from(this),
        }
    }
}
import LimitedQueueArray from "./LimitedQueueArray.js";

export default class LimitedHistory{
    history = null;
    currentIndex = null;
    constructor(maxLength){
        this.history = new LimitedQueueArray(maxLength)
        this.currentIndex = -1;
    }
    save(state){
        if(this.currentIndex < this.history.length -1){ //이후 히스토리들 삭제
            this.history.splice(this.currentIndex+1,this.history.length-this.currentIndex-1);
        }
        this.history.push(state);
        this.currentIndex = this.history.length -1;
    }
    undo(){
        if(this.currentIndex <= 0){
            console.log(`History index <= 0. (${this.currentIndex} <= 0)`)
            return null
        }
        this.currentIndex--;
        return this.history?.[this.currentIndex]??null;
    }
    redo(){
        if(this.currentIndex >= this.history.length - 1){
            console.log(`History index > length. (${this.currentIndex} >= ${this.history.length - 1})`)            
            return null
        }
        this.currentIndex++;
        return this.history?.[this.currentIndex]??null;
    }
    current(){
        if(this.currentIndex===-1){return null;}
        return this.history?.[this.currentIndex]??null;
    }
    clear(){ 
        this.history.length = 0; 
        this.currentIndex == -1; 
    }
    all(){
        return this.history;
    }
    get length(){ return this.history.length; }

    toJSON(){
        return {
            currentIndex:this.currentIndex,
            history:this.history
        }
    }

}
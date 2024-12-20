export default class SelectedArray extends Array {
    constructor() {
        super();
        this._selectedIndex = -1;
    }
    set selectedIndex(selectedIndex){
        if (selectedIndex >= 0 && selectedIndex < this.length) {
            this._selectedIndex = selectedIndex;
        } else {
            throw new Error('Index out of bounds');
        }
    }
    get selectedIndex(){
        return this._selectedIndex;
    }
    get selected(){
        return this[this.selectedIndex]??null;
    }
    push(){
        let result = super.push(...arguments);
        if(this.selectedIndex < 0){
            this.selectedIndex = 0;
        }
        return result;
    }

    move(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) {
            throw new Error('Index out of bounds');
        }
        const fromElement = this[fromIndex];
        const toElement = this[toIndex];
        this.splice(toIndex, 1, fromElement);
        this.splice(fromIndex, 1, toElement);
    }
    moveTo(toIndex){
        const fromIndex = this.selectedIndex;
        if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) {
            return -1
        }
        this.move(fromIndex,toIndex);
        this.selectedIndex = toIndex;
        return this.selectedIndex;
    }

}
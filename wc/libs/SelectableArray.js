export default class SelectableArray{
    constructor(...elements){
        this._selectedIndex = -1;

        this._array = elements;
        this._selectedIndex = elements.length > 0 ? 0 : -1;
    }

    set selectedIndex(selectedIndex) {
        if (selectedIndex >= 0 && selectedIndex < this.length) {
            this._selectedIndex = selectedIndex;
        } else {
            throw new Error('Index out of bounds: '+selectedIndex);
        }
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    get selected(){
        return this._array[this.selectedIndex] ?? null;
    }
    set selected(v){
        if(this.selectedIndex < 0){
            throw new Error('Cannot set selected on an empty array');
        }
        this._array[this.selectedIndex] = v;
    }
    get length(){
        return this._array.length;
    }

    item(index){
        return this._array[index];
    }

    select(index=null){
        if(index!==null){ this.selectedIndex = index; }
        return this.selected;
    }

    add(element){
        if(this.selectedIndex < 0){
            this._array.push(element);
            this.selectedIndex = 0;
        }else{
            this._array.splice(this.selectedIndex+1,0,element);
            this.selectedIndex++;
        }
        return this.selectedIndex;
    }

    remove(){
        if (this.length <= 0) {
            throw new Error('Cannot remove from an empty array');
        }
        this._array.splice(this.selectedIndex,1);

        if(this.length <= 0){ this._selectedIndex = -1; }
        else{ this.selectedIndex = Math.min(this.length - 1,this.selectedIndex); }
        return this.selectedIndex;
    }


    /**
     * Moves an element from one index to another within the array.
     * 
     * @param {number} fromIndex - The index of the element to move.
     * @param {number} toIndex - The index to move the element to.
     * @throws {Error} If either index is out of bounds.
     */
    swap(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) {
            throw new Error('Index out of bounds: '+fromIndex+', '+toIndex);
        }
        const fromElement = this._array[fromIndex];
        const toElement = this._array[toIndex];
        this._array.splice(toIndex, 1, fromElement);
        this._array.splice(fromIndex, 1, toElement);
    }

    /**
     * Moves the currently selected element to a new index.
     * 
     * @param {number} toIndex - The index to move the selected element to.
     * @returns {number} The new selected index, or -1 if the move was not successful.
     */
    move(toIndex) {
        const fromIndex = this.selectedIndex;
        if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) {
            return -1;
        }
        try {
            this.swap(fromIndex, toIndex);
            this.selectedIndex = toIndex;
            return this.selectedIndex;    
        } catch (error) {
            return -1;
        }
        return -1;        
    }


    all(){
        return this._array;
    }

    join(separator) {
        return this._array.join(separator);
    }
}
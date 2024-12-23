/**
 * A class representing an array with a selectable element.
 */
export default class SelectableWrapedArray {
    /**
     * Creates an instance of SelectableArray.
     * @param {...*} elements - The elements to initialize the array with.
     */
    constructor(...elements) {
        /**
         * @private
         * @type {number}
         */
        this._selectedIndex = -1;

        /**
         * @private
         * @type {Array}
         */
        this._array = elements;
        this._selectedIndex = elements.length > 0 ? 0 : -1;
    }

    /**
     * Sets the selected index.
     * @param {number} selectedIndex - The index to select.
     * @throws {Error} If the index is out of bounds.
     */
    set selectedIndex(selectedIndex) {
        if (selectedIndex >= 0 && selectedIndex < this.length) {
            this._selectedIndex = selectedIndex;
        } else {
            throw new Error('Index out of bounds: ' + selectedIndex);
        }
    }

    /**
     * Gets the selected index.
     * @returns {number} The selected index.
     */
    get selectedIndex() {
        return this._selectedIndex;
    }

    /**
     * Gets the selected element.
     * @returns {*} The selected element, or null if the array is empty.
     */
    get selected() {
        return this._array[this.selectedIndex] ?? null;
    }

    /**
     * Sets the selected element.
     * @param {*} v - The value to set as the selected element.
     * @throws {Error} If the array is empty.
     */
    set selected(v) {
        if (this.selectedIndex < 0) {
            throw new Error('Cannot set selected on an empty array');
        }
        this._array[this.selectedIndex] = v;
    }

    /**
     * Gets the length of the array.
     * @returns {number} The length of the array.
     */
    get length() {
        return this._array.length;
    }

    /**
     * Gets the element at the specified index.
     * @param {number} index - The index of the element to retrieve.
     * @returns {*} The element at the specified index.
     */
    item(index) {
        return this._array[index];
    }

    /**
     * Selects the element at the specified index.
     * @param {number|null} [index=null] - The index to select. If null, the current selected element is returned.
     * @returns {*} The selected element.
     */
    select(index = null) {
        if (index !== null) {
            this.selectedIndex = index;
        }
        return this.selected;
    }

    /**
     * Adds an element to the array.
     * @param {*} element - The element to add.
     * @returns {number} The new selected index.
     */
    add(element) {
        if (this.selectedIndex < 0) {
            this._array.push(element);
            this.selectedIndex = 0;
        } else {
            this._array.splice(this.selectedIndex + 1, 0, element);
            this.selectedIndex++;
        }
        return this.selectedIndex;
    }

    /**
     * Removes the selected element from the array.
     * @returns {number} The new selected index.
     * @throws {Error} If the array is empty.
     */
    remove() {
        if (this.length <= 0) {
            throw new Error('Cannot remove from an empty array');
        }
        this._array.splice(this.selectedIndex, 1);

        if (this.length <= 0) {
            this._selectedIndex = -1;
        } else {
            this.selectedIndex = Math.min(this.length - 1, this.selectedIndex);
        }
        return this.selectedIndex;
    }

    /**
     * Swaps the elements at the specified indices.
     * @param {number} fromIndex - The index of the first element.
     * @param {number} toIndex - The index of the second element.
     * @throws {Error} If either index is out of bounds.
     */
    swap(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.length || toIndex < 0 || toIndex >= this.length) {
            throw new Error('Index out of bounds: ' + fromIndex + ', ' + toIndex);
        }
        const fromElement = this._array[fromIndex];
        const toElement = this._array[toIndex];
        this._array.splice(toIndex, 1, fromElement);
        this._array.splice(fromIndex, 1, toElement);
    }

    /**
     * Moves the selected element to the specified index.
     * @param {number} toIndex - The index to move the selected element to.
     * @returns {number} The new selected index, or -1 if the move was unsuccessful.
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
    }

    /**
     * Gets all elements in the array.
     * @returns {Array} The array of elements.
     */
    all() {
        return this._array;
    }

    /**
     * Joins all elements of the array into a string.
     * @param {string} separator - The separator to use between elements.
     * @returns {string} The joined string.
     */
    join(separator) {
        return this._array.join(separator);
    }
}

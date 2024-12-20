/**
 * A class that extends the native Map object to include selection functionality.
 * 
 * @extends Map
 */
export default class SelectableMap extends Map {
    /**
     * Creates an instance of SelectableMap.
     */
    constructor() {
        super();
        /**
         * @private
         * @type {any}
         */
        this._selectedKey = null;
    }

    /**
     * Gets the selected value from the map.
     * 
     * @returns {any} The value associated with the selected key, or null if no key is selected.
     */
    get selected() {
        return this.get(this._selectedKey) ?? null;
    }

    /**
     * Sets the value for the selected key in the map.
     * 
     * @param {any} v - The value to set for the selected key.
     * @throws {Error} If the selected key does not exist in the map.
     */
    set selected(v) {
        if (this.has(this.selectedKey)) {
            this.set(this.selectedKey, v);
        } else {
            throw new Error('SelectedKey does not exist: ' + key);
        }
    }

    /**
     * Gets the currently selected key.
     * 
     * @returns {any} The currently selected key.
     */
    get selectedKey() {
        return this._selectedKey;
    }

    /**
     * Sets the selected key.
     * 
     * @param {any} key - The key to select.
     * @throws {Error} If the key does not exist in the map.
     */
    set selectedKey(key) {
        if (key === null || this.has(key)) {
            this._selectedKey = key;
        } else {
            throw new Error('Key does not exist: ' + key);
        }
    }

    /**
     * Selects a key in the map.
     * 
     * @param {any} [key=null] - The key to select. If null, the current selected key is used.
     * @returns {any} The value associated with the selected key.
     */
    select(key = null) {
        if (key !== null) {
            this.selectedKey = key;
        }
        return this.get(this.selectedKey);
    }


    /**
     * Adds a key-value pair to the map and sets the selected key.
     *
     * @param {string} key - The key to add to the map.
     * @param {*} value - The value to associate with the key.
     * @returns {string} The key that was added and set as selected.
     */
    add(key, value) {
        this.set(key, value);
        this.selectedKey = key;
        return this.selectedKey;
    }

    /**
     * Removes the specified key from the map and clears the selected key.
     *
     * @param {any} key - The key to be removed from the map.
     * @returns {null} - Always returns null after removing the key.
     */
    remove(key) {
        this.delete(key);
        this.selectedKey = null;
        return this.selectedKey;
    }



    /**
     * Converts the map to a JSON string.
     * 
     * @returns {string} A JSON string representation of the map.
     */
    toJSON() {
        return JSON.stringify(Object.fromEntries(this));
    }
}
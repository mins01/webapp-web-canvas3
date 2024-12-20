// @deprecated 
// dont use it, use SelectableArray instead
import SelectableArray from './SelectableArray.js';

/**
 * A class that extends SelectableArray and allows for a named property to access the selected item.
 * 
 * @extends SelectableArray
 */
export default class NamedSelectableArray extends SelectableArray {
    /**
     * Creates an instance of NamedSelectableArray.
     * 
     * @param {...any} args - The arguments where the first argument is the name of the property and the rest are passed to the SelectableArray constructor.
     */
    constructor(...args) {
        if(!args[0] || !isNaN(args[0])){
            throw Error('The first argument must be a valid property name and not a number.');
        }
        super(...(args.slice(1) ?? []));
        const name = args[0];
        Object.defineProperty(this, name, {
            /**
             * Gets the selected item.
             * 
             * @returns {any} The selected item.
             */
            get() {
                return this.selected;
            },
            /**
             * Sets the selected item.
             * 
             * @param {any} v - The value to set as selected.
             */
            set(v) {
                this.selected = v;
            }
        });
    }
}

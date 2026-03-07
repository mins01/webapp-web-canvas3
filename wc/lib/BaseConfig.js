export default class BaseConfig{
    constructor(config=null){
        if (new.target === BaseConfig) {
            throw new Error("BaseClass cannot be instantiated directly.");
          }
        if(config){
            return this.constructor.proxy(this,config);
        }
    }
    /**
     * Description placeholder
     *
     * @static
     * @param {*} target 
     * @param {{ number: []|null; boolean: []|null; keys: []|null; }} [config={number:null,boolean:null,keys:null}] 
     * @returns {*} 
     */
    static proxy(target,config={number:null,boolean:null,keys:null}){
        let handler = {};
        if(config?.number || config?.boolean){
            handler.set = function(target, prop, value){
                if( config?.number && (config.number??[]) .includes(prop)){ // 숫자?
                    value = Number(value);
                    if(Number.isNaN(value)) return false;
                }else if( config?.boolean && (config.boolean??[]).includes(prop)){ // boolean
                    value = value === true || value === 'true' || value === 1 || value === '1';
                }
                target[prop] = value;
                return true;
            }
        }
        if(config?.keys){
            handler.has = function(target, prop){
                if( config.keys.includes(prop)){ return true; }
                return prop in target
            }
            handler.ownKeys = function(target){
                return [...new Set([...Reflect.ownKeys(target), ...config.keys])];
                // return config.keys;
                // return Reflect.ownKeys(target);
            }
        }
        const proxy = new Proxy(target,handler);
        return proxy;
    }

    toObject(){
        return {...this}
    }
    toJSON(){
        return this.toObject();
    }
    assignTo(context){
        for (const k in this) {
            if (k in context) context[k] = this[k]
        }
    }

    assignFrom(context){
        for (const k in context) {
            if (k in this) this[k] = context[k];
        }
    }
    
    import(conf){
        this.assignFrom(conf);
    }
}
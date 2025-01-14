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
                    value = parseFloat(value);
                    if(Number.isNaN(value)){
                        return false;
                    }
                }else if( config?.boolean && (config.boolean??[]).includes(prop)){ // boolean
                    if(value==='true'){ value = true;}
                    else if(value==='false'){ value = false;}
                    else{ value = !!value; }
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
                return config.keys;
                // return Reflect.ownKeys(target);
            }
        }
        const proxy = new Proxy(target,handler);
        return proxy;
    }

    toObject(){
        const robj = {}
        for(let k in this){
            robj[k] = this[k];
        }
        return robj;
    }
    toJSON(){
        return this.toObject();
    }
    // assign(context){
    //     // for(let k in this){
    //     //     if(context?.[k] !== undefined){
    //     //         context[k] = this[k];                
    //     //     }
    //     // }
    // }
    assignTo(context){
        for(let k in this){
            if(context?.[k] !== undefined){
                context[k] = this[k];                
            }
        }
    }

    assignFrom(context){
        for(let k in context){
            if(this?.[k] !== undefined){
                this[k] = context[k];
            }
        }
    }
}
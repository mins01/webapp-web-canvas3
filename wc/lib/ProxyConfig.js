export default class ProxyConfig{
    constructor(config){
        return this.constructor.from(this,config);
    }
    static from(target,config={number:[],boolean:[]}){
        const proxy = new Proxy(target,{
            set(target, prop, value){
                if( (config?.number??[]) .includes(prop)){ // 숫자?
                    value = parseFloat(value);
                    if(Number.isNaN(value)){
                        return false;
                    }
                }else if((config?.boolean??[]).includes(prop)){ // boolean
                    if(value==='true'){ value = true;}
                    else if(value==='false'){ value = false;}
                    else{ value = !!value; }
                }
                target[prop] = value;
                return true;
            }
        })
        // proxy.reset();
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
    assign(context){
        for(let k in this){
            if(context?.[k] !== undefined){
                context[k] = this[k];                
            }
        }
    }
}
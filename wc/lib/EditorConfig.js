import BaseConfig from "./BaseConfig.js"

export default class EditorConfig extends BaseConfig{
    
    inputMode = 'all'

    constructor(){
        const proxyConfig = {
            keys:['inputMode']
            // number:[],
            // boolean:['flipX','flipY','makeOpaque',],
        }
        const proxy = super(proxyConfig);
        this.reset();
        return proxy;
    }
    
    reset(){
        this.inputMode = 'all';
    }
}
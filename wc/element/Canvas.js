// import BaseConfig from "../lib/BaseConfig.js";
import Context2dConfig from "../lib/Context2dConfig.js";
import Context2dUtil from "../lib/Context2dUtil.js";
import HtmlUtil from "../lib/HtmlUtil.js";

class Canvas extends HTMLCanvasElement{
    static context2dOptions = {
        "alpha":true,
        // "colorSpace":"srgb", // srgb, display-p3
        // "colorType":"unorm8", // unorm8, float16
        // "desynchronized": true, // 더 빠른 반응시간
        "willReadFrequently": false,
    };

    static get keys(){
        return ['name', 'width', 'height', 'drawable', 'label', 'contextConfig', 'createdAt','updatedAt',];
    }

    // @deprecated
    // @alias register
    static defineCustomElements(tagName='wc-canvas'){
        return this.register(tagName);
    }
    // 웹 커스텀 엘레멘트 등록
    static register(tagName='wc-canvas'){
        if(!globalThis.window){return;}
        if (!customElements.get(tagName)) {
            customElements.define(tagName, this,{ extends: "canvas" });
            console.log('register', tagName);
        }        
    }
    static getRandName(prefix,length=6){
        const rand = (Math.floor(Math.random()*Math.pow(10,length))).toString().padStart(length,'0');
        return `${prefix}-${rand}`;
    }


    name = null;
    drawable = true;
    constructor(w=null,h=null){
        super();

        this.drawable = true; // 그리기 가능한가? 그리기 툴에서 체크.

        
        if(this.id === undefined || this.id === '') this.id =  this.constructor.getRandName('wc-'+this.constructor.name.toLocaleLowerCase(),10);
        this.name = this.constructor.getRandName(this.constructor.name,10);
        
        const d = new Date();
        this.label = "created at "+(d).toLocaleString(['ko'],{dateStyle:'medium',timeStyle:'medium',hourCycle:'h24'}).replace(/[^\d]/g,'');
        this.contextConfig = new Context2dConfig();

        // Object.defineProperty(this,'ctx',{ enumerable: false, configurable: true, writable: true, value: null, })
        Object.defineProperty(this, 'parent', { enumerable: false, configurable: true, writable: true, value: null, })
        // this.parent = null

        this.setContext2d();
        this.width = w??this.width;
        this.height = h??this.height;
        this.updatedAt = this.createdAt = Date.now();
    }


    connectedCallback(){
        console.debug('connectedCallback',this);
    }
    disconnectedCallback(){
        console.debug('disconnectedCallback',this);
    }
    adoptedCallback(){
        console.debug('adoptedCallback',this);
    }
    // attributeChangedCallback(name, oldValue, newValue){
        
    // }
    #ctx = null;
    get ctx(){
        return this.#ctx ??= this.getContext2d();
    }

    // @deprecated
    setContext2d(options=Canvas.context2dOptions){
        // this.ctx = this.getContext2d(options)
        return this.ctx;
    }
    getContext2d(options=Canvas.context2dOptions){
        return this.getContext('2d',options)
    }

    setContextConfig(conf){
        this.contextConfig.assignFrom(conf);
    }

    // updatedAt 갱신
    touch(){
        // console.log('touch',this);
        
        this.updatedAt = Date.now();
        return this.updatedAt;
    }

    draw(){ // 따로 그리기 동작이 있을 경우.
        this.touch();
        return this.dispatchEvent( new CustomEvent("draw", {bubbles:true,cancelable:true}) ); // 이벤트 버블
    }
    flush(){
        this.draw();
        this.sync();
        return this.dispatchEvent( new CustomEvent("flush", {bubbles:true,cancelable:true}) );
    }
    sync(){
        this.parentFlush();
    }

    parentFlush(){
        this?.parent?.flush();
    }

    /**
     * Fill the canvas with a color
     * @param {string} color - The color to fill the canvas with
     */
    fill(color){
        const ctx = this.ctx;
        this.ctx.save();
        ctx.fillStyle = color;
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.restore();
    }
    //@deprecated
    stroke(color,lineWidth=1){
        const ctx = this.ctx;
        this.ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(0,0,this.width,this.height);
        this.ctx.restore();
        // console.log('stroke',color,lineWidth);
        
    }
    clear(){
        this.ctx.save();
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.restore();
    }

    static clone(obj,name=null){
        const newCanvas = new this(obj.width,obj.height);       
        newCanvas.import(obj)

        if(name===true){ // auto append cloned
            newCanvas.name = newCanvas.name.substring(0,40)+' cloned';
        }else if(name){
            newCanvas.name = name.substring(0,40)
        }

        return newCanvas;
    }

    clone(name=null){
        return this.constructor.clone(this,name);
    }
    resize(width,height,imageSmoothingEnabled=null){
        if(this.width !== width || this.height !== height){
            const cloned = this.clone();
            this.width = width;
            this.height = height;
            this.ctx.save();
            if(imageSmoothingEnabled!==null){
                this.ctx.imageSmoothingEnabled = !!imageSmoothingEnabled;        
            }
            this.ctx.drawImage(cloned, 0, 0, width, height);
            this.ctx.restore();
        }
        
    }

    trim(){
        Context2dUtil.selfTrim(this.ctx);
    }



    toObject(){
        const r = {};
        for (const k of this.constructor.keys) {
            r[k] = this[k]?.toObject?this[k]?.toObject():this[k];
        }
        return r;
    }
    toJSON(){
        return this.exportWithDataUrl();
    }

    async export(contentType='dataurl'){
        const obj = this;
        // const r = {...obj}
        const r = obj.toObject()
        for(let k in r){ // 히스토리용이기 때문에 참고 값을 끊는 작업을 한다.
            if(r[k]?.export){r[k] = await r[k].export(contentType)}
        }

        r.exportVersion = '20250710';
        r.__class__ = obj.constructor.name;
        r.__content_type__ = contentType;
        if(contentType=='dataurl'){ r.__content__ = obj.toDataURL('image/png'); }
        else if(contentType=='snapshot'){ 
            if(!obj?.ctx) throw new Error("Invalid ctx.");

            r.__content__ = obj.ctx.getImageData(0, 0, obj.ctx.canvas.width, obj.ctx.canvas.height); 
        }
        else if(contentType=='file'){
            // obj.toBlob((blob)=>{ console.log('obj.toBlob');r.__content__ = new File([blob],`${obj.id}.png`,{ type: blob.type, lastModified: Date.now() }) },'image/png'); //비동기라서 밑에 프로미스로
            // r.__content__ = await new Promise((resolve,reject) => {
            //     try{
            //         super.toBlob(blob => { console.log('obj.toBlob'); const file = new File([blob], `${obj.id}.png`, { type: blob.type, lastModified: Date.now() }); resolve(file); }, 'image/png');
            //     }catch(e){
            //         reject(e)
            //     }
                
            // });
            // console.log('export start',r.name);
            
            r.__content__ = await new Promise((resolve, reject) => {
                super.toBlob(
                    (blob) => {
                    try {
                        if (!blob) {
                        reject(new Error('toBlob returned null'));
                        return;
                        }

                        // console.log('obj.toBlob');

                        const file = new File(
                        [blob],
                        `${obj.id}.png`,
                        {
                            type: blob.type || 'image/png',
                            lastModified: Date.now(),
                        }
                        );

                        resolve(file);
                    } catch (e) {
                        reject(e);
                    }
                    },
                    'image/png'
                );
            });

            // console.log('export end',r.name);
        }
        return r;
    }



    exportWithDataUrl(){
        return this.constructor.exportWithDataUrl(this);
    }
    static exportWithDataUrl(obj){
        const r = obj.toObject();
        r.exportVersion = '20250115';
        r.__class__ = obj.constructor.name;
        r.dataUrl = obj.toDataURL('image/png')
        return r;
    }

    // 우선 쓰지말자. export 를 좀 더 개선후 보자.
    // async exportWithFile(){
    //     return await this.constructor.exportWithFile(this);
    // }
    // // dataUrl 대신 파일 객체로
    // static async exportWithFile(obj){
    //     const r = obj.toObject();
    //     r.exportVersion = '20250710';
    //     r.__class__ = obj.constructor.name;
    //     await obj.toBlob((blob)=>{ r.__file__ = new File([blob],`${obj.id}.png`,{ type: blob.type, lastModified: Date.now() }) },'image/png');
    //     return r;
    // }
    
    snapshot(){
        return this.constructor.snapshot(this);
    }
    static snapshot(obj){
        const ctx = obj.ctx;
        const r = obj.toObject();
        // console.log('snapshot r[k]?.toObject',r);
        
        // for(let k in r){ // 히스토리용이기 때문에 참고 값을 끊는 작업을 한다. //20260307 이부분 의미가 있나?. 이거 해야한다. contextConfig, imageData 등에 영항있다. toObject에서 처리하자
        //     if(r[k]?.toObject){r[k] = r[k].toObject()}
        // }
        r.snapshotVersion = '20250116';
        r.__class__ = obj.constructor.name;
        r.imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        return r;
    }


    
    static importProperties(obj,conf){
        obj.constructor.keys.forEach((k)=>{
            if(conf?.[k] === undefined){return;}
            if(obj?.[k] === undefined){return;}
            if(obj[k]?.import !== undefined){
                obj[k].import(conf[k]);return;
            }
            obj[k] = conf[k];
        })
    }

    // async 적용할지 고민하자.
    static import(obj,conf){
        this.importProperties(obj,conf)

        if(conf?.__content_type__){
            if(conf.__content_type__==='file'){
                HtmlUtil.loadImageFile(conf.__content__).then((img)=>{
                    obj.ctx.drawImage(img,0,0);
                    // obj.flush();
                }).catch((event)=>{
                    console.error(event)
                })
            }else if(conf.__content_type__==='dataurl'){
                HtmlUtil.loadImageUrl(conf.__content__).then((img)=>{
                    obj.ctx.drawImage(img,0,0);
                    // obj.flush();
                }).catch((event)=>{
                    console.error(event)
                })
            }else if(conf.__content_type__==='snapshot'){
                obj.ctx.putImageData(conf?.__content__, 0, 0);
                // obj.flush();
            }
        }else if(conf?.imageData !== undefined){ // @deprecated
            obj.ctx.putImageData(conf?.imageData, 0, 0);
            // obj.flush();
        }else if(conf?.dataUrl !== undefined){ // @deprecated
            HtmlUtil.loadImageUrl(conf.dataUrl).then((img)=>{
                obj.ctx.drawImage(img,0,0);
                // obj.flush();
            }).catch((event)=>{
                console.error(event)
            })
        }else if(conf instanceof Canvas){ // Canvas 객체를 가져와서 내용을 그대로 그림.
            obj.ctx.save();
            obj.ctx.globalAlpha = 1;
            obj.ctx.setTransform(1, 0, 0, 1, 0, 0); // scale, rotate, translate, transform 초기화
            obj.ctx.globalCompositeOperation = "source-over";
            if(obj.ctx?.filter) obj.ctx.filter = 'none'; 
            obj.ctx.imageSmoothingEnabled = false; // 최대한 픽셀이 똑같게
            // obj.ctx.imageSmoothingQuality = 'low'; // 'medium', 'high'
            obj.ctx.beginPath();
            if(obj.ctx?.shadowColor){
                obj.ctx.shadowColor = "transparent";
                obj.ctx.shadowBlur = 0;
                obj.ctx.shadowOffsetX = 0;
                obj.ctx.shadowOffsetY = 0;
            }

            obj.ctx.drawImage(conf,0,0);
            obj.ctx.restore();
            
        }else{
            // obj.flush();
        }
        // obj.flush();
    }
    
    importProperties(conf){
        return this.constructor.importProperties(this,conf);
    }

    import(conf){
        return this.constructor.import(this,conf);
    }

    static importFrom(conf){
        const c = new this()
        c.import(conf)
        return c;
    }

    /**
     * Description placeholder
     *
     * @static
     * @param {HTMLImageElement|HTMLCanvasElement} image 
     */
    static fromImage(image){
        const c = new this(image.width,image.height);
        c.ctx.drawImage(image, 0, 0, image.width, image.height);
        return c
    }



    /**
     * Description placeholder
     *
     * @param {Function} callback 
     * @param {string} type 
     * @param {any} quality 
     */
    toBlob(callback, type = 'image/png', quality = 1.0){
        if(type==='wc3.json' || type=== 'application/json'){
            this.export('dataurl').then((exportedData)=>{
               const blob = new Blob([JSON.stringify(exportedData,null,4)],{ type })
               callback(blob);
            });
        }else if(type==='wc3.zip' || type=== 'application/zip'){
            this.export('file').then(async (exportedData)=>{                
                const files = WcHelper.filesFromExportedData(exportedData);
                // console.log(files)
                if(!globalThis?.JSZip) throw new Error("Required JSZip.");
                
                const zip = new globalThis.JSZip();
                zip.file("wc3.json", JSON.stringify(exportedData,null,2));
                const folder = zip.folder("files"); // 'files/' 폴더 생성
                files.forEach(file=>{
                    folder.file(file.name, file ,{ compression: 'STORE' });       // File 객체를 해당 폴더에 추가. 압축하지 않는다. 저장만 한다.
                })

                zip.generateAsync(
                    { 
                        type: "blob" ,
                        compression: 'DEFLATE',
                        compressionOptions: { level: 9 } // 기본 압축률 9
                    }
                ).then((blob)=>{
                    callback(blob);
                });
                    
            })
        }else{
            super.toBlob(...arguments)
        }
    }






    asyncToBlob(type = 'image/png', quality = 1.0){
        return new Promise((resolve, reject) => {
            this.toBlob(blob => {
                if (blob) { resolve(blob); } 
                else { reject(new Error('Error toBlob')); }
            }, type, quality);
        });
    }
    // @deprecated
    // @see asyncToBlob
    // toBlobAsync(type = 'image/png', quality = 1.0) {
    //     return this.asyncToBlob(type,quality)
    // }
}


export default Canvas;
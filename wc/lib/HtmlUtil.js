export default class HtmlUtil{
  static formToObject(f){
    const fd = new FormData(f);
    return this.formDataToObject(fd);
  }
  static formDataToObject(formData) {
    const obj = {};
    formData.forEach((value, key) => {
      // 이미 obj에 key가 존재하면, 값을 배열로 변환하여 추가
      if (obj.hasOwnProperty(key)) {
        obj[key] = [].concat(obj[key], value);
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }
  static objectToForm(object,form){
    for(let k in form.elements){
      if((object?.[k]??false) !== false){
        // console.log(k,form.elements?.[k],object[k].toString());                
        if(form.elements[k] instanceof RadioNodeList){
          // const checked = [...form.elements[k]].find((el)=>{return el.checked})
          form.elements[k].value = object[k].toString();
          // if(checked){ checked.dispatchEvent(new Event('change',{bubbles:true,cancelable:true})) }
        }else{
          form.elements[k].value = object[k].toString(); //checkbox 에선 에러날꺼다.
          // form.elements[k].dispatchEvent(new Event('change',{bubbles:true,cancelable:true}))
        }
      }
    }
    
  }
  
  static saveAsFile(content, filename , type='text/plain') {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.position="absolute";
    a.style.top=0;
    a.style.left=0;
    a.style.opacity=0;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  static saveAsCanvas(canvas,type='png',filename = null){
    if(!canvas){return false;}
    if(filename===null){ filename = canvas.name }
    filename = filename.trim().replace(/[\\\/\:\*\?\"\<\>]|/g,''); //OS 금지 글자 제거
    if(filename.length==0) filename = Date.now();
    if(filename != canvas.name){ canvas.name = filename; }
    
    console.log('saveAsCanvas',filename);
    
    let ext = '';
    let mimetype = null;
    if(type==='png'){
      ext = 'png';
      mimetype = 'image/png';
      const cb = (blob)=>{ this.saveAsFile(blob, filename+'.'+ext , mimetype); }
      canvas.toBlob(cb,mimetype)
    }else{
      console.error('지원되지 않는 타입')
    }
  }
  static fetchUrl(url){
    return fetch(url);
  }
  static fetchJsonUrl(url){
    return this.fetchUrl(url).then(response => response.json());
  }
  

  static loadBinFile(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = (event) => { resolve(event.target.result); }
      reader.onerror = (event) => { reject(event); }
      reader.readAsArrayBuffer(file);
    })
  }

  /**
  * 텍스트 파일을 읽어 문자열로 반환하는 정적 메서드입니다.
  *
  * @param {File} file - 브라우저의 `<input type="file">` 등으로 선택된 파일 객체.
  * @returns {Promise<string>} 파일 내용을 문자열로 반환하는 Promise.
  *
  * @example
  * const file = document.querySelector('input[type="file"]').files[0];
  * const content = await MyClass.loadTextFile(file);
  * console.log(content);
  */
  static loadTextFile(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = (event) => { resolve(event.target.result); }
      reader.onerror = (event) => { reject(event); }
      reader.readAsText(file);
    })
  }
  /**
  * JSON 파일을 읽어 JavaScript 객체로 반환하는 정적 메서드입니다.
  *
  * 내부적으로 `loadTextFile`을 사용하여 파일을 텍스트로 읽은 뒤, `JSON.parse()`를 통해 객체로 변환합니다.
  *
  * @param {File} file - JSON 형식의 텍스트 파일 (`.json` 확장자 등).
  * @returns {Promise<Object>} 파일 내용을 파싱한 JavaScript 객체를 반환하는 Promise.
  *
  * @throws {SyntaxError} JSON 파싱 중 에러가 발생할 경우
  * @throws {Error} 파일 읽기 중 오류가 발생할 경우
  *
  * @example
  * const file = document.querySelector('input[type="file"]').files[0];
  * const jsonData = await MyClass.loadJsonFile(file);
  * console.log(jsonData.key);
  */
  static loadJsonFile(file){
    return new Promise((resolve,reject)=>{
      this.loadTextFile(file)
      .then((text)=>{ resolve(JSON.parse( text)); })
      .catch((e)=>{reject(e)})
    })
  }


  static loadZipFile(file){
    return new Promise((resolve,reject)=>{
      this.loadBinFile(file)
      .then(async (arrayBuffer)=>{ 
        if(!globalThis?.JSZip) throw new Error("Required JSZip.");
        const zip = await globalThis.JSZip.loadAsync(arrayBuffer);

        let conf = {}
        // 예: 특정 텍스트 파일 읽기
        const textFile = zip.file("wc3.json");
        if (textFile) {
          const content = await textFile.async("string");
          // console.log(content);
          conf = JSON.parse(content);
        }
        // 첨부파일 연길하기
        if(conf?.__content__){
          const file = zip.file(`files/${conf.__content__}`);
          if(file){ 
            try{
              const blob = await file.async('blob');
              conf.__content__ = new File([blob], conf.__content__, { type: blob.type || 'image/png' ,  lastModified: file.date.getTime() });
            }catch(e){
              console.error('ERROR: conf',e);
              throw e;
            }
          }
        }
        // 첨부파일 연길하기
        if(conf?.layers){
          for (const layer of conf.layers.elements) {
            const file = zip.file(`files/${layer.__content__}`);
            if(file){ 
              try{
                const blob = await file.async('blob');
                layer.__content__ = new File([blob], layer.__content__, { type: blob.type || 'image/png' , lastModified: file.date.getTime() });
              }catch(e){
                console.error('ERROR: conf.layers.elements',e);
                throw e;
              }             
            }

          }
        }
       
        // console.log('loadZipFile',file,conf);
        resolve(conf)
      })
      .catch((e)=>{reject(e)})
    })
  }
  
  /**
  * 지정한 URL에서 JSON 데이터를 로드합니다.
  * 
  * 이 메서드는 `fetchJsonUrl(url)` 메서드를 호출하는 래퍼 함수입니다.
  *
  * @param {string} url - JSON 데이터를 가져올 대상 URL입니다.
  * @returns {Promise<any>} JSON 데이터를 포함하는 Promise 객체를 반환합니다.
  */
  static loadJsonUrl(url){
    return this.fetchJsonUrl(url).then((obj)=>{
      if(!obj?.exportVersion){
        throw new Error("This file is not in WC3 JSON format.");
      }
      return obj
    });
  }
  
  /**
  * 이미지 URL을 비동기적으로 로드하고, 로드 완료 시 HTMLImageElement를 반환하는 정적 메서드입니다.
  *
  * @param {string} url - 로드할 이미지의 URL.
  * @returns {Promise<HTMLImageElement>} 이미지 로드가 완료되면 반환되는 HTMLImageElement를 담은 Promise.
  *
  * @throws {Error} 이미지 로드 중 오류가 발생한 경우 reject 됩니다.
  *
  * @example
  * try {
  *   const img = await MyClass.loadImageUrl('https://example.com/image.jpg');
  *   document.body.appendChild(img);
  * } catch (error) {
  *   console.error("이미지 로드 실패:", error);
  * }
  */
  static loadImageUrl(url){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload=function(event){ resolve(event.target); }
      img.onerror=function(event){ reject(event); }
      img.src = url;
    });
  }

  static loadImageFile(file){
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) { reject(new TypeError("Input must be a File object")); return; }
      const url = URL.createObjectURL(file);
      this.loadImageUrl(url).then((img)=>{
        URL.revokeObjectURL(url);
        resolve(img)
      }).catch((e)=>{
        URL.revokeObjectURL(url);
        reject(e);
      })
    });
  }
  
  
  static applyStyleObject(element,styleObject){
    for (const [key, value] of Object.entries(styleObject)){
      element.style[key] = value
    }
  }
}
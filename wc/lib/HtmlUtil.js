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
                    const checked = [...form.elements[k]].find((el)=>{return el.checked})
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
    static asyncLoadFile(file){
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = (event) => { resolve(event.target.result); }
            reader.onerror = (event) => { reject(event); }
            reader.readAsText(file);
        })
    }
}
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
        for(let k in object){
            if(form.elements?.[k] !== undefined){
                form.elements[k].value = object[k].toString();
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
    static asyncLoadFile(file){
        return new Promise((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload = (event) => { resolve(event.target.result); }
            reader.onerror = (event) => { reject(event); }
            reader.readAsText(file);
        })
    }
}
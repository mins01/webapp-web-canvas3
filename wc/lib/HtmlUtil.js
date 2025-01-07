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
}
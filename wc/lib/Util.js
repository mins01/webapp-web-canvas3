export default class Util{
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


    static parseCssSize(value){
        const vhr = value.match(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/);
        const number = vhr?.[1]??null;
        const unit = vhr?.[2]??null;
        return { number , unit };
    }
    static calculateSizeBasedOnFontSize(value,fontSize){

        // this.parseCssSize(value)

        const vhr = value.matchAll(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/g);
        const vhrs = [...vhr]; if(!vhrs || !vhrs[0]){ return null}
        const valueNumber = parseFloat(vhrs[0][1]);
        const valueUnit = (vhrs[0][2]??null);
        const fsr = fontSize.matchAll(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/g);
        const fsrs = [...fsr]; if(!fsrs || !fsrs[0]){ return null}
        const fontSizeNumber = parseFloat(fsrs[0][1]);
        const fontSizeUnit = (fsrs[0][2]??null);

        let r = '';
        if(!valueUnit){
            r = (valueNumber*fontSizeNumber)+fontSizeUnit;
        }else if(valueUnit=='em'){
            r = (valueNumber*fontSizeNumber)+fontSizeUnit;
        }else if(valueUnit=='%'){
            r = (valueNumber*fontSizeNumber/100)+fontSizeUnit;
        }else{
            r = value;
        }
        return r;
    }

    static convertToPx(v){

    }
}
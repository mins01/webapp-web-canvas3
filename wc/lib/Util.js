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


    /**
     * 99.99px 를 99.99 와 px로 나눔
     *
     * @static
     * @param {String} value 99.99px 99.99em 99.99% 99.99
     * @returns {{ number: {number|null}; unit: {String|null}; }} 
     */
    static parseCssSize(value){
        const vhr = (value??"").match(/([-+]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)([^\d]+)?/);
        let number = vhr?.[1]??null;
        if(number !== null) number = parseFloat(number);
        const unit = vhr?.[2]??null;
        return { number , unit };
    }
    static cssSizeBasedOnFontSize(value,fontSize){
        const vr = this.parseCssSize(value);
        if(vr?.number === null){return null;}
        if([null,'%','em'].includes((vr?.unit??null))){ //상대적 크기
            const fsr = this.parseCssSize(fontSize);
            if((fsr?.number??null) === null){return null;}
            let r = null;

            if((vr?.unit??null)===null){
                r = (vr.number * fsr.number) + (fsr.unit??'');
            }else if(vr.unit === 'em'){
                r = (vr.number * fsr.number) + (fsr.unit??'');
            }else if(vr.unit === '%'){
                r = (vr.number/100 * fsr.number) + (fsr.unit??'');
            }else{
                return null;
            }
            return r;
        }else{ //그외 값을 절대 값으로 본다.
            return value;
        }
    }

    static cssSizeConvertToPx(value){
        let vr = this.parseCssSize(value)
        if(vr.number === null){return null;}
        if(vr.unit === null){return null;}

        if(vr.unit == 'cm'){
            return vr.number * 37.795275591; //96 DPI
        }else if(vr.unit == 'mm'){
            return vr.number * 3.7795275591; //96 DPI
        }else if(vr.unit == 'Q'){
            return vr.number * 0.09375; //96 DPI
        }else if(vr.unit == 'in'){
            return vr.number * 96; //96 DPI
        }else if(vr.unit == 'pc'){
            return vr.number * 16.0;
        }else if(vr.unit == 'pt'){
            return vr.number * 1.3333;
        }else if(vr.unit == 'px'){
            return vr.number;
        }
        return null;
    }
}
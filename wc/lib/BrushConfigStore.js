import BrushConfig from "./BrushConfig.js";

class BrushConfigStore{

  //-- 커스텀 된 브러시 설정 관련 로드 및 세이브
  static lastKey = 'brush0';
  static storageKeyPrefix = 'wc-brushconfigstore-'
  static load(key){
    if(key===null) key = this.lastKey

    this.lastKey = key;
    const storageKey = `${this.storageKeyPrefix}${key}`;
    let brushConfig = localStorage.getItem(storageKey);

    console.log('BrushConfigStore.load',key, brushConfig);

    if (brushConfig === null) {
      brushConfig = (new BrushConfig()).toJSON();
      if(key.startsWith("eraser")){ brushConfig.compositeOperation = 'destination-out'} // 지우개 용으로 처리
      localStorage.setItem(storageKey, JSON.stringify(brushConfig));
      return brushConfig;
    }

    try {
      return JSON.parse(brushConfig);
    } catch (e) {
      return brushConfig;
    }
  }
  static saveToLastKey(brushConfig){
    return this.save(this.lastKey,brushConfig);
  }
  static save(key,brushConfig){
    // console.log('BrushConfigStore.save',key,brushConfig);
    const storageKey = `${this.storageKeyPrefix}${key}`;
    localStorage.setItem(storageKey, JSON.stringify(brushConfig));
    return brushConfig;
  }
  static deleteToLastKey(){
    const storageKey = `${this.storageKeyPrefix}${this.lastKey}`;
    localStorage.removeItem(storageKey);
  }
}
export default BrushConfigStore;
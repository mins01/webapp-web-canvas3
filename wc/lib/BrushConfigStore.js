class BrushConfigStore{

  //-- 커스텀 된 브러시 설정 관련 로드 및 세이브
  static lastKey = 'brush0';
  static storageKeyPrefix = 'wc-brushconfigstore-'
  static load(key){
    if(key===null) key = this.lastKey
    // console.log('BrushConfigStore.load',key);
    this.lastKey = key;
    const storageKey = `${this.storageKeyPrefix}${key}`;
    let value = localStorage.getItem(storageKey);

    if (value === null) {
      const brushConfig = {};
      localStorage.setItem(storageKey, JSON.stringify(brushConfig));
      return brushConfig;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
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
}
export default BrushConfigStore;
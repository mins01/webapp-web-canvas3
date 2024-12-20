import SelectableMap from "../../wc/libs/SelectableMap.js";

let sm = new SelectableMap();
console.assert(sm.selectedKey===null,sm.selected===null);
sm.set('a',1);
sm.set('b',2);
console.log(sm.toJSON());
console.log(sm.selectedKey,sm.selected);
sm.selectedKey = 'b';
console.log(sm.selectedKey,sm.selected);
sm.selectedKey = null
console.log(sm.selectedKey,sm.selected);
console.assert(sm.selectedKey===null,sm.selected===null);
sm.add('a',1)
console.assert(sm.selectedKey==='a',sm.selected===1);
console.log(sm.selectedKey,sm.selected);
sm.remove('a')
console.assert(sm.selectedKey===null,sm.selected===null);
console.log(sm.selectedKey,sm.selected);


import SelectableArray from "../../wc/lib/SelectableArray.js";

let sa = new SelectableArray(0,1,2,3,4);
sa.clear();
console.assert(sa.selectedIndex === -1 && sa.selected === null && sa.length === 0);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa = new SelectableArray(0,1,2,3,4);
console.assert(sa.selectedIndex === 0 && sa.selected === 0);
console.assert(sa.join(',')==='0,1,2,3,4');
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.selectedIndex = 1;
console.assert(sa.selectedIndex === 1 && sa.selected === 1);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
try{
    sa.selectedIndex = 5;
    console.assert(false);
}catch(e){
    console.assert(e.message === 'Index out of bounds: 5');
}
console.log(sa.selectedIndex,sa.selected,sa.join(','))
//---
sa.selectedIndex = 3;
console.assert(sa.selectedIndex === 3 && sa.selected === 3);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.add(999) 
console.assert(sa.selectedIndex === 4 && sa.selected === 999);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 4 && sa.selected === 4);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 3 && sa.selected === 3);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 2 && sa.selected === 2);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 1 && sa.selected === 1);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 0 && sa.selected === 0);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === -1 && sa.selected === null);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.add(0);
console.assert(sa.selectedIndex === 0 && sa.selected === 0);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.add(1);
console.assert(sa.selectedIndex === 1 && sa.selected === 1);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.add(2);
console.assert(sa.selectedIndex === 2 && sa.selected === 2);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.selectedIndex = 0;
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 0 && sa.selected === 1);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === 0 && sa.selected === 2);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.remove()
console.assert(sa.selectedIndex === -1 && sa.selected === null);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.add(0);
sa.add(1);
sa.add(2);
sa.selectedIndex = 0;
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.swap(0,2);
console.assert(sa.selectedIndex === 0 && sa.selected === 2);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
sa.move(2);
console.assert(sa.selectedIndex === 2 && sa.selected === 2);
console.log(sa.selectedIndex,sa.selected,sa.join(','))
var r = sa.item(1)
console.assert(r === 1);

console.log('---------------------------------------');
console.log(JSON.stringify(sa));
console.log(sa.valueOf());

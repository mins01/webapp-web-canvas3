import SelectedArray from "../../wc/libs/SelectedArray.js";


let sa = new SelectedArray();
sa.push(1,2,3,4,5);
console.log(sa.selectedIndex , sa.selected); // 5
sa.selectedIndex = 1;
console.log(sa.selectedIndex , sa.selected); 

sa = new SelectedArray();
sa.push(0);
sa.push(1);
sa.push(2);
sa.push(3);
sa.push(4);
console.log(sa.selectedIndex , sa.selected, sa.join(','));
// sa.selectedIndex = 8;
sa.selectedIndex = 1;
console.assert(sa.selectedIndex === 1 && sa.selected === 1);
console.log(sa.selectedIndex , sa.selected, sa.join(','));
sa.move(1,3)
console.assert(sa.join(',') === '0,3,2,1,4');
console.log(sa.selectedIndex , sa.selected, sa.join(','));
sa.moveTo(0);
console.assert(sa.selectedIndex === 0 && sa.selected === 3);
console.assert(sa.join(',') === '3,0,2,1,4');
console.log(sa.selectedIndex , sa.selected, sa.join(','));
var r = sa.moveTo(7); //
console.assert(r === -1);
console.assert(sa.selectedIndex === 0 && sa.selected === 3);
console.assert(sa.join(',') === '3,0,2,1,4');
console.log(sa.selectedIndex , sa.selected, sa.join(','));
var r = sa.moveTo(4); //
console.assert(r === 4);
console.assert(sa.selectedIndex === 4 && sa.selected === 3);
console.assert(sa.join(',') === '4,0,2,1,3');
console.log(sa.selectedIndex , sa.selected, sa.join(','));
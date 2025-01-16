import LimitedStackArray from "../../wc/lib/LimitedStackArray.js";

let r = null;
let lsa = null;
lsa = new LimitedStackArray(3)
lsa.push(0);console.assert(lsa.join(',')==='0', JSON.stringify(lsa))
lsa.push(1);console.assert(lsa.join(',')==='0,1', JSON.stringify(lsa))
lsa.push(2);console.assert(lsa.join(',')==='0,1,2', JSON.stringify(lsa))
lsa.push(3);console.assert(lsa.join(',')==='1,2,3', JSON.stringify(lsa))
r = lsa.pop();console.assert(lsa.join(',')==='1,2' && r === 3, JSON.stringify(lsa))
r = lsa.pop();console.assert(lsa.join(',')==='1' && r === 2, JSON.stringify(lsa))
r = lsa.pop();console.assert(lsa.join(',')==='' && r === 1, JSON.stringify(lsa))
r = lsa.pop();console.assert(lsa.join(',')==='' && r === undefined, JSON.stringify(lsa))

lsa.push(4,5,6,7,8,9);console.assert(lsa.join(',')==='7,8,9', JSON.stringify(lsa))

lsa = new LimitedStackArray(3,1,2,3,4,5,6);
console.log('toJSON',JSON.stringify(lsa))
lsa = new LimitedStackArray(3);
console.log('toJSON',JSON.stringify(lsa))
lsa = LimitedStackArray.from(3,[1,2,3,4,5,6])
console.log('toJSON',JSON.stringify(lsa))
lsa = LimitedStackArray.from(3,[])
console.log('toJSON',JSON.stringify(lsa))

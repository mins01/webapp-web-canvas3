import LimitedQueueArray from "../../wc/lib/LimitedQueueArray.js";

let r = null;
let lqa = null;
lqa = new LimitedQueueArray(3)
lqa.push(0);console.assert(lqa.join(',')==='0', JSON.stringify(lqa))
lqa.push(1);console.assert(lqa.join(',')==='0,1', JSON.stringify(lqa))
lqa.push(2);console.assert(lqa.join(',')==='0,1,2', JSON.stringify(lqa))
lqa.push(3);console.assert(lqa.join(',')==='1,2,3', JSON.stringify(lqa))
r = lqa.pop();console.assert(lqa.join(',')==='1,2' && r === 3, JSON.stringify(lqa))
r = lqa.pop();console.assert(lqa.join(',')==='1' && r === 2, JSON.stringify(lqa))
r = lqa.pop();console.assert(lqa.join(',')==='' && r === 1, JSON.stringify(lqa))
r = lqa.pop();console.assert(lqa.join(',')==='' && r === undefined, JSON.stringify(lqa))

lqa.push(4,5,6,7,8,9);console.assert(lqa.join(',')==='7,8,9', JSON.stringify(lqa))

lqa = new LimitedQueueArray(3,1,2,3,4,5,6);
console.log('toJSON',JSON.stringify(lqa))
lqa = new LimitedQueueArray(3);
console.log('toJSON',JSON.stringify(lqa))
lqa = LimitedQueueArray.from(3,[1,2,3,4,5,6])
console.log('toJSON',JSON.stringify(lqa))
lqa = LimitedQueueArray.from(3,[])
console.log('toJSON',JSON.stringify(lqa))
try{
    lqa = new LimitedQueueArray(0)
    console.log('toJSON',JSON.stringify(lqa))
}catch(e){
    console.error(e.message);
}

import LimitedHistory from "../../wc/lib/LimitedHistory.js";

let r = null;
let lh = null;
lh = new LimitedHistory(3)
lh.save(0);console.assert(lh.current()=== 0 , 'current:'+lh.current()+' , '+JSON.stringify(lh))
lh.save(1);console.assert(lh.current()=== 1 , 'current:'+lh.current()+' , '+JSON.stringify(lh))
lh.save(2);console.assert(lh.current()=== 2 , 'current:'+lh.current()+' , '+JSON.stringify(lh))
lh.save(3);console.assert(lh.current()=== 3 , 'current:'+lh.current()+' , '+JSON.stringify(lh))
lh.save(4);console.assert(lh.current()=== 4 , 'current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.undo();console.assert(r=== 3 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.undo();console.assert(r=== 2 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.undo();console.assert(r=== null , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.current();console.assert(r=== 2 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.redo();console.assert(r=== 3 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.redo();console.assert(r=== 4 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.redo();console.assert(r=== null , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.all();console.assert(r.join(',')=== '2,3,4' , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))
r=lh.length;console.assert(r=== 3 , 'r:'+r+' , current:'+lh.current()+' , '+JSON.stringify(lh))


console.log('LAST: ','current:'+lh.current()+' , '+JSON.stringify(lh));

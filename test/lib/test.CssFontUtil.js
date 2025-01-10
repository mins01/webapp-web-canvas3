import CssFontUtil from "../../wc/lib/CssFontUtil.js";


let v,v1, r;


v = 'italic extra-condensed small-caps bold 24.559239px/1.5 sans-serif , x , y , "한글"';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));
v = 'oblique extra-condensed small-caps bold 24px/150% sans-serif , x , y , "한글"';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));
v = 'oblique 40deg extra-condensed small-caps 999 24px/1 sans-serif , x , y , "한글"';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));
v = 'oblique 40rad extra-condensed small-caps bold 24px/1 sans-serif , x , y , "한글"';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));
v = '700    24px sans-serif';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));

v = '24px';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));

v = 'sans-serif, xm, y ,"xc"';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));

v = null;
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));
v = '';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));

v = ' x,y,y';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));

v = '10px sans-serif';
r = CssFontUtil.parse(v); 
console.log('v:',v);
console.log('r:',JSON.stringify(r));



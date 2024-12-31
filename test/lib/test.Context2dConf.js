
import Context2dConf from "../../wc/lib/Context2dConf.js"


let v,r;
let ctxConf = new Context2dConf();
v = "small-caps bold 24px/1.5 sans-serif";
r = Context2dConf.parseFont(v); console.log(r)

ctxConf.font = v;
console.log(ctxConf.font);
console.log(ctxConf.lineHeight);
console.log(ctxConf.fontSize);
console.log(ctxConf.lineHeightPx);
console.log(ctxConf.fontSizePx);

ctxConf.fontSize = '30px';
console.log(ctxConf.font);
console.log(ctxConf.lineHeight);
console.log(ctxConf.fontSize);
console.log(ctxConf.lineHeightPx);
console.log(ctxConf.fontSizePx);
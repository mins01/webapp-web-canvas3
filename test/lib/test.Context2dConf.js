
import Context2dConfig from "../../wc/lib/Context2dConfig.js"


let v,r;
let contextConfig = new Context2dConfig();
v = "small-caps bold 24px/1.5 sans-serif";
r = Context2dConfig.parseFont(v); console.log(r)

contextConfig.font = v;
console.log(contextConfig.font);
console.log(contextConfig.lineHeight);
console.log(contextConfig.fontSize);
console.log(contextConfig.lineHeightPx);
console.log(contextConfig.fontSizePx);

contextConfig.fontSize = '30px';
console.log(contextConfig.font);
console.log(contextConfig.lineHeight);
console.log(contextConfig.fontSize);
console.log(contextConfig.lineHeightPx);
console.log(contextConfig.fontSizePx);
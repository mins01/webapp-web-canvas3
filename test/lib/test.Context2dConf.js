
import Context2dConfig from "../../wc/lib/Context2dConfig.js"


let v,r;
let contextConfig = new Context2dConfig();
console.log(contextConfig.font);
v = "small-caps  bold 24px/1.5 sans-serif";
contextConfig.font = v;
console.log(contextConfig.font);
contextConfig.fontSize = '30px';
console.log(contextConfig.font);
contextConfig.fontStyle = "italic";
contextConfig.fontVariant = "";
contextConfig.fontStretch = "extra-condensed";
contextConfig.fontWeight = "900";
console.log(contextConfig.font);


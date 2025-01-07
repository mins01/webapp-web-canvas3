import CssLengthUtil from "../../wc/lib/CssLengthUtil.js";


let v,v1, r;


v = null;
r = CssLengthUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "";
r = CssLengthUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));

v = "999.99";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "px";
r = CssLengthUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99px";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'px' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99em";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'em' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99pc";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'pc' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99%";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === '%' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99  %  ";
r = CssLengthUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === '  %  ' , JSON.stringify(v)+"=>"+JSON.stringify(r));


v = ""; v1=""
r = CssLengthUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === null , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99"; v1="14px"
r = CssLengthUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99em"; v1="14px"
r = CssLengthUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99%"; v1="14px"
r = CssLengthUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '139.9986px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99em"; v1="14pt"
r = CssLengthUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86pt' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));


v = "1cm";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 37.795275591 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1mm";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 3.7795275591 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1Q";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 0.09375 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1in";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 96 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1pc";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 16 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1pt";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 1.3333 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1px";
r = CssLengthUtil.convertToPx(v,v1);  console.assert(r === 1 , JSON.stringify(v)+"=>"+JSON.stringify(r));

import CssSizeUtil from "../../wc/lib/CssSizeUtil.js";


let v,v1, r;


v = null;
r = CssSizeUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "";
r = CssSizeUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));

v = "999.99";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "px";
r = CssSizeUtil.parse(v); console.assert(r?.number === null && r?.unit === null , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99px";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'px' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99em";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'em' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99pc";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === 'pc' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99%";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === '%' , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "999.99  %  ";
r = CssSizeUtil.parse(v); console.assert(r?.number == 999.99 && r?.unit === '  %  ' , JSON.stringify(v)+"=>"+JSON.stringify(r));


v = ""; v1=""
r = CssSizeUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === null , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99"; v1="14px"
r = CssSizeUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99em"; v1="14px"
r = CssSizeUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99%"; v1="14px"
r = CssSizeUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '139.9986px' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));
v = "999.99em"; v1="14pt"
r = CssSizeUtil.sizeBasedOnFontSize(v,v1);  console.assert(r === '13999.86pt' , JSON.stringify(v)+","+JSON.stringify(v1)+"=>"+JSON.stringify(r));


v = "1cm";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 37.795275591 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1mm";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 3.7795275591 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1Q";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 0.09375 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1in";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 96 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1pc";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 16 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1pt";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 1.3333 , JSON.stringify(v)+"=>"+JSON.stringify(r));
v = "1px";
r = CssSizeUtil.convertToPx(v,v1);  console.assert(r === 1 , JSON.stringify(v)+"=>"+JSON.stringify(r));

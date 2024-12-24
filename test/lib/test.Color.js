import Color from "../../wc/lib/Color.js";

let s = '', c = null;
s = '#123'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#z23'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#000'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#999'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#AAA'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#fff'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));

s = '#1234'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#z234'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#0000'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#9999'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAA'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#ffff'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));

s = '#123456'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#z23456'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#000000'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#999999'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAAAA'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#ffffff'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));

s = '#12345678'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#z2345678'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#00000000'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#99999999'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAAAAAA'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));
s = '#ffffffff'; c = Color.parseHex(s); console.log(s,c,c?.r?.toString(16));



s = '#123'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#z23'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#000'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#999'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#AAA'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#fff'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));

s = '#1234'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#z234'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#0000'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#9999'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAA'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#ffff'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));

s = '#123456'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#z23456'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#000000'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#999999'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAAAA'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#ffffff'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));

s = '#12345678'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#z2345678'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#00000000'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#99999999'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#AAAAAAAA'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));
s = '#ffffffff'; c = Color.parse(s); console.log(s,c,c?.r?.toString(16));

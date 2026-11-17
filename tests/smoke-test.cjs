// Run with: node tests/smoke-test.cjs
// No external dependencies. Tests source syntax and cart DOM logic with mocks.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const path = require("node:path");
const root = path.join(__dirname,"..");
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const javascript = [
  "script/cart.js","script/script.js","script/sauvage.js",
  "script/backstage_product.js","script/backstage_member.js",
  "script/all.js","script/user.js"
];
for(const file of javascript){
  new vm.Script(read(file),{filename:file});
}
console.log("PASS JavaScript syntax: "+javascript.length+" files");
const row=(price,quantity)=>{
  const input={value:quantity,min:"",step:""};
  const priceNode={textContent:price};
  const item={
    querySelector(selector){return selector===".price-style"?priceNode:selector===".input-style"?input:null;},
    parentElement:{remove(){item.removed=true;}}
  };
  return {item,input};
};
const a=row("$3,790",2),b=row("$1,000",1);
let items=[a.item,b.item];
const total={textContent:""},checkout={disabled:false,addEventListener(type,cb){this.click=cb;}};
const cart={
 querySelectorAll(sel){return sel===".img-style"?items:sel===".input-style"?[a.input,b.input]:[];},
 addEventListener(type,cb){this[type]=cb;}
};
const ctx={
 document:{querySelector(s){return ({".cardleft":cart,".totalprice-style":total,".buy-btn":checkout})[s]||null;}},
 window:{},console,alert(){}
};
vm.runInNewContext(read("script/cart.js"),ctx);
assert.equal(total.textContent,"$8,580");
assert.equal(checkout.disabled,false);
a.input.value=0;cart.change({target:{matches:x=>x===".input-style"}});
assert.equal(a.input.value,1);
assert.equal(total.textContent,"$4,790");
items=[];cart.change({target:{matches:x=>x===".input-style"}});
assert.equal(checkout.disabled,true);
console.log("PASS Cart totals, invalid quantities and empty cart");
for(const file of ["backstage_product.html","backstage_member.html"]){
 const html=read(file);
 assert.match(html,/onclick="changeBtn\(this\)"/);
 assert.match(html,/onclick="deleteBtn\(this\)"/);
}
assert.match(read("user.html"),/尚未連接會員系統/);
assert.match(read("cart.html"),/不會產生真實訂單或付款/);
for(const file of ["index.html","cart.html","user.html"]){
  assert.match(read(file),/css\/responsive-polish.css/);
}
console.log("PASS Admin controls, disclosure and responsive styles");

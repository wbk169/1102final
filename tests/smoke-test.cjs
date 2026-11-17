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
assert.match(read("user.html"),/登入及註冊功能尚未開放/);
assert.match(read("cart.html"),/id="shop-cart-checkout"/);
for(const file of ["index.html","cart.html","user.html"]){
  assert.match(read(file),/css\/responsive-polish.css/);
}
console.log("PASS Admin controls, disclosure and responsive styles");

// Demo catalog smoke checks: syntax, product records, local storage behavior.
new vm.Script(read("script/shop-demo.js"), {filename:"script/shop-demo.js"});
const store=new Map();
const storage={
 getItem:key=>store.get(key)||null,
 setItem:(key,value)=>store.set(key,value)
};
let readyCallback;
const demoDocument={
 addEventListener(name,callback){if(name==="DOMContentLoaded")readyCallback=callback;},
 querySelectorAll(){return [];},
 getElementById(){return null;}
};
const demoContext={
 document:demoDocument,
 localStorage:storage,
 location:{pathname:"/1102final/product1.html",search:"",href:""},
 URLSearchParams,console,alert(){}
};
vm.runInNewContext(read("script/shop-demo.js"),demoContext);
assert.equal(typeof readyCallback,"function");
readyCallback();
assert.equal(demoContext.PFDiorShop.catalog.length,12);
assert.equal(demoContext.PFDiorShop.add(1),true);
assert.equal(JSON.parse(store.get("pf-dior-demo-cart-v1"))["1"],1);
demoContext.PFDiorShop.setQty(1,3);
assert.equal(JSON.parse(store.get("pf-dior-demo-cart-v1"))["1"],3);
demoContext.PFDiorShop.setQty(1,0);
assert.equal(Object.keys(JSON.parse(store.get("pf-dior-demo-cart-v1"))).length,0);
for(const file of ["search.html","favorites.html","cart.html","product1.html","product12.html"]){
 assert.match(read(file),/script\/shop-demo\.js/);
}
console.log("PASS Catalog, local-cart persistence and page integrations");

/* Global navigation, profile sanitization, and public file hygiene */
for(const file of ["script/site-nav.js","script/member.js"]){
  new vm.Script(read(file), {filename:file});
}
const htmlPages=fs.readdirSync(root).filter(file=>file.endsWith(".html"));
assert.equal(htmlPages.length,26,"Expected 26 storefront pages");
for(const file of htmlPages){
  const html=read(file);
  assert.match(html,/script\/site-nav\.js/,file+" should include the shared navigation");
  assert.match(html,/css\/site-nav\.css/,file+" should include shared navigation styles");
}
assert.match(read("script/site-nav.js"),/favorites\.html/);
assert.match(read("script/site-nav.js"),/cart\.html/);
assert.match(read("script/site-nav.js"),/search\.html/);
assert.doesNotMatch(read("backstage_member.html"),/123123123123123|20200222@gmail\.com|金泰亨/);
assert.doesNotMatch(read("member.html"),/xiaoming@gmail\.com|0912345678/);
assert.equal(fs.readdirSync(path.join(root,"picture")).some(file=>file.endsWith(".doc")),false);
console.log("PASS Shared navigation on "+htmlPages.length+" pages, member placeholders and file hygiene");

// PF. DIOR course project: browser-only shopping, favorites and catalog search.
// Demo data is saved only in this browser; no server or payment processing.
(() => {
  "use strict";
  const catalog = [{"id":1,"name":"Sauvage Elixir","price":3790,"image":"picture/product1-4.jpg","url":"product1.html"},{"id":2,"name":"Sauvage Parfum","price":3580,"image":"picture/product2-1.jpg","url":"product2.html"},{"id":3,"name":"Sauvage SPRAY","price":2400,"image":"picture/product3-1.jpg","url":"product3.html"},{"id":4,"name":"DIOR HOMME SPORT","price":4980,"image":"picture/product4-3.jpg","url":"product4.html"},{"id":5,"name":"DIOR HOMME 淡香水","price":2900,"image":"picture/product5-1.jpg","url":"product5.html"},{"id":6,"name":"Dior Homme Cologne","price":4500,"image":"picture/product6-1.jpg","url":"product6.html"},{"id":7,"name":"J'ADORE極蘊香氛","price":3290,"image":"picture/product7-1.jpg","url":"product7.html"},{"id":8,"name":"J'ADORE","price":3490,"image":"picture/product8-1.jpg","url":"product8.html"},{"id":9,"name":"J'ADORE","price":8900,"image":"picture/product9-1.jpg","url":"product9.html"},{"id":10,"name":"Miss Dior Rose","price":6800,"image":"picture/product10-1.jpg","url":"product10.html"},{"id":11,"name":"Miss Dior Sexy","price":3000,"image":"picture/product11-1.jpg","url":"product11.html"},{"id":12,"name":"MISS DIOR親吻香氛","price":4500,"image":"picture/product12-1.jpg","url":"product12.html"}];
  const keyCart="pf-dior-demo-cart-v1",keyFav="pf-dior-demo-favorites-v1";
  const find=id=>catalog.find(p=>p.id===Number(id));
  const read=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value&&typeof value==="object"?value:fallback;}catch{return fallback;}};
  const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{alert("瀏覽器無法儲存資料，請確認不是封鎖本機儲存的模式。");return false;}};
  const cart=()=>read(keyCart,{});
  const favorites=()=>read(keyFav,[]);
  const price=n=>"NT$ "+n.toLocaleString("zh-TW");
  const getId=()=>{const m=location.pathname.match(/product(\d+)\.html$/i);return m?Number(m[1]):null;};
  function badge(){
    document.querySelectorAll('[data-shop-cart-link]').forEach(link=>{
      const count=Object.values(cart()).reduce((a,n)=>a+Number(n||0),0);
      link.setAttribute("aria-label","購物車，目前 "+count+" 件商品");
      link.setAttribute("title","購物車："+count+" 件商品");
    });
  }
  function add(id,amount=1){
    if(!find(id))return false;
    const current=cart();
    current[id]=Math.min(99,Math.max(0,Number(current[id])||0)+amount);
    if(save(keyCart,current)){badge();return true;}return false;
  }
  function setQty(id,quantity){
    const current=cart(),n=Math.floor(Number(quantity));
    if(n>0)current[id]=Math.min(99,n);else delete current[id];
    save(keyCart,current);badge();
  }
  function toggleFavorite(id){
    if(!find(id))return;
    let list=favorites();
    list=list.includes(id)?list.filter(x=>x!==id):[...list,id];
    save(keyFav,list);
    updateFavoriteButtons();
  }
  function updateFavoriteButtons(){
    const list=favorites();
    document.querySelectorAll("[data-shop-favorite-product]").forEach(button=>{
      const active=list.includes(Number(button.dataset.shopFavoriteProduct));
      button.textContent=active?"♥ 已收藏":"♡ 收藏商品";
      button.setAttribute("aria-pressed",String(active));
    });
  }
  function setupNav(){
    document.querySelectorAll("form#means").forEach(form=>{
      const search=form.querySelector('input[type="search"]');
      if(search){search.name="q";search.placeholder="搜尋香水名稱";search.setAttribute("aria-label","搜尋商品");}
      form.setAttribute("action","search.html");form.setAttribute("method","get");
      form.addEventListener("submit",event=>{
        event.preventDefault();
        const value=(search?.value||"").trim();
        location.href="search.html"+(value?"?q="+encodeURIComponent(value):"");
      });
      // Existing heart and cart icons are navigation links, not current-product actions.
      form.querySelectorAll("a").forEach(link=>{
        if(link.querySelector(".fa-heart")){
          link.href="favorites.html";link.title="我的收藏";link.setAttribute("aria-label","查看我的收藏");
        }else if(link.querySelector(".fa-shopping-cart")){
          link.href="cart.html";link.dataset.shopCartLink="";link.title="購物車";
        }
      });
    });
    badge();
  }
  function notify(message){
    let region=document.getElementById("pf-shop-status");
    if(!region){
      region=document.createElement("div");
      region.id="pf-shop-status";
      region.setAttribute("role","status");
      region.setAttribute("aria-live","polite");
      document.body.appendChild(region);
    }
    region.textContent=message;
    region.classList.add("is-visible");
    window.clearTimeout(notify.timer);
    notify.timer=window.setTimeout(()=>region.classList.remove("is-visible"),2400);
  }
  function categoryProductButtons(){
    document.addEventListener("click",event=>{
      const button=event.target.closest(".gallery .card .overlay button");
      if(!button)return;
      const card=button.closest(".card");
      const productLink=card?.querySelector('a[href*="product"]');
      const matched=productLink?.getAttribute("href")?.match(/product(\\d+)\\.html/i);
      const id=matched?Number(matched[1]):null;
      const product=find(id);
      if(!product)return;
      event.preventDefault();
      if(button.querySelector(".fa-cart-plus") || /add to cart|加入購物車/i.test(button.textContent)){
        if(add(id))notify("已加入購物車："+product.name);
      }else if(button.querySelector(".fa-heart")){
        toggleFavorite(id);
        const saved=favorites().includes(id);
        button.setAttribute("aria-pressed",String(saved));
        button.setAttribute("aria-label",saved?"移除收藏":"收藏商品");
        button.title=saved?"已收藏":"收藏商品";
        notify(saved?"已加入收藏："+product.name:"已移除收藏："+product.name);
      }
    });
  }
  function productButtons(){
    const id=getId(),product=find(id);
    if(!product)return;
    document.getElementById("bagBtn")?.addEventListener("click",()=>{
      if(add(id))notify("已加入購物車："+product.name);
    });
    const bag=document.getElementById("bagBtn");
    if(bag&&!document.getElementById("favoriteProductButton")){
      const button=document.createElement("button");
      button.id="favoriteProductButton";
      button.type="button";
      button.className="btn btn-outline-dark mt-2";
      button.dataset.shopFavoriteProduct=String(id);
      button.addEventListener("click",()=>{toggleFavorite(id);notify(favorites().includes(id)?"已加入收藏："+product.name:"已移除收藏："+product.name);});
      bag.insertAdjacentElement("afterend",button);
    }
    updateFavoriteButtons();
  }
  function card(product,withRemove=false){
    const article=document.createElement("article");
    article.className="shop-product-card";
    const a=document.createElement("a");a.href=product.url;
    const img=document.createElement("img");img.src=product.image;img.alt=product.name;img.loading="lazy";
    const title=document.createElement("h3");title.textContent=product.name;
    a.append(img,title);
    const p=document.createElement("p");p.textContent=price(product.price);
    article.append(a,p);
    const action=document.createElement("button");action.type="button";action.textContent=withRemove?"移除收藏":"加入購物車";
    action.addEventListener("click",()=>{
      if(withRemove){toggleFavorite(product.id);render();}else if(add(product.id)){action.textContent="已加入 ✓";setTimeout(()=>action.textContent="加入購物車",1200);}
    });
    article.appendChild(action);return article;
  }
  function render(){
    const target=document.getElementById("shop-results");
    if(!target)return;
    target.replaceChildren();
    let selected=[],message="";
    const type=document.body.dataset.shopPage;
    if(type==="favorites"){
      selected=favorites().map(find).filter(Boolean);message="我的收藏";
    }else{
      const q=(new URLSearchParams(location.search).get("q")||"").trim();
      const normalized=q.toLocaleLowerCase();
      selected=q?catalog.filter(p=>(p.name+" "+p.url).toLocaleLowerCase().includes(normalized)):catalog;
      message=q?'搜尋「'+q+'」的結果':'全部商品';
      const input=document.getElementById("shop-page-search");if(input)input.value=q;
    }
    const title=document.getElementById("shop-page-title");
    if(title)title.textContent=message+" · "+selected.length+" 件";
    if(!selected.length){const p=document.createElement("p");p.textContent=type==="favorites"?"目前沒有收藏商品。可到商品頁點擊「收藏商品」。":"找不到符合條件的商品，請嘗試其他名稱。";target.appendChild(p);return;}
    selected.forEach(product=>target.appendChild(card(product,type==="favorites")));
  }
  function renderCart(){
    const target=document.getElementById("shop-cart-items");
    if(!target)return;
    const summary=document.getElementById("shop-cart-total");
    const checkout=document.getElementById("shop-cart-checkout");
    const state=cart();target.replaceChildren();
    let total=0,valid=0;
    for(const [id,value] of Object.entries(state)){
      const product=find(id),quantity=Math.min(99,Math.max(0,Math.floor(Number(value)||0)));
      if(!product||!quantity)continue;
      valid++;total+=product.price*quantity;
      const row=document.createElement("article");row.className="shop-cart-row";
      const a=document.createElement("a");a.href=product.url;
      const img=document.createElement("img");img.src=product.image;img.alt=product.name;img.loading="lazy";
      const title=document.createElement("strong");title.textContent=product.name;a.append(img,title);
      const info=document.createElement("div");info.className="shop-cart-actions";
      const priceNode=document.createElement("span");priceNode.textContent=price(product.price);
      const input=document.createElement("input");input.type="number";input.min="1";input.max="99";input.step="1";input.value=quantity;input.setAttribute("aria-label",product.name+"數量");
      input.addEventListener("change",()=>{setQty(id,input.value);renderCart();});
      const remove=document.createElement("button");remove.type="button";remove.textContent="移除";
      remove.addEventListener("click",()=>{setQty(id,0);renderCart();});
      info.append(priceNode,input,remove);row.append(a,info);target.appendChild(row);
    }
    if(!valid){let p=document.createElement("p");p.textContent="購物車目前沒有商品。";target.appendChild(p);}
    if(summary)summary.textContent=price(total);
    if(checkout)checkout.disabled=!valid;
    badge();
  }
  function initialize(){
    setupNav();productButtons();categoryProductButtons();render();renderCart();
    document.getElementById("shop-cart-checkout")?.addEventListener("click",()=>{
      if(Object.values(cart()).some(n=>Number(n)>0)) alert("結帳功能尚未開放。");
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize,{once:true});
  else initialize();
  window.PFDiorShop={catalog,cart,favorites,add,setQty,renderCart};
})();

// Consistent header shared across every page, including legacy product pages.
(() => {
 "use strict";
 function install(){
  const body=document.body;
  if(!body)return;
  const old=document.querySelector("body > header");
  const header=document.createElement("header");
  header.className="pf-site-header";
  header.setAttribute("role","banner");
  header.innerHTML=`<div class="pf-nav-wrap">
    <a class="pf-logo" href="index.html" aria-label="PF. DIOR 首頁">PF. DIOR</a>
    <button class="pf-nav-toggle" type="button" aria-expanded="false" aria-controls="pf-nav-links" aria-label="展開導覽">☰ 選單</button>
    <nav id="pf-nav-links" class="pf-nav-links" aria-label="主要導覽">
      <a href="index.html">首頁</a><a href="sauvage.html">男士香氛</a>
      <a href="Jadore.html">女士香氛</a><a href="allproduct.html">香氛介紹</a>
      <a href="about_us.html">關於我們</a>
    </nav>
    <div class="pf-nav-icons">
      <a href="favorites.html" aria-label="我的收藏">♡ 收藏</a>
      <a href="cart.html" data-shop-cart-link aria-label="購物車">購物車</a>
      <a href="user.html" aria-label="會員登入">會員</a>
    </div>
    <form class="pf-nav-search" action="search.html" method="get" role="search">
      <input type="search" name="q" placeholder="搜尋香水名稱" aria-label="搜尋香水名稱">
      <button type="submit">搜尋</button>
    </form>
  </div>`;
  if(old)old.replaceWith(header);
  else body.insertBefore(header,body.firstChild);
  const button=header.querySelector(".pf-nav-toggle"),nav=header.querySelector(".pf-nav-links");
  button.addEventListener("click",()=>{
    const open=nav.dataset.open!=="true";
    nav.dataset.open=String(open);button.setAttribute("aria-expanded",String(open));
  });
  header.querySelectorAll(".pf-nav-links a").forEach(a=>a.addEventListener("click",()=>{
    nav.dataset.open="false";button.setAttribute("aria-expanded","false");
  }));
  if(window.PFDiorShop && typeof window.PFDiorShop.cart==="function"){
   const count=Object.values(window.PFDiorShop.cart()).reduce((sum,n)=>sum+(Number(n)||0),0);
   header.querySelector("[data-shop-cart-link]").setAttribute("aria-label","購物車："+count+" 件商品");
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);
 else install();
})();

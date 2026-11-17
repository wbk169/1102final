// UI-only shopping cart. The demo does not create real orders.
const cart = document.querySelector(".cardleft");
const total = document.querySelector(".totalprice-style");
const checkout = document.querySelector(".buy-btn");
function rows() { return cart ? [...cart.querySelectorAll(".img-style")] : []; }
function updateTotal() {
  let sum = 0;
  rows().forEach(row => {
    const price = Number((row.querySelector(".price-style")?.textContent || "0").replace(/[^0-9.]/g, ""));
    const input = row.querySelector(".input-style");
    if (!input) return;
    const quantity = Math.max(1, Math.floor(Number(input.value) || 1));
    input.value = quantity;
    sum += (Number.isFinite(price) ? price : 0) * quantity;
  });
  if (total) total.textContent = "$" + sum.toLocaleString("zh-TW");
  if (checkout) checkout.disabled = rows().length === 0;
}
if (cart) {
  cart.addEventListener("click", e => {
    if (!e.target.closest(".cart-remove")) return;
    const row = e.target.closest(".img-style");
    if (row) (row.parentElement || row).remove();
    updateTotal();
  });
  cart.addEventListener("change", e => { if (e.target.matches(".input-style")) updateTotal(); });
  cart.querySelectorAll(".input-style").forEach(input => {input.min = "1";input.step = "1";});
}
if (checkout) checkout.addEventListener("click", () => {
  if (rows().length) alert("結帳功能尚未開放。");
});
updateTotal();
const backButton = document.querySelector("#back-to-top-btn");
if (backButton) {
  backButton.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
  function onScroll(){backButton.style.display = window.scrollY > 300 ? "block" : "none";}
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
}

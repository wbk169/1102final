// Defensive carousel and back-to-top handling.
document.querySelectorAll("[data-carousel-button]").forEach(button => {
  button.addEventListener("click", () => {
    const slides=button.closest("[data-carousel]")?.querySelector("[data-slides]");
    if (!slides || !slides.children.length) return;
    const active=slides.querySelector("[data-active]") || slides.children[0];
    const direction=button.dataset.carouselButton==="next" ? 1 : -1;
    const index=[...slides.children].indexOf(active);
    delete active.dataset.active;
    slides.children[(index+direction+slides.children.length)%slides.children.length].dataset.active="true";
  });
});
const automatic=document.getElementById("button_carousel");
if(automatic) window.setInterval(()=>{if(!document.hidden) automatic.click();},5000);
const backButton=document.getElementById("back-to-top-btn");
if(backButton){
  backButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  function update(){backButton.style.display=window.scrollY>300?"block":"none";}
  window.addEventListener("scroll",update,{passive:true});update();
}

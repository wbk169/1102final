// Client-side member profile editor. Does not submit data to a server.
document.addEventListener("DOMContentLoaded", () => {
  const form=document.querySelector("form.edit_pos");
  if(!form)return;
  const tableCells=[...document.querySelectorAll(".b table td")];
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values=new FormData(form);
    const set=(index,value)=>{if(tableCells[index]&&value)tableCells[index].textContent=value};
    set(0,String(values.get("member")||"").trim());
    set(1,String(values.get("selectdate")||"").trim());
    set(2,String(values.get("email")||"").trim());
    const gender=values.get("gender");
    set(3,gender==="male"?"男":gender==="female"?"女":"");
    set(4,String(values.get("phone")||"").trim());
    set(5,String(values.get("address")||"").trim());
    const button=form.querySelector('button[type="submit"], button.btn');
    if(button){button.textContent="已更新";window.setTimeout(()=>button.textContent="更改",1600);}
  });
});

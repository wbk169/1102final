// Demo UI only; data changes are not persisted.
const container=document.getElementById("goodsFormBox");
const fieldSelector=".goodsName, .goodsImgName1, .goodsImgName2, .goodsPrice, .goodsStock";
function initBtn(){
 if(!container)return;
 const template=container.querySelector(".goodsFormRow");
 if(!template)return;
 const row=template.cloneNode(true);
 row.removeAttribute("id");
 row.querySelectorAll("[id]").forEach(el=>el.removeAttribute("id"));
 row.querySelectorAll("input").forEach(input=>{input.value="";input.disabled=false;});
 container.appendChild(row);
}
function deleteBtn(button){
 const row=button.closest(".goodsFormRow");
 if(row)row.remove();
}
function changeBtn(button){
 const row=button.closest(".goodsFormRow");
 if(!row)return;
 const fields=[...row.querySelectorAll(fieldSelector)];
 const unlock=fields.some(input=>input.disabled);
 fields.forEach(input=>input.disabled=!unlock);
}
if(container)container.querySelectorAll(fieldSelector).forEach(input=>input.disabled=true);

const WHATSAPP_NUMBER = "201000000000";
const cart = new Map();
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => `${n.toLocaleString("en-US")} EGP`;

$("#menuButton").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$$(".header nav a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
$$(".filter").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter").forEach(f => f.classList.toggle("active", f === btn));
  $$(".product").forEach(p => p.hidden = btn.dataset.filter !== "all" && p.dataset.category !== btn.dataset.filter);
}));
function showToast(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("show");
  clearTimeout(window.atharToast); window.atharToast = setTimeout(() => t.classList.remove("show"), 2500);
}
function addProduct(card) {
  const id = card.dataset.id;
  if (cart.has(id)) cart.get(id).qty++;
  else cart.set(id, {id, name:card.dataset.name, price:Number(card.dataset.price), image:card.dataset.image, qty:1});
  renderCart(); showToast("اتضافت القطعة لحقيبتك");
}
$$(".add-to-cart").forEach(b => b.addEventListener("click", () => addProduct(b.closest(".product"))));
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderCart() {
  const items = [...cart.values()], count = items.reduce((s,i)=>s+i.qty,0), total = items.reduce((s,i)=>s+i.price*i.qty,0);
  $("#cartCount").textContent = count; $("#cartTitleCount").textContent = `(${count})`; $("#cartSubtotal").textContent = money(total);
  if (!items.length) { $("#cartItems").innerHTML = '<p class="empty">الحقيبة لسه فاضية.</p>'; return; }
  $("#cartItems").innerHTML = items.map(i=>`<div class="cart-item"><img src="${i.image}" alt=""><div><h3>${esc(i.name)}</h3><p>${money(i.price)}</p><div class="qty-controls"><button data-qty="-1" data-id="${i.id}">−</button><span>${i.qty}</span><button data-qty="1" data-id="${i.id}">+</button></div><button class="remove" data-remove="${i.id}">حذف</button></div><strong>${money(i.price*i.qty)}</strong></div>`).join("");
  $$("[data-qty]",$("#cartItems")).forEach(b=>b.addEventListener("click",()=>{const i=cart.get(b.dataset.id);i.qty+=Number(b.dataset.qty);if(i.qty<1)cart.delete(i.id);renderCart()}));
  $$("[data-remove]",$("#cartItems")).forEach(b=>b.addEventListener("click",()=>{cart.delete(b.dataset.remove);renderCart()}));
}
function openCart(){ $("#scrim").classList.add("open");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("lock"); }
function closeCart(){ $("#scrim").classList.remove("open");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("lock"); }
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#scrim").addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("#checkoutBtn").addEventListener("click",()=>{
 if(!cart.size)return showToast("ضيف قطعة للحقيبة الأول");
 if(WHATSAPP_NUMBER==="201000000000")return showToast("غيّر رقم واتساب المتجر داخل script.js");
 const items=[...cart.values()],total=items.reduce((s,i)=>s+i.price*i.qty,0);
 const lines=items.map(i=>`• ${i.name} × ${i.qty} = ${money(i.price*i.qty)}`);
 const msg=`أهلًا ATHAR، حابب أأكد الطلب:\n${lines.join("\n")}\nالإجمالي: ${money(total)}\nالاسم:\nالعنوان:\nالمقاس/اللون:`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("نموذج تجريبي — يحتاج ربط بخدمة بريد");e.target.reset()});
$("#contactLink").addEventListener("click",e=>{e.preventDefault();showToast("أضف وسيلة التواصل الخاصة بالمتجر")});
renderCart();
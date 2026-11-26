(() => {
 const KEY="moodDeckKJV365Completed";
 const $=id=>document.getElementById(id);
 let plan;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const done=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}};
 function init(){
  fetch("../data/reading-plan-365.json").then(r=>r.json()).then(data=>{plan=data;render()}).catch(()=>{$("dayReadings").textContent="The reading schedule could not be loaded. Please refresh this page."});
  $("openDay").addEventListener("click",()=>showDay(+$("dayJump").value));
 }
 function render(){
  $("dayJump").innerHTML=plan.days.map(d=>`<option value="${d.day}">Day ${d.day}</option>`).join("");
  const today=Math.min(365,Math.max(1,Math.floor((Date.now()-new Date(new Date().getFullYear(),0,1))/86400000)+1));
  $("dayJump").value=String(today);showDay(today);
  const completed=done();const percent=Math.round(completed.length/365*100);
  $("planProgress").style.width=percent+"%";$("planCount").textContent=`${completed.length} of 365 days completed`;$("planPercent").textContent=percent+"%";
  $("dayGrid").innerHTML=plan.days.map(d=>`<button class="day-cell ${completed.includes(d.day)?"complete":""}" data-day="${d.day}"><span>${d.day}</span><small>${completed.includes(d.day)?"✓":"Day"}</small></button>`).join("");
  $("dayGrid").querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{const day=+b.dataset.day;$("dayJump").value=String(day);showDay(day)}));
 }
 function showDay(day){
  const item=plan.days[day-1];if(!item)return;
  const completed=done().includes(day);
  const links=item.readings.map(r=>`<a href="bible.html?book=${encodeURIComponent(r.book)}&chapter=${r.chapter}">${esc(r.book)} ${r.chapter} ↗</a>`).join("");
  $("todayReading").innerHTML=`<div><p class="eyebrow">DAY ${day} / 365</p><h3>${completed?"You've completed this day.":"Today's reading"}</h3><p class="muted">${item.readings.length} chapter${item.readings.length===1?"":"s"} to read</p></div><button class="btn ${completed?"light":""}" id="toggleComplete">${completed?"Mark as unread":"Mark day complete"}</button>`;
  $("dayReadings").innerHTML=links;
  $("toggleComplete").addEventListener("click",()=>{let list=done();list=completed?list.filter(x=>x!==day):[...list,day].sort((a,b)=>a-b);localStorage.setItem(KEY,JSON.stringify(list));render()});
  $("todayReading").scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 init();
})();
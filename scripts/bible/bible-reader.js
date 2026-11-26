(() => {
 const books=window.MOOD_DECK_BOOKS||[];
 const cacheKey="moodDeckKJVChapterCache", savedKey="moodDeckKJVBookmarks";
 const $=id=>document.getElementById(id);
 const bookSelect=$("bookSelect"), chapterSelect=$("chapterSelect");
 let currentBook=1,currentChapter=1,fontSize=19,currentVerses=[];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const cache=()=>{try{return JSON.parse(localStorage.getItem(cacheKey)||"{}")}catch{return {}}};
 const bookmarks=()=>{try{return JSON.parse(localStorage.getItem(savedKey)||"[]")}catch{return []}};
 const saveBookmarks=x=>localStorage.setItem(savedKey,JSON.stringify(x));
 const chapterKey=(b,c)=>`${b}-${c}`;
 function init(){
  bookSelect.innerHTML=books.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join("");
  bookSelect.addEventListener("change",()=>{currentBook=+bookSelect.value;fillChapters();});
  $("loadChapter").addEventListener("click",()=>loadChapter(+bookSelect.value,+chapterSelect.value));
  $("goReference").addEventListener("click",jumpReference);
  $("referenceSearch").addEventListener("keydown",e=>{if(e.key==="Enter")jumpReference()});
  $("openPsalm").addEventListener("click",()=>loadChapter(19,23));
  $("fontUp").addEventListener("click",()=>{fontSize=Math.min(27,fontSize+1);$("verseList").style.setProperty("--verse-size",fontSize+"px")});
  $("fontDown").addEventListener("click",()=>{fontSize=Math.max(15,fontSize-1);$("verseList").style.setProperty("--verse-size",fontSize+"px")});
  $("readAloud").addEventListener("click",readChapter);
  $("prevChapter").addEventListener("click",()=>step(-1));
  $("nextChapter").addEventListener("click",()=>step(1));
  currentBook=1;fillChapters();renderBookmarks();
  const q=new URLSearchParams(location.search), b=q.get("book"), c=+(q.get("chapter")||1);
  const found=books.find(x=>x.name.toLowerCase()===String(b||"").toLowerCase());
  loadChapter(found?.id||1,c);
 }
 function fillChapters(){
  const b=books.find(x=>x.id===currentBook)||books[0];
  chapterSelect.innerHTML=Array.from({length:b.chapters},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join("");
 }
 async function loadChapter(bookId,chapter){
  const book=books.find(x=>x.id===bookId); if(!book)return;
  currentBook=bookId;currentChapter=Math.max(1,Math.min(book.chapters,chapter));
  bookSelect.value=String(currentBook);fillChapters();chapterSelect.value=String(currentChapter);
  $("chapterHeading").textContent=`${book.name} ${currentChapter} · King James Version`;
  $("readerStatus").textContent="Opening Scripture…";$("verseList").innerHTML="";
  const key=chapterKey(bookId,currentChapter); let data=cache()[key];
  if(!data){
   try{
    // Static KJV chapter files with open CORS; no API key is required.
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),15000);
    let response;
    try{
     response=await fetch(`https://api.getbible.net/v3/kjv/${bookId}/${currentChapter}.json`,{signal:controller.signal,headers:{Accept:"application/json"}});
    }finally{clearTimeout(timeout)}
    if(!response.ok){
      let detail="";
      try{const problem=await response.json();detail=problem.detail||problem.title||problem.code||""}catch{}
      throw new Error(`Scripture request failed (HTTP ${response.status}${detail?`: ${detail}`:""}).`);
    }
    const payload=await response.json();
    if(Array.isArray(payload.verses)){
      data=Object.fromEntries(payload.verses.map(v=>[v.verse,v.text]));
    }else{
      data=payload.verses||payload.data?.verses||payload.data||payload;
      if(Array.isArray(data))data=Object.fromEntries(data.map(v=>[v.verse||v.number,v.text||v.t||""]));
    }
    if(!data||typeof data!=="object"||!Object.keys(data).length)throw new Error("The Bible source returned no verse data for this chapter.");
    const all=cache();all[key]=data;localStorage.setItem(cacheKey,JSON.stringify(all));
   }catch(error){
    const message=error?.name==="AbortError"?"The Scripture request took too long. Check your connection and try again.":error instanceof TypeError?"The chapter could not be reached. Check your internet connection, then try again.":error.message;
    $("readerStatus").textContent=`${message} Cached chapters remain available on this device.`;
    return;
   }
  }
  currentVerses=Object.entries(data).sort((a,b)=>Number(a[0])-Number(b[0])).map(([n,t])=>({number:Number(n),text:typeof t==="string"?t:(t.text||t.t||"")}));
  $("readerStatus").textContent=`${currentVerses.length} verses · ${book.testament} · KJV`;
  $("verseList").innerHTML=currentVerses.map(v=>`<p class="verse" data-verse="${v.number}"><button class="verse-number" title="Bookmark verse ${v.number}" data-bookmark="${v.number}">${v.number}</button><span>${esc(v.text)}</span></p>`).join("");
  $("verseList").style.setProperty("--verse-size",fontSize+"px");
  $("verseList").querySelectorAll("[data-bookmark]").forEach(btn=>{btn.addEventListener("click",()=>toggleBookmark(book.name,currentChapter,+btn.dataset.bookmark));if(bookmarks().some(x=>x.id===`${book.name} ${currentChapter}:${btn.dataset.bookmark}`))btn.classList.add("saved")});
  history.replaceState(null,"",`?book=${encodeURIComponent(book.name)}&chapter=${currentChapter}`);
 }
 function step(delta){
  let b=currentBook,c=currentChapter+delta,meta=books.find(x=>x.id===b);
  if(c>meta.chapters){if(b<66){b++;c=1}else return}
  if(c<1){if(b>1){b--;c=books[b-1].chapters}else return}
  loadChapter(b,c);
 }
 function jumpReference(){
  const input=$("referenceSearch").value.trim();
  const match=input.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
  if(!match){$("readerStatus").textContent="Enter a reference like John 3 or John 3:16.";return}
  const book=books.find(b=>b.name.toLowerCase()===match[1].toLowerCase());
  if(!book){$("readerStatus").textContent="I couldn't match that book name. Try its full name, such as 1 Corinthians.";return}
  loadChapter(book.id,+match[2]).then(()=>{
   if(match[3]){const verse=document.querySelector(`[data-verse="${+match[3]}"]`);verse?.scrollIntoView({behavior:"smooth",block:"center"});verse?.classList.add("verse-focus")}
  });
 }
 function toggleBookmark(book,chapter,verse){
  const all=bookmarks(),id=`${book} ${chapter}:${verse}`;
  const next=all.some(x=>x.id===id)?all.filter(x=>x.id!==id):[{id,book,chapter,verse},...all];
  saveBookmarks(next);renderBookmarks();
  const btn=document.querySelector(`[data-bookmark="${verse}"]`);if(btn)btn.classList.toggle("saved",next.some(x=>x.id===id));
 }
 function renderBookmarks(){
  const list=bookmarks();
  $("savedPassages").innerHTML=list.length?list.map(x=>`<button class="saved-link" data-open="${esc(x.book)}|${x.chapter}|${x.verse}">${esc(x.id)} ↗</button>`).join(""):"Your bookmarked verses will appear here.";
  $("savedPassages").querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{const [name,c,v]=b.dataset.open.split("|");const book=books.find(x=>x.name===name);if(book)loadChapter(book.id,+c).then(()=>document.querySelector(`[data-verse="${v}"]`)?.scrollIntoView({behavior:"smooth",block:"center"}))}));
 }
 function readChapter(){
  if(!currentVerses.length){$("readerStatus").textContent="Open a chapter before listening.";return}
  if(!("speechSynthesis" in window)){ $("readerStatus").textContent="Speech playback is not supported by this browser.";return}
  speechSynthesis.cancel();
  const text=currentVerses.map(v=>v.text).join(" ");
  const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.88;
  speechSynthesis.speak(utterance);
  $("readerStatus").textContent="Reading aloud using your device's available voice.";
 }
 init();
})();
/* Mood Deck Gallery — private, browser-local media memories. */
(()=>{
  const DB_NAME="moodDeckGallery", DB_VERSION=1, STORE="memories";
  const $=s=>document.querySelector(s);
  let dbPromise=null, records=[], activeFilter="all", objectUrls=[];
  const openDB=()=>{
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      if(!("indexedDB" in window)){reject(new Error("This browser does not support local media storage."));return;}
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE)){const store=db.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});store.createIndex("createdAt","createdAt");}};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||new Error("Could not open your gallery storage."));
    });
    return dbPromise;
  };
  const transaction=(mode,work)=>openDB().then(db=>new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);let result;
    try{result=work(store)}catch(error){reject(error);return;}
    tx.oncomplete=()=>resolve(result&&result.result!==undefined?result.result:result);
    tx.onerror=()=>reject(tx.error||new Error("Gallery storage failed."));
    tx.onabort=()=>reject(tx.error||new Error("Gallery save was cancelled."));
  }));
  const formatDate=value=>new Intl.DateTimeFormat(undefined,{day:"numeric",month:"short",year:"numeric"}).format(new Date(value));
  const escapeHTML=value=>String(value||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function cleanupUrls(){objectUrls.forEach(url=>URL.revokeObjectURL(url));objectUrls=[];}
  function makeUrl(blob){const url=URL.createObjectURL(blob);objectUrls.push(url);return url;}
  function toast(message){const el=$("#toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600);}
  async function load(){records=await transaction("readonly",store=>store.getAll());records.sort((a,b)=>b.createdAt-a.createdAt);}
  function render(){
    cleanupUrls();const grid=$("#galleryGrid"),count=$("#galleryCount");if(!grid)return;
    const shown=records.filter(item=>activeFilter==="all"||item.kind===activeFilter);
    count.textContent=`${records.length} ${records.length===1?"memory":"memories"} saved on this device`;
    if(!shown.length){grid.innerHTML=`<div class="gallery-empty panel"><span>▧</span><h3>${records.length?"Nothing in this filter yet.":"Your gallery is waiting."}</h3><p>${records.length?"Try another filter to see more of your memories.":"Add a photo or video of a moment you want to keep close."}</p></div>`;return;}
    grid.innerHTML=shown.map(item=>{
      const url=makeUrl(item.blob),media=item.kind==="video"?`<video src="${url}" muted playsinline preload="metadata"></video><span class="gallery-video-mark">▶ VIDEO</span>`:`<img src="${url}" alt="${escapeHTML(item.caption||"Saved memory")}" loading="lazy">`;
      return `<article class="gallery-memory" data-memory-id="${item.id}"><button class="gallery-media" type="button" data-preview="${item.id}" aria-label="Open ${item.kind} memory">${media}</button><div class="gallery-memory-info"><div><strong>${escapeHTML(item.caption||"A moment to remember")}</strong><small>${formatDate(item.createdAt)} · ${item.kind==="video"?"Video":"Photo"}</small></div><button class="gallery-delete" type="button" data-delete="${item.id}" aria-label="Delete memory">×</button></div></article>`;
    }).join("");
    grid.querySelectorAll("[data-preview]").forEach(button=>button.addEventListener("click",()=>openPreview(Number(button.dataset.preview))));
    grid.querySelectorAll("[data-delete]").forEach(button=>button.addEventListener("click",()=>deleteMemory(Number(button.dataset.delete))));
  }
  async function renderGallery(){try{await load();render();}catch(error){const grid=$("#galleryGrid");if(grid)grid.innerHTML=`<div class="gallery-empty panel"><h3>Gallery unavailable</h3><p>${escapeHTML(error.message)} Try a recent version of Chrome, Firefox, Safari or Edge.</p></div>`;}}
  function openPreview(id){const item=records.find(entry=>entry.id===id);if(!item)return;const url=URL.createObjectURL(item.blob);const media=item.kind==="video"?`<video src="${url}" controls autoplay playsinline></video>`:`<img src="${url}" alt="${escapeHTML(item.caption||"Saved memory")}">`;
    const overlay=document.createElement("div");overlay.className="gallery-lightbox";overlay.innerHTML=`<div class="gallery-lightbox-card"><button class="gallery-lightbox-close" aria-label="Close preview">×</button><div class="gallery-lightbox-media">${media}</div><div class="gallery-lightbox-caption"><strong>${escapeHTML(item.caption||"A moment to remember")}</strong><small>${formatDate(item.createdAt)}</small></div></div>`;
    document.body.append(overlay);const close=()=>{overlay.remove();URL.revokeObjectURL(url)};overlay.querySelector(".gallery-lightbox-close").onclick=close;overlay.addEventListener("click",e=>{if(e.target===overlay)close()});document.addEventListener("keydown",function esc(e){if(e.key==="Escape"){close();document.removeEventListener("keydown",esc)}});
  }
  async function deleteMemory(id){if(!window.confirm("Delete this memory from your gallery? This cannot be undone."))return;try{await transaction("readwrite",store=>store.delete(id));await renderGallery();toast("Memory deleted.");}catch(error){toast(error.message||"Could not delete this memory.");}}
  function setup(){const input=$("#galleryFiles"),save=$("#saveGalleryFiles"),caption=$("#galleryCaption");if(!input||!save)return;
    input.addEventListener("change",()=>{const files=[...input.files];save.disabled=!files.length;save.innerHTML=files.length?`Save ${files.length} ${files.length===1?"memory":"memories"} <span>↗</span>`:"Save to gallery <span>↗</span>";});
    save.addEventListener("click",async()=>{const files=[...input.files];if(!files.length)return;const valid=files.filter(file=>file.type.startsWith("image/")||file.type.startsWith("video/"));if(valid.length!==files.length){toast("Please choose image or video files only.");return;}const tooLarge=valid.find(file=>file.size>(file.type.startsWith("video/")?100:20)*1024*1024);if(tooLarge){toast(`${tooLarge.name} is too large. Photos must be under 20 MB and videos under 100 MB.`);return;}
      save.disabled=true;save.textContent="Saving your memories…";try{const note=caption.value.trim();for(const file of valid){await transaction("readwrite",store=>store.add({kind:file.type.startsWith("video/")?"video":"image",name:file.name,mimeType:file.type,blob:file,caption:note,createdAt:Date.now()}));}input.value="";caption.value="";save.innerHTML="Save to gallery <span>↗</span>";await renderGallery();toast(`${valid.length} ${valid.length===1?"memory":"memories"} saved privately on this device.`);}catch(error){toast(error.name==="QuotaExceededError"?"Your browser storage is nearly full. Remove some large videos and try again.":(error.message||"Could not save these memories."));}finally{save.disabled=!input.files.length;save.innerHTML="Save to gallery <span>↗</span>";}
    });
    document.querySelectorAll("[data-gallery-filter]").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.galleryFilter;document.querySelectorAll("[data-gallery-filter]").forEach(item=>item.classList.toggle("selected",item===button));render()}));
  }
  window.renderGallery=renderGallery;setup();
})();

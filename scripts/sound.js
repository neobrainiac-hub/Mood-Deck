(() => {
 const $ = id => document.getElementById(id);
 const audio = $('soundAudio');
 const tracks = {
  rain: {title:'Soft Rain', file:'../assets/audio/soft-rain.wav', subtitle:'A quiet afternoon'},
  ocean: {title:'Ocean Waves', file:'../assets/audio/ocean-waves.wav', subtitle:'Let it come, let it go'},
  forest: {title:'Forest Morning', file:'../assets/audio/forest-morning.wav', subtitle:'A fresh beginning'}
 };
 const FAV_KEY='moodDeckSoundFavourites';
 let favourites=[];
 try { favourites=JSON.parse(localStorage.getItem(FAV_KEY)||'[]').filter(k=>tracks[k]); } catch {}
 let current=null;
 const player=$('soundPlayer');
 function setStatus(message){ const el=$('voiceStatus'); if(el) el.textContent=message; }
 function renderFavourites(){
  document.querySelectorAll('[data-favourite]').forEach(btn=>{const active=favourites.includes(btn.dataset.favourite);btn.textContent=active?'♥':'♡';btn.classList.toggle('saved',active);btn.setAttribute('aria-pressed',String(active));});
  const list=$('savedList'); if(!list)return;
  if(!favourites.length){list.innerHTML='<p class="tiny">Your favourites will appear here when you save a sound.</p>';return;}
  list.innerHTML=favourites.map(key=>`<button class="saved-sound" data-saved-play="${key}"><span>♫</span><strong>${tracks[key].title}</strong><small>Play again →</small></button>`).join('');
 }
 async function play(key){
  const track=tracks[key]; if(!track)return;
  if(current===key && !audio.paused){audio.pause();updatePlayer();return;}
  if(current!==key){audio.src=track.file;current=key;}
  try{await audio.play();$('playerTitle').textContent=track.title;$('playerSubtitle').textContent=track.subtitle;player.hidden=false;updatePlayer();}
  catch{$('playerTitle').textContent=track.title;$('playerSubtitle').textContent='Tap play again if your browser blocked audio.';player.hidden=false;updatePlayer();}
 }
 function updatePlayer(){
  if(!current)return;
  const playing=!audio.paused;
  $('playerToggle').textContent=playing?'Ⅱ':'▶';$('playerToggle').setAttribute('aria-label',playing?'Pause sound':'Play sound');
  document.querySelectorAll('[data-play]').forEach(b=>{const active=b.dataset.play===current&&playing;b.classList.toggle('is-playing',active);b.innerHTML=`<span>${active?'Ⅱ':'▶'}</span> ${active?'Pause sound':'Play sound'}`;});
 }
 function stop(){audio.pause();audio.currentTime=0;current=null;player.hidden=true;updatePlayer();document.querySelectorAll('[data-play]').forEach(b=>{b.classList.remove('is-playing');b.innerHTML='<span>▶</span> Play sound';});}
 document.querySelectorAll('[data-play]').forEach(btn=>btn.addEventListener('click',()=>play(btn.dataset.play)));
 document.querySelectorAll('[data-favourite]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.favourite;favourites=favourites.includes(key)?favourites.filter(x=>x!==key):[...favourites,key];try{localStorage.setItem(FAV_KEY,JSON.stringify(favourites));}catch{}renderFavourites();}));
 $('savedList')?.addEventListener('click',e=>{const b=e.target.closest('[data-saved-play]');if(b)play(b.dataset.savedPlay);});
 $('playerToggle')?.addEventListener('click',()=>{if(!current)return;if(audio.paused)audio.play().catch(()=>{});else audio.pause();updatePlayer();});
 $('playerClose')?.addEventListener('click',stop);
 $('soundVolume')?.addEventListener('input',e=>audio.volume=Number(e.target.value)/100);
 audio.volume=.7;audio.addEventListener('play',updatePlayer);audio.addEventListener('pause',updatePlayer);
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));const filter=btn.dataset.filter;document.querySelectorAll('.sound-card').forEach(card=>{card.hidden=filter!=='all'&&!card.dataset.moods.split(' ').includes(filter);});}));
 $('speakVerse')?.addEventListener('click',()=>{if(!('speechSynthesis'in window)){setStatus('Speech narration is not supported by this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance('The LORD is my shepherd; I shall not want. Psalm twenty-three, verse one.');u.rate=.84;u.onstart=()=>setStatus('Playing Psalm 23:1.');u.onend=()=>setStatus('A moment to carry with you.');speechSynthesis.speak(u);});
 $('stopVoice')?.addEventListener('click',()=>{window.speechSynthesis?.cancel();setStatus('Scripture narration stopped.');});
 // Spotify embeds use the official player. No Spotify credentials or account data are collected.
 const spotifyInput=$('spotifyUrl'), embedWrap=$('spotifyEmbedWrap');
 function spotifyEmbedUrl(raw){
  let url;try{url=new URL(raw.trim());}catch{return null;}
  if(!['open.spotify.com','www.open.spotify.com'].includes(url.hostname))return null;
  const match=url.pathname.match(/^\/(playlist|album|track|episode|show)\/([A-Za-z0-9]+)\/?$/);
  if(!match)return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
 }
 $('loadSpotify')?.addEventListener('click',()=>{
  const raw=spotifyInput.value;const src=spotifyEmbedUrl(raw);const status=$('spotifyStatus');
  if(!src){status.textContent='That link does not look like a Spotify playlist, album, track, show or episode link. Copy a link from Spotify and try again.';return;}
  embedWrap.innerHTML='';const frame=document.createElement('iframe');frame.title='Spotify player';frame.src=src;frame.width='100%';frame.height='352';frame.style.border='0';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';embedWrap.appendChild(frame);
  status.textContent='Spotify player loaded. Sign in or choose playback options in Spotify if prompted.';
  try{localStorage.setItem('moodDeckSpotifyEmbed',raw.trim());}catch{}
 });
 try{const saved=localStorage.getItem('moodDeckSpotifyEmbed');if(saved){spotifyInput.value=saved;$('loadSpotify').click();}}catch{}
 renderFavourites();
 window.addEventListener('pagehide',()=>{audio.pause();window.speechSynthesis?.cancel();});
})();

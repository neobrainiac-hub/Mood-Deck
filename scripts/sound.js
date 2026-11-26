(() => {
 let ctx,osc1,osc2,gain,playing=false;
 const $=id=>document.getElementById(id);
 function start(){
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC){$("ambientStatus").textContent="Ambient audio is not supported by this browser.";return}
  ctx=ctx||new AC();if(ctx.state==="suspended")ctx.resume();
  gain=ctx.createGain();gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(.045,ctx.currentTime+2);
  osc1=ctx.createOscillator();osc2=ctx.createOscillator();const filter=ctx.createBiquadFilter();
  osc1.type="sine";osc1.frequency.value=110;osc2.type="sine";osc2.frequency.value=164.81;filter.type="lowpass";filter.frequency.value=420;
  osc1.connect(filter);osc2.connect(filter);filter.connect(gain);gain.connect(ctx.destination);osc1.start();osc2.start();
  playing=true;$("ambientToggle").textContent="Ⅱ Pause ambient sound";$("ambientStatus").textContent="Ambient sound is playing. Use the button to pause.";
 }
 function stop(){if(!playing)return;gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setTargetAtTime(0,ctx.currentTime,.15);setTimeout(()=>{try{osc1.stop();osc2.stop()}catch{}},800);playing=false;$("ambientToggle").textContent="▶ Start ambient sound";$("ambientStatus").textContent="Ambient sound paused."}
 $("ambientToggle").addEventListener("click",()=>playing?stop():start());
 $("speakVerse").addEventListener("click",()=>{if(!("speechSynthesis"in window)){alert("Speech is not supported in this browser.");return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance("The LORD is my shepherd; I shall not want. Psalm twenty-three, verse one.");u.rate=.82;speechSynthesis.speak(u)});
 $("stopVoice").addEventListener("click",()=>window.speechSynthesis?.cancel());
 window.addEventListener("pagehide",()=>{if(playing)stop();window.speechSynthesis?.cancel()});
})();
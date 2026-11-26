(() => {
 const $=id=>document.getElementById(id),canvas=$("waterCanvas"),ctx=canvas.getContext("2d");
 const modes={
 release:{title:"Let it settle.",line:"You do not have to solve everything in this moment.",prompts:["What are you ready to put down, even for a little while?","What has been taking up more space in your mind than it deserves?","If you could set one weight down for today, what would it be?"]},
 reflect:{title:"Notice what is here.",line:"You can observe a feeling without becoming the feeling.",prompts:["What feeling has been asking for your attention?","What might this moment be teaching you about yourself?","What do you know now that you did not know a little while ago?"]},
 restore:{title:"Return gently.",line:"Rest is not something you have to earn.",prompts:["What would feeling cared for look like today?","Where could you make a little more room to breathe?","What is one small thing that helps you feel grounded?"]},
 thanks:{title:"Make room for gratitude.",line:"Let the small good things count, too.",prompts:["What is one ordinary thing you are grateful for today?","Who has made your life a little lighter recently?","What quiet gift have you almost overlooked?"]}
 };
 let mode="release",rings=[],w=0,h=0,dpr=1,raf=0,audioCtx=null,ambient=null,ambientGain=null,audioOn=false,lastPrompt=0;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 function addRipple(x,y,power=1){rings.push({x,y,r:3,alpha:.72,power});if(rings.length>18)rings.shift()}
 function draw(t){
  ctx.clearRect(0,0,w,h);
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#1c3a34");g.addColorStop(.48,"#31574f");g.addColorStop(1,"#142b27");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w*.68,h*.65,5,w*.68,h*.65,w*.65);glow.addColorStop(0,"#b8d0b533");glow.addColorStop(1,"#b8d0b500");ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  // Soft moving water lines.
  for(let i=0;i<18;i++){let y=(i/18)*h;ctx.beginPath();for(let x=0;x<=w;x+=8){const yy=y+Math.sin(x*.012+i*.8+t*.00045)*5+Math.sin(x*.024+i+t*.00025)*2;x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.strokeStyle=`rgba(210,231,211,${.025+((i%4)*.006)})`;ctx.lineWidth=1;ctx.stroke()}
  rings=rings.filter(r=>r.alpha>.015&&r.r<Math.max(w,h)*.75);
  for(const r of rings){for(let k=0;k<3;k++){const radius=r.r+k*12;ctx.beginPath();ctx.ellipse(r.x,r.y,radius,radius*.43,0,0,Math.PI*2);ctx.strokeStyle=`rgba(221,239,220,${r.alpha*(1-k*.22)})`;ctx.lineWidth=1.2;ctx.stroke()}r.r+=reduced?1.2:1.65;r.alpha*=.986}
  if(!reduced&&Math.random()<.025)addRipple(w*(.2+Math.random()*.7),h*(.45+Math.random()*.5),.3);
  raf=requestAnimationFrame(draw);
 }
 function setMode(next){mode=next;document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("selected",b.dataset.mode===mode));$("modeTitle").textContent=modes[mode].title;$("modePrompt").textContent=modes[mode].line;nextPrompt()}
 function nextPrompt(){const list=modes[mode].prompts;let n=Math.floor(Math.random()*list.length);if(list.length>1&&n===lastPrompt)n=(n+1)%list.length;lastPrompt=n;$("reflectionPrompt").textContent=list[n]}
 function point(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
 canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);const p=point(e);addRipple(p.x,p.y,1)});
 canvas.addEventListener("pointermove",e=>{if(e.buttons){const p=point(e);addRipple(p.x,p.y,.5)}});
 function toggleAudio(){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC){$("rippleSound").textContent="Sound unavailable";return}
  if(!audioOn){audioCtx=audioCtx||new AC();audioCtx.resume();ambientGain=audioCtx.createGain();ambientGain.gain.value=.025;ambient=audioCtx.createOscillator();ambient.type="sine";ambient.frequency.value=92;const low=audioCtx.createBiquadFilter();low.type="lowpass";low.frequency.value=230;ambient.connect(low);low.connect(ambientGain);ambientGain.connect(audioCtx.destination);ambient.start();audioOn=true;$("rippleSound").textContent="♫ Sound on"}
  else{try{ambient.stop()}catch{}audioCtx.close();audioCtx=null;ambient=null;audioOn=false;$("rippleSound").textContent="♫ Sound off"}
 }
 document.querySelectorAll(".mode-btn").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
 $("newPrompt").addEventListener("click",nextPrompt);$("rippleSound").addEventListener("click",toggleAudio);
 $("saveThought").addEventListener("click",()=>{const note=$("rippleNote").value.trim();if(!note){$("saveStatus").textContent="Write a thought first, if you wish.";return}let all=[];try{all=JSON.parse(localStorage.getItem("moodDeckRippleNotes")||"[]")}catch{}all.unshift({mode,text:note,createdAt:new Date().toISOString()});localStorage.setItem("moodDeckRippleNotes",JSON.stringify(all));$("rippleNote").value="";$("saveStatus").textContent="Your reflection has been saved on this device."});
 resize();window.addEventListener("resize",resize);setMode("release");
 setTimeout(()=>{$("rippleLoader").classList.add("hidden");$("rippleStage").classList.remove("hidden");draw(0);addRipple(w*.52,h*.7,1)},1300);
 window.addEventListener("pagehide",()=>{cancelAnimationFrame(raf);if(audioCtx)audioCtx.close()});
})();
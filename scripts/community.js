(()=>{
 const KEYS={posts:'moodDeckCommunityPosts',friends:'moodDeckCommunityFriends',requests:'moodDeckCommunityRequests'};
 const $=id=>document.getElementById(id);
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(f))}catch{return f}};
 const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const profile=()=>{try{return JSON.parse(localStorage.getItem('moodDeckV2Profile')||'null')||{}}catch{return {}}};
 const seedUsers=[
  {handle:'hopefulheart',name:'Hopeful Heart',bio:'Learning to find light in ordinary days.',interests:['Faith','Personal growth'],location:'Lagos'},
  {handle:'quietgrowth',name:'Quiet Growth',bio:'Taking life one gentle step at a time.',interests:['Mental wellness','Journaling'],location:'Abuja'},
  {handle:'faithinprogress',name:'Faith in Progress',bio:'Growing in grace, one day at a time.',interests:['Faith','Music'],location:'Enugu'},
  {handle:'littlewinsclub',name:'Little Wins Club',bio:'Celebrating progress that nobody else sees.',interests:['Personal growth','Creativity'],location:'Ibadan'},
  {handle:'mindfulmuse',name:'Mindful Muse',bio:'Making space for reflection and new ideas.',interests:['Creativity','Mental wellness'],location:'Port Harcourt'},
  {handle:'softmorning',name:'Soft Morning',bio:'Here for thoughtful conversations and good music.',interests:['Music','Faith'],location:'Kano'}
 ];
 let posts=read(KEYS.posts,[]),friends=read(KEYS.friends,[]),requests=read(KEYS.requests,[]);
 const expandedComments=new Set();
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const own=()=>profile(), handle=()=>own().username||localStorage.getItem('moodDeckCommunityHandle')||'';
 const name=()=>own().name||'Mood Deck member', initials=s=>String(s||'?').trim().charAt(0).toUpperCase();
 const avatar=(person)=>person.photo?`<img src="${person.photo}" alt="">`:esc(initials(person.name));
 function card(person,action,caption=''){
  return `<article class="person-card"><div class="person-card-top"><span class="person-avatar">${avatar(person)}</span><span class="person-meta"><strong>${esc(person.name)}</strong><small>@${esc(person.handle)}</small></span></div><p class="person-bio">${esc(person.bio||'Here to grow and connect.')}</p><div class="interest-tags">${(person.interests||[]).slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="person-card-bottom"><small>${esc(caption||person.location||'Mood Deck member')}</small>${action}</div></article>`;
 }
 function postCard(p){
  const owner=p.handle===handle()?'<button type="button" data-delete="'+esc(p.id)+'">Delete</button>':'';
  const comments=Array.isArray(p.comments)?p.comments:[];
  const expanded=expandedComments.has(String(p.id));
  const visible=expanded?comments:comments.slice(-2);
  const preview=visible.length?visible.map(c=>`<div class="comment-item"><span class="comment-avatar">${esc(initials(c.name))}</span><div class="comment-body"><div class="comment-meta"><strong>${esc(c.name||'Mood Deck member')}</strong><small>@${esc(c.handle||'member')} · ${esc(c.timeLabel||'')}</small></div><p>${esc(c.text)}</p></div></div>`).join(''):'<p class="comments-empty">No comments yet. Be the first to add a thoughtful response.</p>';
  const more=comments.length>2?`<button type="button" class="comment-toggle" data-comments="${esc(p.id)}">${expanded?'Show latest':'View all '+comments.length+' comments'}</button>`:'';
  return `<article class="community-post"><div class="post-author"><span class="post-avatar">${esc(initials(p.name))}</span><div><strong>${esc(p.name)}</strong><small>@${esc(p.handle||'member')} · ${new Date(p.createdAt).toLocaleString()}</small></div></div><p class="post-copy">${esc(p.text)}</p><div class="post-actions"><button type="button" data-like="${esc(p.id)}">♡ ${p.likes?.length||0} Appreciate</button><button type="button" data-comments="${esc(p.id)}">☰ ${comments.length} ${comments.length===1?'Comment':'Comments'}</button>${owner}</div><section class="post-comments" aria-label="Comments"><div class="comment-list">${preview}</div>${more}<form class="comment-form" data-comment-form="${esc(p.id)}"><input name="comment" type="text" maxlength="300" placeholder="Write a comment…" aria-label="Write a comment" required><button class="btn light" type="submit">Comment</button></form></section></article>`;
 }

 function render(){
  $('postTotal').textContent=posts.length+' '+(posts.length===1?'post':'posts');
  $('communityFeed').innerHTML=posts.length?posts.slice().sort((a,b)=>b.createdAt-a.createdAt).map(postCard).join(''):'<div class="empty-state"><strong>It is quiet here for now.</strong><br>Share a thought, a small win or something that gave you hope today.</div>';
  const h=handle(),me=own();
  const discover=seedUsers.filter(u=>u.handle!==h);
  $('discoverPeople').innerHTML=discover.map(u=>{
   const isFriend=friends.some(f=>f.handle===u.handle),pending=requests.some(r=>r.handle===u.handle);
   const btn=isFriend?'<button class="btn light" disabled>Friends ✓</button>':pending?'<button class="btn light" disabled>Request sent</button>':`<button class="btn" data-add="${esc(u.handle)}">Add friend</button>`;
   return card(u,btn);
  }).join('');
  $('requestsList').innerHTML=requests.length?requests.map(r=>card(r,`<span class="request-actions"><button class="btn light" data-decline="${esc(r.handle)}">Decline</button><button class="btn" data-accept="${esc(r.handle)}">Accept</button></span>`,'Wants to connect')).join(''):'<div class="empty-state">No friend requests yet. Your requests will appear here.</div>';
  $('friendsList').innerHTML=friends.length?friends.map(f=>card(f,`<button class="btn light" data-remove="${esc(f.handle)}">Remove</button>`,'In your circle')):'<div class="empty-state">Your circle is just getting started. Discover someone you would like to know.</div>';
  $('requestCount').textContent=requests.length;$('friendCount').textContent=friends.length;
 }
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.community-panel').forEach(x=>x.classList.toggle('active',x.id==='tab-'+b.dataset.tab))}));
 $('postText').addEventListener('input',()=>$('postCount').textContent=$('postText').value.length+' / 600');
 $('postForm').addEventListener('submit',e=>{e.preventDefault();if(!handle()){$('postStatus').textContent='Add a username in Personal Space before posting.';return}const text=$('postText').value.trim();if(!text)return;posts.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),handle:handle(),name:name(),text,createdAt:Date.now(),likes:[]});write(KEYS.posts,posts);$('postText').value='';$('postCount').textContent='0 / 600';$('postStatus').textContent='Saved in this browser preview.';render()});
 $('friendSearchForm').addEventListener('submit',e=>{e.preventDefault();const q=$('friendSearch').value.trim().replace(/^@/,'').toLowerCase();document.querySelectorAll('.person-card').forEach(c=>{const t=c.textContent.toLowerCase();c.style.display=!q||t.includes(q)?'':'none'})});
 document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]'),accept=e.target.closest('[data-accept]'),decline=e.target.closest('[data-decline]'),remove=e.target.closest('[data-remove]'),like=e.target.closest('[data-like]'),del=e.target.closest('[data-delete]'),commentToggle=e.target.closest('[data-comments]');
  if(add){const person=seedUsers.find(u=>u.handle===add.dataset.add);if(person&&!requests.some(r=>r.handle===person.handle)&&!friends.some(f=>f.handle===person.handle)){requests.push(person);write(KEYS.requests,requests);render()}}
  if(accept){const person=requests.find(r=>r.handle===accept.dataset.accept);if(person){friends.push(person);requests=requests.filter(r=>r.handle!==person.handle);write(KEYS.friends,friends);write(KEYS.requests,requests);render()}}
  if(decline){requests=requests.filter(r=>r.handle!==decline.dataset.decline);write(KEYS.requests,requests);render()}
  if(remove){friends=friends.filter(r=>r.handle!==remove.dataset.remove);write(KEYS.friends,friends);render()}
  if(like){const p=posts.find(x=>x.id===like.dataset.like);if(p){p.likes=p.likes||[];p.likes.push(handle()||'local-visitor');write(KEYS.posts,posts);render()}}
  if(commentToggle){const id=String(commentToggle.dataset.comments);expandedComments.has(id)?expandedComments.delete(id):expandedComments.add(id);render()}
  if(del&&confirm('Delete this post from this browser?')){posts=posts.filter(x=>x.id!==del.dataset.delete);write(KEYS.posts,posts);render()}
 });
 document.addEventListener('submit',e=>{
  const form=e.target.closest('[data-comment-form]');if(!form)return;e.preventDefault();
  const post=posts.find(x=>String(x.id)===String(form.dataset.commentForm));const field=form.elements.comment;const text=field.value.trim();if(!post||!text)return;
  post.comments=Array.isArray(post.comments)?post.comments:[];post.comments.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),handle:handle()||'local-visitor',name:name(),text,createdAt:Date.now(),timeLabel:'just now'});
  write(KEYS.posts,posts);expandedComments.add(String(post.id));render();
 });
 if(!handle()){$('postStatus').textContent='Set your username in Personal Space before sharing a post.'}
 render();
})();
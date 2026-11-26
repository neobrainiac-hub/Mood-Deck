const PROFILE_KEY="moodDeckV2Profile";
function getLocalProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||"null")}catch{return null}}
function renderSharedProfile(){const profile=getLocalProfile();const name=profile?.name?.trim();document.querySelectorAll("[data-profile-name]").forEach(el=>el.textContent=name||"Your space");document.querySelectorAll("[data-profile-greeting]").forEach(el=>{const hour=new Date().getHours();el.textContent=(hour<12?"Good morning":hour<17?"Good afternoon":"Good evening")+(name?`, ${name}`:"")});}
renderSharedProfile();

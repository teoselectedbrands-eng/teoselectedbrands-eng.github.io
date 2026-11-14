/* Aetherion role-oriented pathway selector — local-only, progressive enhancement. */
(()=>{'use strict';
 const root=document.querySelector('[data-aej-journeys]');
 if(!root)return;
 const buttons=[...root.querySelectorAll('[data-aej-choice]')];
 const panels=[...root.querySelectorAll('[data-aej-panel]')];
 const status=root.querySelector('[data-aej-status]');
 if(!buttons.length||buttons.length!==panels.length)return;
 const supported=new Set(buttons.map(b=>b.dataset.aejChoice));
 function choose(key,focus=false){
  if(!supported.has(key))return;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.aejChoice===key)));
  panels.forEach(p=>{p.hidden=p.dataset.aejPanel!==key});
  if(status)status.textContent='Showing the '+buttons.find(b=>b.dataset.aejChoice===key).querySelector('strong').textContent+' pathway.';
  if(focus){const panel=panels.find(p=>p.dataset.aejPanel===key); panel?.querySelector('h3')?.focus({preventScroll:true});}
 }
 root.classList.add('aej-ready');
 const start=location.hash.startsWith('#path-')?location.hash.slice(6):'curious';
 choose(supported.has(start)?start:'curious');
 buttons.forEach(b=>b.addEventListener('click',()=>{choose(b.dataset.aejChoice);history.replaceState(null,'','#path-'+b.dataset.aejChoice)}));
 window.addEventListener('hashchange',()=>{const k=location.hash.startsWith('#path-')?location.hash.slice(6):null;if(k)choose(k)});
})();

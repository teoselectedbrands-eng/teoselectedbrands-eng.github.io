/* Aetherion Batch 3. Local-only educational and coordination prototypes.
   No APIs, no tracking/storage, no sending until user chooses their own email app. */
(() => {
'use strict';
const route = document.querySelector('[data-aeth3-coordination]');
if(route){
 const category = document.getElementById('aeth3-topic');
 const mode = document.getElementById('aeth3-mode');
 const day = document.getElementById('aeth3-day');
 const explanation = document.getElementById('aeth3-summary');
 const compose = document.getElementById('aeth3-compose');
 const allowed = Object.freeze({
   learning:{name:'Learning resources',desc:'A question about an existing open lesson or worksheet',topic:'learning',next:'A resource or learning coordinator can clarify which material to open; no enrollment is implied.'},
   practice:{name:'Movement or wellness',desc:'A question about nonclinical movement interests or proposed class formats',topic:'movement',next:'Availability, instructor, access and group format must be confirmed independently.'},
   encounter:{name:'Events or group workshops',desc:'A question about a future encounter or school/community collaboration',topic:'event',next:'A facilitator, capacity, host, safeguards and genuine date must be agreed before an invitation exists.'},
   professional:{name:'Professional services',desc:'A request for the appropriate private clinical coordination route—without medical details',topic:'professional',next:'A qualified professional and authorised confidential contact procedure are prerequisites.'},
   collaborate:{name:'Organisational collaboration',desc:'A general proposal for learning or community partnership',topic:'partnership',next:'Scope, accessibility and responsible contacts must be agreed before scheduling.'}
 });
 const formats=Object.freeze({any:'a suitable format',online:'an online conversation',onsite:'an in-person conversation'});
 const update=()=>{
   const k=Object.prototype.hasOwnProperty.call(allowed,category?.value)?category.value:'learning';
   const x=allowed[k]; const f=formats[mode?.value]||formats.any;
   const requestedDate=day?.value && /^\d{4}-\d\d-\d\d$/.test(day.value) ? day.value : '';
   if(explanation) explanation.textContent=x.desc+'. Possible next step: '+x.next+(requestedDate?' The date '+requestedDate+' is only your preference, not a reserved slot.':' No meeting date is confirmed.');
   if(compose){
     const subject='Aetherion | '+x.name+' coordination enquiry';
     const message='Hello Aetherion,\nI would like information about '+x.desc.toLowerCase()+'.\nPossible format: '+f+'.'+(requestedDate?'\nPreferred day (not a reservation): '+requestedDate+'.':'')+'\nPlease advise the right general contact and next step. I have not included medical or identifying information.\nThank you.';
     compose.href='mailto:hello@aetherionmovement.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
     compose.textContent='Compose general enquiry email ↗';
   }
 };
 [category,mode,day].forEach(el=>el?.addEventListener('change',update));
 update();
}
const experiment=document.querySelector('[data-aeth3-experiment]');
if(experiment){
 const scenario=document.getElementById('aeth3-scene');
 const change=document.getElementById('aeth3-condition');
 const output=document.getElementById('aeth3-observation');
 const cases={
   desk:{original:'A person is preparing a note on a crowded desk with several tools out of reach.',question:'What can you observe about reach, sequencing and the position of the materials?',label:'Desk activity'},
   classroom:{original:'A group is following a movement instruction in a noisy room with limited space.',question:'Where can participation choices be offered without assuming motivation or ability?',label:'Group learning'},
   route:{original:'A person is crossing a busy public space with uneven surfaces and many cues.',question:'How do route design, timing, access and the purpose of the journey interact?',label:'Public route'}
 };
 const changes={
   arrange:{label:'Rearrange materials or markers',text:'Tools or visual markers are placed in a clear sequence and within easier reach.'},
   noise:{label:'Reduce one competing stimulus',text:'One source of competing sound or visual distraction is reduced.'},
   choice:{label:'Offer an alternative way to participate',text:'The person can choose between two routes or participation methods.'},
   time:{label:'Allow an unhurried transition',text:'The activity can begin with more transition time and fewer overlapping demands.'}
 };
 const refresh=()=>{
   const a=cases[scenario?.value]||cases.desk,b=changes[change?.value]||changes.arrange;
   if(output) output.textContent='BEFORE — '+a.original+' AFTER — '+b.text+' OBSERVE — '+a.question+' Ask what changed in the task and context; do not assume that it improved performance for everyone.';
 };
 [scenario,change].forEach(el=>el?.addEventListener('change',refresh));refresh();
}
})();
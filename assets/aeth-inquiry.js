// Aetherion Inquiry: local-only choice assistance; no transmission, database, cookies or storage.
// No health details, identifying details about minors, or scheduling/payment data collected.
(()=>{
'use strict';
const root=document.querySelector('[data-aeth-inquiry]');
if(!root)return;
const form=root.querySelector('form'),purpose=form?.querySelector('[name=purpose]'),mode=form?.querySelector('[name=mode]'),context=form?.querySelector('[name=context]'),status=root.querySelector('[role=status]');
const info=root.querySelector('[data-aeth-route]');
if(!form||!purpose||!mode||!context||!status||!info)return;
const labels={general:'Not sure yet',classes:'Movement classes',group:'Workshop or group event',learning:'Learning and resources',professional:'Professional / clinical services',home:'Home-based support enquiry',partnership:'Organisation / B2B'};
const readable={email:'Your email app will open with a draft. You must review and send it yourself.',professional:'For a clinical situation, request a secure contact pathway without describing diagnoses or personal health details here.',group:'This opens a discussion, not an event registration.',classes:'No classes, fees, places or schedules are confirmed by this enquiry.'};
function update(){const cat=purpose.value||'general';info.textContent=cat==='professional'||cat==='home'?readable.professional:cat==='group'?readable.group:cat==='classes'?readable.classes:readable.email;}
purpose.addEventListener('change',update);update();
form.addEventListener('submit',event=>{
 event.preventDefault();
 const cat=purpose.value||'general';
 if(!mode.value||!context.value){status.textContent='Please choose a preferred format and a general context before continuing.';return;}
 const subject='Aetherion enquiry | '+(labels[cat]||labels.general);
 const body=[
   'Hello Aetherion Movement,',
   '',
   'I would like to ask about: '+(labels[cat]||labels.general),
   'Preferred format: '+mode.options[mode.selectedIndex].text,
   'General starting point: '+context.options[context.selectedIndex].text,
   '',
   'Please tell me the next appropriate step and any general requirements.',
   'I understand this does not reserve or confirm a service.',
   '',
   'I will not include health records or identifying details about children in this general email.'
 ].join('\n');
 status.textContent='Your email app will open with a prefilled draft. Review it and send it yourself; nothing has been submitted by this site.';
 window.location.href='mailto:hello@aetherionmovement.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
})();
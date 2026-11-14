/* Aetherion Pathway Labs — enhancement only; no network, analytics, storage or user profiling. */
(() => {
  'use strict';
  const observer = document.querySelector('[data-ap-lab="observation"]');
  if (observer) {
    const status = document.getElementById('ap-observation-feedback');
    observer.querySelectorAll('[data-observe-value]').forEach(button => {
      button.addEventListener('click', () => {
        observer.querySelectorAll('[data-observe-value]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        if (status) status.textContent = button.dataset.observeValue === 'yes'
          ? 'Observation: yes. This describes something visible without assuming why the person paused. Next: what additional evidence would you need?'
          : 'Interpretation: this could be a hypothesis, but the short scene cannot tell us what the person felt or intended. Try the sentence that describes a visible event.';
      });
    });
  }

  const format = document.querySelector('[data-ap-lab="format"]');
  if (format) {
    const select = document.getElementById('ap-format-select');
    const description = document.getElementById('ap-format-description');
    const link = document.getElementById('ap-format-link');
    const choices = {
      control: {desc:'Compare a task with more or less support, a different pace and different entry points. Observation and instructor choice matter as much as repetition.', href:'#pilates-control', name:'Pilates & Control'},
      strength: {desc:'Compare a wall, chair and floor setup in a hypothetical bodyweight task. Ask how support and leverage change the demand rather than counting repetitions.',href:'#calisthenics-foundations',name:'Calisthenics Foundations'},
      rhythm: {desc:'Think about a short step–pause–turn phrase. Alter the tempo, music or social cues and discuss how different people can join or observe.',href:'#rhythm-movement',name:'Rhythm & Movement'},
      play: {desc:'Imagine a group moving one object between marked areas. Change a single game rule to create another way to contribute without excluding participants.',href:'#play-cooperation',name:'Play & Cooperation'}
    };
    const update = () => {
      const match = choices[select?.value] || choices.control;
      if (description) description.textContent = match.desc;
      if (link) {link.href = match.href; link.textContent = 'Explore '+match.name+' ↗';}
    };
    select?.addEventListener('change', update);
    update();
  }

  const event = document.querySelector('[data-ap-lab="event"]');
  if (event) {
    const audience = document.getElementById('ap-event-audience');
    const mode = document.getElementById('ap-event-mode');
    const output = document.getElementById('ap-event-summary');
    const email = document.getElementById('ap-event-email');
    const people = {
      adult:'adult learners or community participants',school:'educators and school teams',org:'clubs, community organisations or workplace teams'
    };
    const setting = {
      online:'an online educational circle',room:'an in-person small-group learning session',outdoor:'a neighbourhood or outdoor observation walk'
    };
    const update = () => {
      const group = people[audience?.value] || people.adult;
      const place = setting[mode?.value] || setting.online;
      if (output) output.textContent = 'Concept only: '+place+' for '+group+'. Agree the learning question, host, facilitator, access, safeguarding if relevant, permissions, date and registration method before publication.';
      if (email) {
        const subject = 'Aetherion — general learning encounter proposal';
        const body = 'Hello Aetherion,\nI would like to explore '+place+' for '+group+'.\nPlease advise the appropriate coordination route. This is a general enquiry; no health or child-identifying details are included.\nThank you.';
        email.href = 'mailto:hello@aetherionmovement.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      }
    };
    audience?.addEventListener('change', update);
    mode?.addEventListener('change', update);
    update();
  }
})();
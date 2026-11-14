/* Aetherion Batch 2 — single general-enquiry route.
   No forms, API calls, cookies, analytics, personal data collection or appointment creation.
   The user must explicitly send the email using their own mail client. */
(() => {
  'use strict';
  const selector = document.getElementById('enquiry-topic');
  const link = document.getElementById('enquiry-compose');
  const summary = document.getElementById('enquiry-explanation');
  if (!selector || !link || !summary) return;

  const choices = Object.freeze({
    general: {
      label: 'General question',
      subject: 'Aetherion enquiry | General',
      note: 'This opens a draft in your own email application. An enquiry is not a confirmed appointment, admission or booking.',
      body: 'Hello Aetherion,\nI have a general question about Aetherion. Please advise the appropriate point of contact.\nThank you.'
    },
    learning: {
      label: 'Free learning resources',
      subject: 'Aetherion enquiry | Learning & resources',
      note: 'Free lessons and worksheets are available now. This question does not enroll you in a class or certificate programme.',
      body: 'Hello Aetherion,\nI have a question about your free learning resources and next learning pathways. Please advise.\nThank you.'
    },
    movement: {
      label: 'Movement or future class formats',
      subject: 'Aetherion enquiry | Movement formats',
      note: 'The class catalogue presents formats in preparation; no class time, instructor or registration is confirmed by this message.',
      body: 'Hello Aetherion,\nI would like to know whether a suitable movement-learning format is being prepared. I understand there is no public booking calendar yet.\nThank you.'
    },
    workshop: {
      label: 'Workshop or community encounter',
      subject: 'Aetherion enquiry | Workshop or encounter',
      note: 'This asks for coordination information, not a public RSVP. Private meeting invitations are issued only after individual confirmation.',
      body: 'Hello Aetherion,\nI would like to enquire about organising or learning more about an educational workshop or community encounter. Please advise the appropriate coordination route.\nThank you.'
    },
    professional: {
      label: 'Professional care pathway',
      subject: 'Aetherion enquiry | Private professional contact route',
      note: 'Do not include medical reports, diagnoses or identifying information about children. A qualified, private clinical channel must be confirmed separately.',
      body: 'Hello Aetherion,\nPlease advise how I can reach the appropriate confidential professional coordination contact. I will not include medical information in this general email.\nThank you.'
    },
    partnership: {
      label: 'School or organisation partnership',
      subject: 'Aetherion enquiry | Partnership',
      note: 'A partnership proposal needs an identified adult contact and agreed scope before any workshop, attendance or date is confirmed.',
      body: 'Hello Aetherion,\nI would like to discuss a potential educational partnership or group encounter. Please let me know the appropriate contact route.\nThank you.'
    },
    accessibility: {
      label: 'Accessibility and privacy',
      subject: 'Aetherion enquiry | Accessibility or privacy',
      note: 'Send a general accessibility or privacy question. Do not attach sensitive records to this email.',
      body: 'Hello Aetherion,\nI have a general question about access to your public resources or privacy. Please advise.\nThank you.'
    },
    editorial: {
      label: 'News and Journal',
      subject: 'Aetherion enquiry | Editorial',
      note: 'News and Journal feedback is editorial; it is not an appointment or a request for personalised healthcare.',
      body: 'Hello Aetherion,\nI have a question or feedback concerning News, Journal or Discover. Please advise the appropriate editorial contact.\nThank you.'
    }
  });

  const requested = new URLSearchParams(window.location.search).get('topic');
  if (requested && Object.prototype.hasOwnProperty.call(choices, requested)) {
    selector.value = requested;
  }
  function refresh() {
    const value = choices[selector.value] ? selector.value : 'general';
    const item = choices[value];
    link.href = 'mailto:hello@aetherionmovement.com?subject=' + encodeURIComponent(item.subject) +
      '&body=' + encodeURIComponent(item.body);
    link.textContent = 'Compose ' + item.label.toLowerCase() + ' email \u2197';
    summary.textContent = item.note;
  }
  selector.addEventListener('change', refresh);
  refresh();
})();
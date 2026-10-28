/* Local catalogue controls only. No identity, network calls, answers or progress. */
(() => {
  'use strict';
  const kind = document.getElementById('event-type');
  const mode = document.getElementById('event-mode');
  function filterEvents() {
    let count = 0;
    document.querySelectorAll('[data-event-type]').forEach(card => {
      const typeMatches = !kind || kind.value === 'all' || card.dataset.eventType === kind.value;
      const modeMatches = !mode || mode.value === 'all' || card.dataset.eventModes.split(' ').includes(mode.value);
      card.hidden = !(typeMatches && modeMatches);
      if (!card.hidden) count++;
    });
    const countNode = document.getElementById('event-count');
    if (countNode) countNode.textContent = count + ' programme' + (count === 1 ? '' : 's') + ' in preparation';
    const empty = document.getElementById('event-empty');
    if (empty) empty.hidden = count !== 0;
  }
  kind?.addEventListener('change', filterEvents);
  mode?.addEventListener('change', filterEvents);
  document.getElementById('reset-events')?.addEventListener('click', () => {
    if (kind) kind.value = 'all';
    if (mode) mode.value = 'all';
    filterEvents();
  });
  const track = document.getElementById('academy-track');
  track?.addEventListener('change', () => {
    let count = 0;
    document.querySelectorAll('[data-academy-track]').forEach(group => {
      group.hidden = track.value !== 'all' && group.dataset.academyTrack !== track.value;
      if (!group.hidden) count += group.querySelectorAll('.card').length;
    });
    const node = document.getElementById('academy-count');
    if (node) node.textContent = track.value === 'all' ? '21 course concepts across 7 tracks' : count + ' course concepts in this track';
  });
  // Deep links from related reading must reveal a filtered track before scrolling.
  function revealCourse() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const group = target?.closest('[data-academy-track]');
    if (group?.hidden && track) {
      track.value = 'all';
      track.dispatchEvent(new Event('change'));
      target.scrollIntoView({block:'start'});
    }
  }
  addEventListener('hashchange', revealCourse);
})();

/* Aetherion MC001. Local navigation and filters only; no collection or requests. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const menu = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const main = document.querySelector('main');
  function closeMenu(returnFocus = false) {
    if (!menu || !nav) return;
    const wasOpen = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    if (returnFocus && wasOpen) menu.focus();
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu(true);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));

  const movementButtons = [...document.querySelectorAll('[data-filter]')];
  function filterMovements(value) {
    movementButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
    let count = 0;
    document.querySelectorAll('[data-movement]').forEach(card => {
      card.hidden = value !== 'all' && card.dataset.movement !== value;
      if (!card.hidden) count++;
    });
    const status = document.getElementById('movement-count');
    if (status) status.textContent = count + ' movement studies shown';
  }
  movementButtons.forEach(b => b.addEventListener('click', () => filterMovements(b.dataset.filter)));

  const classButtons = [...document.querySelectorAll('[data-class-filter]')];
  const level = document.getElementById('class-level');
  let classStyle = 'all';
  function filterClasses() {
    classButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.classFilter === classStyle)));
    let count = 0;
    document.querySelectorAll('[data-class-type]').forEach(card => {
      const styleMatch = classStyle === 'all' || card.dataset.classType === classStyle;
      const levelMatch = !level || level.value === 'all' || card.dataset.classLevel === level.value;
      card.hidden = !styleMatch || !levelMatch;
      if (!card.hidden) count++;
    });
    const status = document.getElementById('class-count');
    if (status) status.textContent = count ? count + ' example format' + (count === 1 ? '' : 's') + ' shown' : 'No example formats match. Try another filter or reset.';
  }
  classButtons.forEach(b => b.addEventListener('click', () => { classStyle = b.dataset.classFilter; filterClasses(); }));
  level?.addEventListener('change', filterClasses);
  document.getElementById('reset-classes')?.addEventListener('click', () => {
    classStyle = 'all'; if (level) level.value = 'all'; filterClasses();
  });
  const storyButtons = [...document.querySelectorAll('[data-story-filter]')];
  storyButtons.forEach(b => b.addEventListener('click', () => {
    storyButtons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('[data-story]').forEach(card => {
      card.hidden = b.dataset.storyFilter !== 'all' && card.dataset.story !== b.dataset.storyFilter;
    });
  }));
  document.querySelectorAll('.print-sheet').forEach(b => b.addEventListener('click', () => window.print()));

  // Preserve shared hashes for every extracted direct route.
  const migrated = new Map([['/movement/', '/movement/'], ['/classes/', '/classes/'], ['/learn/', '/learn/'], ['/journal/', '/journal/'], ['/workshops/', '/workshops/'], ['/resources/observation-card/', '/resources/observation-card/']]);
  const pages = [...document.querySelectorAll('[data-legacy-page]')];
  const fallback = document.getElementById('legacy-not-found');
  let previousRoute = null;
  function legacyRoute() {
    const hash = location.hash;
    if (hash && !hash.startsWith('#/')) return; // Native anchors, including Skip to content.
    let route;
    try { route = decodeURIComponent(hash.slice(1)) || '/'; } catch { route = '__invalid__'; }
    const [routePart, destinationId = ''] = route.split('#', 2);
    const normalized = routePart.endsWith('/') ? routePart : routePart + '/';
    if (migrated.has(normalized)) {
      location.replace(migrated.get(normalized) + location.search + (destinationId ? '#' + encodeURIComponent(destinationId) : ''));
      return;
    }
    const target = pages.find(p => p.dataset.legacyPage === normalized);
    if (!pages.length) return;
    pages.forEach(p => { p.hidden = p !== target; });
    if (fallback) fallback.hidden = !!target;
    nav?.querySelectorAll('a').forEach(a => {
      a.removeAttribute('aria-current');
      if (a.getAttribute('href') === '/#' + normalized) a.setAttribute('aria-current', 'page');
    });
    document.title = target?.dataset.title || 'Page not found — Aetherion';
    if (previousRoute !== null && previousRoute !== normalized) main?.focus({ preventScroll: true });
    const destination = destinationId ? document.getElementById(destinationId) : null;
    if (destination && target?.contains(destination)) {
      destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
      destination.scrollIntoView({ block: 'start' });
    } else if (previousRoute !== normalized) window.scrollTo({ top: 0, behavior: 'instant' });
    previousRoute = normalized;
  }
  function revealAnchor() {
    if (location.hash.startsWith('#/')) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    const movement = target.closest('[data-movement]');
    if (movement?.hidden) filterMovements('all');
    const classCard = target.closest('[data-class-type]');
    if (classCard?.hidden) { classStyle = 'all'; if (level) level.value = 'all'; filterClasses(); }
    const details = target.closest('details');
    if (details) details.open = true;
    if (id !== 'main') target.scrollIntoView({ block: 'start' });
  }
  addEventListener('hashchange', () => { legacyRoute(); revealAnchor(); });
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    if (a.hash === location.hash) revealAnchor();
  }));
  legacyRoute();
  revealAnchor();
})();

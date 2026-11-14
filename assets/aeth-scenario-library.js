/* Local-only progressive enhancement. No requests, storage, analytics or personal data. */
(() => {
  const root = document.querySelector("[data-scenario-library]");
  if (!root) return;
  const cards = [...root.querySelectorAll("[data-case-id]")];
  const track = root.querySelector("#scn-track");
  const focus = root.querySelector("#scn-focus");
  const count = root.querySelector("#scn-count");
  const reset = root.querySelector("#scn-reset");
  const left = root.querySelector("#scn-left");
  const right = root.querySelector("#scn-right");
  const targets = {
    left: root.querySelector("[data-compare-left]"),
    right: root.querySelector("[data-compare-right]")
  };

  function filterCards() {
    let shown = 0;
    for (const card of cards) {
      const matchTrack = track.value === "all" || card.dataset.track === track.value;
      const matchFocus = focus.value === "all" || card.dataset.focus === focus.value;
      card.hidden = !(matchTrack && matchFocus);
      if (!card.hidden) shown++;
    }
    count.textContent = shown + " of " + cards.length + " fictional scenarios shown";
  }
  function renderSide(select, panel) {
    const card = cards.find(c => c.dataset.caseId === select.value);
    if (!card || !panel) return;
    for (const [selector, value] of [
      ['[data-compare-title]', card.dataset.title],
      ['[data-compare-constraint]', card.dataset.constraint],
      ['[data-compare-proposal]', card.dataset.proposal],
      ['[data-compare-unknown]', card.dataset.unknown]
    ]) {
      const target = panel.querySelector(selector);
      if (target) target.textContent = value || "";
    }
    const link = panel.querySelector("[data-compare-link]");
    if (link) link.href = card.querySelector("a.scn-detail-link").getAttribute("href");
  }
  function renderComparison() {
    renderSide(left, targets.left);
    renderSide(right, targets.right);
  }
  track.addEventListener("change", filterCards);
  focus.addEventListener("change", filterCards);
  reset.addEventListener("click", () => {
    track.value = "all";
    focus.value = "all";
    filterCards();
    track.focus();
  });
  left.addEventListener("change", renderComparison);
  right.addEventListener("change", renderComparison);
  filterCards();
  renderComparison();
})();

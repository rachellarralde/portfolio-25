/* rachell.dev — Work page project filters. Without JS every card stays visible. */
(() => {
  const buttons = document.querySelectorAll('.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.work-grid .project-card[data-tags]');
  const countEl = document.querySelector('[data-count]');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    let shown = 0;
    cards.forEach((card) => {
      const match = filter === 'all' || card.dataset.tags.split(' ').includes(filter);
      card.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter)));
    if (countEl) countEl.textContent = shown === 1 ? '1 project' : `${shown} projects`;
  }

  buttons.forEach((btn) => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
})();

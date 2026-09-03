// dev widget: swap the accent palette live. remove this file + its <script> tags to ship a fixed theme.
const PALETTES = [
  { id: 'amber', label: 'amber', accent: '#e19e74', dim: '#984b1e', glow: 'rgba(225,158,116,.18)' },
  { id: 'moss', label: 'moss', accent: '#a3c98a', dim: '#4f6b3a', glow: 'rgba(163,201,138,.16)' },
  { id: 'ice', label: 'ice', accent: '#8fc7d9', dim: '#2f6272', glow: 'rgba(143,199,217,.16)' },
  { id: 'rose', label: 'rose', accent: '#d99494', dim: '#7d3a3f', glow: 'rgba(217,148,148,.16)' },
  { id: 'violet', label: 'violet', accent: '#b09ae0', dim: '#4f3f80', glow: 'rgba(176,154,224,.16)' },
  { id: 'bone', label: 'bone', accent: '#dbd9d3', dim: '#6c6a66', glow: 'rgba(219,217,211,.14)' },
];
const KEY = 'rch-accent';

function apply(p) {
  const r = document.documentElement.style;
  r.setProperty('--rch-red', p.accent);
  r.setProperty('--rch-red-br', p.dim);
  r.setProperty('--glow-accent', p.glow);
  try { localStorage.setItem(KEY, p.id); } catch (e) { /* private mode */ }
}

function build() {
  const saved = (() => { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
  const active = PALETTES.find((p) => p.id === saved) || PALETTES[0];
  apply(active);

  const box = document.createElement('div');
  box.className = 'palette';
  box.innerHTML = `
    <button class="palette__toggle" type="button" aria-expanded="false" aria-label="change accent color">◐<span class="palette__name">${active.label}</span></button>
    <div class="palette__list" hidden>
      ${PALETTES.map((p) => `<button class="palette__sw${p.id === active.id ? ' is-active' : ''}" type="button" data-id="${p.id}" title="${p.label}" style="--sw:${p.accent}"><span class="palette__dot"></span>${p.label}</button>`).join('')}
    </div>`;
  document.body.appendChild(box);

  const toggle = box.querySelector('.palette__toggle');
  const list = box.querySelector('.palette__list');
  const name = box.querySelector('.palette__name');

  toggle.addEventListener('click', () => {
    const open = list.hidden;
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  list.addEventListener('click', (e) => {
    const b = e.target.closest('.palette__sw');
    if (!b) return;
    const p = PALETTES.find((x) => x.id === b.dataset.id);
    apply(p);
    name.textContent = p.label;
    list.querySelectorAll('.palette__sw').forEach((s) => s.classList.toggle('is-active', s === b));
  });

  document.addEventListener('click', (e) => { if (!box.contains(e.target)) { list.hidden = true; toggle.setAttribute('aria-expanded', 'false'); } });
}

build();

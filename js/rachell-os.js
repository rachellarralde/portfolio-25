/* rachell-os — vanilla port of the Rachell terminal design system primitives
   (Panel, Meter, Prompt, LogStream, AsciiBanner, GlitchText, MatrixRain,
   BootSequence, Toast, Launcher, LockScreen) composed into the portfolio. */

import { owner, roles, about, projects, filters, skills, sections } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad2 = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bootedAt = Date.now();
const onHire = location.pathname.startsWith('/hire-me');
const home = (hash) => (onHire ? '/' + hash : hash);

/* ---------- AsciiBanner: 5-row block alphabet ---------- */
const GLYPHS = {"0":[" ## ","#  #","#  #","#  #"," ## "],"1":["  # "," ## ","  # ","  # ","####"],"2":[" ## ","#  #","  # "," #  ","####"],"3":["### ","   #"," ## ","   #","### "],"4":["#  #","#  #","####","   #","   #"],"5":["####","#   ","### ","   #","### "],"6":[" ###","#   ","### ","#  #"," ## "],"7":["####","   #","  # "," #  "," #  "],"8":[" ## ","#  #"," ## ","#  #"," ## "],"9":[" ## ","#  #"," ###","   #","### "],"A":[" ## ","#  #","####","#  #","#  #"],"B":["### ","#  #","### ","#  #","### "],"C":[" ###","#   ","#   ","#   "," ###"],"D":["### ","#  #","#  #","#  #","### "],"E":["####","#   ","### ","#   ","####"],"F":["####","#   ","### ","#   ","#   "],"G":[" ###","#   ","# ##","#  #"," ###"],"H":["#  #","#  #","####","#  #","#  #"],"I":["####","  # ","  # ","  # ","####"],"J":["####","   #","   #","#  #"," ## "],"K":["#  #","# # ","##  ","# # ","#  #"],"L":["#   ","#   ","#   ","#   ","####"],"M":["#  #","####","####","#  #","#  #"],"N":["#  #","## #","####","# ##","#  #"],"O":[" ## ","#  #","#  #","#  #"," ## "],"P":["### ","#  #","### ","#   ","#   "],"Q":[" ## ","#  #","#  #","# ##"," ###"],"R":["### ","#  #","### ","# # ","#  #"],"S":[" ###","#   "," ## ","   #","### "],"T":["####","  # ","  # ","  # ","  # "],"U":["#  #","#  #","#  #","#  #"," ## "],"V":["#  #","#  #","#  #"," ## "," ## "],"W":["#  #","#  #","####","####","#  #"],"X":["#  #"," ## "," ## "," ## ","#  #"],"Y":["#  #","#  #"," ## ","  # ","  # "],"Z":["####","   #"," ## ","#   ","####"]," ":["    ","    ","    ","    ","    "],".":["    ","    ","    ","    "," #  "],"-":["    ","    ","####","    ","    "],"/":["   #","  # "," #  ","#   ","    "],":":["    ","  # ","    ","  # ","    "],"!":["  # ","  # ","  # ","    ","  # "]};

export function banner(text, fill = '█', gap = 1) {
  const chars = String(text).toUpperCase().split('').map((ch) => GLYPHS[ch] || GLYPHS[' ']);
  return [0, 1, 2, 3, 4].map((r) => chars.map((g) => g[r]).join(' '.repeat(gap))).join('\n').replace(/#/g, fill);
}

/* ---------- Meter ---------- */
export function meterHTML({ label, value = 0, max = 100, cells = 24, tone = 'accent', showValue = true, unit = '%' }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const filled = Math.round(pct * cells);
  const shown = unit === '%' ? Math.round(pct * 100) + '%' : value + unit;
  return `<span class="meter meter--${tone}${label ? '' : ' meter--sm'}">${label ? `<span class="meter__label">${esc(label)}</span>` : ''}<span class="meter__bar" aria-hidden="true"><span class="meter__fill">${'█'.repeat(filled)}</span><span class="meter__empty">${'░'.repeat(cells - filled)}</span></span>${showValue ? `<span class="meter__val">${shown}</span>` : ''}</span>`;
}

/* ---------- Prompt ---------- */
function promptHTML(cmd, { cwd = '~', status = 0, cursor = false } = {}) {
  return `<span class="p-user">${owner.handle}</span><span class="p-at">@</span><span class="p-host">${owner.host}</span><span class="p-cwd">${esc(cwd)}</span><span class="p-sym${status ? ' p-sym--err' : ''}">❯</span><span class="p-cmd">${esc(cmd)}</span>${cursor ? '<span class="cursor" aria-hidden="true"></span>' : ''}`;
}

/* ---------- Toast (mako) ---------- */
export function toast({ tone = 'accent', title, body, ttl = 4200 }) {
  const host = $('#toasts');
  if (!host) return;
  const t = new Date();
  const el = document.createElement('div');
  el.className = `toast toast--${tone}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="toast__head"><span>${esc(title)}</span><span class="t">${[t.getHours(), t.getMinutes(), t.getSeconds()].map(pad2).join(':')}</span><button class="toast__x" aria-label="dismiss">×</button></div>${body ? `<div class="toast__body">${esc(body)}</div>` : ''}`;
  $('.toast__x', el).addEventListener('click', () => el.remove());
  host.appendChild(el);
  if (ttl) setTimeout(() => el.remove(), ttl);
}

/* ---------- MatrixRain: three-layer <pre> renderer ---------- */
class Rain {
  constructor(el, { speed = 120, density = 0.5, chars = '01<>[]{}/\\|=+*·░▒▓█ABCDEFHKLMNRSTUVXZ' } = {}) {
    this.el = el; this.speed = speed; this.density = density; this.chars = chars.split('');
    this.layers = ['head', 'mid', 'tail'].map((k) => { const p = document.createElement('pre'); p.className = `rain rain--${k}`; p.setAttribute('aria-hidden', 'true'); el.appendChild(p); return p; });
    this.timer = null; this.cols = []; this.rows = 0;
    this.measure();
    if ('ResizeObserver' in window) new ResizeObserver(() => this.measure()).observe(el);
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? this.start() : this.stop())), { threshold: 0 }).observe(el);
    else this.start();
  }
  pick() { return this.chars[(Math.random() * this.chars.length) | 0]; }
  measure() {
    const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;top:0;left:0;visibility:hidden;white-space:pre;font:var(--type-code);line-height:1.1'; probe.textContent = '0'.repeat(50); this.el.appendChild(probe);
    const box = probe.getBoundingClientRect(); const cw = box.width / 50 || 7.8; const lh = box.height || 14.3; probe.remove();
    const nc = Math.ceil(this.el.clientWidth / cw) + 1; this.rows = Math.ceil(this.el.clientHeight / lh) + 1;
    if (nc !== this.cols.length) this.cols = Array.from({ length: nc }, () => this.spawn(true));
    for (const c of this.cols) while (c.chars.length < this.rows) c.chars.push(this.pick());
  }
  spawn(init) { const r = this.rows; return { y: init ? Math.floor(Math.random() * r * 1.4) - Math.floor(r * 0.4) : -Math.floor(Math.random() * r), len: 4 + Math.floor(Math.random() * r * 0.6), step: 1 + Math.floor(Math.random() * 2), chars: Array.from({ length: r }, () => this.pick()), on: Math.random() < this.density }; }
  frame() {
    const r = this.rows; const out = [[], [], []];
    for (const c of this.cols) {
      c.y += c.step;
      if (c.y - c.len > r) Object.assign(c, this.spawn(false));
      c.chars[(Math.random() * r) | 0] = this.pick();
      if (c.chars.length < r) c.chars.push(...Array.from({ length: r - c.chars.length }, () => this.pick()));
    }
    for (let y = 0; y < r; y++) {
      let h = '', m = '', t = '';
      for (const c of this.cols) {
        const d = c.y - y; const vis = c.on && d >= 0 && d < c.len;
        if (!vis) { h += ' '; m += ' '; t += ' '; continue; }
        if (d === 0) { h += c.chars[y]; m += ' '; t += ' '; }
        else if (d < c.len * 0.45) { h += ' '; m += c.chars[y]; t += ' '; }
        else { h += ' '; m += ' '; t += c.chars[y]; }
      }
      out[0].push(h); out[1].push(m); out[2].push(t);
    }
    this.layers.forEach((p, i) => { p.textContent = out[i].join('\n'); });
  }
  start() { if (this.timer || reduced) { if (reduced) this.frame(); return; } this.frame(); this.timer = setInterval(() => this.frame(), this.speed); }
  stop() { clearInterval(this.timer); this.timer = null; }
}

/* ---------- AsciiWave ---------- */
function wave(el, { cols = 120, rows = 4, speed = 80, freq = 0.28 } = {}) {
  const RAMP = [' ', '·', '░', '▒', '▓', '█']; let t = 0;
  const draw = () => {
    const out = [];
    for (let r = 0; r < rows; r++) { let line = ''; for (let c = 0; c < cols; c++) { const v = Math.sin(c * freq + t * 0.18) * 0.5 + Math.sin(c * freq * 0.37 - t * 0.11) * 0.5; const centre = (rows - 1) / 2 + v * ((rows - 1) / 2); const d = Math.abs(r - centre); line += RAMP[Math.max(0, Math.min(5, Math.round((1 - d / (rows / 2)) * 5)))]; } out.push(line); }
    el.textContent = out.join('\n'); t++;
  };
  draw(); if (reduced) return () => {}; const id = setInterval(draw, speed); return () => clearInterval(id);
}

/* ---------- GlitchText ---------- */
const NOISE = '!<>-_\\/[]{}—=+*^?#01'.split('');
function glitch(el, text, { speed = 40, settle = 3 } = {}) {
  return new Promise((res) => {
    if (reduced) { el.textContent = text; return res(); }
    let frame = 0;
    const id = setInterval(() => {
      frame++; const done = Math.floor(frame / settle);
      el.textContent = text.split('').map((ch, i) => (i < done || ch === ' ' ? ch : NOISE[(Math.random() * NOISE.length) | 0])).join('');
      if (done >= text.length) { clearInterval(id); el.textContent = text; res(); }
    }, speed);
  });
}

/* ---------- BootSequence splash ---------- */
function bootLines() {
  return [
    { t: '0.000000', text: `${owner.host} 2.5 · portfolio kernel`, level: 'ok' },
    { t: '0.141200', text: `probing projects — ${projects.length} found`, level: 'ok' },
    { t: '0.212004', text: 'mounting /home/rachel/work', level: 'ok' },
    { t: '0.288104', text: `loading skill modules (${skills.length} groups)`, level: 'ok' },
    { t: '0.402881', text: `uplink ${owner.email}`, level: 'ok' },
    { t: '0.664019', text: 'status: accepting freelance projects', level: 'ok' },
    { t: '0.918430', text: 'starting session' },
  ];
}
async function boot() {
  const el = $('#boot');
  if (!el) return;
  let skip = false;
  if (reduced || sessionStorage.getItem('rch-booted')) { el.remove(); document.body.classList.remove('is-booting'); return; }
  document.body.classList.add('is-booting');
  const log = document.createElement('div'); log.className = 'boot__log';
  const hint = document.createElement('div'); hint.className = 'boot__hint'; hint.textContent = 'any key · skip';
  const wv = document.createElement('pre'); wv.className = 'wave'; wv.setAttribute('aria-hidden', 'true');
  el.append(hint, log, wv);
  const stopWave = wave(wv, { cols: Math.ceil(innerWidth / 7.8) + 2 });
  const end = () => { skip = true; };
  addEventListener('keydown', end, { once: true }); el.addEventListener('click', end, { once: true });
  const LV = { ok: 'lvl-ok', warn: 'lvl-warn', err: 'lvl-err', info: 'lvl-info' };
  for (const l of bootLines()) {
    if (skip) break;
    const row = document.createElement('div'); row.className = 'boot__row';
    row.innerHTML = `<span class="boot__t">[${l.t.padStart(9, ' ')}]</span><span class="boot__txt"></span><span class="boot__lvl ${LV[l.level] || ''}"></span><span class="cursor" aria-hidden="true"></span>`;
    log.appendChild(row);
    const txt = $('.boot__txt', row);
    for (let i = 1; i <= l.text.length && !skip; i++) { txt.textContent = l.text.slice(0, i); await sleep(9); }
    txt.textContent = l.text; $('.cursor', row).remove();
    if (l.level) $('.boot__lvl', row).textContent = `[ ${l.level} ]`;
    if (!skip) await sleep(90);
  }
  if (!skip) await sleep(260);
  stopWave(); el.remove(); document.body.classList.remove('is-booting');
  try { sessionStorage.setItem('rch-booted', '1'); } catch (e) { /* private mode */ }
}

/* ---------- top bar: clock, meters ---------- */
function initBar() {
  const c = $('#clock'), d = $('#date');
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  const tick = () => { const t = new Date(); if (c) c.textContent = [t.getHours(), t.getMinutes(), t.getSeconds()].map(pad2).join(':'); if (d) d.textContent = t.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toLowerCase().replace(/,/g, ''); };
  tick(); setInterval(tick, 1000);
  const cpu = $('#bar-cpu'), mem = $('#bar-mem');
  let n = 0;
  const poll = () => { n++; if (cpu) cpu.innerHTML = meterHTML({ value: 42 + ((n * 7) % 23), cells: 8, showValue: false }); if (mem) mem.innerHTML = meterHTML({ value: 38 + ((n * 5) % 13), cells: 8, showValue: false, tone: 'info' }); };
  poll(); if (!reduced) setInterval(poll, 1200);
  $('#launcher-btn')?.addEventListener('click', openLauncher);
  $('#power-btn')?.addEventListener('click', lock);
  $$('[data-action="launcher"]').forEach((b) => b.addEventListener('click', openLauncher));
  $$('[data-action="lock"]').forEach((b) => b.addEventListener('click', lock));
  $$('[data-action="terminal"]').forEach((b) => b.addEventListener('click', focusTerminal));
  $$('[data-action="help"]').forEach((b) => b.addEventListener('click', () => runCommand('help', true)));
}

/* ---------- workspace tabs + scroll spy ---------- */
function initWorkspaces() {
  const tabs = $$('.ws__tab[href^="#"]');
  const ids = tabs.map((t) => t.getAttribute('href').slice(1));
  const badge = $('#ws-badge');
  const set = (id) => { tabs.forEach((t) => t.classList.toggle('is-active', t.getAttribute('href') === '#' + id)); const s = sections.find((x) => x.id === id); if (badge && s) badge.textContent = `ws ${s.n}`; };
  if (!tabs.length) return;
  const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const spy = () => { const y = scrollY + innerHeight * 0.35; let cur = secs[0]; for (const s of secs) if (s.offsetTop <= y) cur = s; if (cur) set(cur.id); };
  addEventListener('scroll', spy, { passive: true }); spy();
}

/* ---------- hero ---------- */
function initHero() {
  const b = $('#banner'); if (b) b.textContent = banner(owner.banner);
  const rain = $('#hero-rain'); if (rain) new Rain(rain, { speed: 120, density: 0.32 });
  const role = $('#role');
  if (role) {
    let i = 0;
    const cycle = async () => { await glitch(role, roles[i]); i = (i + 1) % roles.length; if (!reduced) setTimeout(cycle, 2600); };
    cycle();
  }
  const up = $('#uptime');
  if (up) { const t = () => { const s = Math.floor((Date.now() - bootedAt) / 1000); up.textContent = `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`; }; t(); setInterval(t, 1000); }
  const mon = $('#mon-meters');
  if (mon) {
    const max = Math.max(...skills.map((s) => s.tags.length));
    mon.innerHTML = skills.map((s, i) => meterHTML({ label: s.name.split(' ')[0], value: s.tags.length, max, cells: 20, unit: '', tone: ['accent', 'info', 'ok', 'accent', 'info', 'ok'][i % 6] })).join('');
  }
  const procs = $('#mon-procs');
  if (procs) procs.innerHTML = roles.map((r, i) => `<div class="log__row"><span class="log__t">${String(i + 1).padStart(3, ' ')}  ${1841 + i * 233}</span><span class="log__txt">${esc(r)}</span></div>`).join('');
}

/* ---------- projects ---------- */
function projectCard(p, i) {
  const art = document.createElement('article');
  art.className = 'panel proj'; art.dataset.tags = p.tags.join(' '); art.tabIndex = 0;
  art.innerHTML = `
    <header class="panel__head"><span class="panel__title">${pad2(i + 1)} · ${esc(p.title)}</span><span class="panel__meta">${esc(p.tags.join(' · '))}</span></header>
    <div class="proj__media"><img src="${p.imageUrl}" alt="${esc(p.title)} screenshot" loading="lazy" decoding="async"></div>
    <div class="proj__body"><span class="proj__cat">// ${esc(p.category)}</span><p class="proj__desc">${esc(p.description)}</p></div>
    <footer class="panel__foot"><span class="kc"><kbd>⏎</kbd><span>open</span></span>${p.featured ? '<span class="badge badge--accent">featured</span>' : ''}<a class="proj__link" href="${p.liveUrl}" target="_blank" rel="noopener noreferrer">access ↗</a></footer>`;
  const go = () => window.open(p.liveUrl, '_blank', 'noopener');
  art.addEventListener('click', (e) => { if (e.target.closest('a')) return; go(); });
  art.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  return art;
}
function initProjects() {
  const grid = $('#projects-grid'); if (!grid) return;
  grid.innerHTML = ''; projects.forEach((p, i) => grid.appendChild(projectCard(p, i)));
  const bar = $('#filters'); const meta = $('#filters-meta');
  if (bar) {
    bar.innerHTML = filters.map((f) => `<button class="filters__tab${f.id === 'all' ? ' is-active' : ''}" role="tab" data-filter="${f.id}">${f.label}</button>`).join('') + '<span class="filters__meta" id="filters-meta"></span>';
    const apply = (id) => { let n = 0; $$('.proj', grid).forEach((c) => { const on = id === 'all' || c.dataset.tags.split(' ').includes(id); c.classList.toggle('is-hidden', !on); if (on) n++; }); $$('.filters__tab', bar).forEach((t) => t.classList.toggle('is-active', t.dataset.filter === id)); const m = $('#filters-meta'); if (m) m.textContent = `${n} / ${projects.length}`; };
    bar.addEventListener('click', (e) => { const t = e.target.closest('.filters__tab'); if (t) apply(t.dataset.filter); });
    apply('all');
  } else if (meta) meta.textContent = `${projects.length} / ${projects.length}`;
}

/* ---------- about / skills ---------- */
function initAbout() {
  const prose = $('#about-text'); if (prose) prose.innerHTML = about.map((p) => `<p>${p}</p>`).join('');
  const list = $('#skills'); if (!list) return;
  const max = Math.max(...skills.map((s) => s.tags.length));
  list.innerHTML = skills.map((s, i) => `
    <div class="skill${i === 0 ? ' is-open' : ''}" id="skill-${s.id}">
      <button class="skill__head" aria-expanded="${i === 0}"><span class="skill__n">${pad2(i + 1)}</span><span class="skill__name">${esc(s.name)}</span><span class="skill__meter">${meterHTML({ value: s.tags.length, max, cells: 18, unit: '', tone: 'accent' })}</span><span class="skill__tog">${i === 0 ? '▾' : '▸'}</span></button>
      <div class="skill__tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>`).join('');
  list.addEventListener('click', (e) => { const h = e.target.closest('.skill__head'); if (!h) return; const row = h.parentElement; const open = row.classList.toggle('is-open'); h.setAttribute('aria-expanded', open); $('.skill__tog', h).textContent = open ? '▾' : '▸'; });
  const total = $('#skills-meta'); if (total) total.textContent = `${skills.reduce((n, s) => n + s.tags.length, 0)} modules`;
}

/* ---------- contact ---------- */
function initContact() {
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast({ tone: 'ok', title: 'clipboard', body: `${b.dataset.copy} copied` }); }
    catch (e) { toast({ tone: 'warn', title: 'clipboard', body: 'copy blocked — select the address manually' }); }
  }));
}

/* ---------- terminal ---------- */
let termOut, termInput, history = [], hIdx = -1;
const COMMANDS = {
  help: () => [
    '<span class="bright">available commands</span>',
    '  help              this list',
    '  whoami            identity',
    '  ls                list files',
    '  cat <file>        read about.txt · contact.txt',
    '  projects          list projects',
    '  open <n|name>     open a project · open hire-me',
    '  skills [group]    list skill modules',
    '  cd <section>      work · about · contact · hire',
    '  neofetch          system summary',
    '  uptime · date · history · clear · lock',
    '  sudo hire rachel  escalate',
    '',
    '<span class="faint">↑↓ history · tab complete · ⌘k launcher</span>',
  ].join('\n'),
  whoami: () => `${owner.name} — ${roles.join(' · ')}`,
  ls: (a) => (a[0] === 'projects' ? COMMANDS.projects() : 'about.txt    contact.txt    projects/    skills/    hire-me/'),
  cat: (a) => {
    const f = (a[0] || '').replace(/^~\//, '');
    if (f === 'about.txt') return about.map((p) => p.replace(/<[^>]+>/g, '')).join('\n\n');
    if (f === 'contact.txt') return `email   ${owner.email}\nhire    <a href="/hire-me/">/hire-me/</a>`;
    if (!f) return { err: 'cat: missing file operand' };
    return { err: `cat: ${f}: no such file or directory` };
  },
  projects: () => projects.map((p, i) => `${pad2(i + 1)}  <a href="${p.liveUrl}" target="_blank" rel="noopener">${esc(p.title.toLowerCase().padEnd(22))}</a> <span class="faint">${esc(p.category)}</span>`).join('\n'),
  open: (a) => {
    const q = a.join(' ').toLowerCase();
    if (!q) return { err: 'open: missing target — try `projects`' };
    if (q === 'hire-me' || q === 'hire') { setTimeout(() => (location.href = '/hire-me/'), 300); return 'opening /hire-me/'; }
    const p = projects[Number(q) - 1] || projects.find((x) => x.id === q || x.title.toLowerCase().includes(q));
    if (!p) return { err: `open: ${q}: not found` };
    window.open(p.liveUrl, '_blank', 'noopener');
    return `opening ${esc(p.title.toLowerCase())} → <a href="${p.liveUrl}" target="_blank" rel="noopener">${p.liveUrl}</a>`;
  },
  skills: (a) => {
    const q = (a[0] || '').toLowerCase();
    const set = q ? skills.filter((s) => s.id.includes(q) || s.name.includes(q)) : skills;
    if (!set.length) return { err: `skills: ${q}: no such group` };
    return set.map((s) => `<span class="bright">${esc(s.name)}</span> <span class="faint">(${s.tags.length})</span>\n  ${s.tags.map(esc).join(' · ')}`).join('\n\n');
  },
  cd: (a) => {
    const q = (a[0] || 'hero').replace(/^~\/?/, '') || 'hero';
    if (q === 'hire' || q === 'hire-me') { setTimeout(() => (location.href = '/hire-me/'), 300); return 'opening /hire-me/'; }
    const s = sections.find((x) => x.id === q || x.label === q);
    if (!s) return { err: `cd: ${q}: no such section` };
    goTo('#' + s.id);
    return `~/${s.label}`;
  },
  neofetch: () => [
    `<span class="hl">${banner('R', '█').split('\n').join('\n')}</span>`,
    `<span class="bright">${owner.handle}@${owner.host}</span>`,
    `host      ${owner.host}`,
    `roles     ${roles.length} · ${roles.map((r) => r.split(' ')[0]).join(' · ')}`,
    `projects  ${projects.length}`,
    `skills    ${skills.reduce((n, s) => n + s.tags.length, 0)} modules in ${skills.length} groups`,
    `theme     rachell · amber on #121212`,
    `uptime    ${$('#uptime')?.textContent || '00:00:00'}`,
  ].join('\n'),
  uptime: () => `${$('#uptime')?.textContent || '00:00:00'} · session · status <span class="ok">● accepting projects</span>`,
  date: () => new Date().toString().toLowerCase(),
  history: () => history.map((h, i) => `${String(i + 1).padStart(4, ' ')}  ${esc(h)}`).join('\n') || 'no history',
  clear: () => { termOut.innerHTML = ''; return null; },
  echo: (a) => esc(a.join(' ')),
  lock: () => { setTimeout(lock, 200); return 'locking session'; },
  exit: () => COMMANDS.lock(),
  sudo: (a) => {
    if (/^hire/.test(a.join(' '))) { toast({ tone: 'ok', title: 'sudo', body: 'privileges granted — opening /hire-me/' }); setTimeout(() => (location.href = '/hire-me/'), 900); return '<span class="ok">[ ok ]</span> privileges granted — routing to /hire-me/'; }
    return { err: `${owner.handle} is not in the sudoers file. this incident will be reported` };
  },
  rm: () => ({ err: 'rm: permission denied — nice try' }),
  hire: () => COMMANDS.sudo(['hire']),
  contact: () => COMMANDS.cat(['contact.txt']),
  about: () => COMMANDS.cat(['about.txt']),
  pwd: () => `/home/${owner.handle}`,
};
function runCommand(raw, fromUI) {
  if (!termOut) { if (fromUI) goTo('#hero'); return; }
  const cmd = raw.trim();
  const entry = document.createElement('div'); entry.className = 'term__entry';
  if (!cmd) { entry.innerHTML = `<div class="term__line">${promptHTML('')}</div>`; termOut.appendChild(entry); scrollTerm(); return; }
  history.push(cmd); hIdx = history.length;
  const [name, ...args] = cmd.split(/\s+/);
  const fn = COMMANDS[name.toLowerCase()];
  let res = fn ? fn(args) : { err: `zsh: command not found: ${esc(name)}` };
  const status = res && res.err ? 127 : 0;
  entry.innerHTML = `<div class="term__line">${promptHTML(cmd, { status })}</div>`;
  if (res !== null && res !== undefined) { const pre = document.createElement('pre'); pre.className = 'term__out'; pre.innerHTML = res.err ? `<span class="err">${res.err}</span>` : res; entry.appendChild(pre); }
  if (name.toLowerCase() === 'clear') return;
  termOut.appendChild(entry); scrollTerm();
  if (fromUI) { goTo('#hero'); focusTerminal(); }
}
function scrollTerm() { const t = $('#term'); if (t) t.scrollTop = t.scrollHeight; }
function focusTerminal() { termInput?.focus({ preventScroll: false }); }
function initTerminal() {
  const term = $('#term'); if (!term) return;
  termOut = $('#term-out'); termInput = $('#term-input');
  term.addEventListener('click', (e) => { if (!e.target.closest('a')) termInput.focus(); });
  $('#term-form').addEventListener('submit', (e) => { e.preventDefault(); runCommand(termInput.value); termInput.value = ''; });
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runCommand(termInput.value); termInput.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx > 0) { hIdx--; termInput.value = history[hIdx]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx < history.length - 1) { hIdx++; termInput.value = history[hIdx]; } else { hIdx = history.length; termInput.value = ''; } }
    else if (e.key === 'Tab') {
      e.preventDefault(); const v = termInput.value; const parts = v.split(/\s+/);
      const pool = parts.length > 1 ? [...projects.map((p) => p.id), ...sections.map((s) => s.label), 'about.txt', 'contact.txt', 'hire-me', ...skills.map((s) => s.id)] : Object.keys(COMMANDS);
      const last = parts[parts.length - 1].toLowerCase(); const hit = pool.filter((c) => c.startsWith(last));
      if (hit.length === 1) { parts[parts.length - 1] = hit[0]; termInput.value = parts.join(' ') + ' '; }
      else if (hit.length > 1) { const pre = document.createElement('pre'); pre.className = 'term__out'; pre.textContent = hit.join('  '); termOut.appendChild(pre); scrollTerm(); }
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); COMMANDS.clear(); }
  });
  // greeting
  const greet = document.createElement('div'); greet.className = 'term__entry';
  greet.innerHTML = `<div class="term__line">${promptHTML('whoami')}</div><pre class="term__out">${COMMANDS.whoami()}</pre>`;
  const tip = document.createElement('div'); tip.className = 'term__entry';
  tip.innerHTML = `<div class="term__line">${promptHTML('cat ~/motd')}</div><pre class="term__out">welcome. type <span class="bright">help</span> to list commands, <span class="bright">projects</span> to browse work, or <span class="bright">sudo hire rachel</span>.</pre>`;
  termOut.append(greet, tip);
}

/* ---------- navigation ---------- */
function goTo(hash) {
  const el = document.querySelector(hash);
  if (el) { el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
  else location.href = home(hash);
}

/* ---------- launcher (wofi) ---------- */
let launcherEl = null, launcherSel = 0, launcherItems = [];
function launcherCatalog() {
  const items = [
    ...sections.map((s) => ({ id: 'go-' + s.id, label: `goto ${s.label}`, meta: 'workspace ' + s.n, run: () => (onHire ? (location.href = '/#' + s.id) : goTo('#' + s.id)) })),
    { id: 'hire', label: 'hire me', meta: 'start a project', run: () => (location.href = '/hire-me/') },
    { id: 'mail', label: `mail ${owner.email}`, meta: 'uplink', run: () => (location.href = 'mailto:' + owner.email) },
    ...projects.map((p) => ({ id: 'p-' + p.id, label: `open ${p.title.toLowerCase()}`, meta: p.tags.join(' · '), run: () => window.open(p.liveUrl, '_blank', 'noopener') })),
    { id: 'term', label: 'terminal', meta: 'focus shell', run: () => { if (onHire) location.href = '/#hero'; else { goTo('#hero'); focusTerminal(); } } },
    { id: 'help', label: 'help', meta: 'commands', run: () => runCommand('help', true) },
    { id: 'lock', label: 'lock', meta: 'hyprlock', run: lock },
  ];
  return items;
}
function openLauncher() {
  if (launcherEl) return;
  document.body.classList.add('is-modal');
  const all = launcherCatalog();
  launcherEl = document.createElement('div'); launcherEl.className = 'overlay'; launcherEl.setAttribute('role', 'dialog'); launcherEl.setAttribute('aria-label', 'launcher');
  launcherEl.innerHTML = `<div class="launcher"><section class="panel panel--strong"><header class="panel__head"><span class="panel__title">run</span><span class="panel__meta" id="launcher-meta">${all.length} / ${all.length}</span></header><div class="launcher__search"><label class="input"><span class="input__prefix">❯</span><input id="launcher-q" type="text" placeholder="search" autocomplete="off" spellcheck="false" aria-label="search"></label></div><div class="menu" id="launcher-menu" role="listbox"></div><footer class="panel__foot"><span class="kc"><kbd>⏎</kbd><span>run</span></span><span class="kc"><kbd>ESC</kbd><span>close</span></span><span class="kc"><kbd>↑↓</kbd><span>move</span></span></footer></section></div>`;
  document.body.appendChild(launcherEl);
  const q = $('#launcher-q', launcherEl), menu = $('#launcher-menu', launcherEl), meta = $('#launcher-meta', launcherEl);
  const render = () => {
    const v = q.value.trim().toLowerCase();
    launcherItems = all.filter((i) => !v || i.label.includes(v) || i.meta.includes(v));
    launcherSel = Math.min(launcherSel, Math.max(0, launcherItems.length - 1));
    meta.textContent = `${launcherItems.length} / ${all.length}`;
    menu.innerHTML = launcherItems.length ? launcherItems.map((i, n) => `<button class="menu__row${n === launcherSel ? ' is-sel' : ''}" role="option" data-i="${n}"><span class="g">▸</span><span class="l">${esc(i.label)}</span><span class="m">${esc(i.meta)}</span></button>`).join('') : '<div class="menu__empty">no matches</div>';
    $('.is-sel', menu)?.scrollIntoView({ block: 'nearest' });
  };
  const pick = (n) => { const it = launcherItems[n]; closeLauncher(); if (it) it.run(); };
  q.addEventListener('input', () => { launcherSel = 0; render(); });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); launcherSel = Math.min(launcherItems.length - 1, launcherSel + 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); launcherSel = Math.max(0, launcherSel - 1); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(launcherSel); }
  });
  menu.addEventListener('click', (e) => { const r = e.target.closest('.menu__row'); if (r) pick(Number(r.dataset.i)); });
  launcherEl.addEventListener('click', (e) => { if (e.target === launcherEl) closeLauncher(); });
  launcherSel = 0; render(); q.focus();
}
function closeLauncher() { if (!launcherEl) return; launcherEl.remove(); launcherEl = null; document.body.classList.remove('is-modal'); }

/* ---------- lock screen (hyprlock) ---------- */
let lockEl = null;
function lock() {
  if (lockEl) return;
  closeLauncher();
  document.body.classList.add('is-locked');
  lockEl = document.createElement('div'); lockEl.className = 'lock'; lockEl.setAttribute('role', 'dialog'); lockEl.setAttribute('aria-label', 'session locked');
  lockEl.innerHTML = `<div class="lock__rain" id="lock-rain"></div><div class="lock__scan" aria-hidden="true"></div><div class="lock__box"><pre class="banner" aria-label="${owner.banner}">${banner(owner.banner)}</pre><div class="lock__sub" id="lock-sub"></div><form class="lock__form" id="lock-form"><div class="field"><span class="field__label">${owner.handle}@${owner.host}</span><label class="input"><span class="input__prefix">❯</span><input id="lock-pw" type="password" placeholder="passphrase" autocomplete="off" aria-label="passphrase"></label><span class="field__hint">any 3+ characters unlock this session</span><span class="field__err" id="lock-err"></span></div><button class="btn btn--block" type="submit">unlock</button></form><div class="lock__facts"><span class="badge badge--ok badge--dot">uplink ${esc(owner.email)}</span><span class="badge">session locked</span></div></div>`;
  document.body.appendChild(lockEl);
  const rain = new Rain($('#lock-rain', lockEl), { speed: 130, density: 0.35 });
  const sub = $('#lock-sub', lockEl); let on = true;
  const loop = async () => { while (on && lockEl) { await glitch(sub, `${owner.host} // terminal`); await sleep(2600); } };
  loop();
  let attempts = 3;
  $('#lock-form', lockEl).addEventListener('submit', (e) => {
    e.preventDefault(); const pw = $('#lock-pw', lockEl).value;
    if (pw.length < 3) { attempts--; $('#lock-err', lockEl).textContent = attempts > 0 ? `auth rejected — ${attempts} attempts left` : 'auth rejected — try anything longer'; if (attempts <= 0) attempts = 3; return; }
    on = false; rain.stop(); lockEl.remove(); lockEl = null; document.body.classList.remove('is-locked');
    try { sessionStorage.setItem('rch-unlocked', '1'); } catch (e) { /* private mode */ }
    toast({ tone: 'ok', title: 'session', body: 'unlocked — welcome back' });
  });
  $('#lock-pw', lockEl).focus();
}

/* ---------- global keys ---------- */
function initKeys() {
  addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); launcherEl ? closeLauncher() : openLauncher(); return; }
    if (e.key === 'Escape') { if (launcherEl) closeLauncher(); else if (document.activeElement === termInput) termInput.blur(); return; }
    if (typing || lockEl || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '?') { e.preventDefault(); runCommand('help', true); }
    else if (e.key === 't') { e.preventDefault(); if (termInput) { goTo('#hero'); focusTerminal(); } else location.href = '/#hero'; }
    else if (e.key === 'l') { e.preventDefault(); lock(); }
    else if (/^[1-4]$/.test(e.key)) { const s = sections[Number(e.key) - 1]; if (s) onHire ? (location.href = '/#' + s.id) : goTo('#' + s.id); }
  });
}

/* ---------- hire page: faq + form ---------- */
function initHire() {
  const faq = $('#faq');
  if (faq) faq.addEventListener('click', (e) => { const q = e.target.closest('.faq__q'); if (!q) return; const it = q.parentElement; const open = it.classList.toggle('is-open'); q.setAttribute('aria-expanded', open); $('.g', q).textContent = open ? '▾' : '▸'; });
  const form = $('#hire-me-form'); if (!form) return;
  const url = form.dataset.webhook; const btn = $('#submit-btn'); const status = $('#form-status');
  const say = (cls, text) => { status.innerHTML = `<span class="${cls}">${esc(text)}</span>`; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); btn.disabled = true; btn.textContent = 'sending…'; say('faint', '❯ transmitting brief');
    const fd = new FormData(form);
    const data = { name: fd.get('name'), email: fd.get('email'), businessType: fd.get('businessType'), budget: fd.get('budget'), timeline: fd.get('timeline') || 'Not specified', message: fd.get('message') || 'No description provided' };
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const res = await r.json();
      if (r.ok && res.success) { say('lvl-ok', `[ ok ] ${res.message || 'brief received'}`); toast({ tone: 'ok', title: 'uplink', body: 'brief sent — reply incoming' }); form.reset(); }
      else throw new Error(res.message || 'delivery failed');
    } catch (err) {
      status.innerHTML = `<span class="lvl-err">[ err ] ${esc(err.message)}</span> <span class="faint">— email directly:</span> <a class="link" href="mailto:${owner.email}">${owner.email}</a>`;
      toast({ tone: 'danger', title: 'uplink', body: 'delivery failed — use email' });
    } finally { btn.disabled = false; btn.textContent = 'send proposal request'; }
  });
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  initBar(); initWorkspaces(); initHero(); initProjects(); initAbout(); initContact(); initTerminal(); initKeys(); initHire();
  await boot();
  const unlocked = (() => { try { return sessionStorage.getItem('rch-unlocked'); } catch (e) { return null; } })();
  if (!unlocked) lock();
  if (unlocked && !sessionStorage.getItem('rch-greeted')) {
    toast({ tone: 'ok', title: 'session', body: `${owner.host} online · ⌘k launcher · ? help` });
    try { sessionStorage.setItem('rch-greeted', '1'); } catch (e) { /* private mode */ }
  }
});

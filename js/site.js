/* rachell.dev — shared behavior: theme toggle, star field, mobile menu, footer year. */
(() => {
  const root = document.documentElement;
  const STORAGE_KEY = 'rachell-theme';
  const THEME_COLOR = { light: '#F5EFE6', dark: '#141414' };

  /* ---------- Theme ---------- */
  const currentTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  function syncThemeUI(theme) {
    const dark = theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    });
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', THEME_COLOR[theme]));
    if (dark) buildStars();
  }

  function setTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* storage blocked */ }
    }
    syncThemeUI(theme);
  }

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
  });

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) setTheme(e.newValue, false);
  });

  /* ---------- Star field (dark mode) ---------- */
  const SPARK = 'M12 2 C12.6 8.5 15.5 11.4 22 12 C15.5 12.6 12.6 15.5 12 22 C11.4 15.5 8.5 12.6 2 12 C8.5 11.4 11.4 8.5 12 2 Z';
  let starsEl = null;
  let starsKey = '';

  function buildStars() {
    const w = root.clientWidth;
    const h = document.body.offsetHeight;
    const key = `${w}x${h}`;
    if (!w || !h || key === starsKey) return;
    starsKey = key;

    if (!starsEl) {
      starsEl = document.createElement('div');
      starsEl.className = 'stars';
      starsEl.setAttribute('aria-hidden', 'true');
      document.body.prepend(starsEl);
    }

    let seed = w * 7 + h;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const count = Math.round((w * h) / 60000);
    let html = '';
    for (let i = 0; i < count; i++) {
      const size = Math.round(8 + rnd() * 12);
      const left = Math.round(rnd() * (w - 20));
      const top = Math.round(rnd() * (h - 20));
      const fill = i % 3 ? '#F4C95D' : '#FFF6E8';
      const delay = (rnd() * 3.4).toFixed(2);
      html += `<svg class="star" width="${size}" height="${size}" viewBox="0 0 24 24" style="left:${left}px;top:${top}px;animation-delay:-${delay}s" fill="${fill}"><path d="${SPARK}"/></svg>`;
    }
    starsEl.innerHTML = html;
  }

  let resizeTimer;
  const scheduleStars = () => {
    if (!starsEl && currentTheme() !== 'dark') return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildStars, 200);
  };
  if ('ResizeObserver' in window) new ResizeObserver(scheduleStars).observe(document.body);
  else window.addEventListener('resize', scheduleStars);

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.menu-toggle');
  const menu = menuBtn && document.getElementById(menuBtn.getAttribute('aria-controls'));

  if (menuBtn && menu) {
    const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
    const setMenu = (open, returnFocus = false) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      if (!open && returnFocus) menuBtn.focus();
    };

    menuBtn.addEventListener('click', () => setMenu(!isOpen()));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setMenu(false, true);
    });
    document.addEventListener('click', (e) => {
      if (isOpen() && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Footer year ---------- */
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = year; });

  syncThemeUI(currentTheme());
})();

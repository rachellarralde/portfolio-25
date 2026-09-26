/* Book a call page — Cal.com inline embed that follows the site theme. */
(() => {
  const NS = 'rachell-call';
  const CAL_LINK = 'nocodehuman/free-call';
  const BRAND = { light: '#211C17', dark: '#F2F2F2' };
  const theme = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  // Official Cal.com embed loader.
  (function (C, A, L) {
    const p = (a, ar) => { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  const ui = () => ({
    theme: theme(),
    cssVarsPerTheme: { light: { 'cal-brand': BRAND.light }, dark: { 'cal-brand': BRAND.dark } },
    hideEventTypeDetails: false,
    layout: 'month_view',
  });

  // Cal's live "ui" theme update doesn't repaint an inline embed, so redraw it on theme change.
  const render = () => {
    const el = document.getElementById('cal-inline');
    if (!el) return;
    el.replaceChildren();
    window.Cal.ns[NS]('inline', {
      elementOrSelector: el,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: true, theme: theme() },
      calLink: CAL_LINK,
    });
    window.Cal.ns[NS]('ui', ui());
  };

  window.Cal('init', NS, { origin: 'https://app.cal.com' });
  render();
  document.addEventListener('rachell:themechange', render);
})();

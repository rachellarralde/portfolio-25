// animated ascii field behind the page — drifts on its own, ripples around the cursor
const RAMP = ' .·:-=+*%#@';
const CELL = 13;          // px per glyph cell
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const cv = document.createElement('canvas');
cv.className = 'ascii-bg';
cv.setAttribute('aria-hidden', 'true');
document.body.prepend(cv);
const ctx = cv.getContext('2d', { alpha: true });

let cols = 0, rows = 0, dpr = 1;
let mx = innerWidth / 2, my = innerHeight / 2;   // target
let cx = mx, cy = my;                            // smoothed
let accent = '#e19e74';

function readAccent() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  if (v) accent = v;
}

function hexToRgb(h) {
  const s = h.replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.floor(innerWidth * dpr);
  cv.height = Math.floor(innerHeight * dpr);
  cv.style.width = innerWidth + 'px';
  cv.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
  ctx.textBaseline = 'top';
  cols = Math.ceil(innerWidth / CELL);
  rows = Math.ceil(innerHeight / CELL);
}

function frame(now) {
  const t = now / 1000;
  cx += (mx - cx) * 0.08;
  cy += (my - cy) * 0.08;
  const [r, g, b] = hexToRgb(accent);

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let j = 0; j < rows; j++) {
    const py = j * CELL;
    for (let i = 0; i < cols; i++) {
      const px = i * CELL;
      // slow drifting interference pattern
      let v = Math.sin(i * 0.14 + t * 0.5)
            + Math.sin(j * 0.19 - t * 0.35)
            + Math.sin((i + j) * 0.08 + t * 0.22);
      v /= 3;

      // cursor ripple
      const dx = px - cx, dy = py - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const pull = Math.exp(-d / 200);
      v += pull * Math.sin(d * 0.07 - t * 3.4) * 1.6;

      const n = (v + 1) / 2;                       // 0..1
      if (n < 0.42) continue;                      // keep the field sparse
      const idx = Math.min(RAMP.length - 1, Math.max(0, Math.round(n * (RAMP.length - 1))));
      const ch = RAMP[idx];
      if (ch === ' ') continue;

      const a = (n - 0.42) * 0.34 + pull * 0.3;
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a, 0.42).toFixed(3)})`;
      ctx.fillText(ch, px, py);
    }
  }
  requestAnimationFrame(frame);
}

addEventListener('resize', resize);
addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
addEventListener('pointerdown', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
setInterval(readAccent, 400);

readAccent();
resize();
if (reduced) { cx = mx; cy = my; frameOnce(); } else { requestAnimationFrame(frame); }

function frameOnce() {
  const save = requestAnimationFrame;
  window.requestAnimationFrame = () => 0;
  frame(0);
  window.requestAnimationFrame = save;
}

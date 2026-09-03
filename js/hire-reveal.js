// hire page: animated email reveal
const EMAIL = 'rachellarralde@gmail.com';
const CMD = 'cat ~/email.txt';
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789@._-';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const btn = document.getElementById('reveal-btn');
const copy = document.getElementById('reveal-copy');
const cmd = document.getElementById('reveal-cmd');
const mail = document.getElementById('reveal-mail');
const cursor = document.getElementById('reveal-cursor');

async function scramble(el, target, cycles = 6) {
  const out = target.split('');
  for (let i = 0; i < out.length; i++) {
    for (let c = 0; c < cycles; c++) {
      const shown = out.slice(0, i).join('') + GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = shown;
      await sleep(16);
    }
    el.textContent = out.slice(0, i + 1).join('');
  }
}

async function reveal() {
  btn.disabled = true;
  if (reduced) {
    cmd.textContent = CMD;
    mail.textContent = EMAIL;
  } else {
    for (let i = 1; i <= CMD.length; i++) { cmd.textContent = CMD.slice(0, i); await sleep(38); }
    await sleep(260);
    await scramble(mail, EMAIL);
  }
  btn.hidden = true;
  copy.hidden = false;
  if (cursor) cursor.remove();
  mail.classList.add('is-revealed');
}

if (btn && cmd && mail) btn.addEventListener('click', reveal, { once: true });

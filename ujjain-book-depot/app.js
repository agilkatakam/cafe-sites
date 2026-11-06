// Rolling figures: digits cycle up to their value in a single text node (no stacked strips),
// real value kept for screen readers; settles to plain text.
(() => {
  const els = [...document.querySelectorAll('[data-roll]')];
  if (!els.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const run = (el) => {
    const value = el.textContent.trim();
    const said = Object.assign(document.createElement('span'), { className: 'sr-only', textContent: value });
    const shown = Object.assign(document.createElement('span'), { textContent: value });
    shown.setAttribute('aria-hidden', 'true');
    el.replaceChildren(said, shown);
    const chars = [...value];
    const digitIdx = chars.map((c, i) => /\d/.test(c) ? i : -1).filter((i) => i >= 0);
    const start = performance.now();
    const dur = 1050, stagger = 90;
    const tick = (now) => {
      const out = chars.slice();
      let done = true;
      digitIdx.forEach((ci, k) => {
        const target = +chars[ci];
        const t = Math.min(1, Math.max(0, (now - start - k * stagger) / dur));
        if (t < 1) { done = false; out[ci] = String(Math.min(9, Math.floor((1 - Math.pow(1 - t, 3)) * (target + 1)))); }
        else out[ci] = chars[ci];
      });
      shown.textContent = out.join('');
      if (!done) requestAnimationFrame(tick);
      else el.textContent = value; // settle to plain text
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  els.forEach((el) => io.observe(el));
})();

// Char blur scrub on the ink statement's line (words stay whole; chars blur in a wave).
(() => {
  const el = document.querySelector('.statement--ink .statement__line');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.classList.add('charblur');
  el.textContent = '';
  const chars = [];
  for (const word of text.split(/\s+/).slice(0, 12)) {
    const w = document.createElement('span');
    w.style.display = 'inline-block'; w.style.whiteSpace = 'nowrap';
    w.setAttribute('aria-hidden', 'true');
    for (const ch of word) {
      const s = document.createElement('span');
      s.className = 'cb'; s.textContent = ch;
      w.append(s); chars.push(s);
    }
    el.append(w, document.createTextNode(' '));
  }
  const onScroll = () => {
    const r = el.getBoundingClientRect();
    const vh = innerHeight;
    const raw = (vh * 0.85 - r.top) / (vh * 0.45);
    const p = Math.min(1, Math.max(0, raw));
    const maxBlur = innerWidth < 760 ? 8 : 10;
    chars.forEach((c, i) => {
      const local = Math.min(1, Math.max(0, p * (chars.length / 3.5) - i / 3.5));
      c.style.setProperty('--cb-blur', ((1 - local) * maxBlur).toFixed(1) + 'px');
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Find-your-shelf tool.
(() => {
  const chips = [...document.querySelectorAll('.chip')];
  const out = document.getElementById('tool-result');
  if (!chips.length || !out) return;
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    const shelf = chip.dataset.shelf;
    out.innerHTML = '';
    out.append(`The shop stocks ${shelf} books, per its listing - `);
    const a = Object.assign(document.createElement('a'), {
      href: `mailto:maheshsharma.ujn@gmail.com?subject=${encodeURIComponent(shelf + ' books')}`,
      textContent: 'ask about them',
    });
    out.append(a, '.');
  }));
})();

// Copy email.
document.querySelectorAll('.copybtn').forEach((b) => b.addEventListener('click', async () => {
  const v = b.dataset.copy;
  try { await navigator.clipboard.writeText(v); } catch { /* clipboard can be unavailable */ }
  const old = b.textContent; b.textContent = 'Copied';
  setTimeout(() => { b.textContent = old; }, 1600);
}));

// Mobile menu.
(() => {
  const pill = document.querySelector('.nav__pill');
  const btn = document.querySelector('.nav__menu');
  if (!pill || !btn) return;
  btn.addEventListener('click', () => {
    const open = pill.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  });
})();

// V68 Lasya Musical — contact sheet interactions. No external libraries.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- menu sheet ---------- */
const menu = document.querySelector('[data-menu]');
document.querySelector('[data-menu-open]').addEventListener('click', () => { menu.hidden = false; });
menu.querySelector('[data-menu-close]').addEventListener('click', () => { menu.hidden = true; });
menu.querySelectorAll('.menu__links a').forEach((a) => a.addEventListener('click', () => { menu.hidden = true; }));

/* ---------- Top tab after one screen ---------- */
const topTab = document.querySelector('[data-top-tab]');
addEventListener('scroll', () => {
  topTab.classList.toggle('is-on', scrollY > innerHeight);
}, { passive: true });

/* ---------- hero strip: drag-row + centre brightness + caption ---------- */
const strip = document.querySelector('[data-strip]');
const cap = document.querySelector('[data-strip-cap]');
const frames = [...strip.querySelectorAll('.frame')];
function stripCenter() {
  const mid = strip.scrollLeft + strip.clientWidth / 2;
  let best = null, bd = Infinity;
  for (const f of frames) {
    const c = f.offsetLeft + f.offsetWidth / 2;
    const d = Math.abs(c - mid);
    if (d < bd) { bd = d; best = f; }
  }
  frames.forEach((f) => f.classList.toggle('is-center', f === best));
  if (best) {
    cap.textContent = best.dataset.title;
    cap.style.left = Math.max(20, best.offsetLeft - strip.scrollLeft) + 'px';
  }
}
strip.addEventListener('scroll', () => requestAnimationFrame(stripCenter), { passive: true });
addEventListener('resize', stripCenter);
stripCenter();
let drag = null;
strip.addEventListener('pointerdown', (e) => {
  drag = { x: e.clientX, s: strip.scrollLeft };
  strip.classList.add('is-drag');
  strip.setPointerCapture(e.pointerId);
});
strip.addEventListener('pointermove', (e) => {
  if (!drag) return;
  strip.scrollLeft = drag.s - (e.clientX - drag.x);
});
['pointerup', 'pointercancel'].forEach((t) => strip.addEventListener(t, () => {
  drag = null; strip.classList.remove('is-drag');
}));

/* ---------- contact sheet: index-preview + mask-roll description ---------- */
const sheet = document.querySelector('.sheet');
const runs = [...sheet.querySelectorAll('.run')];
const descBox = document.querySelector('[data-run-desc]');
const descA = descBox.querySelector('[data-run-desc-a]');
const descB = descBox.querySelector('[data-run-desc-b]');
let descLive = descA, descNext = descB, descShown = '';
function rollDesc(text) {
  if (reduced || !text) { descLive.textContent = text || ''; descShown = text; return; }
  descNext.textContent = text;
  descNext.classList.remove('is-out'); descNext.classList.add('is-pre');
  descLive.classList.add('is-out');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    descNext.classList.remove('is-pre');
    [descLive, descNext] = [descNext, descLive];
  }));
  descShown = text;
}
runs.forEach((run) => {
  run.addEventListener('pointerenter', () => {
    sheet.dataset.active = '1';
    runs.forEach((r) => r.classList.toggle('is-active', r === run));
    rollDesc(run.dataset.desc);
  });
});
sheet.addEventListener('pointerleave', () => {
  delete sheet.dataset.active;
  runs.forEach((r) => r.classList.remove('is-active'));
});

/* ---------- scroll scrub helper ---------- */
function scrub(section, fn) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = section.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    fn(p);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- scene: one line carries the colour swap ---------- */
const lcs = document.querySelector('[data-scene="lcs"]');
if (lcs && !reduced) {
  const stage = lcs.querySelector('.lcs__stage');
  const photo = lcs.querySelector('.lcs__photo');
  const next = lcs.querySelector('.lcs__next');
  const words = [...lcs.querySelectorAll('.lcs__line span')];
  let swapped = false;
  const nextImg = next.querySelector('img');
  scrub(lcs, (p) => {
    photo.style.clipPath = `inset(0 0 ${Math.min(1, p / 0.7) * 100}% 0)`;
    next.style.clipPath = `inset(${(1 - Math.min(1, p / 0.7)) * 100}% 0 0 0)`;
    words.forEach((w, i) => w.classList.toggle('is-on', p > 0.1 + i * 0.16));
    const sw = p > 0.8;
    if (sw !== swapped) { swapped = sw; stage.classList.toggle('is-swapped', sw); }
    nextImg.style.transform = `scale(${1 + Math.max(0, p - 0.8) * 0.2})`;
  });
}

/* ---------- scene: the dot becomes the full stop ---------- */
const dfs = document.querySelector('[data-scene="dfs"]');
if (dfs && !reduced) {
  const stage = dfs.querySelector('.dfs__stage');
  const dot = dfs.querySelector('.dfs__dot');
  const words = [...dfs.querySelectorAll('.dfs__claim span:not(.dfs__dot)')];
  const support = dfs.querySelector('.dfs__support');
  let ink = false;
  scrub(dfs, (p) => {
    const drop = Math.min(1, p / 0.06);
    dot.style.transform = `translateY(${(1 - drop) * -30}svh)`;
    const steps = words.length;
    const wp = Math.min(1, Math.max(0, (p - 0.03) / 0.42)) * steps;
    words.forEach((w, i) => w.classList.toggle('is-on', wp > i + 0.4));
    const shrink = Math.min(1, Math.max(0, (p - 0.03) / 0.42));
    dot.style.fontSize = (6 - shrink * 5) + 'em';
    const cut = p > 0.56;
    if (cut !== ink) { ink = cut; stage.classList.toggle('is-ink', cut); }
    support.classList.toggle('is-on', p > 0.62);
  });
}

/* ---------- gallery inner parallax (6%) ---------- */
const gitems = [...document.querySelectorAll('[data-parallax] .gitem__crop img')];
if (gitems.length && !reduced) {
  const move = () => {
    for (const img of gitems) {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${t * -6}%)`;
    }
  };
  addEventListener('scroll', () => requestAnimationFrame(move), { passive: true });
  move();
}

/* ---------- line-blocks entrance ---------- */
document.querySelectorAll('.line').forEach((line) => {
  if (!('IntersectionObserver' in window)) { line.classList.add('is-in'); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { line.classList.add('is-in'); io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(line);
});

/* ---------- credits dialog ---------- */
const dlg = document.querySelector('[data-credits]');
document.querySelector('[data-credits-open]').addEventListener('click', () => dlg.showModal());
dlg.querySelector('[data-credits-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- hide the corner action while the footer carries it ---------- */
const hudAction = document.querySelector('.hud__bl');
const footer = document.querySelector('.foot');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { e.target.dataset.cover = e.isIntersecting ? '1' : ''; hudAction.style.visibility = document.querySelector('[data-cover="1"]') ? 'hidden' : 'visible'; });
  }, { threshold: 0.15 });
  io.observe(footer);
  io.observe(document.querySelector('.list'));
  io.observe(lcs);
  io.observe(dfs);
}

// tasteskill / base.js — the small amount of script the motion helpers in base.css need.
// Put this line in <head> so the hidden states only apply when scripting works:
//   <script>document.documentElement.classList.add('js')</script>
// Then load this file at the end of <body> (or with defer).

// Reveal once when an element enters the viewport. Never replays, never leaves content hidden. With a dealt
// entrance, base.css decides what a data-reveal does (most do nothing).
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  targets.forEach((el) => io.observe(el));
  // safety net: if anything is still hidden a few seconds after load (observer never fired), show it
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// The entrance (base.css). The hero picture: one that has nothing to paint at the first frame waits on its
// frame's ground (data-e-wait) instead of opening, sharpening or brightening an empty box. If it lands within
// 0.7 s the entrance plays from its start; later (and always under already-there) it fades in over 320 ms; the
// slot is never left empty for more than 3 s. Paste this block in a <script> right after the hero as well, so it
// runs before the first paint (motion.md, "The hero picture"); here it covers a page that did not.
(() => {
  if (!document.body || !document.body.dataset.entrance || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const f of document.querySelectorAll('[data-hero] [data-e="picture"]:not([data-e-wait])')) {
    const m = f.querySelector(':scope > img, :scope > video, :scope > picture > img');
    if (!m || (m.tagName === 'VIDEO' ? m.readyState >= 2 : m.complete && m.naturalWidth)) continue;
    f.setAttribute('data-e-wait', '');
    let done = false;
    const land = () => {
      if (done) return; done = true;
      if (performance.now() < 700 && document.body.dataset.entrance !== 'already-there') f.removeAttribute('data-e-wait');
      else f.setAttribute('data-e-wait', 'late');
    };
    m.addEventListener(m.tagName === 'VIDEO' ? 'loadeddata' : 'load', land, { once: true });
    m.addEventListener('error', land, { once: true });
    setTimeout(land, 3000);
  }
})();

// already-there: lazy pictures further down get the same courtesy as the hero: they wait on their ground and fade
// in as they land (loading, not a reveal).
(() => {
  if (!document.body || !document.body.matches('[data-entrance="already-there"]')) return;
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete || img.naturalWidth) return;
    img.classList.add('is-waiting');
    const show = () => { img.classList.add('is-arriving'); img.classList.remove('is-waiting'); };
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
  });
})();

// product-at-work: a fragment whose top is below 60% of the screen (on a phone it sits at the fold) holds its
// figure, chart and rows (data-e-hold pauses them where they start) until it is in view.
(() => {
  if (!document.body || !document.body.matches('[data-entrance="product-at-work"]') || !('IntersectionObserver' in window)) return;
  const f = [...document.querySelectorAll('[data-hero] [data-e="picture"]')].find((x) => x.getClientRects().length);
  if (!f || f.getBoundingClientRect().top < innerHeight * 0.6) return;
  f.setAttribute('data-e-hold', '');
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    f.removeAttribute('data-e-hold'); io.disconnect();
  }, { rootMargin: '0px 0px -40% 0px' });
  io.observe(f);
})();

// Optional, for "colour by chapter": each chapter paints its own full-bleed ground in CSS
// (style="background: var(--field-2); color: var(--field-2-ink)"), so the colour changes exactly at
// section edges. This only lets a fixed header take the ink of the chapter under it. Give each chapter
// data-ink="#hex" and style the header with color: var(--header-ink, var(--ink)).
// Never recolour the whole page from an observer: mid-change, a paragraph sits on two colours.
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink);
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();

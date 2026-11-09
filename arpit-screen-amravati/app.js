/* V73 Arpit Screen - menu, side index (hide over scene/band, current section, action aside), credits, char blur scrub */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- menu overlay ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      const open = menuOverlay.hidden;
      menuOverlay.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menuOverlay.addEventListener('click', (e) => {
      if (e.target.closest('a')) { menuOverlay.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- credits dialog ---------- */
  const creditsLink = document.getElementById('creditsLink');
  const creditsDialog = document.getElementById('creditsDialog');
  if (creditsLink && creditsDialog) {
    creditsLink.addEventListener('click', () => creditsDialog.showModal());
  }

  /* ---------- side index: hides over the scene and the full-bleed band, tracks the current section ---------- */
  const sideIndex = document.getElementById('sideIndex');
  if (sideIndex && 'IntersectionObserver' in window) {
    const covering = new Map();
    const coverIO = new IntersectionObserver((entries) => {
      for (const e of entries) covering.set(e.target, e.isIntersecting);
      sideIndex.classList.toggle('is-hidden', [...covering.values()].some(Boolean));
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    ['intro', 'wordings'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) coverIO.observe(el);
    });

    const idxLinks = [...sideIndex.querySelectorAll('a[data-idx]')];
    const setCurrent = (id) => idxLinks.forEach((a) => a.classList.toggle('is-current', a.dataset.idx === id));
    const visible = new Map();
    const trackIO = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target.id, e.intersectionRatio);
      let best = null, bestRatio = 0;
      for (const [id, ratio] of visible) if (ratio > bestRatio) { best = id; bestRatio = ratio; }
      if (best) setCurrent(best);
    }, { threshold: [0, 0.15, 0.4, 0.7] });
    ['intro', 'shelves', 'wordings', 'write'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) trackIO.observe(el);
    });
  }

  /* ---------- the one action steps aside while a section's or footer's button to its place is on screen ---------- */
  const asideTargets = [document.getElementById('indexAction'), document.querySelector('.bar-action')].filter(Boolean);
  if (asideTargets.length && 'IntersectionObserver' in window) {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting);
      const cover = [...seen.values()].some(Boolean);
      asideTargets.forEach((t) => t.classList.toggle('is-aside', cover));
    }, { threshold: 0.2 });
    document.querySelectorAll('.scene-cta .btn, .footer-cta .btn').forEach((el) => io.observe(el));
  }

  /* ---------- char blur scrub: one headline, focus runs like a wave (dealt small move) ---------- */
  const scrubEl = document.querySelector('[data-blurscrub]');
  if (scrubEl && !reduced) {
    const text = scrubEl.textContent.trim().replace(/\s+/g, ' ');
    scrubEl.textContent = '';
    scrubEl.setAttribute('aria-label', text);
    const chars = [];
    // words keep their chars together: whole words wrap, never a split inside a word
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.setAttribute('aria-hidden', 'true');
      w.style.display = 'inline-block';
      w.style.whiteSpace = 'nowrap';
      for (const ch of word) {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.display = 'inline-block';
        w.appendChild(s);
        chars.push(s);
      }
      scrubEl.appendChild(w);
      if (wi < words.length - 1) scrubEl.appendChild(document.createTextNode(' '));
    });
    const phone = matchMedia('(max-width: 760px)').matches;
    const maxBlur = phone ? 8 : 12;
    let smooth = 0, rafId = null;
    const render = () => {
      rafId = null;
      const vh = innerHeight;
      const r = scrubEl.getBoundingClientRect();
      const y = r.top / vh;
      // focus on the way in and stay crisp once read - never re-blur the settled line
      const target = Math.max(0, Math.min(1, (0.85 - y) / 0.45));
      smooth += (target - smooth) * 0.35;
      const n = chars.length;
      for (let i = 0; i < n; i++) {
        const local = Math.max(0, Math.min(1, (smooth * (n + 4) - i) / 4)); // every char fully crisp at smooth=1
        const b = maxBlur * (1 - local);
        chars[i].style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : '';
      }
      if (Math.abs(target - smooth) > 0.002) rafId = requestAnimationFrame(render);
    };
    const kick = () => { if (!rafId) rafId = requestAnimationFrame(render); };
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    kick();
  }
})();

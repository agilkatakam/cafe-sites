// V69 page behaviours: ink-fill statement, gallery grow, crossfade frame,
// dock hide during live scenes, scrollspy, credits dialog.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- scroll ink fill ---
  const ink = document.querySelector('[data-inkfill]');
  if (ink && !reduced) {
    const words = ink.textContent.trim().split(/\s+/);
    ink.setAttribute('aria-label', ink.textContent.trim());
    ink.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    const spans = [...ink.querySelectorAll('.w')];
    const fill = () => {
      const r = ink.getBoundingClientRect();
      const vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.4 + r.height)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('is-lit', i < lit));
    };
    addEventListener('scroll', fill, { passive: true });
    fill();
  }

  // --- gallery grows from small ---
  const frames = [...document.querySelectorAll('[data-grow]')];
  if (frames.length && !reduced) {
    const imgs = frames.map((f) => f.querySelector('img'));
    const grow = () => {
      const vh = innerHeight;
      frames.forEach((f, i) => {
        const r = f.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.45)));
        const e = p * (2 - p); // easeOutQuad-ish scrub smoothing
        f.style.transform = `scale(${0.2 + 0.8 * e})`;
        if (imgs[i]) imgs[i].style.transform = `translateY(${3 - 6 * p}%) scale(1.12)`;
      });
    };
    addEventListener('scroll', grow, { passive: true });
    grow();
  }

  // --- crossfade frame ---
  const xf = document.querySelector('[data-crossfade]');
  if (xf && !reduced) {
    let on = false;
    const tick = () => {
      if (document.hidden) return;
      on = !on;
      xf.classList.toggle('is-alt-on', on);
    };
    setInterval(tick, 5600);
  }

  // --- dock hides while a live scene holds the screen ---
  const scenes = [...document.querySelectorAll('.scene')];
  const contact = document.getElementById('contact');
  const dockWatch = () => {
    const holding = scenes.some((s) => {
      if (!s.classList.contains('is-live')) return false;
      const r = s.getBoundingClientRect();
      return r.top <= 4 && r.bottom >= innerHeight - 4;
    });
    let overClose = false;
    if (contact) {
      const r = contact.getBoundingClientRect();
      overClose = r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.35;
    }
    document.body.classList.toggle('dock-hidden', holding || overClose);
  };
  addEventListener('scroll', dockWatch, { passive: true });
  setInterval(dockWatch, 500);
  dockWatch();

  // --- scrollspy for dock links ---
  const spies = [...document.querySelectorAll('[data-spy]')];
  const targets = spies.map((a) => document.getElementById(a.dataset.spy)).filter(Boolean);
  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        spies.forEach((a) => a.classList.toggle('is-current', a.dataset.spy === e.target.id));
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    targets.forEach((t) => io.observe(t));
  }

  // --- credits dialog ---
  const dlg = document.querySelector('[data-credits]');
  const open = document.querySelector('[data-credits-open]');
  if (dlg && open) open.addEventListener('click', () => dlg.showModal());
})();

// scenes boot
if (window.Stage) {
  if (Stage.smooth) Stage.smooth();
  Stage.init();
  if (Stage.ready) Stage.ready();
}

// --- hide the dock while the footer or the statement is on screen ---
(() => {
  const dock = document.querySelector('.dock');
  const zones = [...document.querySelectorAll('footer, .statement')];
  if (!dock || !zones.length || !('IntersectionObserver' in window)) return;
  const visible = new Set();
  const io = new IntersectionObserver((es) => {
    es.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    dock.classList.toggle('is-hidden', visible.size > 0);
  }, { rootMargin: '0px 0px -40px 0px' });
  zones.forEach(z => io.observe(z));
})();

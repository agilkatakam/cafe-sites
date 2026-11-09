// V75 - New Sardar Motorcycle & Scooter Works, Amritsar
(() => {
  const menuBtn = document.querySelector('.bar-menu');
  const menuPanel = document.getElementById('menu-panel');
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', () => {
      const open = !menuPanel.hasAttribute('hidden');
      if (open) { menuPanel.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false'); }
      else { menuPanel.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded', 'true'); }
    });
    menuPanel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menuPanel.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }
  const names = Array.from(document.querySelectorAll('.disc-name'));
  const disc = document.getElementById('disc');
  const fact = document.getElementById('disc-fact');
  const obj = document.getElementById('disc-object');
  names.forEach((btn) => btn.addEventListener('click', () => {
    names.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const w = document.getElementById('disc-word'); if (w) w.textContent = btn.textContent;
    if (disc && btn.dataset.tint) { const dark = btn.dataset.tint === '#273546'; if (w) w.style.color = dark ? '#f2f7ff' : '#132031'; }
    if (disc && btn.dataset.tint) disc.style.background = btn.dataset.tint;
    if (fact && btn.dataset.fact) fact.textContent = btn.dataset.fact;
  }));
  const bike = document.getElementById('eq-bike');
  const issue = document.getElementById('eq-issue');
  const preview = document.getElementById('eq-preview');
  const send = document.getElementById('eq-send');
  const compose = () => {
    const b = bike.value, i = issue.value;
    const subject = `Enquiry: ${b}, ${i}`;
    const body = `hello new sardar motorcycle and scooter works,\n\nthis is an enquiry about ${b}, ${i}.\n\n`;
    preview.textContent = `"${subject}"`;
    send.href = `mailto:hs7351172@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  if (bike && issue && preview && send) { bike.addEventListener('change', compose); issue.addEventListener('change', compose); compose(); }
  const open = document.getElementById('credits-open');
  const dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  // slow photograph: one gentle drift on scroll
  const road = document.getElementById('road');
  if (road && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tick = () => {
      const r = road.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      road.style.setProperty('--drift', `${Math.max(-1, Math.min(1, p)) * -8}%`);
    };
    addEventListener('scroll', tick, { passive: true }); tick();
  }
  // rolling figures: count up once
  const figs = document.querySelectorAll('[data-roll]');
  if (figs.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const end = +e.target.dataset.roll, t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1400); e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else e.target.textContent = end; };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    figs.forEach((f) => io.observe(f));
  }
  // statement ink fill
  const fill = document.querySelector('[data-fill]');
  if (fill && window.gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(fill, { opacity: 0.35 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: fill, start: 'top 85%', end: 'top 40%', scrub: true } });
  }
})();

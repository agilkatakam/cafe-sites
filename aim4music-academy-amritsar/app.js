// V76 - Aim4Music Academy, Amritsar
(() => {
  const bar = document.querySelector('.bar');
  const mark = document.querySelector('.bar-mark');
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setBar = () => {
    const y = scrollY, p = Math.max(0, Math.min(1, y / 240));
    bar.style.setProperty('--p', p.toFixed(3));
    mark.style.transform = `translateX(-50%) scale(${(1 - (innerWidth < 900 ? 0.4 : 0.65) * p).toFixed(3)})`;
    bar.classList.toggle('is-band', p >= 1);
  };
  addEventListener('scroll', setBar, { passive: true }); setBar();
  // pointer shifts the hero blocks by up to 4%
  const hero = document.querySelector('.hero');
  if (hero && !reduce && matchMedia('(min-width: 900px)').matches) {
    let tgt = 62, cur = 62;
    hero.addEventListener('pointermove', (e) => { tgt = 62 + (e.clientX / innerWidth) * 4; });
    const loop = () => { cur += (tgt - cur) * 0.08; root.style.setProperty('--cut', cur.toFixed(2)); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  const mb = document.querySelector('.bar-menu'), mp = document.getElementById('menu-panel');
  if (mb && mp) {
    mb.addEventListener('click', () => { const o = !mp.hasAttribute('hidden'); mp.toggleAttribute('hidden', o); mb.setAttribute('aria-expanded', String(!o)); });
    mp.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { mp.setAttribute('hidden', ''); mb.setAttribute('aria-expanded', 'false'); }));
  }
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    // gallery photographs drift at their own rate
    document.querySelectorAll('.g').forEach((g, i) => {
      gsap.fromTo(g, { y: 40 * (i % 2 ? -1 : 1) }, { y: -40 * (i % 2 ? -1 : 1), ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
})();

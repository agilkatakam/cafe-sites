// V77 - Josan Sports, Hall Bazar, Amritsar
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  // marquee pauses on hover or focus
  const mq = document.querySelector('.marq');
  if (mq) { mq.addEventListener('pointerenter', () => mq.classList.add('is-paused')); mq.addEventListener('pointerleave', () => mq.classList.remove('is-paused')); }
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    // brackets close in: scrubbed from 85% to 50% of the viewport
    const far = innerWidth < 700 ? 120 : 300;
    const row = document.querySelector('.brk-row');
    if (row) {
      const st = { trigger: row, start: 'top 85%', end: 'top 50%', scrub: true };
      gsap.fromTo('.brk-l', { x: -far }, { x: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.brk-r', { x: far }, { x: 0, ease: 'none', scrollTrigger: st });
    }
  }
})();

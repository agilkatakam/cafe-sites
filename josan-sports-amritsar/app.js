// V77 - Josan Sports, Hall Bazar, Amritsar
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the dock hides on the way down (so it never sits over what is being read) and returns on the way up or at the page ends
  const dock = document.querySelector('.dock');
  if (dock) {
    let last = Math.max(0, scrollY);
    addEventListener('scroll', () => {
      const y = Math.max(0, scrollY), d = y - last, end = y + innerHeight >= document.documentElement.scrollHeight - 40;
      if (y < 200 || end || d < -8) { dock.classList.remove('is-away'); last = y; }
      else if (d > 8) { dock.classList.add('is-away'); last = y; }
    }, { passive: true });
  }
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

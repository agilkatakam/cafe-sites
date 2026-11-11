// V79 - Radhika Toys and Gifts, Janakpuri, Bareilly
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the dock slides away only while the pinned scene holds
  const dock = document.querySelector('.dock'), sc = document.querySelector('.scene');
  let last = Math.max(0, scrollY);
  if (dock && sc) addEventListener('scroll', () => {
    const r = sc.getBoundingClientRect(), y = Math.max(0, scrollY), d = y - last, end = y + innerHeight >= document.documentElement.scrollHeight - 40;
    const holding = r.top <= 0 && r.bottom >= innerHeight && sc.classList.contains('is-live');
    if (holding) dock.classList.add('is-away');
    else {
      // the dock steps aside while scrolling down so it never sits over what is being read; back on the way up or at the ends
      if (y < 200 || end || d < -8) { dock.classList.remove('is-away'); last = y; }
      else if (d > 8) { dock.classList.add('is-away'); last = y; }
    }
  }, { passive: true });
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  if (!(window.gsap && window.ScrollTrigger) || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  // late word: starts 96px lower, slides up over 60svh of scroll
  gsap.fromTo('.late', { y: innerWidth < 800 ? 48 : 96 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: () => '+=' + Math.round(innerHeight * 0.6), scrub: true } });
  // scroll ink fill: words fill in
  const t = document.querySelector('[data-fill]');
  if (t) {
    t.innerHTML = t.textContent.trim().split(/\s+/).map((w) => '<span class="w">' + w + '</span>').join(' ');
    gsap.fromTo(t.querySelectorAll('.w'), { opacity: 0.22 }, { opacity: 1, stagger: 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }
  // picture widens from inset to full width
  const e = document.querySelector('[data-edge]');
  if (e) gsap.fromTo(e, { marginLeft: () => innerWidth * 0.2, marginRight: () => innerWidth * 0.2 }, { marginLeft: 0, marginRight: 0, ease: 'none', scrollTrigger: { trigger: e, start: 'top 90%', end: 'top 20%', scrub: true, invalidateOnRefresh: true } });
})();

/* V71 - Jaiswal Hardware & Plumbing */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- fixed nav appears once the hero's own bar has scrolled away ---------- */
  const navFixed = document.querySelector('.nav-fixed');
  const hero = document.querySelector('.hero');
  navFixed.hidden = false;
  navFixed.style.opacity = '0';
  navFixed.style.pointerEvents = 'none';
  const setNav = (on) => {
    navFixed.style.opacity = on ? '1' : '0';
    navFixed.style.pointerEvents = on ? 'auto' : 'none';
  };
  new IntersectionObserver(
    (entries) => setNav(!entries[0].isIntersecting),
    { rootMargin: '-96px 0px 0px 0px', threshold: 0 }
  ).observe(hero);

  /* ---------- the bar's Call action steps aside while the showcase's is on screen ---------- */
  const actionTab = document.getElementById('nav-action-tab');
  const showcase = document.querySelector('.showcase');
  new IntersectionObserver(
    (entries) => actionTab.classList.toggle('is-hidden', entries[0].isIntersecting),
    { threshold: 0 }
  ).observe(showcase);

  /* ---------- full-screen menu ---------- */
  const overlay = document.getElementById('menu-overlay');
  document.getElementById('menu-open').addEventListener('click', () => { overlay.hidden = false; });
  document.getElementById('menu-close').addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', (e) => { if (e.target.closest('a')) overlay.hidden = true; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.hidden = true; });

  /* ---------- late word slides into the hero headline (scrub, no pin) ---------- */
  const late = document.getElementById('late-word');
  if (late && hasGsap && !reduced) {
    const lateDist = matchMedia('(min-width: 1024px)').matches ? 128 : 96;
    gsap.fromTo(late, { y: lateDist }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=60%', scrub: true }
    });
  }

  /* ---------- intro: word 4 rises into place (120px over 80svh) ---------- */
  const w4 = document.getElementById('w4');
  if (w4 && hasGsap && !reduced) {
    gsap.fromTo(w4, { y: 120, immediateRender: false }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.intro', start: 'top bottom', end: 'top 75%', scrub: true }
    });
  }

  /* ---------- brackets close in (300px -> 0, scrubbed 85% -> 50%) ---------- */
  if (hasGsap && !reduced) {
    gsap.fromTo('.bk-l', { x: -300, immediateRender: false }, {
      x: 0, ease: 'none',
      scrollTrigger: { trigger: '.brackets', start: 'top 85%', end: 'top 50%', scrub: true }
    });
    gsap.fromTo('.bk-r', { x: 300, immediateRender: false }, {
      x: 0, ease: 'none',
      scrollTrigger: { trigger: '.brackets', start: 'top 85%', end: 'top 50%', scrub: true }
    });
  }

  /* ---------- features: hover a name, its one-liner shows in the empty columns ---------- */
  const gloss = document.getElementById('feature-gloss');
  if (gloss && matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    for (const fn of document.querySelectorAll('.fn')) {
      fn.addEventListener('mouseenter', () => { gloss.textContent = fn.dataset.gloss; });
      fn.addEventListener('focus', () => { gloss.textContent = fn.dataset.gloss; });
    }
    document.querySelector('.feature-cols').addEventListener('mouseleave', () => { gloss.textContent = ''; });
  }

  /* ---------- marquee: duplicate until the loop is seamless ---------- */
  const track = document.getElementById('marquee-track');
  if (track) {
    const half = () => track.children[0].getBoundingClientRect().width;
    let guard = 0;
    while (half() < innerWidth && guard++ < 4) {
      track.appendChild(track.children[0].cloneNode(true));
      track.appendChild(track.children[0].cloneNode(true));
    }
  }

  /* ---------- footer enquiry form: opens the visitor's mail app to the shop ---------- */
  const form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('enquiry-email').value.trim();
      const body = email
        ? `My email is ${email}. I would like to ask about plumbing work.`
        : 'I would like to ask about plumbing work.';
      location.href = 'mailto:srijanjaiswal786@gmail.com'
        + '?subject=' + encodeURIComponent('Plumbing work enquiry')
        + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- credits dialog ---------- */
  const dlg = document.getElementById('credits');
  document.getElementById('credits-open').addEventListener('click', () => dlg.showModal());
})();

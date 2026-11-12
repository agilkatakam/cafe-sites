// V81 - Mujawar Refrigeration & Home Appliances, Belgaum
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  // the form opens a filled email to the business; nothing is sent from the page
  const f = document.getElementById('enq');
  if (f) f.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const body = 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\n\n' + d.get('message');
    location.href = 'mailto:moazammujawar@gmail.com?subject=' + encodeURIComponent('Enquiry') + '&body=' + encodeURIComponent(body);
  });
  if (!(window.gsap && window.ScrollTrigger) || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  // ink fill: the statement goes from 45% to full ink, word by word, as it rises
  const h = document.querySelector('[data-fill]');
  if (h) {
    h.setAttribute('aria-label', h.textContent);
    h.innerHTML = h.textContent.split(' ').map((w) => '<span class="w" aria-hidden="true">' + w + '</span>').join(' ');
    const ws = [...h.querySelectorAll('.w')];
    gsap.set(ws, { opacity: 0.45 });
    ScrollTrigger.create({ trigger: h, start: 'top 75%', end: 'bottom 50%', scrub: true, onUpdate: (s) => {
      const p = s.progress * ws.length;
      ws.forEach((w, i) => { w.style.opacity = (0.45 + 0.55 * Math.max(0, Math.min(1, p - i))).toFixed(2); });
    } });
  }
  // the finished statement fades out as the scene hands over, so it never slides under the fixed pill
  const sc = document.querySelector('[data-scene="dot-becomes-the-full-stop"]');
  if (sc) { const st = sc.querySelector('.scene-stage'); if (st) ScrollTrigger.create({ trigger: sc, start: 'bottom 95%', end: 'bottom 60%', scrub: true, onUpdate: (s) => { st.style.opacity = (1 - s.progress).toFixed(2); } }); }
  // the hero picture drifts slowly
  const img = document.querySelector('.hero-r img');
  if (img) gsap.fromTo(img, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
})();

// V84 - New Santosh Juice Center
(() => {
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());

  // bar collapses on scroll
  const bar = document.getElementById('bar');
  const sc = () => bar.classList.toggle('is-small', window.scrollY > 40);
  sc(); addEventListener('scroll', sc, { passive: true });

  // open-now tool: listed hours 6:30am to 12am every day, shop time (India)
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const mins = (+get('hour') % 24) * 60 + +get('minute');
  const dayIdx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
  const out = document.getElementById('open-now');
  const isOpen = mins >= 6 * 60 + 30;
  if (out) out.textContent = isOpen ? 'By its listed hours, it is open now, until 12am.' : 'By its listed hours, it is closed now and opens at 6:30am.';
  const today = document.querySelector(`.bands li[data-day="${dayIdx}"]`);
  if (today) today.classList.add('is-today');

  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = () => {
    if (!window.gsap || !window.ScrollTrigger || rm) return;
    gsap.registerPlugin(ScrollTrigger);
    // rounded tile goes edge
    const tile = document.getElementById('tile');
    if (tile) {
      const m = getComputedStyle(document.documentElement).getPropertyValue('--margin');
      const px = parseFloat(getComputedStyle(tile).clipPath.match(/inset\(0px ([\d.]+)px/)?.[1] || 40);
      const state = { v: 1 };
      ScrollTrigger.create({ trigger: tile, start: 'top 90%', end: 'top 30%', scrub: true, onUpdate: (s) => {
        const p = s.progress; tile.style.clipPath = `inset(0 ${(px * (1 - p)).toFixed(1)}px round ${(16 * (1 - p)).toFixed(1)}px)`;
      } });
    }
    // the finished statement fades as it nears the bar, so no readable text sits under it
    const nx = document.querySelector('.lbf-next');
    const sceneEl = document.querySelector('[data-scene]');
    if (nx && sceneEl) ScrollTrigger.create({ trigger: sceneEl, start: 'bottom 88%', end: 'bottom 64%', scrub: true, onUpdate: (s) => { nx.style.opacity = (1 - s.progress).toFixed(2); } });
    // char blur scrub on the hours heading
    const h = document.querySelector('[data-blur]');
    if (h && !h.dataset.split) {
      h.dataset.split = '1';
      const label = h.textContent.replace(/\s+/g, ' ').trim();
      h.setAttribute('aria-label', label);
      const chars = [];
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const f = document.createDocumentFragment();
            for (const ch of n.textContent) { const s = document.createElement('span'); s.setAttribute('aria-hidden', 'true'); s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; s.textContent = ch; f.append(s); chars.push(s); }
            n.replaceWith(f);
          } else walk(n);
        });
      };
      walk(h);
      const peak = innerWidth < 700 ? 8 : 10;
      gsap.fromTo(chars, { filter: `blur(${peak}px)` }, { filter: 'blur(0px)', ease: 'none', stagger: { each: 0.05 }, scrollTrigger: { trigger: h, start: 'top 85%', end: 'top 40%', scrub: 0.6 } });
    }
  };
  if (document.readyState === 'complete') run(); else addEventListener('load', run);
})();

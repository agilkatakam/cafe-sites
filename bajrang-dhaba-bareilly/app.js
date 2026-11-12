// V80 - Bajrang Dhaba, Sanjay Nagar, Bareilly
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // menu panel
  const btn = document.getElementById('menu-btn'), menu = document.getElementById('menu');
  const setMenu = (on) => { menu.classList.toggle('is-open', on); btn.textContent = on ? 'Close' : 'Menu'; btn.setAttribute('aria-expanded', on); menu.setAttribute('aria-hidden', !on); menu.inert = !on; };
  btn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  // credits
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  // the tool: pick a kind, see its listed names (no script: all lists show)
  const cards = [...document.querySelectorAll('.card')], lists = document.getElementById('lists');
  cards.forEach((c) => c.addEventListener('click', () => {
    const on = c.getAttribute('aria-pressed') !== 'true';
    cards.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', on);
    lists.classList.toggle('is-filter', on);
    lists.querySelectorAll('.list').forEach((l) => l.classList.toggle('is-on', on && l.dataset.k === c.dataset.k));
  }));
  if (!(window.gsap && window.ScrollTrigger) || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  const phone = innerWidth < 800;
  // card stack fans out as the section crosses the screen
  if (!phone) {
    const spread = [-1, -0.5, 0, 0.5, 1];
    cards.forEach((c, i) => {
      const s = spread[i];
      gsap.fromTo(c, { x: -s * 120, y: 0, rotate: 0, scale: 1 }, { x: s * 400 * 0.5, y: Math.abs(s) * 30, rotate: s * 12, scale: 1 - Math.abs(s) * 0.12, ease: 'none', scrollTrigger: { trigger: '.fan', start: 'top 85%', end: 'top 35%', scrub: true } });
    });
  }
  // colour wave through the heading
  const h = document.querySelector('[data-wave]');
  if (h) {
    h.setAttribute('aria-label', h.textContent);
    h.innerHTML = [...h.textContent].map((c) => c === ' ' ? ' ' : '<span class="ch" aria-hidden="true">' + c + '</span>').join('');
    const chs = [...h.querySelectorAll('.ch')], n = chs.length, win = 8;
    ScrollTrigger.create({ trigger: h, start: 'top 80%', end: 'top 40%', scrub: true, onUpdate: (self) => {
      const pos = self.progress * (n + win);
      chs.forEach((c, i) => { const d = pos - i; c.style.color = d > 0 && d < win ? '#8c8a8a' : ''; });
    } });
  }
})();

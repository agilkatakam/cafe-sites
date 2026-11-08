/* Mkb Computer - behaviours: scenes, menu panel, strip lens, marquee is CSS, tool, colour wave, credits. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scenes */
  if (window.Stage) { Stage.smooth(); Stage.init(); }

  /* menu panel */
  const panel = document.querySelector('[id="menu-panel"]');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const setPanel = (open) => {
    if (open) {
      panel.hidden = false;
      panel.classList.add('is-opening');
      openBtn.setAttribute('aria-expanded', 'true');
      closeBtn.focus();
    } else {
      panel.hidden = true;
      panel.classList.remove('is-opening');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }
  };
  openBtn.addEventListener('click', () => setPanel(true));
  closeBtn.addEventListener('click', () => setPanel(false));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setPanel(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) setPanel(false); });

  /* nav action steps aside when another same-destination button is on screen */
  const navAction = document.querySelector('[data-nav-action]');
  if (navAction && 'IntersectionObserver' in window) {
    const mailtoZones = document.querySelectorAll('.contact, .footer, .hero');
    let covered = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { covered += en.isIntersecting ? 1 : -1; });
      navAction.classList.toggle('is-away', covered > 0);
    }, { threshold: 0.08 });
    mailtoZones.forEach((z) => io.observe(z));
  }

  /* hero strip: lens brightness + caption tracking */
  const strip = document.querySelector('[data-strip]');
  const caption = document.querySelector('[data-strip-caption]');
  if (strip && caption) {
    const frames = [...strip.querySelectorAll('.hero__frame')];
    const photo = strip.querySelector('.hero__frame--photo');
    const centre = () => {
      const sr = strip.getBoundingClientRect();
      const mid = sr.left + sr.width / 2;
      let best = null, bd = Infinity;
      frames.forEach((f) => {
        const r = f.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        f.classList.toggle('is-centre', false);
        if (d < bd) { bd = d; best = f; }
      });
      if (best) {
        best.classList.add('is-centre');
        caption.textContent = best.dataset.title || '';
        const r = best.getBoundingClientRect();
        caption.style.left = Math.max(16, r.left) + 'px';
      }
    };
    const centrePhoto = () => {
      const r = photo.getBoundingClientRect();
      strip.scrollLeft += (r.left + r.width / 2) - (innerWidth / 2);
      centre();
    };
    let ticking = false;
    strip.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { centre(); ticking = false; });
    }, { passive: true });
    addEventListener('resize', centre);
    centrePhoto();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(centrePhoto);
    setTimeout(centrePhoto, 600);
  }

  /* tool: symptom matcher */
  const rows = document.querySelector('[data-tool-rows]');
  const result = document.querySelector('[data-tool-result]');
  if (rows && result) {
    const answerEl = result.querySelector('[data-tool-answer]');
    const mailEl = result.querySelector('[data-tool-mail]');
    rows.querySelectorAll('.trow').forEach((row) => {
      row.addEventListener('click', () => {
        rows.querySelectorAll('.trow').forEach((r) => r.classList.remove('is-on'));
        row.classList.add('is-on');
        answerEl.textContent = row.dataset.answer;
        mailEl.href = 'mailto:mkbcomputer10@gmail.com?subject=' + encodeURIComponent('Repair enquiry: ' + row.dataset.symptom);
        result.hidden = false;
      });
    });
  }

  /* colour wave through the underlay word */
  const anchor = document.querySelector('[data-wave-anchor]');
  const word = document.querySelector('[data-wave]');
  if (anchor && word && !reduce) {
    const text = word.textContent;
    word.textContent = '';
    const chars = [...text].map((c) => {
      const s = document.createElement('span');
      s.className = 'wch';
      s.textContent = c;
      word.appendChild(s);
      return s;
    });
    const n = chars.length, win = 8;
    const paint = () => {
      const r = anchor.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      const pos = p * (n + win) - win / 2;
      chars.forEach((s, i) => {
        s.style.color = (i >= pos - win / 2 && i < pos + win / 2) ? 'var(--accent)' : '';
      });
    };
    let wt = false;
    addEventListener('scroll', () => {
      if (wt) return; wt = true;
      requestAnimationFrame(() => { paint(); wt = false; });
    }, { passive: true });
    paint();
  }

  /* credits dialog */
  const dlg = document.querySelector('[data-credits]');
  const openCredits = document.querySelector('[data-credits-open]');
  if (dlg && openCredits) openCredits.addEventListener('click', () => dlg.showModal());
})();

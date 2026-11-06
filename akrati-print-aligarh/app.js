// V58 Akrati Print — motion layer
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero depth cloud: pointer shift by depth + upward drift on scroll
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || reduced) return;
  let px = 0, py = 0, sy = 0, raf = 0;
  const paint = () => {
    raf = 0;
    hero.style.setProperty('--px', px);
    hero.style.setProperty('--py', py);
    hero.style.setProperty('--sy', sy);
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
  hero.style.setProperty('--px', 0);
  addEventListener('pointermove', (e) => {
    px = (e.clientX / innerWidth) - 0.5;
    py = (e.clientY / innerHeight) - 0.5;
    ask();
  }, { passive: true });
  addEventListener('scroll', () => {
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0) return;
    sy = Math.min(scrollY, innerHeight);
    ask();
  }, { passive: true });
})();

// Rolling figures (motion.md recipe): plain value at rest; strips exist only during the roll
(() => {
  const els = [...document.querySelectorAll('[data-roll]')];
  if (!els.length || !('IntersectionObserver' in window)) return;
  const roll = (el) => {
    if (reduced) return;
    const value = el.dataset.value || el.textContent.trim();
    el.dataset.value = value;
    const said = Object.assign(document.createElement('span'), { className: 'sr-only', textContent: value });
    const shown = Object.assign(document.createElement('span'), { className: 'roll__digits' });
    shown.setAttribute('aria-hidden', 'true');
    let i = 0;
    for (const ch of value) {
      if (!/\d/.test(ch)) { shown.append(ch); continue; }
      const col = Object.assign(document.createElement('span'), { className: 'roll__col' });
      const strip = Object.assign(document.createElement('span'), { className: 'roll__strip' });
      strip.style.setProperty('--d', ch);
      strip.style.setProperty('--i', i++);
      for (let n = 0; n < 10; n++) strip.append(Object.assign(document.createElement('span'), { textContent: n }));
      col.append(strip);
      shown.append(col);
    }
    el.classList.add('roll');
    el.replaceChildren(said, shown);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    const settle = 1300 + i * 70;
    setTimeout(() => { el.classList.remove('roll', 'is-in'); el.textContent = value; }, settle);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { roll(e.target); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -15% 0px' });
  els.forEach((el) => io.observe(el));
})();

// Side index: current section + hide over the ink band and footer
(() => {
  const index = document.querySelector('.index');
  if (!index) return;
  const links = [...index.querySelectorAll('[data-index]')];
  const secs = links.map((a) => document.getElementById(a.dataset.index)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const a = links.find((l) => l.dataset.index === e.target.id);
        if (a && e.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-current'));
          a.classList.add('is-current');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    secs.forEach((s) => io.observe(s));
    const cover = document.querySelector('.cover');
    const foot = document.querySelector('.foot');
    const hide = new IntersectionObserver((entries) => {
      let hidden = false;
      entries.forEach((e) => { e.target.dataset.on = e.isIntersecting ? '1' : ''; });
      hidden = [cover, foot].some((el) => el && el.dataset.on);
      index.classList.toggle('is-hidden', hidden);
    }, { threshold: 0.05 });
    [cover, foot].forEach((el) => el && hide.observe(el));
  }
})();

// Intro crossing line: clip the paper-coloured copy at the photo's left edge
(() => {
  const l2 = document.querySelector('.intro__l2');
  const photo = document.querySelector('.intro__photo');
  if (!l2 || !photo) return;
  const set = () => {
    const a = l2.getBoundingClientRect();
    const b = photo.getBoundingClientRect();
    const x = Math.max(0, Math.min(a.width, b.left - a.left));
    l2.style.setProperty('--cx', x + 'px');
  };
  set();
  addEventListener('resize', set);
  addEventListener('load', set);
})();

// Cards: tilt settles straight as the section crosses
(() => {
  const cards = [...document.querySelectorAll('.card')];
  const sec = document.querySelector('.materials');
  if (!cards.length || !sec || reduced) return;
  const scrub = () => {
    const r = sec.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.9 - r.top) / (innerHeight * 0.55)));
    cards.forEach((c) => {
      const base = parseFloat(getComputedStyle(c).getPropertyValue('--tilt')) || 0;
      c.style.setProperty('--tilt-c', (base * (1 - p)).toFixed(2) + 'deg');
    });
  };
  addEventListener('scroll', scrub, { passive: true });
  scrub();
})();

// Colour wave through the held word (accent = ink on this palette; the wave runs through the muted tone so it reads)
(() => {
  const el = document.querySelector('[data-wave]');
  const cover = document.querySelector('.cover');
  if (!el || !cover || reduced) return;
  const text = el.textContent;
  el.textContent = '';
  const chars = [...text].map((ch) => {
    const s = document.createElement('span');
    s.className = 'wch';
    s.textContent = ch;
    el.append(s);
    return s;
  });
  const scrub = () => {
    const r = cover.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / (innerHeight * 0.4)));
    const head = p * (chars.length + 8) - 4;
    chars.forEach((s, i) => {
      s.style.color = Math.abs(i - head) < 4 ? 'var(--muted)' : '';
    });
  };
  addEventListener('scroll', scrub, { passive: true });
  scrub();
})();

// Copy email
(() => {
  const btn = document.getElementById('copybtn');
  if (!btn) return;
  const email = 'akratiprintngraph@gmail.com';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
    } catch (err) {
      location.href = 'mailto:' + email;
    }
  });
})();

// Image credits dialog
(() => {
  const dlg = document.getElementById('credits');
  const btn = document.getElementById('creditsbtn');
  if (!dlg || !btn) return;
  btn.addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();

// Mobile menu
(() => {
  const btn = document.querySelector('.topbar__menu');
  const menu = document.getElementById('mobilemenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  });
})();

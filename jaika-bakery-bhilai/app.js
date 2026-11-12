// V82 - Jaika Bakery, Smriti Nagar, Bhilai
(() => {
  const open = document.getElementById('credits-open'), dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
  // rolling figures: each digit rolls up to its value once, columns a beat apart
  const els = [...document.querySelectorAll('[data-roll]')];
  els.forEach((el) => {
    const value = el.textContent.trim();
    const shown = document.createElement('span'); shown.className = 'roll__digits';
    let i = 0;
    for (const ch of value) {
      if (!/\d/.test(ch)) { shown.append(ch); continue; }
      const col = document.createElement('span'); col.className = 'roll__col';
      const strip = document.createElement('span'); strip.className = 'roll__strip';
      strip.style.setProperty('--d', ch); strip.style.setProperty('--i', i++);
      for (let n = 0; n < 10; n++) { const s = document.createElement('span'); s.textContent = n; strip.append(s); }
      col.append(strip); shown.append(col);
    }
    el.classList.add('roll'); el.replaceChildren(shown);
  });
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((en) => { for (const e of en) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }, { rootMargin: '0px 0px -15% 0px' });
  els.forEach((el) => io.observe(el));
})();

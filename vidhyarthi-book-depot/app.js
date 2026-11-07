/* Vidhyarthi Book Depot - interactions */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile sheet */
  const menuBtn = document.querySelector('[data-menu]');
  const sheet = document.querySelector('[data-sheet]');
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', () => {
      const open = !sheet.hasAttribute('hidden');
      if (open) sheet.setAttribute('hidden', '');
      else sheet.removeAttribute('hidden');
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      sheet.setAttribute('hidden', '');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* scroll ink fill: words gain ink as they cross the viewport */
  const inkfill = document.querySelector('[data-inkfill]');
  if (inkfill) {
    const words = inkfill.textContent.trim().split(/\s+/);
    inkfill.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    if (!reduced) {
      const spans = [...inkfill.querySelectorAll('.w')];
      const fill = () => {
        const r = inkfill.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.6)));
        const n = Math.round(p * spans.length);
        spans.forEach((s, i) => s.classList.toggle('on', i < n));
      };
      fill();
      window.addEventListener('scroll', fill, { passive: true });
      window.addEventListener('resize', fill);
    }
  }

  /* footer cycling word: one text node, instant swap, always readable */
  const cycle = document.querySelector('[data-cycle]');
  if (cycle && !reduced) {
    const words = (cycle.getAttribute('data-cycle') || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (words.length > 1) {
      let i = 0;
      setInterval(() => {
        i = (i + 1) % words.length;
        cycle.textContent = words[i];
      }, 2400);
    }
  }

  /* category matcher: answers grounded in the shop's listing */
  const needs = document.querySelector('[data-needs]');
  const result = document.querySelector('[data-tool-result]');
  if (needs && result) {
    const answers = {
      exam: 'Its listing leads with competitive exam books - ask at the counter for the title you need.',
      school: 'Its listing carries CBSE books and school stationery - ask for your class and board.',
      college: 'Its listing names mechanical engineering, chemical and civil, management, health care and drawing and CS texts.',
      read: 'Its listing includes novels, story and fiction, history and children\'s books to browse.',
      child: 'Its listing includes children\'s books for young readers.',
      kit: 'Its listing mentions stationery and study materials - ask about kits at the counter.'
    };
    needs.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        needs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        result.textContent = (answers[btn.dataset.need] || 'Ask at the counter.') + ' Or email the shop: vidyarthibookdepo@gmail.com.';
      });
    });
  }

  /* image credits dialog */
  const dlg = document.querySelector('[data-credits]');
  const openBtn = document.querySelector('[data-credits-open]');
  if (dlg && openBtn) {
    openBtn.addEventListener('click', () => dlg.showModal());
  }
})();

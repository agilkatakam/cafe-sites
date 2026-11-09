// V74 - Rhc Complete Computer Care, Amritsar
(() => {
  // menu (phone)
  const menuBtn = document.querySelector('.menu-btn');
  const menuPanel = document.getElementById('menu-panel');
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', () => {
      const open = menuPanel.hasAttribute('hidden') ? false : true;
      if (open) { menuPanel.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false'); }
      else { menuPanel.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded', 'true'); }
    });
    menuPanel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menuPanel.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // showcase disc: choose a name -> swap fact + disc tint (object crossfades out/in per dealt move)
  const names = Array.from(document.querySelectorAll('.disc-name'));
  const disc = document.getElementById('disc');
  const fact = document.getElementById('disc-fact');
  const obj = document.getElementById('disc-object');
  names.forEach((btn) => btn.addEventListener('click', () => {
    names.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    if (obj) { obj.style.opacity = '0'; setTimeout(() => { obj.style.opacity = '1'; }, 300); }
    if (disc && btn.dataset.tint) disc.style.background = btn.dataset.tint;
    if (fact && btn.dataset.fact) fact.textContent = btn.dataset.fact;
  }));

  // enquiry builder: composes a mailto; the shop answers, never this page
  const dev = document.getElementById('eq-device');
  const svc = document.getElementById('eq-service');
  const preview = document.getElementById('eq-preview');
  const send = document.getElementById('eq-send');
  const compose = () => {
    const d = dev.value, s = svc.value;
    const body = `hello rhc complete computer care,\n\nthis is an enquiry about ${s} for ${d}.\n\n`;
    preview.textContent = `"${`enquiry: ${s} for ${d}`}"`;
    send.href = `mailto:rhccompletecomputercare@gmail.com?subject=${encodeURIComponent(`Enquiry: ${s} for ${d}`)}&body=${encodeURIComponent(body)}`;
  };
  if (dev && svc && preview && send) {
    dev.addEventListener('change', compose);
    svc.addEventListener('change', compose);
    compose();
  }

  // credits dialog
  const open = document.getElementById('credits-open');
  const dlg = document.getElementById('credits-dialog');
  if (open && dlg) open.addEventListener('click', () => dlg.showModal());
})();

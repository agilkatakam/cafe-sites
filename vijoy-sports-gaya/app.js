// Vijoy Sports, Gaya
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav shrinks
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-small', window.scrollY > 80); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile menu
  var menuBtn = document.querySelector('.nav__menu');
  var menu = document.getElementById('mobilemenu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) { menu.removeAttribute('hidden'); } else { menu.setAttribute('hidden', ''); }
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // hero picture: slow drift (the dealt slow picture)
  var heroImg = document.querySelector('.hero__picture img');
  if (heroImg && !reduce) {
    var drift = function () {
      var r = heroImg.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (window.innerHeight + r.height)));
      heroImg.style.transform = 'scale(' + (1.04 + p * 0.04) + ') translateY(' + (p * -12) + 'px)';
    };
    window.addEventListener('scroll', drift, { passive: true }); drift();
  }

  // goods disc swap
  var facts = [
    'Globally recognised branded cricket products, per the listing.',
    'Basketballs sit alongside the cricket stock, per the listing.',
    'Tennis and badminton rackets, per the listing.',
    'Gym and health equipment, per the listing.',
    'Skates and ropes, per the listing.'
  ];
  var names = document.querySelectorAll('.goods__name');
  var factEl = document.getElementById('goodsfact');
  var disc = document.querySelector('.goods__disc');
  names.forEach(function (b) {
    b.addEventListener('click', function () {
      names.forEach(function (n) { n.classList.remove('is-on'); });
      b.classList.add('is-on');
      var i = +b.dataset.i;
      factEl.style.opacity = 0;
      setTimeout(function () { factEl.textContent = facts[i]; factEl.style.opacity = 1; }, reduce ? 0 : 150);
      disc.style.background = (i % 2 === 0) ? 'var(--surface)' : 'var(--sky)';
    });
  });
  if (factEl) { factEl.style.transition = 'opacity .3s ease'; }

  // copy email
  var copyBtn = document.querySelector('.foot__copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var t = copyBtn.dataset.copy;
      if (navigator.clipboard) { navigator.clipboard.writeText(t); }
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1600);
    });
  }

  // credits dialog
  var dlg = document.getElementById('creditsdialog');
  var creditsBtn = document.getElementById('creditsbtn');
  if (dlg && creditsBtn) { creditsBtn.addEventListener('click', function () { dlg.showModal(); }); }
})();

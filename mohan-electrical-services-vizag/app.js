document.documentElement.classList.add('js');

/* mains switch: the one live thing */
(function () {
  var b = document.getElementById('mains');
  if (!b) return;
  var state = b.querySelector('.mains-state');
  b.addEventListener('click', function () {
    var on = document.body.getAttribute('data-power') === 'on';
    document.body.setAttribute('data-power', on ? 'off' : 'on');
    b.setAttribute('aria-pressed', String(!on));
    if (state) state.textContent = on ? 'off' : 'on';
  });
})();

/* staggered entrances, once per section */
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
    return;
  }
  document.querySelectorAll('main section, .hero, .footer').forEach(function (sec) {
    sec.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      el.style.setProperty('--d', (i * 75) + 'ms');
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  setTimeout(function () {
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) { el.classList.add('in'); });
  }, 1400);
})();

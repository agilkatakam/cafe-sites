// Viki Mobile, Cuttack
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var hero = document.querySelector('.hero');
  if (hero && !reduce && window.matchMedia('(min-width: 701px)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      root.style.setProperty('--bx', (62 + nx * 8) + '%');
      root.style.setProperty('--by', (55 + ny * 8) + '%');
    });
  }
  // last word rises into place
  var w4 = document.querySelector('.intro__w4');
  if (w4 && !reduce && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(w4, { y: 120 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 85%', end: '+=' + Math.round(window.innerHeight * .8), scrub: true } });
  }
  // phone: put the band edge exactly between the two headline lines
  var hl = document.querySelector('.hl');
  function cut() {
    if (!hl || !window.matchMedia('(max-width: 700px)').matches) { root.style.removeProperty('--edge-h'); return; }
    var hr = hl.getBoundingClientRect(), hero = document.querySelector('.hero').getBoundingClientRect();
    var mid = hr.top - hero.top + hr.height * 0.5;
    var a = window.innerHeight * 0.34;
    root.style.setProperty('--edge-h', Math.max(40, mid - a) + 'px');
    root.style.setProperty('--cut', '50%');
  }
  cut(); window.addEventListener('resize', cut); if (document.fonts && document.fonts.ready) document.fonts.ready.then(cut);
  // copy
  var cb = document.getElementById('copybtn');
  if (cb) cb.addEventListener('click', function () {
    var t = cb.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cb.textContent = 'Copied'; }, function () { cb.textContent = 'Select the email'; });
    setTimeout(function () { cb.textContent = 'Copy'; }, 1800);
  });
})();

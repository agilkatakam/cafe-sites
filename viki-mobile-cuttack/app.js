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
  // copy
  var cb = document.getElementById('copybtn');
  if (cb) cb.addEventListener('click', function () {
    var t = cb.dataset.copy;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cb.textContent = 'Copied'; }, function () { cb.textContent = 'Select the email'; });
    setTimeout(function () { cb.textContent = 'Copy'; }, 1800);
  });
  // credits dialog
  var d = document.getElementById('creditsdialog'), b = document.getElementById('creditsbtn');
  if (d && b) b.addEventListener('click', function () { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); });
})();

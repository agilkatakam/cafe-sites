(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme switch */
  var sw = document.getElementById('theme-switch');
  function traces(play) {
    var list = document.querySelectorAll('.trace');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (play && !reduce) {
        el.classList.remove('lit');
        void el.getBoundingClientRect();
        el.classList.add('lit');
      } else {
        el.classList.remove('lit');
      }
    }
  }
  function apply(theme, animate) {
    root.setAttribute('data-theme', theme);
    if (sw) sw.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
    traces(theme === 'night' && animate);
  }
  var stored = null;
  try { stored = window.localStorage.getItem('mes-theme'); } catch (e) {}
  var initial = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
  apply(initial, true);
  if (sw) {
    sw.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
      apply(next, true);
      try { window.localStorage.setItem('mes-theme', next); } catch (e) {}
    });
  }

  /* reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    for (var r = 0; r < revealEls.length; r++) revealEls[r].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    for (var r2 = 0; r2 < revealEls.length; r2++) io.observe(revealEls[r2]);
  }

  /* enquiry form -> email draft */
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var service = (data.get('service') || '').toString();
      var date = (data.get('date') || '').toString();
      var message = (data.get('message') || '').toString().trim();
      var lines = ['Hello Mohan Electrical Services,', '', 'Service needed: ' + service];
      if (date) lines.push('Preferred day: ' + date);
      if (message) lines.push('', 'Details:', message);
      lines.push('', 'Please let me know availability and price details.', '', 'Sent from the website concept preview.');
      var href = 'mailto:karnammohanmohan@gmail.com?subject=' + encodeURIComponent('Electrical work enquiry') + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }
})();

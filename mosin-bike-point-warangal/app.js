/* md. mosin bike point */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* entrances: transform only, plus a fallback timer so nothing stays shifted */
  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('in'); }, (i % 4) * 80);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    revealed.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      revealed.forEach(function (el) { el.classList.add('in'); });
    }, 1400);
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* services index with preview: hover or focus a row, its picture opens in one round frame */
  var frame = document.querySelector('.index__frame');
  if (frame && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var frameImg = frame.querySelector('img');
    document.querySelectorAll('.item[data-preview]').forEach(function (item) {
      var open = function () {
        var src = item.getAttribute('data-preview');
        if (frameImg.getAttribute('src') !== src) frameImg.setAttribute('src', src);
      };
      item.addEventListener('mouseenter', open);
      item.addEventListener('focusin', open);
    });
  }

  /* accordion */
  var panels = document.querySelectorAll('.panel');
  panels.forEach(function (panel) {
    var tab = panel.querySelector('.panel-tab');
    tab.addEventListener('click', function () {
      panels.forEach(function (p) {
        p.classList.toggle('is-open', p === panel);
        p.querySelector('.panel-tab').setAttribute('aria-expanded', p === panel ? 'true' : 'false');
      });
    });
  });

  /* the engine clip: respect reduced motion */
  var clip = document.querySelector('.clip video');
  if (clip && reduced) {
    clip.removeAttribute('autoplay');
    clip.pause();
  }

  /* the live thing: is the garage open right now, in its own timezone */
  var openState = document.getElementById('openState');
  if (openState) {
    try {
      var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      var day = now.getDay();
      var mins = now.getHours() * 60 + now.getMinutes();
      var open = mins >= 9 * 60 && mins < 21 * 60;
      if (day === 0) {
        openState.textContent = 'closed today, back monday 9am.';
      } else if (open) {
        openState.textContent = 'open now, until 9pm.';
      } else if (mins < 9 * 60) {
        openState.textContent = 'opens today at 9am.';
      } else {
        openState.textContent = day === 6 ? 'closed now, back monday 9am.' : 'closed now, back tomorrow 9am.';
      }
    } catch (e) { /* the plain hours stay */ }
  }

  /* the coupon writes a ready email to the garage; nothing sends itself */
  var form = document.getElementById('enquiry');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var data = new FormData(form);
    var bike = (data.get('bike') || '').toString().trim();
    var subject = 'service enquiry' + (bike ? ' - ' + bike : '');
    var lines = [
      'hello md. mosin bike point,',
      '',
      'name: ' + (data.get('name') || '').toString().trim(),
      'phone: ' + (data.get('phone') || '').toString().trim(),
      'bike: ' + bike,
      'what is wrong: ' + (data.get('issue') || '').toString().trim(),
      '',
      'sent from the garage website preview.'
    ];
    window.location.href = 'mailto:mosin867bhai@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();

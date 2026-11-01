// Krishna Computech - masked headline, entrances, "point at what's broken"
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Masked headline: play once on load
  if (reduce) {
    document.body.classList.add('play');
  } else {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('play');
      });
    });
  }

  // Entrances
  var revealEls = document.querySelectorAll('.stair-line, .diag, .sheet-band, .sheet-copy, .sheet-photo, .panel, .cta-word, .cta-sub, .foot-col');
  if (!reduce && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Reduced motion: hold the moving picture on its poster
  var clip = document.querySelector('.sheet-photo video');
  if (clip && reduce) {
    clip.removeAttribute('autoplay');
    clip.pause();
  }

  // The live thing: point at what's broken
  var zones = document.querySelectorAll('.zone');
  var parts = document.querySelectorAll('#parts li');
  var send = document.getElementById('diag-send');
  var zoneNames = {
    screen: 'the screen side (laptop screen, display cable, hinge)',
    keyboard: 'the keyboard (keyboard, DVD-RW)',
    power: 'power and heat (adapter, battery, DC jack, fan, heating, thermal paste)',
    inside: 'inside the machine (motherboard, BIOS, ports, RAM, data recovery)',
    other: 'something else (laptop service, printer, CCTV)'
  };

  function clearAll() {
    zones.forEach(function (z) { z.setAttribute('aria-pressed', 'false'); });
    parts.forEach(function (p) { p.classList.remove('lit'); });
    send.setAttribute('href', send.getAttribute('data-base') + '?subject=Repair%20enquiry');
  }

  zones.forEach(function (zone) {
    zone.setAttribute('aria-pressed', 'false');
    zone.addEventListener('click', function () {
      var name = zone.getAttribute('data-zone');
      var already = zone.getAttribute('aria-pressed') === 'true';
      clearAll();
      if (already) { return; }
      zone.setAttribute('aria-pressed', 'true');
      parts.forEach(function (p) {
        if (p.getAttribute('data-zone') === name) { p.classList.add('lit'); }
      });
      var subject = 'Repair enquiry: ' + zone.textContent;
      var body = 'Namaste Krishna Computech,\n\n'
        + 'My laptop has a problem with ' + zoneNames[name] + '.\n\n'
        + 'Please let me know when I can bring it in.\n';
      send.setAttribute('href', send.getAttribute('data-base')
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body));
    });
  });
})();

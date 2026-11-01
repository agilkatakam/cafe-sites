/* Nagal Refrigeration: louvre tilt, enquiry mailto, crossfade entrances */
(function () {
  'use strict';

  /* slow crossfade entrances with a capture-safe fallback */
  var revealed = document.querySelectorAll('.reveal');
  function showAll() { revealed.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealed.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 1400);
  } else { showAll(); }

  /* reduced motion: hold the fan clip on its poster */
  var clip = document.getElementById('fanClip');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (clip && reduced) { clip.pause(); clip.removeAttribute('autoplay'); }

  /* the live thing: tilt the vents */
  var louvres = document.getElementById('louvres');
  var ventBtn = document.getElementById('ventBtn');
  var tilt = 0.12;
  function applyTilt(t) {
    tilt = Math.max(0, Math.min(1, t));
    louvres.style.setProperty('--tilt', tilt.toFixed(3));
    var open = tilt > 0.5;
    ventBtn.textContent = open ? 'Close the vents' : 'Open the vents';
    ventBtn.setAttribute('aria-pressed', open ? 'true' : 'false');
  }
  ventBtn.addEventListener('click', function () { applyTilt(tilt > 0.5 ? 0.12 : 0.85); });

  var dragging = false, startY = 0, startTilt = 0;
  louvres.addEventListener('pointerdown', function (e) {
    dragging = true; startY = e.clientY; startTilt = tilt;
    louvres.classList.add('dragging');
    louvres.setPointerCapture(e.pointerId);
  });
  louvres.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    applyTilt(startTilt + (e.clientY - startY) / 260);
  });
  function endDrag() { dragging = false; louvres.classList.remove('dragging'); }
  louvres.addEventListener('pointerup', endDrag);
  louvres.addEventListener('pointercancel', endDrag);
  applyTilt(0.12);

  /* enquiry: opens a filled email */
  var form = document.getElementById('enquiryForm');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var appl = document.getElementById('fAppl').value.trim();
    var issue = document.getElementById('fIssue').value.trim();
    var subject = 'Service enquiry' + (appl ? ': ' + appl : '');
    var body = [
      'Hello Nagal Refrigeration,', '',
      'I would like to ask about a service or repair.', '',
      'Appliance: ' + (appl || '(to fill in)'),
      'Problem: ' + (issue || '(to fill in)'),
      'Name: ' + (name || '(to fill in)'), '',
      'Thank you.'
    ].join('\n');
    window.location.href = 'mailto:mangalchandnagal@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();

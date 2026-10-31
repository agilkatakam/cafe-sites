/* Doon Computer: job card intake, coupon mailto, carousel, entrances */
(function () {
  'use strict';

  /* ---------- entrances : transform-only reveals with a fallback timer ---------- */
  var revealed = document.querySelectorAll('.reveal');
  function showAll() {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealed.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 1400); // capture-safe fallback
  } else {
    showAll();
  }

  /* ---------- the live job card ---------- */
  var state = { device: '', problem: '' };
  var fill = document.getElementById('ticketFill');

  function renderTicket() {
    var d = state.device || '…';
    var p = state.problem || '…';
    fill.textContent = 'Device: ' + d + '  ·  Problem: ' + p;
  }

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var field = chip.getAttribute('data-field');
      var value = chip.getAttribute('data-value');
      state[field] = value;
      document.querySelectorAll('.chip[data-field="' + field + '"]').forEach(function (c) {
        c.classList.toggle('on', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      renderTicket();
    });
  });

  var toForm = document.getElementById('ticketToForm');
  toForm.addEventListener('click', function () {
    if (state.device) document.getElementById('fDevice').value = state.device;
    if (state.problem) document.getElementById('fProblem').value = state.problem;
    document.getElementById('coupon').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- the coupon : opens a filled email ---------- */
  var form = document.getElementById('couponForm');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var phone = document.getElementById('fPhone').value.trim();
    var device = document.getElementById('fDevice').value.trim();
    var problem = document.getElementById('fProblem').value.trim();
    var subject = 'Repair enquiry' + (device ? ': ' + device : '');
    var bodyLines = [
      'Hello Doon Computer,',
      '',
      'I would like to ask about a repair.',
      '',
      'Device: ' + (device || '(to fill in)'),
      'Problem: ' + (problem || '(to fill in)'),
      'Name: ' + (name || '(to fill in)'),
      'Phone: ' + (phone || '(to fill in)'),
      '',
      'Thank you.'
    ];
    window.location.href = 'mailto:mitulvaish@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyLines.join('\n'));
  });

  /* reduced motion: hold the clip on its poster */
  var clip = document.getElementById('benchClip');
  if (clip && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clip.pause(); clip.removeAttribute('autoplay');
  }

  /* ---------- the drag row of moments ---------- */
  var row = document.getElementById('dragrow');
  var seg = document.getElementById('barSeg');
  var back = document.getElementById('rowBack');
  var fwd = document.getElementById('rowFwd');

  function step() {
    var m = row.querySelector('.moment');
    return m ? m.getBoundingClientRect().width + 24 : 320;
  }
  function paintBar() {
    var max = row.scrollWidth - row.clientWidth;
    var pos = max > 0 ? row.scrollLeft / max : 0;
    var width = max > 0 ? Math.max(15, (row.clientWidth / row.scrollWidth) * 100) : 100;
    seg.style.width = width + '%';
    seg.style.left = pos * (100 - width) + '%';
    back.disabled = row.scrollLeft <= 2;
    fwd.disabled = row.scrollLeft >= max - 2;
  }
  back.addEventListener('click', function () { row.scrollBy({ left: -step(), behavior: 'smooth' }); });
  fwd.addEventListener('click', function () { row.scrollBy({ left: step(), behavior: 'smooth' }); });
  row.addEventListener('scroll', paintBar, { passive: true });
  window.addEventListener('resize', paintBar);
  paintBar();

  /* drag with the pointer as well as the wheel */
  var dragging = false, startX = 0, startLeft = 0;
  row.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    dragging = true; startX = e.clientX; startLeft = row.scrollLeft;
    row.classList.add('dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    row.scrollLeft = startLeft - (e.clientX - startX);
  });
  window.addEventListener('pointerup', function () {
    dragging = false; row.classList.remove('dragging');
  });
})();

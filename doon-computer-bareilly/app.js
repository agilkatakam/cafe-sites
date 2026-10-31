(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* terminal intake typing */
  var term = document.getElementById('term-body');
  var script = [
    { cls: 'cmd', text: '$ doon --intake' },
    { cls: 'dim', text: '> device: laptop / desktop / printer' },
    { cls: 'dim', text: '> first checks: power, storage, memory, display' },
    { cls: 'ok',  text: '> faults found, quoted, fixed' },
    { cls: 'ok',  text: '> status: accepting repairs' },
    { cls: 'cmd', text: '$ bring it in - we find the rest' }
  ];
  function renderTerm(instant) {
    if (!term) return;
    term.innerHTML = '';
    var caret = document.createElement('span');
    caret.className = 'caret';
    if (instant) {
      script.forEach(function (line) {
        var div = document.createElement('div');
        div.className = line.cls;
        div.textContent = line.text;
        term.appendChild(div);
      });
      term.appendChild(caret);
      return;
    }
    var li = 0, ci = 0;
    var current = null;
    (function tick() {
      if (li >= script.length) { term.appendChild(caret); return; }
      if (!current) {
        current = document.createElement('div');
        current.className = script[li].cls;
        term.appendChild(current);
      }
      var line = script[li];
      current.textContent = line.text.slice(0, ci + 1);
      ci++;
      if (ci >= line.text.length) { li++; ci = 0; current = null; }
      var delay = current ? 26 : 420;
      if (current && ci === 1) delay = 24;
      setTimeout(tick, delay);
    })();
  }
  renderTerm(reduce);

  /* reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    for (var r = 0; r < revealEls.length; r++) revealEls[r].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
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
      var device = (data.get('device') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();
      var lines = ['Hello Doon Computer,', '', 'Repair needed: ' + service];
      if (device) lines.push('Device: ' + device);
      if (message) lines.push('', 'Details:', message);
      lines.push('', 'Please let me know the cost and time for the repair.', '', 'Sent from the website concept preview.');
      var href = 'mailto:mitulvaish@gmail.com?subject=' + encodeURIComponent('Repair enquiry') + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }
})();

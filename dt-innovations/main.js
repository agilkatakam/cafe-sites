document.documentElement.classList.add('js');

/* hero sheet hover: dim others, show caption */
(function () {
  var sheet = document.querySelector('.sheet');
  var caption = document.querySelector('.hero-caption');
  if (!sheet || !caption) return;
  sheet.querySelectorAll('.frame').forEach(function (f) {
    f.addEventListener('mouseenter', function () {
      var c = f.querySelector('figcaption');
      caption.textContent = c ? c.textContent : '';
      caption.classList.add('on');
      sheet.classList.add('hovering');
    });
    f.addEventListener('mouseleave', function () {
      caption.classList.remove('on');
      sheet.classList.remove('hovering');
    });
  });
})();

/* rise entrances + shutter */
(function () {
  var rise = document.querySelectorAll('[data-rise]');
  rise.forEach(function (sec) {
    Array.prototype.forEach.call(sec.children, function (el, i) {
      el.style.transitionDelay = Math.min(i * 70, 560) + "ms";
    });
  });
  var shutter = document.querySelector('.shutter');
  var targets = Array.prototype.slice.call(rise);
  if (shutter) targets.push(shutter);
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (t) { io.observe(t); });
  setTimeout(function () {
    targets.forEach(function (t) { t.classList.add('in'); });
  }, 2500);
})();

/* feature hover descriptions */
(function () {
  var out = document.querySelector('.fdesc');
  if (!out) return;
  document.querySelectorAll('.fgroup li').forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      out.textContent = li.getAttribute('data-d') || '';
    });
    li.addEventListener('mouseleave', function () {
      out.textContent = '';
    });
  });
})();

/* marquee: clone track for a seamless loop */
(function () {
  var track = document.getElementById('track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

/* size your pool */
(function () {
  var len = document.getElementById('len');
  var wid = document.getElementById('wid');
  var dep = document.getElementById('dep');
  if (!len || !wid || !dep) return;
  var lenV = document.getElementById('len-v');
  var widV = document.getElementById('wid-v');
  var depV = document.getElementById('dep-v');
  var litresEl = document.getElementById('litres');
  var fill = document.getElementById('fill');
  var note = document.getElementById('size-note');
  var rect = document.getElementById('sh-rect');
  var oval = document.getElementById('sh-oval');
  var shapeFactor = 1;

  function words(n) {
    var small = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
    if (Number.isInteger(n) && n >= 0 && n <= 20) return small[n];
    return String(n);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function update() {
    var L = parseFloat(len.value);
    var W = parseFloat(wid.value);
    var D = parseFloat(dep.value);
    lenV.textContent = L + ' m';
    widV.textContent = W + ' m';
    depV.textContent = D.toFixed(1) + ' m';
    var litres = Math.round(L * W * D * shapeFactor * 1000);
    litresEl.textContent = litres.toLocaleString('en-IN') + ' litres';
    var pct = Math.min(100, Math.max(3, litres / 2000));
    fill.style.width = pct + '%';
    var shapeWord = shapeFactor === 1 ? 'rectangular' : 'oval';
    note.textContent = cap(words(L)) + ' by ' + words(W) + ' metres, ' + D.toFixed(1) + ' deep, ' + shapeWord + ': about ' + litres.toLocaleString('en-IN') + ' litres before the filter and the swimmers.';
  }

  [len, wid, dep].forEach(function (el) { el.addEventListener('input', update); });
  rect.addEventListener('click', function () {
    shapeFactor = 1;
    rect.classList.add('on'); rect.setAttribute('aria-pressed', 'true');
    oval.classList.remove('on'); oval.setAttribute('aria-pressed', 'false');
    update();
  });
  oval.addEventListener('click', function () {
    shapeFactor = 0.785;
    oval.classList.add('on'); oval.setAttribute('aria-pressed', 'true');
    rect.classList.remove('on'); rect.setAttribute('aria-pressed', 'false');
    update();
  });
  update();
})();

/* Pune local time */
(function () {
  var clock = document.getElementById('clock');
  if (!clock) return;
  function tick() {
    try {
      clock.textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      clock.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  tick();
  setInterval(tick, 30000);
})();

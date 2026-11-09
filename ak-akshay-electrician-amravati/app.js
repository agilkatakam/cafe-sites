/* V72 app.js - nav live name, menu overlay, enquiry tool, crossfade, credits, copy */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scenes on the shared stage ---------- */
  if (window.Stage) {
    Stage.smooth();
    Stage.init();
  }

  /* ---------- menu overlay ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var overlay = document.getElementById('menuOverlay');
  function setMenu(open) {
    overlay.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    if (window.lenisStop) { open ? window.lenisStop() : window.lenisStart && window.lenisStart(); }
  }
  menuBtn.addEventListener('click', function () { setMenu(overlay.hidden); });
  overlay.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) setMenu(false); });

  /* ---------- nav: live section name ---------- */
  var where = document.getElementById('navWhere');
  var names = [
    ['for-whom', 'For whom'],
    ['work', 'The work'],
    ['enquire', 'Enquire'],
    ['write', 'Write'],
    ['footer', 'Write']
  ];
  var current = '';
  function swapName(name) {
    if (name === current) return;
    current = name;
    if (reduced) { where.textContent = name; return; }
    where.classList.add('swap-out');
    setTimeout(function () {
      where.textContent = name;
      where.classList.remove('swap-out');
      where.classList.add('swap-in');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          where.style.transition = 'transform 280ms ease-out';
          where.style.transform = 'translateY(0)';
          setTimeout(function () { where.classList.remove('swap-in'); where.style.transition = ''; where.style.transform = ''; }, 300);
        });
      });
    }, 280);
  }
  /* nav action steps aside while the enquiry section holds the screen */
  var navAction = document.getElementById('navAction');
  if ('IntersectionObserver' in window && navAction) {
    var asideSections = [document.getElementById('enquire'), document.querySelector('footer.footer')];
    var asideState = new Map();
    var asideIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { asideState.set(en.target, en.intersectionRatio >= 0.25); });
      var any = false; asideState.forEach(function (v) { if (v) any = true; });
      navAction.classList.toggle('is-aside', any);
    }, { threshold: [0, 0.25, 0.5] });
    asideSections.forEach(function (el) { if (el) asideIO.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen.set(en.target.id, en.intersectionRatio); });
      var best = '', bestR = 0.5;
      seen.forEach(function (r, id) { if (r > bestR) { bestR = r; best = id; } });
      var hit = names.find(function (n) { return n[0] === best; });
      swapName(hit ? hit[1] : '');
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    names.forEach(function (n) { var el = document.getElementById(n[0]) || document.querySelector('footer.footer'); if (n[0] === 'footer') el = document.querySelector('footer.footer'); if (el) { if (!el.id) el.id = 'footer'; io.observe(el); } });
  }

  /* ---------- enquiry tool ---------- */
  var toolData = {
    home: {
      title: 'Something at home?',
      desc: 'A switch, a light, a room to wire - say it in a line, straight to his inbox.',
      tag: 'a home'
    },
    work: {
      title: 'Something at work?',
      desc: 'His listing covers commercial work too - say what the shop or office needs.',
      tag: 'a business'
    },
    unsure: {
      title: 'Not sure what it is?',
      desc: 'Say what you see - flickering, tripping, a dead point - in your own words.',
      tag: 'not sure yet'
    }
  };
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tool-tab'));
  var titleWord = document.getElementById('toolTitleWord');
  var desc = document.getElementById('toolDesc');
  var sendBtn = document.getElementById('toolSend');
  var toolKey = 'home';

  function mailtoFor(tag) {
    var subject = 'Enquiry for Ak Akshay Electrician and Plumber - ' + tag;
    var body = 'Hi, this is an enquiry from the concept preview site.\n\nIt is about: ' + tag + '.\n\nThe work I need: ';
    return 'mailto:akshaykathane69@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function setSend() { sendBtn.href = mailtoFor(toolData[toolKey].tag); }

  /* mask roll swap on the title (the dealt small move) */
  function rollTitle(text) {
    if (reduced) { titleWord.textContent = text; return; }
    var old = titleWord;
    var mask = old.parentElement;
    var h = old.offsetHeight;
    mask.style.height = (h + 2) + 'px';
    var next = old.cloneNode(false);
    next.textContent = '';
    text.split(' ').forEach(function (word, i) {
      var w = document.createElement('span');
      w.className = 'w';
      w.textContent = word;
      w.style.transform = 'translateY(110%)';
      w.style.transition = 'transform 360ms cubic-bezier(0.77,0,0.18,1) ' + (60 + i * 30) + 'ms';
      next.appendChild(w);
      if (i < text.split(' ').length - 1) next.appendChild(document.createTextNode(' '));
    });
    old.style.transition = 'transform 340ms cubic-bezier(0.77,0,0.18,1)';
    old.style.transform = 'translateY(-110%)';
    mask.appendChild(next);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        next.querySelectorAll('.w').forEach(function (w) { w.style.transform = 'translateY(0)'; });
      });
    });
    setTimeout(function () {
      old.remove();
      next.id = 'toolTitleWord';
      titleWord = next;
      mask.style.height = '';
    }, 620);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-tool');
      if (key === toolKey) return;
      toolKey = key;
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      rollTitle(toolData[key].title);
      desc.textContent = toolData[key].desc;
      setSend();
    });
  });
  setSend();

  /* ---------- slow crossfade (the dealt signature move) ---------- */
  var cf = document.getElementById('crossfade');
  if (cf) {
    var imgs = Array.prototype.slice.call(cf.querySelectorAll('img'));
    imgs[0].classList.add('is-on');
    if (!reduced && imgs.length > 1) {
      var idx = 0;
      setInterval(function () {
        if (document.hidden) return;
        imgs[idx].classList.remove('is-on');
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add('is-on');
      }, 5600);
    }
  }

  /* ---------- footer: copy email ---------- */
  var copyBtn = document.getElementById('copyMail');
  copyBtn.addEventListener('click', function () {
    var addr = 'akshaykathane69@gmail.com';
    function done() {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove(); done();
    }
  });

  /* ---------- credits dialog ---------- */
  var dlg = document.getElementById('creditsDialog');
  document.getElementById('creditsLink').addEventListener('click', function () {
    if (dlg.showModal) dlg.showModal();
  });
})();

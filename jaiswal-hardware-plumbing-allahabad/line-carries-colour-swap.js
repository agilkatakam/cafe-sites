// tasteskill / scenes / line-carries-colour-swap.js — one giant line carries the page across a colour swap.
//
// The section before ends on a straight-edged photograph. As the stage comes up, one very large line of
// the page's display type stands at its foot under the photograph's straight lower edge, already set at
// its final size and at the full content width, but only its first word is showing. On the held stage
// the line climbs at about the page's pace while a square-edged clip crops the photograph away ahead of
// it, and each further word slides in from the right as the visitor scrolls, a short slide of at most
// about one word-width, landing whole right beside the word before it, each inside its own short beat of
// scroll. On the last word the ground and the ink swap in one jump: the stage's ground flips from ink to
// paper and the line from paper to ink at one point of the scroll (a cut, never a blend), so the same line
// is carried from one colour world into the next. The next section's first picture is already rising
// from the foot of the stage under the line almost from the start (it follows the line up, a gap under it)
// and settles whole under it by 90%, so no frame is a word or a headline alone on flat colour: while only
// the first word shows, the closing photograph still fills the screen above it and the next picture
// stands under it. The line is one colour, its last mark included.
//
// Type is never scaled: the line's font size is fitted (to the content width, from the measured words)
// and set as a font size; the words move by transform and opacity only. A line that would set smaller
// than `min` of the stage's height on one row (a phone, a tall tablet) takes two rows, broken where the
// rows are most even; never three.
//
// Needs gsap + ScrollTrigger (no SplitText), stage.js and line-carries-colour-swap.css.
//
// DOM (the CSS draws the finished composition from the same markup):
//   <section class="scene" data-scene="line-carries-colour-swap" data-options='{}' aria-labelledby="lcs-line">
//     <div class="scene-stage">
//       <figure class="lcs-photo">                          the closing photograph of the section before:
//         <img class="lcs-photo__img" src srcset sizes      straight-edged, landscape 3:2 or wider, 1920px+,
//              width height alt>                            dark enough to end the ink chapter
//       </figure>
//       <h2 class="lcs-line" id="lcs-line">Then comes the paper</h2>
//                                                           3-5 words, 14-24 characters, in the line's one
//                                                           colour; a full stop only where the page's voice
//                                                           uses them everywhere (a last mark in .lcs-stop
//                                                           stays with the last word, in the same ink)
//       <figure class="lcs-next">                           the first picture of the section after: it
//         <img class="lcs-next__img" src srcset sizes       rises under the line and rests whole on the
//              width height alt>                            stage, so it must crop well both wide (about
//       </figure>                                           2.2:1 on desktop) and tall (about 2:3 on phones)
//     </div>
//   </section>
//   <section style="background: var(--ground)">…</section>   the next section, on the paper (b) ground
//
// The section before sits on the ink (a) ground and the section after on the paper (b) ground; with
// direction "to-ink" the other way round. The h2 keeps the whole line for readers (aria-label); the
// word spans the script makes are aria-hidden.
//
// Options (data-options JSON; defaults, ranges):
//   hold        1      1-1.5    screens the stage is held for. One line and one picture: about one screen
//                               (every beat is a share of the hold, so a longer hold only stretches them)
//   phoneHold   1      1-1.5
//   direction   "to-paper"      the ground goes from ink to paper and the line from paper to ink |
//                               "to-ink": the other way (add class lcs--to-ink to the section too, so the
//                               finished composition matches)
//   min         0.08   0.05-0.12  share of the stage height under which a one-row line takes two rows
//   max         0.3    0.2-0.4    share of the stage height the line's box never passes (a very wide,
//                               short screen sets the line a little narrower than the content width)
//   slide       0.6    0.3-1    how far a word slides in, as a share of its own width (never more than
//                               1.1 times the type size): a short slide that lands beside the word before
//   drift       0.05   0-0.1    how far (share of the stage height) the old photograph keeps rising
//                               while the clip crops it, so it does not stop dead when the stage holds
//   nav         ""              selector of a fixed header over the scene; it gets navClass from the
//   navClass    "is-swapped"    moment of the swap on (and keeps it below the scene), so a solid bar can
//                               swap its own ground and ink in the same jump. Style that class.
//   scrub       0.5 | true      seconds of catch-up; true (locked) when Lenis smooths the page and on touch
//   phone       "same"          "same" | "rest" (the phone gets the finished composition)
//   Screens under 480px tall always get the finished composition.
//
// Timeline (fractions of the hold; the same on every width, distances measured from the layout):
//   rise     0-0.84   the line climbs from the foot of the stage to its rest under the header at about the
//                     page's pace (linear for 80% of the time, then easing out with no jump in speed); the
//                     clip's edge climbs just ahead of it and has cropped the photograph away by 0.84;
//                     the photograph drifts up by `drift` meanwhile
//   words    word 1 shows from the start; the others land evenly from 0.16 to 0.84, each sliding in
//                     over 0.05 of the hold (x power3.out; full ink within its first 30%, so a frame
//                     caught mid-slide shows the word whole, a little short of its place). Every slide is
//                     snapped inside one tenth of the hold, clear of the 10% marks, so any frame taken on
//                     a tenth shows whole words only: four words land at 0.162, 0.562 and 0.862, so the
//                     first word is alone only to about 0.11, over the photograph
//                     (the travel is `slide` of the word's own width, at most 1.1 times the type size)
//   swap     0.862    on the last word: ground and ink flip in one jump (a class, never a blend)
//   next     0.04-0.90 the next picture rises from the foot of the stage into its place under the line
//                     (power1.out), never closer to the line than the gap, so from the first beat it
//                     follows the line up instead of leaving flat ground under it; its photograph
//                     settles from 1.12 to 1 until 1.0
//   rest     0.90-1   paper ground, ink line, the picture whole under it; then the stage lets go
//
// Colours: tokens --ground (paper) and --ink from the page, and no accent: the line is one colour. Ink
// and paper must contrast 7:1 or better both ways. The scene's own tokens are in
// line-carries-colour-swap.css.
(() => {
  const ID = 'line-carries-colour-swap';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, d, a, b) => { const n = typeof v === 'string' && v.trim() !== '' ? +v : v; return typeof n === 'number' && isFinite(n) ? clamp(n, a, b) : d; };
  // linear for the first a of the time, then power2.out for the rest, joined with no jump in speed:
  // the line keeps the page's pace while it climbs and only settles at the very end
  const settle = (a) => { const d2 = (1 - a) / (1 + a), d1 = 1 - d2; return (t) => (t <= a ? (d1 * t) / a : d1 + d2 * (1 - Math.pow(1 - (t - a) / (1 - a), 2))); };

  const RISE = 0.84;   // the line is at rest and the photograph cropped away
  const FIRST = 0.16;  // the second word lands (snapped to 0.162: the 20% frame already shows two words)
  const LAST = 0.84;   // the last word lands, and ground and ink swap (snapped to 0.862)
  const SLIDE = 0.05;  // one word's slide, as a share of the hold
  const EDGE = 0.012;  // the least room between a slide and a tenth of the hold
  const NEXT = [0.04, 0.9]; // the next picture: from, to (at once, so no frame is a word or two on flat ink)

  // A slide that would run across a tenth of the hold is moved to start just after it, so a frame taken
  // on any tenth shows each word either not yet there or landed (never half way); landings stay in order.
  const snap = (lands) => {
    let prev = -1;
    return lands.map((land) => {
      let l = Math.max(land, prev + SLIDE + EDGE);
      const d = Math.floor((l - SLIDE) * 10 + 1e-9) / 10; // the tenth the slide starts in
      if (l - SLIDE < d + EDGE) l = d + EDGE + SLIDE;
      if (l > d + 0.1 - EDGE) l = d + 0.1 + EDGE + SLIDE; // it crosses the next tenth: start after it
      prev = l;
      return Math.min(l, 0.98);
    });
  };

  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = (root, opts = {}) => {
    const o = {
      hold: num(opts.hold, 1, 1, 1.5),
      phoneHold: num(opts.phoneHold, 1, 1, 1.5),
      direction: opts.direction === 'to-ink' ? 'to-ink' : 'to-paper',
      min: num(opts.min, 0.08, 0.05, 0.12),
      max: num(opts.max, 0.3, 0.2, 0.4),
      slide: num(opts.slide, 0.6, 0.3, 1),
      drift: num(opts.drift, 0.05, 0, 0.1),
      nav: typeof opts.nav === 'string' ? opts.nav.trim() : '',
      navClass: typeof opts.navClass === 'string' && opts.navClass.trim() ? opts.navClass.trim() : 'is-swapped',
      scrub: opts.scrub === true ? true : typeof opts.scrub === 'number' ? clamp(opts.scrub, 0, 2) : null,
      phone: opts.phone === 'rest' ? 'rest' : 'same',
    };
    const $ = (s) => root.querySelector(s);
    const stage = root.querySelector(':scope > .scene-stage') || root.firstElementChild;
    const photo = $('.lcs-photo'), photoImg = $('.lcs-photo__img');
    const line = $('.lcs-line');
    const next = $('.lcs-next'), nextImg = $('.lcs-next__img');
    const navEl = o.nav ? document.querySelector(o.nav) : null;
    if (!stage || !line) {
      console.warn(`${ID}: needs .scene-stage and an h2.lcs-line`);
      return Stage.scene(root, { build: null });
    }
    if (!next) console.warn(`${ID}: no .lcs-next picture; the end of the hold will be a line alone on flat ground`);
    if (!photo) console.warn(`${ID}: no .lcs-photo; the first word will stand alone on flat ground: put the closing photograph in the stage`);
    if (o.direction === 'to-ink') root.classList.add('lcs--to-ink');
    for (const im of [photoImg, nextImg]) if (im && im.decode) im.decode().catch(() => {});

    // ---- the words: one inline-block span each, the trailing mark (.lcs-stop) kept with the last word.
    // Rows are rebuilt by fit(); the h2 keeps the whole line for readers.
    const words = [];
    if (!line.dataset.lcsSplit) {
      line.setAttribute('aria-label', line.textContent.replace(/\s+/g, ' ').trim());
      let cur = null;
      const add = (node) => { if (!cur) { cur = document.createElement('span'); cur.className = 'lcs-word'; words.push(cur); } cur.appendChild(node); };
      for (const n of [...line.childNodes]) {
        if (n.nodeType === 3) {
          for (const p of n.nodeValue.split(/(\s+)/)) { if (!p) continue; if (/^\s+$/.test(p)) { cur = null; continue; } add(document.createTextNode(p)); }
        } else if (n.nodeType === 1) add(n);
      }
      line.textContent = '';
      line.dataset.lcsSplit = '1';
    } else words.push(...line.querySelectorAll('.lcs-word'));
    if (!words.length) return Stage.scene(root, { build: null });
    if (words.length > 6) console.warn(`${ID}: ${words.length} words; the line holds 3-5 (one giant row, two at most on a phone)`);

    // ---- fit: the size that makes the line span the content width, on one row or two
    const geo = { fs: 0, rows: 0, lineH: 0, rise: 0, clip0: 0, nextTop: 0, travel: 0, H: 0 };
    const rowsOf = (split) => (split ? [words.slice(0, split), words.slice(split)] : [words]);
    const setRows = (split) => {
      const want = rowsOf(split);
      const have = [...line.querySelectorAll(':scope > .lcs-row')];
      if (have.length === want.length && have.every((r, i) => r.childElementCount === want[i].length && want[i].every((w) => w.parentElement === r))) return;
      for (const r of have) r.remove();
      for (const ws of want) {
        const row = document.createElement('span');
        row.className = 'lcs-row';
        row.setAttribute('aria-hidden', 'true');
        ws.forEach((w, i) => { if (i) row.appendChild(document.createTextNode(' ')); row.appendChild(w); });
        line.appendChild(row);
      }
    };
    let split = 0;
    const fit = () => {
      const cs = getComputedStyle(line);
      const W = line.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const H = root.classList.contains('is-live') ? stage.clientHeight || innerHeight : innerHeight;
      if (!(W > 0) || !(H > 0)) return false;
      // measure every word and a space at 100px, on one row
      setRows(0);
      line.style.fontSize = '100px';
      const ws = words.map((w) => w.getBoundingClientRect().width);
      const probe = document.createElement('span');
      probe.className = 'lcs-row';
      probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0';
      probe.textContent = 'H H';
      line.appendChild(probe);
      const a = probe.getBoundingClientRect().width;
      probe.textContent = 'HH';
      const space = Math.max(0, a - probe.getBoundingClientRect().width);
      probe.remove();
      const width = (i, j) => ws.slice(i, j).reduce((s, x) => s + x, 0) + Math.max(0, j - i - 1) * space;
      const lh = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 0.92;
      const one = width(0, words.length);
      if (!(one > 0)) return false;
      let fs = (100 * W * 0.995) / one;
      split = 0;
      // two rows when one is too small for the stage, broken where the rows are most even
      if (words.length > 1 && fs < o.min * H) {
        let best = 1, bw = Infinity;
        for (let k = 1; k < words.length; k++) { const m = Math.max(width(0, k), width(k, words.length)); if (m < bw) { bw = m; best = k; } }
        split = best;
        fs = (100 * W * 0.995) / bw;
      }
      const rows = split ? 2 : 1;
      fs = Math.min(fs, (o.max * H) / (rows * lh));
      line.style.fontSize = fs.toFixed(2) + 'px';
      setRows(split);
      const changed = Math.abs(fs - geo.fs) > 0.5 || rows !== geo.rows || Math.abs(H - geo.H) > 1;
      geo.fs = fs; geo.rows = rows; geo.H = H;
      root.classList.toggle('lcs--two', rows === 2);
      if (root.classList.contains('is-live')) measure();
      return changed;
    };
    // live distances, from the layout at rest (transforms do not change offsetTop / offsetLeft)
    const measure = () => {
      const H = stage.clientHeight || innerHeight;
      const px = (name, d) => { const p = document.createElement('div'); p.style.cssText = `position:absolute;visibility:hidden;height:var(${name})`; stage.appendChild(p); const v = p.offsetHeight; p.remove(); return v || d; };
      const foot = px('--lcs-foot', 0.04 * H), gap = px('--lcs-gap', 0.05 * H);
      const top = line.offsetTop, lineH = line.offsetHeight;
      geo.lineH = lineH;
      // at the start of the hold the line stands at the foot of the stage, whole, one foot margin up
      const start = Math.max(top, H - lineH - foot);
      geo.rise = start - top;
      // the clip's edge starts just above the line (room for the ascenders) and is gone by the rest
      const edge0 = Math.max(0, start - 0.16 * geo.fs);
      geo.clip0 = clamp(100 * (1 - edge0 / H), 0, 100);
      geo.nextTop = Math.round(top + lineH + gap);
      stage.style.setProperty('--lcs-next-top', geo.nextTop + 'px');
      geo.travel = H - geo.nextTop;
    };
    // the distance a word slides: a share of its own width, never more than 1.1 times the type size
    const offOf = (w) => Math.round(Math.min(o.slide * w.offsetWidth, 1.1 * geo.fs));

    // ---- the swap: a class, so no frame ever blends the two grounds
    const sync = (on) => {
      root.classList.toggle('lcs--b', on);
      if (navEl) navEl.classList.toggle(o.navClass, on);
    };

    function build(tl) {
      root.classList.add('is-live');
      fit();
      measure();
      const H = () => stage.clientHeight || innerHeight;
      const ease = settle(0.8);
      // 1. the rise: the line climbs from the foot to its rest; the clip's edge climbs ahead of it
      tl.fromTo(line, { y: () => geo.rise }, { y: 0, duration: RISE, ease }, 0);
      if (photo) {
        tl.fromTo(photo, { clipPath: () => `inset(0% 0% ${geo.clip0.toFixed(3)}% 0%)` }, { clipPath: 'inset(0% 0% 100% 0%)', duration: RISE, ease }, 0);
        if (photoImg && o.drift) tl.fromTo(photoImg, { y: 0 }, { y: () => -o.drift * H(), duration: RISE, ease: 'none' }, 0);
        tl.set(photo, { autoAlpha: 0 }, RISE + 0.001);
      }
      // 2. the words, one at a time: a short slide from the right that lands beside the word before,
      //    each inside its own beat; the first is there from the start
      const n = words.length;
      const lands = snap(words.slice(1).map((_, k) => (n > 2 ? FIRST + (k * (LAST - FIRST)) / (n - 2) : LAST)));
      words.forEach((w, k) => {
        if (!k) return;
        const at = lands[k - 1] - SLIDE;
        tl.fromTo(w, { x: () => offOf(w) }, { x: 0, duration: SLIDE, ease: 'power3.out' }, at);
        tl.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: SLIDE * 0.3, ease: 'none' }, at);
      });
      const swapAt = lands.length ? lands[lands.length - 1] : LAST;
      // 3. the next picture rises from the foot into its place under the line, never closer to the
      //    line than the gap (its offset never smaller than the line's own), its photograph settling
      if (next) {
        const lineY = () => +gsap.getProperty(line, 'y') || 0;
        tl.fromTo(next, { y: () => geo.travel }, {
          y: 0, duration: NEXT[1] - NEXT[0], ease: 'power1.out',
          modifiers: { y: gsap.utils.unitize((v) => Math.max(v, lineY()), 'px') },
        }, NEXT[0]);
        if (nextImg) tl.fromTo(nextImg, { scale: 1.12 }, { scale: 1, duration: 1 - NEXT[0], ease: 'none' }, NEXT[0]);
      }
      // 4. the swap, read from the playhead (so a scrub catch-up, a jump or a reload lands on the right side)
      tl.eventCallback('onUpdate', () => sync(tl.time() >= swapAt));
      sync(tl.time() >= swapAt);
    }

    // In the finished composition a fixed header still swaps where the paper ground begins (the
    // photograph's foot). Made once, here: on a desktop with reduced motion the stage never calls rest()
    // (the scene simply stays an ordinary section), and while the scene runs the playhead decides.
    let navST = null;
    const navRest = (on) => { if (navEl && !root.classList.contains('is-live')) navEl.classList.toggle(o.navClass, on); };
    if (navEl && window.ScrollTrigger && Stage.live) {
      navST = ScrollTrigger.create({
        trigger: photo || line,
        start: () => `${photo ? 'bottom' : 'top'} ${Math.round(navEl.getBoundingClientRect().bottom)}px`,
        onEnter: () => navRest(true),
        onLeaveBack: () => navRest(false),
      });
    }

    function rest() {
      root.classList.remove('is-live');
      stage.style.removeProperty('--lcs-next-top');
      sync(false);
      fit();
      if (navST) navRest(navST.scroll() >= navST.start);
    }

    // fit before every measurement ScrollTrigger makes, once the fonts are in, and when the width changes
    if (window.ScrollTrigger && Stage.live) ScrollTrigger.addEventListener('refreshInit', fit);
    const refit = () => { if (fit() && window.ScrollTrigger && Stage.live && root.classList.contains('is-live')) ScrollTrigger.refresh(); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit).catch(() => {});
    if (window.ResizeObserver) {
      let raf = 0, lastW = 0;
      new ResizeObserver(() => { const w = line.clientWidth; if (w === lastW) return; lastW = w; cancelAnimationFrame(raf); raf = requestAnimationFrame(refit); }).observe(line);
    }
    fit();

    const short = window.matchMedia('(max-height: 479px)');
    const start = () => Stage.scene(root, {
      hold: o.hold,
      // locked to the scroll when Lenis already smooths it, and on touch screens
      scrub: o.scrub ?? (Stage.lenis || Stage.touch ? true : 0.5),
      build: short.matches ? null : build,
      phone: o.phone === 'rest' || short.matches ? 'rest' : { hold: o.phoneHold, build },
      rest,
    });
    let mm = start();
    if (mm && short.addEventListener) {
      short.addEventListener('change', () => {
        if (mm) { mm.revert(); const k = Stage.scenes.indexOf(mm); if (k >= 0) Stage.scenes.splice(k, 1); }
        mm = start();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    }
    return mm;
  };
})();

// tasteskill / scenes / letter-physics.js — a claim bursts apart in true 3D; an answer lands out of the dark.
//
// A bold claim (headline A) sits readable on a dark stage, breathes in, then flies apart: every letter
// leaves along its own vector from the headline's centre, with drag, spin, tumble and a little gravity,
// the centre letters rushing nearest the viewer, each fading before the screen's edge can cut it. From
// that same centre a one-sentence answer (B) comes out of depth, whole, and lands large in paper on the
// dark, while the picture behind comes up like a room's lights. A chapter opener for a 12-36 character
// claim; it needs no picture, and one dark photograph of a lit building or room, its centre dark where
// the answer lands, makes it richer. (light 'white' or 'warm' still opens the older feathered disc of
// light with the answer in ink on it; the house no longer deals it: it reads as a glow.)
//
// DOM (the finished composition is this markup with the default CSS; no script needed to read it):
//
//   <section class="scene lp" data-scene="letter-physics" data-options='{}' aria-labelledby="lp-a">
//     <div class="scene-stage">
//       <div class="lp-bg" aria-hidden="true">                      optional picture
//         <img class="lp-bg-img" src="room-2400.jpg" alt="" width="2400" height="1350">
//         <div class="lp-scrim"></div>
//       </div>
//       <div class="lp-space"><h2 class="lp-a" id="lp-a">Darkness is a material.</h2></div>
//       <div class="lp-pool">
//         <div class="lp-halo" aria-hidden="true"></div>
//         <div class="lp-disc" aria-hidden="true"></div>
//         <p class="lp-b">One sentence of 40-90 characters that answers the claim.</p>
//       </div>
//       <div class="lp-labels"><p class="lp-label">How we work</p><p class="lp-label">Since 2011</p></div>  optional
//       <span class="lp-cue" aria-hidden="true">Scroll</span>       optional, only when the scene opens the page
//     </div>
//   </section>
//
// While it runs, the script splits A into word and letter spans (B too when answer is 'letters': its
// readable copy moves to a hidden sibling <p class="lp-sr">, and B itself is aria-hidden); with a light it
// adds the glow (<div class="lp-core">) under the disc and paints each light into an <img class="lp-glow">.
// The finished composition puts the text back unsplit, and its CSS hides the glow and the painted images.
// The disc and halo divs may stay in the markup: without a light they are never shown.
//
// A: one claim, 12-36 characters (hard cap 40); it is fitted to two lines at most, inside 86% of the
// width (and clear of the side labels), never taller than half the stage. A short claim also grows while
// it still fits: on desktop from 8.4vw up to 1.5x (--lp-a-grow; "Darkness is a material." sets at about
// 180px on a 1440px screen), on the phone from 13.5vw up to 1.4x. Two lines of 86vw hold only about 30
// characters at 40px, so on a 390px phone a longer claim is set below 40px (measured in a normal-width
// grotesk at 750: 31-32 characters 42-46px, 33 characters 40px, 37-41 characters 33-38px; a wide face
// drops sooner, from about 26). A claim of 12-20 characters in short words usually reaches 70-74px. Keep
// claims for the phone short, or accept the smaller size there. B: one short answer of about A's length
// (16-36 characters, six words or fewer). Without the light it is the payoff and lands at A's own size
// (option match; the claim and the answer read as a pair at every width), kept to two lines by the script
// (it steps down until it sets in two, and A comes down with it). A longer B (40-80 characters) still
// works with match false: --lp-b-size (clamp(30px, 4.4vw, 64px); 24px on the phone), never below a
// statement paragraph, 36/32/24px, where it may take three or four lines. On the light it
// is set at 0.047 D (22-32px) and 20px on the phone, inside the disc's solid core. Labels: 1-3 words each, sentence case;
// they sit beside A on desktop, live and at rest, and are hidden on the phone, where there is no room
// beside it (and at 768-1099px when no script runs to measure A against them).
// Colours come from custom properties, set on the section or the page: --lp-ground (the stage; when it
// is not set, the page's own --ground is used if it is dark enough for the light paper on it, else
// #0a0d0b), --lp-paper (A, #f2f3f0), --lp-ink (B, #0b0e0c), --lp-light (the disc), --lp-scrim (.74, a
// flat fill of the ground over the picture); faces from the page's --font-display and --font-text.
//
// Options (data-options JSON). Default, then range:
//   hold       1.4       screens the stage is held on desktop (1.4-2.4): the claim, the burst, the answer
//   phoneHold  1.2       screens held under 768px (1.2-2.2)
//   phone      'same'    'same' runs the scene with phone numbers; 'rest' shows the finished composition
//   scrub      auto      true when Lenis smooths the page, else 0.8 (seconds of catch-up); set to override
//   exit       'burst'   how A leaves: 'burst' (3D, drag, spin, gravity), 'detonate' (flung flat, wider,
//                        fast spin, shrinking at the end of its life) or 'crumble' (letters drop away in
//                        place, no push, no depth, the middle of the claim first; every letter is gone by
//                        0.44, and the answer comes from 0.40, out of the hole they leave)
//   spread     0.36      burst radius as a share of the stage width (0.3-0.45; 240-600px on desktop)
//   depth      520       how near the centre letters come, px (380-540; perspective is 900)
//   gravity    0.22      fall over the burst as a share of the stage height (0.12-0.3)
//   light      'none'    'none' (the default: no disc, halo or glow; B lands large in paper on the dark,
//                        from 0.22 to 0.80, and the picture comes up from 0.3, to 0.5 as the claim
//                        bursts and to full over 0.80-0.86), or the
//                        older disc of light: 'white', 'warm' (#fff6e8) or any CSS colour (B lands in
//                        ink on the light from 0.36, the picture dims to 0.42). The disc's feather reads
//                        as a glow and a radial gradient: the house deals 'none'
//   answer     'whole'   how B arrives: 'whole' (one paragraph out of depth, whole at every frame) or
//                        'letters' (the older flight, letter by letter, scrambled until it lands)
//   disc       1.1       (light only) disc diameter as a share of the stage height on desktop (0.5-1.2; at most 1.1
//                        of the width): the outer edge of the feather; the light reads about 0.87 of the
//                        stage tall once open, and keeps opening to about 1.08 while B is read: it
//                        floods the stage from top to bottom at the payoff
//   phoneDisc  1.15      disc diameter as a share of the stage width on the phone (0.9-1.3)
//   match      true      (no light) B is set at A's own size, in two lines; where it cannot reach it in two
//                        lines A comes down to meet it (to 0.72 of A's fitted size at most). Write B about
//                        as long as A (16-36 characters) so both stay large; false: the older --lp-b-size
//   payoff     'land'    'land' holds B to the end (it lands at 0.80, 0.88 on the light); 'pass' carries B
//                        through the screen plane and away
//                        over 0.84-0.98 (only when the next section continues the statement)
//   intro      false     true: when the scene opens the page and it loads unscrolled, the letters gather
//                        from a loose cloud over 1.1s; the first scroll ends it
//   particles  'auto'    'chars', 'words', or 'auto' (words on a phone when A is over 36 characters or
//                        the device has 4 cores or fewer)
//   seed       0         any integer; changes every letter's path (paths are always the same on every pass)
//
// Progress map, light 'none' and answer 'whole' (the defaults; desktop 1440x900, hold 1.4; the phone runs
// the same fractions): 0-6% A at rest, labels in, the picture at 0.3 (0.5 by 40%); 6-16% A breathes in to 95.5%;
// 16-60% the burst (A unreadable from about 25%, mid-air in 3D at 20%, every letter gone by about 40%:
// a letter fades as it nears the screen's edge, 0.4 or less where the edge would cut it, and letters
// rising into the top 96px are at 0.4 or less, for a sticky nav); 22-80% B comes out of depth from the
// centre once A's middle has cleared, whole, in full paper by 30%, from about 18px, growing at an even
// pace to the claim's own size (match) at 80%, a little above the middle, a clear change at every step;
// 80-86% the second beat: the picture comes up from 0.5 to full under the landed answer in one quick cue,
// like a room's lights switched on; 86-100% a still read (about a sixth of a screen).
// Progress map with a light (hold 1.8): 0-6% A at rest, labels
// in; 6-16% A breathes in to 95.5%; 16-60% the burst (A unreadable from about 25%, every letter gone by
// 51%; letters rising into the top 96px are at 0.4 or less, for a sticky nav); 20-30% the light comes on
// at the centre: a soft glow, white at its heart with no edge at any size, in a wide faint halo; 35-41%
// the disc condenses in that glow once it is half grown (so it never shows as a small coin), and opens
// to about 0.87 of the stage height by 54%, the halo with it, the picture dims to 0.42; 36-74% B flies in
// from depth (with answer 'letters': in reading order, landing word by word) on the light as it opens (it starts once A's
// letters have left the middle, so no letter of A ever lies on it, and the stage is never left with
// only the glow); 58-90% the light keeps opening, disc and halo to 1.24 (it floods the stage from top to
// bottom) while B is read, ink on light; 90-100% a still read.
//
// Performance: the light is painted once per size into bitmaps shown as images, so the scrub only scales
// and fades finished pictures on their own layers (will-change while the stage is on screen, hidden while
// at 0); geometry is measured only when the stage resizes, the fonts change or ScrollTrigger refreshes,
// never inside a frame.
(() => {
  const ID = 'letter-physics';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const num = (v, d, a, b) => (typeof v === 'number' && isFinite(v) ? clamp(v, a, b) : d);
  const pick = (v, list, d) => (list.includes(v) ? v : d);
  const LIGHTS = { white: '#ffffff', warm: '#fff6e8' };
  const DRAG = 1 - Math.exp(-3);
  // A letter whose top edge rises into the top 96px of the stage (under a sticky nav) is at 0.4 or less,
  // and gone by 32px: 1 at 192px, 0.4 at 96px, 0 at 32px.
  const navFade = (top) => clamp01((top - 32) / 160);

  const settings = (o) => ({
    hold: num(o.hold, 1.4, 1.4, 2.4),
    phoneHold: num(o.phoneHold, 1.2, 1.2, 2.2),
    phone: o.phone === 'rest' ? 'rest' : 'same',
    scrub: typeof o.scrub === 'boolean' || typeof o.scrub === 'number' ? o.scrub : null,
    exit: pick(o.exit, ['burst', 'detonate', 'crumble'], 'burst'),
    spread: num(o.spread, 0.36, 0.3, 0.45),
    depth: num(o.depth, 520, 380, 540),
    gravity: num(o.gravity, 0.22, 0.12, 0.3),
    light: typeof o.light === 'string' && o.light.trim() ? o.light.trim() : 'none',
    answer: pick(o.answer, ['whole', 'letters'], 'whole'),
    disc: num(o.disc, 1.1, 0.5, 1.2),
    phoneDisc: num(o.phoneDisc, 1.15, 0.9, 1.3),
    payoff: pick(o.payoff, ['land', 'pass'], 'land'),
    match: o.match !== false,
    intro: o.intro === true,
    particles: pick(o.particles, ['auto', 'chars', 'words'], 'auto'),
    seed: Number.isInteger(o.seed) ? o.seed : 0,
  });

  // Seeded randomness: every letter's path comes from the text, so scrubbing back and forth replays it.
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const prng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  // Split into words (inline-block, nowrap, so lines break exactly as the unsplit text) and characters.
  // The full text stays readable to screen readers in a hidden copy; the split spans are hidden from them.
  // The heading keeps its copy inside (it names the section); the answer's copy is a hidden sibling and the
  // split paragraph is aria-hidden, so the paragraph itself holds the sentence once (measurable as it is).
  const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = (s) => (seg ? [...seg.segment(s)].map((x) => x.segment) : Array.from(s));
  const split = (el, outside = false) => {
    if (el.__lp) return el.__lp;
    const html = el.innerHTML;
    const hidden = el.getAttribute('aria-hidden');
    const words = [], chars = [];
    const walk = (node) => {
      for (const n of [...node.childNodes]) {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of n.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (!part.trim()) { frag.append(' '); continue; }
            const w = document.createElement('span');
            w.className = 'lp-word';
            w.setAttribute('aria-hidden', 'true');
            const wi = words.length;
            for (const g of graphemes(part)) {
              const c = document.createElement('span');
              c.className = 'lp-char';
              c.textContent = g;
              w.append(c);
              chars.push({ el: c, wi });
            }
            words.push({ el: w, wi });
            frag.append(w);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      }
    };
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    walk(el);
    const sr = document.createElement(outside ? 'p' : 'span');
    sr.className = 'lp-sr';
    sr.textContent = text;
    if (outside) { el.after(sr); el.setAttribute('aria-hidden', 'true'); } else el.prepend(sr);
    el.__lp = { html, words, chars, text, sr, outside, hidden };
    return el.__lp;
  };
  // Layout position of el inside box, transforms ignored. offsetParent is not enough on its own: an element
  // with preserve-3d (each word) is the offset parent of its characters in Chrome.
  const offset = (el, box) => {
    let x = 0, y = 0, n = el;
    while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    if (n === box) return { x, y };
    let bx = 0, by = 0;
    for (let m = box; m; m = m.offsetParent) { bx += m.offsetLeft; by += m.offsetTop; }
    return { x: x - bx, y: y - by };
  };
  const unsplit = (el) => {
    if (!el || !el.__lp) return;
    const s = el.__lp;
    el.innerHTML = s.html;
    if (s.outside) {
      s.sr.remove();
      if (s.hidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', s.hidden);
    }
    delete el.__lp;
  };
  // A colour as rgb 0-255, through a 1px canvas (any CSS colour syntax the browser knows).
  let probe = null;
  const rgbOf = (c) => {
    try {
      if (!c || (window.CSS && CSS.supports && !CSS.supports('color', c))) return null;
      probe = probe || document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      probe.clearRect(0, 0, 1, 1);
      probe.fillStyle = '#000';
      probe.fillStyle = c;
      probe.fillRect(0, 0, 1, 1);
      const d = probe.getImageData(0, 0, 1, 1).data;
      return d[3] > 250 ? [d[0], d[1], d[2]] : null;
    } catch (e) { return null; }
  };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };

  const make = (root, opts = {}) => {
    const o = settings(opts || {});
    const stage = root.querySelector(':scope > .scene-stage') || root.firstElementChild;
    const a = root.querySelector('.lp-a');
    if (!stage || !a) return null;
    const b = root.querySelector('.lp-b');
    const space = root.querySelector('.lp-space');
    const bg = root.querySelector('.lp-bg');
    const disc = root.querySelector('.lp-disc');
    const halo = root.querySelector('.lp-halo');
    const labels = root.querySelector('.lp-labels');
    const cue = root.querySelector('.lp-cue');
    const lightOn = o.light !== 'none' && !!disc;
    root.dataset.light = lightOn ? 'on' : 'none';
    // The glow, a light the live scene adds under the disc (decoration, hidden from readers): white at its
    // heart and soft all the way out, with no edge at any size, so the light comes on as a glow and the
    // disc condenses inside it.
    let core = null;
    if (lightOn) {
      core = root.querySelector('.lp-core');
      if (!core) {
        core = document.createElement('div');
        core.className = 'lp-core';
        core.setAttribute('aria-hidden', 'true');
        disc.before(core);
      }
    }
    if (lightOn) root.style.setProperty('--lp-light', LIGHTS[o.light] || o.light);
    root.style.setProperty('--lp-disc', String(o.disc));
    root.style.setProperty('--lp-disc-phone', String(o.phoneDisc));
    // The stage takes the page's own ground when the section has no --lp-ground and that ground is dark
    // enough for the paper colour (about 7:1); a light page ground keeps the scene's own near-black.
    if (!getComputedStyle(root).getPropertyValue('--lp-ground').trim()) {
      const rgb = rgbOf(getComputedStyle(root).getPropertyValue('--ground').trim());
      if (rgb && lum(rgb) <= 0.08) root.style.setProperty('--lp-ground-page', `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`);
    }

    const clean = (el) => (el ? el.textContent.trim().replace(/\s+/g, ' ') : '');
    const textA = clean(a), textB = clean(b);
    const seed = (hash(textA + '|' + textB) ^ o.seed) >>> 0;
    // dirty: the geometry must be measured again (a resize, a refresh, new fonts, a new mode); it is never
    // read from the layout inside a frame
    const S = { live: false, phone: false, dirty: true, geo: null, pa: [], pb: [], clean: true, P: { u: 0 }, nW: 1 };

    // Fit A to two lines at most inside the width it may use: 86% of the stage, and never into the side
    // labels where they sit beside it. Also no taller than half the stage. The CSS size is the start; a
    // claim that does not fit shrinks, and a short one grows, up to --lp-a-grow (1.5 on desktop, 1.4 on the
    // phone), for as long as it still fits.
    const cssNum = (name, d) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || d;
    const lineHeight = () => cssNum('--lp-lh', 0.92);
    // Without the light the answer is the payoff on its own and is set large (--lp-b-size, up to 64px): it
    // keeps to two lines, stepping down until it does, but never below the size of a statement paragraph
    // (36px from 1100px wide, 32px from 600px, 24px under), where it may take three or four lines instead.
    // match (the default): the answer is set at the claim's own size, so the payoff lands as large as the
    // claim it answers at every width; in two lines, it steps down until it fits, and the claim comes down to
    // meet it (to 0.72 of its fitted size at most: a long answer keeps the older, smaller look).
    const fitB = () => {
      if (!b || lightOn) return;
      root.style.setProperty('--lp-b-fit', '1');
      if (o.match) {
        root.style.removeProperty('--lp-b-px');
        const fa = parseFloat(getComputedStyle(a).fontSize) || 0;
        if (fa) root.style.setProperty('--lp-b-px', fa.toFixed(1) + 'px');
      }
      const fs = parseFloat(getComputedStyle(b).fontSize) || 16;
      const vw = window.innerWidth, stmt = vw < 600 ? 24 : vw < 1100 ? 32 : 36;
      const lines = () => { const cs = getComputedStyle(b); return Math.round(b.offsetHeight / (parseFloat(cs.lineHeight) || 1.1 * parseFloat(cs.fontSize))); };
      if (fs > stmt && lines() > 2) {
        let lo = stmt / fs, hi = 1;
        for (let i = 0; i < 9; i++) {
          const m = (lo + hi) / 2;
          root.style.setProperty('--lp-b-fit', m.toFixed(4));
          if (lines() <= 2) lo = m; else hi = m;
        }
        root.style.setProperty('--lp-b-fit', lo.toFixed(4));
      }
      if (!o.match) return;
      const fa = parseFloat(getComputedStyle(a).fontSize) || 0, fb = parseFloat(getComputedStyle(b).fontSize) || 0;
      if (fa && fb && fb < fa - 0.5) {
        const fit = parseFloat(getComputedStyle(root).getPropertyValue('--lp-fit')) || 1;
        root.style.setProperty('--lp-fit', (fit * Math.max(0.72, fb / fa)).toFixed(4));
      }
    };
    const fitA = () => { fitClaim(); fitB(); };
    const fitClaim = () => {
      // marks the claim as measured, which lets the CSS keep the labels beside it at any desktop width
      // (set first, so the measure below sees the labels where they will be)
      root.dataset.fit = '';
      const live = root.classList.contains('is-live');
      const W = stage.clientWidth || window.innerWidth;
      const H = live ? stage.clientHeight : window.innerHeight;
      let avail = 0.86 * W;
      if (labels && getComputedStyle(labels).display !== 'none' && !window.matchMedia('(max-width: 767px)').matches) {
        const lw = Math.max(0, ...[...labels.children].map((l) => l.offsetWidth));
        avail = Math.min(avail, W - 2 * (48 + lw + 40));
      }
      avail = Math.max(avail, Math.min(0.86 * W, 280));
      root.style.setProperty('--lp-a-max', Math.round(avail) + 'px');
      root.style.setProperty('--lp-fit', '1');
      const LH = lineHeight();
      const grow = clamp(cssNum('--lp-a-grow', 1), 1, 2);
      // overflow from layout offsets: scrollWidth would count letters the burst has already thrown
      const overflows = () => {
        if (!a.__lp) return a.scrollWidth > a.clientWidth + 1;
        const cw = a.clientWidth;
        return a.__lp.words.some((w) => { const q = offset(w.el, a); return q.x < -1 || q.x + w.el.offsetWidth > cw + 1; });
      };
      const ok = () => {
        const fs = parseFloat(getComputedStyle(a).fontSize) || 16;
        return Math.round(a.offsetHeight / (fs * LH)) <= 2 && !overflows() && a.offsetHeight <= 0.5 * H;
      };
      let lo = 0.3, hi = 1;
      if (ok()) {
        if (grow <= 1) return;
        root.style.setProperty('--lp-fit', grow.toFixed(4));
        if (ok()) return;
        lo = 1; hi = grow;
      }
      for (let i = 0; i < 9; i++) {
        const m = (lo + hi) / 2;
        root.style.setProperty('--lp-fit', m.toFixed(4));
        if (ok()) lo = m; else hi = m;
      }
      root.style.setProperty('--lp-fit', lo.toFixed(4));
    };

    // Particles and their seeded values. The draw order of the generator never depends on the mode, so a
    // given text and seed always gives the same letters the same character.
    const prepare = (phone) => {
      S.phone = phone;
      const sa = split(a);
      // the answer is split only when it flies in by letters; whole, it stays one paragraph
      const sb = b && o.answer === 'letters' ? split(b, true) : null;
      const byWords = o.particles === 'words' || (o.particles === 'auto' && phone && ([...textA].length > 36 || (navigator.hardwareConcurrency || 8) <= 4));
      const rnd = prng(seed);
      const sgn = () => (rnd() < 0.5 ? -1 : 1);
      S.pa = (byWords ? sa.words : sa.chars).map((p, i) => {
        const v = { el: p.el, wi: p.wi, i };
        v.jit = (rnd() * 2 - 1) * (10 * Math.PI) / 180;
        v.k = 0.8 + 0.45 * rnd();
        v.spinR = rnd(); v.spinS = sgn();
        v.tx = sgn() * 50 * rnd(); v.ty = sgn() * 50 * rnd();
        v.cr = rnd(); v.cd = 0.04 + 0.07 * rnd();
        v.drop = 40 + 120 * rnd(); v.dx = (rnd() * 2 - 1) * 10; v.rot = (rnd() * 2 - 1) * 20;
        return v;
      });
      const rb = prng(seed ^ 0x9e3779b9);
      const sgb = () => (rb() < 0.5 ? -1 : 1);
      const bWords = sb && [...textB].length > 90;
      S.pb = sb ? (bWords ? sb.words : sb.chars).map((p, i) => ({ el: p.el, wi: p.wi, i, r: rb(), s: sgb(), rx: sgb() * 40 * rb(), rz: sgb() * 15 * rb(), zr: rb() })) : [];
      S.nW = sb ? sb.words.length : 1;
    };
    const resetA = () => {
      for (const p of S.pa) { p.el.style.transform = ''; p.el.style.opacity = ''; }
      S.clean = true;
    };

    // Geometry, measured with layout offsets (transforms never count) and redone only when it is marked
    // dirty: the stage resized, the mode or the fonts changed, or ScrollTrigger refreshed. A frame never
    // reads the layout.
    const G = () => {
      if (S.geo && !S.dirty) return S.geo;
      S.dirty = false;
      fitA();
      const W = stage.clientWidth, H = stage.clientHeight, ph = S.phone;
      const c = ph
        ? { R: 0.62 * W, Zc: 340, Ze: 90, L: 0.05 * H, Gv: 0.16 * H, spin: [40, 100], tilt: false }
        : { R: clamp(o.spread * W, 240, 600), Zc: o.depth, Ze: 140, L: 0.06 * H, Gv: o.gravity * H, spin: [60, 140], tilt: true };
      if (o.exit === 'detonate') Object.assign(c, { R: (ph ? 0.75 : 0.52) * W, Zc: 0, Ze: 0, L: 0.1 * H, spin: [180, 360], tilt: false });
      c.P = (space && parseFloat(getComputedStyle(space).perspective)) || (ph ? 700 : 900);
      const aw = a.clientWidth, ah = a.clientHeight;
      const pts = S.pa.map((p) => { const q = offset(p.el, a); return { x: q.x + p.el.offsetWidth / 2 - aw / 2, y: q.y + p.el.offsetHeight / 2 - ah / 2, hw: p.el.offsetWidth / 2, hh: p.el.offsetHeight / 2 }; });
      // a letter fades as it nears the screen's edge, so the edge never cuts an opaque letter: 1 while it is
      // 1.6 of its own radius inside, 0.4 as it touches the edge, gone with its centre 0.6 of a radius inside
      const edgeFade = (X, Y, r) => clamp01((Math.min(X, W - X, Y, H - Y) - 0.6 * r) / r);
      const dmax = Math.max(1, ...pts.map((q) => Math.hypot(q.x, q.y)));
      const av = pts.map((q, i) => {
        const d = Math.hypot(q.x, q.y);
        let nx = 0, ny = -1;
        if (d >= 4) { nx = q.x / d; ny = q.y / d; }
        const p = S.pa[i], j = p.jit, cs = Math.cos(j), sn = Math.sin(j), dn = d / dmax;
        // by, hh: where the letter starts against the stage centre, for the fade under a sticky nav;
        // f0: that fade at rest, so a letter that starts high is never dimmed on the first frame;
        // cs: when it starts to crumble (crumble only): the middle of the claim first, where the light
        // will open, the edges last, every letter gone by 0.44
        // e0: the edge fade at rest, so a letter that starts near an edge is never dimmed on the first frame
        const r0 = Math.hypot(q.hw, q.hh);
        return { nx: nx * cs - ny * sn, ny: nx * sn + ny * cs, dn, bx: q.x, by: q.y, hh: q.hh, r0, f0: navFade(H / 2 + q.y - q.hh), e0: edgeFade(W / 2 + q.x, H / 2 + q.y, r0), cs: Math.min(0.16 + 0.15 * dn + 0.1 * p.cr, 0.44 - p.cd) };
      });
      let bv = [];
      if (b && S.pb.length) {
        const bw = b.clientWidth, bh = b.clientHeight;
        bv = S.pb.map((p) => {
          const q = offset(p.el, b), x = q.x + p.el.offsetWidth / 2 - bw / 2, y = q.y + p.el.offsetHeight / 2 - bh / 2;
          return { x: x * 0.5 + p.s * (20 + 40 * p.r), y: y * 0.5 + (20 + 40 * p.r), z: -(800 + 600 * p.zr) };
        });
      }
      S.geo = { c, a: av, b: bv, W, H, edgeFade };
      if (S.live) bake();
      return S.geo;
    };

    // The light, painted once per size: a flat circle softened by a Gaussian (a canvas shadow, sigma =
    // shadowBlur / 2), so the scrub only scales a finished bitmap. A live CSS blur would be filtered again
    // on every frame the disc grows. Disc: circle 0.79 D, sigma 0.051 D, in a 1.1 D box; halo: circle
    // 1.1 D at 26% of the light, sigma 0.15 D, in a 2 D box, the wide spill; glow (live only, made here):
    // circle 0.92 D, sigma 0.15 D, in a 1.6 D box: white at its heart, its feather a third of its radius,
    // so it reads as light and never as a coin however small it is scaled. A baked feather shrinks with
    // its bitmap, so the disc (a thin feather on a wide plateau) is never shown small: the glow makes the
    // first light, and the disc condenses inside it once it is half grown. The finished composition keeps
    // the CSS blur.
    // Each bitmap is shown as an <img> (a PNG of the canvas), not as the canvas: a layer that holds one
    // image is rastered at the image's own size (480-720px) and scaled by the compositor, where a canvas
    // would be rastered at its box (up to 2 D, about 1700px) every time it is first shown.
    const glow = (el) => el.querySelector(':scope > .lp-glow') || el.appendChild(Object.assign(document.createElement('img'), { className: 'lp-glow', alt: '', decoding: 'async', draggable: false }));
    const paint = (el, box, r, sigma, alpha, cap) => {
      const w = el.clientWidth;
      if (!w) return;
      const n = Math.max(8, Math.round(Math.min(w, cap))), k = n / w, D = w / box;
      const col = getComputedStyle(root).getPropertyValue('--lp-light').trim() || '#ffffff';
      const img = glow(el), id = `${n}|${col}`;
      if (img.__id === id) return;          // the bitmap depends only on its pixel size and colour
      img.__id = id;
      const cv = document.createElement('canvas');
      cv.width = n; cv.height = n;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      const off = n * 3;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 2 * sigma * D * k;
      ctx.shadowOffsetX = off;
      ctx.beginPath();
      ctx.arc(n / 2 - off, n / 2, r * D * k, 0, Math.PI * 2);
      ctx.fill();
      // a light seeded dither (about 2 levels) on the feather only, so a long soft falloff on a dark ground
      // does not step into rings; the solid core stays clean under B
      try {
        const data = ctx.getImageData(0, 0, n, n), px = data.data, rnd = prng(n * 7919 + 17);
        for (let i = 3; i < px.length; i += 4) {
          const v = px[i];
          if (v > 0 && v < 250) px[i] = clamp(Math.round(v + (rnd() + rnd() - 1) * 2), 0, 255);
        }
        ctx.putImageData(data, 0, 0);
      } catch (e) { /* a tainted or lost canvas keeps the plain feather */ }
      // decoded at once (the light shows a fifth of the way in), so its first visible frame never decodes
      const show = (url) => {
        const old = img.__url;
        img.__url = url;
        img.src = url;
        const ready = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        if (old && old.startsWith('blob:')) ready.then(() => URL.revokeObjectURL(old));
      };
      if (cv.toBlob && window.URL && URL.createObjectURL) cv.toBlob((blob) => { if (blob && img.__id === id) show(URL.createObjectURL(blob)); }, 'image/png');
      else show(cv.toDataURL('image/png'));
    };
    const bake = () => {
      if (!lightOn) return;
      paint(disc, 1.1, 0.395, 0.051, 1, 720);
      if (halo) paint(halo, 2, 0.55, 0.15, 0.26, 560);
      if (core) paint(core, 1.6, 0.46, 0.15, 1, 480);
    };

    // The burst, in closed form (no physics engine under a scrub): u is the burst's own progress, 0-1.
    //   s = (1 - e^-3u) / (1 - e^-3)        air drag: fast launch, decelerating
    //   x = n.x R k s,  y = n.y R k s - L s + G u^2,  z = (Zc - (Zc - Ze) dn) s
    //   opacity = 1 - clamp((u - 0.04) / (0.30 + 0.45 dn))   centre letters go first, edge letters last
    // times the nav fade of the letter's projected top edge (perspective P, A's own scale), so a letter
    // that rises into the top 96px is already faint there.
    const renderA = (u) => {
      if (!S.pa.length) return;
      if (u <= 0) { if (!S.clean) resetA(); return; }
      S.clean = false;
      const g = G(), c = g.c;
      if (o.exit === 'crumble') {
        const t = 0.16 + 0.44 * u;
        for (const p of S.pa) {
          const f = clamp01((t - g.a[p.i].cs) / p.cd), e = f * f;
          p.el.style.transform = f > 0 ? `translate3d(${(p.dx * e).toFixed(2)}px,${(p.drop * e).toFixed(2)}px,0) rotate(${(p.rot * e).toFixed(2)}deg)` : '';
          p.el.style.opacity = f > 0 ? (1 - f).toFixed(3) : '';
        }
        return;
      }
      const s = (1 - Math.exp(-3 * u)) / DRAG;
      const fall = c.Gv * u * u, lift = c.L * s;
      // A's own scale at this u, from the release tween (0.955 → 1.06 over 0.16-0.40, power2.out), worked
      // out rather than read, so a reverse scrub (which renders the timeline's tweens in reverse order)
      // gives exactly the same frame
      const tr0 = clamp01((0.44 * u) / 0.24), sA = 0.955 + 0.105 * (1 - (1 - tr0) * (1 - tr0)), H2 = g.H / 2, W2 = g.W / 2;
      for (const p of S.pa) {
        const q = g.a[p.i];
        const x = q.nx * c.R * p.k * s;
        const y = q.ny * c.R * p.k * s - lift + fall;
        const z = (c.Zc - (c.Zc - c.Ze) * q.dn) * s;
        const life = (u - 0.04) / (0.3 + 0.45 * q.dn);
        let tr = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px)`;
        if (c.tilt) tr += ` rotateX(${(p.tx * s).toFixed(2)}deg) rotateY(${(p.ty * s).toFixed(2)}deg)`;
        tr += ` rotateZ(${(p.spinS * (c.spin[0] + c.spin[1] * p.spinR) * u).toFixed(2)}deg)`;
        if (o.exit === 'detonate' && life > 0.85) { const f = clamp01((life - 0.85) / 0.15); tr += ` scale(${(1 - 0.2 * f * f).toFixed(3)})`; }
        let op = 1 - clamp01(life);
        if (op > 0) {
          const f = c.P / Math.max(c.P * 0.2, c.P - z);
          if (q.f0 > 0) op *= Math.min(1, navFade(H2 + sA * (q.by + y - q.hh) * f) / q.f0);
          // the screen's edge: the letter's projected centre and radius against the nearest edge
          const e = g.edgeFade(W2 + sA * (q.bx + x) * f, H2 + sA * (q.by + y) * f, q.r0 * sA * f);
          op *= q.e0 > 0 ? Math.min(1, e / q.e0) : e;
        }
        p.el.style.transform = tr;
        p.el.style.opacity = op.toFixed(3);
      }
    };

    const build = (tl, c) => {
      S.live = true;
      if (lightOn) root.classList.add('is-baked');
      prepare(c.phone);
      resetA();
      S.dirty = true;
      S.geo = null;
      S.P = { u: 0 };
      G();
      // T1 the side labels and the cue step aside
      const chrome = [labels, cue].filter(Boolean);
      if (chrome.length) tl.fromTo(chrome, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 0.12, ease: 'power1.in', immediateRender: false }, 0.04);
      // T2-T3 the breath in, then the release that carries the burst
      if (o.exit !== 'crumble') {
        tl.fromTo(a, { scale: 1 }, { scale: 0.955, duration: 0.1, ease: 'power2.inOut', immediateRender: false }, 0.06)
          .to(a, { scale: 1.06, duration: 0.24, ease: 'power2.out' }, 0.16);
      }
      // T4 the burst, written per letter from the proxy; T5 A leaves the page for good
      tl.fromTo(S.P, { u: 0 }, { u: 1, duration: 0.44, ease: 'none', immediateRender: false, onUpdate: () => renderA(S.P.u) }, 0.16)
        .set(a, { visibility: 'hidden' }, 0.6);
      // T6 the picture dims as the light opens, and drifts closer over the whole hold
      // (without the light the picture does the reverse: it stays low, 0.3, under the claim, comes up to 0.5
      // as the claim bursts (0.20-0.40), so the answer arrives over the picture and not over empty dark, and
      // to full in one cue, 0.70-0.78, as the answer lands, like a room's lights coming on: the last beat)
      if (bg) {
        if (lightOn) tl.fromTo(bg, { opacity: 1 }, { opacity: 0.42, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, 0.18);
        else if (o.answer === 'whole' && o.exit !== 'crumble') {
          // the second beat: as the answer lands (0.80), the room's lights come up under it in one quick cue
          // (0.80-0.86, scrubbed), like a switch; then a still read
          tl.fromTo(bg, { opacity: 0.3 }, { opacity: 0.5, duration: 0.2, ease: 'power1.inOut' }, 0.2)
            .to(bg, { opacity: 1, duration: 0.06, ease: 'power1.inOut' }, 0.8);
        } else {
          tl.fromTo(bg, { opacity: 0.3 }, { opacity: 0.5, duration: 0.2, ease: 'power1.inOut' }, 0.2)
            .to(bg, { opacity: 1, duration: 0.08, ease: 'power1.inOut' }, 0.7);
        }
        tl.fromTo(bg, { scale: 1 }, { scale: 1.04, duration: 1, ease: 'none' }, 0);
      }
      // The light, written for a window of 0.20 → full at 0.62 and run in the default window 0.20 → 0.54
      // (at() maps it). Crumble keeps its letters in place longer, so there the same moves run later
      // (0.30 → 0.60), out of the hole the crumbling middle leaves; the light never opens behind letters
      // that still stand.
      // T7 the glow comes on at the headline's centre (0.20-0.30): white at its heart, soft all the way
      // out, growing with the disc's own curve; the halo spills wide and faint round it. T8 the disc
      // condenses in the glow only once it is about half grown (0.35-0.41), where its feather is wide and
      // the glow under it already white, so it never shows as a small coin with an edge; it opens to full
      // by 0.54, and the glow thins away under it. T9 the halo settles to a skirt. T9b while B is read the
      // light keeps opening, disc and halo to 1.24 by 0.90 (an even pace: every stretch of the scroll shows
      // it grow), until it floods the stage from top to bottom; B, set inside the disc's solid core at
      // full size, stays on the light. The fades use autoAlpha: a light at 0 is not composited at all.
      const crumble = o.exit === 'crumble';
      const END = crumble ? 0.6 : 0.54;
      if (lightOn) {
        const L0 = crumble ? 0.3 : 0.2, k = (END - L0) / 0.42;
        const at = (t) => L0 + (t - 0.2) * k;
        const fade = (el, from, to, t, d, ease = 'none') => tl.fromTo(el, { autoAlpha: from }, { autoAlpha: to, duration: d * k, ease }, at(t));
        tl.fromTo(core, { scale: 0.06 }, { scale: 1, duration: 0.42 * k, ease: 'power2.inOut' }, at(0.2));
        fade(core, 0, 1, 0.2, 0.12);
        tl.to(core, { autoAlpha: 0, duration: 0.16 * k, ease: 'power1.inOut' }, at(0.46));
        tl.fromTo(disc, { scale: 0.12 }, { scale: 1, duration: 0.42 * k, ease: 'power2.inOut' }, at(0.2));
        fade(disc, 0, 1, 0.38, 0.08, 'power1.inOut');
        if (halo) {
          tl.fromTo(halo, { scale: 0.2 }, { scale: 1, duration: 0.44 * k, ease: 'power2.out' }, at(0.22));
          fade(halo, 0, 0.9, 0.22, 0.18, 'power1.out');
          tl.to(halo, { autoAlpha: 0.55, duration: 0.26 * k, ease: 'power1.inOut' }, at(0.4));
        }
        // T9b, once the halo's own growth and settle are over (at(0.66), just before END + 0.04)
        const SP = END + 0.04, SE = 0.9;
        tl.fromTo([disc, halo].filter(Boolean), { scale: 1 }, { scale: 1.24, duration: SE - SP, ease: 'none', immediateRender: false }, SP);
      }
      // T10 B flies out of depth in reading order, shuffled inside each word, and lands word by word. With
      // the light it starts at 0.36 (crumble 0.44), as soon as A's letters have left the middle (none of
      // them is still on its lines there), and lands by 0.74 (crumble 0.80) on the light as it opens: the
      // stage is never left with only the glow. Without the light nothing else fills the middle of the
      // scene, so there B starts at 0.30, while A's last letters are still leaving the frame, and focuses in
      // word by word until 0.80 (crumble: 0.42-0.80, as its letters stand at the centre until about 0.42).
      // answer 'whole' (the default): the sentence comes out of depth as one paragraph, whole from its first
      // frame (never letters in flight, never half its words), from the time A's middle has cleared (0.22;
      // 0.40 with crumble, 0.36 on the light), in full ink by 0.30 and coming nearer at an even pace of size
      // (a paragraph facing the camera: its scale is its distance) until it lands at 0.86 (on the light 0.88)
      if (b && o.answer === 'whole') {
        // without the light it comes out of depth over 0.22-0.80 at an even pace of size, from about 18px to the
        // claim's size, so every step shows a clear change of size up to its landing, where the lights come up
        // under it (see the picture above); on the light 0.36-0.88
        const b0 = crumble ? 0.4 : lightOn ? 0.36 : 0.22, b1 = lightOn ? 0.88 : 0.8;
        // it starts at about 18-20px whatever its size (0.18-0.8 of it), so it is a sentence from its first frame
        const s0 = clamp((lightOn ? 20 : 18) / (parseFloat(getComputedStyle(b).fontSize) || 32), lightOn ? 0.4 : 0.18, 0.8);
        tl.fromTo(b, { scale: s0 }, { scale: 1, duration: b1 - b0, ease: 'none' }, b0)
          .fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, ease: 'power1.out' }, b0);
        if (o.payoff === 'pass') tl.to(b, { z: 220, opacity: 0, duration: 0.14, ease: 'power1.in' }, 0.84);
      }
      if (b && S.pb.length) {
        const b0 = lightOn ? (crumble ? 0.44 : 0.36) : crumble ? 0.42 : 0.3;
        const span = Math.max(1, S.nW - 1), bw = lightOn ? (crumble ? 0.16 : 0.18) : crumble ? 0.18 : 0.3;
        S.pb.forEach((p, i) => {
          const at = b0 + bw * (p.wi / span) + 0.04 * p.r;
          tl.fromTo(p.el,
            { x: () => G().b[i].x, y: () => G().b[i].y, z: () => G().b[i].z, rotationX: p.rx, rotation: p.rz },
            { x: 0, y: 0, z: 0, rotationX: 0, rotation: 0, duration: 0.16, ease: 'expo.out' }, at)
            .fromTo(p.el, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: 'power2.out' }, at);
        });
        tl.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, b0);
        if (o.payoff === 'pass') tl.to(b, { z: 220, opacity: 0, duration: 0.14, ease: 'power1.in' }, 0.84);
      }
      // will-change only while the stage is on screen
      ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: (self) => root.classList.toggle('is-active', self.isActive) });
      S.tl = tl;
    };

    // The finished composition: unsplit text, A fitted to two lines.
    const rest = () => {
      S.live = false;
      S.tl = null;
      root.classList.remove('is-active', 'is-baked');
      unsplit(a);
      unsplit(b);
      S.pa = []; S.pb = [];
      S.phone = window.matchMedia('(max-width: 767px)').matches;
      fitA();
    };

    // Optional load intro for a scene that opens the page: the letters gather from a loose cloud.
    const intro = () => {
      if (!o.intro || !S.live || window.scrollY > 10 || root.getBoundingClientRect().top + window.scrollY > 10) return;
      const I = { u: 0.18 };
      const ls = labels ? [...labels.children] : [];
      const EV = ['wheel', 'touchstart', 'keydown', 'scroll'];
      let done = false, tw = null, lt = null;
      const stop = (e) => {
        if (done || (e && e.type === 'scroll' && window.scrollY <= 10)) return;
        done = true;
        if (tw) tw.kill();
        if (lt) lt.progress(1).kill();
        else if (ls.length) gsap.set(ls, { opacity: 1 });
        EV.forEach((n) => window.removeEventListener(n, stop));
        S.clean = false;
        renderA(S.P.u);
      };
      // the cloud waits for the fonts, so the letters gather in the face they will be read in
      if (ls.length) gsap.set(ls, { opacity: 0 });
      renderA(I.u);
      EV.forEach((n) => window.addEventListener(n, stop, { passive: true }));
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(() => {
        if (done) return;
        tw = gsap.to(I, { u: 0, duration: 1.1, ease: 'expo.out', onUpdate: () => { S.clean = false; renderA(I.u); }, onComplete: stop });
        lt = ls.length ? gsap.to(ls, { opacity: 1, duration: 0.4, delay: 0.6 }) : null;
      }));
    };

    // Late fonts, resizes and refreshes: mark the geometry dirty, refit and re-measure, then redraw the
    // burst where the scroll left it.
    // (at progress 0 renderA draws nothing, so a late font refits the claim here: it must still set in two lines)
    const redraw = () => { if (S.live && S.pa.length) { if (S.dirty) G(); S.clean = false; renderA(S.P.u); } };
    if (window.ScrollTrigger) {
      ScrollTrigger.addEventListener('refreshInit', () => { S.dirty = true; });
      ScrollTrigger.addEventListener('refresh', redraw);
    }
    if (document.fonts) {
      let wait = 0;
      document.fonts.addEventListener('loadingdone', () => {
        S.dirty = true;
        clearTimeout(wait);
        wait = setTimeout(() => {
          if (S.live && window.ScrollTrigger) ScrollTrigger.refresh(); else fitA();
        }, 60);
      });
    }
    // a resized stage: the finished composition refits; a live one re-measures at once (ScrollTrigger's
    // own refresh follows a window resize)
    let raf = 0, size = '';
    if (window.ResizeObserver) {
      new ResizeObserver(([e]) => {
        const r = e && e.contentRect, s = r ? `${Math.round(r.width)}x${Math.round(r.height)}` : '';
        if (s === size) return;
        size = s;
        S.dirty = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { if (S.live) redraw(); else fitA(); });
      }).observe(stage);
    }

    if (!window.Stage) return null;
    const scrub = o.scrub !== null ? o.scrub : (Stage.lenis ? true : 0.8);
    const mm = Stage.scene(root, {
      hold: o.hold,
      scrub,
      build,
      phone: o.phone === 'rest' ? 'rest' : { hold: o.phoneHold, build },
      rest,
    });
    if (!mm) return null;
    intro();
    // Stage work-around: gsap.matchMedia only calls back when one of its conditions matches, and reduced
    // motion on a desktop matches neither (motion, phone), so the stage never shows the finished
    // composition there. Do it here, and again whenever the media change into that state.
    if (window.matchMedia) {
      const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
      const small = window.matchMedia('(max-width: 767px)');
      const orphan = () => {
        if (motion.matches || small.matches) return;
        root.classList.remove('is-live');
        root.classList.add('is-rest');
        root.style.removeProperty('--hold');
        rest();
      };
      orphan();
      motion.addEventListener('change', () => setTimeout(orphan));
      small.addEventListener('change', () => setTimeout(orphan));
    }
    return mm;
  };

  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = make;
})();

// tasteskill / scenes / dot-becomes-the-full-stop.js — one dot drops onto the stage and becomes the sentence's
// full stop.
//
// On the page's own ground, one large dot in the ink drops in from the top edge as the stage arrives and
// lands in the middle of it. It is not a drawn circle: it is the display face's own full stop, set very
// large (an aria-hidden svg text glyph whose box is cut to the glyph's ink). The first word comes out of
// it before the stage holds, so the held stage never shows a lone dot. Then, as the visitor scrolls, the
// claim (four or five words in the display face, set at true display size: one line across nearly the
// whole content width on desktop, two rows on a phone) grows out of it to the left, one whole word at a
// time: the dot steps right and a step smaller, the phrase steps left, and the new word rises a short way
// into the gap with no blur, so the phrase stays centred and always ends on the dot, like the tip of a
// pen. The dot shrinks by the same ratio with every word, so it is exactly the full stop's size, on the
// full stop's place, as the last word lands, and the real full stop takes over: a graphic object promoted
// into the typography, never a large ball beside the finished line and never a collapse in one step. An
// optional second beat follows: the ground steps to ink in one hard cut, the sentence turns the paper
// colour, and one plain line of supporting copy appears under it whole. No accent anywhere: the dot and
// the line are the ink (the paper after the cut).
//
// Where the dot lands is measured from the laid-out sentence, never assumed: the full stop's own glyph
// origin and the last row's baseline, read again after the fonts load, after a resize and before every
// ScrollTrigger refresh. The dot is the same glyph as the full stop in the same face and is placed by the
// same two points (its origin and its baseline), so scaling it down to the sentence's size lands it
// exactly on the full stop whatever the face's metrics; at the end the real full stop takes over, so the
// rest frame is plain text. If the face loads late, the remeasure puts the two back together before the
// hand-over is reached. The glyph's ink box (for the dot's own box and its gap to the word) is read by
// drawing the glyph and scanning it, not from measureText, whose boxes come in steps of 1/64 em.
//
// Type is never scaled: the sentence's font size is fitted (to `fill` of the content width, from the
// measured words) and set as a font size; the words move by transform and opacity only. A sentence that
// would set smaller than `min` of the stage height on one row (a phone, a tall tablet) takes two rows,
// broken where the rows are most even, never three. The dot then rides the first row (the stage above
// it is empty), takes a short carriage return down to the last row, under the row above's descenders,
// and rides the last row to the full stop. On any row the dot is kept small enough that the growing
// row never runs past the margins.
//
// Needs gsap + ScrollTrigger (no SplitText), stage.js and dot-becomes-the-full-stop.css.
//
// DOM (the CSS draws the finished composition from the same markup; the script adds the dot):
//   <section class="scene" data-scene="dot-becomes-the-full-stop" data-options='{}' aria-labelledby="dfs-line">
//     <div class="scene-stage">
//       <h2 class="dfs-line" id="dfs-line">Paid on time, without asking.</h2>
//                                     4-5 words, 16-30 characters, ending on a full stop (the scene's
//                                     subject: without one there is nowhere for the dot to land, and the
//                                     section shows the finished composition). Keep every word under
//                                     about 11 characters: a long word stretches the gap the dot travels.
//       <p class="dfs-support">One plain sentence that backs the claim up.</p>
//                                     optional, 8-16 words; it appears whole in the last beat (never typed)
//     </div>
//   </section>
//   With the second beat on (the default) the finished composition and the end of the scene are on the
//   ink ground, so the section after starts on the ink. With "beat": false add class dfs--plain to the
//   section too, so the no-script composition stays on the page ground.
//
// The h2 keeps the whole sentence for readers (aria-label); the rows and the dot the script makes are
// aria-hidden. A word not yet out is transparent (it keeps its place in the heading's text).
//
// Options (data-options JSON; defaults, ranges):
//   hold       0.6    0.5-1.5   screens the stage is held for, after the arrival (0.18 of a screen). One
//                               line on the page ground is done in well under a screen: six beats (four
//                               words, the cut, the supporting line) at about 55px of scroll a tenth
//   phoneHold  0.7    0.5-1.5   (touch reads a little slower, and two rows add the carriage return)
//   beat       true             the second beat: hard cut to the ink ground, sentence in the paper colour,
//                               the supporting line whole under it. false: the ground stays; a supporting
//                               line, if there is one, still appears whole after the full stop lands
//   dot        0.2    0.1-0.28  the dropped dot's diameter as a share of the stage height (and never
//                               more than a third of the stage width)
//   fill       0.95   0.5-0.97  share of the content width the finished sentence spans (its widest row)
//   max        0.17   0.1-0.24  share of the stage height the sentence's font size never passes
//   min        0.07   0.04-0.1  share of the stage height under which a one-row sentence takes two rows
//   rise       0.24   0.1-0.4   how far a word rises into place, in em
//   nav        ""               selector of a fixed header over the scene; it gets navClass from the cut
//   navClass   "is-ink"         to the ink on (style that class to recolour the bar in the same jump)
//   scrub      0.5 | true       seconds of catch-up; true (locked) when Lenis smooths the page and on touch
//   phone      "same"           "same" | "rest" (the phone gets the finished composition)
//   Screens under 480px tall always get the finished composition.
//
// Timeline. The arrival, while the stage's top climbs the last 18% of the screen (its own scrubbed
// stretch, before the hold): the dot falls from the stage's top edge onto the line's baseline in the
// middle (power2.in, the first half), then the first word comes out of it (the second half), so the hold
// opens on a word and its dot. The hold: the second word to the last, the cut and the supporting line,
// each inside its own tenth (from 0.15 to 0.85 of it) so a frame taken on any tenth shows whole words
// only, spread evenly so the last lands in the last tenth and no two still tenths follow each other.
// Five words and the second beat:
//   0.1, 0.3, 0.5, 0.6   words two to five: the dot steps right and a step smaller and the words before
//            step left (power3.out over the first 55% of the beat), opening the gap; the new word rises
//            0.24em into it from 30% of the beat, in full ink within a third of its rise, never under
//            the dot. The fifth word's step ends with the dot on the laid-out full stop, which takes over
//   0.75     the cut: ground to ink and sentence to paper in one jump (a class, never a blend)
//   0.9-1    the supporting line appears whole under the sentence (a short rise, no typing)
// Dot sizes: the dropped size, then the full stop's size times (dropped / full stop)^((n - s) / n) after
// word s, so each word takes the same share off and the last word brings it to the full stop exactly.
// Phone and tablet ("same", two rows): the dot rides the first row as on desktop, then, on the first
// word of the last row, drops to it in the first half of the beat and slides back along it in the
// second, while the row it left closes up and the word rises in place; the last row then grows out of
// it as on desktop.
//
// Colours: --ground (the paper) and --ink from the page; no accent. The ink must contrast 7:1 or better
// with the paper both ways. The scene's own tokens are in dot-becomes-the-full-stop.css.
(() => {
  const ID = 'dot-becomes-the-full-stop';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, d, a, b) => { const n = typeof v === 'string' && v.trim() !== '' ? +v : v; return typeof n === 'number' && isFinite(n) ? clamp(n, a, b) : d; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const out3 = (t) => 1 - Math.pow(1 - t, 3);
  const in2 = (t) => t * t;
  const inOut2 = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const STOP = /[.]$/;

  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = (root, opts = {}) => {
    const o = {
      hold: num(opts.hold, 0.6, 0.5, 1.5),
      phoneHold: num(opts.phoneHold, 0.7, 0.5, 1.5),
      beat: opts.beat !== false,
      dot: num(opts.dot, 0.2, 0.1, 0.28),
      fill: num(opts.fill, 0.95, 0.5, 0.97),
      max: num(opts.max, 0.17, 0.1, 0.24),
      min: num(opts.min, 0.07, 0.04, 0.1),
      rise: num(opts.rise, 0.24, 0.1, 0.4),
      nav: typeof opts.nav === 'string' ? opts.nav.trim() : '',
      navClass: typeof opts.navClass === 'string' && opts.navClass.trim() ? opts.navClass.trim() : 'is-ink',
      scrub: opts.scrub === true ? true : typeof opts.scrub === 'number' ? clamp(opts.scrub, 0, 2) : null,
      phone: opts.phone === 'rest' ? 'rest' : 'same',
    };
    const stage = root.querySelector(':scope > .scene-stage') || root.firstElementChild;
    const line = root.querySelector('.dfs-line');
    const support = root.querySelector('.dfs-support');
    const navEl = o.nav ? document.querySelector(o.nav) : null;
    if (!o.beat) root.classList.add('dfs--plain');
    if (!stage || !line) {
      console.warn(`${ID}: needs .scene-stage and an h2.dfs-line`);
      return Stage.scene(root, { build: null });
    }

    // ---- split: one inline-block span a word; the closing full stop becomes span.dfs-stop inside the
    // last word (an inline span, so the face still kerns it against the letter before it)
    const text = line.textContent.replace(/\s+/g, ' ').trim();
    if (!STOP.test(text)) {
      console.warn(`${ID}: "${text}" does not end on a full stop, so the dot has nowhere to land; showing the finished composition`);
      return Stage.scene(root, { build: null });
    }
    const words = [];
    let stop = null;
    if (!line.dataset.dfsSplit) {
      line.setAttribute('aria-label', text);
      const parts = text.split(' ');
      parts.forEach((p, i) => {
        const w = document.createElement('span');
        w.className = 'dfs-word';
        if (i === parts.length - 1) {
          w.appendChild(document.createTextNode(p.slice(0, -1)));
          stop = document.createElement('span');
          stop.className = 'dfs-stop';
          stop.textContent = '.';
          w.appendChild(stop);
        } else w.textContent = p;
        words.push(w);
      });
      line.textContent = '';
      line.dataset.dfsSplit = '1';
    } else {
      words.push(...line.querySelectorAll('.dfs-word'));
      stop = line.querySelector('.dfs-stop');
    }
    const n = words.length;
    if (n < 2 || !stop) return Stage.scene(root, { build: null });
    if (n > 6) console.warn(`${ID}: ${n} words; the claim holds 4-5 (it is one line on desktop, two rows at most on a phone)`);
    const longest = words.reduce((m, w) => Math.max(m, w.textContent.length), 0);
    if (longest > 12) console.warn(`${ID}: a word of ${longest} characters; long words stretch the step the dot takes, keep each under about 11`);

    // the dot: the face's own full stop, set large as a decorative glyph (svg text, aria-hidden), its box
    // cut to the glyph's ink so nothing of it reaches the words it rides beside
    const NS = 'http://www.w3.org/2000/svg';
    let dot = stage.querySelector(':scope > svg.dfs-dot');
    if (!dot) {
      dot = document.createElementNS(NS, 'svg');
      dot.setAttribute('class', 'dfs-dot');
      dot.setAttribute('aria-hidden', 'true');
      dot.setAttribute('focusable', 'false');
      const glyph = document.createElementNS(NS, 'text');
      glyph.setAttribute('x', '0');
      glyph.setAttribute('y', '0');
      glyph.textContent = '.';
      dot.appendChild(glyph);
      stage.appendChild(dot);
    }
    const glyph = dot.querySelector('text');

    // ---- rows: one, or two where they are most even; each row ends on a baseline probe
    let split = 0;
    const rowsOf = (k) => (k ? [words.slice(0, k), words.slice(k)] : [words]);
    const setRows = (k) => {
      const have = [...line.querySelectorAll(':scope > .dfs-row')];
      const want = rowsOf(k);
      if (have.length === want.length && have.every((r, i) => want[i].every((w) => w.parentElement === r) && r.querySelectorAll('.dfs-word').length === want[i].length)) return;
      for (const r of have) r.remove();
      for (const ws of want) {
        const row = document.createElement('span');
        row.className = 'dfs-row';
        row.setAttribute('aria-hidden', 'true');
        ws.forEach((w, i) => { if (i) row.appendChild(document.createTextNode(' ')); row.appendChild(w); });
        row.appendChild(Object.assign(document.createElement('i'), { className: 'dfs-base' }));
        line.appendChild(row);
      }
    };
    setRows(0);

    // ---- fit: the size at which the sentence spans `fill` of the content width, on one row or two
    const geo = { fs: 0, rows: 0, H: 0, W: 0 };
    const isLive = () => root.classList.contains('is-live');
    const fit = () => {
      const W = line.clientWidth;
      const H = isLive() ? stage.clientHeight || innerHeight : innerHeight;
      if (!(W > 0) || !(H > 0)) return false;
      const fill = o.fill;
      setRows(0);
      line.style.fontSize = '100px';
      const ws = words.map((w) => w.getBoundingClientRect().width);
      const probe = document.createElement('span');
      probe.className = 'dfs-row';
      probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0';
      probe.textContent = 'H H';
      line.appendChild(probe);
      const a = probe.getBoundingClientRect().width;
      probe.textContent = 'HH';
      const space = Math.max(0, a - probe.getBoundingClientRect().width);
      probe.remove();
      const width = (i, j) => ws.slice(i, j).reduce((s, x) => s + x, 0) + Math.max(0, j - i - 1) * space;
      const one = width(0, n);
      if (!(one > 0)) return false;
      let fs = (100 * W * fill) / one;
      split = 0;
      if (fs < o.min * H) {
        let best = 1, bw = Infinity;
        for (let k = 1; k < n; k++) { const m = Math.max(width(0, k), width(k, n)); if (m < bw) { bw = m; best = k; } }
        split = best;
        fs = (100 * W * fill) / bw;
      }
      const rows = split ? 2 : 1;
      fs = Math.min(fs, o.max * H / (rows > 1 ? 1.3 : 1));
      line.style.fontSize = fs.toFixed(2) + 'px';
      setRows(split);
      const changed = Math.abs(fs - geo.fs) > 0.5 || rows !== geo.rows || Math.abs(H - geo.H) > 1 || Math.abs(W - geo.W) > 1;
      geo.fs = fs; geo.rows = rows; geo.H = H; geo.W = W;
      root.classList.toggle('dfs--two', rows === 2);
      return changed;
    };

    // ---- the full stop's ink, from the face itself (drawn at 400px): where the ink starts after
    // the glyph's origin, how wide and how tall it is. The dot is placed by its glyph origin and baseline,
    // the same two points the laid-out full stop is measured by, so it lands on it exactly; the ink box only
    // sizes the dot's own box and its gap to the word before it.
    const ink = { lsb: 0.07, w: 0.13, asc: 0.13, desc: 0.01 };
    // (drawn and scanned, not measureText: its ink box comes in steps of 1/64 em, 15px at the dot's size)
    const readInk = () => {
      try {
        const cs = getComputedStyle(glyph);
        const S = 400, cv = document.createElement('canvas');
        cv.width = S; cv.height = S;
        const c = cv.getContext('2d', { willReadFrequently: true });
        const ox = S * 0.3, oy = S * 0.7;
        c.font = `${cs.fontStyle} ${cs.fontWeight} ${S}px ${cs.fontFamily}`;
        c.textBaseline = 'alphabetic';
        c.fillText('.', ox, oy);
        const d = c.getImageData(0, 0, S, S).data;
        let x0 = S, x1 = -1, y0 = S, y1 = -1;
        for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (d[(y * S + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 < 0) return;
        const lsb = (x0 - ox) / S, w = (x1 + 1 - x0) / S, asc = (oy - y0) / S, desc = Math.max(0, (y1 + 1 - oy) / S);
        if (w > 0.03 && w < 0.6 && lsb > -0.2 && lsb < 0.4 && asc > 0.03 && asc < 0.6 && desc < 0.1) Object.assign(ink, { lsb, w, asc, desc });
      } catch {}
    };

    // ---- the layout of every state, measured from the laid-out sentence (transforms do not change offsets)
    let G = null;
    const off = (el) => { let x = 0, y = 0; for (let e = el; e && e !== stage; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x, y }; };
    const measure = () => {
      const W = stage.clientWidth || innerWidth, H = stage.clientHeight || innerHeight;
      if (!(W > 0) || !(H > 0)) return;
      const F = parseFloat(getComputedStyle(line).fontSize) || geo.fs;
      readInk();
      const rows = [...line.querySelectorAll(':scope > .dfs-row')];
      const rowOf = words.map((w) => rows.indexOf(w.parentElement));
      const R = rows.length - 1;
      const base = rows.map((r) => off(r.querySelector(':scope > .dfs-base')).y);
      const lp = off(line);
      const cx = lp.x + line.clientWidth / 2;
      const cw = line.clientWidth;
      const sp = off(stop);
      const L = words.map((w) => off(w).x);
      const right = words.map((w, j) => (j === n - 1 ? sp.x : L[j] + w.offsetWidth));
      // the dot: big while it falls and rides, sized to the stage, set as a font size (never scaled up); its
      // box is the glyph's ink and a hair of room for the anti-aliased edge, in glyph units (origin 0, baseline 0)
      const D = Math.min(o.dot * H, W / 3);
      const Fbig = Math.max(F * 1.5, D / ink.w);
      const m = Math.max(2, 0.005 * Fbig);
      const box = { x: ink.lsb * Fbig - m, y: -ink.asc * Fbig - m, w: ink.w * Fbig + 2 * m, h: (ink.asc + ink.desc) * Fbig + 2 * m };
      dot.setAttribute('viewBox', [box.x, box.y, box.w, box.h].map((v) => v.toFixed(2)).join(' '));
      dot.setAttribute('width', box.w.toFixed(2));
      dot.setAttribute('height', box.h.toFixed(2));
      glyph.setAttribute('font-size', Fbig.toFixed(2));
      const g = 0.16 * F; // between the last word and the riding dot (more than the box's room at any size)
      const rStart = rows.map((_, r) => rowOf.indexOf(r));
      const rEnd = rows.map((_, r) => rowOf.lastIndexOf(r) + 1);
      // the largest the dot may be on row r: on the first row the stage above is empty; on a later row it
      // stays under the descenders of the row above
      const cap = rows.map((_, r) => (r ? clamp((base[r] - base[r - 1] - 0.34 * F) / (ink.asc + ink.desc), F, Fbig) : Fbig));
      // a full stop dips a little under the baseline (about 2% of the em): nothing at text size, but at the
      // dot's size it would hang under the line, so while it is large it sits on the baseline with the
      // overshoot of a round letter (1.5% of its own height); the shrink eases it back to the glyph's place
      const lift = (f) => Math.max(0, (ink.desc - 0.015 * (ink.asc + ink.desc)) * f);
      // the dot's size in each state: the dropped size alone, then a step smaller with every word, by the
      // same ratio each time, so it is the full stop's own size exactly when the last word lands (never a
      // large ball beside the finished line, never a collapse in one step)
      const size = (s) => (s >= n ? F : F * Math.pow(Fbig / F, (n - s) / n));
      // state s: the first s words are on screen, and the dot rides the row of the last of them (the first
      // row before any): after that word, the row centred with the dot as its last mark; rows above are
      // whole and centred as they are set. The last state is the laid-out sentence itself, the dot on its
      // full stop.
      const xs = [], dots = [];
      for (let s = 0; s < n; s++) {
        const x = new Array(n).fill(0);
        const a = s ? rowOf[s - 1] : 0;
        let d = null;
        for (let r = 0; r <= R; r++) {
          const v = clamp(s - rStart[r], 0, rEnd[r] - rStart[r]);
          if (r !== a) {
            if (!v) continue;
            const sh = cx - (L[rStart[r]] + right[rStart[r] + v - 1]) / 2;
            for (let j = rStart[r]; j < rStart[r] + v; j++) x[j] = sh;
          } else if (!v) {
            d = { ox: cx - (ink.w * Fbig) / 2 - ink.lsb * Fbig, base: base[r] - lift(Fbig), f: Fbig };
          } else {
            const Rv = right[rStart[r] + v - 1];
            const f = clamp(Math.min(size(s), (cw - (Rv - L[rStart[r]]) - g) / ink.w, cap[r]), F, Fbig);
            const sh = cx - (L[rStart[r]] + Rv + g + ink.w * f) / 2;
            for (let j = rStart[r]; j < rStart[r] + v; j++) x[j] = sh;
            d = { ox: Rv + sh + g - ink.lsb * f, base: base[r] - lift(f), f };
          }
        }
        xs.push(x);
        dots.push(d);
      }
      const land = { ox: sp.x, base: base[R], f: F };
      xs.push(new Array(n).fill(0));
      dots.push(land);
      // the first word of a later row comes in while the dot takes the carriage return down to it
      const ret = words.map((_, j) => rowOf[j] > 0 && j === rStart[rowOf[j]]);
      const top = Math.max(8, 0.04 * H);
      G = {
        H, W, F, Fbig, box, xs, dots, ret, land, rise: o.rise * F,
        drop: { ox: dots[0].ox, base: top + ink.asc * Fbig, f: Fbig },
        supRise: 0.6 * parseFloat(getComputedStyle(support || line).fontSize),
      };
    };

    // ---- the beats of the hold (the drop and the first word come with the stage's arrival): the second
    // word to the last, the cut and the supporting line, each inside its own tenth, spread evenly so the
    // last lands in the last tenth and no two still tenths follow each other
    const plan = () => {
      const beats = [];
      for (let i = 1; i < n; i++) beats.push({ k: 'word', i });
      if (o.beat) beats.push({ k: 'cut' });
      if (support) beats.push({ k: 'support' });
      const B = beats.length, slots = Math.max(10, B), w = 1 / slots;
      const at = { words: [] };
      beats.forEach((b, i) => {
        const s = B > 1 ? Math.round((i * (slots - 1)) / (B - 1)) : slots - 1;
        const a = s * w + 0.15 * w, z = s * w + 0.85 * w;
        if (b.k === 'word') at.words[b.i] = [a, z];
        else at[b.k] = b.k === 'cut' ? s * w + 0.5 * w : [a, z];
      });
      return at;
    };
    const T = plan();
    const ARRIVE = 'top 18%'; // the arrival runs while the stage's top climbs the last 18% of the screen
    // locked to the scroll when Lenis already smooths it, and on touch screens
    const scrubOf = () => o.scrub ?? (Stage.lenis || Stage.touch ? true : 0.5);

    // ---- one frame of the scene: the arrival's progress A.a (0-1) and the hold's S.t (0-1), everything
    // from G and T, written straight to style
    const S = { t: 0 }, A = { a: 0 };
    // (a moved element keeps its transform written, translate(0px, 0px) at rest, as a tween would leave it;
    // a word not yet out is transparent, so the heading still holds the whole claim for anything reading it)
    const set = (el, x, y, a, hide = false) => {
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      el.style.opacity = String(clamp(a, 0, 1).toFixed(3));
      el.style.visibility = hide && !(a > 0) ? 'hidden' : '';
    };
    // the dot's glyph origin on (ox, base) at font size f: its box's corner is box.x, box.y from the origin
    const place = (d) => {
      const s = d.f / G.Fbig;
      dot.style.transform = `translate(${(d.ox + G.box.x * s).toFixed(2)}px, ${(d.base + G.box.y * s).toFixed(2)}px) scale(${s.toFixed(5)})`;
    };
    const mix = (a, b, e) => ({ ox: lerp(a.ox, b.ox, e), base: lerp(a.base, b.base, e), f: lerp(a.f, b.f, e) });
    const u = (w, t) => clamp((t - w[0]) / (w[1] - w[0]), 0, 1);
    const ink2 = (on) => {
      root.classList.toggle('dfs--ink', on);
      if (navEl) navEl.classList.toggle(o.navClass, on);
    };
    function render() {
      const t = S.t, a0 = A.a;
      if (!G || !isLive()) return;
      // where the scene is: the words fully out, and the word on its way (with its progress p)
      let d = null, done = 0, act = -1, p = 0;
      if (t <= 0) {
        // the arrival: the dot drops from the stage's top edge as the stage settles (power2.in: it falls),
        // then the first word comes out of it, so the stage is never held on a lone dot
        if (a0 < 0.5) d = mix(G.drop, G.dots[0], in2(clamp(a0 / 0.5, 0, 1)));
        else if (a0 < 0.95) { act = 0; p = (a0 - 0.5) / 0.45; }
        else done = 1;
      } else {
        done = 1;
        T.words.forEach((w, i) => { if (!w) return; if (t >= w[1]) done = i + 1; else if (t > w[0]) { act = i; p = u(w, t); } });
      }
      const landed = done >= n;
      if (act >= 0 && G.ret[act]) {
        // the carriage return: the dot drops to the next row and shrinks under the row above first, then
        // slides back along it to the new word; the row it left closes up behind it, the word rises in place
        const down = out3(clamp(p / 0.45, 0, 1)), along = inOut2(clamp((p - 0.35) / 0.65, 0, 1));
        const after = inOut2(clamp((p - 0.3) / 0.7, 0, 1)), q = clamp((p - 0.3) / 0.7, 0, 1);
        words.forEach((w, j) => {
          if (j < act) set(w, lerp(G.xs[act][j], G.xs[act + 1][j], after), 0, 1);
          else if (j === act) set(w, G.xs[act + 1][j], G.rise * (1 - out3(q)), q > 0 ? Math.min(1, q / 0.33) : 0);
          else set(w, 0, 0, 0);
        });
        const a = G.dots[act], b = G.dots[act + 1];
        d = { ox: lerp(a.ox + ink.lsb * a.f, b.ox + ink.lsb * b.f, along) - ink.lsb * lerp(a.f, b.f, down), base: lerp(a.base, b.base, down), f: lerp(a.f, b.f, down) };
      } else if (act >= 0) {
        // a word: the dot steps right, a step smaller, and the phrase steps left, opening the gap out of
        // the dot's side; the word rises into it whole once the dot has cleared it (never under the dot,
        // never half-drawn). On the last word the dot's step ends on the laid-out full stop.
        const e = out3(clamp(p / 0.55, 0, 1)), q = clamp((p - 0.3) / 0.7, 0, 1);
        words.forEach((w, j) => {
          if (j < act) set(w, lerp(G.xs[act][j], G.xs[act + 1][j], e), 0, 1);
          else if (j === act) set(w, G.xs[act + 1][j], G.rise * (1 - out3(q)), q > 0 ? Math.min(1, q / 0.3) : 0);
          else set(w, 0, 0, 0);
        });
        d = mix(G.dots[act], G.dots[act + 1], e);
      } else {
        words.forEach((w, j) => (j < done ? set(w, G.xs[done][j], 0, 1) : set(w, 0, 0, 0)));
        if (!d) d = G.dots[done];
      }
      // the hand-over: the real full stop takes over the instant the dot lands on it
      stop.style.opacity = landed ? '1' : '0';
      dot.style.opacity = landed ? '0' : '1';
      dot.style.visibility = landed ? 'hidden' : '';
      if (!landed) place(d);
      // the second beat
      ink2(o.beat && t >= T.cut);
      if (support && T.support) {
        const ps = u(T.support, t);
        set(support, 0, t >= T.support[1] ? 0 : G.supRise * (1 - out3(ps)), t <= T.support[0] ? 0 : Math.min(1, ps / 0.4), true);
      }
    }

    const clear = () => {
      for (const w of words) { w.style.transform = ''; w.style.opacity = ''; w.style.visibility = ''; }
      if (support) { support.style.transform = ''; support.style.opacity = ''; support.style.visibility = ''; }
      stop.style.opacity = '';
      stop.style.visibility = '';
      dot.style.transform = '';
      dot.style.opacity = '';
      dot.style.visibility = '';
    };

    function build(tl) {
      root.classList.add('is-live');
      fit();
      measure();
      tl.fromTo(S, { t: 0 }, { t: 1, duration: 1, ease: 'none', onUpdate: render }, 0);
      // the arrival, on its own short stretch of scroll just before the stage holds (made inside the
      // stage's matchMedia, so it is undone with the hold)
      gsap.fromTo(A, { a: 0 }, {
        a: 1, ease: 'none', onUpdate: render,
        scrollTrigger: { trigger: root, start: ARRIVE, end: 'top top', scrub: scrubOf(), invalidateOnRefresh: true },
      });
      render();
    }

    // In the finished composition a fixed header still turns where the ink section begins.
    let navST = null;
    const navRest = (on) => { if (navEl && !isLive()) navEl.classList.toggle(o.navClass, on); };
    if (navEl && o.beat && window.ScrollTrigger && Stage.live) {
      navST = ScrollTrigger.create({
        trigger: root,
        start: () => `top ${Math.round(navEl.getBoundingClientRect().bottom)}px`,
        end: 'bottom top',
        onToggle: (self) => navRest(self.isActive || self.progress >= 1),
      });
    }

    function rest() {
      root.classList.remove('is-live', 'dfs--ink');
      clear();
      fit();
      G = null;
      if (navST) navRest(navST.scroll() >= navST.start);
    }

    // fit and measure before every refresh ScrollTrigger makes, once the fonts are in, and when the
    // width changes; then draw the frame the playhead is on again
    const again = () => { const c = fit(); if (isLive()) { measure(); render(S.t); } return c; };
    if (window.ScrollTrigger && Stage.live) {
      ScrollTrigger.addEventListener('refreshInit', () => { fit(); });
      ScrollTrigger.addEventListener('refresh', () => { if (isLive()) { measure(); render(S.t); } });
    }
    const refit = () => { if (again() && window.ScrollTrigger && Stage.live && isLive()) ScrollTrigger.refresh(); };
    if (document.fonts) {
      if (document.fonts.ready) document.fonts.ready.then(refit).catch(() => {});
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', refit);
    }
    if (window.ResizeObserver) {
      let raf = 0, lastW = 0, lastH = 0;
      new ResizeObserver(() => {
        const w = stage.clientWidth, h = isLive() ? stage.clientHeight : lastH;
        if (w === lastW && h === lastH) return;
        lastW = w; lastH = h;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(refit);
      }).observe(stage);
    }
    fit();

    const short = window.matchMedia('(max-height: 479px)');
    const start = () => Stage.scene(root, {
      hold: o.hold,
      scrub: scrubOf(),
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

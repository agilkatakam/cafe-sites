// tasteskill / scenes / letter-bar-floods-the-ground.js — one straight letter's bar floods the screen and
// becomes the next section's ground.
//
// A short statement of two to four words stands on one line in the page's display face, at display size,
// with one straight-stemmed letter (I, l, i, 1 or the stem of a T) on the dead centre of the screen. From the
// first frame of the scroll the camera zooms on that letter: the whole line scales up round its stem, the
// letter in its own proportions (a stem with the face's own ends) and the words on either side growing too,
// more slowly, as they are carried out past the screen's edges. The letter reads as a letter until it is
// wider than a third of the screen and taller than it; from there only its stem is on screen, a flat column
// of ink, and the next section's ground, clipped exactly to the stem's edges, carries on as that column. The
// next section's opening statement arrives inside the column once the column holds it (from about half-way
// on desktop), while the edges of the outgoing words are still in frame; the column reaches full bleed by
// 80%, and the statement keeps growing gently to its resting size as the camera lands on it. No frame rests
// on a dark panel between paper bands or on plain colour, and the stage lets go onto the next section on the
// same ground with no seam.
//
// The letter is never measured once: the stem's ink edges are read from the glyph itself (drawn on a canvas
// in the line's own face, weight and size) after the fonts have loaded, and again on every resize and every
// ScrollTrigger refresh, so a late webfont or a turned phone keeps the stem on the centre line.
//
// Needs gsap + ScrollTrigger (no SplitText), stage.js and letter-bar-floods-the-ground.css.
//
// DOM (the CSS draws the finished composition from the same markup):
//   <section class="scene" data-scene="letter-bar-floods-the-ground" data-options='{"pivot": 9}'
//            aria-labelledby="lbf-line">
//     <div class="scene-stage">
//       <h2 class="lbf-line" id="lbf-line">You ask, I answer</h2>
//                         2-4 words, one line, about 12-22 characters, the pivot letter near the middle.
//                         Mark the pivot either with the pivot option (its index in the line, spaces
//                         counted) or in the markup: You ask, <span class="lbf-pivot">I</span> answer.
//                         With neither, the straight letter nearest the middle is taken.
//       <div class="lbf-ground">                 the next section's ground, in the ink
//         <div class="lbf-next">
//           <h2 id="…">Written answers within two days</h2>   its opening statement, 4-8 words, two
//                                               lines at most at every width, in the ground's colour
//           <p>One sentence under it (optional, 12-24 words).</p>
//         </div>
//       </div>
//     </div>
//   </section>
//   <section style="background: var(--ink); color: var(--ground)">…</section>   the next section, on the
//                                               ink, with little top padding: it continues the statement
//
// The section before sits on --ground and the section after on --ink. One ink: the statement, its pivot
// letter and the flood are all --ink; the next statement is set in --ground. No accent, no second colour on
// any word. The h2 keeps the whole line for readers (aria-label); the spans the script makes are aria-hidden.
//
// Options (data-options JSON; defaults, ranges):
//   hold        1.1    1-1.5     screens the stage is held for on desktop and tablet
//   phoneHold   1      0.8-1.2   screens on a phone
//   pivot       auto             the pivot letter: its index in the statement (0-based, spaces counted) or
//                                the letter itself ("I"); a span.lbf-pivot in the markup wins. It must be
//                                I, l, i, 1, T, ı or |: never a round letter or one with a counter (O, S, A),
//                                which leaves the section on its finished composition
//   third       0.3    0.2-0.4   share of the hold by which the stem is a third of the screen's width
//   half        0.5    0.4-0.6   share by which it is half the width (the next statement arrives about here)
//   flood       0.8    0.6-0.8   share by which the column fills the screen (full bleed)
//   grow        0.5    0.3-0.8   how fast the words grow against the letter (their scale is the letter's to
//                                this power: the camera is aimed at the letter, so the words grow more slowly
//                                and keep an edge in frame until about half-way)
//   nav         ""               selector of a fixed header over the scene: it gets navClass while the ink
//   navClass    "is-flooded"     covers its whole width (style that class: ground and ink swapped)
//   scrub       0.5 | true       seconds of catch-up; true (locked) when Lenis smooths the page and on touch
//   phone       "same"           "same" | "rest" (the phone gets the finished composition)
//   Screens under 480px tall always get the finished composition.
//
// Timeline (fractions of the hold; the same marks on every width, the sizes measured from the layout):
//   0        the statement at display size, the stem on the centre line
//   0-0.3    the camera zooms: the letter grows round its stem, the words grow and leave past the edges
//   0.3      the stem is a third of the width (on desktop it is taller than the screen from about 0.2, and
//            the letter hands over to the column at 0.3; on a phone it stays a letter, its ends in view, until
//            it is taller than the screen, at about 0.55)
//   0.3-0.5  the column widens; the outgoing words' inner edges are still in frame at both sides
//   ~0.5     the column holds the next statement: it arrives inside it (whole blocks, in reading order) at 82%
//            of its size
//   0.8      full bleed; the next statement grows on to its resting size by 0.96
//   0.96-1   the new ground with its statement at rest; then the stage lets go onto the next section
// The bar's width runs on one monotone cubic spline in log width through the marks, so the zoom's speed
// never stops or reverses.
//
// The phone: a portrait screen needs the letter about 30 times larger before its stem is as tall as the
// screen, so it reads as a letter, ends and all, for longer (until about 0.55); the line spans nearly the
// whole width at the start (a 12px gutter); the hold is 1 screen. The parts the camera scales are never
// promoted to their own layers, so they are repainted sharp at every scale rather than stretched. (A 4-word
// statement across a phone is under 6% of its screen; the inspector's lone-heading check can name it on a
// phone screen caught at the very start of the hold.)
//
// scenes.mjs warns empty-steps on every width, at about 0-20% and 70-100% of the hold (on a phone also
// through the middle): the line alone on the ground at the start, the stem as one column of ink, and the
// next statement alone on the ink at the end. The flat ground is the scene: the letter grows out of it and
// the ink becomes the next ground. Read the sheet: if every frame shows the line, the letter's stem or the
// next statement whole, the warning is defended; never add a picture or a second colour to quiet it.
// From 0.8 the column is full bleed and the next statement grows its last few percent to its resting size:
// the camera landing, about a fifth of a screen, not a held frame.
//
// Colours: --ground (the page's ground and the next statement's type) and --ink (the statement, the bar and
// the next section's ground) from the page, 7:1 or better both ways. No accent. The scene's tokens are in
// letter-bar-floods-the-ground.css.
(() => {
  const ID = 'letter-bar-floods-the-ground';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, d, a, b) => { const n = typeof v === 'string' && v.trim() !== '' ? +v : v; return typeof n === 'number' && isFinite(n) ? clamp(n, a, b) : d; };
  // straight-stemmed letters only: a bar with no bowl, no counter and no diagonal
  const STRAIGHT = 'Il1Tiı|ǀ';
  const PREFERRED = 'Il1|ǀ';   // plain bars first; T and i carry a crossbar or a dot

  // ---- the stem of a glyph, read from its ink: drawn once on a canvas in the line's own face and weight
  // at 400px, the stem found on a row low in the letter, its edges refined to a sub-pixel from the
  // anti-aliasing, and its height walked up and down the stem while the row keeps the same edges.
  // Everything is returned in em, relative to the pen position and the baseline (y up is negative).
  const scans = new Map();
  function scanGlyph(ch, cs) {
    const key = [ch, cs.fontFamily, cs.fontWeight, cs.fontStyle, cs.fontStretch].join('|');
    if (scans.has(key)) return scans.get(key);
    const size = 400;
    const c = document.createElement('canvas');
    const x = c.getContext('2d', { willReadFrequently: true });
    if (!x) return null;
    const font = `${cs.fontStyle || 'normal'} ${cs.fontWeight || 400} ${size}px ${cs.fontFamily}`;
    x.font = font;
    const m = x.measureText(ch);
    const pad = Math.ceil(size * 0.2);
    const left = Math.ceil(Math.max(0, m.actualBoundingBoxLeft || 0));
    const right = Math.ceil(Math.max(m.width || size, m.actualBoundingBoxRight || 0));
    c.width = left + right + pad * 2;
    c.height = Math.ceil(size * 1.7);
    const bx = pad + left, by = Math.ceil(size * 1.25);
    x.font = font;
    x.fillStyle = '#000';
    x.textBaseline = 'alphabetic';
    x.fillText(ch, bx, by);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    const Wc = c.width, Hc = c.height;
    const A = (px, py) => (px < 0 || py < 0 || px >= Wc || py >= Hc ? 0 : d[(py * Wc + px) * 4 + 3]);
    let x0 = Wc, x1 = -1, y0 = Hc, y1 = -1;
    for (let py = 0; py < Hc; py++) for (let px = 0; px < Wc; px++) if (A(px, py) > 24) { if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; }
    if (x1 < 0) return null;
    // the row: a fifth of the ink height above its foot (the stem of an i or a T, never its dot or bar)
    const ys = Math.round(y1 - (y1 - y0) * 0.2);
    const runs = [];
    for (let px = x0, s = -1; px <= x1 + 1; px++) {
      const on = A(px, ys) >= 128;
      if (on && s < 0) s = px;
      if (!on && s >= 0) { runs.push({ s, e: px - 1 }); s = -1; }
    }
    if (!runs.length) return null;
    const mid = (x0 + x1) / 2;
    const run = runs.reduce((b, r) => (Math.abs((r.s + r.e) / 2 - mid) < Math.abs((b.s + b.e) / 2 - mid) ? r : b));
    // sub-pixel edges: the partial coverage of the pixels just outside the solid run
    let L = run.s, R = run.e + 1;
    for (let q = run.s - 1; q >= run.s - 3 && A(q, ys) > 0; q--) L -= A(q, ys) / 255;
    for (let q = run.e + 1; q <= run.e + 3 && A(q, ys) > 0; q++) R += A(q, ys) / 255;
    // the pure stem: the rows whose solid run round the stem's centre has the same edges as this one
    const xc = Math.round((run.s + run.e) / 2), tol = Math.max(1.5, size * 0.004);
    const same = (py) => {
      if (A(xc, py) < 128) return false;
      let a = xc, b = xc;
      while (a > 0 && A(a - 1, py) >= 128) a--;
      while (b < Wc - 1 && A(b + 1, py) >= 128) b++;
      return Math.abs(a - run.s) <= tol && Math.abs(b - run.e) <= tol;
    };
    let top = ys, bot = ys;
    while (top > 0 && same(top - 1)) top--;
    while (bot < Hc - 1 && same(bot + 1)) bot++;
    const T = top - A(xc, top - 1) / 255, B = bot + 1 + A(xc, bot + 1) / 255;
    // a plain bar: all of the glyph's ink lies inside its stem
    const rect = x0 >= run.s - tol - 1 && x1 <= run.e + tol + 1 && y0 >= top - tol - 1 && y1 <= bot + tol + 1;
    const out = { L: (L - bx) / size, R: (R - bx) / size, T: (T - by) / size, B: (B - by) / size, rect };
    // kept only once the face is really in (a fallback's stem is measured again when the font arrives)
    let loaded = true;
    try { loaded = !document.fonts || document.fonts.check(font, ch); } catch {}
    if (loaded) scans.set(key, out);
    return out;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = (root, opts = {}) => {
    const o = {
      hold: num(opts.hold, 1.1, 1, 1.5),
      phoneHold: num(opts.phoneHold, 1, 0.8, 1.2),
      third: num(opts.third, 0.3, 0.2, 0.4),
      half: num(opts.half, 0.5, 0.4, 0.6),
      flood: num(opts.flood, 0.8, 0.6, 0.8),
      grow: num(opts.grow, 0.5, 0.3, 0.8),
      nav: typeof opts.nav === 'string' ? opts.nav.trim() : '',
      navClass: typeof opts.navClass === 'string' && opts.navClass.trim() ? opts.navClass.trim() : 'is-flooded',
      scrub: opts.scrub === true ? true : typeof opts.scrub === 'number' ? clamp(opts.scrub, 0, 2) : null,
      phone: opts.phone === 'rest' ? 'rest' : 'same',
    };
    // the three marks in order, with room between them
    o.half = Math.max(o.half, o.third + 0.1);
    o.flood = Math.max(o.flood, o.half + 0.1);
    const $ = (s) => root.querySelector(s);
    const stage = root.querySelector(':scope > .scene-stage') || root.firstElementChild;
    const line = $('.lbf-line');
    const ground = $('.lbf-ground');
    const next = $('.lbf-next') || ground;
    const navEl = o.nav ? document.querySelector(o.nav) : null;
    const giveUp = (why) => { console.warn(`${ID}: ${why}; the section shows its finished composition`); return Stage.scene(root, { build: null }); };
    if (!stage || !line || !ground) return giveUp('needs .scene-stage, an h2.lbf-line and a .lbf-ground');

    // ---- the statement: before | pivot | after, each an inline-block span; the spaces stay as text
    let before = null, pivot = null, after = null, pivotChar = '';
    if (!line.dataset.lbfSplit) {
      const marked = line.querySelector('.lbf-pivot');
      const text = line.textContent.replace(/\s+/g, ' ').trim();
      let i = -1;
      if (marked) {
        const pre = document.createRange();
        pre.setStart(line, 0);
        pre.setEndBefore(marked);
        i = pre.toString().replace(/\s+/g, ' ').replace(/^\s+/, '').length;
      } else if (typeof opts.pivot === 'number' && isFinite(opts.pivot)) i = Math.round(opts.pivot);
      else {
        const want = typeof opts.pivot === 'string' && opts.pivot.length === 1 ? [opts.pivot] : [PREFERRED, STRAIGHT];
        const middle = (text.length - 1) / 2;
        for (const set of want) {
          let best = -1;
          for (let k = 0; k < text.length; k++) if (set.includes(text[k]) && (best < 0 || Math.abs(k - middle) < Math.abs(best - middle))) best = k;
          if (best >= 0) { i = best; break; }
        }
      }
      if (i < 0 || i >= text.length || /\s/.test(text[i])) return giveUp('no pivot letter found (give the pivot option or a span.lbf-pivot)');
      pivotChar = text[i];
      if (!STRAIGHT.includes(pivotChar)) return giveUp(`the pivot "${pivotChar}" is not a straight-stemmed letter (I, l, i, 1, T)`);
      const words = text.split(' ').length;
      if (words > 4) console.warn(`${ID}: ${words} words; the statement holds 2-4 on one line`);
      line.setAttribute('aria-label', text);
      const set = document.createElement('span');
      set.className = 'lbf-set';
      set.setAttribute('aria-hidden', 'true');
      const part = (cls, s) => { const el = document.createElement('span'); el.className = 'lbf-part ' + cls; el.textContent = s; return el; };
      const pre = text.slice(0, i), post = text.slice(i + 1);
      if (pre.trim()) { set.appendChild(before = part('lbf-before', pre.replace(/\s+$/, ''))); if (/\s$/.test(pre)) set.appendChild(document.createTextNode(' ')); }
      set.appendChild(pivot = part('lbf-pivot', pivotChar));
      if (post.trim()) { if (/^\s/.test(post)) set.appendChild(document.createTextNode(' ')); set.appendChild(after = part('lbf-after', post.replace(/^\s+/, ''))); }
      line.textContent = '';
      line.appendChild(set);
      line.dataset.lbfSplit = '1';
    } else {
      before = line.querySelector('.lbf-before'); pivot = line.querySelector('.lbf-pivot'); after = line.querySelector('.lbf-after');
      pivotChar = pivot ? pivot.textContent : '';
    }
    if (!pivot) return giveUp('the statement has no pivot letter');
    const sides = [before, after].filter(Boolean);

    // ---- the next statement: every word in a span, so each can show whole once the column holds it
    if (!next.dataset.lbfSplit) {
      const tw = document.createTreeWalker(next, NodeFilter.SHOW_TEXT);
      const nodes = [];
      for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.nodeValue.trim()) nodes.push(n);
      for (const n of nodes) {
        const frag = document.createDocumentFragment();
        for (const p of n.nodeValue.split(/(\s+)/)) {
          if (!p) continue;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else { const s = document.createElement('span'); s.className = 'lbf-w'; s.textContent = p; frag.appendChild(s); }
        }
        n.parentNode.replaceChild(frag, n);
      }
      next.dataset.lbfSplit = '1';
    }
    const nextWords = [...next.querySelectorAll('.lbf-w')];
    if (!nextWords.length) console.warn(`${ID}: the .lbf-ground holds no words; the flood would end on plain colour`);

    const isLive = () => root.classList.contains('is-live');
    const px = (name, d) => {
      const p = document.createElement('div');
      p.style.cssText = `position:absolute;visibility:hidden;width:var(${name});height:0`;
      (stage || root).appendChild(p);
      const v = p.offsetWidth;
      p.remove();
      return v || d;
    };

    // ---- fit: one line, at the page's display size (the CSS size), smaller only where it would not fit
    const fit = () => {
      line.style.fontSize = '';
      line.classList.add('lbf--one');
      const cs = getComputedStyle(line);
      const fs0 = parseFloat(cs.fontSize);
      const set = line.querySelector('.lbf-set') || line;
      const width = set.getBoundingClientRect().width;
      const avail = isLive()
        ? (stage.clientWidth || innerWidth) - 2 * px('--lbf-gutter', 20)
        : line.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!(width > 0) || !(avail > 0) || !(fs0 > 0)) return;
      if (width > avail) line.style.fontSize = ((fs0 * avail * 0.995) / width).toFixed(2) + 'px';
    };

    // ---- the geometry of the hold, measured from the layout at rest
    let G = null;
    const state = { p: 0 };
    const clearInline = () => {
      for (const el of [pivot, ...sides]) { el.style.transform = ''; el.style.opacity = ''; el.style.visibility = ''; el.style.transformOrigin = ''; }
      line.style.left = ''; line.style.top = '';
      next.style.transform = ''; next.style.transformOrigin = '';
      ground.style.clipPath = ''; ground.style.visibility = '';
      root.classList.remove('lbf--flooded');
      for (const w of nextWords) w.classList.remove('is-in');
    };

    function measure(again) {
      if (!isLive()) return;
      clearInline();
      line.style.left = '0px';
      line.style.top = '0px';
      if (!again) fit();
      const W = stage.clientWidth || innerWidth, H = stage.clientHeight || innerHeight;
      const sr = stage.getBoundingClientRect();
      const rel = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - sr.left, r: r.right - sr.left, t: r.top - sr.top, b: r.bottom - sr.top, w: r.width, h: r.height }; };
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      pivot.appendChild(probe);
      const base = rel(probe).t;
      probe.remove();
      const cs = getComputedStyle(pivot);
      const fs = parseFloat(cs.fontSize);
      const g = scanGlyph(pivotChar, cs);
      if (!g || !(fs > 0) || !(W > 0) || !(H > 0)) { G = null; return; }
      // every box read at the line's resting place first (left 0, top 0), then shifted with it
      const P0 = rel(pivot), B0 = before ? rel(before) : null, A0 = after ? rel(after) : null, L0 = rel(line);
      const sL = P0.l + g.L * fs, sR = P0.l + g.R * fs, sT = base + g.T * fs, sB = base + g.B * fs;
      // with the stem on the centre line the longer half of the line decides the size: both halves start
      // inside the gutters (a long half also tells you the pivot is far from the middle of the line)
      const half = Math.max((sL + sR) / 2 - L0.l, L0.r - (sL + sR) / 2), room = W / 2 - px('--lbf-gutter', 20);
      if (!again && half > room && room > 0) {
        line.style.fontSize = (parseFloat(getComputedStyle(line).fontSize) * (room / half) * 0.998).toFixed(2) + 'px';
        return measure(true);
      }
      // put the stem's centre on the centre of the stage (layout, once per measurement)
      const dx = W / 2 - (sL + sR) / 2, dy = H / 2 - (sT + sB) / 2;
      line.style.left = dx.toFixed(2) + 'px';
      line.style.top = dy.toFixed(2) + 'px';
      const shift = (r) => ({ l: r.l + dx, r: r.r + dx, t: r.t + dy, b: r.b + dy, w: r.w, h: r.h });
      const P = shift(P0), Bx = B0 ? shift(B0) : null, Ax = A0 ? shift(A0) : null;
      const cx = W / 2, cy = H / 2;
      pivot.style.transformOrigin = `${(cx - P.l).toFixed(2)}px ${(cy - P.t).toFixed(2)}px`;
      if (before) before.style.transformOrigin = `${Bx.w.toFixed(2)}px ${(cy - Bx.t).toFixed(2)}px`;
      if (after) after.style.transformOrigin = `0px ${(cy - Ax.t).toFixed(2)}px`;
      const w0 = sR - sL, h0 = sB - sT;
      if (!(w0 > 0.5) || !(h0 > 1)) { G = null; return; }
      // the next statement settles from a little larger as the zoom lands on it (scaled round the centre)
      const N = rel(next);
      next.style.transformOrigin = `${(cx - N.l).toFixed(2)}px ${(cy - N.t).toFixed(2)}px`;
      // its blocks (the heading, then its sentence), each shown whole once the full-height bar holds it
      const blocks = [];
      for (const el of nextWords) {
        const r = rel(el);
        const blk = el.closest('h1, h2, h3, h4, p, li, blockquote') || next;
        let bk = blocks.find((x) => x.blk === blk);
        if (!bk) blocks.push(bk = { blk, l: r.l, r: r.r, els: [], on: false });
        bk.l = Math.min(bk.l, r.l); bk.r = Math.max(bk.r, r.r);
        bk.els.push(el);
      }
      // the width of the bar: one camera move, a monotone cubic spline in log width through three marks:
      // a third of the screen at `third`, half of it at `half`, the whole screen at `flood`
      const T1 = o.third, T2 = o.half, F = o.flood;
      const v = [Math.log(w0), Math.log(Math.max(W / 3 * 1.02, w0 * 2)), 0, Math.log(W + 4)];
      v[2] = Math.log(Math.max(W / 2, Math.exp(v[1]) * 1.15));
      v[3] = Math.max(v[3], v[2] + 0.05);
      const P_ = [0, T1, T2, F];
      const d = [0, 1, 2].map((i) => (v[i + 1] - v[i]) / (P_[i + 1] - P_[i]));
      const m = [0.8 * d[0], (2 * d[0] * d[1]) / (d[0] + d[1]), (2 * d[1] * d[2]) / (d[1] + d[2]), 0.7 * d[2]];
      const knots = P_.map((p, i) => ({ p, v: v[i], m: m[i] }));
      G = { W, H, cx, cy, fs, w0, h0, F, knots, P, Bx, Ax, blocks, grow: o.grow,
        gapB: Bx ? Math.max(P.l - Bx.r, 0.04 * fs) : 0, gapA: Ax ? Math.max(Ax.l - P.r, 0.04 * fs) : 0 };
      // the letter itself grows, in its own proportions, until it is wider than a third of the screen and
      // taller than it; from there its stem is all that is on screen, and the next ground, clipped exactly
      // to the stem's edges, carries on as the bar
      G.ph = F;
      for (let q = 0; q <= F; q += 0.002) { const S = Math.exp(lnW(q)) / w0; if (S * w0 >= W / 3 && S * h0 >= H * 1.02) { G.ph = q; break; } }
      if (Math.exp(lnW(G.ph)) / w0 > 40) console.warn(`${ID}: the "${pivotChar}" is drawn at ${(Math.exp(lnW(G.ph)) / w0).toFixed(0)}x before it hands over; a larger statement keeps it lower`);
      // the next statement's heading arrives once the bar holds it (its sentence as soon as that fits too)
      G.pn = F;
      if (blocks.length) for (let q = G.ph; q <= F; q += 0.002) { if (Math.exp(lnW(q)) >= (2 * Math.max(cx - blocks[0].l, blocks[0].r - cx)) * settle(q, q) + 2 * Math.max(12, 0.015 * W)) { G.pn = q; break; } }
      render(state.p);
    }

    // the next statement is part of the world the camera flies into: it arrives at 82% of its size and grows to
    // its resting size (the size the next section shows it at) by 96% of the hold, so the end keeps moving
    function settle(p, from) { const u = clamp((p - from) / Math.max(0.05, 0.96 - from), 0, 1); return 0.82 + 0.18 * (1 - Math.pow(1 - u, 1.3)); }

    // log of the bar's width at p
    function lnW(p) {
      const K = G.knots;
      if (p <= 0) return K[0].v;
      if (p >= G.F) return K[3].v;
      let i = 0;
      while (i < 2 && p > K[i + 1].p) i++;
      const k0 = K[i], k1 = K[i + 1], h = k1.p - k0.p, u = (p - k0.p) / h, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * k0.v + (u3 - 2 * u2 + u) * h * k0.m + (3 * u2 - 2 * u3) * k1.v + (u3 - u2) * h * k1.m;
    }

    let navOn = null;
    const setNav = (on) => { if (navEl && on !== navOn) { navOn = on; navEl.classList.toggle(o.navClass, on); } };

    function render(p) {
      state.p = p;
      if (!G || !isLive()) return;
      const w = Math.exp(lnW(p));
      const S = w / G.w0;
      const cx = G.cx;
      // the words: the camera zooms on the letter, so they grow too (more slowly than the letter it is
      // aimed at) and are carried out past the screen's edges, each kept clear of the letter's own box
      const Sw = Math.pow(S, G.grow);
      // the clearance: the letter's own box while it is drawn; once the bar has taken over only its stem is on
      // screen, so the box's side bearings stop growing with it and the words stay in frame a little longer
      const Sph = Math.exp(lnW(G.ph)) / G.w0;
      const clear = (side) => (p < G.ph ? S * side : S * (G.w0 / 2) + (side - G.w0 / 2) * Sph * Math.sqrt(S / Sph));
      if (before) {
        const B = G.Bx, inner = cx - clear(G.cx - G.P.l) - G.gapB * Math.pow(Sw, 0.3);
        before.style.transform = `translate(${(inner - B.r).toFixed(2)}px, 0px) scale(${Sw.toFixed(4)})`;
        before.style.visibility = inner > 0 ? '' : 'hidden';
      }
      if (after) {
        const A = G.Ax, inner = cx + clear(G.P.r - G.cx) + G.gapA * Math.pow(Sw, 0.3);
        after.style.transform = `translate(${(inner - A.l).toFixed(2)}px, 0px) scale(${Sw.toFixed(4)})`;
        after.style.visibility = inner < G.W ? '' : 'hidden';
      }
      if (p < G.ph) {
        // the letter itself, scaled round its stem, in its own proportions
        pivot.style.visibility = '';
        pivot.style.transform = `scale(${S.toFixed(4)})`;
        ground.style.visibility = '';
        ground.style.clipPath = '';
        root.classList.remove('lbf--flooded');
        for (const bk of G.blocks) if (bk.on) { bk.on = false; for (const el of bk.els) el.classList.remove('is-in'); }
        setNav(false);
        return;
      }
      // the bar: the next ground, clipped exactly to the stem's edges, widening to the whole screen
      pivot.style.visibility = 'hidden';
      const L = Math.max(0, cx - w / 2), R = Math.max(0, G.W - cx - w / 2);
      const flooded = L + R < 0.5;
      ground.style.visibility = 'visible';
      ground.style.clipPath = flooded ? 'none' : `inset(0px ${R.toFixed(2)}px 0px ${L.toFixed(2)}px)`;
      // once flooded the stage's own ground is the ink too, so no sliver of the old ground shows at a
      // fractional edge where the stage meets the next section
      root.classList.toggle('lbf--flooded', flooded);
      // the next statement: whole blocks, in reading order, each once the bar holds it at its current size
      const s = settle(p, G.pn);
      next.style.transform = s < 0.9995 ? `scale(${s.toFixed(4)})` : '';
      const x0 = L - 0.5, x1 = G.W - R + 0.5;
      let open = true;
      G.blocks.forEach((bk, i) => {
        const l = cx - (cx - bk.l) * s, r = cx + (bk.r - cx) * s;
        const on = open && p >= G.pn && l >= x0 && r <= x1;
        if (!on) open = false;
        if (on !== bk.on) { bk.on = on; for (const el of bk.els) el.classList.toggle('is-in', on); }
      });
      if (navEl) { const r = navEl.getBoundingClientRect(); setNav(L <= Math.max(0, r.left) && G.W - R >= Math.min(G.W, r.right)); }
    }
    function build(tl) {
      state.p = 0;
      measure();
      tl.to(state, { p: 1, duration: 1, ease: 'none', onUpdate: () => render(state.p) }, 0);
      render(0);
    }

    function rest() {
      G = null;
      clearInline();
      fit();
      setNav(false);
    }

    // measure again before every measurement ScrollTrigger makes, once the fonts are in, and on resize
    if (window.ScrollTrigger && Stage.live) ScrollTrigger.addEventListener('refreshInit', () => { if (isLive()) measure(); else fit(); });
    const again = () => {
      if (window.ScrollTrigger && Stage.live && isLive()) ScrollTrigger.refresh();
      else if (isLive()) measure();
      else fit();
    };
    if (document.fonts) {
      const cs = getComputedStyle(line);
      if (document.fonts.load) document.fonts.load(`${cs.fontWeight} 100px ${cs.fontFamily}`, pivotChar).then(again).catch(() => {});
      if (document.fonts.ready) document.fonts.ready.then(again).catch(() => {});
      if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', again);
    }
    if (!Stage.live) { let raf = 0; addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); }); }
    fit();

    const short = window.matchMedia('(max-height: 479px)');
    const start = () => Stage.scene(root, {
      hold: o.hold,
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

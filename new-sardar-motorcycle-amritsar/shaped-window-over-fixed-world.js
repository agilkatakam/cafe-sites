// tasteskill / scenes / shaped-window-over-fixed-world.js — a shape-shifting window over a fixed world.
//
// One full-bleed photograph of a place stays still behind a shutter painted in the page's own ground.
// Two tall windows are cut into the shutter side by side, level, with a narrow bar of ground between
// them: the first frame is one picture seen through a mullion, under the title. Scroll widens the windows
// outward (their inner edges and the bar stay put, so the title and the caption keep their places),
// closes the bar into one window, holds a beat, then scales the shutter past the screen edges so the
// reader pushes through into the place while one chapter word rises in, centre letters first. The lede
// settles last. No window edge ever passes over a word: the title and the caption sit on ground the
// windows never reach, and they fade as the push begins. Before the hold the photo is counter-moved so
// it stays fixed to the viewport while the ground and its windows rise over it; after the hold it sinks
// at 0.8x. (The windows used to start one high and one low; on a first screen that read as two
// mismatched crops of two pictures, r9-p43. They always start level now.) On a page with a fixed or
// sticky bar at the top, the title and the word stay clear of it, and on wide screens the windows are
// laid out in the screen under it.
//
// Needs gsap + ScrollTrigger (SplitText optional: without it the word rises whole), stage.js, and
// shaped-window-over-fixed-world.css. Use it for one strong, wide picture of a place that has to carry
// an opening title and a chapter name, on a page whose ground is a flat colour.
//
// DOM (the CSS file draws the finished composition from the same markup):
//   <section class="scene sw" data-scene="shaped-window-over-fixed-world" data-options='{}' aria-labelledby="sw-title">
//     <div class="scene-stage sw-stage">
//       <div class="sw-world" data-move>                         the place: only counter-moved and scaled
//         <picture>
//           <source media="(max-width: 767px)" srcset="portrait 9:16 crop, 1080-1440 wide" sizes="125vw">
//           <img class="sw-world-media" data-move src srcset sizes="125vw" alt="what the place is" width height>
//         </picture>                                          (or <video class="sw-world-media" muted loop playsinline poster>)
//       </div>
//       <div class="sw-type">                                    type that lives in the world, behind the shutter
//         <div class="sw-scrim sw-scrim--top" aria-hidden="true"></div>      one flat, even dim over the whole
//                                                              world behind the word (no edge, no blur;
//                                                              --sw-scrim-fill tunes it)
//         <div class="sw-scrim sw-scrim--bottom" aria-hidden="true"></div>   kept for older pages, not drawn
//         <p class="sw-word" style="--chars:8">Icefield</p>   one word, 6-12 letters: the chapter's name
//         <div class="sw-lede"><p>18-32 words</p><a class="sw-link" href="#next">2-3 words</a></div>
//                                                              on a solid strip of the page's ground across
//                                                              the stage's foot, in --ink
//       </div>
//       <div class="sw-shutter">                                 the page ground with the windows cut in it
//         <div class="sw-half sw-half--l"></div>
//         <div class="sw-half sw-half--r"></div>
//         <header class="sw-intro"><h2 class="sw-title" id="sw-title">4-7 words, two lines</h2></header>
//                                                              the title is as wide as one window, so keep it
//                                                              to about 25 characters; a longer one is stepped
//                                                              down in size until it sits on two lines in the
//                                                              ground above the windows
//         <p class="sw-caption">10-18 words</p>                (wide screens only, and only where it fits under
//                                                              the windows; repeat its key fact in the lede)
//         <img class="sw-prop sw-prop--l" src alt="" aria-hidden="true">   optional foreground props for the
//         <img class="sw-prop sw-prop--r" src alt="" aria-hidden="true">   bottom corners (see Props below)
//       </div>
//     </div>
//   </section>
// While live the script adds <div class="sw-frame"> with four .sw-bar inside the shutter: from the
// moment the bar closes, they draw the one merged window in place of the halves, so the push is pure
// compositing (a page that styles .sw-half differently is copied onto them).
//
// Props: two things that belong in the place (foliage, a lamp, a chair), standing in front of the
// shutter in the bottom corners and thrown outward during the push. They are the scene's foreground
// plane: without them the first half is one picture on a flat ground. The prop on the caption's side
// (the `high` option) is the tall one (62% of the stage height), the other 46%; both bleed off the
// bottom and outer edges. Neither may reach the title or the caption: when the page's sizes would put
// one over them (a narrower screen, a longer title), the scene slides that prop outward until its
// solid parts clear both by 16px. Either
//   - a transparent cut-out (WebP or PNG with alpha, about 1000px tall), used as it is, or
//   - a photograph of something dark against a bright, plain sky (a fir against fog), keyed into a
//     cut-out by the script: add data-key="lo hi" (luminance 0-1: at or below lo a pixel is kept, at or
//     above hi it is clear; default "0.2 0.45"), optionally data-crop="left top right bottom" (fractions
//     of the photo; every edge that shows on screen must lie on open sky, or it shows as a straight
//     cut), data-flip (mirror it) and data-tone (a CSS filter baked in once, such as
//     "saturate(.45) brightness(.75)", so a prop shot in warm light sits in a cold picture). The photo
//     must be served with CORS (picsum.photos is; add crossorigin="anonymous"); if it is not, the prop
//     is left out. Two props cut from one photograph read as twins: crop them differently (one whole,
//     one nearer and cut by the screen edge).
// Props are live-only: the finished composition hides them.
//
// Two geometries: "wide" (the default) and "narrow" (any width under 768px, or any screen narrower than
// 1.1:1, such as a portrait tablet). Wide: the title stands over one window, in the ground above the
// band the windows fill, and the caption under the other, below it; the windows only widen outward.
// Narrow screens get the phone numbers: two slim windows spanning 85%
// of the width, the title full width on the ground above both, no caption, and the word fitted to 86%
// of the width. On both the title is stepped down until it fits its ground (two lines at most, 16px clear
// of the stage's top).
//
// Timeline (fractions of the hold), the same at every width. Scrubbed: the windows widen outward
// (0.04-0.30) and the one window grows while ground still frames it on every side, 5% of the screen at
// least (0.48-0.66; on a narrow screen, whose window already reaches the gutter, at the top and the
// foot). On clocks, each played when the scroll passes its point and played back when it
// returns, so no stop catches a half state: the bar closes (0.32, 0.35s; no light seam between the
// windows), the title and caption fade (0.44, 0.3s), the rest of the push carries the window past the
// screen's edges (0.66, 0.55s; no slivers of ground at the edge), the word's letters land centre first
// (0.6s, once the growing window has cleared the whole word, so it is never "EFIE" and never cut by the
// shutter's edge) with the flat dim behind it, and the lede's strip settles (0.8, 0.45s).
//
// Options (data-options JSON; defaults, ranges):
//   hold          2.4    1.8-3     screens the stage is held on wide screens
//   phoneHold     2.0    1.6-2.6   screens on narrow screens (phones, portrait tablets). The hold is
//                                  chosen when the page loads: a tablet turned across the 1.1:1 line
//                                  later keeps its first hold (the geometry still switches)
//   open          0.38   0-0.5     how far each window widens outward before the bar closes, as a share
//                                  of its width in the first frame (never closer than 2% of the width or
//                                  16px to the screen's edge; 0 keeps the first frame's width)
//   phoneOpen     0.22   0-0.4     the same on narrow screens (little room there: about 13px a side)
//   (stagger and phoneStagger belonged to the offset start and are ignored: the scene only opens a page,
//   where two offset windows read as two crops of two pictures.)
//   bar           "auto" 8-24      px of ground between the windows (auto: 1.1% of the width, 10-20px; 10 when narrow)
//   high          "right"          "right" | "left": the title sits above the other window and the caption
//                                  under this one, so pick the side that suits the picture's calm areas.
//   overscan      1.08   1.04-1.15  how far past the screen edges the push carries the shutter
//   phoneOverscan 1.16   1.04-1.2   the same on narrow screens (the top edge binds there, so it needs more
//                                  to have left the screen by 75%)
//   worldScale    0.8    0.75-1    the world's start scale (its box is 1/worldScale of the stage, so it
//                                  always covers); it grows to 1 during the push. 1 = a flat push.
//   wordTop       80     px        cap-top of the word (phone: phoneWordTop 72); never less than 16px under
//                                  a fixed or sticky bar at the top of the screen
//   wordWidth     0.92   0.6-0.96  share of the width the word is fitted to (phone: phoneWordWidth 0.86);
//                                  its cap height is held to 30% of the stage height (14% on a phone)
//   parallax      0.2    0-0.3     how far the world sinks while the stage leaves (0.2 = it leaves at 0.8x)
//   scrub         0.6 | true       seconds of catch-up; true (locked) is used when Lenis is smoothing
//   phone         "same"           "same" | "rest" (the phone gets the finished composition)
//
// Colours: the shutter halves are var(--ground), the title and caption var(--ink). The word and the
// lede on the photo take the lighter of the two (set --sw-light on the section to choose another).
// --sw-focus on the section moves the photo's focal point (object-position, default 50% 50%).
//
// Pictures: one landscape place photograph, 3:2 or 16:10, about 3600px wide (the world is shown in a
// 125% box), with a calm top third for the word and nothing important on the vertical centre line
// (the bar stands on it in the first frame); a 9:16 crop for phones. The first frame shows about its
// middle half: put the place's subject there, not at the edges.
(() => {
  const ID = 'shaped-window-over-fixed-world';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = (v, d, a, b) => { const n = typeof v === 'string' && v.trim() !== '' ? +v : v; return typeof n === 'number' && isFinite(n) ? clamp(n, a, b) : d; };
  const px = (n) => Math.round(n * 100) / 100 + 'px';
  const EDGE = 4; // px the shutter halves overhang the stage on every side (matches .sw-half in the CSS)
  // the narrow geometry; the CSS uses the same query for the title, the caption and the scrims
  const NARROW = '(max-width: 767px), (max-aspect-ratio: 11/10)';
  // px the title keeps clear of the stage's top, and the caption of its foot
  const MARGIN = 16;
  // the bar closes over the whole merge, and the merge runs on a clock of 0.35s once the windows have
  // widened (0.32 of the hold), so no stop of the scroll catches the bar thinned to a light seam between them
  const BAR_CLOSE = 1;

  // Key a photograph of something dark against a bright plain sky into a cut-out (see Props above):
  // alpha from luminance between lo and hi, the edge colour un-mixed from the sky so no light fringe
  // shows over the photo, cropped and mirrored as asked. Once per image; the result is a PNG blob URL.
  // A coarse map of where a cut-out is solid (40 cells across), so the scene can keep it off the type.
  const maskOf = (a, w, h) => {
    const gw = 40, gh = clamp(Math.round((40 * h) / w), 1, 160), n = new Uint32Array(gw * gh);
    for (let y = 0; y < h; y++) {
      const row = ((y * gh) / h | 0) * gw;
      for (let x = 0; x < w; x++) if (a[(y * w + x) * 4 + 3] > 128) n[row + ((x * gw) / w | 0)]++;
    }
    const per = (w / gw) * (h / gh), cells = new Uint8Array(gw * gh);
    for (let k = 0; k < cells.length; k++) cells[k] = n[k] > per * 0.03 ? 1 : 0;
    return { gw, gh, cells };
  };
  const nums = (s, d) => { const a = String(s ?? '').trim().split(/[\s,]+/).map(Number); return a.length === d.length && a.every((v) => isFinite(v)) ? a : d; };
  const keyProp = (img) => {
    if (img.dataset.keyed) return;
    img.dataset.keyed = 'pending';
    const [lo, hi] = nums(img.dataset.key, [0.2, 0.45]).map((v) => clamp(v, 0, 1));
    const [c0, c1, c2, c3] = nums(img.dataset.crop, [0, 0, 1, 1]).map((v) => clamp(v, 0, 1));
    const flip = img.hasAttribute('data-flip');
    const url = img.currentSrc || img.src;
    const L = (a, i) => (0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2]) / 255;
    fetch(url, { mode: 'cors' })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(r.status))))
      .then((b) => createImageBitmap(b))
      .then((bmp) => {
        const sx = c0 * bmp.width, sy = c1 * bmp.height;
        const sw = Math.max(1, (c2 - c0) * bmp.width), sh = Math.max(1, (c3 - c1) * bmp.height);
        const k = Math.min(1, 1400 / Math.max(sw, sh));
        const w = Math.round(sw * k), h = Math.round(sh * k);
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        const x = cv.getContext('2d', { willReadFrequently: true });
        if (flip) { x.translate(w, 0); x.scale(-1, 1); }
        x.drawImage(bmp, sx, sy, sw, sh, 0, 0, w, h);
        if (bmp.close) bmp.close();
        const d = x.getImageData(0, 0, w, h), a = d.data, span = Math.max(0.01, hi - lo);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < a.length; i += 4) if (L(a, i) >= hi) { r += a[i]; g += a[i + 1]; b += a[i + 2]; n++; }
        if (n) { r /= n; g /= n; b /= n; } else r = g = b = 255;
        // an un-mixed edge pixel is never lighter than the solid subject (luminance lo): without this
        // cap the thin, half-clear edges come out pale yellow and glow over a dark photograph
        const cap = Math.max(0.04, lo);
        for (let i = 0; i < a.length; i += 4) {
          const t = clamp((hi - L(a, i)) / span, 0, 1);
          if (t > 0 && t < 1) {
            const u = 1 / Math.max(t, 0.2);
            a[i] = clamp(r + (a[i] - r) * u, 0, 255); a[i + 1] = clamp(g + (a[i + 1] - g) * u, 0, 255); a[i + 2] = clamp(b + (a[i + 2] - b) * u, 0, 255);
            const l = L(a, i);
            if (l > cap) { const f = cap / l; a[i] *= f; a[i + 1] *= f; a[i + 2] *= f; }
          }
          a[i + 3] = Math.round(t * 255);
        }
        x.putImageData(d, 0, 0);
        img._swMask = maskOf(a, w, h);
        // data-tone: a CSS filter baked into the cut-out once, so a prop shot in other light sits in the
        // world's (a browser without canvas filters keeps the plain cut-out)
        let outCv = cv;
        const tone = (img.dataset.tone || '').trim();
        if (tone && 'filter' in x) {
          const tc = document.createElement('canvas'); tc.width = w; tc.height = h;
          const tx = tc.getContext('2d'); tx.filter = tone; tx.drawImage(cv, 0, 0);
          outCv = tc;
        }
        return new Promise((res, rej) => outCv.toBlob((blob) => (blob ? res(blob) : rej(new Error('toBlob'))), 'image/png'));
      })
      .then((blob) => {
        img.removeAttribute('srcset');
        img.src = URL.createObjectURL(blob);
        return img.decode().catch(() => {});
      })
      .then(() => { img.dataset.keyed = 'done'; img.classList.add('is-keyed'); img.dispatchEvent(new Event('sw-keyed')); })
      .catch(() => { img.dataset.keyed = 'failed'; img.classList.add('is-off'); });
  };

  // The bottom edge of a fixed or sticky bar held at the top of the window (a site header), 0 if none;
  // the same reading as orbit-to-formation's. The first frame is laid out in the screen under it.
  const barBottom = (root) => {
    let b = 0;
    const seen = new Set();
    const list = [...document.querySelectorAll('header, nav, [role="banner"], [role="navigation"]'), ...(document.body ? document.body.children : [])];
    for (const el of list) {
      if (seen.has(el) || root.contains(el) || el.contains(root)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if ((cs.position !== 'fixed' && cs.position !== 'sticky') || cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 * window.innerWidth || r.height <= 0 || r.height >= 0.2 * window.innerHeight) continue;
      const top = cs.position === 'sticky' ? parseFloat(cs.top) : r.top;
      if (isNaN(top) || top > 1 || top + r.height <= 0) continue;
      b = Math.max(b, Math.max(0, top) + r.height);
    }
    return b;
  };

  // relative luminance of a computed rgb() colour, or -1
  const lum = (c) => {
    const m = String(c).match(/[\d.]+/g);
    if (!m || m.length < 3) return -1;
    const [r, g, b] = m.slice(0, 3).map((v) => { v = +v / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = (root, opts = {}) => {
    const o = {
      hold: num(opts.hold, 2.4, 1.8, 3),
      phoneHold: num(opts.phoneHold, 2, 1.6, 2.6),
      open: num(opts.open, 0.38, 0, 0.5),
      phoneOpen: num(opts.phoneOpen, 0.22, 0, 0.4),
      bar: opts.bar == null || opts.bar === 'auto' ? null : num(opts.bar, 16, 8, 24),
      high: opts.high === 'left' ? 'left' : 'right',
      overscan: num(opts.overscan, 1.08, 1.04, 1.15),
      phoneOverscan: num(opts.phoneOverscan, 1.16, 1.04, 1.2),
      worldScale: num(opts.worldScale, 0.8, 0.75, 1),
      wordTop: num(opts.wordTop, 80, 0, 400),
      phoneWordTop: num(opts.phoneWordTop, 72, 0, 300),
      wordWidth: num(opts.wordWidth, 0.92, 0.6, 0.96),
      phoneWordWidth: num(opts.phoneWordWidth, 0.86, 0.6, 0.92),
      parallax: num(opts.parallax, 0.2, 0, 0.3),
      scrub: opts.scrub === true ? true : typeof opts.scrub === 'number' ? clamp(opts.scrub, 0, 2) : null,
      phone: opts.phone === 'rest' ? 'rest' : 'same',
    };
    const $ = (s) => root.querySelector(s);
    root.classList.toggle('sw--high-left', o.high === 'left');
    // The stage is 100lvh (see the CSS), so a phone's toolbar sliding away never uncovers a band of
    // ground under the photo; the resize that slide fires must not re-measure the scene either.
    if (window.ScrollTrigger && window.Stage && Stage.touch) ScrollTrigger.config({ ignoreMobileResize: true });

    // Type on the photo uses the lighter of ground and ink, unless the page chose a colour.
    const stageEl = root.querySelector(':scope > .scene-stage');
    if (stageEl && !getComputedStyle(root).getPropertyValue('--sw-light').trim()) {
      const ground = getComputedStyle(stageEl).backgroundColor, ink = getComputedStyle(root).color;
      if (lum(ink) > lum(ground)) root.style.setProperty('--sw-light', ink);
    }

    function build(tl, ctx) {
      const { stage, phone } = ctx;
      const world = $('.sw-world'), media = $('.sw-world-media'), shutter = $('.sw-shutter');
      const halfL = $('.sw-half--l'), halfR = $('.sw-half--r');
      const intro = $('.sw-intro'), title = $('.sw-title'), caption = $('.sw-caption'), word = $('.sw-word'), lede = $('.sw-lede');
      const scrimTop = $('.sw-scrim--top'), scrimBottom = $('.sw-scrim--bottom');
      const propL = $('.sw-prop--l'), propR = $('.sw-prop--r');
      if (!world || !shutter || !halfL || !halfR) { console.warn(`${ID}: needs .sw-world, .sw-shutter and two .sw-half elements`); return; }

      // the phases, each 0-1. level (scrubbed): the windows widen outward. merge (clock): the bar closes.
      // lift (clock): the title and caption fade. push1 (scrubbed): the one window grows while it is still
      // framed by ground on every side (5% of the screen at least). push2 (clock): the rest of the push,
      // past the screen's edges. No stop of the scroll catches the bar as a seam, the title half faded, or
      // the ground as slivers at the screen's edge.
      const p = { level: 0, merge: 0, push1: 0, push2: 0, lift: 0, lede: 0, scrim: 0 };
      const g = {};                               // geometry, re-measured on every refresh
      let dead = false;                           // set once this build is reverted
      // the word's letters land on a clock at every width, once the growing window has cleared the whole
      // word (never with the scroll, and never under the shutter's edge), so the word is whole wherever the
      // reader stops: no "EFIE"
      let wordTw = null, wordOn = false;
      const highRight = o.high === 'right';
      const vars = ['--sw-s0', '--sw-x0', '--sw-hole-w', '--sw-span-w', '--sw-low-x', '--sw-high-x', '--sw-low-top', '--sw-high-top', '--sw-high-bottom', '--sw-top', '--sw-bottom', '--sw-gap', '--sw-cap-x', '--sw-cap-w'];
      // the last strings written, so a frame that changes nothing writes nothing
      const last = new Map();
      const write = (el, prop, v) => {
        let o = last.get(el);
        if (!o) last.set(el, (o = {}));
        if (o[prop] !== v) { o[prop] = v; el.style[prop] = v; }
      };
      // photographs keyed into cut-outs (once per image; they stay hidden until keyed)
      for (const el of [propL, propR]) if (el && el.hasAttribute('data-key')) keyProp(el);

      // Props never cover the title or the caption: each one is nudged outward (left prop left, right
      // prop right) until its solid cells clear both boxes by PAD px. A ready-made cut-out is mapped
      // here; one from another origin without CORS cannot be read, and is placed as the page put it.
      const PAD = 16;
      const plainMask = (el) => {
        if (el._swMask !== undefined || el.hasAttribute('data-key') || !el.complete || !el.naturalWidth) return;
        try {
          const w = 200, h = Math.max(1, Math.round((200 * el.naturalHeight) / el.naturalWidth));
          const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
          const x = cv.getContext('2d', { willReadFrequently: true });
          x.drawImage(el, 0, 0, w, h);
          el._swMask = maskOf(x.getImageData(0, 0, w, h).data, w, h);
        } catch { el._swMask = false; }
      };
      const guard = () => {
        if (dead) return;
        const boxes = [intro, caption].filter((el) => el && el.offsetWidth > 0)
          .map((el) => ({ l: el.offsetLeft - PAD, t: el.offsetTop - PAD, r: el.offsetLeft + el.offsetWidth + PAD, b: el.offsetTop + el.offsetHeight + PAD }));
        for (const [el, dir] of [[propL, -1], [propR, 1]]) {
          if (!el) continue;
          plainMask(el);
          const m = el._swMask;
          if (!m || !el.offsetWidth || !boxes.length) { el.style.removeProperty('translate'); continue; }
          const x0 = el.offsetLeft, y0 = el.offsetTop, cw = el.offsetWidth / m.gw, ch = el.offsetHeight / m.gh;
          const hits = (s) => {
            for (const b of boxes) {
              for (let j = 0; j < m.gh; j++) {
                const ty = y0 + j * ch;
                if (ty + ch <= b.t || ty >= b.b) continue;
                for (let i = 0; i < m.gw; i++) {
                  const tx = x0 + s + i * cw;
                  if (m.cells[j * m.gw + i] && tx + cw > b.l && tx < b.r) return true;
                }
              }
            }
            return false;
          };
          let s = 0;
          while (Math.abs(s) < el.offsetWidth && hits(s)) s += 8 * dir;
          if (s) el.style.translate = `${s}px 0`; else el.style.removeProperty('translate');
        }
      };
      const onProp = () => guard();
      for (const el of [propL, propR]) if (el) { el.addEventListener('load', onProp); el.addEventListener('sw-keyed', onProp); }

      // The push is drawn by four flat bars of ground around the merged window, not by the halves:
      // a clip-pathed half has to be repainted and re-rasterised on every frame of the scale, which
      // is what dropped frames, while a plain filled box on its own layer is scaled by the compositor
      // with crisp edges and no raster at all. Once the bar has closed (merge 1) the window is one
      // rectangle, so the swap is invisible; scrolling back before it brings the halves back.
      const frame = document.createElement('div');
      frame.className = 'sw-frame';
      frame.setAttribute('aria-hidden', 'true');
      const bars = [0, 1, 2, 3].map(() => frame.appendChild(document.createElement('div')));
      for (const b of bars) b.className = 'sw-bar';
      halfR.after(frame);

      // The title is as wide as one window (wide) or both (narrow): step its size down until it sits on
      // two lines and fits the ground above the windows (`room` px tall), so a long title never runs to
      // three or four lines, nor up past the top of the stage.
      const fitTitle = (room) => {
        if (!title) return;
        title.style.removeProperty('font-size');
        const base = parseFloat(getComputedStyle(title).fontSize) || 40;
        let fs = base;
        const lines = () => { const cs = getComputedStyle(title); const lh = cs.lineHeight === 'normal' ? 1.2 * fs : parseFloat(cs.lineHeight); return title.offsetHeight / lh; };
        const tall = () => (intro || title).offsetHeight > room;
        for (let i = 0; i < 30 && (lines() > 2.5 || tall()) && fs > base * 0.5; i++) { fs *= 0.94; title.style.fontSize = px(fs); }
      };

      // the title and the caption fade as the push begins (opacity only: no edge ever cuts them)
      const fade = (el, a) => {
        write(el, 'opacity', a >= 1 ? '' : a.toFixed(3));
        write(el, 'visibility', a <= 0 ? 'hidden' : '');
      };

      // Fit the chapter word to the width (cap height held to a share of the stage) and put its cap-top
      // exactly at wordTop. A hidden probe in the same face gives the advance and the cap metrics.
      const fitWord = () => {
        if (!word) return;
        const cs = getComputedStyle(word);
        const fs = parseFloat(cs.fontSize) || 100;
        const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / fs;
        const ls = cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing) / fs;
        const probe = document.createElement('div');
        probe.setAttribute('aria-hidden', 'true');
        probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;font-family:${cs.fontFamily};font-weight:${cs.fontWeight};font-style:${cs.fontStyle};font-stretch:${cs.fontStretch};text-transform:${cs.textTransform};letter-spacing:${ls}em;font-size:100px;line-height:${lh}`;
        // letters split apart lose their kerning, so the probe sets them apart too: the word is fitted
        // as it is drawn and never runs past the width it was fitted to
        const t = document.createElement('span'), text = (word.getAttribute('aria-label') || word.textContent).trim();
        if (g.splitChars) for (const ch of text) { const c = document.createElement('span'); c.style.display = 'inline-block'; c.textContent = ch; t.append(c); }
        else t.textContent = text;
        const cap = document.createElement('span'); cap.style.cssText = 'display:inline-block;width:0;height:1cap';
        const base = document.createElement('span'); base.style.cssText = 'display:inline-block;width:0;height:0';
        probe.append(t, cap, base);
        word.parentNode.appendChild(probe);
        const w100 = t.offsetWidth || 1;
        let capH = cap.offsetHeight, capTop = cap.offsetTop;
        if (!capH) { capH = 70; capTop = base.offsetTop - 70; } // no `cap` unit: assume a 0.7em cap height
        probe.remove();
        const n = g.narrow;
        const size = Math.min((100 * g.W * (n ? o.phoneWordWidth : o.wordWidth)) / w100, (100 * g.H * (n ? 0.14 : 0.3)) / capH);
        word.style.fontSize = px(size);
        const top = Math.max(n ? o.phoneWordTop : o.wordTop, (g.T || 0) + MARGIN);
        word.style.top = px(top - (capTop * size) / 100);
        // the word's ink (centred on the stage), for the moment the growing window has cleared it
        g.wordInk = { w: (w100 * size) / 100, top };
      };

      const measure = () => {
        if (dead) return;
        const W = stage.clientWidth || innerWidth, H = stage.clientHeight || innerHeight;
        const n = phone || matchMedia(NARROW).matches;
        // A page's sticky bar covers the top T px of the held stage. The title is fitted between it and
        // the windows, and the word starts 16px under it. Wide screens, where the ground over the windows
        // is short, also lay the windows out in the screen under the bar; narrow ones have the room (and
        // moving their windows down would leave the push's top edge on the word longer).
        const T = Math.min(barBottom(root), 0.2 * H), yT = n ? 0 : T;
        const cx = W / 2;
        const m = n ? (o.bar ?? 10) : (o.bar ?? clamp(0.011 * W, 10, 20));
        // xs: the windows' outer edges in the first frame; x0-x3: the band they widen to (each outer
        // edge moves out by O, never closer than 2% of the width or 16px to the screen's edge, so a phone
        // keeps its gutter and no sliver of ground), which the bar then closes over
        const xs = (n ? 0.074 : 0.2222) * W;
        const holeW = cx - m / 2 - xs;   // one window's width in the first frame
        const O = Math.max(0, Math.min((n ? o.phoneOpen : o.open) * holeW, xs - Math.max(16, 0.02 * W)));
        const x0 = xs - O, x3 = W - x0;
        const y0 = yT + (n ? 0.3 : 0.185) * (H - yT), y1 = yT + (n ? 0.8 : 0.815) * (H - yT);
        const ox = cx, oy = (y0 + y1) / 2;
        // the push scale that carries the window's edges past the screen's, times the overscan
        const S = (n ? o.phoneOverscan : o.overscan) * Math.max(ox / (ox - x0), (W - ox) / (x3 - ox), oy / (oy - y0), (H - oy) / (y1 - oy));
        // the scrubbed part of the push stops where the widened window is still framed by 5% of the screen
        // on every side (at the top, 5% under a page's sticky bar); the rest of the push (past the edges)
        // runs on its clock. A narrow screen's window already reaches past 5% of the sides when it has
        // widened: there only the top and the foot stop the push (with the sides it never moved, 48-66%)
        const sides = x0 >= 0.05 * W ? [(ox - 0.05 * W) / (ox - x0), (0.95 * W - ox) / (x3 - ox)] : [];
        const s1 = clamp(Math.min((oy - T - 0.05 * H) / (oy - y0), (0.95 * H - oy) / (y1 - oy), ...sides), 1, S);
        Object.assign(g, { W, H, T, cx, C: cx + 2, m, x0, x3, O, y0, y1, S, s1, oy, narrow: n });
        root.classList.toggle('sw--narrow', n);
        shutter.style.transformOrigin = `${px(ox)} ${px(oy)}`;
        const set = (k, v) => root.style.setProperty(k, v);
        set('--sw-s0', String(o.worldScale));
        // the title and the caption are measured on the first frame's windows (xs to the bar), which
        // they never pass as the windows widen
        set('--sw-x0', px(xs)); set('--sw-hole-w', px(holeW)); set('--sw-span-w', px(W - 2 * xs));
        set('--sw-low-x', px(highRight ? xs : cx + m / 2)); set('--sw-high-x', px(highRight ? cx + m / 2 : xs));
        // (the low/high names are kept for pages that read them: both windows are level now)
        set('--sw-low-top', px(y0)); set('--sw-high-top', px(y0)); set('--sw-high-bottom', px(y1));
        // the band the windows fill (y0-y1): wide, the title stands above it and the caption below it,
        // on ground no window edge ever reaches; narrow, the title stands above both windows
        const gap = n ? 28 : clamp(0.032 * H, 20, 34);
        set('--sw-top', px(y0)); set('--sw-bottom', px(y1)); set('--sw-gap', px(gap));
        // the caption hangs under the high window against the bar (its outer side is the prop's)
        const capAt = (w) => { set('--sw-cap-w', px(w)); set('--sw-cap-x', px(highRight ? cx + m / 2 : cx - m / 2 - w)); };
        capAt(Math.min(0.22 * W, holeW));
        // the four bars around the merged window x0-x3 by y0-y1; each overlaps its neighbours by 2px and
        // runs EDGE px past the stage, so no seam or photo edge can show at any scale
        const box = (el, l, t, w, h) => { el.style.left = px(l); el.style.top = px(t); el.style.width = px(w); el.style.height = px(h); };
        box(bars[0], -EDGE, -EDGE, W + 2 * EDGE, y0 + EDGE);
        box(bars[1], -EDGE, y1, W + 2 * EDGE, H - y1 + EDGE);
        box(bars[2], -EDGE, y0 - 2, x0 + EDGE, y1 - y0 + 4);
        box(bars[3], x3, y0 - 2, W - x3 + EDGE, y1 - y0 + 4);
        // the bars wear whatever the page gave the halves (a grain texture costs them their free scaling)
        const hs = getComputedStyle(halfL);
        for (const b of bars) {
          b.style.backgroundColor = hs.backgroundColor;
          if (hs.backgroundImage !== 'none') Object.assign(b.style, { backgroundImage: hs.backgroundImage, backgroundSize: hs.backgroundSize, backgroundRepeat: hs.backgroundRepeat, backgroundAttachment: hs.backgroundAttachment });
        }
        last.clear();
        fitTitle(y0 - T - gap - MARGIN);
        // a caption too tall for the ground under the band takes the window's full width, and is left
        // out when even that does not fit (its key fact is repeated in the lede)
        root.classList.remove('sw--no-caption');
        if (caption && !n) {
          const room = H - y1 - gap - MARGIN;
          if (caption.offsetHeight > room) capAt(holeW);
          if (caption.offsetHeight > room) root.classList.add('sw--no-caption');
        }
        fitWord();
        guard();
      };

      // Every frame: both halves as the same 11-point evenodd polygon (the zero-width slit runs only
      // through the bar), the shutter's push scale, and the fade of the title and the caption.
      // The halves overhang the stage by EDGE px (see the CSS), so their outer edges never sit on the
      // stage's edge where the photo could bleed through the anti-aliasing; X() maps stage px to half px.
      const X = (v) => px(v + EDGE);
      const render = () => {
        if (!g.W || dead) return;
        const { H, W, cx, C, m, x0, x3, y0, y1, O } = g;
        const lT = y0, lB = y1, rT = y0, rB = y1;
        // the outer edges: the first frame's (x0 + O), out to the band as the windows widen
        const xL = x0 + O * (1 - p.level), xR = x3 - O * (1 - p.level);
        const mg = Math.min(1, p.merge / BAR_CLOSE);
        const lR = cx - m / 2 + (m / 2 + 2) * mg, rL = cx + m / 2 - (m / 2) * mg;
        const R = px(W + 2 * EDGE), B = px(H + 2 * EDGE);
        // one window: the bars take over from the halves (see the frame above)
        const one = p.level >= 0.9999 && p.merge >= BAR_CLOSE - 0.0001;
        write(frame, 'visibility', one ? 'visible' : '');
        write(halfL, 'visibility', one ? 'hidden' : '');
        write(halfR, 'visibility', one ? 'hidden' : '');
        write(halfL, 'clipPath', `polygon(evenodd, 0 0, ${X(C)} 0, ${X(C)} ${X(lT)}, ${X(lR)} ${X(lT)}, ${X(xL)} ${X(lT)}, ${X(xL)} ${X(lB)}, ${X(lR)} ${X(lB)}, ${X(lR)} ${X(lT)}, ${X(C)} ${X(lT)}, ${X(C)} ${B}, 0 ${B})`);
        write(halfR, 'clipPath', `polygon(evenodd, ${R} 0, ${X(cx)} 0, ${X(cx)} ${X(rT)}, ${X(rL)} ${X(rT)}, ${X(xR)} ${X(rT)}, ${X(xR)} ${X(rB)}, ${X(rL)} ${X(rB)}, ${X(rL)} ${X(rT)}, ${X(cx)} ${X(rT)}, ${X(cx)} ${B}, ${R} ${B})`);
        const s = 1 + (g.s1 - 1) * clamp(p.push1, 0, 1) + (g.S - g.s1) * clamp(p.push2, 0, 1);
        write(shutter, 'transform', s > 1.0001 ? `scale(${s.toFixed(5)})` : 'none');
        // the shutter is past every edge once the push is done: stop painting it
        write(shutter, 'visibility', p.push2 >= 0.999 ? 'hidden' : '');
        // what the push carries with it: the world grows 1/worldScale times (so the push has depth), the
        // word from 0.92, and the props are thrown outward
        const k = g.S > 1 ? clamp((s - 1) / (g.S - 1), 0, 1) : 1;
        if (setMedia) setMedia(o.worldScale + (1 - o.worldScale) * k);
        if (setWord) setWord(0.92 + 0.08 * k);
        if (setPropL) setPropL(-55 * k * k);
        if (setPropR) setPropR(55 * k * k);
        // the word and its letters are promoted only while the push moves them, so they are sharp at rest
        const moving = k > 0.0001 && k < 0.9999 ? 'transform' : 'auto';
        for (const el of wordLayers) write(el, 'willChange', moving);
        // the title and the caption stand on ground the windows never reach; both fade (on their clock)
        // as the push begins
        if (intro) fade(intro, 1 - p.lift);
        if (caption) fade(caption, 1 - p.lift);
        // the word on its clock: played once the window has cleared the whole word (6px to spare on each
        // side and above), played back when it closes over it again
        if (g.wordInk) {
          const L = g.cx - (g.cx - x0) * s, R = g.cx + (x3 - g.cx) * s, T = g.oy - (g.oy - y0) * s;
          const clear = p.push2 >= 0.999 || (p.push2 > 0 && L <= g.cx - g.wordInk.w / 2 - 6 && R >= g.cx + g.wordInk.w / 2 + 6 && T <= g.wordInk.top - 6);
          if (wordTw && clear !== wordOn) { wordOn = clear; if (clear) wordTw.play(); else wordTw.reverse(); }
          if (scrimC) drive(scrimC, clear, false);
        }
        if (scrimTop) write(scrimTop, 'opacity', p.scrim.toFixed(3));
        if (lede) { write(lede, 'opacity', p.lede.toFixed(3)); write(lede, 'visibility', p.lede > 0.001 ? '' : 'hidden'); write(lede, 'transform', p.lede < 0.999 ? `translate3d(0, ${(24 * (1 - p.lede)).toFixed(2)}px, 0)` : 'none'); }
      };
      // the clocks (see p above): each plays when the scroll passes its point and plays back when it
      // returns; a landing far past the point (a reload mid-page) jumps instead
      let setMedia = null, setWord = null, setPropL = null, setPropR = null, wordLayers = [], scrimC = null;
      const clocks = [];
      const clockOf = (key, dur, ease) => {
        const c = { on: false, tw: gsap.fromTo(p, { [key]: 0 }, { [key]: 1, duration: dur, ease, paused: true, immediateRender: false, onUpdate: render, onComplete: () => tick(), onReverseComplete: () => tick() }) };
        clocks.push(c);
        return c;
      };
      const drive = (c, on, jump) => {
        if (!c) return;
        // already on its way: a jump still finishes it at once
        if (on === c.on) { if (jump && c.tw.isActive()) c.tw.progress(on ? 1 : 0).pause(); return; }
        c.on = on;
        if (jump) c.tw.progress(on ? 1 : 0).pause();
        else if (on) c.tw.play(); else c.tw.reverse();
      };
      let mergeC = null, liftC = null, push2C = null, ledeC = null;
      // (snap: the point past which the clock jumps to its end, because what follows needs it done: the
      // bar closed and the title gone before the push starts growing the shutter at 0.48)
      const at = (q, point, on) => drive(on.c, q >= point && (on.also ?? true), q >= (on.snap ?? point + 0.25) || q < point - 0.25);
      const tick = () => {
        if (dead) return;
        const q = tl.progress();
        at(q, 0.32, { c: mergeC, snap: 0.47 });
        at(q, 0.44, { c: liftC, snap: 0.47 });
        at(q, 0.66, { c: push2C });
        at(q, 0.8, { c: ledeC, also: p.push2 >= 0.999 });
        render();
      };

      // A nested context: reverted with the stage's matchMedia, and its cleanup clears the inline
      // geometry so the finished composition (or the other breakpoint) starts clean.
      gsap.context(() => {
        // the chapter word, split into characters inside a line mask
        const chars = word ? Stage.split(word, 'chars') : [];
        g.splitChars = !!(chars.length && window.SplitText);

        measure();

        // 1. widen (p.level, scrubbed, 0.04-0.30); 2. merge (clock at 0.32); 3. still beat; the title and
        // the caption fade (clock at 0.44), gone before the push can carry them off the screen
        tl.to(p, { level: 1, duration: 0.26, ease: 'sine.inOut' }, 0.04);
        mergeC = clockOf('merge', 0.35, 'power2.inOut');
        liftC = clockOf('lift', 0.3, 'power1.in');
        // 4. the push, scrubbed while the window is framed by ground (0.48-0.66), then past the screen's
        //    edges on a clock (at 0.66, 0.55s): the frame grows S times, the world 1/worldScale times
        tl.to(p, { push1: 1, duration: 0.18, ease: 'sine.inOut' }, 0.48);
        push2C = clockOf('push2', 0.55, 'power2.out');
        if (media) { gsap.set(media, { scale: o.worldScale }); setMedia = gsap.quickSetter(media, 'scale'); }
        if (word) { gsap.set(word, { scale: 0.92, transformOrigin: '50% 0%' }); setWord = gsap.quickSetter(word, 'scale'); }
        if (propL) setPropL = gsap.quickSetter(propL, 'xPercent');
        if (propR) setPropR = gsap.quickSetter(propR, 'xPercent');
        // 5. the word: centre letters first, on a clock of 0.6s once the window has cleared it (render()),
        //    with the flat scrim behind it
        if (chars.length) {
          // a staggered fromTo only pre-renders its first letters, so every letter is set down first
          const down = { yPercent: 110, rotationX: -75, transformOrigin: '50% 100%', transformPerspective: 900 };
          gsap.set(chars, down);
          wordTw = gsap.fromTo(chars, down, { yPercent: 0, rotationX: 0, duration: 0.4, ease: 'power3.out', paused: true, immediateRender: false, stagger: { amount: 0.2, from: 'center' } });
        }
        if (scrimTop) scrimC = clockOf('scrim', 0.4, 'power1.out');
        // The word and its letters are promoted only while they move (render()): a layer kept for good
        // would hold the raster from the starting state (scale 0.92, letters tipped back) and leave the
        // word soft.
        wordLayers = word ? [word, ...chars] : [];
        // 6. the lede settles on its strip of ground (clock at 0.8, once the push is done)
        if (lede) ledeC = clockOf('lede', 0.45, 'power2.out');
        // 7. the final hold
        tl.to({}, { duration: 0.06 }, 0.94);
        tl.eventCallback('onUpdate', tick);

        // Entry: the world is counter-moved so it stays fixed to the viewport while the stage rises in
        // (by the viewport's height, which is what the section travels; the stage itself is 100lvh).
        gsap.fromTo(world, { y: () => -(window.innerHeight || stage.clientHeight) }, {
          y: 0, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true },
        });
        // Exit: the world sinks while the stage leaves (on the media, so it never fights the entry).
        if (o.parallax && media) {
          gsap.fromTo(media, { y: 0 }, {
            y: () => stage.clientHeight * o.parallax, ease: 'none', immediateRender: false,
            scrollTrigger: { trigger: root, start: 'bottom bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          });
        }
        // Re-measure on every refresh (resize, fonts, pictures), then redraw.
        ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onRefresh: () => { measure(); tick(); } });
        tick();

        // late fonts change the word's advance: refit without a full refresh
        const onFonts = () => { measure(); tick(); };
        if (document.fonts) document.fonts.addEventListener('loadingdone', onFonts);
        // pictures decode before they move
        if (media && media.decode && media.tagName === 'IMG') media.decode().catch(() => {});
        // a video world plays only while the section is on screen
        let io = null;
        if (media && media.tagName === 'VIDEO' && 'IntersectionObserver' in window) {
          io = new IntersectionObserver(([e]) => { if (e.isIntersecting) media.play().catch(() => {}); else media.pause(); });
          io.observe(root);
        }

        return () => {
          // the timeline's own revert renders it once more: detach first, so nothing redraws afterwards
          dead = true;
          tl.eventCallback('onUpdate', null);
          if (document.fonts) document.fonts.removeEventListener('loadingdone', onFonts);
          if (io) io.disconnect();
          for (const el of [propL, propR]) if (el) { el.removeEventListener('load', onProp); el.removeEventListener('sw-keyed', onProp); el.style.removeProperty('translate'); }
          for (const el of [halfL, halfR]) { el.style.removeProperty('clip-path'); el.style.removeProperty('visibility'); }
          frame.remove();
          for (const el of [intro, caption]) if (el) { el.style.removeProperty('opacity'); el.style.removeProperty('visibility'); }
          if (lede) for (const k of ['opacity', 'visibility', 'transform']) lede.style.removeProperty(k);
          if (scrimTop) scrimTop.style.removeProperty('opacity');
          for (const el of wordLayers) el.style.removeProperty('will-change');
          shutter.style.removeProperty('transform'); shutter.style.removeProperty('transform-origin'); shutter.style.removeProperty('visibility');
          if (word) { word.style.removeProperty('font-size'); word.style.removeProperty('top'); }
          if (title) title.style.removeProperty('font-size');
          root.classList.remove('sw--narrow', 'sw--no-caption');
          for (const k of vars) root.style.removeProperty(k);
        };
      });
    }

    // stage.js picks the phone plan by width alone; a portrait tablet (narrow by aspect) gets the narrow
    // hold here, chosen once at load
    return Stage.scene(root, {
      hold: matchMedia(NARROW).matches ? o.phoneHold : o.hold,
      scrub: o.scrub ?? (Stage.lenis ? true : 0.6),
      build,
      phone: o.phone === 'rest' ? 'rest' : { hold: o.phoneHold, build },
    });
  };
})();

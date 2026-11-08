// V69 deck scene: each arrival pushes the deck back a rung (lib-0194).
// Cards slide up into the front slot; earlier cards step back smaller toward the
// upper right, three rungs showing, the fourth fading. One cut line under the
// deck swaps (no fade) to the front card's summary. One pass, then release.
(() => {
  const ID = 'deck-arrival';
  const LINES = [
    'Sixteen soups, manchow to burnt garlic, ₹130 to ₹180.',
    'Rice ten ways, from schezwan to moon foon.',
    'Eight kinds of noodles, hakka to chilly garlic.',
    'Twelve paneer plates, kurkure to peri-peri, ₹280 to ₹290.',
    'Mocktails served in jars, counted in the 250.',
    'Two hundred and fifty varieties of dishes and mocktails, the listing says.',
  ];
  // rung transforms: [scale, xPercent, yPercent, opacity]; one visible back strip,
  // deeper rungs hidden. Strip clip is measured in px at build so the full h3 shows.
  const RUNGS = [
    [1, 0, 0, 1],
    [0.86, 2.5, -18, 0.85],
    [0.78, 5, -36, 0],
    [0.72, 7, -54, 0],
  ];
  window.Scenes = window.Scenes || {};
  window.Scenes[ID] = (root, opts = {}) => Stage.scene(root, {
    hold: opts.hold ?? 2,
    build(tl, { q, phone }) {
      const cards = q('.deck__card');
      const line = q('.deck__line')[0];
      if (!cards.length || !line) return Stage.REST;
      const n = cards.length;
      const beat = 1 / n;
      const shrink = phone ? 0.5 : 1; // shallower x-depth on phone
      const h3h = cards[0].querySelector('h3').getBoundingClientRect().height;
      const padT = parseFloat(getComputedStyle(cards[0]).paddingTop) || 20;
      const stripClip = `inset(0% 0% calc(100% - ${Math.ceil(padT + h3h + 6)}px) 0%)`;
      cards.forEach((c, i) => c.style.zIndex = String(i + 1));
      const setLine = (i) => { line.textContent = LINES[i] || LINES[0]; };
      cards.forEach((card, k) => {
        const t = k * beat;
        if (k > 0) {
          tl.fromTo(card,
            { yPercent: 170, autoAlpha: 1 },
            { yPercent: 0, autoAlpha: 1, duration: beat * 0.38, ease: 'power1.out' }, t);
          tl.fromTo(card.querySelectorAll('p'),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: beat * 0.2 }, t + beat * 0.34);
        }
        cards.forEach((prev, j) => {
          if (j >= k) return;
          const rung = Math.min(k - j, 3);
          const [s, x, y, o] = RUNGS[rung];
          const clip = rung === 0 ? 'inset(0% 0% 0% 0%)' : stripClip;
          tl.to(prev, {
            scale: 1 - (1 - s) * shrink,
            xPercent: x * shrink, yPercent: y,
            autoAlpha: o, clipPath: clip, duration: beat * 0.38, ease: 'power1.out',
          }, t);
          if (k - j === 1) tl.to(prev.querySelectorAll('p'), { autoAlpha: 0, duration: beat * 0.18 }, t);
        });
        tl.call(setLine, [k], k === 0 ? 0 : t + beat * 0.4);
      });
      return undefined;
    },
    rest(ctx) {
      const line = ctx.q('.deck__line')[0];
      if (line) line.textContent = LINES[0];
    },
  });
})();

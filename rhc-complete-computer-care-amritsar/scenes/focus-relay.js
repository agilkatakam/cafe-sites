// V74 / scenes / focus-relay.js — lib-0236: statements pull into focus under the scroll.
// Three statements, each word arriving oversized, soft and faint and sharpening into place;
// once a statement is sharp its one-sentence note rises up through and past it, then the
// statement leaves by focus in reverse while the next arrives. No photographs, flat ground.
// Touch drops the blur for a plain opacity rise. The section keeps an aria-label of the
// whole run, so screen readers hear the sentences whole.
(() => {
  const ID = 'focus-relay';

  const splitWords = (el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    return words.map((w) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      return s;
    });
  };

  const make = (useBlur) => (tl, { q }) => {
    // words arrive first; nothing crosses words already sharp (scenes.md rule 4)
    const items = Array.from(q('[data-relay]'));
    if (!items.length) return;
    const n = items.length;
    items.forEach((item, i) => {
      const head = item.querySelector('.relay-head');
      const note = item.querySelector('.relay-note');
      const words = splitWords(head);
      const start = i / n;
      const slice = 1 / n;
      const wEach = (slice * 0.4) / words.length;
      // words arrive: 125% scale, 6px blur, faint -> sharp; blur gone in the first third
      words.forEach((w, j) => {
        const at = start + j * wEach;
        tl.fromTo(w,
          { scale: 1.25, opacity: 0.15, filter: useBlur ? 'blur(6px)' : 'blur(0px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', duration: wEach * 1.6, ease: 'none', immediateRender: false }, at);
      });
      // the item itself fades in as its first word lands (css holds every item at 0)
      tl.to(item, { opacity: 1, duration: slice * 0.04, ease: 'none' }, start);
      // note rises into its place under the heading, holds, then fades
      tl.fromTo(note,
        { yPercent: 130, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: slice * 0.22, ease: 'none', immediateRender: false }, start + slice * 0.42);
      tl.to(note, { opacity: 0, duration: slice * 0.08, ease: 'none' }, start + slice * 0.78);
      // statement holds sharp, then leaves by focus in reverse while the next arrives
      if (i < n - 1) {
        tl.to(item,
          { opacity: 0, scale: 0.96, filter: useBlur ? 'blur(6px)' : 'blur(0px)', duration: slice * 0.16, ease: 'none' },
          start + slice * 0.86);
      }
    });
    // the last statement stays sharp to the end of the hold
  };

  window.Scenes[ID] = (root, opts = {}) => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    return Stage.scene(root, {
      hold: opts.hold ?? 2,
      build: make(!touch),
      phone: { hold: 1.6, build: make(false) },
    });
  };
})();

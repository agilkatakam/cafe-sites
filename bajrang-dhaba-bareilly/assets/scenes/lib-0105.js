// lib-0105 "Type sets like wet ink" - built on Stage (references/scenes.md section 8).
// Lines of display type start as swollen ink blobs (blur through a hard alpha threshold) and sharpen one by one.
// The filter is on a line only while it moves. Needs no photographs. Rest: all lines crisp, stacked.
(() => {
  window.Scenes = window.Scenes || {};
  Scenes['lib-0105'] = (root, opts = {}) => Stage.scene(root, {
    hold: opts.hold ?? 1,
    scrub: opts.scrub ?? true,
    phone: 'same',
    build(tl, { q }) {
      const lines = q('.wi-line'), act = q('.wi-act')[0], blur = document.getElementById('wet-b');
      const starts = [0, 0.18, 0.36, 0.54];
      lines.forEach((el, i) => {
        if (i === 0) return;
        const o = { v: 1 };
        const paint = () => {
          const v = o.v;
          el.style.opacity = Math.min(1, (1 - v) * 3).toFixed(3);
          if (v > 0.02) { blur.setAttribute('stdDeviation', (v * 8).toFixed(2)); el.style.filter = 'url(#wet)'; }
          else el.style.filter = 'none';
        };
        tl.fromTo(o, { v: 1 }, { v: 0, duration: 0.2, ease: 'none', onUpdate: paint, onReverseComplete: paint }, starts[i]);
      });
      if (act) tl.fromTo(act, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'none' }, 0.74);
    },
  });
})();

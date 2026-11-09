/* weight-trade - a dealt technique (lib-0192) built fresh on the shared stage.
   The scroll drives the first line from weight 100 up to 900 and the second from
   900 down to 100; at the crossing (both at 500) ground and ink swap in one cut. */
(function () {
  if (!window.Scenes || !window.Stage) return;
  Scenes['weight-trade'] = (root, opts = {}) => Stage.scene(root, {
    hold: opts.hold ?? 2,
    scrub: true,
    phone: { hold: 1.2, build: null },
    build(tl, { q }) {
      const stage = q('.wt-stage');
      const a = q('.wt-a');
      const b = q('.wt-b');
      const note = q('.wt-note');
      tl.fromTo(a, { fontVariationSettings: "'wght' 100" }, { fontVariationSettings: "'wght' 900", duration: 1, ease: 'none' }, 0)
        .fromTo(b, { fontVariationSettings: "'wght' 900" }, { fontVariationSettings: "'wght' 100", duration: 1, ease: 'none' }, 0)
        // the crossing: ground and ink swap in one cut
        .to(stage, { backgroundColor: '#2b2622', color: '#ebe5e3', duration: 0.02, ease: 'none' }, 0.49)
        .to(note, { color: 'rgba(235,229,227,0.8)', duration: 0.02, ease: 'none' }, 0.49);
    },
  });
})();

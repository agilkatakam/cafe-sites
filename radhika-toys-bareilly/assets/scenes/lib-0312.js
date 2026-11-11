// lib-0312 "veil hides the palette swap" - built on Stage (references/scenes.md section 8).
// An accent-coloured veil rises like a tide across the stage; while it is opaque ground and ink swap; then it clears.
// Needs no photographs. Rest (no script, reduced motion): both statements stand one after the other, no veil.
(() => {
  window.Scenes = window.Scenes || {};
  Scenes['lib-0312'] = (root, opts = {}) => Stage.scene(root, {
    hold: opts.hold ?? 1,
    scrub: opts.scrub ?? true,
    phone: 'same',
    build(tl, { q }) {
      const [a] = q('.vl-a'), [b] = q('.vl-b'), [veil] = q('.vl-veil'), [ta] = q('.vl-a .vl-text'), [tb] = q('.vl-b .vl-text');
      // A leaves before the veil rises; B's words wait under the opaque veil (same colour as their ground) and are uncovered as it clears
      tl.to(ta, { autoAlpha: 0, yPercent: -8, duration: 0.1 }, 0.15)
        .fromTo(veil, { yPercent: 100 }, { yPercent: 0, duration: 0.25, ease: 'power1.in' }, 0.25)
        .fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 0.5)
        .fromTo(veil, { yPercent: 0 }, { yPercent: -100, duration: 0.2, ease: 'power1.out', immediateRender: false }, 0.5)
        .fromTo(tb, { yPercent: 6 }, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, 0.5);
    },
  });
})();

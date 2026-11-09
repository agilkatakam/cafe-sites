/* V73 scene lib-0105 "Type sets like wet ink" - a dealt technique built on the shared stage.
   Display type exists first as swollen, merged ink blobs and sharpens into clean letters line by
   line: a blur pushed through a hard alpha threshold that relaxes as the blur clears.
   One SVG filter per line, attached only while the line moves, removed at rest. */
(() => {
  if (!window.Scenes) window.Scenes = {};

  const NS = 'http://www.w3.org/2000/svg';

  const makeFilter = (defs, id) => {
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-60%');
    filter.setAttribute('width', '140%'); filter.setAttribute('height', '220%');
    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '6');
    const cm = document.createElementNS(NS, 'feColorMatrix');
    cm.setAttribute('type', 'matrix');
    cm.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7');
    filter.appendChild(blur); filter.appendChild(cm);
    defs.appendChild(filter);
    return { blur, cm, id };
  };

  const setInk = (F, p) => {
    const b = 6 * (1 - p);
    const gain = 1 + 17 * (1 - p);
    const lift = -7 * (1 - p);
    F.blur.setAttribute('stdDeviation', b.toFixed(2));
    F.cm.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${gain.toFixed(2)} ${lift.toFixed(2)}`);
  };

  Scenes['wet-ink'] = (root, opts = {}) => Stage.scene(root, {
    hold: opts.hold ?? 0.75,
    scrub: 0.25,
    phone: 'same',
    build(tl, { q }) {
      // one filter per line, built once per scene build
      let defs = root.querySelector('svg.wetink-defs defs');
      if (!defs) {
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
        svg.setAttribute('aria-hidden', 'true');
        svg.classList.add('wetink-defs');
        svg.style.position = 'absolute';
        svg.appendChild(document.createElementNS(NS, 'defs'));
        root.appendChild(svg);
        defs = svg.querySelector('defs');
      }

      const lines = q('[data-inkline]');
      const cta = q('.scene-cta')[0];
      const items = lines.map((el, i) => ({ el, F: makeFilter(defs, 'wetink-' + i), proxy: { p: 0 } }));
      if (cta) items.push({ el: cta, F: makeFilter(defs, 'wetink-cta'), proxy: { p: 0 } });

      // finished-composition baseline: everything crisp and in place
      items.forEach((it) => { gsap.set(it.el, { clearProps: 'all' }); it.el.style.filter = ''; });

      const n = items.length;
      // the full composition is on stage from the start as swollen ink; each line sharpens at its beat
      items.forEach((it) => { it.el.style.filter = `url(#${it.F.id})`; setInk(it.F, 0); });
      items[0].proxy.p = 0.3; setInk(items[0].F, 0.3);
      tl.set(items.map((it) => it.el), { y: '3vh' }, 0);
      items.forEach((it, i) => {
        const at = i * (0.72 / Math.max(1, n - 1));   // beats across the hold, last starts at 0.72
        tl.call(() => { it.el.style.filter = `url(#${it.F.id})`; setInk(it.F, 0); }, null, at)
          .to(it.el, { y: 0, duration: 0.22, ease: 'power2.out' }, at)
          .to(it.proxy, {
            p: 1, duration: 0.24, ease: 'none',
            onUpdate: () => setInk(it.F, it.proxy.p),
          }, at)
          .call(() => { it.el.style.filter = ''; }, null, at + 0.26);
      });
      tl.to({}, { duration: 0.06 }, 0.94); // pad to 1
    },
    rest({ q }) {
      // reduced motion / no GSAP: plain crisp type, nothing hidden
      q('[data-inkline], .scene-cta').forEach((el) => {
        el.style.filter = '';
        el.style.transform = '';
        el.style.opacity = '';
      });
    },
  });
})();

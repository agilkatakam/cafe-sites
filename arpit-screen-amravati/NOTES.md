# V73 - Arpit Screen, wedding & invitation card store, Amravati (concept preview)

Idea sentence: "On this page, the shop's own output - the invitation wording - becomes the display." (Nearest competitor test: a generic printer has no card wordings to show; the device is specific.)

Direction: Loud and flat (seed 1916956572). Hero: Narrow talk, wide headline. Type: Zilla Slab 400/600/700. Palette: near-black rose #191212 / surface #312929 / ink #fff7f6 / muted #c6baba / accent green #64bd74. Nav side-index; footer picture-and-facts (split, 60svh photo left); surface cards; soft-accent buttons; 4px corners; airy spacing; one warm grade on all pictures. Entrance: Set type. Small moves: Char blur scrub. Motion: slow crossfade. No interactive piece, no video. Photograph total: 3 (hero 1, showcase 1, footer 1).

## Draw history
- Drawn ONCE Nov 9 (seed 1916956572), avoid list = all 21 prior direction ids incl uneven-photographs (V72).
- ACCIDENT: a flagless `draw.mjs --sector other --badflag` probe at 10:28 IST drew a stray sheet ("The printed annual"/editorial-report, seed 2021869845) to stdout + ~/.taste-skill; stray history entry and direction.json removed before the real draw; not used for V73.
- Scenes redraw 1 of 2 (`--redraw scenes`): dealt shaped-window-over-fixed-world (fillable only with a ~3600px wide photo of "the place"; weak honest candidates) + peel-tear-and-drag (needs a plane cut-out and a brand that flies - unfillable honestly for a card shop, same as V72). Re-dealt: lib-0105 "Type sets like wet ink" (technique, no photos) carries the intro. Result: ONE scene only.
- section:showcase redrawn: object-on-a-disc (needs a cut-out product photo = another maker's product, V72's exact problem) -> two-objects-two-fields (needs TWO cut-out object photographs; honest searches found none - "blank envelope white background" nothing usable, "blank greeting card" nothing usable) -> redraw dealt object-on-a-disc AGAIN (pool loop) -> explicit choice from --alternatives: showcase-output-slips-along-the-edge (written for subjects whose result is paper; samples of real output carried as TYPE on paper slips, one full-bleed scene photo). 4 slot redraws total, all documented here.

## Omissions (parent rule Nov 9)
- Since 2004: only the TBR Business Info label; IndiaMART/dreamweddinghub corroboration unavailable (bot-blocked / no detail) -> OMITTED.
- Community-specific card collections: TBR AI Overview only (a lead, not evidence) -> OMITTED.
- Kept facts (TBR block, live Nov 9): wedding/invitation card store; Namuna Lane 5 Near Patel Ghodewala Janardhan Peth Amravati 444601; +919890062120; arpitscreen@gmail.com; Mon-Sat 10:30am-9pm, Sun closed (single source, no contradiction); 4.9 Score (single source, attributed to listing).

## Photos (substitution declared)
Dealt "Sky and space" set is the wrong subject for a card shop (skies/fireworks are not the wedding's materials or Amravati). Substituting paper/materials + Amravati photos (declared; not a redraw). Candidates, all to be viewed full size before use:
- hero: c826 Papierkanten (curved paper sheets on black, CC BY-SA 4.0, Dietmar Rabich)
- showcase full-bleed: c823 Scattered white paper (CC0, Brandi Redd)
- footer: Amravati today (Bamboo Garden gate, CC BY-SA 4.0, Ganesh Dhamodkar, 4032x2268) or a paper detail
- one warm grade over all; credits behind one Image credits dialog; illustrative captions visible.

## Content notes
- Slip texts = invitation wordings in type (no maker's designs); categories limited to wedding + invitation cards.
- Footer disclaimer "Concept preview. Enquiries only, not a booking service."; enquiry-only caveat near contact actions; mailto arpitscreen@gmail.com; tel +919890062120; noindex; no Instinct branding; no promise of outcome.

## Look-and-fix rounds (Nov 9)
- i4 (19 FAIL): menu overlay [hidden] overridden by display:flex; scene overlap. Fixed.
- i5 (15 FAIL): one edit batch had failed atomically; re-applied 7 edits individually.
- i6 (5 FAIL): no-nav@1440 (Lenis hijacked scroll restoration -> dropped Stage.smooth(), scrub 0.6), bento slips half empty, framed-elements, text-on-photo (side-index over footer photo -> hide over write too), eyebrow@768 (fact block order/size).
- i7 (5 FAIL): few-pictures (lazy imgs not counted at load -> lazy removed), nav-not-as-dealt (threshold-0 hiding kept index invisible at probe points -> rootMargin -40% hide), bento (slip heights 26-28svh + min-heights, 6 lines each), held-dead-screen (first line crisp from start).
- i9: wet-ink rewritten so the full composition stands as swollen ink from frame 0; lines sharpen in turn.
- i11/scenes: hold 1 -> 0.75 (inspector conflict resolved toward inspector; deal sheet said hold 1), scrub 0.25, statement size clamp(2.6rem,6.4vw,5.75rem) desktop / 8vw tablet / 9.2vw phone, blur 6.
- i12 (1 FAIL): statement 3 wrapped 3 lines at 390 -> statements shortened ("the first thing people hold." / "arpit screen keeps shelves." / "come and look, or ask arpit.").
- i13: 0 FAIL, 5 WARN with --allow framed-elements. lint 0 FAIL.

## --allow defenses
- framed-elements: the dealt showcase IS output-slips-along-the-edge (section 9): six paper slips + a scrimmed text column stand on the full-bleed paper photo by design. Boxes-on-photo is the dealt beat, not a card habit.

## WARN defenses
- held-dead-screen (WARN at hold 0.75): wet-ink is a type-only dealt technique (lib-0105: "Needs: no photographs"); frames carry the full 3-statement composition as soft ink which the pixel-flatness meter reads as ground. Verified visually on scenes sheets (v73-scenes8) - every frame shows the composition.
- scenes.mjs empty-steps (tablet/phone, flaky desktop): same cause - soft ink blobs measure as flat ground. Sheets eyeballed: frames full, statements <=2 lines, CTA last, rest state crisp.
- heading-step-drift: "say it on paper." at 34px per dealt showcase blueprint (28-32px paragraphs + panel head), not the section-title step.
- size-count (11): dealt type steps + scene statement size + slip/footer small sizes; all from the direction sheet's scale.
- off-centre (30/85): dealt side-index pattern - content in columns 3-12, index in 1-2; margins unequal by design.
- caption-on-media @768: dealt showcase carries the "Illustrative photo." label and panel text on the full-bleed photo.
- label-clutter @390: the slips' wording lines are the dealt "samples of real output"; 3 slips visible on phone.

## Verification
- lint.mjs: 0 FAIL, 0 WARN. inspect.mjs @1440/768/390: 0 FAIL (--allow framed-elements), 5 WARN defended above.
- scenes.mjs: every scene ran; sheets eyeballed (desktop/tablet/phone/reduced).
- Full-size screenshots eyeballed: desktop fold+pages, tablet fold+pages, mobile fold+page (i13).
- Fixed during eyeball: figcaption "amravati" -> "Amravati"; scroll-margin-top 72px for anchored sections under the fixed bar.

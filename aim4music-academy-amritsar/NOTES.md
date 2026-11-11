# V76 - Aim4Music Academy, Amritsar (music schools)

State Nov 11 2026 ~09:50 IST: QUALIFIED, direction drawn ONCE, plan written. No page files yet. No email sent.
Sheet row nowebsite_ready 165 (V76 UNSENT). lead_status_log next free row A1629.

## Lead (TBR block, live-verified Nov 11 09:41 at threebestrated.in/music-schools-in-amritsar-pb, business detail link /aim4music-academy-music-schools-amritsar-pb-fDtB4)
- Name: Aim4Music Academy. Address: H.no-77, Continental Estate, Fatehgarh Churian Road, near DDIS School, Murad Pura, Amritsar, PB 143001.
- Email dharamkoti123@gmail.com. Phone 97810 90402 (tel:+919781090402). No website link in the Contact block.
- Specialities (7): Singing, Guitar, Tabla, Violin, Piano, Drums, Dholak. Listing text (attribute "its listing says"): music education for learners of all ages, one-on-one guidance, private and group lessons, classes for beginners and experienced.
- OMIT: rating 4.8 (single number but keep omitted - listing score not needed), "Since 2011" (TBR label, uncorroborated), "2025 Highlights" label, hours (contradictory: "12am - 7am" ranges), "affordable prices", "highly trained instructors / industry expertise" (marketing, no sourcing), any promise.
- Dedupe clean Nov 11: Gmail allfolder dharamkoti123/aim4music = 0; in:sent music school = 1 (lasyamusical@gmail.com Nov 7, a different person); web_search own site: directories only (exa.ai, TBR, bdir.in, citybusinessdirectory, idbf.in).

## Direction (seed 745455316, drawn ONCE; full sheet in draw-v76.txt, original in direction.json; reprint with `draw.mjs --show --out .`)
NOTE: a second draw call with the same seed into a scratch dir (/tmp/d76, history-different) produced a different sheet ("The pinned poster") - DISCARDED, never used. Build from draw-v76.txt = "The name as a monument".
- Palette: --bg #ebe5e3, --surface #d7d0cd, --ink #2b2622, --muted #5f5652, --accent #0f7d45 (accent only on current-page link + one footer button + action per button pattern), --accent-ink #fff.
- Type: Funnel Display 500 (display/head) + Figtree 400/600. Steps per sheet section 3.
- Hero: colour-block collage, crossing headline (3 flat blocks: 62x55 ground top-left, 62x45 surface bottom-left, 38% full-height ink right; headline drawn once per ink, clipped copies aria-hidden; button in bottom-left block; pointer shifts boundaries up to 4%; no picture). Headline idea: "Seven instruments, one academy." (listing names 7 specialities).
- Nav: nav-large-centre-logo-shrinks (centred wordmark "Aim4Music" ~400px -> 120px over 240px scroll, 64px band; 2 links left, 1 link + action right; phone Menu left/action right). Hero headline is NOT the name so wordmark is OK.
- Buttons: display-face pill 56px, accent fill/white; hover swaps to ink fill/ground letters. Cards: dealt-deck (3-5 filled cards, angles -2.5/1.5/-1/2/-1.5, ink then surface). Corners 4px. Space: airy (section-gap clamp(7rem,12vh+7vw,15.75rem), margin clamp(1.5rem,4.5vw,4.5rem)). Pictures: one grade over every picture (slightly warm). No interactive widget; no video.
- Sections: list (poster lines) opened by scene seam-pocket-gathers-the-words -> gallery (4 photos round heading, drift) -> about = scene letter-physics -> cta inverted -> footer big-link-list.
- Motion: slow crossfade signature (the gallery/hero principal photo crossfade; hero has no picture so use gallery or a crossfade band); entrance already-there (no reveals below fold); small moves: mask-roll-swap (one paragraph on user action), late-word-slides-in (headline last word), rounded-tile-goes-edge (one picture tile).
- Photograph total <= 4 (gallery 4). Dealt "City at night" set does NOT fit a music school: source instrument/music-room photos via assets.mjs instead (no people, no brands, no readable lettering); credit all in the Image credits dialog; illustrative label with each photo.
- Redraws used: 0 of 2.

## Content plan
- Scene seam-pocket words (<=14 chars, listing-sourced, 11): singing, guitar, tabla, violin, piano, drums, dholak, beginners, all ages, one-on-one, group lessons. Heading: "what is taught" style 2-5 words; one sentence <=30 words.
- List poster lines (4-7) = instruments with a small right-hand fact from the listing (e.g. "private or group").
- Letter-physics: claim "Pick up an instrument." answer "Beginners welcome, as listed." (check length limits).
- CTA inverted headline 3-5 words echoing hero, enquiry-only caveat near every contact action; footer disclaimer "Concept preview. Enquiries only, not a booking service."; footer links to this page only + email/phone/city; credits behind one "Image credits" dialog.
- Claims attributed to the listing; no promise, no teaching-outcome claims, no names of teachers; no people photos.

## Remaining steps
1. Source 4 photos. 2. copy base.css/base.js + stage + seam-pocket + letter-physics scene assets from /tmp/taste-skill/skills/taste-skill/assets (checkout f2d1470~1 if wiped). 3. write index.html/style.css/app.js. 4. lint 0 FAIL; inspect (--widths 1440,390, timeout 105) 0 FAIL; scenes.mjs + eyeball. 5. deploy via vault deploy-key recipe, curl-verify. 6. ledger A1629 preview_live + G165 PREVIEW; RUNBOOK; pixel packet to parent (no count-ups!). 7. email ONLY after parent clearance + fresh gates (subject "your music school has no website so i made you one", V73 template, one link, to dharamkoti123@gmail.com).

## BUILD RESULT (Nov 11 ~09:55 IST)
- Built: index.html, style.css, app.js, base.css/js, assets/scenes (stage, seam-pocket-gathers-the-words, letter-physics), 3 photos (piano, violin, guitar). lint 0 FAIL. inspect 1440/390: 0 FAIL, 5 WARN defended: size-count (dealt scale + nav/card steps), hero-void (hero blocks are dealt flat colour, lead line sits in the ground block), section-air 74px (gallery drift), surface-count (dealt hero blocks use surface), blank-gap mobile (hero bands).
- scenes.mjs: both scenes run, 6 empty-steps WARN (dark-ground scenes, defended: ink stage by design).
- Headline: desktop "Singing to dholak, / seven classes." (listing-sourced: 7 classes; crosses the ink-block edge); mobile "Seven classes, / one academy." (3-line wrap otherwise).
- Wordmark ~270px at 1440 (not 400): at 400 it ran into the ink block and lost letters. Mobile hero lead shown above bands.
- Dropped moves (no fitting host section / unsafe overlap): late-word-slides-in (would overlap the hero button), mask-roll-swap (no state change), rounded-tile-goes-edge (no tile), slow crossfade (only 3 photos and no hero picture). Card deal animation removed (inspector: text-over-text). Entrance already-there, nothing below the fold.
- Photo budget 3 of 4. Fourth slot to type. Guitar photo title says "Russian ... seven steel strings"; used only as "a guitar", labelled illustrative.
- No figures, rating, hours or "since" claims on page. Static.

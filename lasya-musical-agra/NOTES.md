# V68 Lasya Musical, Agra — build notes (started Nov 7 18:43 IST)

## Business facts (TBR block re-verified LIVE Nov 7 18:42, bus2 block only)
- LASYA MUSICAL, 4.8 score, 7+ years on TBR, since 2015
- 2, Upper Ground Floor, Rohini Royal Complex, Shastri Puram Road, Opposite Ratan Heera Resort & Garden, Near Paschimpuri Police Choki, Agra, UP 282007
- Speciality: Electric Guitar, Vocal Classes, Keyboard Classes, Piano Classes, Singing, Music Theory Classes
- "high-quality musical education... highly qualified teachers offering private instruction tailored to individuals of all ages, skill levels, and musical styles. one-on-one lessons and a variety of group lessons... diverse music classes covering a range of musical instruments... personalised instruction"
- Contact: lasyamusical@gmail.com, +91 89791 66716
- Hours: Mon-Fri 8:30am-1pm|3:30pm-9:30pm; Sat 9:30am-1pm|3:30pm-9:30pm; Sun 9:30am-9:30pm
- NO external website link near block; independent web_search = directories + YouTube channel only (no own site)
- Dedupe CLEAN: Gmail allfolder 0, in:sent 0, ledger only harvest row A1338 (candidate-qualified-handed-to-ready), repo clean
- Source row: nowebsite_ready V68 (row 157), status UNSENT. Ledger next free row: A1621

## DRAW (once, Nov 7 18:43:44 IST = history 13:13:44Z, seed printed 1036617785, sector music)
Direction: THE CONTACT SHEET. Full dealt ids from history entry 2026-11-07T13:13:44.307Z.
NOTE: draw.mjs is NOT seed-reproducible across processes (verified: same --seed gives different sheets; --out overwrites). Original draw had no --out; dealt ids recovered from ~/.taste-skill/history.json, canonical part texts from library/*.json + library/patterns/*.json (saved to v68-parts.json). Frame §0 texts (nav/footer/cards/buttons/corners/space/pictures/interactive/video) captured verbatim in transcript from the original print. Do NOT run draw.mjs again for this build.

## Dealt spec
- Palette soot-pale-lime: bg #0f0f0f, surface #1a1a1a, ink #fff, muted #8f8f8f, accent #dafa9c (accentInk #0f0f0f); fields: white #fff/#0f0f0f and lime #dafa9c/#0f0f0f. Note: soot-black opening+close bracket white middle sections; lime = single action colour (buttons + at most one headline on dark).
- Type (verbatim from original sheet §3): League Spartan ONE sans family; 1.25 scale from 16px body; six steps small/body/lead/sub/head/display; display 300 sentence case tracking -0.026em leading 1.04 ~5.8vw@1440; section headings weight 500; load wght@300;400;500;600 via Google Fonts. Ladder pattern type-very-tight-sans-display-ladder = guidance (tracking is signature; phone x0.4).
- Frame: nav-four-corner-hud (4 fixed corner tabs: wordmark TL, Menu TR, action button BL, Top BR after 1 screen; full-screen ink menu sheet; phone: no BR); footer stepped-close (two flat colours square stair ~85svh; closing line 4-7 words + dealt button; 3 link groups on high step; wordmark+legal on low step incl Image credits link); cards one-panel (one large filled panel 8-10 cols); buttons btn-tag-cut-corner-invert (56px ink tag, 10px diagonal cuts top-right+bottom-left via clip-path, hover -> accent fill; second action = surface-tone tag); corners 10px (--radius); spacing standard (--section-gap clamp(6rem,9vh+5vw,11.25rem), --margin clamp(1.25rem,3vw,3rem)); pictures natural; interactive NONE; video one-clip ONLY if honest clip exists (likely none - no honest licensed clip of a music school without people).
- Hero lit-strip-four-corners: near-black field, ONE horizontal photo strip 34vh (mobile 46vh) across vertical middle, 11+ frames natural width 10px gaps square corners, flex row wider than viewport, edge frames cropped by screen edges; centre frame full brightness, others brightness(0.55), brighten on hover/near centre; title of centred frame under it at 14px left-aligned; corners: name TL (14px medium), one link TR, one sentence BL (max 36ch/60 chars), action text-link BR; top+bottom quarters stay empty dark; strip scrolls sideways overflow-x auto + scroll-snap, never hijacks vertical scroll. Hero motion: drag-row.
- Sections order: list -> gallery -> about (scene) -> cta -> footer(as section 0).
- list = list-poster-lines: 4-7 items one per line at clamp(64px,10vw,150px) display weight lowercase, leading 0.92, flush left 20px margin on flat field; one detail per item at right margin same baseline 18-20px tabular figures; hover swaps ink to accent; no heading; 80px top/bottom; mobile 15vw items, detail beneath at 15px. CONTENT: the 6 classes (Electric guitar / Vocal classes / Keyboard / Piano / Singing / Music theory) + details (e.g. hours slots or "all ages" - listing facts only).
- gallery = sec-photo-pair-with-split-caption-below: two near-square photos cols 1-6/7-12, 24px gutter, 10px radius, 6% inner parallax; under each a two-column caption (title lead step 2 lines from left edge + body line from midline); captions UNDER photos never on them; hover zoom 1.03; phone stacked 4:5.
- about = scene dot-becomes-the-full-stop (record in v68-parts.json - READ IT before building).
- cta = "the footer's closing line" per sheet table + scene line-carries-colour-swap (record in v68-parts.json - READ IT; likely belongs to cta/list).
- Motion index-preview: rows of text navigate the work; hovering a row brings its image in ONE fixed frame, dims other rows; 240ms crossfade; touch = image inline. Applies to the contact-sheet body (composition: sheet of thumbnail rows under the hero; hovering a run dims others + shows one-line description fixed).
- Entrance line-blocks: solid blocks slide off each headline line (max 3 lines, breaks fit one line down to 360px); below fold: rows step in (data-reveal="rows", 40%->100% opacity, first four 60ms apart).
- Moves: mo-text-mask-roll-swap, mo-scale-rounded-tile-widen, mo-parallax-word-slides-into-line (records in v68-parts.json - READ before use; house rule: effects must settle to plain readable text - parent's standing ruling).
- Photographs dealt: "City at night" set as atmosphere (photoNight record in v68-parts.json; photoIds d368, c710, 797, 195, 232, 220, 579, 171 - resolve via assets.mjs/Commons, verify licenses; Agra night preferred if honest licensed shot exists).

## Composition plan (contact-sheet idea, honestly adapted)
"On this page, the six classes on Lasya Musical's listing become the contact sheet."
- Hero: dark field + lit strip of ~12 instrument/practice frames (Commons, licensed, no people/brands/marks) + corner texts (name TL; "Menu" or email link TR; sentence BL "Music classes in Shastri Puram, Agra, since 2015." ; action BR "Ask about a class").
- Sheet body: runs of small frames grouped by class (6 runs x ~4 frames = 24), each run preceded by its title in small text; hover a run -> others dim + fixed-position one-line description (index-preview). ALL frames labeled illustrative (visible label WITH photos per parent ruling - one standing label per run area or on-hover caption line, NOT footer-only).
- list section: the six classes as poster lines + right-margin detail.
- gallery: photo pair (2 best frames) with split captions below.
- about: scene dot-becomes-the-full-stop + school facts (since 2015, one-on-one + group, all ages/styles - attributed to listing).
- cta: closing line + email action; footer stepped-close with contact (email, phone, address, hours), sections, Image credits dialog, disclaimer "Concept preview. Enquiries only, not a booking service."
- Video: NONE (no honest clip). Interactive: none.

## Photos needed (~24 small + hero strip shares pool)
Instruments/materials: electric guitar, acoustic guitar, keyboard, piano keys, microphone/vocals, sheet music/theory, drums?, harmonium?, metronome, amp/cables. Commons search via assets.mjs; every frame: license-verified (CC BY/CC0/CC BY-SA ok w/ credit in dialog), NO people/faces, NO brand logos/maker marks (headstocks!), natural colour, re-view every final crop.

## Gates order
photos -> build index.html/style.css/app.js (+base.css/base.js from V67) -> lint 0 FAIL -> inspect FILE target 0 FAIL -> eyeball 1440/768/390 REAL screenshots -> commit + RUNBOOK §7 -> push (normal publication allowed) -> observe run -> live-verify (curl 200, instinct=0, noindex, disclaimer, mailto count, byte-match) -> live screenshots -> ledger A1621 (truthful status) -> report [Batch] with screenshots. NO email without parent pixel clearance (precedent V3/V67) - build+deploy+verify only, then report.

## Photo progress (Nov 7 18:55)
- /tmp/v68photos/*.json = search pools (refs inside .sources[].items[]; license field = .license or .licenseCode - CHECK per item)
- /tmp/v68photos/picks/ = 12 downloaded candidates + credits.json: tabla-hd, the-tabla-is-a-percussion-instrument-a, cross-stringed-piano-inside, a-close-up-view-of-a-digital (synth), practice-pad-with-metronome, metronome-november-2020, electric-guitar-neck-frets-and-strings, string-7158140832, a-close-up-photograph-of-piano-keys, piano-keys-close-up, music-sheet, a-tuning-fork-placed-on-sheet-music. NOT yet visually reviewed for marks/people.
- /tmp/v68photos/lib/ = dealt library photos: d368 REJECTED (person), c710 old-stone-wall-at-night (usable as atmosphere if it fits honestly).
- STILL NEEDED (~12 more): vocals/microphone without brand (Neumann/AKG rejected), guitar body without brand marks, amplifier/knobs, audio cable, drum (non-logo), music-book/lesson, harmonium (museum shots ok?), Agra-at-night atmosphere (search "agra night" / "taj mahal night" - people-free), headphones, violin/flute optional variety.

## PHOTO DECISIONS (final, 19:41 IST)
REJECTED: metronome-november-2020 (NYC bldg), string-7158140832 (blurry fabric), details-of-a-classic-guitar-amplifier-showing (JTM brand), practice-pad (Movement Drum Co + ProMark brands), the-tabla-is-a-percussion-instrument-a (face), agra-fort-railway-station (people), djembe-drum-from-gambia (person+Raiders), xylophone-pjt1 (people), guitar-pedals x2 (brand risk).
FINAL 18 (verify zoom done): piano dark low=a-close-up-photograph-of-piano-keys; piano side=piano-keys-close-up; piano inside=cross-stringed-piano-inside; synth=a-close-up-view-of-a-digital CROP y+14% (drop top text strip); tuning fork=a-tuning-fork-placed-on-sheet-music; score=music-sheet; mic crystal=astatic-crystal-mic (clean); mics crossed=studio-microphones-on-stand-51877280903; mic stand=tripod-microphone-stand; tabla=tabla-hd CROP bottom 72% (face/torso out); hanging drum=drum-stick; djembe=a-djembe-drum-ghana; guitar neck=electric-guitar-neck-frets-and-strings; headstock=slotted-headstock-classical-guitar; amp knobs=details-of-a-guitar-amplifier-showcasing-knobs (generic MASTER/PRESENCE labels OK); violin=violin-cord-arm-rosin-grains; flutes=severalbambooflutes CROP top 84% (drop white flute w/ V logo); taj=taj-mahal-agra-at-night.
RUNS: Guitar: neck,headstock,amp,+neck-crop2. Vocal: crossed,crystal,stand,+score. Keyboard: synth,piano-dark,piano-side. Piano: piano-side,piano-inside,piano-dark. Singing: crystal,score,tuning,flutes. Theory: score,tuning,violin,flutes. Hero strip 12: piano-dark,synth,piano-inside,guitar-neck,amp,crossed-mics,crystal,tabla,hangdrum,djembe,violin,flutes. Gallery pair: tabla-crop + hangdrum. CTA scene: taj + djembe. Credits: picks/credits.json + picks2/credits.json merged.

## BUILD STATUS (20:00 IST)
- index.html/style.css/app.js written; commit 1a1477e (local, NOT yet pushed).
- lint 0 FAIL 0 WARN. inspect FILE-target: 0 FAIL, 8 defended WARNs (size-count=dealt ladder; side-scroll+sideways-rail=dealt lit-strip; lopsided=contact-sheet direction; name-only-title=dealt hero sentence present; cropped-lettering=detail crops, no lettering; pinned-over-picture=dealt lcs scene; dead-scroll=dealt dfs lone-dot opening beat).
- Post-inspect5 small changes NOT yet re-inspected: btn now lime/soot (palette: every button lime); phone hero stack restacked (note 178/sentence 138/action 92); hero cap hidden on phone; dfs claim column-gap 0.24em (was rendering "Everyagecanstart." - flex ate the spaces).
- Photo allocation final: large slots exclusive (gallery tabla+hangdrum; lcs taj+djembe); small frames ≤2 uses each. 19 assets in assets/.
- Eyeball DONE: desktop fold/70/page-01/page-02 + mobile fold of inspect5 build. Looked right except the fixed bugs above.
- NEXT (21:40 cron): (1) re-run inspect FILE target -> confirm 0 FAIL after the 4 small changes; (2) re-eyeball mobile fold + dfs claim + a white-chapter button shot; (3) push via vault deploy-key recipe; (4) observe run; (5) live-verify (curl 200, instinct=0, noindex, disclaimer, mailto count, byte-match); (6) live screenshots 1440/768/390; (7) RUNBOOK §7 entry; (8) ledger A1621 truthful status; (9) report [Batch] with real full-size screenshots - NO email without parent pixel clearance.
- 20:01: PUSHED 1a1477e to origin/main (80b60da..1a1477e), deploy run started - NOT yet observed/verified. inspect6 (post-btn/phone/gap fixes) = 0 FAIL, same 8 defended WARNs. New inspect shots in /tmp/v68inspect6 (mobile fold + dfs claim spacing NOT yet re-eyeballed - do at 21:40 with the live shots).
- 20:02: deploy run 42382015368 in_progress for 1a1477e - observe at 21:40 wake.
- 21:46: V68 COMPLETE through preview_live. Runs 42382015368+42390192669 SUCCESS. Live-verified 21:44 (200/noindex/instinct=0/disclaimer/mailto=6/byte-match). Live screenshots eyeballed (fold, gallery, lcs t58, dfs t85, footer, mobile fold). RUNBOOK §7 committed 57368c0 + pushed. Ledger A1621 = preview_live. Inbox: 0 replies/DSNs across all 20 sends. [Batch] report sent 21:47. NEXT: email only after parent pixel clearance; then normal loop (V69 Trishiv Chinese Ahmedabad is next harvest row but I own the pick).

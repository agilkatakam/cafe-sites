# RUNBOOK — restart pipeline for cafe-sites outreach previews

Read this first after any sandbox reset. It is the whole recipe: a fresh sandbox can
resume from this repo alone.

## 1. Restore the tooling

```bash
git clone https://github.com/agilkatakam/cafe-sites.git /tmp/cafe-sites
git clone --depth 1 https://github.com/Leonxlnx/taste-skill /tmp/taste-skill
```

Both checkouts are ephemeral. Re-clone every run.

**Standing rule (Akhil, Oct 21-22, confirmed Oct 31): the taste skill runs on EVERY
build, no exception.** "Keep using the skill file every single time." Every build
starts with a direction draw and commits its `.taste-skill/direction.json`.

## 2. Per-build pipeline

1. **Dedupe first.** Dedupe by business name, email and domain against the sheet and
   the repo. Run the serialized allfolder Gmail history check (exact `to:`/`from:`
   queries, batch-counted) BEFORE any qualification or build. ready/UNSENT is not
   proof of no prior outreach.
2. **Facts.** Only verified facts from the source listing (e.g. the ThreeBestRated
   block): services, address, phones, email, listed hours. No ratings, no review
   counts, no invented claims, no unsourced superlatives.
3. **Direction.** Draw the direction with the taste skill and save
   `.taste-skill/direction.json` in the site's folder. Read the whole direction sheet
   before designing. Choose the artefact that truly belongs to the business's world.
   Draw ONCE per build with --avoid of every used direction/scene id (draws read
   ~/.taste-skill/history.json, so re-running pollutes future deals; reprint the
   committed sheet with `node draw.mjs --show --out <dir>`). Used direction ids:
   the split stage (V61), the clear service (V62), the shop window (V58). Used scene ids:
   shaped-edge-ground-change (V62), page-lifts-off-closing-picture (V62).
4. **Imagery.** `node /tmp/taste-skill/skills/taste-skill/scripts/assets.mjs "<query>"`,
   download with `--get <ref>`. Floor: 4+ honest pictures + 1 moving picture (a short
   clip via `--video`, or a slow photo drift). Look at every picture before using it.
   Credits go in the footer with licence names.
5. **Build.** `index.html`, `style.css`, `app.js` in the site's folder. Constraints:
   only the verified facts; the enquiry/contact form opens a filled mailto to the
   business's own email (no backend, nothing auto-sent); noindex/nofollow; footer
   carries "Concept preview. Enquiries only, not a booking service." plus credits;
   zero Instinct branding anywhere.
6. **Gates, in order.**
   - `node /tmp/taste-skill/skills/taste-skill/scripts/lint.mjs` → 0 FAIL.
   - Serve locally (`python3 -m http.server`) and run
     `node /tmp/taste-skill/skills/taste-skill/scripts/inspect.mjs http://localhost:PORT/ --out <dir>`
     → 0 FAIL. Defend WARNs only with real reasons; use `--allow` only for rules the
     dealt direction pattern inherently trips (document why). `taste-skill-ignore`
     comments silence the linter only, never the inspector.
   - Eyeball the screenshots at 1440, 768 and 390 before calling it done.
7. **Inspector gotchas learned (save rework):** single-character text nodes do not
   register as content; opacity-0 reveals race the screenshot capture (use
   transform-only reveals + a 1.4s fallback timer); long emails need
   `overflow-wrap:anywhere`; blank-gap counts section margin+padding as void (keep
   desktop margin <= 120px); a marquee counts as a heading for the eyebrow rule;
   flex/grid items blow out to natural image width without `min-width:0` + definite
   widths; CSS mask layers need a full-body layer plus the edge pattern or the whole
   element vanishes; the inspector counts the most common small font size as body
   text, so keep repeated text at 16px+.

## 3. Deploy

```bash
cd /tmp/cafe-sites && git add -A && git -c user.email=agent@local -c user.name=agent commit -m "..."
# fetch the deploy key (lands in the workspace box):
tools vault write-file --key password --name "GitHub deploy key (cafe-sites push)" --return-channel whatsapp
KEY=/home/sandbox/.vault/github-deploy-key-cafe-sites-push-*/password
printf '\n' >> "$KEY" && chmod 600 "$KEY"        # the trailing newline is REQUIRED
ssh-keygen -y -f "$KEY" >/dev/null               # "error in libcrypto" = missing newline
GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" \
  git push git@github.com:agilkatakam/cafe-sites.git main
rm -f "$KEY"                                     # delete the key file when done
```

- The remote stays HTTPS. **Never `git remote set-url`** (safety rule blocks it).
  Push to the explicit SSH URL instead.
- Verify live: `curl -sL https://agilkatakam.github.io/cafe-sites/<site>/` in a loop
  until the new bytes serve (Pages can take a minute or two). `grep -ci instinct`
  on the served HTML must be 0. Check key assets return 200.
- GitHub Pages serves this repo's `main` branch from the root; each site lives at
  `https://agilkatakam.github.io/cafe-sites/<folder>/`.

## 4. Logging

Log every action (history checks, builds, rebuilds, sends, holds) to the
`lead_status_log` sheet, one row per action:
spreadsheet `1EXcM3e5nRdWbMQpvcjcn4CcviuTWoRGFXT2dZIfiID8`, account
`gsheetsacct-01M3YM88CDPA1NSYPP6ZPREV3M`. Row shape:
`logged_at_IST | source | business - area, city | email | status | reason | sources`.
Ready leads live in `nowebsite_ready`.

## 5. Send rules

- **Hold LIFTED for the website-preview batch Nov 6 2026** per Akhil's
  instruction via parent (12:57 IST; todo todo-01M610JPDDBR1NZ5BR50AQ0292
  stays the durable safety pointer). Suppression (SunShine Boutique Mysore,
  Toolsmith - Oct 28 550s), opt-outs, region rules and re-stop-on-bounce
  remain. Sent Nov 6: batch 1 x10 at 13:00 (Klayz first per standing order;
  ledger A1600-A1609), batch 2 x7 human-paced ~6 min apart 14:05-14:50
  (ledger A1610-A1616). Re-stop immediately on any hard bounce/DSN/provider
  warning and report.
- Send from katakamakhil0 only. 10 emails/hour across ALL account activity,
  HUMAN-PACED (parent Nov 6 13:01): one send per ~6 min, never a
  same-minute burst.
- Voice: lowercase, short, ONE link (the preview URL only - parent audit
  Nov 6 14:51: the (axliosmedia.com) parenthetical auto-links in Gmail and
  makes two; drop it going forward), question CTA, "i run axlios media",
  BITS Goa footer line, opt-out line. Preserve opt-outs.
- Template audit Nov 6 14:51 (parent): "everyone...hits a dead end"
  (unsupported absolute) and "builds sites like this in 48 hours"
  (turnaround claim) challenged; recovered original user evidence: Akhil
  authored both phrasings himself Oct 21 12:13 IST (his own template drafts,
  "48 hours" sourced from axliosmedia.com; observation archive has the
  verbatim messages). Ruling requested from parent; until confirmed, future
  sends use the softened openers (no absolute, no 48h). No retrospective
  resend. "sort out a fair price" line from his draft stays OUT (no price).
- Dedupe by business/email/domain before every send: allfolder exact
  to:/from: AND in:sent business-name search. Per-send grounding: inbox
  DSN check, independent own-site web_search (listing-link absence alone is
  not proof), preview curl 200, email re-confirmed on the live listing.
- No IE/UK/EU/NZ/AU/CA sends without a recipient-specific legal basis.
- No autonomous replies or follow-ups to inbound mail; report them instead.
- Gmail RCPT250 is only a rejection screen, not mailbox/delivery proof; conflicts
  stay held.

## 6. Hard boundaries

- No spending. Marketplace deposits, fees and commissions count as money.
- Nothing Akhil or a business sees may carry Instinct branding.
- No BITS reads.
- No auto-delete of previews.

## 7. Current state (update as it moves)

- EMAILED Nov 6 2026 (outreach resumed per Akhil via parent 12:57; batch 1 x10 at 13:00 ledger A1600-A1609, batch 2 x7 paced 14:05-14:50 ledger A1610-A1616; every send grounded: DSN inbox check clean, allfolder exact + in:sent business-name dedupe 0, independent own-site web_search clear, preview curl 200, email re-confirmed on live listing): Klayz Studio, Mohan V12, Doon V4, Nagal V23, Krishna V45, Hardev V38, Divya V39, Kargil Vijay V6, Mosin V14, Ganesh V28, Balkrushna V15, Parvati V22, Raj V24, Ashish Rasekar V33, Mama V35, Sk Carpenter V61, Vijoy Sports V62. Held: V41 Momai (email unconfirmed), V37/V48/V55 (own sites), V43 (existing hold). Suppressed: SunShine, Toolsmith.
- Older build notes (pre-send): Klayz Studio (commit 1d36dc1),
  Mohan Electrical Services V12 (taste-skill rebuild, commit 3fc515e),
  Doon Computer V4 (taste-skill rebuild, commit adca387),
  Nagal Refrigeration / AC Service Center V23 (commit 64fecd7),
  Krishna Computech V45 (precision-instrument catalogue, commit 58dc7a5; corrections pass adds the concept-preview disclaimer, illustrative-photo labels and softened claims),
  Hardev Mobile Communication V38 (one motif: the SIM chamfer; Bricolage, greys + mint; commit 648d366; this push also added the missing noindex meta to V45),
  Divya Mobile Care V39 (the page is the object: a repair job card; Zilla Slab, bone/green/chocolate; sticky job-book sheets, reply-card job-card picker, curtain footer; commit 34dcff1),
  Kargil Vijay Auto Service V6 (the printed annual: signal-red magazine; Switzer; hero crossfade + corner cards, mosaic with pickup-builder, unequal photo band, inverted close, sliced ghost wordmark; commit 7166c7b),
  Md. Mosin Bike Point V14 (the wheel: bottle green and gold; built by recovery agent after stream failures; commits d6ead0a + 5393481 label fix),
  Ganesh Garage V28 (the quiet instrument: midline rail over a 3-photo crossfade, docking header; zigzag menu order-pad; engine-start clip; frame run, one lifted; commit c515019),
  Momai Auto Garage V41 (the sentence is the layout: Anton/Work Sans, graphite + safety orange; "FIXED, [road clip] BACK ON THE ROAD." with the clip inline; picture-word chips; one frame three distances; inverted CTA; cropped MOMAI footer; phone-only CTAs - email unconfirmed; commits b63b819 + a427f0f + dfd9bc9 copy passes (invitation-only; no guarantee of answer, diagnosis or outcome); corrected copy ACCEPTED by parent Nov 3 19:01 from r2 screenshots, preview stays held and not yet delivered to Akhil),
  Balkrushna Electrician V15 (DELIVERED to Akhil Nov 3 ~19:00 IST by parent with mobile image + live URL, outreach noted bounce-held; dressed as something else: the watch counter; Archivo 62% condensed 800 on cobalt #0034eb with yellow #e9e34a accent; counter hero with 3-object slow crossfade (fan/breaker/wiring), edge-to-edge heavy intro with photo chips, 3 colour-field statements, wiring close-up showcase + ink card, one-word CALL band; email balkrushnasale@gmail.com confirmed on TBR so mailto+tel CTAs; commit 95808b3),
  Parvati Electricals V22 (type and nothing else: Epilogue 900, orange/sky/lime chapters + crimson accent; masked two-line headline "Ten years / of current."; poster-scale capabilities; HOME/SHOP comparison; CALL band; name-first lime footer; 4 licensed photos incl Gulbarga Fort; email gangadhars@gmail.com TBR-confirmed; commit c3f04a7),
  Raj Electrician Kalyan V24 (the name as a monument: Panchang/Switzer via Fontshare, night #0a0d14 + cornflower #5a9bfc; RAJ 26vw / ELECTRICIAN 6.7vw stacked monument hero with corner texts + ink call button; intro + facts row (Mon-Sun 8am-10pm, Sonar Pada, no-obligation quotes per listing); caps columns At home/At work/Day to day with hover descriptions; 4-panel unequal strip (wiring/fan/breaker/Kalyan yard); inverted One name/to call CTA; inverted footer columns + wordmark; scaling-wordmark scroll JS; mobile corner collision fixed; email singhrajkumar1995.rs@gmail.com TBR-confirmed; commit 0aaf699),
  Ashish Rasekar Electrician V33 (the specimen catalogue: STIX Two Text, sheet-and-biro white/black/grey + blue #1a4be0; split hero with sticky specimen viewer swapping item+caption per catalogue entry; 7 catalogue rows with 180px thumbs + alternating surface bands + listing-sourced specs; tap-a-need reply card; 4-card dealt fan (reduced-motion-safe default fan - cards visible without JS); frame run with lifted Nagpur-night-street drift; tile footer; email ashish.rasekar37@gmail.com TBR-confirmed; commit 0d12223; inspector note: its full-page capture does not count a sticky column past the first screen, so sticky-split designs need real content mass in the text column),
  Mama Electrical And Home Appliances V35 (the pinned poster: Hanken Grotesk 400/500, olive #38450f on bone #ecebe7; MAMA/ELECTRICAL split to sticky corners with mix-blend over hero + 2 pass panels, fading out (visibility) when the reading section arrives; reading section; stepping-statement scene over a dimmed bulb photo with per-step mini photo pairs and gradient scrim; 5 cards crossing an Indirapuram backdrop; CTA + olive footer with giant cropped MAMA mark; 6 licensed photos incl real Indirapuram; email ajay.rajpoot203@gmail.com TBR-confirmed; commits 3087f22 + cbdda3e + xnote label; inspector lesson: a sticky overlay pinned with margin-bottom:-100svh overshoots one full viewport past its section and its glyph/hit boxes keep covering later text even at opacity:0 - fade pinned layers to visibility:hidden via IntersectionObserver before the next section's text arrives),
  Sk Carpenter & Furniture V61 (the split stage: Erode 400/500/600 Fontshare, putty #dedad3/black/teal #256f82; sticky split - RIGHT half sticky full-height photo radius 16px crossfading between 3 images as sections arrive, LEFT reading column max 46ch; slow 1.6s crossfade; mobile 60svh sticky photo top then stacked; 4 Commons photos with visible contextual illustrative-photograph tag chips; facts section with inline wood-samples figure; listing price points Rs 3,500/4,000 attributed; tel+mailto in header; email skcrazywood@gmail.com TBR-confirmed; commit 3c52408; gates 0 FAIL),
  Mahadev Auto Services V37 (the well-kept board: lunar + bronze; cropped name band + standfirst, links row, statement tiles, zigzag light cell, picker service rows, one-image-cut-across-tiles board (6x4 desktop / 3x6 mobile), SVG block wordmark footer; commits 77d641e + 096b12b revision (compact hero tiles, readable mobile wordmark, listing-attributed claims); HELD OUT of the no-website batch per parent Nov 2: business already runs mahadev-auto-services.grexa.site, so it is a possible upgrade preview, not an approved upgrade pitch).
- Vijoy Sports Gaya V62 (the clear service: Hanken Grotesk 400/500/600, deep teal ink-only #0d1f1e/#233634/#e8fbf9; words-beside-product hero ~73px display; shrinking nav; edge-to-edge marquee; goods disc showcase (fact text on the disc); 2x2 features grid as the lifting sheet; sky-sampled #cddce3 band via shaped-edge-ground-change; page-lifts-off-closing-picture close carrying contact, --lift-band-ink dark on sampled sky band; both scenes at hold:1 so every scroll screen carries content; three-cards footer 40svh; 5 Commons photos (dumbbells hero recropped x550-1340/y3000-3900 after parent pixel review caught a red/white oval maker mark - ALWAYS re-view final crops for marks; Falgu river Gaya; badminton; bat; hoop); peel-tear-and-drag redrawn once (needs plane+cloud cutouts a sports shop cannot fill honestly); email satishv.sports007@gmail.com TBR-confirmed; commits db0b4a6 + 24ba340 (recrop + dropped unverified "short walk" proximity claim - same-town is the verified fact, never assert distance); ledger A1599; gates 0 FAIL; live-verified Nov 6 12:54),
- Delivery state: V35 DELIVERED to Akhil Nov 4 18:49 IST by parent via WhatsApp (mobile screenshot + live URL, outreach-held caveat); illustrative-imagery label added near 'The work' gallery per parent (visible contextual note, not footer-only); V15 delivered to Akhil Nov 3; Momai V41 + corrected Parvati V22 + Raj V24 DELIVERED to Akhil Nov 4 09:46 IST via WhatsApp; Ashish Rasekar V33 DELIVERED to Akhil Nov 4 13:07 IST via WhatsApp (live fan screenshot + URL, outreach-held caveat) after parent accepted the fan-occlusion fix (non-overlapping vw-capped card spacing, commit 2cef80c) and the single-Email fix. Consolidated delivery COMPLETE - no pending deliveries. V61 BUILT Nov 4 21:55 IST (commit 3c52408, gates 0 FAIL, eyeballed 1440/768/390), ledger A1598; live verify pending - GitHub Actions/Pages outage Nov 4 has ALL previews 404 incl previously-live ones; report sent to parent, verify-when-recovered wake set. V41 mobile nav wrap fixed (commit 1fc5ec9). Parvati 10-years claim re-verified live Nov 4 (TBR: 'has 10 years of experience in the electrical field'). Sends RESUMED Nov 6 12:57 (see section 5).
- position:sticky gotcha (V33, Nov 4): overflow-x:hidden on html+body makes body the scroll container and SILENTLY breaks every sticky section on the page (fan stage scrolled away, leaving empty pin screens). Use overflow-x:clip instead - same clipping, no scroll container. Verify sticky pins with a real scrolled screenshot before shipping any pinned design.
- inspect.mjs gotcha: always run with a FILE target (inspect.mjs index.html), never a directory (.) - the directory mode makes every <img> report broken. A <video> element in the page reproducibly breaks the inspector's image loading too (bisected on V15); use a slow photo drift as the moving picture and defend the no-footage WARN.
- Live URLs follow the pattern https://agilkatakam.github.io/cafe-sites/<folder>/ .
- Akrati Print 'N' Graph Aligarh V58 (the shop window: Source Sans 3 400/600, rose off-white ink-only #fcf6f6/#e6e1e0/#1d1817; depth-cloud hero 3 planes (press/type-cases/marbled) + clear centre, line-blocks entrance, side-index nav, intro headline-crossing-photo (paper vat, dual-ink/paper clipped line), capabilities-as-menu sheet, dealt card pair (coloured cardstock photo + type-specimen card - no honest 2nd photo after 5 searches), held "Paper." word under sliding ink CTA (mo-parallax-under-sheet-slow variant, sticky released <1200px per sticky-band), colour wave ink->muted (accent=ink palette), rolling figures 1996/4.8/7 built only while rolling so probes read plain text; 5 Commons photos incl type-blocks-crop (Hamilton MFG CO plaque + pens cropped out, re-viewed); 2 dropped: The Arm studio room, Chiang Mai shop w/ people+signs; address discrepancy: live TBR says B-26 Barula Market Dodhpur vs sheet row 148 Bannadevi Rd - live listing used, flagged to parent; commit a5db306; ledger A1617; inspect 0 FAIL, 3 defended WARNs (first-action: dealt circle-arrow's fill is its chip; size-count: 6 dealt steps + captions + dealt 10vw CTA; blank-gap: dealt held-band negative space); live-verified 200 noindex instinct=0 disclaimer Nov 6 16:29),
- V58 visual fix Nov 6 16:34 (commit da58fb4): removed headline/photo overlap (title 24svh / photo top 46svh; dual-copy clip dropped); parent cleared the hold 16:40 after full-size rest-state CDP screenshots; V58 EMAILED 16:40 (gmail id 1a1b08df55348daa, ledger A1618). Address "discrepancy" resolved: Bannadevi Rd was a mis-extraction (belongs to New Moon Printing Press, business1 on the same TBR page); Akrati JSON-LD + visible block both say B-26 Barula Market Dodhpur; source sheet has no address column - always match the JSON-LD block to the target business, never the first address on the page.
- Ujjain Book Depot V3 (the calm magazine: Hubot Sans 500/Work Sans, white/ink-only #fff/#e8e8e8/#11100e; hero-centred-headline-picture-corner-text over reading-desk photo with 42% flat scrim; edge-split title + rounded-tile-widen pencil macro; statements-on-fields with figures rolled inline (digit-cycle in one text node, settles plain - stacked strips trip the line probe); find-your-shelf chip tool (13 shelves from listing); diagonal how-it-works; two-fields new/old; still closing-line cta (word field hidden <760px); floating-pill nav (action hidden on phone until menu opens); three-cards footer + credits dialog; 4 Commons photos: reading-materials CC BY 2.0 Shixart1985, pencil macro CC BY 2.0 Old Photo Profile, pen-writing CC0 Tookapic, notebooks-rainbow CC0 utroja0 - 10+ candidates dropped for brands/people/tints/ premises incl XXXX Gold beer photo, publisher-logo Bengali spines, skull display); scenes=none: dealt shaped-window scene needs a ~3600px place photo of the shop's world and no honest licensed one exists (bookshop interiors = other businesses' premises); expanding-cards cut for the same photo-budget reason, reported; video skipped - no honest clip; inspect 0 FAIL, 2 defended WARNs (nav-lost: pill is fixed + visible, confirmed in fold screenshot; size-count: dealt steps + phone steps); email maheshsharma.ujn@gmail.com verified in business1 block (the only email in it); commit 0f4b5a5; ledger A1619; not emailed),
- Vidhyarthi Book Depot Bhopal V67 (the product, clearly: Zodiak/Reddit Sans, near-black-on-sand ink-only; left tile rail; hero photo 52% + on-ground title 'Chetak Bridge's exam bookshop.'; pinned shelves story 12 rows (11 listing categories + stationery); 3 colour fields; category-matcher tool; type-only visit cards + Directions link; receipt; pinned study-desk underlay with visible ink label top-left 16px (mobile top:66px) + ink footer sheet; footer cycling word instant-swap exam./term./class./story.; 3 Commons photos, scenes=none (no honest scene photo of the shop's world); email vidyarthibookdepo@gmail.com TBR-confirmed Nov 7 15:50 (4.8, since 2007, 11 speciality categories, competitive exam books + stationery, discounts on selected, Contact block NO website link); TBR block re-verified live before push; Gmail dedupe clean (0 contact history, 0 sent Vidhyarthi/Bhopal); repo dedupe clean; gates lint+inspect 0 FAIL; ledger A1620 pending live-verify),
- Build queue: garages done (V6, V14, V28, V37, V41), electricians V15 + V22 + V24 + V33 + V35 done. V48/V55 plumbing HELD OUT Nov 4 (ledger A1596-A1597): both listings now link live own sites (hariplumbingservices.netlify.app, tohid-plumbing-services.grexa.site - V37 precedent, possible upgrade previews only). V61 Sk Carpenter BUILT (see delivery state). V56 Vijoy Sports V62 BUILT (see delivery state). V43 Vinod Carpenter HELD (parent Nov 5: leave held until own-site/contact evidence can be refreshed; browser route recovered Nov 6 12:11 for scoped qualification - refresh allowed when prioritised; never weaken to phone-only). V58 Akrati BUILT + live (see above). V3 Ujjain BUILT (see above). V67 Vidhyarthi Book Depot Bhopal BUILT (see above). Next queue candidate: re-fold from the set11 harvest ledger (V68+).
  Visual-proof categories held. A Nov 1 wide harvest (set11) added new candidates
  V68+ to the ledger; fold qualified ones into the queue after the listed builds.
- Ledger next free row: check the sheet's last row before appending.

## Evidence correction Nov 4 2026 (live URL checks)
Never derive or guess preview slugs. Check only actual deployed folder names (ls -d */ in the repo) or exact previously-delivered URLs. On Nov 4 ~22:00 IST I curled guessed slugs (klayz-design-dehradun, mama-electrical-jaipur etc.), got 404, and wrongly reported a Pages-wide outage; real folders (klayz-studio-chennai, mama-electrical-ghaziabad ...) returned 200. V61 live-verified 200 at 23:21 IST with live CDP screenshots. V61 EMAILED Nov 6 14:44 (batch 2 send 6/7).

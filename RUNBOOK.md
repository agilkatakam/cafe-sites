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

- **Sends are HELD behind the shared bounce-stop decision** (todo
  todo-01M610JPDDBR1NZ5BR50AQ0292) until Akhil explicitly decides. If lifted:
  Klayz Studio goes first (existing approval), then new-batch sends.
- Send from katakamakhil0 only. 10 emails/hour across ALL account activity.
- Voice: lowercase, short, one link, question CTA, "i run axlios media
  (axliosmedia.com)", BITS Goa footer line, opt-out line. Preserve opt-outs.
- Dedupe by business/email/domain before every send.
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

- Live, verified, unsent (send-held): Klayz Studio (commit 1d36dc1),
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
  Mahadev Auto Services V37 (the well-kept board: lunar + bronze; cropped name band + standfirst, links row, statement tiles, zigzag light cell, picker service rows, one-image-cut-across-tiles board (6x4 desktop / 3x6 mobile), SVG block wordmark footer; commits 77d641e + 096b12b revision (compact hero tiles, readable mobile wordmark, listing-attributed claims); HELD OUT of the no-website batch per parent Nov 2: business already runs mahadev-auto-services.grexa.site, so it is a possible upgrade preview, not an approved upgrade pitch).
- Delivery state: V15 delivered to Akhil Nov 3; Momai V41 + corrected Parvati V22 + Raj V24 DELIVERED to Akhil Nov 4 09:46 IST via WhatsApp (mobile screenshot + live URL each, bounce-held caveat, Momai no-verified-email limitation noted). Consolidated delivery COMPLETE - no pending deliveries. V41 mobile nav wrap fixed (commit 1fc5ec9). Parvati 10-years claim re-verified live Nov 4 (TBR: 'has 10 years of experience in the electrical field'). All sends remain bounce-held (no authorization change Nov 4 09:46).
- position:sticky gotcha (V33, Nov 4): overflow-x:hidden on html+body makes body the scroll container and SILENTLY breaks every sticky section on the page (fan stage scrolled away, leaving empty pin screens). Use overflow-x:clip instead - same clipping, no scroll container. Verify sticky pins with a real scrolled screenshot before shipping any pinned design.
- inspect.mjs gotcha: always run with a FILE target (inspect.mjs index.html), never a directory (.) - the directory mode makes every <img> report broken. A <video> element in the page reproducibly breaks the inspector's image loading too (bisected on V15); use a slow photo drift as the moving picture and defend the no-footage WARN.
- Live URLs follow the pattern https://agilkatakam.github.io/cafe-sites/<folder>/ .
- Build queue: garages done (V6, V14, V28, V37, V41), electricians V15 + V22 + V24 + V33 done - next: → electrician V35 →
  V48/V55 plumbing → V61/V43 carpentry → V56 sports → V58 print → V3/V67 book depots.
  Visual-proof categories held. A Nov 1 wide harvest (set11) added new candidates
  V68+ to the ledger; fold qualified ones into the queue after the listed builds.
- Ledger next free row: check the sheet's last row before appending.

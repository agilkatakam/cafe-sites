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
  Doon Computer V4 (taste-skill rebuild, commit adca387).
- Build queue: V23 Nagal Refrigeration/AC Bikaner → V45 Krishna Computech Bikaner
  (kcebkn) → V38 Hardev Mobile → V39 Divya Mobile Care → garages V6/V14/V28/V37/V41 →
  electricians V15/V22/V24/V33/V35 → V48/V55 plumbing → V61/V43 carpentry →
  V56 sports → V58 print → V3/V67 book depots. Visual-proof categories held.
- Ledger next free row: check the sheet's last row before appending.

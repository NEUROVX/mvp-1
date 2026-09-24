# Handoff — NeuroVX MVP-1 demo

**Last updated:** 24 Sep 2026 · **Branch history:** built on `claude/clever-hawking-7j7qra`, merged to `main` via PR.

## Done
- The design system is locked to DESIGN.md (Connected Care v1.0). The Tailwind v4 token block has the default palette cleared, and Inter is self-hosted.
- Shared foundation: component kit, 4 layouts, the care-episode state machine with 17 stages, the demo store with presets and `?demo=` deep links, and the presenter Demo control (in headers; it never floats over content).
- 51 routes are built: the public site (11 pages), Learn and NeuroLearn, onboarding, check-in and the assessment shell, booking and the visit hub, tests, records and the care plan, patient Home and Support/Access, the clinician workspace, the lab workspace and the research concept.
- Guards: `check:tokens` and `check:copy`. QA tooling: `scripts/qa-screens.mjs` (Playwright + axe) and `scripts/qa-routes.txt` (93 routes and states).
- Last full sweep: 93 routes × 1440/390/320 with **0 overflow, 0 console errors and 0 axe violations**.
- QA pass 1 was applied: public, Learn, onboarding and assessment fixes, plus layout fixes.

## Open work (in priority order)
1. **Finish QA passes 2 and 3.** Two QA agents were stopped part-way through. Their unverified edits are saved as [`docs/handoff/qa-pass-2-3-partial.patch`](handoff/qa-pass-2-3-partial.patch). They are **not applied**, and the patch covers 37 files in the patient app, clinician and lab areas.
   - Review the patch and apply the parts you agree with: `git apply --3way docs/handoff/qa-pass-2-3-partial.patch`, or cherry-pick hunks.
   - Two of its edits were cut off mid-change: `src/pages/patient/SupportPage.tsx` (explanation sizes and the nested case panel) and `src/features/lab/model.ts` (owner wording, and lab "today" following the booked slot). Check both carefully.
   - After applying, run `npm run check`, `npm run build`, and the full QA sweep at all three widths.
2. **Walk the cross-workspace demo end to end** in one browser tab. Start at `/pro/clinician?demo=booking-requested`:
   - Accept the request, then Order investigations.
   - On the patient side, choose providers, then book the collection.
   - In the lab, mark collected, then received, then processing, then Release report.
   - As the clinician, mark reviewed with a follow-up.
   - `/app` should say "Plan your next visit". Also test Simulate delivery failure and Retry.
   - At every stage, confirm that Home, the visit hub, tests, report, records and care plan agree, and that the clinician and lab views agree with them.
3. **Small known gaps** (from the agent reports):
   - Booking review saves only one flag for shared reports. A proposed fix is `share.uploadIds?: string[]` in `src/demo/types.ts`.
   - Visit hub: the "current time stays until the clinic confirms" line is lost on reload. A proposed fix is `booking.previous?`.
   - The clinician workspace belongs only to Dr. Kavya Rao, so the demo assumes you book her.
   - NeuroLearn matching is keyword-based, and unusual wording falls back safely to "save it for your clinician".
   - The mobile tab strip on the clinician record scrolls sideways inside its own region. This is intended, but worth a check.
4. **Optional:** deploy a preview to Vercel (the app is static and `vercel.json` is present), and user-test with the prompts in DESIGN.md › Prototype evaluation.

## Non-goals (do not build without a new decision)
Real authentication or a backend, payments, live availability, real maps, real uploads, scoring or NeuroRisk, hospital operations, a device store or checkout, trial matching, sponsor data access, notifications, and translations. See SCOPE.md §7.

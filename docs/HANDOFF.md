# Handoff — NeuroVX MVP-1 demo

**Last updated:** 25 Sep 2026 · **Branch history:** built on `claude/clever-hawking-7j7qra`, wrapped up on `claude/ecstatic-noether-4v7wj4`, both merged to `main` via PR.

## Done
- The design system is locked to DESIGN.md (Connected Care v1.0). The Tailwind v4 token block has the default palette cleared, and Inter is self-hosted.
- Shared foundation: component kit, 4 layouts, the care-episode state machine with 17 stages, the demo store with presets and `?demo=` deep links, and the presenter Demo control (in headers; it never floats over content).
- 51 routes are built: the public site (11 pages), Learn and NeuroLearn, onboarding, check-in and the assessment shell, booking and the visit hub, tests, records and the care plan, patient Home and Support/Access, the clinician workspace, the lab workspace and the research concept.
- Guards: `check:tokens` and `check:copy`. QA tooling: `scripts/qa-screens.mjs` (Playwright + axe) and `scripts/qa-routes.txt` (93 routes and states).
- QA pass 1 applied (public, Learn, onboarding, assessment, layouts).
- **QA passes 2 and 3 applied** from the saved partial patch (now deleted), after review:
  - Accepted: clinician feedback says what changed for the family; order states use DESIGN.md › Orders names; release, delivery and review stay separate; lab and clinician tones agree; lab stacked rows are one divided surface with named "Open order" links; clinician patient rows have named "Open record" actions; patient pages hide episode details when a helper has no record access; "View visit details" and "Book follow-up" labels match PATIENT.md; 18px patient explanations on Support and Access; research copy uses "Concept - not available in this preview".
  - Rejected and redone: the Home next-step override written inside `HomePage.tsx`. That broke the "Home copy lives only in `nextStepFor()`" rule, so the booked-collection copy now lives in `nextStepFor()` (`src/demo/episode.ts`), which receives `labBooking`.
  - The two cut-off edits were checked: `SupportPage.tsx` was complete; the case panel is now a canvas tint, not a nested card, and the urgent line was raised to 18px as well. `lab/model.ts` was complete; its "lab today follows the booked slot" logic is correct because every slot falls on or before the 09 Oct release.
- **Cross-workspace walk verified end to end in one tab** (Playwright, 0 console errors), both with the default slot and with a non-default one (09 Oct, 8:30 AM): booking-requested → accept → order → choose a provider and book → lab collected → received → processing → release → simulate delivery failure → retry → reviewed with follow-up. `/app` ends on "Plan your next visit". At every stage, Home, visit hub, tests, test progress, report, records, care plan, My care, clinician record and lab order agree.
- Inconsistencies found in the walk and fixed:
  - With a non-default collection slot, the patient side said "Collected 08 Oct, 9:10 AM" (before the booked time), and records, report and timelines used the fixture time. Now there is **one selector, `labCollectionFor()`** in `src/demo/episode.ts`, used by Home, My care, Test progress, the report, both timelines, the clinician record and the lab queue.
  - My care stayed at "Collection booked" while the lab had collected or was processing. It now follows the lab's progress, like the Tests page.
  - The clinician next-step panel said "Collection arranged" above an orders table that said "Processing". It now follows the lab's progress and names the booked provider.
  - The care plan named Example Diagnostics as the owner of the plasma assay. The owner is the reference laboratory, as in every other view.
- Small gaps closed:
  - Booking review now remembers each unticked previous report (`booking.share.excludedUploadIds`). Reports added later still join the packet. The visit hub and the clinician packet show only the shared reports.
  - The visit-hub line "current time stays until the clinic confirms the change" now survives a reload (`booking.previous`) and clears when the clinic accepts.
- **Final sweep (`qa/final`, against `npm run preview`):** 93 routes × 1440/390/320 = 279 captures, with **0 overflow, 0 console errors and 0 axe violations**. `npm run check` and `npm run build` pass.

## Known limits (by design, not bugs)
- The clinician workspace belongs only to Dr. Kavya Rao, and the lab workspace only to Example Diagnostics. If a presenter books another clinician or Example City Lab, the patient side is correct, but those workspaces still show their own queue.
- NeuroLearn matching is keyword-based. Unusual wording falls back safely to "save it for your clinician".
- On the clinician record at 390 and 320px, the tab strip scrolls sideways inside its own region. The page itself does not scroll, and the active tab stays in view.
- Home keeps "Your test visit is booked" throughout the Collection-arranged stage while the lab collects and processes. This is PATIENT.md's Home state table; test progress shows the detail.

- **Deployed to Vercel.** Project `neurovx-mvp-1` (team *Neurovx*) is Git-linked to `NEUROVX/mvp-1`, so every push to `main` deploys to production at **https://neurovx-mvp.vercel.app**. That URL is public. It was verified by HTTP checks on deep links and by matching the live JS bundle's SHA-256 against the local build of `main` that passed the sweep. PR preview URLs sit behind the team's Vercel Deployment Protection (login required).
- **Docs for people:** [`DEMO-SCRIPT.md`](DEMO-SCRIPT.md) (presenter script, click-verified) and [`LOCAL-GUIDE.md`](LOCAL-GUIDE.md) (setup, navigation, code map, QA, deploy).

## Open work
1. User-test with the prompts in DESIGN.md › Prototype evaluation, ideally with one care partner and one clinician.

## Non-goals (do not build without a new decision)
Real authentication or a backend, payments, live availability, real maps, real uploads, scoring or NeuroRisk, hospital operations, a device store or checkout, trial matching, sponsor data access, notifications, and translations. See SCOPE.md §7.

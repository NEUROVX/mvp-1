# NeuroVX — MVP-1 (demo)

**Brain care. Connected.** A clickable demo of NeuroVX: one patient journey carried across the patient and family, clinician and diagnostic-lab workspaces. Built in React with synthetic data and no backend.

> **Product preview - not for clinical use.** Every person, clinic, lab and result is fictional. The demo does not produce scores, diagnoses or result values. Demo state is kept only in the browser tab (sessionStorage) and nothing is sent anywhere.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build to dist/
npm run preview      # serve the production build
npm run check        # typecheck + locked-token guard + copy guard
```

Requires Node 20+.

## Demo script (5 minutes)

1. **Homepage** `/`: "Brain care. Connected." with the editorial split hero and the "Your next step" preview. Click **Explore your care journey**, then **Get started**.
2. **Setup** `/start`: care for a family member. Names are prefilled with the fictional Asha Rao (68), helped by her daughter Meera.
3. **Patient Home** `/app`: one next step, the Careline and nothing else competing. Click **Start care check-in**. A sudden-change answer routes to urgent help, not a booking.
4. **Assessment preview**: the respondent hand-off ("Now it is Asha's turn"), a shell with placeholder content only, then **Demo completion**. No score is produced.
5. **Find a clinician** → Dr. Kavya Rao (illustrative) → review the visit packet → **Request appointment**. Home now says the request is pending, not confirmed.
6. **Clinician workspace** `/pro/clinician`: accept the request, open the record ("Draft summary - review required", with sources kept apart), then **Order investigations**.
7. Back to the patient: **Choose where to complete your tests**. Providers that can do every requested test come first. Book a home collection.
8. **Lab workspace** `/pro/lab`: mark collected, then received, then processing, then **Release report**. Release, delivery and clinician review stay separate states.
9. **Clinician**: **Mark reviewed and update care plan**. The patient's Home now shows "Your clinician added a care update".

Jump to any point in the episode with the **Demo** button (bottom-left on private screens) or a deep link, for example `/app?demo=report-released&as=patient`. Stages are listed in [`docs/SCOPE.md`](docs/SCOPE.md) §5.

## What's inside

| Area | Routes |
|---|---|
| Public site | `/`, `/patients`, `/partners`, `/research`, `/learn`, `/care-support`, `/journey`, `/pilot`, `/care-and-research`, `/sign-in`, `/contact`, `/privacy`, `/terms`, `/accessibility` |
| Onboarding and safety | `/start`, `/start/access`, `/urgent` |
| Patient and family (Home, My care, Records, Learn, Support) | `/app`, `/app/care/*`, `/app/records/*`, `/app/learn/*`, `/app/support`, `/app/access` |
| Clinician workspace | `/pro/clinician` (Today, Patients, patient record, Orders & results, Follow-up) |
| Lab workspace | `/pro/lab` (Orders, order detail, Collections, Results, Exceptions) |
| Research | `/pro/research`: concept preview only, no data |

The full route map, spec decisions and non-goals are in [`docs/SCOPE.md`](docs/SCOPE.md).

## Design system

All UI follows [`DESIGN.md`](DESIGN.md) (NeuroVX - Connected Care v1.0): white-led, deep navy `#0B1F3A`, blue `#1D4ED8`, Inter, the Careline motif and one clear next step. Patient-specific rules are in [`docs/design/PATIENT.md`](docs/design/PATIENT.md). How the tokens and components map to code is in [`docs/design/IMPLEMENTATION.md`](docs/design/IMPLEMENTATION.md).

- **Tokens are locked.** Tailwind's default palette is removed, so only the DESIGN.md colours exist. `npm run check:tokens` fails on any raw colour.
- **Copy is guarded.** `npm run check:copy` fails on banned claims such as fake certifications, real hospital brands, scores and invented durations.
- The raw Google Stitch export is kept in [`design/stitch-export/`](design/stitch-export) for reference. It contains known spec violations that the rebuild fixes; they are listed in SCOPE.md §3.
- The earlier Cortex Teal system is archived at [`docs/design/archive/`](docs/design/archive).

## Stack

React 19 · Vite 7 · TypeScript · React Router 7 · Tailwind CSS v4 · lucide-react · Inter (self-hosted). QA: Playwright + axe (`npm run qa:screens -- --routes "/,/app" --axe`).

## Tooling

- **Agent instructions:** [`AGENTS.md`](AGENTS.md) is the source of truth for contributors and AI agents. [`CLAUDE.md`](CLAUDE.md) imports it and maps design skills to tasks. The current status and open work are in [`docs/HANDOFF.md`](docs/HANDOFF.md).
- **Design skills** in `.claude/skills/`: [Hallmark](https://github.com/nutlope/hallmark), run in `designed-as-app` mode so DESIGN.md is the locked system, plus the 13 [taste-skill](https://github.com/Leonxlnx/taste-skill) skills. They are pinned in `skills-lock.json`.
- **Stitch MCP** (`.mcp.json`) connects Claude Code to Google Stitch. Set `STITCH_API_KEY` in your environment; see `.env.example`.

## Deploy

This is a static single-page app. On Vercel, `vercel.json` rewrites every path to `index.html`. On any other static host, serve `dist/` with an SPA fallback.

## Contributing

- Branch from `main`, open a pull request and merge after review.
- UI changes must comply with `DESIGN.md`, and `npm run check` must pass.

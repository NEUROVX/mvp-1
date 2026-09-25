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

## Live demo and guides

- **Live:** https://neurovx-mvp.vercel.app (auto-deploys from `main`)
- **Presenting:** [`docs/DEMO-SCRIPT.md`](docs/DEMO-SCRIPT.md). A 15-minute end-to-end story, a 7-minute connected-care version, exception add-ons, and a deep-link table for every stage.
- **Running and navigating the repo:** [`docs/LOCAL-GUIDE.md`](docs/LOCAL-GUIDE.md). Setup, commands, the Demo panel and deep links, a route and code map, QA, deploy and troubleshooting.

Jump to any point in the episode with the **Demo** button in the header of every signed-in screen, or a deep link such as `/app?demo=report-released&as=patient`. Stages are listed in [`docs/SCOPE.md`](docs/SCOPE.md) §5.

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

This is a static single-page app. The Vercel project `neurovx-mvp-1` is linked to this repo: pushes to `main` deploy to https://neurovx-mvp.vercel.app, and pull requests get preview deployments (behind Vercel login). `vercel.json` rewrites every path to `index.html`. On any other static host, serve `dist/` with an SPA fallback.

## Contributing

- Branch from `main`, open a pull request and merge after review.
- UI changes must comply with `DESIGN.md`, and `npm run check` must pass.

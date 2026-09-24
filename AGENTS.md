# AGENTS.md — NeuroVX MVP-1

The source of truth for any AI agent or human contributor working in this repository. Read it fully before changing anything. If this file conflicts with the docs it links to, the order in **§2 Sources of truth** decides.

---

## 1. What this is

**NeuroVX** is an India-first neuroscience care platform, starting with memory and cognitive care. This repo is a **clickable demo MVP**: a React single-page app with **no backend** and **synthetic data only**. It is **not for clinical use**.

The demo tells **one fictional care episode across three connected workspaces**:

> Meera helps her mother **Asha Rao (68)** share what has changed → assessment preview (no score) → requests an appointment with **Dr. Kavya Rao** (illustrative) → **clinician workspace** accepts it, reviews the draft summary with its sources, and orders two tests → the family books a home collection with **Example Diagnostics** (illustrative) → **lab workspace** collects, processes and releases the Vitamin B12 report → clinician reviews it and updates the care plan → patient Home shows "Your clinician added a care update".

All workspaces share one store, so an action in one appears in the others.

## 2. Sources of truth (in priority order)

1. **[`DESIGN.md`](DESIGN.md)** — master design system, *NeuroVX - Connected Care v1.0*. Tokens, copy, homepage content, component rules, clinical honesty rules. **Do not edit it without the owner's approval.**
2. **[`docs/design/PATIENT.md`](docs/design/PATIENT.md)** — the patient and family extension: screen map P00–P22, Home state table, fixture episode.
3. **[`docs/design/PATIENT-ONE-STEP.md`](docs/design/PATIENT-ONE-STEP.md)** — used only where [`docs/SCOPE.md`](docs/SCOPE.md) §2 says so.
4. **[`docs/SCOPE.md`](docs/SCOPE.md)** — build contract: conflict decisions, fixture episode, stage transitions, route map and ownership, non-goals.
5. **[`docs/design/IMPLEMENTATION.md`](docs/design/IMPLEMENTATION.md)** — how tokens and the component kit map to code, and page rules.
6. This file — how to work in the repo.

[`design/stitch-export/`](design/stitch-export) is the raw Google Stitch output. It is **reference only** and contains known violations (SCOPE.md §3). **Never copy from it.** [`docs/design/archive/`](docs/design/archive) holds the superseded Cortex Teal system and is **not used**.

## 3. Commands

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # tsc -b + vite build → dist/
npm run preview        # serve dist/ (port 4173)
npm run check          # typecheck + check:tokens + check:copy — must pass before every commit
npm run qa:screens -- --base http://localhost:5173 --routes-file scripts/qa-routes.txt --widths 1440,390,320 --axe --out qa/sweep
```

- `qa/` is gitignored. Read `qa/<dir>/report.json` for overflow, console errors and axe results per route, and view the PNGs to judge the design.
- Chromium for Playwright is pre-installed. Do **not** run `playwright install`.
- Node 20+ is required. The stack is React 19 · Vite 7 · TypeScript (strict) · React Router 7 (`react-router`) · Tailwind CSS v4 · lucide-react · Inter (self-hosted via `@fontsource-variable/inter`). The alias `@/` resolves to `src/`.

## 4. Architecture

```
src/
  app/routes.tsx        Lazy route table (every page lazy; one broken page never breaks others)
  app/RouteError.tsx
  layouts/              PublicLayout · PatientLayout (5-destination nav) · FocusedLayout (task flows, 720px column)
                        WorkspaceLayout (clinician | lab | research) · shared.tsx (SkipLink, DemoControls, PrototypeFooter)
  components/ui/        The kit: Button, Card, StatusBadge, SourceLabel, Callout, NextStepCard, Careline(+Compact),
                        form controls, Dialog, Tabs, Segmented, Timeline, SampleMap, Wordmark, FlowProgress …
  demo/                 types.ts · fixtures.ts (all synthetic data) · episode.ts (state machine, Home copy, presets)
                        store.tsx (DemoProvider, useDemo, usePeople, useEpisode; sessionStorage; ?demo= deep links)
  lib/hooks.ts          usePageTitle, useRouteFocus
  pages/                public/ · learn/ · onboarding/ · patient/{checkin,assessment,booking,tests,records} · pro/{clinician,lab,research}
  features/             page-local components and data per area (public, intake, booking, tests, records, home, learn, clinician, lab, research)
  styles/index.css      LOCKED TOKENS (Tailwind @theme; the default palette is cleared)
scripts/                check-tokens.mjs · check-copy.mjs · qa-screens.mjs · qa-routes.txt
```

**Episode state machine** (`src/demo/episode.ts`). There are 17 stages. The golden path is `new → intake-saved → assessment-ready → assessment-completed → booking-requested → booking-confirmed → tests-requested → collection-arranged → report-released → reviewed → follow-up-due`. The variants are `family-only`, `cannot-assess`, `info-requested`, `delivery-problem`, `existing-care` and `no-task`. SCOPE.md §5 lists which action moves the episode to which stage.

- Use `setStage(s)` to move forward while keeping data.
- Use `jumpTo(s)` to load a complete, consistent preset.
- Use `hasReached(stage, x)` for "has this happened yet".
- Patient Home copy lives in **one place**: `nextStepFor()`. Change it there, never in the page.
- Personas are `care-partner` (Meera, the default), `patient` (Asha) and `limited-helper`. Always get names from `usePeople()`. **Never hard-code "Asha" or "Meera" in UI copy.**
- For presenters: the **Demo** button in each private header, or deep links such as `/app?demo=report-released&as=patient`.

## 5. Non-negotiable rules

### Design (DESIGN.md is locked)
- **Tokens only.** Colours: `primary #1D4ED8`, `primary-hover #1E40AF`, `navy/ink #0B1F3A`, `surface #FFFFFF`, `canvas #F2F7FC`, `muted #465E77`, `border #D9E5F2` (decorative only), `control #7184A0` (control outlines, **never text**), `accent-soft #EAF2FF`, and error and warning pairs. Tailwind's default palette does not exist here.
- Never add raw colours, arbitrary colour values or inline fonts. If you need a new token, add it to `src/styles/index.css` first and document it in IMPLEMENTATION.md. `npm run check:tokens` enforces this.
- Use Inter, sentence case and **roman headings (never italic)**. Patient explanations are 18px (`text-body-lg`). Essential patient information is never below 16px.
- About 80% of each screen is white or pale blue. Navy sets hierarchy and blue drives action. Use **one filled primary button per task area**. Prefer dividers to cards and never nest cards. Only the next-step card and the hero preview get `shadow-1`.
- The Careline is a quiet operational timeline. It is **never** a medical signal, a severity curve or evidence of improvement.
- Motion is limited to 120–180ms colour and opacity changes. No parallax, carousels, autoplay, glassmorphism, gradients, glows, stock photos or fake browser or phone frames.
- Responsive support must be flawless at 1440, 390 and 320px, with no horizontal scroll. Buttons never wrap onto two lines. Floating UI never covers content.

### Clinical honesty (the most important rules)
- **No** scores, result values, diagnoses, disease stages, doses, risk percentages or "brain age".
- **No** invented metrics, durations, ratings, reviewer names, logos, testimonials, certifications, accreditation, phone numbers or emails.
- **No** real hospital or lab brands. People and places are labelled *illustrative*, and fees are labelled *prototype placeholder*.
- **Request ≠ confirmation. Lab release ≠ delivery ≠ clinician review. Family observations ≠ patient answers.** Keep each pair as separate states and separate labels.
- **Do not recreate or gamify licensed instruments** (MMSE, MoCA, ADAS-Cog, CDR). The assessment is a **shell with placeholder content** that ends in "Demo completion" and produces no score.
- NeuroLearn is **education, not a clinician**. Its answers are pre-written, cite only real, dated sources, never give personalised test or medicine advice, and send urgent language to `/urgent` (112).
- Anything not built reads **"Concept - not available in this preview"**. Never fake success or say "Saved" or "Sent" when nothing happened.
- Research is separately governed. It is never preselected and never mixed into care screens.
- `npm run check:copy` enforces the banned-phrase list. Add `copy-ok` to a line only for a genuinely negated or explanatory sentence.

### Accessibility
One `h1` per page; logical headings; visible labels, never placeholder text used as the label; a 3px focus ring that is never removed; 48px targets; status always written as text, never shown by colour alone; `aria-live` for save and send feedback; the keyboard reaches everything. The target is WCAG 2.2 AA.

## 6. How to work here

- **Before editing:** read the relevant sections of the §2 docs, and the kit and store APIs in IMPLEMENTATION.md.
- **Pages:** every page file keeps `export default function XPage()` and calls `usePageTitle()`. Pages inside Patient, Focused or Workspace layouts must **not** add their own gutters or page max-width. Public pages own full-bleed sections (`page-gutter mx-auto max-w-page`, `section-y`).
- **Links:** every control goes to a route listed in SCOPE.md §6, updates the store, or opens a dialog. Never use `href="#"`.
- **Adding a route:** add it to `src/app/routes.tsx` (lazy), to SCOPE.md §6 and to `scripts/qa-routes.txt`.
- **Changing shared code** (`components/ui`, `layouts`, `demo`, `lib`, `styles`) affects every page. After any such change, re-run the full QA sweep.
- **Definition of done:**
  - `npm run check` passes.
  - `npm run build` passes.
  - The QA sweep on the affected routes at 1440, 390 and 320 has 0 overflow, 0 console errors and 0 axe violations.
  - You have looked at the screenshots.
  - Cross-page consistency holds for the same `?demo=` stage. What Home says must agree with the visit hub, tests, report, records, care plan, clinician and lab views.
- **Design skills:** see `CLAUDE.md` for which skill fits which task. DESIGN.md always wins.
- **Multi-agent work:** give each agent disjoint file ownership. Shared files have one owner, the coordinating session. Agents report the shared changes they need; they do not make them.

## 7. Git and deploy

- `main` is protected by convention. Branch from it, open a PR and merge after review.
- Commit messages are imperative and describe the reason, not only the change.
- Never commit `qa/`, `dist/`, `.env` or secrets. The Stitch MCP key comes from `STITCH_API_KEY` in the environment (see `.mcp.json` and `.env.example`).
- Deploy as a static SPA. `vercel.json` rewrites every path to `index.html`.

## 8. Current status and open work

The status as of the last session is in **[`docs/HANDOFF.md`](docs/HANDOFF.md)**. Read it first when you continue.

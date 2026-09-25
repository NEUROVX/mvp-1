# NeuroVX MVP-1 — Local guide

How to run this repo on your machine, find your way around the app and the code, make a change safely, and ship it.

- **Live demo:** https://neurovx-mvp.vercel.app
- **Repo:** https://github.com/NEUROVX/mvp-1
- **Presenting?** Use [`DEMO-SCRIPT.md`](DEMO-SCRIPT.md).
- **Changing code?** Read [`../AGENTS.md`](../AGENTS.md) first. It is the source of truth and outranks this guide.

---

## 1. What you are running

A React single-page app with **no backend** and **synthetic data only**. One fictional care episode (Asha Rao, 68, helped by her daughter Meera) runs across three workspaces that share one in-browser store:

| Workspace | Base route | Who it is for |
|---|---|---|
| Public site | `/` | Anyone. Marketing, Learn and the journey explainer |
| Patient and family app | `/app` | Asha or her care partner Meera |
| Clinician workspace | `/pro/clinician` | Dr. Kavya Rao (illustrative) |
| Lab workspace | `/pro/lab` | Example Diagnostics (illustrative) |
| Research | `/pro/research` | A concept page only, with no data |

A click in one workspace (for example, the lab's **Release report**) shows up in the others straight away.

---

## 2. Set up (about 5 minutes)

### Prerequisites
- **Node.js 20 or newer** (`node -v`). Vercel builds with Node 24.x.
- **npm** (comes with Node).
- **git**.
- Optional: Chromium for the QA sweep. `npm install` installs Playwright; if no browser is present, run `npx playwright install chromium` once on your own machine. (In the Claude Code cloud environment Chromium is pre-installed; do not run `playwright install` there.)

### Clone, install, run

```bash
git clone https://github.com/NEUROVX/mvp-1.git
cd mvp-1
npm install
npm run dev                 # → http://localhost:5173
```

Open http://localhost:5173 and you should see **"Brain care. Connected."**

### Environment variables
None are needed to run the app. `.env.example` lists one optional key, `STITCH_API_KEY`. It is used only by the Google Stitch MCP server in `.mcp.json`, for design work with Claude Code. Never commit a real key; `.env` is gitignored.

---

## 3. Everyday commands

| Command | What it does | When |
|---|---|---|
| `npm run dev` | Vite dev server with hot reload on :5173 | While developing |
| `npm run check` | TypeScript + `check:tokens` (no raw colours or fonts) + `check:copy` (banned clinical claims) | **Before every commit** |
| `npm run build` | Type-check, then a production build to `dist/` | Before a PR |
| `npm run preview` | Serves `dist/` on :4173 | To test the real build and for the QA sweep |
| `npm run typecheck` | TypeScript only | Quick feedback |
| `npm run qa:screens -- …` | Playwright screenshots + overflow + console errors + axe | After UI or shared-code changes (see §8) |

---

## 4. Navigating the running app

### The Demo panel (your remote control)
Every signed-in screen (patient app, task flows, clinician and lab) has a **Demo** button in the header. It lets you:
- Switch **who is signed in**: *Meera - care partner* (the default), *Asha - patient*, or *Helper, no access yet*.
- **Jump to any of the 17 episode stages** with complete, consistent data.
- **Open a workspace**: Patient and family, Clinician or Diagnostic lab.
- **Reset demo**.

### Deep links
Add `?demo=<stage>` and optionally `&as=<persona>` to **any** URL:

```
http://localhost:5173/app?demo=report-released&as=patient
http://localhost:5173/pro/clinician?demo=booking-requested
http://localhost:5173/pro/lab/orders/ORD-DEMO-0142?demo=collection-arranged
```

- **Stages**, main path: `new`, `intake-saved`, `assessment-ready`, `assessment-completed`, `booking-requested`, `booking-confirmed`, `tests-requested`, `collection-arranged`, `report-released`, `reviewed`, `follow-up-due`.
- **Stages**, other situations: `family-only`, `cannot-assess`, `info-requested`, `delivery-problem`, `existing-care`, `no-task`.
- **Personas:** `care-partner`, `patient`, `limited-helper`.

What the patient Home says at each stage is listed in [`DEMO-SCRIPT.md` §4](DEMO-SCRIPT.md#4-deep-link-recovery-table). Which user action moves the episode from one stage to the next is in [`SCOPE.md` §5](SCOPE.md).

### Where things are (main routes)

| Area | Routes |
|---|---|
| Public | `/`, `/patients`, `/partners`, `/research`, `/care-support`, `/journey`, `/pilot`, `/care-and-research`, `/learn`, `/sign-in`, `/contact`, `/privacy`, `/terms`, `/accessibility` |
| Onboarding and safety | `/start` → `/start/access`, `/urgent` |
| Patient Home and nav | `/app` (Home), `/app/care` (My care), `/app/records` (Records), `/app/learn` (Learn), `/app/support` (Support), `/app/access` (People and access) |
| Check-in and assessment | `/app/care/check-in`, `/app/care/observations`, `/app/care/reports-upload`, `/app/care/assessment` → `/session` → `/summary` |
| Booking and visit | `/app/care/find-clinician`, `/app/care/clinicians/kavya-rao`, `/app/care/book/review`, `/app/care/visit`, `/app/care/visit/change-mode` |
| Tests and records | `/app/care/tests`, `/app/care/tests/providers`, `/app/care/tests/book?provider=…`, `/app/care/tests/progress`, `/app/records/reports/b12`, `/app/care/plan` |
| Clinician | `/pro/clinician` (Today), `/patients`, `/patients/asha-rao` (`?tab=summary\|timeline\|assessments\|results\|care-plan`), `/orders`, `/follow-up` |
| Lab | `/pro/lab` (Orders), `/orders/ORD-DEMO-0142` (B12), `/orders/ORD-DEMO-0143` (plasma), `/collections`, `/results`, `/exceptions` |

The full, authoritative table (with file and owner for each route) is [`SCOPE.md` §6](SCOPE.md).

### Where demo state lives
- In **`sessionStorage`** under the key `nvx-demo-v1`. It belongs to **one browser tab** and is cleared when the tab closes. Nothing is sent to a server.
- To start clean: Demo → **Reset demo**, or open a new tab, or run `sessionStorage.removeItem('nvx-demo-v1')` in the console.

---

## 5. Code map

```
src/
  app/routes.tsx         Every route, lazy-loaded (one broken page never breaks the rest)
  layouts/               PublicLayout · PatientLayout (5-item nav) · FocusedLayout (task flows) · WorkspaceLayout (clinician/lab/research)
                         shared.tsx: SkipLink, the Demo panel (DemoControls), PrototypeFooter
  components/ui/         The kit: Button, StatusBadge, Callout, NextStepCard, Careline, Form controls, Dialog, Tabs, Timeline …
  demo/
    types.ts             DemoState, EpisodeStage, Persona …
    fixtures.ts          ALL synthetic data: people, clinicians, labs, orders, reports, timeline, care plan, dates
    episode.ts           The 17-stage state machine, presets, and the one source of patient Home copy: nextStepFor()
                         Shared selectors: labCollectionFor, collectedEventFor, sharedUploads
    store.tsx            DemoProvider, useDemo(), usePeople(), useEpisode(); sessionStorage; ?demo= deep links
  pages/                 One file per route: public/ learn/ onboarding/ patient/… pro/{clinician,lab,research}
  features/              Page-level components and view-models per area (booking, tests, records, clinician, lab …)
  styles/index.css       LOCKED design tokens (Tailwind v4 @theme; the default palette is removed)
scripts/                 check-tokens.mjs · check-copy.mjs · qa-screens.mjs · qa-routes.txt
docs/                    SCOPE.md · HANDOFF.md · DEMO-SCRIPT.md · LOCAL-GUIDE.md · design/ (PATIENT.md, IMPLEMENTATION.md)
DESIGN.md                The locked design system (do not edit without owner approval)
```

**Four ideas to understand before you change anything**
1. **One store, three workspaces.** Read state with `useDemo()`. Move forward with `setStage(stage)`, which keeps the data. Load a full preset with `jumpTo(stage)`. Check "has this happened yet" with `hasReached(stage, 'x')`.
2. **Home copy has one home.** Patient Home text comes only from `nextStepFor()` in `src/demo/episode.ts`. Never write it in a page.
3. **Names come from `usePeople()`.** Never hard-code "Asha" or "Meera"; a presenter can type other names at `/start`.
4. **Derive, don't duplicate.** If two screens show the same fact (a booked slot, a shared report), they must read it through the same selector. Drift between workspaces is the most common bug here.

---

## 6. Rules the checks enforce (and the ones they can't)

| Rule | Enforced by |
|---|---|
| Colours and fonts come only from tokens in `src/styles/index.css`. No raw hex, no Tailwind palette classes. | `npm run check:tokens` |
| No scores, result values, diagnoses, fake certifications, real hospital or lab brands, invented durations or gamification | `npm run check:copy` (add `copy-ok` only on a genuinely negated line) |
| TypeScript strict | `npm run typecheck` |
| Request ≠ confirmation; lab release ≠ delivery ≠ clinician review; family observations ≠ patient answers | Code review and the cross-workspace walk |
| One `h1` per page, visible labels, 48px targets, status never shown by colour alone, no horizontal scroll at 1440/390/320 | The QA sweep (axe + overflow) and your eyes on the screenshots |

The full list is in [`AGENTS.md` §5](../AGENTS.md). The visual system is in [`DESIGN.md`](../DESIGN.md) and [`design/IMPLEMENTATION.md`](design/IMPLEMENTATION.md).

---

## 7. Common tasks

**Add a page or route**
1. Create `src/pages/<area>/XPage.tsx` with `export default function XPage()` that calls `usePageTitle()`.
2. Register it lazily in `src/app/routes.tsx` under the right layout.
3. Add it to `docs/SCOPE.md` §6 and to `scripts/qa-routes.txt`.
4. Inside the Patient, Focused or Workspace layouts, don't add your own page gutters or max-width.

**Change what patient Home says:** edit `nextStepFor()` in `src/demo/episode.ts`.

**Add or change synthetic data:** edit `src/demo/fixtures.ts`. Label people and places *illustrative*, and fees *prototype placeholder*.

**Add a new colour or token:** add it to `src/styles/index.css` and document it in `docs/design/IMPLEMENTATION.md`. Then `check:tokens` will allow it.

---

## 8. QA before a pull request

```bash
npm run check
npm run build
npm run preview &                              # serves dist/ on :4173
node scripts/qa-screens.mjs --base http://localhost:4173 \
  --routes-file scripts/qa-routes.txt --widths 1440,390,320 --axe --out qa/sweep
```

- For a quick run, pass `--routes "/,/app?demo=report-released"` instead of `--routes-file`.
- Results go to `qa/sweep/report.json` (overflow px, console errors and axe violations per route and width), with a PNG for each. `qa/` is gitignored.
- **Done means:** 0 overflow, 0 console errors and 0 axe violations, you have looked at the screenshots, and the same `?demo=` stage reads the same on Home, the visit hub, tests, report, records, care plan, clinician and lab.

---

## 9. Git and deploy

- `main` is protected by convention: branch → PR → review → merge. Commit messages are imperative and say why.
- **Vercel** project `neurovx-mvp-1` (team *Neurovx*) is linked to this repo:
  - Every push to `main` deploys to production at **https://neurovx-mvp.vercel.app**.
  - Every PR gets a preview deployment. Preview URLs are behind Vercel login (the team's Deployment Protection), so only team members can open them.
- `vercel.json` rewrites every path to `index.html`, so deep links work. On any other static host, serve `dist/` with an SPA fallback.
- Never commit `qa/`, `dist/`, `.env` or secrets.

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| The page shows an odd stage or old data | Demo → **Reset demo**, or clear `nvx-demo-v1` in sessionStorage |
| Opening a link in a new tab "forgets" progress | Expected: state is per tab. Stay in one tab, or use a `?demo=` link |
| `Port 5173 is in use` | Stop the other dev server, or run `npm run dev -- --port 5174` |
| `check:tokens` fails | Replace the raw colour or palette class with a token such as `text-ink`, `bg-canvas` or `text-primary` |
| `check:copy` fails | Reword the claim. Use `copy-ok` only for a negated or explanatory sentence |
| QA sweep can't find a browser | On your machine, run `npx playwright install chromium` once |
| A deep link on a static host returns 404 | The host needs an SPA fallback to `index.html` (Vercel already has one via `vercel.json`) |
| A Vercel preview URL asks you to log in | That's Deployment Protection. Use the production URL for external audiences |

---

## 11. Where to read next
1. [`AGENTS.md`](../AGENTS.md): how to work here (source of truth)
2. [`DESIGN.md`](../DESIGN.md): the locked design system
3. [`SCOPE.md`](SCOPE.md): build contract, stage transitions, route map, non-goals
4. [`design/PATIENT.md`](design/PATIENT.md): patient screens and Home states
5. [`HANDOFF.md`](HANDOFF.md): current status and open work

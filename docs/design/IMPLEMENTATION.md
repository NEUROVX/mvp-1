# Implementation guide — tokens, kit and page rules

How DESIGN.md is implemented in code. Read with [`DESIGN.md`](../../DESIGN.md) and [`docs/SCOPE.md`](../SCOPE.md).

## Stack

React 19 · Vite 7 · TypeScript (strict) · React Router 7 (`react-router`) · Tailwind CSS v4 · lucide-react icons · Inter (self-hosted via `@fontsource-variable/inter`). Import alias `@/` → `src/`.

## Locked tokens (src/styles/index.css)

Tailwind's default palette, fonts, radii, shadows and text sizes are **cleared**. Only these exist:

| Utility | Token | Value | Use |
|---|---|---|---|
| `*-primary` | primary | #1D4ED8 | Primary action, active nav, links |
| `*-primary-hover` | primary-hover | #1E40AF | Hover/pressed, informational status text |
| `*-navy` | secondary | #0B1F3A | Wordmark, navy surfaces, footer |
| `*-ink` | on-surface | #0B1F3A | Headings and body text |
| `*-surface` / `*-white` | surface | #FFFFFF | Content surfaces |
| `*-canvas` | canvas | #F2F7FC | Workspace background, section separation |
| `*-muted` | muted | #465E77 | Secondary text (6.2:1 on canvas) |
| `*-border` | border | #D9E5F2 | Decorative dividers only |
| `*-control` | control-border | #7184A0 | Input and option boundaries (3.8:1). **Never text.** |
| `*-accent-soft` | accent-soft | #EAF2FF | Selected and informational backgrounds |
| `*-error` / `*-error-surface` | | #B42318 / #FEF3F2 | Real errors and approved urgent notices |
| `*-warning` / `*-warning-surface` | | #92400E / #FFFBEB | Genuine caution |
| `*-navy-muted` | (derived) | #B9C7DA | Secondary text on navy (9.6:1) |
| `*-navy-rule` | (derived) | #2A3F5E | Dividers on navy |

Type utilities: `text-display` (60px) · `text-display-mobile` (40px) · `text-heading-lg` (36px) · `text-heading-lg-mobile` (28px) · `text-patient-title` (32px) · `text-heading-md` (24px) · `text-heading-sm` (20px) · `text-body-lg` (18px, patient body) · `text-body-md` (16px) · `text-label` (16/600) · `text-data` (16/500) · `text-metadata` (14px: professional, non-essential only).
Radii: `rounded-sm` 6 · `rounded-md` 10 · `rounded-lg` 16 · `rounded-full`. Shadows: `shadow-1` (next-step / hero preview only) · `shadow-2` (menus and dialogs).
Widths: `max-w-page` 1200 · `max-w-reading` 680 · `max-w-task` 720. Helpers: `page-gutter` (20px mobile / 32px desktop / 16px ≤320px), `section-y` (48/64/96), `prose-link`, `tabular`.

Guards: `npm run check:tokens` (no raw colours or palette classes outside `src/styles`) and `npm run check:copy` (banned claims, brands, screen IDs, durations). Both must pass.

## Kit (`import { … } from '@/components/ui'`)

- `Button` — `variant`: primary | secondary | quiet | destructive | on-navy · `size`: md (48px) | lg (52px patient primary) · `to` (router link) | `href` | `onClick` · `iconLeft`/`iconRight` · `loading`/`loadingLabel` · `fullWidth`. One primary per task area.
- `TextLink` (underlined, in paragraphs) · `ArrowLink` (standalone "Explore … →").
- `Card` (`elevated`, `padding`), `Divider`, `StatusBadge` (`tone`: info | warning | error | neutral, always text), `DemoTag`, `PrototypeNote`, `SourceLabel` (`kind`: patient | care-partner | clinician | lab | imaging | system), `Callout` (`tone`, `title`, `action`), `InlineStatus` (aria-live), `PageHeader` (h1), `SectionHeading` (public h2), `Eyebrow`, `DescriptionList`, `Initials`, `EmptyState`, `Disclosure`, `VisuallyHidden`.
- `Careline` (`steps`, `orientation`, `size`) · `CarelineCompact` (mobile, "View journey").
- `NextStepCard` (status → title → body → details → owner → primary + one quiet alternative).
- Forms: `TextField`, `TextArea`, `SelectField`, `RadioGroup`, `CheckboxGroup` (supports `exclusive` options), `Checkbox`, `ErrorSummary`. Every control has a visible label; mark optional fields with `optional`.
- `Dialog` (native `<dialog>`: focus in, Escape, focus return), `Tabs` (roving tabindex), `Segmented` (List / Map).
- `Timeline` (chronological record: date, type, source, review state, action).
- `SampleMap` (abstract map; pins select list items; never a real location).
- `Wordmark`, `LogoLockup`, `LogoMark` (logo files in `public/brand/`), `FlowProgress` ("Step 1 of 3 · …").

Store (`@/demo/store`): `useDemo()` → `{ state, set, setStage, jumpTo, setPersona, reset }` · `usePeople()` → names and context lines · `useEpisode()` → `{ stage, next, careline }`.
Episode (`@/demo/episode`): `hasReached`, `nextStepFor`, `carelineFor`, `STAGE_META`, `GOLDEN_PATH`, plus shared selectors every workspace must use instead of re-deriving: `labCollectionFor` (the booked sample collection: provider, slot, type and recorded collection time), `collectedEventFor` (the "Sample collected" timeline event) and `sharedUploads` (previous reports actually in the visit packet, honouring `booking.share.excludedUploadIds`). Fixtures (`@/demo/fixtures`): `CLINICIANS`, `ORDERS`, `LAB_PROVIDERS`, `REPORTS`, `PENDING_REPORT`, `TIMELINE`, `CARE_PLAN`, `CARE_PLAN_SUMMARY`, `ORG`, `EPISODE_DATES`, label maps and `…ById` helpers.
Hooks (`@/lib/hooks`): `usePageTitle(title)` — call on every page.

## Page rules

1. **One h1 per page.** In the patient and workspace layouts use `PageHeader`. Public pages own their hero h1.
2. **Gutters:** Public pages own full-bleed sections, so wrap content in `page-gutter mx-auto max-w-page`. Pages inside the Patient, Focused and Workspace layouts must **not** add gutters or a page max-width; the layout already provides them. Constrain reading text with `max-w-reading`.
3. **Patient copy:** body explanations use `text-body-lg`; essential information is never below 16px (`text-metadata` is for professional views only). Use sentence case. Write dates as `06 Oct 2026`, times as `4:30 PM IST`.
4. **Honesty:** synthetic data carries one `DemoTag` per screen region, not on every card. Label fees as placeholders and people and places as illustrative. Say "Saved in this browser tab" only after `set()` has run. Never invent metrics, scores, reviewers, durations, ratings or logos.
5. **Every control does something:** navigate to a real route, update the store, or open a dialog. Anything not built says **"Concept - not available in this preview"**. No `href="#"`.
6. **Layout rhythm:** prefer dividers and whitespace to nested cards. Use an 8px rhythm, one shadowed surface at most (the next step), and editorial columns rather than card grids.
7. **Motion:** 120–180ms colour and opacity transitions only. No parallax, carousels, autoplay or animated clinical data.
8. **Accessibility:** labels, focus visibility, 48px targets, text alongside colour, `aria-live` for status, and keyboard access to everything. Verify at 1440, 390 and 320px (no horizontal scroll).

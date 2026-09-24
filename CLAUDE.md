# CLAUDE.md

NeuroVX MVP-1: a React demo app with synthetic data. **[`AGENTS.md`](AGENTS.md) is the source of truth.** Read it first.

@AGENTS.md

## Design precedence (read before any UI work)

1. **`DESIGN.md` is the locked design system.** Its colours, fonts, spacing, motion and banned patterns override every skill in `.claude/skills/`. If a skill's defaults conflict with it (fonts, accent colour, density, motion intensity), follow `DESIGN.md`.
2. **Clinical constraints come before aesthetics.** No unsupported diagnostic or efficacy claims, status never shown by colour alone, and respect `prefers-reduced-motion`.
3. Use skills for structure, craft and anti-slop review, not to pick a new visual identity.

## Which skill to use

| Task | Skill |
|------|-------|
| Build a new page or screen | `hallmark` (reads `DESIGN.md` automatically) or `design-taste-frontend` |
| Audit or upgrade existing UI | `hallmark audit` / `redesign-existing-projects` |
| Regenerate or amend `DESIGN.md` for Google Stitch | `stitch-design-taste` |
| Design reference images (web / mobile) | `imagegen-frontend-web` / `imagegen-frontend-mobile` |
| Image to working code | `image-to-code` |
| Brand guidelines board | `brandkit` |
| Long files that must not be truncated | `full-output-enforcement` |

Do **not** use these unless the user explicitly asks, because they impose a visual identity that conflicts with `DESIGN.md`: `industrial-brutalist-ui`, `minimalist-ui`, `high-end-visual-design`, `gpt-taste`, `design-taste-frontend-v1`.

## Skills maintenance

Skills are installed project-scoped and pinned in `skills-lock.json`. Update them with `npx skills update -p -y`, then review the diff before merging.

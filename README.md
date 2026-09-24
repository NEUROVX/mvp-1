# NeuroVX — MVP-1

First product build for NeuroVX, a neurotechnology company. This repository holds the MVP application and its design system.

## Status

Early setup. No application code yet. Current contents:

| File | Purpose |
|------|---------|
| `README.md` | Project overview (this file) |
| `DESIGN.md` | Design system: color, type, components, layout, motion, banned patterns |
| `.claude/skills/hallmark/` | [Hallmark](https://github.com/nutlope/hallmark) design skill for Claude Code (project-scoped) |
| `skills-lock.json` | Pinned source + hash of installed skills |

## Design system

All UI work follows [`DESIGN.md`](./DESIGN.md). It was generated with the
[`stitch-design-taste`](https://github.com/leonxlnx/taste-skill) skill and tuned for a clinical-grade
neurotech product: calm, precise, and data-forward.

Use it two ways:

1. **Google Stitch** — paste `DESIGN.md` as the design context when generating screens at [stitch.withgoogle.com](https://stitch.withgoogle.com).
2. **Coding agents** — point Claude Code, Cursor, or similar at `DESIGN.md` before building UI so exported screens get implemented with the intended tokens and motion.

## Design skills

[Hallmark](https://github.com/nutlope/hallmark) is installed as a project skill, so any Claude Code session in this repo can use it. It is an anti-AI-slop design skill for building, auditing, and redesigning UI.

- **Build:** ask Claude Code to design a page. Hallmark reads `DESIGN.md` first and treats it as the locked system, so output stays on NeuroVX tokens.
- **Audit:** `hallmark audit <file>` returns a ranked punch list without editing.
- **Redesign:** `hallmark redesign <file>` restyles within existing routes and components.
- **Study:** `hallmark study <url | screenshot>` extracts a reference design's structure.

Update with `npx skills update -p -y`. For other tools, copy `SKILL.md` + `references/` from `.claude/skills/hallmark/` into `.cursor/rules/hallmark.mdc` (Cursor, body only, no frontmatter) or `.codex/skills/hallmark/` (Codex).

## Getting started

```bash
git clone https://github.com/NEUROVX/mvp-1.git
cd mvp-1
```

Stack, setup, and run instructions will be added once the application scaffold lands.

## Contributing

- Branch from `main`, open a pull request, merge after review.
- UI changes must comply with `DESIGN.md`, including its anti-pattern list.

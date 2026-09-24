# NeuroVX — MVP-1

First product build for NeuroVX, a neurotechnology company. This repository holds the MVP application and its design system.

## Status

Early setup. No application code yet. Current contents:

| File | Purpose |
|------|---------|
| `README.md` | Project overview (this file) |
| `DESIGN.md` | Design system: color, type, components, layout, motion, banned patterns |
| `CLAUDE.md` | Agent instructions: `DESIGN.md` precedence and which skill to use when |
| `.claude/skills/` | Project-scoped design skills: [Hallmark](https://github.com/nutlope/hallmark) + all 13 [taste-skill](https://github.com/Leonxlnx/taste-skill) skills |
| `skills-lock.json` | Pinned source + hash of installed skills |
| `.mcp.json` | Project-scoped MCP servers for Claude Code (Google Stitch) |
| `.env.example` | Environment variables the tooling expects (no real values) |

## Design system

All UI work follows [`DESIGN.md`](./DESIGN.md). It was generated with the
[`stitch-design-taste`](https://github.com/leonxlnx/taste-skill) skill and tuned for a clinical-grade
neurotech product: calm, precise, and data-forward.

Use it two ways:

1. **Google Stitch** — paste `DESIGN.md` as the design context when generating screens at [stitch.withgoogle.com](https://stitch.withgoogle.com).
2. **Coding agents** — point Claude Code, Cursor, or similar at `DESIGN.md` before building UI so exported screens get implemented with the intended tokens and motion.

## Stitch MCP

`.mcp.json` connects Claude Code to [Google Stitch](https://stitch.withgoogle.com) over its remote MCP server, so an agent can list, generate, edit, and apply design systems to Stitch screens without copy-pasting.

The API key is never stored in the repo. `.mcp.json` reads it from `STITCH_API_KEY`.

1. Create a key: Stitch → **Settings** → **API Keys** → **Create API Key**.
2. Make it available to Claude Code:
   - **Local:** `export STITCH_API_KEY=...` in your shell profile (or copy `.env.example` to `.env` and load it; `.env` is gitignored).
   - **Claude Code on the web:** add `STITCH_API_KEY` as an environment variable in the cloud environment's settings.
3. Start Claude Code in the repo, approve the project `stitch` server when prompted, and check it with `/mcp`.

Tools exposed: `create_project`, `get_project`, `list_projects`, `list_screens`, `get_screen`, `generate_screen_from_text`, `edit_screens`, `generate_variants`, `create_design_system`, `update_design_system`, `list_design_systems`, `apply_design_system`.

Recommended flow: create a Stitch design system from the tokens in `DESIGN.md`, apply it to every generated screen, then implement exported screens against `DESIGN.md`.

If your key leaks, delete it in Stitch Settings and create a new one. For zero-trust setups, Stitch also supports short-lived OAuth tokens via `gcloud` (see the [Stitch MCP docs](https://stitch.withgoogle.com/docs/mcp/setup)); those expire hourly and are not worth it for day-to-day use.

## Design skills

[Hallmark](https://github.com/nutlope/hallmark) is installed as a project skill, so any Claude Code session in this repo can use it. It is an anti-AI-slop design skill for building, auditing, and redesigning UI.

- **Build:** ask Claude Code to design a page. Hallmark reads `DESIGN.md` first and treats it as the locked system, so output stays on NeuroVX tokens.
- **Audit:** `hallmark audit <file>` returns a ranked punch list without editing.
- **Redesign:** `hallmark redesign <file>` restyles within existing routes and components.
- **Study:** `hallmark study <url | screenshot>` extracts a reference design's structure.

The full [taste-skill](https://github.com/Leonxlnx/taste-skill) set is also installed (13 skills). `CLAUDE.md` defines which to use for which task; `DESIGN.md` always wins on conflicts.

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

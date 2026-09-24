# NeuroVX — MVP-1

First product build for NeuroVX, a neurotechnology company. This repository holds the MVP application and its design system.

## Status

Early setup. No application code yet. Current contents:

| File | Purpose |
|------|---------|
| `README.md` | Project overview (this file) |
| `DESIGN.md` | Design system: color, type, components, layout, motion, banned patterns |

## Design system

All UI work follows [`DESIGN.md`](./DESIGN.md). It was generated with the
[`stitch-design-taste`](https://github.com/leonxlnx/taste-skill) skill and tuned for a clinical-grade
neurotech product: calm, precise, and data-forward.

Use it two ways:

1. **Google Stitch** — paste `DESIGN.md` as the design context when generating screens at [stitch.withgoogle.com](https://stitch.withgoogle.com).
2. **Coding agents** — point Claude Code, Cursor, or similar at `DESIGN.md` before building UI so exported screens get implemented with the intended tokens and motion.

## Getting started

```bash
git clone https://github.com/NEUROVX/mvp-1.git
cd mvp-1
```

Stack, setup, and run instructions will be added once the application scaffold lands.

## Contributing

- Branch from `main`, open a pull request, merge after review.
- UI changes must comply with `DESIGN.md`, including its anti-pattern list.

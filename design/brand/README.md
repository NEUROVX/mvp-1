# NeuroVX logo

Vector masters of the NeuroVX logo, made from the supplied artwork (`neurovx-logo-source.jpg`, 1280 × 720 JPEG). Every file is an SVG with a transparent background.

| File | Use |
|---|---|
| `neurovx-logo.svg` | Stacked master: mark above the wordmark, as in the source artwork. Light backgrounds. |
| `neurovx-logo-white.svg` | Stacked, all white. Navy or dark backgrounds. |
| `neurovx-mark.svg` | Brain mark alone, full colour. |
| `neurovx-mark-white.svg` | Brain mark alone, white. |
| `neurovx-mark-small.svg` | Heavier cut of the mark for sizes below about 48px. The master's hairlines disappear at icon sizes. |
| `../../src/assets/brand/neurovx-lockup.svg` | Horizontal lockup used by the app (`Logo` and `Wordmark` in `src/components/ui/Brand.tsx`). |
| `../../src/assets/brand/neurovx-lockup-white.svg` | Horizontal lockup, white, used on navy (public footer). |
| `../../public/favicon.svg`, `../../public/apple-touch-icon.png` | Browser tab and home-screen icons, built from the small-size mark on white. |

## How the vectors were made

- **Brain mark:** traced from the source image. The ink coverage was normalised per column (the strokes fade from teal to navy), upscaled 8×, thresholded at 50% coverage and traced with potrace. Specks from JPEG noise were removed. The twelve sparkle dots were redrawn as true circles at their measured centres and sizes.
- **Wordmark:** rebuilt as geometry rather than traced, so the edges stay crisp. Each letter is a small model: straight letters are exact polygons, and U, R and O use true elliptical arcs. The parameters were fitted to the source pixels, with 0.90 to 0.94 overlap per letter. The O is an open ring cut on the right, with a dot sitting in the gap.
- **Colour:** sampled from stroke cores in the source. The mark has a left-to-right gradient from teal `#478996` to deep slate `#282D3D`. N, E, U and R are solid charcoal `#33353A`. O and V run teal to deep teal-blue from top left to bottom right, and X runs navy to indigo from left to right.
- **Horizontal lockup:** the wordmark's cap height is 0.34 × the mark height, the gap is 0.26 × the mark height, and the wordmark is centred vertically on the brain, not on the star.

## Rules

- The logo keeps its own colours and gradients inside the artwork. They are **not** UI tokens, so do not use them for text, buttons or surfaces (see `docs/design/IMPLEMENTATION.md` › Logo).
- Use the full-colour version on white or canvas and the white version on navy. Never recolour, stretch, outline or add effects.
- The horizontal lockup is at least 32px tall. Below that, use the mark alone.
- Keep clear space around the logo of at least the height of the wordmark's capitals.

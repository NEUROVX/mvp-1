# One Careline: NeuroVX brand film (15s)

A 15-second, 1920×1080, 60fps motion piece built entirely from `DESIGN.md`: the Careline motif, Inter, the locked navy/blue/white tokens, and the real golden-path episode across the three workspaces.

`careline-film.mp4` is the rendered film. Everything else is the source.

## Structure

| Time | Act | What moves |
|---|---|---|
| 0.0–2.8 | **A point becomes a line** | A single blue node is placed, then the Careline draws across the frame. Kinetic type: "A family notices / something has changed." |
| 2.6–5.9 | **The Careline** | The line cools to a quiet track, and the four checkpoints from DESIGN.md › *The care journey* pop in. The head steps between checkpoints with a rolling status: Not started → Current step → Completed. |
| 5.6–10.2 | **One store, three workspaces** | The line rises to become the spine of three workspaces (family, clinician, lab). A signal travels the Careline to whichever workspace updates next, drops in and rolls one status, 14 times, in golden-path order. |
| 9.9–12.4 | **The next step** | The family panel morphs into patient Home's next-step card, using the `reviewed` copy from `src/demo/episode.ts`. One intentional button press. |
| 12.3–15.0 | **The mark** | The card collapses into a line, the line bends into the Careline glyph from `Brand.tsx`, and the wordmark and tagline resolve. |

## Brand and clinical rules kept

- Tokens only: no gradients, glows, glass, stock imagery or device frames. Hierarchy comes from tonal separation (white on `canvas`) and `shadow-1` on the next-step card only.
- Status is always written as text, never shown by colour alone.
- No scores, result values, diagnoses or real brands. The clinic and lab are labelled illustrative, and the end card says *Product preview - not for clinical use · Synthetic, illustrative data*.
- **Request ≠ confirmation** (Appointment: Requested → Confirmed) and **lab release ≠ delivery ≠ clinician review** (three separate rows and states).
- The Careline is never a trace or a curve. It only joins checkpoints.
- DESIGN.md's 120–180ms motion rule governs the product UI. This is a brand film, a separate medium, so it uses longer choreographed moves but stays inside the palette and bans.

## Craft notes

- **Deterministic.** `render(t)` in `film.html` is a pure function of time, so every frame is reproducible and scrubbable (`film.html?t=7.2`).
- **Easing vocabulary:** expo-out for arrivals, an emphasized curve for big moves, in-out for travel between checkpoints, and a small overshoot only on node pops.
- **Real motion blur:** each output frame averages 4 subframes across a 270° shutter.
- **Sound** is synthesised in `sound.py` (sines and filtered noise, no samples) from cue times exported by the page. Checkpoints rise in pitch, and workspace ticks are panned left, centre or right to match where each panel sits.

## Rebuild

```bash
npm install                       # Inter + Playwright come from the repo's devDependencies
pip install numpy imageio-ffmpeg  # sound synthesis + a static ffmpeg
export FFMPEG=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
cd design/motion/careline-film
node render.mjs --stills 3.5,7.5,14.5   # optional: check key frames
node render.mjs --events && python3 sound.py out/events.json out/sound.wav
node render.mjs                         # ~3,600 subframes → out/video-only.mp4
$FFMPEG -i out/video-only.mp4 -i out/sound.wav -c:v copy -c:a aac -b:a 192k -shortest careline-film.mp4
```

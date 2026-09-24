# Design System: NeuroVX
**Skill:** stitch-design-taste

---

## Configuration — Set Your Style
Tuned for a neurotech product that clinicians, researchers, and patients have to trust. Precision and calm come before spectacle.

| Dial | Level | Rationale |
|------|-------|-----------|
| **Creativity** | `6` | Distinctive, not flashy. Editorial moments on marketing surfaces; quiet inside the product |
| **Density** | `5` | Balanced. Signal readouts and session data need room, but clinicians expect information on one screen. Dashboards may locally push to `7` |
| **Variance** | `6` | Offset asymmetric layouts. Enough to avoid template feel without undermining clinical credibility |
| **Motion Intent** | `4` | Fluid CSS. Motion confirms state and shows live data. It never decorates |

> Marketing pages run at the upper end of these dials. Clinical and data views (session review, reports, device status) run at the lower end: less variance, less motion, more density.

---

## 1. Visual Theme & Atmosphere
A calm, lab-grade interface with confident offset layouts and restrained, purposeful motion. The atmosphere is clinical but human: a well-lit neuroscience lab with good daylight, not a sci-fi cockpit. Every element earns its place through function. Data is the hero, and the chrome around it stays quiet. The overall impression: precise, trustworthy, alive with real signal.

Brain imagery is never glowing, neon, or "electric". Neural data is shown as what it is: clean waveforms, spectra, and topographic maps on neutral ground.

## 2. Color Palette & Roles
- **Canvas Mist** (#F8FAFA) — Primary background surface. Barely-cool neutral that sits with the accent
- **Pure Surface** (#FFFFFF) — Card, panel, and chart-container fill
- **Graphite Ink** (#18181B) — Primary text and headlines. Zinc-950 depth, never pure black
- **Steel Secondary** (#71717A) — Body copy, descriptions, axis labels
- **Muted Slate** (#A1A1AA) — Tertiary text, timestamps, disabled states, gridlines
- **Hairline Border** (rgba(228,228,231,0.7)) — Panel borders, table rules, 1px structural lines
- **Diffused Shadow** (rgba(24,24,27,0.05)) — Elevation only. `0 20px 40px -15px`, never harsh
- **Cortex Teal** (#0F766E) — The single accent. Primary CTAs, active states, focus rings, the live-signal trace. Saturation 77%

### Status colors (functional only, never decorative)
- **Signal Good** (#15803D) — Electrode contact good, session complete
- **Signal Caution** (#9A6B1F) — Impedance high, recording degraded
- **Signal Fault** (#B91C1C) — Contact lost, error text, destructive actions

Status colors appear only as small indicators (dots, 2px underlines, inline text). They never fill large surfaces and never compete with Cortex Teal.

### Banned Colors
- Purple/violet/electric-blue "AI brain" glows and neon gradients
- Pure Black (#000000) — use Graphite Ink
- Any accent above 80% saturation
- Mixing warm grays with this cool-zinc system

## 3. Typography Rules
- **Display:** `Geist` — Track-tight (`-0.025em`), weight 600–700, leading `1.1`. Hierarchy through weight and color, not huge size. Scale `clamp(2.25rem, 5vw, 3.5rem)`
- **Body:** `Geist` 400 — Leading `1.65`, max 65ch, Steel Secondary (#71717A). Minimum `1rem`
- **Mono:** `Geist Mono` — Signal values, channel labels (`Fp1`, `Cz`, `O2`), timestamps, sample rates, device IDs. Metadata at `0.8125rem`
- **Numbers:** In dashboards and reports every numeric reading uses `Geist Mono` with tabular figures, so columns of µV, Hz, and kΩ values align
- **Units:** Always shown, always in Muted Slate, separated by a thin space: `12.4 µV`, `8–13 Hz`, `4.7 kΩ`

### Banned Fonts
- `Inter` — everywhere
- All serif fonts — this is a software and clinical product; no serif in any UI surface
- Default system stacks as the primary face

## 4. Component Stylings
* **Buttons:** Flat, no glow. Primary: Cortex Teal fill with white text. Secondary: 1px Hairline Border outline, Graphite Ink text. Active: `scale(0.98)`. Hover: slight background darkening. Destructive actions use Signal Fault text on an outline button and always require confirmation
* **Cards / Panels:** Rounded `1.5rem` on marketing surfaces, `0.75rem` inside the product. Pure Surface fill, Hairline Border, Diffused Shadow. Use only when elevation communicates hierarchy. Dense data views replace cards with `border-top` dividers
* **Signal Plots:** Pure Surface background, Muted Slate gridlines at 40% opacity, traces in Graphite Ink. The trace currently selected or streaming live is Cortex Teal. Channel labels in Geist Mono on the left axis. No 3D, no glow, no gradient fills under traces
* **Status Indicators:** 8px dot plus a text label. Never color alone (accessibility and clinical safety)
* **Inputs / Forms:** Label above, helper text optional, error text below in Signal Fault. Focus ring Cortex Teal, `2px` with `2px` offset. No floating labels. `0.5rem` gap in the label–input–error stack. Consent and medical-history forms: one question group per view
* **Tables:** Row rules only, no vertical lines. Numeric columns right-aligned in Geist Mono
* **Navigation:** Sticky, horizontal on desktop with generous spacing. Current device or session status is always visible in the nav bar
* **Loaders:** Skeletal shimmer matching the final layout, including plot areas. No circular spinners
* **Empty States:** A short composition that says what goes here and how to get it: "No sessions yet. Pair a headset to record your first baseline."
* **Error States:** Inline and contextual, with a clear recovery action. Device errors say which electrode or connection failed

## 5. Hero Section (marketing surfaces)
- **Inline Image Typography:** Small, rounded visuals at type-height between headline words: a waveform snippet, a headset photo, a topographic map thumbnail. Example: "Read the brain [waveform] as clearly as [topomap] the heart"
- **No Overlapping:** Text never sits on top of images. Every element has its own spatial zone
- **No Filler Text:** No "Scroll to explore", scroll arrows, or bouncing chevrons
- **Asymmetric Structure:** Centered heroes are banned. Use left-aligned text with a right-side visual (live signal preview or product shot), or a 60/40 split
- **One CTA:** A single primary action ("Request a pilot", "Join the study"). No secondary "Learn more"
- **Claims discipline:** No efficacy or diagnostic claims in the hero that are not backed by cleared indications or published evidence. Say "research use" where that is the status

## 6. Layout Principles
- **Grid-First:** CSS Grid for structure. No `calc()` percentage hacks
- **No Overlapping:** No absolute-positioned content stacking
- **Feature Sections:** No "3 equal cards" rows. Use 2-column zig-zag or an asymmetric bento (`2fr 1fr`)
- **Containment:** `max-width: 1400px`, centered. Padding `1rem` mobile, `2rem` tablet, `4rem` desktop
- **Full-Height:** `min-height: 100dvh`, never `100vh`
- **Dashboards:** Left: session / patient list. Center: signal viewer (largest zone). Right: metrics and annotations. Collapses to tabs below 1024px

## 7. Responsive Rules
- **Single-column below 768px.** No exceptions
- **No horizontal page scroll.** Signal plots scroll horizontally inside their own container on mobile, never the page
- **Type:** Headlines scale via `clamp()`. Body never below `1rem`
- **Touch Targets:** Minimum `44px`. Buttons full-width on mobile
- **Inline hero images** stack below the headline on mobile
- **Navigation:** Collapses to a labeled mobile menu. Device status stays visible
- **Section spacing:** `clamp(3rem, 8vw, 6rem)`
- **Test at:** 375px, 390px, 768px, 1024px, 1440px

## 8. Motion & Interaction (Code-Phase Intent)
> Stitch generates static screens. This section tells the coding agent how to implement motion when building the exported design.

- **Physics:** Spring-based, `stiffness: 100, damping: 20`. No linear easing on UI elements
- **Live Data is the motion:** The streaming signal trace is the primary moving element. Nothing else animates while a recording is active
- **Micro-Loops:** Pulse on the "recording" and "connected" status dots only. No decorative floating icons
- **Staggered Reveal:** Lists and session history mount with `60ms` cascade delays
- **Hardware Rules:** Animate only `transform` and `opacity`. Render signal plots to canvas/WebGL, not animated DOM
- **Reduced Motion:** Respect `prefers-reduced-motion`. Pulses become static indicators; the live trace still updates
- **Performance:** 60fps target while streaming. Isolate animation in leaf components

## 9. Anti-Patterns (Banned)
- No emojis anywhere, including alt text
- No `Inter`, no serif fonts
- No pure black (#000000)
- No glowing brains, neon neurons, lightning bolts, or purple/blue "AI" gradients
- No neon outer glows or glowing box-shadows
- No accents above 80% saturation
- No gradient text on headlines
- No custom mouse cursors
- No overlapping elements
- No 3-column equal card layouts
- No centered heroes
- No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- No generic names ("John Doe", "Acme", "Nexus"). Use realistic, diverse sample data: "Priya Raman", "Tomás Okafor"
- No fake round numbers (`99.99%`, `50%`). Use organic values: `87.3%`, `12.4 µV`, `256 Hz`
- No copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize", "Unlock your brain"
- No unsupported clinical claims ("diagnoses", "cures", "clinically proven") without evidence and regulatory basis
- No color-only status signals — always pair with text
- No broken Unsplash links. Use `picsum.photos/seed/{id}/800/600` or SVG avatars
- No default `shadcn/ui` styling. Customize radii, colors, and shadows to this system
- No `z-index` spam. Only nav, modal, and overlay layers
- No `h-screen`. Always `min-h-[100dvh]`
- No circular spinners. Skeletal shimmer only

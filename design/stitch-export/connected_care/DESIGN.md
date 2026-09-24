---
name: Connected Care
colors:
  surface: '#FFFFFF'
  surface-dim: '#d5dbdf'
  surface-bright: '#f5faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4f9'
  surface-container: '#e9eef3'
  surface-container-high: '#e4e9ee'
  surface-container-highest: '#dee3e8'
  on-surface: '#171c20'
  on-surface-variant: '#434655'
  inverse-surface: '#2b3135'
  inverse-on-surface: '#ecf1f6'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#4d5f7d'
  on-secondary: '#ffffff'
  secondary-container: '#c8dbfe'
  on-secondary-container: '#4e607e'
  tertiary: '#2e465e'
  on-tertiary: '#ffffff'
  tertiary-container: '#465e77'
  on-tertiary-container: '#bed7f5'
  error: '#B42318'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#b5c7ea'
  on-secondary-fixed: '#071c36'
  on-secondary-fixed-variant: '#364764'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#b0c9e6'
  on-tertiary-fixed: '#011d33'
  on-tertiary-fixed-variant: '#314961'
  background: '#f5faff'
  on-background: '#171c20'
  surface-variant: '#dee3e8'
  primary-hover: '#1E40AF'
  border-subtle: '#D9E5F2'
  control-border: '#7184A0'
  accent-soft: '#EAF2FF'
  error-surface: '#FEF3F2'
  warning: '#92400E'
  warning-surface: '#FFFBEB'
typography:
  display:
    fontFamily: Inter
    fontSize: 3.75rem
    fontWeight: '700'
    lineHeight: '1.08'
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.12'
    letterSpacing: -0.02em
  heading-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  heading-lg-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.015em
  heading-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  heading-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0em
  data:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0em
  metadata:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a calm, clinical, and reassuring visual environment tailored for neurological care. The experience balances precision for medical professionals with emotional safety, legibility, and simplicity for patients and caregivers navigating complex, stressful conditions. 

The aesthetic sits at the intersection of **Minimalism** and **Corporate / Modern**, guided by the principle of "one clear next step." By avoiding tech flashiness, sensory overload, and complex analytical dashboards, the interface projects trust, medical authority, and human warmth. 

Visual design is structured around high tonal separation, generous whitespace, legible typographic sizing, and the signature linear motif that guides users sequentially through their care journey without friction.

## Colors

The color palette is strictly light-mode focused, constructed to ensure WCAG 2.2 AA accessibility across all interactive states and typographic surfaces.

- **Primary (`#1D4ED8`)**: A vibrant, purposeful cobalt blue reserved for primary calls-to-action, key task initiations, active navigation states, and interactive links.
- **Secondary (`#0B1F3A`)**: Deep oceanic navy anchoring structural typography, wordmarks, footer surfaces, and high-contrast section backgrounds.
- **Tertiary (`#465E77`)**: Balanced slate gray for secondary typography, supporting metadata, and non-critical guidance.
- **Neutral (`#F2F7FC`)**: Soft, pale blue-gray canvas that frames white interactive cards, providing soft contrast without the glare of uncalibrated displays.
- **Surface (`#FFFFFF`)**: Pure white base for patient cards, workspace panels, and primary inputs.
- **Semantic Tokens**:
  - `error` (`#B42318`) on `error-surface` (`#FEF3F2`): Strictly reserved for blocking technical errors, irreversible destructive actions, or critical system failures. It must never be used to represent clinical test outcomes or health deterioration.
  - `warning` (`#92400E`) on `warning-surface` (`#FFFBEB`): Used for cautionary process notices and scheduling alerts.
  - `accent-soft` (`#EAF2FF`): Non-alarming informational state background and selected item pill fill.

## Typography

The typographic hierarchy prioritizes immediate visual comprehension and accessibility, utilizing **Inter** for its neutral geometry and high legibility at all scales.

- **Patient-First Legibility**: Main explanations, patient portals, and instructional modules utilize `body-lg` (18px) with a relaxed 1.6 line-height to reduce visual strain and cognitive load.
- **Data & Precision**: Clinical metrics, numerical lab values, and timestamps use `data` with tabular figures enabled (`font-variant-numeric: tabular-nums`) to ensure vertical column alignment across records.
- **Editorial Headings**: Tight tracking on large headers conveys medical precision and confidence, scaling down gracefully for mobile viewports to prevent awkward line breaks.

## Layout & Spacing

The layout model is governed by an **8px base grid** with a 4px micro-increment, structured to prevent claustrophobic density and maintain a serene, reassuring pace.

- **Grid Architecture**: 
  - Desktop uses a 12-column fluid grid capped at `1200px` max width with `24px` (`gutter`) spacing and `32px` (`margin`) outer margins.
  - Tablet scales to an 8-column layout with `24px` gutters and `24px` margins.
  - Mobile compresses to a 4-column layout with `16px` gutters and `20px` margins (adjusting to `16px` on narrow screens ≤320px).
- **Reading Constraints**: Long-form editorial content and clinical explanations are strictly limited to a `680px` maximum reading width to optimize line length and saccadic eye travel.
- **Vertical Rhythm**: Major sections breathe with `96px` desktop spacing, `64px` tablet spacing, and `48px` mobile spacing.
- **Touch & Accessibility Boundaries**: All interactive elements strictly adhere to a minimum height of `48px` and a minimum interaction boundary of `44px × 44px`.

## Elevation & Depth

Visual hierarchy is communicated predominantly through **tonal layering** and **low-contrast outlines** rather than deep, heavy drop shadows. Frosted glass, chromatic glows, and skeuomorphic gradients are deliberately excluded to preserve clinical sobriety.

- **Level 0 (Flat)**: Standard layout canvas `#F2F7FC` with white card panels sitting directly on it, delineated by `#D9E5F2` hairline borders.
- **Level 1 (Subtle Lift)**: `0 4px 20px rgba(11, 31, 58, 0.05)`. Applied sparingly to elevated action modules, such as the single "Next Step" card or interactive preview overlays, indicating primacy without visual distraction.
- **Level 2 (Overlay / Flyout)**: `0 16px 48px rgba(11, 31, 58, 0.12)`. Used solely for modals, dialogs, and mobile navigation overlays.
- **Focus States**: High-visibility focus indicators utilize a `3px` solid stroke of `#1D4ED8` with a `3px` offset on light surfaces, ensuring effortless keyboard and assistive technology navigation.

## Shapes

The shape system employs deliberate, soft geometry to communicate approachability without compromising structural rigor.

- **Interactive Controls (10px / `rounded-md`)**: Buttons, input containers, and active navigation pills use a 10px radius, striking a balance between clinical structure and ergonomic softness.
- **Cards & Modules (16px / `rounded-lg`)**: Primary cards, hero containers, and the "Next Step" module use a 16px radius.
- **Status Badges & Tags (6px / `rounded-sm`)**: Status chips and informational markers use a tighter 6px radius to maintain distinct visual semantics from buttons.
- **Circular Indicators (Full / `9999px`)**: Fully rounded shapes are reserved exclusively for avatars, numeric progress nodes, and the Careline checkpoint markers. Full pill buttons are explicitly prohibited to prevent confusion with status badges.

## Components

### Buttons
- **Primary**: Background `#1D4ED8`, text `#FFFFFF`, radius `10px`, minimum height `48px`, horizontal padding `24px`. Hover state deepens to `#1E40AF`.
- **Secondary**: Background `#FFFFFF`, text `#1D4ED8`, border `1.5px solid #D9E5F2`, radius `10px`. Hover transitions to `#F2F7FC`.
- **Destructive**: Background `#B42318`, text `#FFFFFF`. Reserved strictly for irreversible clinical or administrative deletions.
- **Focus State**: `3px` outline `#1D4ED8` offset by `3px`.

### Cards & "Next Step" Modules
- **Surface Cards**: Background `#FFFFFF`, border `1px solid #D9E5F2`, border-radius `16px`, padding `24px` (`32px` on desktop).
- **Care Next-Step Card**: Elevated container featuring a subtle `0 4px 20px rgba(11, 31, 58, 0.05)` shadow, an informational header tag (`accent-soft`), high-contrast typographic instructions, and a clear single-action button.

### Form Inputs & Controls
- **Input Fields**: Background `#FFFFFF`, border `1px solid #7184A0`, height `48px`, border-radius `10px`, horizontal padding `16px`. Text rendered in `#0B1F3A` with placeholder in `#465E77`.
- **Active Focus**: Border switches to `#1D4ED8` with a `3px` matching translucent focus ring.
- **Checkboxes & Radios**: Minimum target size `44px × 44px` with a visible `20px` control square or circle.

### Badges & Status Chips
- **Informational**: Background `#EAF2FF`, text `#1E40AF`, radius `6px`, padding `4px 10px`, typography `label` (scaled to 13px/14px).
- **Warning**: Background `#FFFBEB`, text `#92400E`.
- **System Error**: Background `#FEF3F2`, text `#B42318`.

### The Careline Motif
- A sequential, linear visual spine linking diagnosis, care planning, and ongoing clinical monitoring. Built with a continuous `2px` vertical or horizontal stroke (`#D9E5F2`), highlighted along completed stages with `#1D4ED8`, featuring numbered or iconographic circular checkpoints (`32px` diameter) that clearly signal current patient progress.
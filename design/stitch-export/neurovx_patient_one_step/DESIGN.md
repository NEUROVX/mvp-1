---
version: alpha
name: NeuroVX Patient - One Step
description: A quiet patient interface with one next action and progressive disclosure.
colors:
  primary: '#1D4ED8'
  primary-hover: '#1E40AF'
  on-primary: '#FFFFFF'
  background: '#F8FAFD'
  surface: '#FFFFFF'
  heading: '#0B1F3A'
  body: '#334155'
  muted: '#52647A'
  soft-blue: '#EEF4FF'
  border: '#DBE4F0'
  control-border: '#718096'
  focus: '#1D4ED8'
  error: '#B42318'
  error-surface: '#FEF3F2'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#434655'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#585f68'
  on-secondary: '#ffffff'
  secondary-container: '#dde3ee'
  on-secondary-container: '#5e656e'
  tertiary: '#7f2500'
  on-tertiary: '#ffffff'
  tertiary-container: '#a73400'
  on-tertiary-container: '#ffc9b7'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dde3ee'
  secondary-fixed-dim: '#c1c7d1'
  on-secondary-fixed: '#161c24'
  on-secondary-fixed-variant: '#414750'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832700'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  page-title:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
  task-title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  button:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36.4px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28.8px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 25.2px
  label-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  controls: 10px
  panel: 16px
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  page-top: 56px
  main-width: 720px
  modal-width: 560px
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-xxl: 3rem
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button}'
    rounded: '{rounded.controls}'
    height: 52px
    padding: 16px
  task-panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.body}'
    rounded: '{rounded.panel}'
    padding: '{spacing.xl}'
  field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.body}'
    typography: '{typography.body}'
    rounded: '{rounded.controls}'
    height: 52px
---

# NeuroVX Patient: One Step
A quiet patient/family design. White panels on almost-white blue background. Deep navy headings, slate body text, blue for the main action. 72px header, centered main column up to 720px, generous unused space. No sidebar, no right column, no card grid.
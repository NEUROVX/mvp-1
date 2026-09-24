---
version: alpha
name: NeuroVX - Connected Care
description: A calm, precise, accessible neuroscience care design system. White-led, deep navy and blue;
  role-specific workspaces; one clear next step.
colors:
  primary: '#1D4ED8'
  primary-hover: '#1E40AF'
  secondary: '#0B1F3A'
  surface: '#FFFFFF'
  canvas: '#F2F7FC'
  on-surface: '#0B1F3A'
  muted: '#465E77'
  border: '#D9E5F2'
  control-border: '#7184A0'
  accent-soft: '#EAF2FF'
  error: '#B42318'
  error-surface: '#FEF3F2'
  warning: '#92400E'
  warning-surface: '#FFFBEB'
typography:
  display:
    fontFamily: Inter
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.02em
  heading-lg:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.015em
  heading-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  heading-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  label:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  data:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0em
  metadata:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  page-max: 1200px
  reading-max: 680px
  gutter: 24px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 16px
    height: 48px
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
    textColor: '{colors.surface}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 16px
    height: 48px
  button-destructive:
    backgroundColor: '{colors.error}'
    textColor: '{colors.surface}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    height: 48px
  surface-page:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.on-surface}'
  surface-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  surface-navy:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.surface}'
  body-copy:
    textColor: '{colors.on-surface}'
    typography: '{typography.body-lg}'
  supporting-copy:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.muted}'
    typography: '{typography.body-md}'
  input-field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.md}'
    typography: '{typography.body-md}'
    padding: 16px
    height: 48px
  control-outline:
    backgroundColor: '{colors.control-border}'
    size: 1px
  divider:
    backgroundColor: '{colors.border}'
    size: 1px
  nav-active:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
    typography: '{typography.label}'
  status-info:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.primary-hover}'
    rounded: '{rounded.sm}'
    typography: '{typography.label}'
  status-warning:
    backgroundColor: '{colors.warning-surface}'
    textColor: '{colors.warning}'
    rounded: '{rounded.sm}'
    typography: '{typography.label}'
  status-error:
    backgroundColor: '{colors.error-surface}'
    textColor: '{colors.error}'
    rounded: '{rounded.sm}'
    typography: '{typography.label}'
  next-step:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
---

# NeuroVX - Connected Care

## Overview

### Design contract

**Version:** 1.0 | **Prepared:** 20 September 2026 | **Default mode:** Product prototype, not for clinical use.

This is an original design system and product-experience brief, not an extraction from an existing NeuroVX interface. Use it as the persistent design context for Stitch. YAML values are the exact tokens; the prose explains how to use them. Generate only the screen or flow requested, not the entire ecosystem at once. The structure follows Google's DESIGN.md format. [R1]

NeuroVX is being developed as an India-first neuroscience care infrastructure, with an intended software-as-a-medical-device direction. It connects patients and families with clinicians, diagnostic laboratories, longitudinal care, learning and, eventually, separately governed research and support services. Begin with memory and cognitive concerns; do not imply that every neurodegenerative condition is already supported.

**Internal ambition:** A Tempus-like connected ecosystem for neurodegenerative care.

**Public promise:** Help people understand and complete their next care step.

**Core experience:** One patient journey. Different workspaces. Clear permissions.

Do not describe NeuroVX as approved, cleared, clinically validated or commercially available without verified, release-specific evidence. A disclaimer does not determine whether a function is a medical device. Clinical, regulatory, privacy and human-factors review remain necessary before deployment. This document specifies a design direction, not compliance certification. [R7]

### The emotional objective

A patient should feel: "I understand where I am, what happens next, and who can help."

A clinician should feel: "The important information is here, with its source."

A laboratory should feel: "The order is clear and I know what needs action."

A research team should feel: "The data's provenance, limits and permitted uses are visible."

Make the interface reassuring through clarity, not through promises of recovery. Do not infantilize older people or portray families as helpless. Precision and warmth must coexist.

### Creative direction: the Careline

The signature visual idea is a **Careline**: a quiet blue line joining a small number of real care checkpoints. It represents continuity between a concern, an appointment, a result and a follow-up. On the public site it is a restrained editorial motif; inside the product it becomes the patient timeline.

Use thin lines, small outlined nodes, ample white space and one emphasized current step. It is not an EEG trace, a brain scan, a disease-severity curve or an invented medical measurement. It must never resemble evidence that a patient is improving.

Avoid generic SaaS dashboard walls. Alternate generous typography, a few purposeful product previews and compact task lists. The product should look carefully engineered, not crowded with features.

### What the references contribute

- **Tempus:** Learn from the separation of patient, provider and life-sciences needs, and the connection between clinical information and research workflows. Borrow the product architecture, not its claims, scale or datasets. [R4]
- **MindMaze Therapeutics:** Learn from presenting software, devices and therapy as a connected care ecosystem. Borrow the sense of continuity, not product imagery or treatment promises. [R5]
- **Altoida:** Learn from focused neurological product storytelling and showing what an assessment experience is for. Do not import diagnostic-performance claims or imply equivalent evidence. [R6]

These are design references, not partners, endorsements or certifications. Create original layouts, language and assets.

### Simplicity rules

1. Each screen answers one primary question and emphasizes one next action.
2. Show a useful summary first; reveal detail when requested.
3. Keep the patient, organization and role context visible.
4. Display facts, reports and clinician decisions separately.
5. Put learning, research and commerce behind intentional entry points.
6. Use the same label for the same action everywhere.

"Interactive" means clear feedback, saved progress and discoverable actions. It does not mean constant motion, gamification or a chatbot on every screen.

### Product scope and availability

| Stage | Design now | Do not imply |
|---|---|---|
| First Stitch iteration | Public homepage, responsive layout, audience routes and product preview | A functioning clinical service or live integrations |
| Core pilot | Patient/care-partner intake, authorized assessment module, clinician summary, appointments, clinician-directed orders, reports and follow-up | Autonomous diagnosis, predictive disease staging or validated outcome improvement |
| Subsequent modules | NeuroLearn, editorial learning, care-support discovery and device information | A medically validated AI adviser or therapeutic recommendation engine |
| Separately governed expansion | Research feasibility, study-site prescreening and optional patient research discovery | Automatic enrollment, guaranteed eligibility, unrestricted sponsor access or assured treatment benefit |

In the prototype, use a readable "Product preview - not for clinical use" label and synthetic information only. Unsupported routes should lead to a clearly labeled concept preview or pilot-contact screen, never a fake working booking, purchase or clinical decision.

## Colors

### Palette and roles

The brand remains **white, deep navy and blue**. Warm safety colors are functional exceptions, not decorative accents.

| Token | Value | Intended use |
|---|---|---|
| `primary` | `#1D4ED8` | Primary action, active navigation and links |
| `primary-hover` | `#1E40AF` | Hover/pressed emphasis and informational status text |
| `secondary` | `#0B1F3A` | Wordmark, strong navy surfaces and footer |
| `surface` | `#FFFFFF` | Main public-page background and content surfaces |
| `canvas` | `#F2F7FC` | Workspace background and occasional section separation |
| `on-surface` | `#0B1F3A` | Headings and main text |
| `muted` | `#465E77` | Readable secondary text, never faint disabled-looking copy |
| `border` | `#D9E5F2` | Decorative dividers and nonessential card edges |
| `control-border` | `#7184A0` | Visible input boundaries and meaningful control outlines |
| `accent-soft` | `#EAF2FF` | Selection background, not a substitute for a label |
| `error` / `error-surface` | `#B42318` / `#FEF3F2` | Blocking errors and destructive actions |
| `warning` / `warning-surface` | `#92400E` / `#FFFBEB` | Important caution requiring attention |

Use white or pale blue for approximately 80% of the public page. Navy establishes hierarchy; saturated blue guides action. Do not put every section on a dark background or use blue for every word.

Completion can use a blue check plus "Completed." Do not depend on green/red to communicate success or disease state. A red status must never mean "Alzheimer's detected."

Target WCAG 2.2 AA contrast: at least 4.5:1 for ordinary text and 3:1 for qualifying large text; meaningful control boundaries and graphics require appropriate non-text contrast. Decorative dividers need not function as control outlines. Test the actual rendered combinations, not just the palette. [R2]

Links in paragraphs are underlined. Keyboard focus uses a visible 3px blue ring with 3px offset on light surfaces; on navy use a white inner separation plus contrasting outer ring. Never remove focus styling.

## Typography

### One family, deliberate hierarchy

Use **Inter** for Latin text. Fallback: `Inter, "Noto Sans", Arial, sans-serif`. For supported Indian scripts, use the appropriate Noto Sans script family and check shaping, line breaks and readability with native-language users. Do not assume Inter covers every script.

| Role | Desktop default | Mobile default | Use |
|---|---|---|---|
| Display | 60px / 1.08 / 700 | 40px / 1.12 / 700 | Homepage headline only |
| Large heading | 36px / 1.2 / 600 | 28px / 1.25 / 600 | Section headings |
| Medium heading | 24px / 1.3 / 600 | 24px / 1.3 / 600 | Page and major card headings |
| Small heading | 20px / 1.4 / 600 | 20px / 1.4 / 600 | Task groups |
| Patient body | 18px / 1.6 / 400 | 18px / 1.6 / 400 | Explanations and instructions |
| Workspace body | 16px / 1.6 / 400 | 16px / 1.6 / 400 | Professional tables and forms |
| Label | 16px / 1.4 / 600 | 16px / 1.4 / 600 | Buttons, controls and status |
| Metadata | 14px / 1.5 / 400 | 16px for patient views | Noncritical professional metadata only |

Treat token sizes as `rem` equivalents at a 16px root, not as a locked root size. Let text enlarge and wrap. Never shrink type to preserve a decorative two-line heading.

Use sentence case. Avoid all-caps navigation, wide tracking on body text, ultra-light weights and center-aligned paragraphs. Use tabular numerals for dates, results and aligned values without switching the whole product to a monospace font.

Patient instructions, consent choices, warnings and test limitations are never tiny footnotes. Keep them at least 16px. The compact metadata style is not permission to hide important information.

### Voice and content precision

Be direct, human and specific. Explain a technical term the first time a patient sees it. Professional views may use precise clinical terminology, but should retain access to original source wording.

| Prefer | Avoid |
|---|---|
| "Your next step" | "Optimize your neurological journey" |
| "Prepare for your visit" | "Unlock actionable insights" |
| "Your report is available" | "Your diagnosis is ready" |
| "Awaiting clinician review" | "Everything looks fine" |
| "Changes over time" | "Your brain is declining" |
| "A study to discuss with your care team" | "Your perfect treatment match" |
| "Not recorded" | "Normal" when information is missing |
| "Ask NeuroLearn" | "Ask your AI neurologist" |
| "Clinician review may be needed" | "Safe for all patients" |

Do not promise the right drug, treatment stage or clinical outcome from software alone. The patient is a person receiving care, not a conversion, a lead or a dataset.

## Layout

### Responsive structure

Public pages use a centered 1200px maximum content width, 12-column desktop grid and 24px gutters. Use 96px major vertical section spacing on wide screens, 64px on tablets and 48px on mobile. Page margins: 32px desktop and 20px mobile; reduce to 16px on very narrow screens.

Use one-column reading layouts up to approximately 680px wide. Professional workspaces may use wider tables, but do not stretch narrative text across the viewport. Use an 8px spacing rhythm with a 4px micro-step.

Reference frames: 1440px desktop, 768px tablet and 390px mobile. Check reflow at 320 CSS pixels and text enlargement. True two-dimensional tables may need labeled horizontal scrolling; the rest of the page must not require it. [R2]

Content, rather than a rigid device list, determines breakpoints. Below approximately 1024px, simplify navigation and stack secondary panels. Never hide a patient's next action behind a horizontally scrolling carousel.

### Navigation architecture

Use one NeuroVX identity and **different role-specific workspaces**. Do not place all roles in one navigation bar. A patient account and a professional account may belong to the same person, but their active context must be explicit.

**Public navigation:** Patients & families | Healthcare partners | Research | Learn | Care & support.

Use text links to landing pages, not a giant mega-menu. Healthcare partners introduces clinicians/hospitals and diagnostic labs. Learn contains guides, articles and NeuroLearn. Care & support contains services and the future devices store. Sign in is a quiet utility link, not a competing hero CTA.

On mobile, use a text-labeled Menu button. Menu items remain visible text links with a clear close action and keyboard behavior. Do not rely on hover.

| Workspace | Primary destinations | Contextual or utility destinations |
|---|---|---|
| Patient / family | Home, My care, Records, Learn, Support | Profile, sharing permissions, messages, optional research opportunities |
| Clinician | Today, Patients, Orders & results, Follow-up | Organization, help, account and access settings |
| Laboratory | Orders, Collections, Results, Exceptions | Organization, authorized users and service settings |
| Hospital operations | Overview, Pathway, Teams, Reports | Aggregate measures by default; no broad clinical access |
| Research / CRO | Overview, Studies, Cohorts, Requests | Governance, permitted datasets and access audit |

Limit primary navigation to five destinations. Use no more than two nested navigation levels for routine tasks. Within a clinician's patient record use Summary, Timeline, Assessments, Results and Care plan. Research is not an extra tab exposing a patient's record to industry.

A patient/care-partner view always identifies whose record is open and in what capacity: "Viewing: Example patient - care partner access." Switching people requires deliberate selection. Never silently switch the patient context after opening a notification.

### Homepage: exact content and composition

Design the homepage first. The long-term ecosystem should be discoverable without becoming the hero's feature list.

**1. Header and hero**

Use a simple NeuroVX wordmark. At desktop width, use a 7/5 editorial split: strong left-aligned copy and one restrained product preview on the right. On mobile, copy and CTA appear first, followed by the preview.

Eyebrow: **Starting with memory and cognitive care**

Headline: **Brain care. Connected.**

Supporting sentence 1: **NeuroVX brings patients, clinicians and diagnostic labs together.**

Supporting sentence 2: **Keep assessments, reports and next steps in one place.**

Primary CTA: **Explore your care journey**

Secondary text link: **For healthcare partners**

Readable prototype label: **Product preview - not for clinical use.**

The broader headline preserves the earlier "Memory care. Connected." direction while allowing the ecosystem to grow. The eyebrow keeps the initial clinical scope explicit.

The right-side preview is a realistic mini-product surface, not an elaborate dashboard:

- Heading: "Your next step"
- Main task: "Prepare for your clinician visit"
- Supporting rows: "Your concerns and history", "Previous reports", "Questions to discuss"
- Quiet Careline beneath: Concerns - Visit - Results - Follow-up
- Caption: "Illustrative product preview"

Use no fabricated diagnosis, biomarker result, clinician endorsement or implied real appointment. The preview should remain useful even with every decorative element removed.

**2. Audience routes**

Heading: **Connected care, built around people.**

Use three equal editorial columns separated by quiet dividers, not a grid of oversized floating cards.

| Audience | Main message | Description | Link |
|---|---|---|---|
| Patients & families | Know what comes next. | Organize concerns, prepare for visits and keep your care information together. | Explore patient care |
| Clinicians & hospitals | See the patient's story together. | Review history, assessments and reports in one organized patient view. | Explore clinical workflows |
| Diagnostic labs | Keep orders and results connected. | Coordinate clinician-requested tests and return reports for review. | Explore lab workflows |

Below these columns, a quiet research line reads: **For research teams: explore a future, separately governed research workspace.** Link: **Explore research**. Do not imply that patient data is already available.

**3. The care journey**

Heading: **A clear next step at every stage.**

Show four checkpoints on the Careline, each with one short sentence:

1. Share your concerns - Record changes you or your family have noticed.
2. Meet a clinician - Bring your history and assessments to the conversation.
3. Complete recommended tests - Coordinate investigations requested by your clinician.
4. Continue your care - Keep reports, support and follow-ups together.

Label testing as conditional; not every patient needs molecular biomarkers. Existing patients may enter at follow-up or support rather than repeat screening. The hero CTA scrolls here; it does not start a hidden health-data collection flow.

**4. Continuity preview**

Heading: **Your care should not start from scratch at every visit.**

Copy: **Bring patient observations, clinical reports and follow-up steps into one continuing record.**

Use one split section: a short paragraph beside three dated, clearly synthetic timeline entries. Show source and review state, not an invented brain-health score. Link: **See an example journey**.

**5. Learning**

Heading: **Understand more. Feel less lost.**

Copy: **Explore clear explanations of memory concerns, assessments and everyday care.**

Show only three editorial items: Preparing for a memory appointment; Understanding cognitive assessments; Supporting someone at home. Mark draft preview content clearly and do not invent reviewer names.

Add one contained NeuroLearn invitation: **Have a question? Ask NeuroLearn.** Supporting text: **An educational guide, not a clinician.** No floating chat window opens automatically.

**6. Trust and pilot contact**

Heading: **Built to support clinical care.**

Copy: **NeuroVX is being developed to organize information and care steps. Clinical decisions remain with qualified healthcare professionals.**

CTA: **Discuss a pilot**. Supporting text: **For patients, families and healthcare partners helping shape NeuroVX.**

Include one plain link explaining the intended separation of care and research. No certification wall, invented customer logos, performance numbers or testimonials.

**Footer:** NeuroVX, the five public destinations, Contact, Privacy, Terms and Accessibility. Link only to real pages or explicitly labeled prototype placeholders. Do not fabricate legal policy text.

### Core patient flow

Explore journey -> choose "For myself" or "Helping someone" -> establish access and consent -> choose "A new concern" or "Continuing existing care" -> concise concern history and clinician-authored urgency check -> appropriate assessment route -> understandable summary -> clinician visit -> clinician-requested tests -> review and follow-up.

A family member may contribute observations without automatically gaining full record access or legal decision-making authority. Access, identity, capacity and any representative arrangements require appropriate verification. Urgent symptoms leave the ordinary booking flow through an approved clinical escalation route.

A person with an existing diagnosis can go directly to records and follow-up. Do not make everyone complete the same screening funnel. Display the current next step, its owner and status; never more than three competing tasks on patient Home.

### Professional and industry flows

**Clinician:** open Today's list -> identify patient -> review a one-screen summary and original sources -> verify or edit information -> record clinical impression -> order appropriate investigations -> review results -> record the next care step. The UI supports judgment; it does not silently convert observations into diagnoses.

**Laboratory:** verify order and patient -> resolve incomplete requests -> arrange collection -> track specimen -> validate and release result through the authorized lab process -> deliver report -> confirm receipt or escalate a delivery failure. Laboratory validation and clinician review are separate states.

**Hospital operations:** view aggregate pathway -> identify delayed tasks -> assign an authorized owner -> track completion. Reveal identifiable details only when necessary and permitted for the staff member's work.

**Research/CRO:** choose an authorized study or feasibility question -> select a permitted dataset -> inspect aggregate results, definitions and missingness -> request site review -> allow authorized site staff to assess potential candidates -> obtain the appropriate separate research permissions. Do not expose identifiable care records to sponsor users by default.

**Care/devices:** browse support by need -> inspect service or device detail -> review practical requirements and any need for clinical advice -> contact/book/buy only through a verified service. A clinical result must not automatically produce a sales offer.

## Elevation & Depth

Use **tonal separation before shadows**. White content on a pale-blue canvas should provide most hierarchy. Dividers are preferable to nesting cards inside cards.

Level 0: no shadow for reading, tables and editorial sections.

Level 1: `0 4px 20px rgba(11,31,58,0.05)` for the hero product preview or a major next-step surface.

Level 2: `0 16px 48px rgba(11,31,58,0.12)` for menus and genuinely necessary dialogs.

Do not use glassmorphism, blurry text backgrounds, neon glows or deep floating-card stacks. Clinical data is always opaque and legible. Never use motion or depth to suggest an unverified clinical alert.

## Shapes

Use 10px corners for controls, 16px for main product surfaces and 6px for compact labels. Fully rounded shapes are reserved for small avatars or the Careline's nodes, not every button and container.

Icons are consistent 20-24px outline forms with approximately 1.75-2px strokes. Use a restrained family such as Lucide where licensing permits. Pair meaningful icons with text. A brain icon is not required to make the product neurological.

Photography is optional, not necessary to complete the design. When used later, show dignified, realistic people and care settings with appropriate permissions. Never imply that a stock subject is a NeuroVX patient or that a photo documents a clinical outcome. Do not reuse imagery from reference brands.

## Components

### Buttons, controls and forms

One filled blue primary button per main task area. Secondary actions are outlined or text links. Destructive controls are distinct, spaced away from routine actions and confirmed when consequences warrant it.

Use 48px minimum button and input height, with at least 44px interaction areas as NeuroVX's own comfort targets. These are intentionally larger than WCAG 2.2 AA's baseline target-size requirement. Allow controls to grow when labels wrap. [R2]

Every input has a persistent label, concise help when needed and a clear required/optional indication. Placeholder text is not the label. Prefer radio buttons for a few visible choices, searchable selection for many choices and checkboxes only for independent selections.

Patient forms ask one concept at a time in short, named sections. Show Back, Continue and Save and leave consistently. Preserve entered information after a validation error. Give inline recovery instructions and an error summary for longer forms. Do not use punitive countdowns or repeated demands for information already supplied.

Use visible states: Not started; In progress; Saved; Sending; Could not save. Only say "Saved" after persistence succeeds. Do not store unprotected health data in browser local storage as a shortcut for offline support.

### The next-step card

This is the most important shared patient component.

Structure: status -> task title -> one sentence explaining why -> date or preparation details when verified -> named responsible person/team when known -> one action.

Example copy:

- Label: **Your next step**
- Title: **Prepare for your clinician visit**
- Body: **Review your concerns and bring any previous reports.**
- Action: **Review visit details**

States include assessment in progress, appointment requested, appointment confirmed, tests requested, results available, clinician review pending and follow-up planned. Do not label a request as a confirmed appointment. Do not equate a released report with a reviewed report.

### Patient summary and clinician review

Start with presenting concern, onset, source of history, functional change and important missing information. Follow with assessments, relevant history, investigations and the last documented plan. Let clinicians open original responses and source reports.

Label every generated summary **Draft summary - review required**. Provide edit, compare-with-source and accept controls with author/time provenance. A neat paragraph must not hide missingness, uncertainty or contradictory accounts.

Keep "Patient reported", "Care partner reported", "Laboratory reported" and "Clinician documented" distinct. The clinician's diagnosis is not a field automatically filled from a screening score.

### Assessments and their results

Render only authorized assessment content, using the validated language and administration mode. Record instrument/version, date, respondent, assistance, completion and validity. Do not invent questions, a composite NeuroVX score or unlicensed copies of instruments.

Design an accessible surrounding workflow, but do not silently change stimuli, timing, prompts, audio, scoring or assistance rules of a validated test. A clinician-approved alternative route may be needed when the assessment cannot be completed appropriately.

Patient-facing results should explain what was completed, its limits and the next step. Distinguish **incomplete**, **not interpretable**, **needs clinical evaluation** and any instrument-authorized outcome. "Could not complete" is not "cognitive impairment."

Never display an unsupported Alzheimer's probability, brain age, countdown to dementia or severity badge. Allow people with persistent concerns to seek care even when a brief assessment does not identify difficulty.

### Orders, laboratory reports and critical results

A laboratory order shows patient identity, ordering clinician, requested test, specimen requirements, collection status and a clear task owner. Request clarification rather than guessing an ambiguous order.

A report retains original document, laboratory, exact assay/platform, specimen, collection and report dates, result, units, assay-specific interpretation, quality flags and amendment history. Do not replace original interpretation with an AI label.

Keep operational states distinct: Order received; Needs clarification; Collection arranged; Collected; Specimen received; Processing; Lab report released; Delivery confirmed; Clinician reviewed. A corrected report is a new version, not an invisible overwrite.

Critical results require an approved human-owned notification and acknowledgment process with escalation, not just a colored dashboard badge. NeuroVX must not imply emergency monitoring that has not been staffed and validated. Define who is accountable when delivery fails.

Patients should have understandable access consistent with applicable law and the provider's validated policy. Do not invent blanket restrictions that withhold all reports until a clinician opens them. When unreviewed results are visible, state that clearly and provide a safe next step.

### Longitudinal record and progression displays

The timeline is a chronological list before it is a chart. Each item shows event type, date, source, review state and action when needed. Filters use plain labels: Visits, Assessments, Tests, Care and Notes.

Keep these layers separate: subjective changes; instrument-specific scores; daily functioning; biomarkers/imaging; clinician interpretation; treatments and care events. A disease-stage label must be clinician-recorded, dated and sourced, not extrapolated from one measurement.

Use line charts only for meaningfully comparable observations. Display the instrument/assay, units and dates. Break series when methods change; do not silently connect different instruments, normalize unrelated scales or fill missing results with zero. Do not smooth a few observations into a predicted disease trajectory.

Missing, incomparable and pending data have explicit states. Show uncertainty or measurement limitations where known. A falling score is not automatically treatment failure; a laboratory flag is not an Alzheimer's diagnosis.

Patient view: simple explanation and next step. Professional view: expandable detail, data provenance and method-specific comparisons. Never show fabricated improvement or decline in public product illustrations.

### Care-partner access and sharing

Present permissions in ordinary language: Help with bookings; Contribute observations; View care plan; View selected reports. Verify the person's authority and the patient's applicable choices rather than assuming family relationship grants access.

Show who can access which information, the purpose and how access is managed. Revoking future access does not promise deletion of records already lawfully retained or downloaded. Treat research permissions separately from clinical care and care-partner sharing.

Before sending a report, confirm patient, recipient, document and purpose. Notifications outside the app should be discreet by default: "You have a new update", not a diagnosis or biomarker value on a shared lock screen.

### NeuroLearn: education, not a second clinician

Use one consistent name: **NeuroLearn**. The entry label is **Ask NeuroLearn**; the descriptor is **Your guide to understanding brain care**.

Keep it in Learn and beside relevant educational articles. On desktop, it may open as a user-requested reading pane; on mobile, use a dedicated screen. Never auto-open, cover a result or compete with an urgent task.

Initial screen:

- Title: **What would you like to understand?**
- Prompt examples: **What happens at a memory appointment?**; **What does a cognitive assessment measure?**; **How can I prepare questions for a clinician?**
- Visible limit: **NeuroLearn provides education, not a diagnosis or treatment plan.**

Responses start with a short answer and allow expansion. Provide inspectable source links, source dates where relevant and a way to report a concern. Do not fabricate citations or medical reviewer identities. When sources are insufficient or conflict, make that limitation visible.

Keep general education separate from record-specific explanations. Access to a selected report must be explicit and minimized; never silently feed the entire medical record into the assistant. Offer **Save a question for my clinician** rather than allowing the assistant to prescribe, change medication, assign disease stage or establish trial eligibility.

Urgent symptom language triggers a clinician-authored safety response, not ordinary educational chat. Never recommend a store item because the conversation reveals fear, decline or vulnerability. No sales, trial enrollment or research-consent prompts inside a medical explanation.

Use a discreet typographic identity or simple book/spark symbol, not a pretend doctor avatar. Provide Clear chat, privacy controls and transparent retention information that reflects the implemented system.

### Learn, articles and blogs

The Learn hub has four simple views: **Guides**, **Articles & updates**, **Ask NeuroLearn**, **Saved**. On mobile, avoid an overflowing horizontal tab strip; use a clear view selector when necessary.

Separate evergreen patient guides from news, research updates, personal stories and company announcements. A blog post is not a clinical guideline. Label sponsored content and keep it out of clinical instructions.

Article cards show title, topic, content type, publication/update date and reviewer only when genuinely verified. Add reading time only when calculated from the actual content. The article begins with a brief summary and uses descriptive headings, optional glossary and readable source references.

Offer text-size adjustment, print and read-aloud where implemented appropriately. Warn before any external voice-processing service receives sensitive content. Do not require an account to read basic public education.

### Research, pharma and CRO workspace

Research expands the ecosystem; it does not change the patient into inventory.

Provide separate study contexts and access controls. A sponsor view begins with approved aggregate feasibility, dataset scope, relevant dates, definitions and missing-data information. Apply governance-approved disclosure controls, including small-cell protection. De-identified, pseudonymized and anonymous are not interchangeable labels.

A cohort result is not a medically eligible patient list. Authorized site staff can review potential matches against current protocols. Label the output **Potential match - site review required** and distinguish verified criteria, unmet criteria and unknown criteria. Always expose the protocol/version and source dates.

Research use requires the applicable lawful basis, ethics approvals, agreements, safeguards and permissions; a consent toggle alone is not sufficient. Separate permission to contact about research from consent to a particular study. No checked-by-default research choices or reduced care for declining.

Patient study information must state the purpose, location, contact, recruitment status/verification date, expected commitments, uncertainties and the fact that eligibility and enrollment require site assessment. Research participation does not guarantee access to an effective therapy or personal benefit.

Do not auto-enroll, contact patients for sponsors without authority, imply that monitoring scores are validated trial endpoints, or permit unrestricted exports. A research badge must never appear as a clinical diagnosis.

### Care support and the devices store

Place services and devices under **Care & support** publicly and **Support** in the patient app. They are intentionally discoverable, not pushed into assessment results.

Services can be organized by the person's task: support at home, rehabilitation, caregiver education or help finding a provider. Display scope, credentials where verified, delivery mode, availability, fees and contact. Do not label a provider "best" without a defensible basis.

For future device listings, show intended use, manufacturer/model, verified seller, practical requirements, relevant warnings, prescription/clinician involvement when applicable, jurisdiction-specific regulatory information only when verified, price, returns, warranty and support. Separate wellness products from medical/therapeutic devices.

Use a calm catalog, not an aggressive shopping feed. Default sorting should be transparent, such as category or name; do not infer therapeutic suitability from commercial popularity. Disclose paid placement and commercial relationships.

No countdown offers, miracle-cure copy, disease-triggered upsells or "recommended for your Alzheimer's stage" without an appropriately validated and governed clinical function. Do not prefill a cart from a lab result. Patient data must not become advertising targeting data.

### Tables, search and operational views

Professional tables prioritize the next task: patient or order identifier, status, responsible person and due date. Keep essential identity context visible when opening details. Use legible row heights, named actions and keyboard navigation; no icon-only action cluster.

Search is scoped to the active workspace and authorized records. State its scope in the label. Do not expose names, diagnoses or reports through public site search or unrestricted autocomplete.

Hospital measures should describe pathway completion and workload, not rank patients by commercial value. Research and hospital aggregate views should make date ranges and denominators visible.

### Empty, loading and failure states

| State | Required response |
|---|---|
| No reports | "No reports added yet." Explain how to add one or continue without it. |
| Appointment requested | "Request sent. Confirmation is pending." Do not display a confirmed time. |
| Upload failed | Preserve safe progress; show file-specific recovery and retry. |
| Connection lost | Explain what is and is not saved; provide a clear resume route. |
| Report not reviewed | Display the review state and responsible team's next step. |
| No study information | "No study options are available here right now." Do not imply none exist elsewhere. |
| Permission denied | Explain the access boundary without revealing private content. |
| Service unavailable | Give an honest alternative; never show a false success screen. |

Loading indicators describe the operation, not a fabricated medical analysis. Do not use "Scanning your brain" for a questionnaire or "Analyzing Alzheimer's" for file upload.

### Motion and feedback

Use 120-180ms fades or state transitions for ordinary feedback. Respect reduced-motion preferences. Avoid parallax, autoplay, carousels, animated biomarker lines and scroll-jacking. Moving focus follows explicit user action and remains predictable.

Use dialogs only for consequential confirmation or a genuinely focused task. Inline panels are better for ordinary details. Support keyboard access, focus return, escape where appropriate and screen-reader announcements that do not interrupt reading unnecessarily.

## Do's and Don'ts

**Do:** show the next step, preserve patient context, keep source provenance, state uncertainty, allow assisted use, separate care/research/commerce, make recovery easy, and show only available capabilities.

**Do not:** build a universal dashboard, use "AI" as a substitute for a purpose, copy brand claims, fabricate partners or performance, gamify clinical scores, turn every result into a product recommendation, or hide key information behind decoration.

### Accessibility and cognitive-usability checks

Target WCAG 2.2 AA and use W3C cognitive-accessibility guidance as additional design input. Conformance still requires implementation testing; attractive screens are not evidence of accessibility. [R2][R3]

Check keyboard order, visible focus, semantic headings, accessible names, form labels, zoom/reflow, error recovery and consistent help. Provide alternatives to authentication steps that impose unnecessary memory burdens; allow appropriate password-manager and paste support. Explain session-expiry risk and preserve progress safely where feasible.

Use short instructions, familiar words, stable navigation and forgiving forms. Do not rely only on remembering an instruction from an earlier screen. Test with the intended users, including people with cognitive concerns, caregivers, people using assistive technology and supported language groups. Accommodations must not invalidate the selected clinical assessment.

### Clinical design release gates

Before real clinical use, assign owners to intended use, instrument permissions, clinical protocols, access rules, escalation, incident handling and version changes. Conduct risk-informed human-factors work around critical tasks such as patient selection, ordering, report interpretation and urgent escalation. [R7]

Prototype labeling is not a substitute for clinical governance. Neither a design review, a usage metric, an ABDM-style badge nor a clinician testimonial establishes SaMD approval or diagnostic validity.

### India-first implementation considerations

Support family-assisted use without requiring a smartphone-owning patient. Offer clinic-assisted workflows, manual city/postcode selection and language choice. Do not require precise location for basic browsing or force ABHA creation in the initial prototype.

Plan for variable connectivity and affordable devices, but do not advertise offline capability before it exists. Avoid automatic downloads of large reports and videos. Show dates unambiguously, such as `20 Sep 2026`, with time zone where relevant. Preserve laboratory units and do not silently convert reference limits.

Use actual local-language validation and native-speaker review, not automatic translation alone for clinical instruments or consent. Keep future interoperability work behind verified integrations; do not invent government affiliations.

## Stitch Handoff

### How to apply this file

Import this as the project's DESIGN.md/design-system context where supported, or provide it as project context. Keep the same tokens across screens. Do not treat every later module as a request to generate it immediately. Google's DESIGN.md and Stitch tooling are evolving; use the documented import/design-system workflow available in the current environment. [R1][R8]

Do not invent a Stitch project ID or claim that the file has been applied to a project unless that action actually succeeds.

### First generation prompt

```text
Use the attached NeuroVX DESIGN.md as the design source of truth.

Create only the public homepage in desktop (1440px) and mobile
(390px) layouts. Follow the exact homepage copy and section order
under Layout. Use the navy, blue and white tokens and Inter type.

Lead with "Brain care. Connected." and the two supporting sentences.
Make the first screen immediately clear to patients/families,
clinicians/hospitals and diagnostic labs. Use the editorial split
hero and one calm "Your next step" product preview.

The Careline is the subtle visual signature, not a medical signal.
Keep research, NeuroLearn and care/devices discoverable without
turning the page into an all-features dashboard. Label future
capabilities and the prototype honestly.

Do not create clinical scores, approval badges, testimonials,
partner logos, working purchases or unsourced medical claims.
Do not generate other pages yet.

Prioritize readable type, strong contrast, whitespace, one primary
action and clear mobile reading order. Add annotations for link
routes and interactions rather than inventing live services.
```

### Subsequent generation order

1. Patient Home with one next step, plus an existing-care variant.
2. New-concern intake and authorized care-partner flow.
3. Assessment shell, limitations and patient summary; no invented instrument content.
4. Clinician patient summary, original-source view and review action.
5. Order/result workflow and laboratory exceptions.
6. Patient timeline and follow-up handoff.
7. Learn hub, article and NeuroLearn education states.
8. Separate care/devices and research concept screens only after the core is coherent.

For each request, specify role, task, starting state, intended action and endpoint. Generate normal, empty, error and restricted-access states for critical screens. Review one journey before expanding navigation.

### Prototype evaluation

Before styling more screens, ask people to identify what NeuroVX does, where they belong and what the primary action will do. Check that they do not mistake it for a diagnostic quiz, a brain-training game, a device store or a trial-enrollment service.

Observe an uninterrupted task: a caregiver prepares for a visit; a clinician finds the history source; a lab resolves an incomplete order. Measure completion, misclicks, time, support required and mistaken clinical interpretations. Do not set conversion goals that reward inappropriate testing.

Proposed design acceptance criteria, not validated benchmarks: users can find their route without coaching; the next action is clear; test availability and clinician review are distinguishable; care-partner context is recognized; and research/store features do not distract from the care task.

Usability, willingness to pay, clinical validity and patient benefit require different evidence. A polished Stitch prototype answers none of those alone.

## Evidence and Source Notes

Most instructions above are original NeuroVX design decisions, not claims about existing product capabilities. The references below inform format, accessibility, human-factors practice and the requested inspiration. Checked 20 September 2026. Reference websites are not endorsements of NeuroVX.

- **[R1] Google Labs, DESIGN.md format and tooling.** Machine-readable tokens plus human-readable design rationale. https://github.com/google-labs-code/design.md and https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
- **[R2] W3C, How to Meet WCAG 2.2.** Accessibility success criteria; product-specific larger sizing targets are identified separately. https://www.w3.org/WAI/WCAG22/quickref/
- **[R3] W3C, Supplemental Guidance to WCAG.** Cognitive-accessibility design patterns, distinct from normative conformance criteria. https://www.w3.org/WAI/WCAG2/supplemental/
- **[R4] Tempus, public website, Life Sciences and Clinical Trial Matching.** Reference for audience separation and connected clinical/research workflows; no transfer of claims or evidence. https://www.tempus.com/ ; https://www.tempus.com/life-sciences/ ; https://www.tempus.com/solutions/clinical-trial-matching/
- **[R5] MindMaze Therapeutics, public website.** Reference for a connected software/device/therapy ecosystem. https://mindmazetherapeutics.com/
- **[R6] Altoida, public website.** Reference for focused neurological product communication. https://altoida.com/
- **[R7] FDA, Human Factors and Medical Devices.** Risk-informed interface design context, not an India-specific legal opinion or a compliance determination. https://www.fda.gov/medical-devices/device-advice-comprehensive-regulatory-assistance/human-factors-and-medical-devices
- **[R8] Google Labs, Stitch DESIGN.md announcement and Stitch skills.** Documentation of import/export intent and design-system workflows; not a claim that a Stitch action has been performed. https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/ ; https://github.com/google-labs-code/stitch-skills

---
version: alpha
name: NeuroVX - Patient and Family Care
description: Patient-facing extension of NeuroVX Connected Care. Same navy, blue and white identity; one clear next
  step, separate patient and care-partner permissions, clinician-linked care.
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
  patient-title:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  patient-body:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  patient-caption:
    fontFamily: Inter
    fontSize: 1rem
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
  app-sidebar: 240px
  app-header-min: 72px
  patient-reading-max: 680px
  patient-action-min: 52px
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
  patient-action:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    minHeight: '{spacing.patient-action-min}'
    padding: 16px
  patient-context:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    typography: '{typography.patient-caption}'
    padding: '{spacing.md}'
  patient-copy:
    textColor: '{colors.on-surface}'
    typography: '{typography.patient-body}'
---

# NeuroVX - Patient and Family Care

## Overview

### Design contract

**Document version:** 1.1-patient | **Prepared:** 20 September 2026.
**Mode:** Interactive design prototype, not a clinically deployed service.
**Scope:** Patient and authorized family/care-partner experience only.

This file specializes the existing NeuroVX DESIGN.md; it does not replace the brand or redesign the homepage. Its frontmatter repeats the original brand tokens so it also works as standalone design context. Patient-specific additions are named `patient-*`. Keep the existing master file unchanged. This file governs patient behavior, navigation, content and states when both documents are supplied. Use the requested generation prompt to decide which screens to create. The format uses optional YAML tokens plus design rationale. [S1]

Do not generate clinician, lab, hospital, sponsor or CRO dashboards. Their actions appear only as patient-visible care events. Do not generate medical-device approval badges, working integrations, synthetic diagnostic scores or claims of clinical validation. A prototype label does not settle medical-device classification.

**Internal vision:** A connected neurodegenerative-care infrastructure.
**Patient promise:** Know your next step. Keep your care together.
**Experience principle:** One patient record; separately authorized people; a continuing care journey.

### What the patient should feel

"I can see what to do. I do not have to remember everything. I know who is helping."

The family member should feel: "I can help without accidentally answering for the patient or acting beyond my permission."

Use warmth without infantilizing people. The interface must not feel like a hospital control panel, a brain-training game, a frightening risk calculator or a medical shopping funnel. The Careline, whitespace, considered typography and clear transitions supply the visual character.

### Product decisions that preserve the user's proposed journey

The intended sequence remains: concerns and an appropriate assessment -> clinician booking and review -> clinician-requested investigations -> reports available to the patient and care team -> clinician-authored plan -> follow-up.

Refinements are deliberate:

- Assessment is helpful preparation, never a mandatory barrier to booking care.
- Family observations and patient cognitive performance are separate records.
- Booking confirmation is not clinical review; clinical review is not validation of a modified test.
- Medical test ordering and interpretation remain clinician-directed in this MVP.
- Lab release, electronic delivery and clinician review are distinct events.
- No diagnostic referral-commission feature is included. Keep any patient discount transparent and subject to appropriate commercial/legal review. [S6]

### Assessment boundary: engaging, not a replica

Do not ask Stitch to recreate or gamify MMSE, MoCA, ADAS-Cog or CDR. MoCA has commercial permissions and administration requirements; PAR controls modification and reproduction of its test materials. CDR relies on clinician interpretation of interview data and requires a license. ADAS-Cog assesses cognitive dysfunction with health-personnel involvement. [S2][S3][S4][S5]

For this prototype, design the assessment container and handoffs, not proprietary items. A neutral interaction rehearsal such as "Tap Continue when you are ready" is not an assessment and generates no score. For production, use a specifically authorized instrument/version/language/administration mode with the necessary evidence. Review by a clinician cannot retroactively establish the validity of a gamified replica; a changed method needs its own evidence.

Engagement belongs around an assessment: clear instructions, a calm start, progress permitted by the protocol, respectful completion and an easy clinical alternative. No points, trophies, leaderboards, hints, answer coaching, speed bonuses or repeated attempts to improve a score.

### Boundaries for biomarkers, imaging and future models

Plasma biomarkers can assist an appropriate symptomatic diagnostic pathway; do not market routine Alzheimer's screening to healthy teenagers or young adults. An example, the FDA-cleared Lumipulse plasma ratio, has a defined symptomatic intended population and is not a population-screening or standalone diagnostic test. Assay-specific intended use matters; do not encode one assay's age range as a universal rule. [S7][S8]

MRI, amyloid PET, tau PET and other imaging answer different questions. Preserve the modality and original report; do not combine them into an unvalidated patient risk gauge. [S9]

The proposed NeuroRisk model is a later, separately validated clinical function, not an MVP patient-facing diagnosis or progression score. Longitudinal data requires provenance, appropriate authority for use, and separate research/model-development governance. Care signup does not automatically permit unrestricted training or identifiable pharma/CRO access.

## Colors

Use the inherited palette, not a new patient-app brand:

| Role | Token | Value | Usage |
|---|---|---|---|
| Main action | primary | #1D4ED8 | One dominant action in the active task |
| Action hover | primary-hover | #1E40AF | Hover/pressed variant |
| Main text | secondary / on-surface | #0B1F3A | Headings and body text |
| Surface | surface | #FFFFFF | Reading and form surfaces |
| Canvas | canvas | #F2F7FC | Quiet workspace background |
| Secondary text | muted | #465E77 | Supporting text, not faint gray |
| Decorative divider | border | #D9E5F2 | Nonessential separators |
| Control outline | control-border | #7184A0 | Identifiable input boundaries |
| Selected surface | accent-soft | #EAF2FF | Selected navigation and helpful information |
| Caution | warning / warning-surface | #92400E / #FFFBEB | Genuine caution, with text |
| Error / urgent | error / error-surface | #B42318 / #FEF3F2 | Errors and approved urgent notices |

Navy, blue and white remain dominant. Amber/red are existing semantic exceptions, not decoration. Do not use traffic-light colors to label a person's brain health. A check icon means a task was completed, never that the patient is medically healthy. Color must never be the only carrier of meaning.

## Typography

Use Inter; fall back to Arial and sans-serif. Do not include or ship font files.

Patient workspace title: 32px desktop, 28px mobile, weight 600. Important card title: 24px. Body: 18px with 1.6 line-height. Navigation, control labels, consent, help text and status labels: at least 16px. Use `patient-caption`, not the inherited 14px metadata token, for patient-facing essential information.

Use sentence case and short, descriptive headings. Reading width is about 60-70 characters; do not stretch medical explanations across the screen. Aim for one idea per sentence and a short summary before expandable detail. These design choices support cognitive accessibility, which also needs testing with intended users. [S10][S11]

| Say | Do not say |
|---|---|
| Start care check-in | Calculate your NeuroRisk |
| What has changed? | Enter symptomatology |
| Family observations | Proxy cognitive score |
| Memory and thinking assessment | Play to discover Alzheimer's |
| Assessment completed - not yet reviewed | Your diagnosis is ready |
| Clinician reviewed on [date] | Clinically validated by booking |
| Appointment requested | Appointment confirmed before acceptance |
| Tests requested by your clinician | Essential Alzheimer's package for everyone |
| Report available - not yet reviewed | Everything is fine / Alzheimer's detected |
| Care plan from [clinician] | AI-generated treatment |
| Changes over time | Brain decline percentage |
| Ask NeuroLearn | Ask your AI neurologist |

Use one assistant name: **NeuroLearn**. A relative helping is a **care partner** in permissions; user-facing copy can say **family member** where clearer. Prefer **clinician** with the actual specialty visible; do not call every provider a neurologist.

## Layout

### The application brain

Home is not a dashboard of measurements. It is a small task interface driven by the current care episode. Records are the evidence; My care contains actions; Learn explains; Support provides human and practical help.

Four pieces of state determine what appears:

1. **Person and permission:** whose care, who is signed in, and what they may do.
2. **Care context:** new concerns, an existing plan, an external order, or a follow-up.
3. **Clinical/operational state:** assessment, booking, order, report and plan each retain their own status.
4. **Next action:** a named owner, an honest status and one clear button.

Do not infer a next action from an unvalidated risk model. In the MVP it comes from the chosen journey, approved workflow rules and clinician-authored tasks. The prototype simulates events explicitly.

### Stable navigation

Keep the original five patient destinations in the same order:

| Destination | Patient question | Contents |
|---|---|---|
| Home | What should I do next? | Next action, current journey, essential updates |
| My care | What am I doing with my care team? | Check-ins and assessments, appointments, tests and scans, care plan |
| Records | Where is my information? | Reports, assessment summaries, history, prescriptions and timeline |
| Learn | What would help me understand? | Guides, articles, saved questions and NeuroLearn |
| Support | Who can help? | Platform help, caregiver support and verified care-service routes |

Utility controls: current patient/account, language, messages/updates and access settings. Avoid adding global tabs for Biomarkers, NeuroRisk, Marketplace, Pharma or Research. Future research and devices remain optional, separate routes; do not build them in this pass.

A released report has one canonical Records detail page. My care links to it, rather than creating a second inconsistent copy. Tests means lab/imaging investigations; assessments means cognition, function or other configured clinical instruments.

Desktop: 240px left navigation, a minimum 72px header, a fluid content region with a 1200px maximum. Patient Home may use a 2:1 layout; focused forms use a single column up to 680px. Use 24-32px gutters, 24px card padding, 16px on small screens, and the inherited 8px spacing rhythm.

Mobile: reference width 390px, verify reflow at 320px. Five labeled bottom destinations; preserve a visible current-patient header. At large text sizes, reflow navigation into an accessible labeled menu rather than clipping it. Bottom bars must not obscure content, help or the active form button. No mandatory sideways carousels.

### Public-to-patient entry

Keep the established homepage copy:

**Eyebrow:** Starting with memory and cognitive care
**Headline:** Brain care. Connected.
**Supporting lines:** NeuroVX brings patients, clinicians and diagnostic labs together. / Keep assessments, reports and next steps in one place.

Keep the homepage hero action **Explore your care journey**. In its patient-journey section, add **Get started** to enter this flow and a quiet **Find a clinician** alternative. Do not rebuild the homepage when generating the patient app.

Do not collect health details before explaining the service and obtaining the applicable permissions. Public education and immediate safety information should not require an account.

### Golden path and legitimate shortcuts

```text
Existing public homepage
  -> Get started
  -> Who is the care for? + language + minimal account/permission setup
  -> New concerns OR continuing existing care
  -> Patient Home with the appropriate next step

New concerns
  -> Brief concern history and clinician-authored safety check
  -> Separate family observations, when available
  -> Appropriate authorized assessment OR clinician-assisted alternative
  -> Honest assessment/intake summary, not a diagnosis
  -> Find a clinician -> choose slot -> share visit packet -> request booking
  -> Appointment confirmed -> prepare -> consultation occurs
  -> Clinician may request tests/scans OR proceed directly to a plan
  -> Choose capable provider -> book -> collection/scan -> report released
  -> Report delivered to care team -> clinician review -> plan/follow-up
  -> Continuing care and changes over time

Shortcuts
  -> Book a clinician without completing an assessment
  -> Existing diagnosis: add records, current plan and next visit
  -> Existing external test order: upload, verify, then find a provider
  -> Family only: contribute observations, arrange care; no proxy patient test
  -> No suitable digital assessment: clinician-assisted visit
  -> Urgent concern: leave routine flow via approved urgent-care guidance
```

Testing is conditional. Do not force every patient through biomarkers, imaging or repeat cognitive assessments. Do not show skipped clinical steps as failures or invent a percentage of the disease journey completed.

### Identity and permission: patient and family are not the same respondent

Start with two clear choices: **For myself** and **Helping a family member**. Ask for language early. Explain that interface language and available clinical-assessment languages may differ.

A helper signs into their own account. They do not impersonate the patient or need to take over the patient's phone. Support a patient who does not own a smartphone. Record relationship but do not treat relationship alone as legal authority. A supported consent/representative pathway is required when the patient cannot independently authorize access; this cannot be replaced by a casual checkbox.

Permission choices use ordinary language: help with bookings; contribute observations; view selected reports; view the care plan. Show only applicable options and a short summary, not a dense legal form. Research and model-training permissions are separate from care access. Production consent rules require jurisdiction-specific review; risk-based design guidance is a separate input. [S12]

If authorization is incomplete, let the helper explore information and record their own account's draft observations where permitted. Do not reveal or attach records from an existing patient profile merely because a name/phone matches. Show **Help arrange access**; provide a human-assisted route.

Persistent context examples:

- Patient: **Asha's care | Signed in as Asha**
- Care partner: **Asha's care | Signed in as Meera - care partner**
- Limited helper: **Helping Asha | Record access not yet arranged**

An optional **Simpler view** reduces secondary content, not text size. It uses the same navigation and record, not a different product. A caregiver must not silently change another person's permissions or care preferences.

### Progressive intake, not a registration wall

Collect what is needed at the moment. Start with the account-holder's contact method and minimum identity/consent information. Ask the patient name and age or date of birth when needed for appropriate care and identity matching. Confirm fuller identity at clinical booking. Mark approximate age if used; do not silently invent a birth date.

Then use short, grouped steps:

| Step | Main question | Important behavior |
|---|---|---|
| Care context | What brings you here? | New concern / already receiving care / arranging a prescribed test |
| Concern | What has changed? | Memory, communication, attention, daily tasks, behavior, something else; descriptive, not diagnostic |
| Timing and safety | When did you first notice the change? | Structured timing and clinician-approved escalation; do not derive urgency from the cognitive score |
| Patient context | What should the clinician know? | Language, education context, hearing/vision and assistance; concise and appropriate to the route |
| Visit preparation | What can you add before the visit? | Medicines, conditions, family history and prior reports; "Not sure" and "Add later" where clinically permissible |

Ask family history once, with relationship and age at onset where known. Do not turn a missing answer into a negative history. Do not keep asking demographic questions after they have been saved. The clinician can request clarification on the same record.

For the live clinical protocol, distinguish emergency symptoms from changes that merit a prompt but non-emergency assessment. The prototype shows an approved-guidance placeholder and a separate urgent-help route, not an invented production triage algorithm. No routine booking screen should reassure someone that an emergency has been ruled out.

### Canonical patient Home: generate this first

**Fixture:** Asha Rao, age 68, helped by Meera Rao. All names and later care events are fictional. At this first state, care access has been arranged for the demonstration, no assessment has been completed and no clinician has been selected.

Header: **Asha's care**
Supporting line: **One step at a time. Your information stays together.**
Identity: **Signed in as Meera - care partner**

Dominant white next-step card:

- Eyebrow: **Your next step**
- Title: **Start with what you've noticed**
- Body: **Tell us what has changed. You can add more before the visit.**
- Primary action: **Start care check-in**
- Quiet alternative: **Find a clinician first**

Below it: a quiet Careline showing **Prepare -> Visit -> Tests, if needed -> Review -> Ongoing care**. On mobile show the current stage with **View journey** to expand a vertical list; do not squeeze five long labels into a horizontal strip.

Then a small **Before your visit** list: **Add previous reports** and **Add questions for your clinician**. Each is optional at this point. Avoid blank lab widgets or empty charts.

Secondary column: one **Understand your next step** card, a single article **What happens at a memory appointment?**, and **Ask NeuroLearn**. A small **Need help using NeuroVX?** link goes to Support. Do not auto-open chat.

No health score, gamified streak, diagnosis, predicted progression, drug offer, research recruitment banner or sale appears on Home. Avoid greeting Meera as though she is the patient.

### Home is a set of states, not a single mockup

The same layout responds to the care episode. No feature-card wall appears as more data arrives.

| State | Main message | Main action | What must remain true |
|---|---|---|---|
| New | Start with what you've noticed | Start care check-in | Booking alternative visible |
| Intake saved | Continue where you stopped | Continue check-in | Resume the correct patient and step |
| Family-only | Your observations are saved | Arrange the patient's visit | No patient test score |
| Assessment available | Ready for your memory assessment? | Review instructions | Exact authorized mode determines availability |
| Assessment completed | Your assessment is ready to discuss | Find a clinician | Not yet reviewed; not a diagnosis |
| Cannot assess reliably | A clinician can help with the next step | Find a clinician | No failure label or fabricated score |
| Booking requested | Your appointment request is pending | View request | Never show confirmed until acceptance |
| Booking confirmed | Prepare for your visit | View visit details | Name, place/mode, date and sharing status |
| Extra information requested | Your clinician requested more information | View request | Exact fields and source preserved |
| Investigations requested | Choose where to complete your tests | View requested tests | Order owner and optional alternatives visible |
| Collection arranged | Your test visit is booked | View preparation | Only provider-approved preparation |
| Results released | A report is available | View report | Show delivery and review states separately |
| Reviewed | Your clinician added a care update | View care plan | Named author and date |
| Follow-up due | Plan your next visit | Book follow-up | Existing plan remains accessible |
| Existing care | Continue your care | Review next visit | Do not repeat first-time screening |
| No task due | Your care plan is up to date | View care plan | Not a medical all-clear |
| Delivery problem | We could not share your report yet | Get help sharing | Human-owned exception, no false receipt |

Urgent escalations use an approved safety surface above routine tasks. Outside that route, at most one primary action and two secondary action rows appear in the initial viewport. A patient's appointment should not be blocked because a nonessential profile field is incomplete.

### Patient-only screen map

These are routes, not a request to render all screens in one generation. State variants reuse a screen template.

| ID | Screen | Primary purpose | Next route |
|---|---|---|---|
| P00 | Existing homepage | Explain NeuroVX | P01 or P08 |
| P01 | Who the care is for / access | Account and care relationship | P02; access help when needed |
| P02 | Care setup / short intake | Context, concerns, safety, required details | P03 or clinical-help route |
| P03 | Home | One next step | Contextual |
| P04 | Assessment introduction | Explain mode, respondent, preparation and alternatives | P05 or booking |
| P05 | Assessment shell | Authorized task container; no real items in prototype | P07 or clinical alternative |
| P06 | Family observations | Care partner's own observations | P07 / P04 / Home |
| P07 | Visit preparation summary | What was completed, source and limitations | P08 or existing visit |
| P08 | Find a clinician | Filtered list, optional map | P09 |
| P09 | Clinician details and slot | Specialty, practical details, availability | P10 |
| P10 | Share and request booking | Review recipient, packet, price and consent | P11 |
| P11 | Visit hub | Request / confirmation / preparation / follow-up | P12 or P17 |
| P12 | Requested investigations | Clinician's exact orders and explanations | P13 |
| P13 | Find lab or imaging provider | Capability-matched list and map | P14 |
| P14 | Confirm investigation booking | Collection mode, preparation, fees and sharing | P15 |
| P15 | Investigation progress | Appointment, sample/scan and report states | P16 |
| P16 | Report details | Original report, release/delivery/review and questions | P17 or visit hub |
| P17 | Care plan and next visit | Clinician-authored actions and follow-up | P11 / P12 / P18 |
| P18 | Records and timeline | Find source information and changes over time | Relevant record |
| P19 | Learn | Guides and saved learning | P20 or article |
| P20 | NeuroLearn | Education and questions for the care team | Saved question / relevant care route |
| P21 | People and access | Explain and manage permissions | Prior context |
| P22 | Support | Human help and practical support | Assisted route |

### A single fictional episode for connected later screens

All sample data must be visibly marked **Demo data**. Never invent a real hospital affiliation, registration verification, endorsement or clinical finding.

Use Asha Rao (68), care partner Meera Rao, and **Dr. Kavya Rao - illustrative clinician**. Use **Example Diagnostics - illustrative provider** for the lab. Display location as **Noida - sample search area**, not the user's actual location. No patient address is inferred.

Later state fixtures: consultation 06 Oct 2026 at 4:30 PM IST; an illustrative clinician-created investigation request after that visit; collection 08 Oct; a report released 09 Oct; clinician review 10 Oct; follow-up 12 Oct. Each screen state represents that point in time. Do not place the later report on the first new-patient Home.

Do not supply numeric biomarker values, cognitive scores, diagnosis, medication dose or disease stage in this prototype. Order examples may use **Vitamin B12 - example clinician order**, with a separate molecular-test detail example labeled as an illustrative clinician-requested order. Avoid a universal panel. Any fee shown is explicitly a prototype placeholder, never an actual quoted price.

## Elevation & Depth

Use white surfaces on the pale-blue canvas, restrained borders and quiet section spacing. Prefer a divider to another nested card.

Only the main next-step surface may have `0 4px 20px rgba(11,31,58,0.05)`. Menus or necessary dialogs may use the inherited stronger elevation. No glowing edges, glassmorphism, dark analytical cockpit, parallax or animated brain.

The Careline is an operational timeline, not an EEG signal, disease curve or implied improvement. Its current node uses blue and a text label. Completed, skipped by the clinician, not yet needed and unavailable are distinct states.

## Shapes

Use inherited 10px controls and 16px main surfaces; use 6px small status labels. No excessive pill containers. Buttons should look actionable; cards should not all appear clickable. Use simple outline icons with visible labels.

Controls target a minimum 48px tap area and patient primary buttons a 52px minimum height, with room for wrapped text. These are product design targets, not a claim that WCAG AA universally requires 48px. Preserve visible 3:1 control/focus contrast where applicable; body text targets at least 4.5:1. [S10]

## Components

### Next-step card and task ownership

Component structure: **status -> task -> why -> owner/date -> action**. Never fill every available slot just because the component supports it.

When the action belongs to the clinician or lab, say so: **Awaiting review by your clinician** or **The lab is processing your sample**. Do not show an actionable patient error for a partner delay. Give **Contact support** or **View details**, not a misleading retry-diagnosis button.

Optional task assignment for an authorized family member may say **I'll help with this** and show the helper's name. Assignment must not grant new permissions or authorize a medical decision. Avoid duplicate bookings when two care partners act; require a final check of patient, visit and slot.

### Forms and progressive disclosure

Keep related fields together; do not create thirty tiny screens or one endless medical form. Use visible labels, **Not sure**, optional **Add later**, back navigation and saved state. Show what will happen after the primary action.

Unsubmitted intake can be edited. Completed clinical assessment responses follow the instrument's locked-submission and amendment rules. Do not allow a family member to quietly rewrite a patient's performance record.

Use **Saved** only after the server acknowledges persistence. Distinguish **Saving**, **Saved**, **Connection lost** and **Not saved**. On a shared device, explain secure sign-out and session recovery. Support assisted access without disabling identity checks.

### Assessment experience and respondent handoff

P04 exact direction:

**Heading:** Before you begin
**Intro:** This assessment may help your clinician understand memory and thinking. It does not diagnose a condition on its own.

Display who should answer, the authorized language/version/mode, necessary equipment, and assistance rules. Show duration only when supplied by the selected instrument or measured for the actual workflow. Offer **Arrange an assisted assessment** and **Book a clinician instead**.

Family route handoff:

**Heading:** Now it is Asha's turn
**Copy:** You can help set up the device. Assessment answers must come from Asha, using the instructions for this assessment.
**Alternative:** Asha is not available / We need an assisted visit.

If a clinician-administered instrument is selected, the button schedules or joins the correct supervised session; it does not start an unauthorized self-test.

| Information type | Who provides it? | What the interface may do |
|---|---|---|
| Patient concerns | Patient | Save as patient-reported |
| Family observations | Family member | Save as care-partner-reported |
| Cognitive task responses | Patient under the authorized administration mode | Preserve method and assistance; no proxy answering |
| CDR | Appropriately trained clinician using its intended process | Display documented rating later, not a home quiz |
| ADAS-Cog | Appropriate trained assessment personnel/process | Display authorized results later, not default signup screening |
| Clinician interpretation | Responsible clinician | Show named, dated review; do not overwrite original observations |

Do not offer all four named instruments as games to choose from. The configured clinical pathway selects a suitable option. Do not call the surrounding family-history form MMSE, MoCA, ADAS-Cog or CDR.

P05 prototype: a calm shell labeled **Assessment preview** with a placeholder reading **Authorized assessment content will appear here**. The preview's Continue action demonstrates navigation only; it produces **Demo completion**, not a medical score. Suppress chat, external hints and reading assistance during scored tasks unless the exact protocol permits them. General interface accessibility controls must not silently alter a standardized stimulus.

Pause/resume, repeated instructions, back navigation, feedback, timers and retries are instrument-specific. If an interruption affects validity, record the interruption and route to the approved reassessment/clinical alternative; do not resume as though nothing happened. Fatigue, connectivity failure or inability to use the device are not evidence of cognitive impairment by themselves.

### Summary before clinical review

P07 heading: **Your information is ready for a clinician**.

Show **What you shared**, **What was completed**, **What still needs review**, and **Your next step**. Source-label family and patient accounts separately. Say **Not completed**, **Not available** or **Needs an assisted assessment** instead of a zero score.

State: **Not yet reviewed by a clinician. This is not a diagnosis.**
Primary action: **Find a clinician**, or **View your appointment** when one is already booked.
Secondary: **View assessment details** / **Edit your history**. Do not permit editing locked test responses.

When an authorized score is eventually available, retain the original instrument, version, date, administration mode, respondent, assistance and relevant limitations. The patient summary is plain-language; details remain available according to the instrument agreement and clinical policy. No unsupported risk percentage, prediction age, combined brain score or reassurance that persistent symptoms can be ignored.

### Clinician discovery and booking

P08 defaults to a list with an optional **Map** control. Ask for city/locality or PIN code; **Use my location** is optional and permission-based. Browsing must work without GPS. Use transparent filters: visit mode, specialty, language, location, availability, fee and accessibility needs. Distinguish verified credentials from patient reviews. No **Best neurologist** label or unsupported suitability score.

Show practical provider information: actual specialty, qualifications/registration only when verified, clinic, modes of care, relevant services, languages, next available slot and total fee. A primary-care clinician is not relabeled a neurologist. The MVP does not rank professionals using an unvalidated clinical matching model.

P10 booking review is a compact summary:

- Patient and clinician.
- Requested time, visit mode/location and availability status.
- Consultation fee and any separately disclosed service fee; cancellation/refund terms.
- Visit packet being shared: concerns/history, appropriate assessments and selected reports.
- Who will receive later reports linked to this care episode.

Primary action: **Request appointment** for manual-confirmation partners. Use **Confirm booking** only when the integration really supports confirmation. Payment success alone is not appointment acceptance. Show pending, declined, rescheduled, cancelled and refund states without inventing a guaranteed response time.

The visit packet can be shared with the selected care team under the applicable consent/booking process before the appointment. If it has not been delivered, say so. A selected clinician does not receive every future record forever by default. Submitted amendments retain timestamps and authors; the team can see what changed rather than asking the same history again.

P11 is one visit hub for all preparation: appointment details, original intake, outstanding clinician requests, documents and questions. **Add information** updates the existing packet. Do not send the family into four disconnected forms after booking.

### Lab and imaging ordering: choice without unnecessary testing

P12 heading: **Tests requested by your clinician**. Each order shows clinician, date, exact investigation, order status and a concise explanation provided/approved by the clinician. Do not prefill a NeuroRisk Panel for everyone or let chat add a biomarker to the cart.

Patient paths:

1. Existing in-platform order -> find a capable lab/imaging service -> book.
2. External order -> upload -> appropriate order/identity/service verification -> book.
3. No order -> **Ask a clinician about this test** or learn about the test; do not silently create a medical order.

Patients choose practical provider and timing. Clinical additions, substitutions, repeats, or deletion from an order require the appropriate clinician workflow. A generic test name is insufficient to substitute one Alzheimer's assay for another.

P13 uses capability-matched results before sorting by distance, fee or availability. Provider cards show required test availability, actual collection/imaging site, collection options, disclosed fee, estimated turnaround supplied by the provider, accessibility and any verified accreditation information relevant to the service. No invented NABL/CDSCO badge. If the nearest collection center sends specimens elsewhere, name the processing laboratory when known.

List and map show the same filtered providers. Selecting a pin selects its list card. A map is optional; retain address text and directions. If no suitable provider is available, offer support and an external-report path instead of inventing inventory. No external mapping dependency is claimed as integrated in a visual prototype.

P14 presents the exact test/site, patient, time, home collection or visit when supported, total cost, genuine discount terms, cancellation and preparation. Do not invent fasting or medication-stop instructions. Preparation comes from the responsible provider. An imaging booking has its own safety/preparation workflow; it is not a blood-sample collection.

Never pay or promise clinician commissions for sending tests. NMC's published ethics provisions 6.4.1-6.4.2 address diagnostic referral commissions; the regulator lists the 2023 conduct regulations as held in abeyance. Commission-based routing is excluded from this design. [S6]

### Separate laboratory and imaging progress

P15 shows the last real event, time and responsible service. Estimated dates must be labeled estimates.

**Lab example:** Order accepted -> Collection booked -> Collected -> Sample received -> Processing -> Report released.

**Imaging example:** Order accepted -> Scan booked -> Scan completed -> Report being prepared -> Report released.

After either route: **Delivered to care team -> Clinician reviewed**. Do not claim a clinician opened a report merely because the system sent it.

Exceptions: incomplete order, requested assay unavailable, appointment changed, collection missed, insufficient sample, recollection required, delayed processing, report corrected and delivery failed. Each explains the next action and its owner. No lab result is silently deleted when corrected; retain amendment history.

### Report details and human review

P16 top hierarchy:

**[Report name]**
**Available from the laboratory / imaging provider**
**Released [date] | Shared with [care team] [actual status] | Clinical review [status]**

Buttons: **Open original report** and a contextual **Book follow-up** or **View clinician explanation**. A quiet **Save a question for my clinician** is useful. The primary action depends on the actual next care step, not the presence of a commercial service.

Keep patient access consistent with applicable law, consent and provider policy. Do not blanket-hide every result until a clinician reviews it. If unreviewed results are available, label them clearly and explain how to obtain review.

Store original report, issuer, specimen or modality, assay/platform when applicable, collection/scan and release dates, values and units, assay-specific limits, lab interpretation, quality flags and report version. Keep automated extraction as an unverified draft until checked. Never rewrite a lab abnormality as a software-generated Alzheimer's diagnosis.

Critical-result handling needs a named human-owned escalation and acknowledgement process. A push notification is not a complete safety mechanism. Do not claim 24/7 clinical monitoring in the prototype. Show where support is available and avoid unverified response-time promises.

### Patient-facing place for plasma biomarkers and imaging

Use contextual education in order/report details, not a homepage sales panel.

| Patient situation | MVP design behavior |
|---|---|
| Healthy teenager / asymptomatic young adult | No routine Alzheimer's blood-test upsell; education and appropriate clinical access. Pediatric assessment is outside this adult pilot. |
| Adult with persistent or progressive concerns | Access to clinician assessment; do not block younger symptomatic adults based on one assay's age label. |
| Relevant symptomatic patient | Show a specific clinician-requested plasma assay with limitations, preparation and follow-up. |
| Existing neurodegenerative diagnosis | Keep the established plan; repeat testing only when appropriately requested for a defined clinical purpose. |
| Imaging requested | Name MRI, amyloid PET, tau PET or other specific modality; show why the clinician requested it and the original report. |

Blood biomarkers do not represent every neurodegenerative disorder, a universal future-dementia forecast, or a treatment plan. MRI provides structural information; molecular PET has different targets. An available biomarker result does not establish the patient's independence, stage or treatment suitability by itself. [S7][S8][S9]

Future breakthroughs can change pathways, but an evolving scientific landscape is not a reason to generate a current diagnostic promise. Product education should be dated, referenced and clinically reviewed.

### Care plan and continuing care

P17 heading: **Your care plan**.
Show **From [responsible clinician] | Updated [date]**. A short explanation comes before tasks. Use categories only when populated: next visit; requested investigations; prescribed medicines; daily care; care support; symptoms/questions to discuss.

Medication directions are faithfully displayed from an authorized prescription, not generated or changed by NeuroLearn. A patient can record what they are taking, but that is labeled patient-reported and does not modify the prescription. Preserve updated/cancelled plan versions.

Each actionable item has who is responsible, due date when set, preparation and status. A clinician-recorded diagnosis or stage has an author and date; do not turn an assessment score into a stage. **Book follow-up** reuses the same clinician/episode where appropriate; a different clinician/second opinion requires a fresh sharing check.

P18 Records starts with a searchable chronological list: Visits, Assessments, Tests and scans, Care plans, Family notes. A timeline entry opens the original source. Do not produce a disease curve just because three dates exist. Only comparable methods should be trended; show gaps and changes in method, not interpolated improvement. Repeated-test effects and other limitations must be considered by the clinical interpretation, not hidden behind a progress arrow.

Optional brief observations between visits record daily changes and source. No daily cognition streak, pressure to retest or punitive missed-task display. Declining to use a reminder does not imply lack of adherence or cognitive impairment.

### NeuroLearn: useful while waiting, separate from clinical decisions

Entry from Learn or a small contextual link; never auto-open. Desktop may use a deliberate side pane; mobile uses a full reading screen. Do not overlay a timed or scored assessment.

P20 heading: **What would you like to understand?**
Descriptor: **NeuroLearn explains brain-care topics. It does not diagnose or prescribe.**
Prompt starters: **What happens at a memory appointment?** / **What does this test measure?** / **How can I prepare questions for my clinician?**

Response structure: brief explanation -> optional further detail -> real inspectable sources and dates -> **Save a question for my clinician**. No invented medical-reviewer names or citations. A report-specific explanation requires explicit selection of that report and permitted access, not silent ingestion of the full record.

Permitted design functions: explain terms, distinguish general test purposes, summarize approved preparation instructions, provide reviewed caregiver education and help formulate questions. Not permitted in this MVP: decide which test this individual needs, create an order, infer diagnosis/stage, change medication, declare trial eligibility or recommend a device based on a frightening result.

For **Which test should I get?**, the interaction can explain general possibilities and save a question for the clinician. It must not return a personalized test shopping list. Urgent language exits ordinary chat through an approved safety message. Uncertain or insufficient sources produce an honest limit and a clinician route.

### Access, notifications and files

Before sharing: patient, recipient, selected documents and purpose are visible. P21 shows current access and what changing it means. Revocation stops future permitted access as implemented; it does not promise deletion of copies already lawfully retained.

External notifications are discreet: **You have an update in NeuroVX.** Do not put biomarker values, diagnoses or patient details on a shared lock screen. Opening an update checks sign-in and patient context; no silent switch between family members. Group routine updates; urgent routes follow a separately governed process.

Uploads support choosing a file or photographing a report, preview and patient/date confirmation. Warn about unreadable pages and missing pages; keep the original. Do not require all users to scan a QR code or install another app. Show upload failures and retry without losing previous intake.

### Loading, error, waiting and empty states

| Situation | Patient-facing message | Recovery |
|---|---|---|
| No records | No reports added yet | Add a report; continue care without one where appropriate |
| Connection failed | Your latest changes have not been saved | Retry; show what remains local and protect it |
| Assessment interrupted | This assessment could not be completed as planned | Follow the instrument-approved alternative; no score |
| No suitable digital version | An assisted assessment is available instead | Find/arrange clinician help |
| Access incomplete | We need to arrange permission to view this record | Access support, not a medical warning |
| Clinician unavailable | This time is no longer available | Choose another slot without losing the packet |
| No capable lab | No matching provider is available in this search | Change area or ask support; preserve exact order |
| Report delayed | The provider has not released this report yet | Provider contact / support; no fabricated ETA |
| Report delivery failed | Your report is available, but has not reached the care team | Retry/escalate sharing with a named owner |
| Corrected report | The provider issued an updated report | Open current version; prior version remains traceable |
| No action currently due | There are no new tasks in your care plan | View the plan; not a medical all-clear |

Use skeletons only where helpful, with accessible status text. Do not render fake patient values while loading. Clinical results do not animate like game rewards.

## Do's and Don'ts

### What makes this experience distinctive

Do use a visually confident, simple next-step composition. Do give a family member useful actions without turning them into a clinician. Do maintain stable navigation across changing care states. Do use the quiet Careline to make fragmented care feel connected. Do expose the source and status of medical information at the point of use.

Do not create a tile for every eventual business vertical. Do not decorate the patient app with radar charts, brain-age dials, floating neurons, clinician leaderboards or dashboard KPI counters. Do not sell certainty the clinical record does not provide. Do not mistake a lab test discount for medical suitability.

### Accessibility and usability release targets

Target WCAG 2.2 AA and test additional cognitive-accessibility needs; design tokens do not certify compliance. Check contrast, visible focus, keyboard order, labels, error association, text enlargement to 200%, reflow at 320 CSS px, screen readers and accessible authentication. No unnecessary memory puzzles in sign-in. [S10][S11]

Keep stable layouts and meaningful headings. Preserve progress securely, offer help and make next steps explicit. Account for hearing, vision, literacy, language, fatigue and motor difficulty. Clinical assessment accommodations need a protocol-specific decision; accessibility of the app shell does not authorize modification of the test. [S2][S3]

Clinical safety and human-factors review should include wrong-patient selection, unauthorized sharing, false booking confirmation, assessment misuse, report misinterpretation, missed urgent escalation and duplicate/mismatched test orders. [S12]

### Evidence to collect from the patient prototype

These are product-learning measures, not proof of clinical benefit:

| Test task | Observe | Avoid misinterpreting |
|---|---|---|
| New family signup | Can the helper identify whose record is open? | Family relationship alone is not verified authority |
| Start/skip an assessment | Can the person choose the appropriate route? | Completion is not diagnostic validity |
| View summary | Can they distinguish unreviewed information from a diagnosis? | Attractive report is not accurate medicine |
| Book a visit | Time, errors, repeated fields, help required | A click is not an attended appointment |
| Compare labs | Can they find a capable provider and full cost? | Cheap/nearby is not clinically equivalent |
| View report | Can they identify lab release, delivery and clinician review? | File upload is not acknowledged review |
| Find care plan | Can they identify the next action and its author? | A reminder is not proven treatment adherence |
| Ask NeuroLearn | Do they understand its limits and save a useful question? | Chat engagement is not clinical benefit |

For early moderated testing, include intended patients and care partners with differing language, literacy and digital confidence. Use fictional medical data. Count critical misunderstandings, not just satisfaction. Any sample-size or completion target chosen for design iteration must be labeled a planning choice, not evidence of clinical validation.

For willingness to pay, test concrete service choices after the usability task: visit coordination, a navigator or an organization-funded pathway. Disclose what the service includes and normal clinical/lab fees. No charge for required access to one's own report, no instrument-fee assumptions contrary to license terms, and no clinical-pressure discounts. A commitment or paid pilot is stronger evidence than a hypothetical "yes"; the prototype alone does not establish demand.

### Build order and non-goals

First design P03 Patient Home in a care-partner state and its mobile equivalent. Next P01/P02/P06 onboarding, then P04/P05/P07 assessment handoff, then P08-P11 booking, then P12-P16 investigations, then P17-P20 continuing care and learning.

Prioritize the normal path plus one meaningful exception each time. Do not ask Stitch to draw the full route map at once. Keep the same patient fixture, visual tokens, labels and component templates across generations.

Not in this patient pass: professional dashboards, model training console, cohort exports, trial matching, marketplace checkout, raw brain-image segmentation, a production test battery, production emergency logic or live provider availability. Future interfaces must not silently appear in the navigation as completed capabilities.

### Stitch handoff

Use this file as the patient-specific design context. Supply the companion STITCH_PROMPTS.md. Start with Prompt 1 only. Where the interface supports design-system import, use it; otherwise attach/provide the document as project context. This document has not been imported or tested in a live Stitch project.

For every generated screen, specify the screen ID, role, patient, starting state, one main action, destination and prototype boundary. Links should have annotated destinations or working prototype transitions; do not invent live medical transactions.

### Pre-generation acceptance checklist

- Existing NeuroVX palette, Inter and Careline are preserved.
- Home, My care, Records, Learn and Support retain the same order.
- Every private screen identifies the patient and signed-in role.
- One dominant next action; no forced completion before care access.
- Family observations are separate from patient performance.
- No real copied assessment items, fabricated score or gamified clinical claim.
- Booking request, confirmation, report release, delivery and review stay distinct.
- Labs are selected for the ordered service before distance or price.
- NeuroLearn educates and hands off; it does not order or prescribe.
- Future research/model use and commerce do not interrupt care.
- Fictional data and unavailable capabilities are honestly labeled.
- Mobile/large-text layouts preserve the action and patient context.

### Source notes

External sources inform the factual boundaries. Most layout, copy, routing and prioritization choices in this file are original proposed product decisions, not claims that NeuroVX already implements them. Checked 20 September 2026.

- **[S1] Google Labs: DESIGN.md specification.** Format and token structure. https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md
- **[S2] MoCA Cognition: permissions and terms.** Commercial permissions, administration and interpretation requirements. https://mocacognition.com/permission/ ; https://mocacognition.com/terms-of-use/
- **[S3] PAR: Licensing Team.** Modification, reproduction and permissions for PAR test materials. https://www.parinc.com/about/connect-with-us/licensing-team
- **[S4] Washington University Knight ADRC: CDR scoring and licensing.** Clinician judgment, interview data and licensing. https://knightadrc.wustl.edu/professionals-clinicians/cdr-dementia-staging-instrument/cdr-scoring-table/ ; https://knightadrc.wustl.edu/professionals-clinicians/cdr-dementia-staging-instrument/copyright-licensing/
- **[S5] Mapi Research Trust: ADAS-Cog.** Instrument purpose, respondent and use conditions. https://eprovide.mapi-trust.org/instruments/alzheimer-s-disease-assessment-scale-cognitive-part
- **[S6] National Medical Commission: Code of Medical Ethics 2002, sections 6.4.1-6.4.2; NMC regulations index.** Referral commissions and listed 2023 abeyance notification. https://nmc.org.in/page/rules-regulations-rules-regulations-of-erstwhile-mci-code-of-medical-ethics-regulations-2002 ; https://nmc.org.in/page/rules-regulations-rules-regulations-nmc
- **[S7] FDA, 16 May 2025: first cleared Alzheimer's blood test.** Specific intended-use example, not a universal assay rule or Indian authorization. https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease
- **[S8] Alzheimer's Association: Blood-Based Biomarker Clinical Practice Guideline.** Appropriate specialist diagnostic context and assay performance limitations. https://www.alz.org/alz-pro/hub/care-pathway/blood-based-biomarkers-guideline
- **[S9] NIH National Institute on Aging: How Biomarkers Help Diagnose Dementia.** Different roles of imaging and biomarkers. https://www.nia.nih.gov/health/alzheimers-symptoms-and-diagnosis/how-biomarkers-help-diagnose-dementia
- **[S10] W3C: WCAG 2.2 quick reference.** Accessibility requirements; proposed larger controls are product choices. https://www.w3.org/WAI/WCAG22/quickref/
- **[S11] W3C: Making Content Usable for People with Cognitive and Learning Disabilities.** Supplemental guidance, not separate certification. https://www.w3.org/TR/coga-usable/design_guide.html
- **[S12] FDA: Human Factors and Medical Devices.** Risk-informed design and intended-user testing; not an India-specific compliance finding. https://www.fda.gov/medical-devices/device-advice-comprehensive-regulatory-assistance/human-factors-and-medical-devices

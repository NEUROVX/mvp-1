---
version: alpha
name: NeuroVX Patient - One Step
description: A quiet patient interface with one next action and progressive disclosure.
colors:
  primary: "#1D4ED8"
  primary-hover: "#1E40AF"
  on-primary: "#FFFFFF"
  background: "#F8FAFD"
  surface: "#FFFFFF"
  heading: "#0B1F3A"
  body: "#334155"
  muted: "#52647A"
  soft-blue: "#EEF4FF"
  border: "#DBE4F0"
  control-border: "#718096"
  focus: "#1D4ED8"
  error: "#B42318"
  error-surface: "#FEF3F2"
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
rounded:
  controls: 10px
  panel: 16px
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
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.controls}"
    height: 52px
    padding: 16px
  task-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "{spacing.xl}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body}"
    rounded: "{rounded.controls}"
    height: 52px
---

# NeuroVX Patient: One Step

## Overview

A fresh patient/family design that REPLACES the earlier patient-dashboard specification. Keep the NeuroVX name and navy/blue/white identity. Do not preserve the previous screenshot's layout.

The product should feel like a considerate guide, not a hospital control room. Its entire Home screen answers: **What do I do next?**

The person-facing journey is:
**Short patient form > appropriate cognitive assessment > assessment summary > optional past reports > clinician booking > consultation > clinician-requested tests > report review and next visit.**

This is a preferred path, not a compulsory funnel. Someone can book a clinician without completing an assessment or uploading reports. Existing patients can go directly to their next care action.

**Design scope:** the patient experience only. No clinician, laboratory, hospital-admin, research, commercial or model-training dashboards. These services exist behind the handoffs, not as patient navigation.

**Rendering rule:** Only quoted interface copy and explicitly named fields belong on screens. All other text in this file is design/implementation guidance. Never render screen IDs, routes, permission codes, source citations, engineering instructions or descriptions of how a component works. Show one discreet "Demo" label for synthetic prototype data, not repeated disclaimers across every card. Prototype status is not a compliance claim.

## Colors

White panels on an almost-white blue background. Deep navy headings, slate body text, blue for the main action. Keep at least 80% of the initial screen white or almost white. Do not add a purple page outline, full-blue sidebar, gradient banner or dark clinical dashboard.

Use `border` for decorative dividers only. Use the darker `control-border` for inputs and selection boundaries where needed for visibility. Error red is reserved for actual errors or urgent notices, with explanatory text. Blue does not mean healthy and red must not classify a cognitive score.

## Typography

Inter with Arial and sans-serif fallbacks. Use 400, 500 and 600 weights. Body 18px; controls and essential supporting text at least 16px. Desktop heading 32px; mobile 28px. Keep short paragraphs left aligned. Do not shrink text to fit a card. Aim for 45-65 characters per line in explanatory text.

Use everyday language: "Past reports", "Book a consultation", "Waiting for clinician review". Never expose "NeuroRisk panel", "clinical sequence", "PHI", "P21", "validated phenotype" or model probabilities on Home.

## Layout

### The deliberately small application shell

Desktop: one 72px header, a centered main column up to 720px, generous unused space. Header contains the text wordmark **NeuroVX**, three links **Home / Appointments / Reports**, and **Help / Profile**. No sidebar. No notification bell until notifications provide a real need.

Mobile: wordmark plus Help/Profile in a compact header; three labeled bottom destinations **Home / Appointments / Reports**. Use labels, not icons alone. Keep safe-area padding so controls are never covered.

The patient name appears once as the page title. In family mode, put "Meera, helping Asha" beneath it. Do not repeat patient identity in the header, sidebar, card and badge. Switching patient belongs in Profile and must make the selected patient unmistakable.

### Home's information budget

One page title. One primary task panel. One main button. At most one quiet alternative link. Outside that panel, at most one short sentence about what comes afterward. No second column, secondary card grid, full Careline, learning panel, privacy banner, empty appointment widget, progress percentage or floating chatbot.

Do not fill blank space. Desktop simplicity must remain simplicity on mobile, not a long stack of hidden desktop cards.

### First Home state: form completed, assessment not started

Exact visible copy:

- Page title: "Asha's care"
- Family context: "Meera, helping Asha"
- Panel label: "Your next step"
- Panel title: "Begin your cognitive assessment"
- Body: "A few activities to help your clinician understand memory and thinking."
- Primary: "Start assessment"
- Quiet alternative: "Book a clinician instead"
- One line beneath the panel: "After this, you can add past reports and arrange a visit."

Use a small abstract line or dot motif only if it adds calm. No brain art, score dial, illustrative dashboard inside the dashboard, task-duration claim or fake clinical result.

### How Home changes

Only the current task replaces the main panel; never stack all states together.

| Current state | Main title | Main action | Quiet alternative |
| --- | --- | --- | --- |
| Form incomplete | "Tell us a little about the patient" | "Continue setup" | "Get help" |
| Ready for assessment | "Begin your cognitive assessment" | "Start assessment" | "Book a clinician instead" |
| Assessment interrupted | "Your assessment needs attention" | "See next steps" | "Arrange an assisted visit" |
| Assessment submitted | "Your assessment summary is ready" | "View summary" | None |
| Summary seen | "Add any past reports" | "Upload reports" | "Skip to booking" |
| Ready to book | "Find a clinician for your visit" | "Find a clinician" | None |
| Booking requested | "Your appointment request is with the clinic" | "View request" | "Contact support" |
| Booking confirmed | "Your visit is booked" | "View appointment" | None |
| Clinician requests tests | "Your clinician has requested tests" | "View requested tests" | None |
| Report released | "A new report is available" | "View report" | None |
| Clinician review pending | "Your report is waiting for review" | "View care update" | "Contact the care team" |
| Review completed | "Your clinician has shared next steps" | "View care plan" | None |

Interruption does not automatically mean the assessment can resume with a valid score. Apply the instrument's rules. When several events occur, an accountable clinical workflow must prioritize urgent action, then time-sensitive appointments/results; routine uploads must not obscure these.

## Elevation & Depth

Flat, quiet surfaces. Use one subtle 1px panel border and an optional barely visible shadow. Modal overlay may darken the background. Never nest panels inside panels just to group sentences.

## Shapes

16px panel corners, 10px buttons and inputs. No pill-shaped label on every line. Use simple outline icons sparingly; never as the only instruction. Use the NeuroVX logo files in `public/brand/` (via `Wordmark`, `LogoLockup`, `LogoMark`); do not redraw the logo.

## Components

### 1. Entry and patient form

The existing landing-page action "For patients & families" opens ONE dialog with two short pages, not several nested popups. On mobile it becomes a full-screen sheet. Preserve typed entries between pages. Page navigation is Back / Continue; Close returns to the landing page without silently discarding entered data.

**Page 1: "Who is the care for?"**

Place "Myself" and "A family member" as one labeled choice above four fields:

| Field | Behavior |
| --- | --- |
| Patient's name | Required for a saved patient profile. Simple text field; no forced first/middle/last-name structure. |
| Age | Required for assessment eligibility; numeric entry plus "Approximate" option. Do not also demand date of birth. Collect exact DOB later only when needed for booking or identification. |
| Sex - optional | Blank by default; Female / Male / Intersex / Prefer not to say. Never infer from name or appearance. No blocking validation. |
| Preferred language | Required choice with no language proficiency assumption. App language and available assessment language are separate. |

"Myself" changes the field label to "Your name". Selecting family mode does not prove authority to access another person's health records. No Aadhaar, ABHA, insurance, location permission, detailed medical history, research checkbox or lab marketing on this page.

**Page 2: "What brings you here?"**

Three brief question groups:

1. "What have you noticed?" Memory / Attention / Finding words / Everyday tasks / Other / No particular concern. Allow more than one, and keep "No particular concern" exclusive.
2. "When did you first notice it?" Recently, within days / Over weeks or months / More than a year ago / Not sure. Show only after a concern is selected.
3. "Are everyday tasks harder than before?" Yes / No / Not sure. Brief example on demand: managing medicines, money or familiar journeys. Ask about CHANGE, not tasks the person never did.

For a sudden or current acute change, show a clinician-authored urgent-care handoff before any routine cognitive test. Do not imply this three-question form rules out emergencies. A sudden confusion/new weakness/new speech-difficulty notice must direct urgent medical help, not an ordinary appointment queue. Localize emergency contact information. [R1, R8]

Selecting no concern does not create a disease-risk label or automatically offer molecular screening. Offer a clinician conversation if the person remains concerned. Known diagnoses can be added before the visit and should not force repeat screening.

**Identity and consent, just when needed:** before saving identifiable health information or sharing it, show the applicable short care/privacy explanation and establish an account or assisted pathway. One reachable mobile number or an accessible alternative is enough; do not require both phone and email. In family mode collect the helper's name and relationship when saving; establish patient permission or appropriate authority before granting access to patient records. Offer help if this cannot be established. Keep research participation separate and optional, never preselected. The prototype uses synthetic data only.

### 2. Assessment preparation: collect context, not another registration form

Home's "Start assessment" opens a focused page. Gather three short items immediately before choosing the assessment route:

- Years of completed education: number / No formal schooling / Not sure. Do not infer years from a degree or occupation.
- "Are you comfortable reading in [chosen language]?" Yes / No / Prefer spoken instructions. This requests an appropriate supported version, not an automatic translation.
- "Would you need help seeing, hearing or using the screen?" No / Seeing / Hearing / Hand movement or touch / Not sure. Do not score sensory or motor barriers as cognitive errors.

Age, language, education and sensory/motor context inform appropriate selection and interpretation; they are not an Alzheimer's risk calculator. [R1]

For family mode ask "Is [patient name] here to do the activities?" If no, save the family observations and offer a supervised appointment. Family observations remain a separate source. Explain: "You can help set up the device. The activities need [patient name]'s own answers."

Route to ONE appropriately licensed and validated instrument/version for the user's language, age, abilities, device and administration setting. Do not offer a shop of MMSE, MoCA, ADAS-Cog and CDR or require all of them. If supervision is required, arrange a trained assessor instead of disguising it as self-testing. Unsupported language or unsuitable setup leads to assistance, not a fabricated score.

Before starting, show an honest duration from the selected implementation, any equipment needs, and concise assessment consent. Do not invent "2 minutes" or "8-12 minutes" for an unspecified test.

### 3. Assessment interaction: engaging without changing the test

A dedicated distraction-free screen; hide navigation chrome during actual measured tasks, while preserving a safe exit. One authorized task at a time. Large targets, short approved instructions, consistent controls. Neutral completion feedback such as "Response saved" only where the protocol permits.

Gentle engagement comes from clear steps and smooth transitions, NOT correctness rewards, hints, competitive points, streaks, lives, confetti, adaptive difficulty or replay-to-improve-score. No chatbot during assessment. Do not change stimuli, ordering, timing, delay intervals, instructions, response modality, coaching, scoring, translations or pausing to make the test more fun. Even a progress indicator must not interfere with the protocol. [R2-R5]

A "Pause" button, instruction audio, example task, repeat instruction, back navigation or skip is available ONLY when that exact instrument permits it. Otherwise provide "Stop and arrange help" and preserve an accurate interruption record, not a valid-looking total.

**Stitch must design the assessment shell, not protected test content.** Use "Assessment content placeholder - not a clinical test" in a separately labeled demo canvas. Do not recreate drawing tasks, word lists, puzzles or a scoring formula and label them MMSE/MoCA/ADAS-Cog/CDR. A bespoke game would require its own permissions where applicable, evidence and clinical validation; a later clinician review cannot supply that validity. [R2-R5]

These tasks assess cognitive performance. They do not measure blood amyloid, phosphorylated tau or PET pathology. [R6]

### 4. Assessment summary

Exact heading: "Your assessment summary".

For an authorized implementation with permitted automated scoring, show its actual instrument/version and "Score: [score] of [maximum]", then "Waiting for clinician review". Include date and administration mode; keep language, education context, respondent, assistance and validity limitations in "Assessment details". Do not show a numerical demo value in this prototype.

If scoring requires a professional, show "Waiting for scoring" instead. An incomplete/unreliable session shows "No reliable score available" with an assisted route. Never convert missing items into normal performance.

Short explanation: "This assessment does not diagnose dementia or Alzheimer's disease. Your clinician will review it alongside your history." A score without a flag must not overrule persistent symptoms. [R1-R3]

Primary: "Add past reports". Quiet link: "Skip to booking". Keep access to this summary in Reports; a permitted export may include the original score and limitations without disclosing protected test items.

Clinical review adds the clinician's name, date and interpretation. It does not overwrite the raw score or rename it "clinically validated". Booking confirmation is not clinical review.

### 5. Existing reports

Heading: "Do you have any past reports?"

Body: "Add reports you already have. You can continue without them."

One upload surface: "Choose files or take a photo". Allow supported PDFs and images; show readable file size/type constraints and per-file status. No required manual test-name/date entry when not known. Ask only for a correction when extraction is uncertain. Keep the original file.

Primary becomes "Continue to booking" after upload. Always allow "I don't have reports". No diagnostic interpretation from a photo. No successful-upload claim before a real upload succeeds. Unsupported scan image formats need a separate imaging workflow, not a promise to process everything.

### 6. Find and book care

Heading: "Find care near you". Ask for city or PIN code here, not during registration. "Use my location" is an optional explicit action; denial retains manual search.

List first; Map is an alternative view. Show a few results and simple filters: clinician/service type, language, in-person/video, distance, availability and fee. Include neurologists, suitable primary-care clinicians, PHCs and hospitals only where the service actually exists.

Each result shows name, verified-if-actually-checked credentials, service/location, language, fee and next available slot. Do not invent ratings, label paid placements "top", or equate distance with clinical quality. Explain sorting, such as "Nearest" or "Soonest available". Clinics and PHCs need actual capabilities, not a neurologist label by association.

On booking review: selected clinician, patient identity, slot, actual fee/cancellation terms and a short "Information to share" list. Default to the relevant assessment, submitted history and patient-selected documents. Let the patient/authorized person inspect and approve this sharing; no blanket lifetime access. Distinguish requested, confirmed and cancelled states. Records may be delivered with a booking request only when authorized and accepted by the destination's access rules. Show delivery only on acknowledgement, retry failures visibly.

One appointment page contains clinician questions, preparation and an optional "Add health details" form. Defer current medicines, allergies, major diagnoses, sleep/mood, previous stroke/head injury, family history and existing diagnosis to this stage or clinician collection. For family history, relation and age at onset matter more than a lone yes/no. Never make optional history completion delay appropriate care. [R1]

### 7. Clinician-requested tests and results

After consultation, Home changes to "Your clinician has requested tests". The patient opens the actual signed/authorized orders and chooses an appropriate provider. Never generate an "Alzheimer's package" from the screening score.

Orders may include MRI, a specifically identified PET modality, a defined blood-biomarker assay, or routine investigations such as HbA1c when clinically requested. MRI and different PET modalities are not interchangeable. HbA1c assesses glycaemia, not Alzheimer-specific pathology. Blood amyloid/tau testing has assay-specific intended use; it is not routine healthy-young-person screening. [R6, R7, R9]

Show exact requested test, ordering clinician, suitable locations, fee, preparation supplied by the provider, and collection/scan availability. Home collection only for tests that support it, never MRI/PET. Provider suitability precedes proximity. Let the patient upload an external order for verification or ask a clinician about a test; do not silently substitute tests.

Sequence: request sent > provider confirmed > attended/collected > report released > delivered to clinician > clinician reviewed. Show only the current stage, with optional details. A released report is available to the patient under the applicable policy; do not pretend release means a clinician has reviewed it or hide it merely to force another booking. Delivery failures and urgent-result handling require real accountable workflows.

The report screen preserves the original laboratory/imaging report. Place clinician explanation separately. Primary after review: "View next steps" or "Book follow-up", as instructed by the clinician. No automatic diagnosis, drug advice or proprietary risk percentage.

### 8. Help and exceptions

Help opens simple platform support. NeuroLearn may sit inside Help as an optional educational route, not a competing dashboard tile or diagnostic chatbot. It may explain terminology and save questions for a clinician, not personalize test orders.

Keep patient-safe empty, loading, save-failed, unavailable-slot, unsupported-assessment and permission-pending states. Never fake "Saved", "Shared" or "Confirmed". Preserve input during recoverable failures. Signed-out/shared-device workflows must not leak health data through local storage, notifications or analytics.

## Do's and Don'ts

- Do generate ONLY the screen(s) requested in the current Stitch prompt. The journey above is context, not a request to put every feature on Home.
- Do keep one obvious next action and a short route around optional steps. Do not impose screening before an appointment.
- Do design for 1440px desktop and 390px mobile, and test reflow down to 320px and enlarged text. Target WCAG 2.2 AA, visible keyboard focus, 4.5:1 normal-text contrast and 3:1 meaningful non-text boundaries. The product chooses approximately 48px or larger targets; that is not a claim that WCAG AA requires 48px. [R10]
- Do implement dialog focus entry, contained keyboard navigation, Escape/Close handling and focus return. Do not open nested modals or rely on clicking outside to close. [R11]
- Do retain accurate identity, permissions and provenance behind the interface. Do not print technical details under every button.
- Do separate research consent from care. Do not design referral-commission incentives, diagnostic upsells, fear-based ads, efficacy claims or fabricated regulatory badges.
- Do use one quiet demo indicator for fictional data. Do not claim validation, security certification, guaranteed privacy properties or working integration from a mockup.

### Evidence notes - for the team, NEVER render as UI

The field staging and layouts are product recommendations, not a prescribed clinical form. Clinical protocols, instrument selection, licensing, privacy, local regulation and implementation accessibility need professional review before live deployment. These sources support the boundaries above, not regulatory approval of NeuroVX.

- [R1] Alzheimer's Association, DETeCD-ADRD guidance and validated instruments: `https://www.alz.org/alz-pro/hub/care-pathway/detecd-adrd-guidance` and `https://pmc.ncbi.nlm.nih.gov/articles/PMC11772712/`.
- [R2] MoCA permissions and terms: `https://mocacognition.com/permission/` and `https://mocacognition.com/terms-of-use/`.
- [R3] Ohio State SAGE, appropriate self-administration and limits: `https://wexnermedical.osu.edu/brain-spine-neuro/memory-disorders/sage`.
- [R4] PAR permissions for reproduction, modification and electronic delivery: `https://www.parinc.com/docs/default-source/forms/par_permission_req_form_distributed.pdf`.
- [R5] ADAS-Cog administration manual hosted by FDA: `https://www.fda.gov/media/122843/download`; CDR clinician ratings and licensing: `https://knightadrc.wustl.edu/professionals-clinicians/cdr-dementia-staging-instrument/cdr-scoring-table/`.
- [R6] NIA, biomarker and imaging roles: `https://www.nia.nih.gov/health/alzheimers-symptoms-and-diagnosis/how-biomarkers-help-diagnose-dementia`.
- [R7] FDA, Lumipulse intended use and limitations: `https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease`.
- [R8] NHS, sudden neurological symptoms and urgent care: `https://www.nhs.uk/conditions/stroke/symptoms/`. Emergency contact details must be localized for India and each supported country.
- [R9] NIDDK, HbA1c purpose: `https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test`.
- [R10] WCAG 2.2: `https://www.w3.org/WAI/WCAG22/quickref/`.
- [R11] W3C modal-dialog pattern: `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`.
- File structure: Google's DESIGN.md specification, optional YAML tokens plus Markdown guidance: `https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md`.

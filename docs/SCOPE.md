# NeuroVX MVP-1 — Demo scope and build contract

**Status:** Demo MVP. React app, no backend, synthetic data only. Not for clinical use.
**Sources of truth, in order:** [`DESIGN.md`](../DESIGN.md) (master, Connected Care v1.0) →
[`docs/design/PATIENT.md`](design/PATIENT.md) (patient and family extension v1.1) →
[`docs/design/PATIENT-ONE-STEP.md`](design/PATIENT-ONE-STEP.md) (used where noted below) → this file.
The Stitch export in [`design/stitch-export/`](../design/stitch-export) is **reference only**. It contains known spec violations (listed below) and must not be copied.

---

## 1. What the demo proves

One fictional care episode, carried across three connected workspaces:

> Meera helps her mother Asha (68) share what has changed → Asha does an assessment preview → Meera requests an appointment with Dr. Kavya Rao → the **clinician workspace** accepts it, sees the visit packet with its sources, and orders two tests → Meera books a home collection → the **lab workspace** collects, processes and releases the Vitamin B12 report → the clinician reviews it and updates the care plan → Home shows "Your clinician added a care update".

Every action updates one shared store (`src/demo/store.tsx`). Presenters can also jump to any point in time with the **Demo** button (bottom-left on private screens) or a deep link: `/app?demo=<stage>&as=<persona>`.

## 2. Decisions on conflicts between the specs

| Conflict | Decision | Why |
|---|---|---|
| Patient navigation: 5 destinations (DESIGN.md, PATIENT.md) vs 3 (ONE-STEP) | **5: Home, My care, Records, Learn, Support.** | The master file the user named as the source of truth specifies 5, and it keeps Learn and Support discoverable. |
| Home density: 2:1 with a secondary column (PATIENT.md) vs one panel only (ONE-STEP) | **PATIENT.md layout, ONE-STEP discipline:** one dominant next-step card, the Careline, at most two optional "Before your visit" rows, and one small secondary column (a Learn card plus a help link). | Keeps discoverability without turning Home into a dashboard. |
| Intake: one long page (Stitch) vs short steps (ONE-STEP, PATIENT.md) | **Short focused steps.** `/start` (who the care is for) → `/start/access` (helper, permissions, privacy) → Home → `/app/care/check-in` (context, concerns, timing and safety, patient context). | PATIENT.md progressive intake. Routes rather than a modal, so each step can be linked to directly and browser Back works. |
| Assessment activities (Stitch recreated word recall and orientation items) | **Shell only.** Three sections that each say "Authorized assessment content will appear here", then **Demo completion** with no score. | Licensed instruments (MoCA, MMSE, ADAS-Cog, CDR) must not be recreated or gamified. |
| Summary heading | Completed: **"Your information is ready for a clinician"** (PATIENT.md P07). | |
| Fonts: "do not ship font files" | **Self-hosted Inter via `@fontsource-variable/inter`.** | That instruction was aimed at Stitch generation. Self-hosting avoids a third-party request on a health app and works offline for demos. |
| Emergency number | **112** (India national emergency number), plus 108 ambulance in many states, on a page labelled as a guidance placeholder. | The Stitch export said 911. |
| Professional workspaces (PATIENT.md says do not generate them) | **Built, in separate workspaces** (`/pro/clinician`, `/pro/lab`). Research is a **concept preview** with no data. Hospital operations are **not built**. | PATIENT.md scopes only its own patient pass. The master's generation order includes clinician and lab. The connected-care thesis needs them. |
| Care & support and devices | Public landing and in-app Support only. **No store, no cart, no listings.** | DESIGN.md: concept screens only after the core is coherent. |

## 3. Stitch export: violations fixed in the rebuild

- Real hospital brands (Apollo, Fortis, Max) → illustrative names. Stock doctor photos → initials.
- "HIPAA Compliant", "Board Certified", "verified clinicians", "Secure Care Portal" badges → removed.
- "Dr. Sarah Mercer", "Dr. A. Sharma", "Asha Sharma" → fixture names from PATIENT.md.
- Screen IDs and route notes in the UI ("P21", "[Routes to P02…]") → removed.
- Durations ("Estimated 8–12 mins", "3–4 mins remaining") → removed.
- A word-recall task, "Listen to instructions", "Pause activity" → assessment shell placeholder.
- "Never sold or used for…" privacy promise → removed. A true statement replaces it: the demo stores data only in this browser tab.
- "Plasma Biomarker Panel" and "Verified Clinical Attributions" on the public preview → removed.
- Eyebrow kickers such as "Structured progression" and "Unified health record" → removed.

## 4. Fixture episode (single source: `src/demo/fixtures.ts`, `src/demo/episode.ts`)

- Patient **Asha Rao, 68**. Care partner **Meera Rao** (daughter). **Dr. Kavya Rao - illustrative clinician**, Example Neuro Clinic - illustrative. **Example Diagnostics - illustrative provider**. Area **Noida - sample search area**.
- The demo's today is 24 Sep 2026. Check-in 25 Sep · assessment 26 Sep · booking requested 27 Sep · confirmed 28 Sep · visit **06 Oct 2026, 4:30 PM IST** · tests requested 06 Oct · collection 08 Oct · B12 released 09 Oct · reviewed 10 Oct · follow-up suggested by 12 Oct.
- Orders: **Vitamin B12 - example clinician order** and **Plasma biomarker assay - illustrative clinician-requested order**. The plasma assay stays **processing** throughout the demo.
- No numeric results, scores, diagnoses, doses or stages. Fees are **prototype placeholders**.
- Always use names through `usePeople()` (`name`, `possessive`, `careTitle`, `signedInAs`). Never hard-code "Asha" in page copy; the presenter can type a different name at `/start`.

## 5. Episode stages → what changes them

| Stage | Set by |
|---|---|
| `new` | `/start/access` completion (`jumpTo('new')` after setting names and persona) |
| `intake-saved` | Answering the first question on `/app/care/check-in` while the stage is `new` |
| `assessment-ready` | Saving the check-in |
| `family-only` | Care partner saves observations and says the patient is not available now |
| `assessment-completed` | Finishing the assessment shell |
| `cannot-assess` | "Stop and arrange help" in the assessment shell |
| `booking-requested` | "Request appointment" on `/app/care/book/review`, or a mode change while confirmed |
| `booking-confirmed` | Clinician workspace **Accept request**; patient answers an info request |
| `info-requested` | Clinician workspace **Request information** |
| `tests-requested` | Clinician workspace **Send order** |
| `collection-arranged` | Patient **Book sample collection** on `/app/care/tests/book` |
| `report-released` | Lab workspace **Release report**; lab **Retry delivery** |
| `delivery-problem` | Lab workspace **Simulate delivery failure** |
| `reviewed` | Clinician workspace **Mark reviewed and update care plan** |
| `follow-up-due` | Clinician workspace **Publish plan with follow-up**, or the Demo panel |
| `existing-care` | Check-in "Already receiving care", or the Demo panel |
| `no-task` | Demo panel |

Use `setStage(stage)` for forward moves that keep data, and `jumpTo(stage)` to load a complete consistent preset. Use `hasReached(state.stage, 'x')` from `@/demo/episode` for "has this happened yet".

## 6. Route map and ownership

Layouts: **P** = PublicLayout · **F** = FocusedLayout (no nav, max 720px) · **A** = PatientLayout (sidebar and bottom nav) · **W** = WorkspaceLayout.

| Route | Layout | File (`src/pages/…`) | Owner |
|---|---|---|---|
| `/` | P | `public/HomePage.tsx` | A |
| `/patients` | P | `public/PatientsPage.tsx` | A |
| `/partners` (#clinicians, #labs) | P | `public/PartnersPage.tsx` | A |
| `/research` | P | `public/ResearchPage.tsx` | A |
| `/care-support` | P | `public/CareSupportPage.tsx` | A |
| `/journey` | P | `public/JourneyPage.tsx` | A |
| `/pilot` | P | `public/PilotPage.tsx` | A |
| `/care-and-research` | P | `public/CareResearchPage.tsx` | A |
| `/contact` `/privacy` `/terms` `/accessibility` | P | `public/InfoPage.tsx` (prop `kind`) | A |
| `/sign-in` | P | `public/SignInPage.tsx` | A |
| `*` | P | `public/NotFoundPage.tsx` | A |
| `/learn`, `/app/learn` | P / A | `learn/LearnHubPage.tsx` (prop `context`) | E |
| `/learn/articles/:slug`, `/app/learn/articles/:slug` | P / A | `learn/ArticlePage.tsx` | E |
| `/learn/neurolearn`, `/app/learn/neurolearn` | P / A | `learn/NeuroLearnPage.tsx` | E |
| `/start` | F | `onboarding/WhoForPage.tsx` | B |
| `/start/access` | F | `onboarding/AccessSetupPage.tsx` | B |
| `/urgent` | F | `onboarding/UrgentHelpPage.tsx` | B |
| `/app/care/check-in` | F | `patient/checkin/CheckInPage.tsx` | B |
| `/app/care/observations` | F | `patient/checkin/ObservationsPage.tsx` | B |
| `/app/care/reports-upload` | F | `patient/checkin/PastReportsPage.tsx` | B |
| `/app/care/assessment` | F | `patient/assessment/AssessmentIntroPage.tsx` | B |
| `/app/care/assessment/session` | F | `patient/assessment/AssessmentSessionPage.tsx` | B |
| `/app/care/assessment/summary` | A | `patient/assessment/AssessmentSummaryPage.tsx` | B |
| `/app/care/find-clinician` | A | `patient/booking/FindClinicianPage.tsx` | C |
| `/app/care/clinicians/:clinicianId` (`?visit=follow-up`) | A | `patient/booking/ClinicianDetailPage.tsx` | C |
| `/app/care/book/review` | F | `patient/booking/BookingReviewPage.tsx` | C |
| `/app/care/visit` (#requests, #questions) | A | `patient/booking/VisitHubPage.tsx` | C |
| `/app/care/visit/change-mode` | F | `patient/booking/ChangeVisitModePage.tsx` | C |
| `/app/care/tests` | A | `patient/tests/RequestedTestsPage.tsx` | D |
| `/app/care/tests/providers` | A | `patient/tests/LabProvidersPage.tsx` | D |
| `/app/care/tests/book` (`?provider=`) | F | `patient/tests/LabBookingPage.tsx` | D |
| `/app/care/tests/progress` | A | `patient/tests/TestProgressPage.tsx` | D |
| `/app/records` | A | `patient/records/RecordsPage.tsx` | D |
| `/app/records/reports/:reportId` | A | `patient/records/ReportDetailPage.tsx` | D |
| `/app/care/plan` | A | `patient/records/CarePlanPage.tsx` | D |
| `/app` | A | `patient/HomePage.tsx` | E |
| `/app/care` | A | `patient/MyCarePage.tsx` | E |
| `/app/support` (#sharing, #assisted, #access) | A | `patient/SupportPage.tsx` | E |
| `/app/access` | A | `patient/AccessPage.tsx` | E |
| `/pro/clinician` … `/patients`, `/patients/:patientId`, `/orders`, `/follow-up` | W | `pro/clinician/*.tsx` | F |
| `/pro/lab` … `/orders/:orderId`, `/collections`, `/results`, `/exceptions` | W | `pro/lab/*.tsx` | G |
| `/pro/research` (#studies, #cohorts, #requests) | W | `pro/research/ResearchOverviewPage.tsx` | G |

**Shared IDs other owners link to:**
- Article slugs: `preparing-for-a-memory-appointment`, `understanding-cognitive-assessments`, `supporting-someone-at-home`.
- NeuroLearn prefill: `/learn/neurolearn?q=<question>` (public) and `/app/learn/neurolearn?q=<question>` (app).
- Clinician record for the demo patient: `/pro/clinician/patients/asha-rao`.
- Lab order ids: `/pro/lab/orders/ORD-DEMO-0142` (B12) and `/pro/lab/orders/ORD-DEMO-0143` (plasma).
- `/start?next=find-clinician` sends the person to Find a clinician after setup.

## 7. Non-goals for this MVP

Real authentication, a backend, payments, live provider availability, real maps, real uploads (files stay in the tab), production triage logic, a production assessment battery, scoring, NeuroRisk, hospital operations dashboards, device store or checkout, trial matching, sponsor data access, notifications, and translations. The UI is English only; a language preference is recorded.

# NeuroVX MVP-1 — End-to-end demo script

**Live demo:** https://neurovx-mvp.vercel.app
**Locally:** `npm run dev` → http://localhost:5173 (see [`LOCAL-GUIDE.md`](LOCAL-GUIDE.md))

> **Product preview - not for clinical use.** Every person, clinic, lab and result is fictional. The demo produces no scores, result values or diagnoses. Say this out loud at the start.

This script follows one fictional care episode across three connected workspaces:

> **Meera** helps her mother **Asha Rao (68)** share what has changed → assessment preview (no score) → requests an appointment with **Dr. Kavya Rao** (illustrative) → the **clinician** accepts it, reviews the draft summary and orders two tests → the family books a home collection with **Example Diagnostics** (illustrative) → the **lab** collects, processes and releases the Vitamin B12 report → the clinician reviews it and publishes a care plan with a follow-up → the patient's Home says **"Plan your next visit"**.

Every button named below was checked against the running app. Button names are in **bold**. Suggested talk track is in *italics*.

---

## 0. Before you present (2 minutes)

| Check | Why |
|---|---|
| Use **one browser tab** for the whole demo. | Demo state lives in `sessionStorage`, which belongs to a single tab. A new tab starts a fresh episode. |
| Use a laptop-width window (about 1440px) at 100% zoom. | The layouts are tuned for 1440, 390 and 320px. |
| Open the **Demo** button (top right of every signed-in screen) → **Reset demo** → **Done**. | This clears anything left over from a rehearsal. |
| Keep this file open on a second screen. | The deep links in §4 let you recover from any mistake in one click. |

**The Demo panel** (the **Demo** button in the header of every patient, task and workspace screen) is your control room:
- **Who is signed in to the patient workspace**: *Meera - care partner* (the default), *Asha - patient* or *Helper, no access yet*.
- **Care episode: main path** and **Care episode: other situations**: jump to any stage with complete, consistent data.
- **Open a workspace**: *Patient and family*, *Clinician* or *Diagnostic lab*.
- **Reset demo**: go back to a clean start.

**Moving between workspaces:** use the Demo panel → **Open a workspace**, or **Switch workspace** in the clinician and lab headers. The patient visit hub also has **Open the clinician workspace**, and each lab order has **See the patient view** and **See the clinician view**.

---

## 1. Choose your version

| Version | Length | Start at | Use when |
|---|---|---|---|
| **A. Full story** | about 15 min | `/` | First meeting, investors, partners who need the "why" |
| **B. Connected-care core** | about 7 min | `/pro/clinician?demo=booking-requested` | Clinicians and labs, or when time is short |
| **C. Exceptions and honesty** | about 3 min, add to A or B | Deep links in §3 | Regulators, clinical advisors, skeptics |

Version B is Acts 5–8 of Version A.

---

## 2. Version A — full story

### Act 1 · The public promise (1 min) — `/`
1. Open `/`. Hero: **"Brain care. Connected."** and the "Your next step" preview.
   *"Memory care in India is fragmented. Families repeat the same story at every visit, and tests and reports get lost between clinic, lab and home. NeuroVX keeps one episode together."*
2. Scroll once to show the patient, clinician, lab and research entry points. Then click **Get started**.

### Act 2 · Setup with a care partner (1.5 min) — `/start`
3. **Who is the care for?** Choose **Helping a family member**. The patient is prefilled as Asha Rao, 68. Click **Continue**.
4. **How you will help Asha**: Meera is her daughter. Show the permission choices (**Help with bookings**, **Contribute observations**, **View care plan**, **View selected reports**). For **Has Asha agreed to you helping?**, choose **Yes, Asha agrees**.
   *"Consent and roles come first. A helper only sees what the patient allowed."*
5. Click **Continue to Asha's care**.

### Act 3 · One next step, then the check-in (2.5 min) — `/app`
6. Home shows one dominant card: **"Start with what you've noticed"**. Point out the Careline, a quiet 5-step journey that is **not** a medical signal.
   *"Home never becomes a dashboard. There is always one next step."*
7. Click **Start care check-in**.
   - **What brings you here?** → **A new concern** → **Continue**.
   - **What has changed?** Tick a few concerns, then choose when it was first noticed and whether everyday tasks are harder. **Continue**.
   - **Did the change happen suddenly?** Answer **No**.
     *"If you answer yes, it goes to urgent help and 112, not to a booking. Safety beats conversion."*
   - **What should the clinician know?** → **Continue** → **Check your answers** → **Save check-in**.
8. On **Check-in saved**, click **Go to Home**. Home now says **"Ready for your memory assessment?"**

### Act 4 · Assessment preview (2 min)
9. Click **Review instructions**. On **Before you begin**, answer education (for example **Not sure**), reading comfort and support needs, then tick the preview confirmation.
10. Click **Hand over to Asha**. You see **"Now it is Asha's turn"**.
    *"Family observations and patient answers are kept separate. Meera sets up the device, and Asha answers."*
11. Click **Asha is ready - start**. Go through **Section 1 of 3** to **Section 3 of 3** with **Continue**. Each section is a placeholder: "Authorized assessment content will appear here".
    *"We never recreate licensed instruments such as MoCA or MMSE, and we never show a score."*
12. **Demo completion** → **View your summary** → **"Your information is ready for a clinician"**. Show the "Not yet reviewed by a clinician. This is not a diagnosis." callout.

### Act 5 · Book and request (1.5 min)
13. Click **Skip to booking** → **Find care near you** → **View availability for Dr. Kavya Rao**.
14. Pick **Tuesday 06 Oct 2026, 4:30 PM** → **Choose this time**.
15. **Check and request your appointment**: under **Visit packet to share**, the family picks exactly what the clinic receives. Untick one uploaded report to show that control. Then click **Request appointment**.
16. The visit hub says **"Request sent. Confirmation is pending."** Home says **"Your appointment request is pending"**.
    *"A request is not a confirmation. We never show 'booked' until the clinic accepts."*

### Act 6 · Clinician workspace (2.5 min) — `/pro/clinician`
17. On the visit hub, click **Open the clinician workspace** (or Demo → **Clinician**). **Today** → **Needs your response** shows Asha's request.
18. Click **Accept request**. The feedback says what changed for the family.
19. Open **Patients** → **Open record** for Asha Rao. Show:
    - **Draft summary - review required** with **Compare with source**. Every line keeps its source: patient-reported, family-observed or system.
    - **Clinical impression** is empty on purpose. *"Nothing here is generated. The clinician writes their own impression."*
20. Click **Order investigations**. Keep **Vitamin B12** and **Plasma biomarker assay** ticked. MRI is shown as "Concept - not available in this preview". Click **Send order**.
21. *Optional:* Demo → **Patient and family**. Home now says **"Choose where to complete your tests"**.

### Act 7 · Family books the collection (1 min) — `/app/care/tests`
22. From Home, click **View requested tests** → **Choose where to complete your tests**. Providers that can do **both** tests are listed first.
23. **Choose this provider** (Example Diagnostics) → **Book sample collection**: choose **Home collection** and **08 Oct 2026**, then **Book sample collection**.
24. **Test progress** shows each test moving on its own. Home says **"Your test visit is booked"**, and the clinician record now says **"Sample collection booked"**.

### Act 8 · Lab workspace (2 min) — `/pro/lab`
25. Demo → **Diagnostic lab** → **Orders** → **Open order ORD-DEMO-0142** (Vitamin B12).
26. Click **Mark collected** (confirm with **Mark collected** in the dialog) → **Mark specimen received** → **Start processing**.
    *Optional:* **See the patient view** or **See the clinician view** after each step. Both follow the lab. The clinician panel moves from "Collection arranged" to "Processing".
27. Open **ORD-DEMO-0143** (plasma): it is **Processing at the reference laboratory**, a different lab. It stays pending for the whole demo.
28. Back on ORD-DEMO-0142, click **Release report** (confirm with **Release report**).
    *"Release by the lab, delivery to the care team and review by the clinician are three separate states. We never merge them."*
29. The patient's Home now says **"A report is available"**, with **Available - not yet reviewed** and **Delivered to your care team**.

### Act 9 · Clinician review closes the loop (1.5 min)
30. Demo → **Clinician** → Asha's record. The panel says **"Vitamin B12 report received"** / **Not yet reviewed**.
31. Click **Mark reviewed and update care plan**. The plain-language explanation is prefilled. Tick **Add a follow-up visit to the plan**, then click **Publish plan with follow-up**.
32. Demo → **Patient and family**. Home says **"Plan your next visit"**, with **Book follow-up** and **View care plan**.
    *"The family always knows who owns the next step. Here, it's them: book the follow-up with the same clinician and care episode."*
33. Close on **View care plan**: named author, date, the clinician's explanation and the plasma assay still processing. There is no value, no score and no diagnosis.

---

## 3. Version C — exceptions and honesty (add-ons)

| Show | How | What to point out |
|---|---|---|
| **Report delivery fails** | Lab order ORD-DEMO-0142 after release → **Simulate delivery failure** (or `/app?demo=delivery-problem`) | Home: **"We could not share your report yet"**, owner NeuroVX support. Support shows the open case. Clinician: **"Expected report not received"**. Nobody fakes a receipt. |
| **Recover from it** | Lab → **Retry delivery** | Every view returns to "delivered, not yet reviewed". |
| **Sudden change** | Check-in → "Did the change happen suddenly?" → **Yes** | Urgent-help route with 112, not a booking. |
| **Assessment can't be completed** | In a section, **Stop and arrange help** (or `/app?demo=cannot-assess`) | **"A clinician can help with the next step"**: no failure label, no score. |
| **Clinician asks for more information** | `/app?demo=info-requested` | **"Your clinician requested more information"**, with the exact fields requested. |
| **Helper without access** | `/app?as=limited-helper&demo=report-released` | Report names and visit details stay hidden, and the page offers to arrange access instead. |
| **Patient's own view** | `/app?as=patient&demo=report-released` | Copy switches to "your care". Names come from the setup screen, never hard-coded. |
| **Research is separate** | `/pro/research` | "Concept - not available in this preview". It is never preselected and never mixed into care screens. |
| **NeuroLearn** | `/app/learn/neurolearn` | Education with dated sources, not a clinician. Urgent wording routes to `/urgent`. |

---

## 4. Deep-link recovery table

Append `?demo=<stage>` (and optionally `&as=care-partner|patient|limited-helper`) to **any** route to load a complete, consistent preset. For example: `https://neurovx-mvp.vercel.app/app?demo=report-released&as=patient`.

| Stage (`?demo=`) | Patient Home headline | Main action |
|---|---|---|
| `new` | Start with what you've noticed | Start care check-in |
| `intake-saved` | Continue where you stopped | Continue check-in |
| `assessment-ready` | Ready for your memory assessment? | Review instructions |
| `assessment-completed` | Your assessment is ready to discuss | Find a clinician |
| `booking-requested` | Your appointment request is pending | View request |
| `booking-confirmed` | Prepare for your clinician visit | Review visit details |
| `tests-requested` | Choose where to complete your tests | View requested tests |
| `collection-arranged` | Your test visit is booked | View preparation |
| `report-released` | A report is available | View report |
| `reviewed` | Your clinician added a care update | View care plan |
| `follow-up-due` | Plan your next visit | Book follow-up |
| `family-only` | Your observations are saved | Review your observations |
| `cannot-assess` | A clinician can help with the next step | Find a clinician |
| `info-requested` | Your clinician requested more information | View request |
| `delivery-problem` | We could not share your report yet | Get help sharing |
| `existing-care` | Continue your care | Review next visit |
| `no-task` | Your care plan is up to date | View care plan |

**Useful direct links**
- Clinician record: `/pro/clinician/patients/asha-rao` (add `?tab=results` for Results)
- Lab orders: `/pro/lab/orders/ORD-DEMO-0142` (B12) and `/pro/lab/orders/ORD-DEMO-0143` (plasma)
- Patient: `/app/care/visit`, `/app/care/tests/progress`, `/app/records/reports/b12`, `/app/care/plan`

---

## 5. Say / never say

| Say | Never say |
|---|---|
| "Illustrative clinician", "illustrative provider", "prototype placeholder fee" | Real hospital or lab brands, "certified", "HIPAA compliant", "verified clinicians" |
| "Demo completion. No score is produced." | Any score, "brain age", risk percentage, stage or diagnosis |
| "Request sent, confirmation pending" | "Booked" before the clinic accepts |
| "Released by the lab", "delivered to the care team", "reviewed by the clinician" (three separate steps) | "Results are ready" as if the clinician had seen them |
| "Concept - not available in this preview" | That anything not built works, or "Saved"/"Sent" when nothing happened |
| "Education, not a diagnosis" (NeuroLearn) | That NeuroLearn gives medical advice |

---

## 6. Likely questions

- **"Is this real data?"** No. Everything is synthetic and stays in this browser tab. Nothing is sent anywhere.
- **"Is there a backend?"** Not in MVP-1. One shared in-browser store drives all three workspaces, which is why a lab click shows up on the patient's Home.
- **"What does the assessment measure?"** Nothing in this preview. The real instrument would be licensed and clinically validated, so we show only a shell and a "Demo completion" screen.
- **"Why doesn't Home change while the lab processes?"** By design (PATIENT.md Home states): Home stays at "Your test visit is booked". Test progress shows each lab step.
- **"What if I book another clinician or lab?"** The patient side handles it. The clinician workspace belongs to Dr. Kavya Rao and the lab workspace to Example Diagnostics, so stay on the scripted choices for the connected part of the demo.

## 7. Troubleshooting on stage

| Symptom | Fix |
|---|---|
| A screen shows an unexpected stage | Demo → pick the stage, or use the deep link from §4 |
| You opened a new tab and lost progress | Go back to the original tab, or use a deep link |
| Buttons you expect are missing in the clinician or lab workspace | The episode hasn't reached that stage yet. Check the stage in the Demo panel |
| Everything is confused | Demo → **Reset demo**, then restart from `/pro/clinician?demo=booking-requested` (Version B) |

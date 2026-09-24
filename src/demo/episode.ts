/**
 * The care-episode state machine. One table decides what patient Home shows,
 * where the Careline sits and which fixtures exist at each point in time.
 * Source: docs/design/PATIENT.md › "Home is a set of states, not a single mockup".
 */
import { clinicianById, CLINICIANS, DEMO_UPLOADS, EPISODE_DATES, findSlot, ORG } from './fixtures'
import type { BookingState, DemoState, EpisodeStage, Tone } from './types'

/** Golden-path order. Variants map onto a position on this path. */
export const GOLDEN_PATH: EpisodeStage[] = [
  'new',
  'intake-saved',
  'assessment-ready',
  'assessment-completed',
  'booking-requested',
  'booking-confirmed',
  'tests-requested',
  'collection-arranged',
  'report-released',
  'reviewed',
  'follow-up-due',
]

/** Where each variant sits on the golden path (for timeline + fixtures). */
const PATH_POSITION: Record<EpisodeStage, EpisodeStage> = {
  new: 'new',
  'intake-saved': 'intake-saved',
  'family-only': 'assessment-ready',
  'assessment-ready': 'assessment-ready',
  'assessment-completed': 'assessment-completed',
  'cannot-assess': 'assessment-completed',
  'booking-requested': 'booking-requested',
  'booking-confirmed': 'booking-confirmed',
  'info-requested': 'booking-confirmed',
  'tests-requested': 'tests-requested',
  'collection-arranged': 'collection-arranged',
  'report-released': 'report-released',
  'delivery-problem': 'report-released',
  reviewed: 'reviewed',
  'follow-up-due': 'follow-up-due',
  'existing-care': 'follow-up-due',
  'no-task': 'follow-up-due',
}

export function pathIndex(stage: EpisodeStage) {
  return GOLDEN_PATH.indexOf(PATH_POSITION[stage])
}

/** True when the episode has reached (or passed) `stage` on the golden path. */
export function hasReached(current: EpisodeStage, stage: EpisodeStage) {
  return pathIndex(current) >= pathIndex(stage)
}

/* ---------------- Careline ---------------- */

export const CARELINE_STEPS = [
  { id: 'prepare', label: 'Prepare', sublabel: 'Check-in and past records' },
  { id: 'visit', label: 'Visit', sublabel: 'Clinical conversation' },
  { id: 'tests', label: 'Tests, if needed', sublabel: 'Only if your clinician asks' },
  { id: 'review', label: 'Review', sublabel: 'Results explained by your clinician' },
  { id: 'ongoing', label: 'Ongoing care', sublabel: 'Plan and follow-up' },
] as const

export type CarelineStepId = (typeof CARELINE_STEPS)[number]['id']

const CARELINE_POSITION: Record<EpisodeStage, number> = {
  new: 0,
  'intake-saved': 0,
  'family-only': 0,
  'assessment-ready': 0,
  'assessment-completed': 0,
  'cannot-assess': 0,
  'booking-requested': 1,
  'booking-confirmed': 1,
  'info-requested': 1,
  'tests-requested': 2,
  'collection-arranged': 2,
  'report-released': 2,
  'delivery-problem': 2,
  reviewed: 3,
  'follow-up-due': 4,
  'existing-care': 4,
  'no-task': 4,
}

export type CarelineNodeState = 'completed' | 'current' | 'upcoming' | 'not-needed'

export function carelineFor(stage: EpisodeStage) {
  const current = CARELINE_POSITION[stage]
  return CARELINE_STEPS.map((step, i) => ({
    ...step,
    state: (i < current ? 'completed' : i === current ? 'current' : 'upcoming') as CarelineNodeState,
  }))
}

/* ---------------- Home next step ---------------- */

export interface NextStep {
  status?: { label: string; tone: Tone }
  title: string
  body: string
  /** Date, place or preparation facts. Only when known. */
  details?: string[]
  /** Who owns the task when it is not the patient. */
  owner?: string
  primary: { label: string; to: string }
  alternative?: { label: string; to: string }
}

/**
 * Home copy per stage. `name` is the patient's first name.
 * Copy follows PATIENT.md tables and DESIGN.md voice rules exactly where given.
 */
export function nextStepFor(stage: EpisodeStage, name: string, booking?: BookingState): NextStep {
  // Visit details come from the actual booking; fixtures are the fallback.
  const clinician = clinicianById(booking?.clinicianId) ?? CLINICIANS[0]
  const slot = findSlot(clinician, booking?.slotId) ?? clinician.slots[0]
  const mode = booking?.mode ?? slot.mode
  const visitLine = `${slot.date}, ${slot.time} · ${mode === 'video' ? 'Video visit' : 'In clinic'}`
  const doctor = clinician.name
  switch (stage) {
    case 'new':
      return {
        title: 'Start with what you’ve noticed',
        body: 'Tell us what has changed. You can add more before the visit.',
        primary: { label: 'Start care check-in', to: '/app/care/check-in' },
        alternative: { label: 'Find a clinician first', to: '/app/care/find-clinician' },
      }
    case 'intake-saved':
      return {
        status: { label: 'In progress', tone: 'info' },
        title: 'Continue where you stopped',
        body: 'Your check-in is saved. You can pick up from the next question.',
        primary: { label: 'Continue check-in', to: '/app/care/check-in' },
        alternative: { label: 'Find a clinician first', to: '/app/care/find-clinician' },
      }
    case 'family-only':
      return {
        status: { label: 'Saved', tone: 'info' },
        title: 'Your observations are saved',
        body: `${name}’s own assessment can happen later or with a clinician. You can arrange the visit now.`,
        primary: { label: `Arrange ${name}’s visit`, to: '/app/care/find-clinician' },
        alternative: { label: 'Review your observations', to: '/app/care/observations' },
      }
    case 'assessment-ready':
      return {
        title: 'Ready for your memory assessment?',
        body: 'It may help your clinician understand memory and thinking. It does not diagnose a condition on its own.',
        primary: { label: 'Review instructions', to: '/app/care/assessment' },
        alternative: { label: 'Book a clinician instead', to: '/app/care/find-clinician' },
      }
    case 'assessment-completed':
      return {
        status: { label: 'Completed - not yet reviewed', tone: 'neutral' },
        title: 'Your assessment is ready to discuss',
        body: 'A clinician has not reviewed it yet. It is not a diagnosis.',
        primary: { label: 'Find a clinician', to: '/app/care/find-clinician' },
        alternative: { label: 'View summary', to: '/app/care/assessment/summary' },
      }
    case 'cannot-assess':
      return {
        status: { label: 'Not completed', tone: 'neutral' },
        title: 'A clinician can help with the next step',
        body: 'The assessment could not be completed as planned. That is not a result. A clinician can arrange an assisted assessment.',
        primary: { label: 'Find a clinician', to: '/app/care/find-clinician' },
        alternative: { label: 'What this means', to: '/app/care/assessment/summary' },
      }
    case 'booking-requested':
      return {
        status: { label: 'Request sent - confirmation pending', tone: 'warning' },
        title: 'Your appointment request is pending',
        body: 'The clinic has your request. It is not confirmed yet.',
        details: [`Requested: ${visitLine}`, `${doctor} - ${clinician.label.toLowerCase()}`],
        owner: `Waiting on: ${clinician.clinic}`,
        primary: { label: 'View request', to: '/app/care/visit' },
        alternative: { label: 'Contact support', to: '/app/support' },
      }
    case 'booking-confirmed':
      return {
        status: { label: 'Confirmed', tone: 'info' },
        title: 'Prepare for your clinician visit',
        body: 'Review your concerns and bring any previous reports.',
        details: [visitLine, `${doctor} · ${clinician.clinic}`],
        primary: { label: 'Review visit details', to: '/app/care/visit' },
      }
    case 'info-requested':
      return {
        status: { label: 'Action needed', tone: 'warning' },
        title: 'Your clinician requested more information',
        body: `${doctor} asked for a list of current medicines before the visit.`,
        details: [visitLine],
        owner: `Requested by ${doctor}`,
        primary: { label: 'View request', to: '/app/care/visit#requests' },
      }
    case 'tests-requested':
      return {
        status: { label: 'Requested by your clinician', tone: 'info' },
        title: 'Choose where to complete your tests',
        body: `Dr. Kavya Rao requested two tests after the visit on ${EPISODE_DATES.visit}.`,
        owner: 'Ordered by Dr. Kavya Rao',
        primary: { label: 'View requested tests', to: '/app/care/tests' },
      }
    case 'collection-arranged':
      return {
        status: { label: 'Booked', tone: 'info' },
        title: 'Your test visit is booked',
        body: 'Home sample collection. The provider confirms any preparation.',
        details: [`${EPISODE_DATES.collection}, ${EPISODE_DATES.collectionTime}`, ORG.lab],
        primary: { label: 'View preparation', to: '/app/care/tests/progress' },
      }
    case 'report-released':
      return {
        status: { label: 'Available - not yet reviewed', tone: 'neutral' },
        title: 'A report is available',
        body: 'Your Vitamin B12 report was released. Your clinician has not reviewed it yet.',
        details: [`Released ${EPISODE_DATES.released} by Example Diagnostics`, 'Delivered to your care team'],
        owner: 'Awaiting review by your clinician',
        primary: { label: 'View report', to: '/app/records/reports/b12' },
      }
    case 'delivery-problem':
      return {
        status: { label: 'Not yet shared', tone: 'warning' },
        title: 'We could not share your report yet',
        body: 'Your report is available, but it has not reached the care team. NeuroVX support is following up.',
        owner: `Owner: ${ORG.support}`,
        primary: { label: 'Get help sharing', to: '/app/support#sharing' },
        alternative: { label: 'View report', to: '/app/records/reports/b12' },
      }
    case 'reviewed':
      return {
        status: { label: `Clinician reviewed ${EPISODE_DATES.reviewed}`, tone: 'info' },
        title: 'Your clinician added a care update',
        body: 'Dr. Kavya Rao reviewed your report and updated your care plan.',
        owner: 'From Dr. Kavya Rao',
        primary: { label: 'View care plan', to: '/app/care/plan' },
      }
    case 'follow-up-due':
      return {
        status: { label: 'To book', tone: 'info' },
        title: 'Plan your next visit',
        body: 'Your care plan suggests a follow-up visit to discuss results. The plan stays available.',
        details: [`Suggested by ${EPISODE_DATES.followUp}`, 'Same clinician and care episode'],
        primary: { label: 'Book follow-up', to: '/app/care/clinicians/kavya-rao?visit=follow-up' },
        alternative: { label: 'View care plan', to: '/app/care/plan' },
      }
    case 'existing-care':
      return {
        title: 'Continue your care',
        body: 'Your records and current plan are here. You do not need to repeat first-time screening.',
        primary: { label: 'Review next visit', to: '/app/care/visit' },
        alternative: { label: 'Add previous reports', to: '/app/care/reports-upload' },
      }
    case 'no-task':
      return {
        title: 'Your care plan is up to date',
        body: 'There are no new tasks in your care plan. This is not a medical all-clear.',
        primary: { label: 'View care plan', to: '/app/care/plan' },
      }
  }
}

/* ---------------- Demo presenter metadata ---------------- */

export const STAGE_META: Record<EpisodeStage, { label: string; when: string; group: 'path' | 'variant' }> = {
  new: { label: 'New - check-in not started', when: EPISODE_DATES.today, group: 'path' },
  'intake-saved': { label: 'Check-in saved part-way', when: EPISODE_DATES.today, group: 'path' },
  'assessment-ready': { label: 'Assessment available', when: EPISODE_DATES.checkIn, group: 'path' },
  'assessment-completed': { label: 'Assessment completed', when: EPISODE_DATES.assessment, group: 'path' },
  'booking-requested': { label: 'Appointment requested', when: EPISODE_DATES.bookingRequested, group: 'path' },
  'booking-confirmed': { label: 'Appointment confirmed', when: EPISODE_DATES.bookingConfirmed, group: 'path' },
  'tests-requested': { label: 'Tests requested', when: EPISODE_DATES.testsRequested, group: 'path' },
  'collection-arranged': { label: 'Sample collection booked', when: '07 Oct 2026', group: 'path' },
  'report-released': { label: 'Report released', when: EPISODE_DATES.released, group: 'path' },
  reviewed: { label: 'Clinician reviewed', when: EPISODE_DATES.reviewed, group: 'path' },
  'follow-up-due': { label: 'Follow-up due', when: EPISODE_DATES.followUp, group: 'path' },
  'family-only': { label: 'Family observations only', when: EPISODE_DATES.checkIn, group: 'variant' },
  'cannot-assess': { label: 'Assessment could not be completed', when: EPISODE_DATES.assessment, group: 'variant' },
  'info-requested': { label: 'Clinician requested information', when: '02 Oct 2026', group: 'variant' },
  'delivery-problem': { label: 'Report delivery failed', when: EPISODE_DATES.released, group: 'variant' },
  'existing-care': { label: 'Existing care (returning patient)', when: EPISODE_DATES.followUp, group: 'variant' },
  'no-task': { label: 'No task due', when: EPISODE_DATES.followUp, group: 'variant' },
}

/* ---------------- State presets ---------------- */

export const INITIAL_STATE: DemoState = {
  version: 1,
  stage: 'new',
  persona: 'care-partner',
  careFor: 'family',
  patient: { firstName: 'Asha', lastName: 'Rao', age: 68, ageApproximate: false, language: 'English' },
  helper: { firstName: 'Meera', lastName: 'Rao', relationship: 'Daughter' },
  permissions: ['bookings', 'observations', 'care-plan', 'selected-reports'],
  contactMethod: 'Mobile number ending 0000 (demo)',
  checkIn: { status: 'not-started', concerns: [], hearingVisionSupport: [] },
  observations: { status: 'not-started', items: [] },
  assessment: { status: 'not-started', section: 1, supportNeeds: [] },
  uploads: [],
  questions: [],
  booking: { share: { checkIn: true, observations: true, assessment: true, uploads: true } },
  labBooking: {},
  onboarded: true,
  clinician: {},
  lab: {},
}

/**
 * A complete, internally consistent state for any stage — used by the
 * presenter's "Jump to" control and by cross-workspace simulations.
 * Keeps the current persona and any names the presenter typed.
 */
export function presetFor(stage: EpisodeStage, from: DemoState = INITIAL_STATE): DemoState {
  const s: DemoState = {
    ...INITIAL_STATE,
    persona: from.persona,
    careFor: from.careFor,
    patient: from.patient,
    helper: from.helper,
    permissions: from.permissions,
    questions: from.questions.length ? from.questions : [],
    stage,
  }
  const at = (x: EpisodeStage) => hasReached(stage, x)

  if (stage === 'intake-saved') {
    s.checkIn = {
      status: 'in-progress',
      careContext: 'new-concern',
      concerns: ['memory', 'finding-words'],
      hearingVisionSupport: [],
    }
  }
  if (at('assessment-ready') || stage === 'family-only') {
    s.checkIn = {
      status: 'saved',
      careContext: stage === 'existing-care' ? 'existing-care' : 'new-concern',
      concerns: ['memory', 'finding-words', 'everyday-tasks'],
      onset: 'weeks-months',
      dailyTasks: 'yes',
      suddenChange: 'no',
      ownWords: 'I forget recent conversations and sometimes lose the word I want.',
      hearingVisionSupport: ['Uses reading glasses'],
      savedAt: EPISODE_DATES.checkIn,
    }
    s.observations = {
      status: 'saved',
      items: ['Repeats the same question within a short time', 'Misplaces everyday items'],
      onset: 'Over the last few months',
      notes: 'Asked me to take over paying the monthly bills.',
      savedAt: EPISODE_DATES.checkIn,
    }
  }
  if (stage === 'cannot-assess') {
    s.assessment = { status: 'interrupted', section: 2, supportNeeds: [], education: '10', readingComfort: 'yes' }
  } else if (at('assessment-completed') && stage !== 'family-only') {
    s.assessment = {
      status: 'completed',
      section: 3,
      supportNeeds: ['Seeing'],
      education: '10',
      readingComfort: 'yes',
      completedAt: EPISODE_DATES.assessment,
    }
    s.uploads = DEMO_UPLOADS.map((u) => ({ ...u }))
  }
  if (at('booking-requested')) {
    const kavya = CLINICIANS[0]
    s.booking = {
      clinicianId: kavya.id,
      slotId: kavya.slots[0].id,
      mode: 'in-clinic',
      share: { checkIn: true, observations: true, assessment: true, uploads: true },
    }
    if (!s.questions.length) s.questions = ['Could any of my medicines affect memory?']
  }
  if (at('collection-arranged')) {
    s.labBooking = { providerId: 'example-diagnostics', slotId: 'ed-1', collection: 'home' }
  }
  return s
}

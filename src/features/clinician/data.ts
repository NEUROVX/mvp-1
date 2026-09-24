/**
 * Clinician workspace view-models. Everything is derived from the one shared
 * demo episode (src/demo/store.tsx), so what the family did is exactly what the
 * clinic sees, with its source. Background rows are clearly fictional.
 */
import { hasReached, STAGE_META } from '@/demo/episode'
import {
  CLINICIANS,
  CONCERN_LABELS,
  EPISODE_DATES,
  ONSET_LABELS,
  ORDERS,
  ORG,
  REPORTS,
} from '@/demo/fixtures'
import type { DemoState, EpisodeStage, Tone, YesNoUnsure } from '@/demo/types'

export const DEMO_PATIENT_ID = 'asha-rao'
export const RECORD_PATH = `/pro/clinician/patients/${DEMO_PATIENT_ID}`
/** Dr. Kavya Rao - the signed-in clinician in this workspace. */
export const CLINICIAN = CLINICIANS[0]
export const B12_REPORT = REPORTS[0]
export const LAB_SHORT = B12_REPORT.issuer

export type RecordTab = 'summary' | 'timeline' | 'assessments' | 'results' | 'care-plan'
export const RECORD_TABS: Array<{ id: RecordTab; label: string }> = [
  { id: 'summary', label: 'Summary' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'results', label: 'Results' },
  { id: 'care-plan', label: 'Care plan' },
]
export const recordTabPath = (tab: RecordTab) => `${RECORD_PATH}?tab=${tab}`

/** The workspace's "today" follows the episode's point in time. */
export const workspaceToday = (stage: EpisodeStage) => STAGE_META[stage].when

/** The clinic only receives anything once the family requests an appointment. */
export const clinicHasAccess = (stage: EpisodeStage) => hasReached(stage, 'booking-requested')

export const isReleased = (stage: EpisodeStage) => hasReached(stage, 'report-released')
export const isReviewed = (stage: EpisodeStage) => hasReached(stage, 'reviewed')
export const hasOrders = (stage: EpisodeStage) => hasReached(stage, 'tests-requested')

/* ------------------------------------------------------------------ */
/* Episode facts                                                        */
/* ------------------------------------------------------------------ */

export function requestedSlot(state: DemoState) {
  const c = CLINICIANS.find((x) => x.id === state.booking.clinicianId) ?? CLINICIAN
  const slot = c.slots.find((s) => s.id === state.booking.slotId) ?? c.slots[0]
  const mode = state.booking.mode ?? slot.mode
  return {
    date: slot.date,
    time: slot.time,
    when: `${slot.date}, ${slot.time}`,
    modeLabel: mode === 'video' ? 'Video visit' : 'In clinic',
  }
}

/** What the family chose to share in the visit packet. */
export function packetParts(state: DemoState) {
  const share = state.booking.share
  const parts: string[] = []
  if (share.checkIn && state.checkIn.status === 'saved') parts.push('check-in')
  if (share.observations && state.observations.status === 'saved') parts.push('family observations')
  if (share.assessment && (state.assessment.status === 'completed' || state.assessment.status === 'interrupted'))
    parts.push('assessment preview')
  if (share.uploads && state.uploads.length)
    parts.push(`${state.uploads.length} ${state.uploads.length === 1 ? 'report' : 'reports'}`)
  return parts
}

export function concernText(keys: string[]) {
  const labels = keys.filter((k) => k !== 'none').map((k, i) => {
    const l = CONCERN_LABELS[k] ?? k
    return i === 0 ? l : l.toLowerCase()
  })
  if (!labels.length) return keys.includes('none') ? 'No particular concern' : 'Not recorded'
  return labels.join(', ')
}

export const onsetText = (onset?: string) => (onset ? (ONSET_LABELS[onset] ?? onset) : 'Not recorded')

export function yesNo(v?: YesNoUnsure) {
  if (v === 'yes') return 'Yes'
  if (v === 'no') return 'No'
  if (v === 'not-sure') return 'Not sure'
  return 'Not recorded'
}

export function sexText(sex?: DemoState['patient']['sex']) {
  switch (sex) {
    case 'female':
      return 'Female'
    case 'male':
      return 'Male'
    case 'intersex':
      return 'Intersex'
    case 'prefer-not':
      return 'Prefers not to say'
    default:
      return 'Not recorded'
  }
}

export const CARE_CONTEXT_LABELS: Record<string, string> = {
  'new-concern': 'A new concern',
  'existing-care': 'Already receiving care',
  'prescribed-test': 'A test a clinician prescribed',
}

/* ------------------------------------------------------------------ */
/* Clinician-only draft fields                                          */
/* ------------------------------------------------------------------ */

/** Demo-only clinician fields in `state.clinician`. They reset with the episode. */
export type ClinicianState = DemoState['clinician']
export const clinicianOf = (state: DemoState): ClinicianState => state.clinician

/* ------------------------------------------------------------------ */
/* Orders and results                                                   */
/* ------------------------------------------------------------------ */

export interface OrderStatus {
  label: string
  tone: Tone
  owner: string
}

/** Operational state of one order (DESIGN.md › Orders: keep states distinct). */
export function orderStatus(state: DemoState, orderId: 'b12' | 'plasma'): OrderStatus | null {
  const st = state.stage
  if (!hasOrders(st)) return null
  if (st === 'tests-requested') return { label: 'Ordered', tone: 'neutral', owner: 'Family chooses a provider' }
  if (st === 'collection-arranged') {
    const b = state.lab.b12
    if (!b || b === 'received')
      return { label: 'Collection arranged', tone: 'neutral', owner: `${LAB_SHORT} · ${EPISODE_DATES.collection}` }
    if (b === 'collected') return { label: 'Collected', tone: 'neutral', owner: LAB_SHORT }
    if (orderId === 'plasma') return { label: 'Processing at reference lab', tone: 'neutral', owner: ORG.referenceLab }
    return b === 'specimen-received'
      ? { label: 'Specimen received', tone: 'neutral', owner: LAB_SHORT }
      : { label: 'Processing', tone: 'neutral', owner: LAB_SHORT }
  }
  if (orderId === 'plasma') return { label: 'Processing at reference lab', tone: 'neutral', owner: ORG.referenceLab }
  if (st === 'report-released') return { label: 'Released - not yet reviewed', tone: 'info', owner: CLINICIAN.name }
  if (st === 'delivery-problem') return { label: 'Released - not received', tone: 'warning', owner: ORG.support }
  return { label: 'Reviewed', tone: 'info', owner: 'No action due' }
}

/** The plasma assay is processing at the reference lab once the sample is collected. */
export const plasmaProcessing = (state: DemoState) =>
  orderStatus(state, 'plasma')?.label.startsWith('Processing') ?? false

export const DEMO_ORDERS = ORDERS.map((o) => ({ ...o, id: o.id as 'b12' | 'plasma' }))

/* ------------------------------------------------------------------ */
/* Where the episode stands, in the clinic's words                     */
/* ------------------------------------------------------------------ */

export interface EpisodeRow {
  lastEvent: string
  lastDate: string
  nextStep: string
  owner: string
}

export function episodeRow(state: DemoState, helperName: string): EpisodeRow {
  const slot = requestedSlot(state)
  switch (state.stage) {
    case 'booking-requested':
      return {
        lastEvent: 'Appointment requested',
        lastDate: EPISODE_DATES.bookingRequested,
        nextStep: 'Respond to the request',
        owner: CLINICIAN.name,
      }
    case 'booking-confirmed':
      return {
        lastEvent: 'Appointment confirmed',
        lastDate: EPISODE_DATES.bookingConfirmed,
        nextStep: `Visit ${slot.when}`,
        owner: CLINICIAN.name,
      }
    case 'info-requested':
      return {
        lastEvent: 'Information requested',
        lastDate: STAGE_META['info-requested'].when,
        nextStep: 'Reply with current medicines',
        owner: `${helperName}, care partner`,
      }
    case 'tests-requested':
      return {
        lastEvent: 'Tests ordered',
        lastDate: EPISODE_DATES.testsRequested,
        nextStep: 'Choose where to complete tests',
        owner: 'Family',
      }
    case 'collection-arranged':
      return {
        lastEvent: 'Sample collection booked',
        lastDate: STAGE_META['collection-arranged'].when,
        nextStep: `Home collection ${EPISODE_DATES.collection}, ${EPISODE_DATES.collectionTime}`,
        owner: LAB_SHORT,
      }
    case 'report-released':
      return {
        lastEvent: 'Vitamin B12 report received',
        lastDate: EPISODE_DATES.released,
        nextStep: 'Review the report',
        owner: CLINICIAN.name,
      }
    case 'delivery-problem':
      return {
        lastEvent: 'Report delivery failed',
        lastDate: EPISODE_DATES.released,
        nextStep: 'Resend the report to the clinic',
        owner: ORG.support,
      }
    case 'reviewed':
      return {
        lastEvent: 'Care plan updated',
        lastDate: EPISODE_DATES.reviewed,
        nextStep: 'Review the plasma assay when released',
        owner: `${ORG.referenceLab}, then ${CLINICIAN.name}`,
      }
    case 'follow-up-due':
      return {
        lastEvent: 'Care plan updated',
        lastDate: EPISODE_DATES.reviewed,
        nextStep: `Follow-up visit, suggested by ${EPISODE_DATES.followUp}`,
        owner: 'Family books it',
      }
    case 'existing-care':
      return {
        lastEvent: 'Returning patient',
        lastDate: EPISODE_DATES.followUp,
        nextStep: 'Arrange the next visit',
        owner: 'Family',
      }
    case 'no-task':
      return {
        lastEvent: 'Care plan up to date',
        lastDate: EPISODE_DATES.reviewed,
        nextStep: 'No task due',
        owner: 'No owner needed',
      }
    default:
      return { lastEvent: 'No information shared yet', lastDate: '', nextStep: 'None', owner: 'None' }
  }
}

/** Items the clinic is waiting on someone else for (never the clinician). */
export function waitingOnOthers(state: DemoState, fullName: string, helperName: string) {
  const st = state.stage
  const items: Array<{ id: string; who: string; what: string; tone?: Tone }> = []
  if (st === 'info-requested')
    items.push({ id: 'info', who: `${helperName}, care partner`, what: `Reply with ${fullName}’s current medicines` })
  if (st === 'tests-requested')
    items.push({ id: 'choose', who: 'Family', what: `Choose where ${fullName} completes the tests` })
  if (st === 'collection-arranged')
    items.push({
      id: 'collect',
      who: LAB_SHORT,
      what: `Home collection for ${fullName}, ${EPISODE_DATES.collection}, ${EPISODE_DATES.collectionTime}`,
    })
  if (st === 'delivery-problem')
    items.push({ id: 'resend', who: ORG.support, what: `Resend ${fullName}’s Vitamin B12 report to the clinic`, tone: 'warning' })
  if (st === 'follow-up-due')
    items.push({ id: 'follow', who: 'Family', what: `Book ${fullName}’s follow-up visit by ${EPISODE_DATES.followUp}` })
  if (hasReached(st, 'report-released'))
    items.push({ id: 'plasma', who: ORG.referenceLab, what: `Plasma biomarker assay for ${fullName} - processing, no estimate supplied` })
  return items
}

/* ------------------------------------------------------------------ */
/* Background rows (clearly fictional)                                  */
/* ------------------------------------------------------------------ */

export interface VisitRow {
  id: string
  time: string
  patient: string
  reason: string
  packet: string
  packetTone: Tone
  owner: string
  href: string
  demoPatient?: boolean
}

export const SAMPLE_VISITS: VisitRow[] = [
  {
    id: 'r-iyer',
    time: '10:00 AM',
    patient: 'R. Iyer (demo)',
    reason: 'Follow-up visit',
    packet: 'Previous notes on file',
    packetTone: 'neutral',
    owner: CLINICIAN.name,
    href: '/pro/clinician/patients/r-iyer',
  },
  {
    id: 's-khan',
    time: '11:30 AM',
    patient: 'S. Khan (demo)',
    reason: 'New memory concern',
    packet: 'Visit packet received',
    packetTone: 'info',
    owner: CLINICIAN.name,
    href: '/pro/clinician/patients/s-khan',
  },
  {
    id: 'p-menon',
    time: '2:00 PM',
    patient: 'P. Menon (demo)',
    reason: 'Follow-up visit',
    packet: 'No packet shared',
    packetTone: 'neutral',
    owner: 'Clinic desk (demo)',
    href: '/pro/clinician/patients/p-menon',
  },
]

export interface PatientRow {
  id: string
  name: string
  age: string
  lastEvent: string
  nextStep: string
  owner: string
  href: string
  demoPatient?: boolean
}

export const SAMPLE_PATIENTS: PatientRow[] = [
  {
    id: 'r-iyer',
    name: 'R. Iyer (demo)',
    age: '74',
    lastEvent: 'Care plan updated',
    nextStep: 'Follow-up visit today, 10:00 AM',
    owner: CLINICIAN.name,
    href: '/pro/clinician/patients/r-iyer',
  },
  {
    id: 's-khan',
    name: 'S. Khan (demo)',
    age: '66',
    lastEvent: 'Visit packet received',
    nextStep: 'First visit today, 11:30 AM',
    owner: CLINICIAN.name,
    href: '/pro/clinician/patients/s-khan',
  },
  {
    id: 'p-menon',
    name: 'P. Menon (demo)',
    age: '71',
    lastEvent: 'Follow-up visit booked',
    nextStep: 'Collect the visit packet',
    owner: 'Clinic desk (demo)',
    href: '/pro/clinician/patients/p-menon',
  },
  {
    id: 'n-das',
    name: 'N. Das (demo)',
    age: '69',
    lastEvent: 'Laboratory report reviewed',
    nextStep: 'Follow-up visit to book',
    owner: 'Patient books it',
    href: '/pro/clinician/patients/n-das',
  },
]

export interface FollowUpRow {
  id: string
  patient: string
  item: string
  due: string
  owner: string
  waitingOn: 'you' | 'others'
  href: string
  demoPatient?: boolean
}

export const SAMPLE_FOLLOW_UPS: FollowUpRow[] = [
  {
    id: 'fu-n-das',
    patient: 'N. Das (demo)',
    item: 'Follow-up visit to discuss a reviewed report',
    due: 'Suggested by 20 Oct 2026',
    owner: 'Patient books it',
    waitingOn: 'others',
    href: '/pro/clinician/patients/n-das',
  },
  {
    id: 'fu-r-iyer',
    patient: 'R. Iyer (demo)',
    item: 'Read a previous report the family added',
    due: 'Before the next visit',
    owner: CLINICIAN.name,
    waitingOn: 'you',
    href: '/pro/clinician/patients/r-iyer',
  },
  {
    id: 'fu-p-menon',
    patient: 'P. Menon (demo)',
    item: 'Ask the family to share a visit packet',
    due: 'Before the next visit',
    owner: 'Clinic desk (demo)',
    waitingOn: 'others',
    href: '/pro/clinician/patients/p-menon',
  },
]

export const SAMPLE_IDS = new Set(SAMPLE_PATIENTS.map((p) => p.id))

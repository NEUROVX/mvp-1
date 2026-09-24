/**
 * Demo domain types. Everything here is synthetic prototype data.
 * Nothing is sent anywhere; state lives in memory and sessionStorage only.
 */

/** Care-episode stages. Each one is a point in time for the fictional episode. */
export type EpisodeStage =
  | 'new'
  | 'intake-saved'
  | 'family-only'
  | 'assessment-ready'
  | 'assessment-completed'
  | 'cannot-assess'
  | 'booking-requested'
  | 'booking-confirmed'
  | 'info-requested'
  | 'tests-requested'
  | 'collection-arranged'
  | 'report-released'
  | 'delivery-problem'
  | 'reviewed'
  | 'follow-up-due'
  | 'existing-care'
  | 'no-task'

/** Who is signed in to the patient workspace. */
export type Persona = 'care-partner' | 'patient' | 'limited-helper'

export type Tone = 'info' | 'warning' | 'error' | 'neutral'

/** Provenance of a piece of information. Always shown as text, never colour only. */
export type SourceKind =
  | 'patient'
  | 'care-partner'
  | 'clinician'
  | 'lab'
  | 'imaging'
  | 'system'

export type CareContext = 'new-concern' | 'existing-care' | 'prescribed-test'

export type ConcernKey =
  | 'memory'
  | 'attention'
  | 'finding-words'
  | 'everyday-tasks'
  | 'behaviour'
  | 'other'
  | 'none'

export type OnsetKey = 'days' | 'weeks-months' | 'over-a-year' | 'not-sure'

export type YesNoUnsure = 'yes' | 'no' | 'not-sure'

export type PermissionKey =
  | 'bookings'
  | 'observations'
  | 'care-plan'
  | 'selected-reports'

export type AssessmentStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'interrupted'

export type VisitMode = 'in-clinic' | 'video'

export interface PersonName {
  firstName: string
  lastName: string
}

export interface PatientProfile extends PersonName {
  age: number
  ageApproximate: boolean
  sex?: 'female' | 'male' | 'intersex' | 'prefer-not'
  language: string
}

export interface HelperProfile extends PersonName {
  relationship: string
}

export interface CheckInState {
  status: 'not-started' | 'in-progress' | 'saved'
  careContext?: CareContext
  concerns: ConcernKey[]
  onset?: OnsetKey
  dailyTasks?: YesNoUnsure
  suddenChange?: YesNoUnsure
  ownWords?: string
  hearingVisionSupport: string[]
  savedAt?: string
}

export interface ObservationsState {
  status: 'not-started' | 'saved'
  items: string[]
  onset?: string
  notes?: string
  savedAt?: string
}

export interface AssessmentState {
  status: AssessmentStatus
  /** 1-based section index inside the preview shell. */
  section: number
  education?: string
  readingComfort?: 'yes' | 'no' | 'spoken'
  supportNeeds: string[]
  completedAt?: string
}

export interface UploadedFile {
  id: string
  name: string
  sizeLabel: string
  kind: 'pdf' | 'image'
  status: 'ready' | 'unreadable'
  addedAt: string
  /** Demo files are fixtures; real picks stay in this browser tab only. */
  demo?: boolean
}

export interface BookingState {
  clinicianId?: string
  slotId?: string
  mode?: VisitMode
  /** Follow-up visit requested from the care plan (same clinician and episode). */
  followUp?: { slotId: string; mode: VisitMode; status: 'requested' }
  /** Reply to a clinician's information request (info-requested stage). */
  infoReply?: string
  share: {
    checkIn: boolean
    observations: boolean
    assessment: boolean
    uploads: boolean
  }
}

export interface LabBookingState {
  providerId?: string
  slotId?: string
  collection?: 'home' | 'visit'
}

export interface DemoState {
  version: 1
  stage: EpisodeStage
  persona: Persona
  careFor: 'myself' | 'family'
  patient: PatientProfile
  helper: HelperProfile
  permissions: PermissionKey[]
  contactMethod: string
  checkIn: CheckInState
  observations: ObservationsState
  assessment: AssessmentState
  uploads: UploadedFile[]
  questions: string[]
  booking: BookingState
  labBooking: LabBookingState
  /** True once the "Who is the care for?" setup has been completed. */
  onboarded: boolean
  /** Clinician workspace: draft summary accepted, impression text (demo only). */
  clinician: { summaryAccepted?: string; impression?: string; explanation?: string }
  /** Lab workspace: demo-only operational progress for the B12 order. */
  lab: { b12?: 'received' | 'collected' | 'specimen-received' | 'processing'; correctedVersion?: boolean }
}

/* ---------- Fixture shapes ---------- */

export interface Slot {
  id: string
  date: string // "06 Oct 2026"
  time: string // "4:30 PM IST"
  mode: VisitMode
}

export interface Clinician {
  id: string
  name: string
  /** Honest label shown next to the name. */
  label: string
  initials: string
  specialty: string
  services: string[]
  clinic: string
  area: string
  distance: string
  languages: string[]
  modes: VisitMode[]
  fee: string
  feeNote: string
  cancellation: string
  accessibility: string
  credentials: string
  acceptsPacket: boolean
  confirmation: 'manual' | 'instant'
  slots: Slot[]
  mapPosition: { x: number; y: number }
}

export interface LabTestOffer {
  orderId: string
  available: boolean
  note?: string
}

export interface LabProvider {
  id: string
  name: string
  label: string
  area: string
  distance: string
  collectionOptions: Array<'home' | 'visit'>
  processingLab?: string
  offers: LabTestOffer[]
  fee: string
  feeNote: string
  turnaround: string
  accessibility: string
  accreditation: string
  slots: Array<{ id: string; date: string; time: string; collection: 'home' | 'visit' }>
  mapPosition: { x: number; y: number }
}

export interface InvestigationOrder {
  id: string
  name: string
  shortName: string
  kind: 'lab' | 'imaging'
  specimen: string
  orderedBy: string
  orderedOn: string
  orderRef: string
  explanation: string
  explanationSource: string
  preparation: string
  homeCollection: boolean
  limitations?: string
}

export interface ReportVersion {
  version: number
  issuedOn: string
  note: string
}

export interface Report {
  id: string
  orderId?: string
  title: string
  issuer: string
  issuerLabel: string
  specimen: string
  assay: string
  collectedOn: string
  releasedOn: string
  resultNote: string
  labInterpretation: string
  qualityFlags: string
  versions: ReportVersion[]
}

export type TimelineType = 'visit' | 'assessment' | 'test' | 'care' | 'note'

export interface TimelineEvent {
  id: string
  date: string
  time?: string
  type: TimelineType
  title: string
  detail: string
  source: SourceKind
  sourceName: string
  /** Stage from which this event exists in the fictional episode. */
  from: EpisodeStage
  /** Review state text, shown as a badge. */
  review?: string
  reviewTone?: Tone
  href?: string
}

export interface CarePlanItem {
  id: string
  category:
    | 'next-visit'
    | 'investigations'
    | 'medicines'
    | 'daily-care'
    | 'care-support'
    | 'questions'
  title: string
  detail: string
  owner: string
  due?: string
  status: string
  href?: string
}

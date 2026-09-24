/**
 * Synthetic fixtures for the fictional care episode described in
 * docs/design/PATIENT.md › "A single fictional episode for connected later screens".
 *
 * Rules (DESIGN.md + PATIENT.md):
 * - Every person, clinic and lab is fictional and labelled "illustrative".
 * - No real hospital or lab brands, no registration or accreditation claims.
 * - No numeric results, cognitive scores, diagnoses, doses or disease stages.
 * - Fees are prototype placeholders, never quoted prices.
 */
import type {
  CarePlanItem,
  Clinician,
  InvestigationOrder,
  LabProvider,
  Report,
  TimelineEvent,
} from './types'

export const DEMO_AREA = 'Noida - sample search area'

export const ORG = {
  clinic: 'Example Neuro Clinic - illustrative',
  lab: 'Example Diagnostics - illustrative provider',
  referenceLab: 'Example Reference Laboratory - illustrative',
  support: 'NeuroVX support (demo)',
} as const

/** Key dates for the fictional episode. Today in the demo is 24 Sep 2026. */
export const EPISODE_DATES = {
  today: '24 Sep 2026',
  checkIn: '25 Sep 2026',
  assessment: '26 Sep 2026',
  bookingRequested: '27 Sep 2026',
  bookingConfirmed: '28 Sep 2026',
  visit: '06 Oct 2026',
  visitTime: '4:30 PM IST',
  testsRequested: '06 Oct 2026',
  collection: '08 Oct 2026',
  collectionTime: '9:00 AM IST',
  released: '09 Oct 2026',
  reviewed: '10 Oct 2026',
  followUp: '12 Oct 2026',
} as const

export const CLINICIANS: Clinician[] = [
  {
    id: 'kavya-rao',
    name: 'Dr. Kavya Rao',
    label: 'Illustrative clinician',
    initials: 'KR',
    specialty: 'Neurology - memory and cognitive care',
    services: ['Memory and thinking concerns', 'Follow-up care', 'Clinician-requested tests'],
    clinic: ORG.clinic,
    area: 'Sector 18, ' + DEMO_AREA,
    distance: '3.2 km from the sample search area',
    languages: ['English', 'Hindi', 'Kannada'],
    modes: ['in-clinic', 'video'],
    fee: '₹1,200',
    feeNote: 'Prototype placeholder fee, not a quoted price',
    cancellation: 'Placeholder terms: free cancellation up to 24 hours before the visit.',
    accessibility: 'Step-free entrance and seating in the waiting area (sample details)',
    credentials: 'Registration details are not verified in this prototype',
    acceptsPacket: true,
    confirmation: 'manual',
    slots: [
      { id: 'kr-1', date: '06 Oct 2026', time: '4:30 PM IST', mode: 'in-clinic' },
      { id: 'kr-2', date: '06 Oct 2026', time: '5:15 PM IST', mode: 'video' },
      { id: 'kr-3', date: '07 Oct 2026', time: '11:00 AM IST', mode: 'in-clinic' },
      { id: 'kr-4', date: '09 Oct 2026', time: '3:00 PM IST', mode: 'video' },
    ],
    mapPosition: { x: 38, y: 42 },
  },
  {
    id: 'farhan-siddiqui',
    name: 'Dr. Farhan Siddiqui',
    label: 'Illustrative clinician',
    initials: 'FS',
    specialty: 'Geriatric medicine',
    services: ['Memory concerns in older adults', 'Medicine reviews', 'Care-partner guidance'],
    clinic: 'Example Elder Care Clinic - illustrative',
    area: 'Sector 50, ' + DEMO_AREA,
    distance: '5.8 km from the sample search area',
    languages: ['English', 'Hindi', 'Urdu'],
    modes: ['in-clinic'],
    fee: '₹900',
    feeNote: 'Prototype placeholder fee, not a quoted price',
    cancellation: 'Placeholder terms: free cancellation up to 12 hours before the visit.',
    accessibility: 'Ground-floor clinic (sample details)',
    credentials: 'Registration details are not verified in this prototype',
    acceptsPacket: true,
    confirmation: 'manual',
    slots: [
      { id: 'fs-1', date: '08 Oct 2026', time: '10:30 AM IST', mode: 'in-clinic' },
      { id: 'fs-2', date: '10 Oct 2026', time: '12:00 PM IST', mode: 'in-clinic' },
    ],
    mapPosition: { x: 66, y: 64 },
  },
  {
    id: 'primary-care-62',
    name: 'Example Primary Care Centre',
    label: 'Illustrative provider',
    initials: 'PC',
    specialty: 'Primary care (general practice)',
    services: ['First conversation about memory concerns', 'Referral to a specialist when needed'],
    clinic: 'Example Primary Care Centre - illustrative',
    area: 'Sector 62, ' + DEMO_AREA,
    distance: '7.1 km from the sample search area',
    languages: ['English', 'Hindi'],
    modes: ['in-clinic', 'video'],
    fee: '₹500',
    feeNote: 'Prototype placeholder fee, not a quoted price',
    cancellation: 'Placeholder terms: free cancellation up to 2 hours before the visit.',
    accessibility: 'Lift access (sample details)',
    credentials: 'Registration details are not verified in this prototype',
    acceptsPacket: false,
    confirmation: 'manual',
    slots: [
      { id: 'pc-1', date: '07 Oct 2026', time: '9:00 AM IST', mode: 'in-clinic' },
      { id: 'pc-2', date: '07 Oct 2026', time: '6:00 PM IST', mode: 'video' },
    ],
    mapPosition: { x: 78, y: 26 },
  },
]

export const ORDERS: InvestigationOrder[] = [
  {
    id: 'b12',
    name: 'Vitamin B12 - example clinician order',
    shortName: 'Vitamin B12',
    kind: 'lab',
    specimen: 'Blood sample',
    orderedBy: 'Dr. Kavya Rao',
    orderedOn: '06 Oct 2026',
    orderRef: 'ORD-DEMO-0142',
    explanation:
      'A routine blood test your clinician asked for. It is one of several checks that can help explain changes in memory and thinking.',
    explanationSource: 'Explanation approved by Dr. Kavya Rao (illustrative)',
    preparation: 'The provider confirms any preparation when you book. NeuroVX does not add its own instructions.',
    homeCollection: true,
  },
  {
    id: 'plasma',
    name: 'Plasma biomarker assay - illustrative clinician-requested order',
    shortName: 'Plasma biomarker assay',
    kind: 'lab',
    specimen: 'Blood sample',
    orderedBy: 'Dr. Kavya Rao',
    orderedOn: '06 Oct 2026',
    orderRef: 'ORD-DEMO-0143',
    explanation:
      'A specific blood test your clinician requested to support their assessment. The exact assay is named on the original order.',
    explanationSource: 'Explanation approved by Dr. Kavya Rao (illustrative)',
    preparation: 'The provider confirms any preparation when you book. NeuroVX does not add its own instructions.',
    homeCollection: true,
    limitations:
      'This test does not diagnose a condition on its own. Your clinician reads it together with your history and other findings. It is not a screening test for people without symptoms.',
  },
]

export const LAB_PROVIDERS: LabProvider[] = [
  {
    id: 'example-diagnostics',
    name: 'Example Diagnostics',
    label: 'Illustrative provider',
    area: 'Sector 18, ' + DEMO_AREA,
    distance: '2.9 km from the sample search area',
    collectionOptions: ['home', 'visit'],
    processingLab: ORG.referenceLab + ' processes the plasma biomarker assay',
    offers: [
      { orderId: 'b12', available: true },
      { orderId: 'plasma', available: true, note: 'Sample sent to a partner laboratory for processing' },
    ],
    fee: '₹2,400',
    feeNote: 'Prototype placeholder total for both tests, not a quoted price',
    turnaround: 'Provider estimate: 1 to 3 days (illustrative)',
    accessibility: 'Home collection available; ground-floor centre (sample details)',
    accreditation: 'Accreditation is not verified in this prototype',
    slots: [
      { id: 'ed-1', date: '08 Oct 2026', time: '9:00 AM IST', collection: 'home' },
      { id: 'ed-2', date: '08 Oct 2026', time: '11:30 AM IST', collection: 'visit' },
      { id: 'ed-3', date: '09 Oct 2026', time: '8:30 AM IST', collection: 'home' },
    ],
    mapPosition: { x: 44, y: 38 },
  },
  {
    id: 'example-city-lab',
    name: 'Example City Lab',
    label: 'Illustrative provider',
    area: 'Sector 27, ' + DEMO_AREA,
    distance: '1.6 km from the sample search area',
    collectionOptions: ['visit'],
    offers: [
      { orderId: 'b12', available: true },
      { orderId: 'plasma', available: false, note: 'This provider does not offer the requested assay' },
    ],
    fee: '₹450',
    feeNote: 'Prototype placeholder for the one available test, not a quoted price',
    turnaround: 'Provider estimate: same day (illustrative)',
    accessibility: 'First floor, lift available (sample details)',
    accreditation: 'Accreditation is not verified in this prototype',
    slots: [{ id: 'cl-1', date: '08 Oct 2026', time: '10:00 AM IST', collection: 'visit' }],
    mapPosition: { x: 24, y: 58 },
  },
]

export const REPORTS: Report[] = [
  {
    id: 'b12',
    orderId: 'b12',
    title: 'Vitamin B12 report',
    issuer: 'Example Diagnostics',
    issuerLabel: ORG.lab,
    specimen: 'Blood (serum)',
    assay: 'Named on the original report',
    collectedOn: '08 Oct 2026, 9:10 AM IST',
    releasedOn: '09 Oct 2026, 2:40 PM IST',
    resultNote:
      'The result, units and reference range appear in the original report. This prototype does not reproduce values.',
    labInterpretation: 'Shown in the original report exactly as the laboratory wrote it.',
    qualityFlags: 'None recorded by the laboratory (demo)',
    versions: [{ version: 1, issuedOn: '09 Oct 2026, 2:40 PM IST', note: 'Original release' }],
  },
]

/** The plasma assay is still processing at every stage of this demo. */
export const PENDING_REPORT = {
  orderId: 'plasma',
  title: 'Plasma biomarker assay',
  status: 'Processing at ' + ORG.referenceLab,
  note: 'The provider has not released this report yet. No estimate is shown because the provider has not supplied one.',
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'ev-checkin',
    date: EPISODE_DATES.checkIn,
    type: 'note',
    title: 'Care check-in completed',
    detail: 'Concerns, timing and everyday changes, in the patient’s own words.',
    source: 'patient',
    sourceName: 'Shared with help from the care partner',
    from: 'assessment-ready',
    review: 'Not yet reviewed',
    reviewTone: 'neutral',
  },
  {
    id: 'ev-observations',
    date: EPISODE_DATES.checkIn,
    type: 'note',
    title: 'Family observations',
    detail: 'Day-to-day changes noticed at home, kept separate from the patient’s answers.',
    source: 'care-partner',
    sourceName: 'Meera Rao',
    from: 'assessment-ready',
    review: 'Not yet reviewed',
    reviewTone: 'neutral',
  },
  {
    id: 'ev-assessment',
    date: EPISODE_DATES.assessment,
    type: 'assessment',
    title: 'Memory and thinking assessment - preview',
    detail: 'Demo completion. No score is produced in this prototype.',
    source: 'system',
    sourceName: 'Assessment preview',
    from: 'assessment-completed',
    review: 'Not yet reviewed',
    reviewTone: 'neutral',
    href: '/app/care/assessment/summary',
  },
  {
    id: 'ev-booking',
    date: EPISODE_DATES.bookingRequested,
    type: 'visit',
    title: 'Appointment requested',
    detail: 'Dr. Kavya Rao, 06 Oct 2026, 4:30 PM IST, in clinic.',
    source: 'system',
    sourceName: 'NeuroVX booking request',
    from: 'booking-requested',
    href: '/app/care/visit',
  },
  {
    id: 'ev-confirmed',
    date: EPISODE_DATES.bookingConfirmed,
    type: 'visit',
    title: 'Appointment confirmed by the clinic',
    detail: 'Visit packet delivered to ' + ORG.clinic + '.',
    source: 'clinician',
    sourceName: ORG.clinic,
    from: 'booking-confirmed',
    href: '/app/care/visit',
  },
  {
    id: 'ev-visit',
    date: EPISODE_DATES.visit,
    time: '4:30 PM IST',
    type: 'visit',
    title: 'Clinician visit',
    detail: 'Consultation with Dr. Kavya Rao. Visit notes stay with the clinic.',
    source: 'clinician',
    sourceName: 'Dr. Kavya Rao',
    from: 'tests-requested',
  },
  {
    id: 'ev-orders',
    date: EPISODE_DATES.testsRequested,
    time: '6:10 PM IST',
    type: 'test',
    title: 'Tests requested by your clinician',
    detail: 'Vitamin B12 and a plasma biomarker assay.',
    source: 'clinician',
    sourceName: 'Dr. Kavya Rao',
    from: 'tests-requested',
    href: '/app/care/tests',
  },
  {
    id: 'ev-collected',
    date: EPISODE_DATES.collection,
    time: '9:10 AM IST',
    type: 'test',
    title: 'Sample collected',
    detail: 'Home collection by ' + ORG.lab + '.',
    source: 'lab',
    sourceName: 'Example Diagnostics',
    from: 'report-released',
    href: '/app/care/tests/progress',
  },
  {
    id: 'ev-released',
    date: EPISODE_DATES.released,
    time: '2:40 PM IST',
    type: 'test',
    title: 'Vitamin B12 report released',
    detail: 'Available to you and delivered to your care team.',
    source: 'lab',
    sourceName: 'Example Diagnostics',
    from: 'report-released',
    review: 'Not yet reviewed',
    reviewTone: 'neutral',
    href: '/app/records/reports/b12',
  },
  {
    id: 'ev-reviewed',
    date: EPISODE_DATES.reviewed,
    type: 'care',
    title: 'Care plan updated',
    detail: 'Dr. Kavya Rao reviewed the Vitamin B12 report and added next steps.',
    source: 'clinician',
    sourceName: 'Dr. Kavya Rao',
    from: 'reviewed',
    review: 'Clinician reviewed',
    reviewTone: 'info',
    href: '/app/care/plan',
  },
]

export const CARE_PLAN: CarePlanItem[] = [
  {
    id: 'cp-follow-up',
    category: 'next-visit',
    title: 'Follow-up visit to discuss results',
    detail: 'Same clinician and care episode. Your shared information stays with this visit.',
    owner: 'You or your care partner books it',
    due: 'Suggested by 12 Oct 2026',
    status: 'To book',
    href: '/app/care/clinicians/kavya-rao?visit=follow-up',
  },
  {
    id: 'cp-plasma',
    category: 'investigations',
    title: 'Plasma biomarker assay',
    detail: 'Still processing at the laboratory. Dr. Kavya Rao will review it when it is released.',
    owner: 'Example Diagnostics, then Dr. Kavya Rao',
    status: 'Processing',
    href: '/app/care/tests/progress',
  },
  {
    id: 'cp-daily',
    category: 'daily-care',
    title: 'Keep a short note of everyday changes',
    detail: 'Write down anything new before the follow-up visit. There is no daily task or streak.',
    owner: 'Patient and care partner, when useful',
    status: 'Optional',
  },
  {
    id: 'cp-support',
    category: 'care-support',
    title: 'Caregiver education session',
    detail: 'A general session for families. Optional and unrelated to any result.',
    owner: 'Care-support services (concept)',
    status: 'Optional',
    href: '/app/support',
  },
  {
    id: 'cp-questions',
    category: 'questions',
    title: 'Questions to discuss',
    detail: 'Questions you saved from NeuroLearn or your visit preparation.',
    owner: 'You',
    status: 'Add any time',
    href: '/app/care/visit#questions',
  },
]

export const CARE_PLAN_SUMMARY = {
  author: 'Dr. Kavya Rao',
  authorLabel: 'Illustrative clinician',
  updated: EPISODE_DATES.reviewed,
  explanation:
    'Dr. Kavya Rao reviewed your Vitamin B12 report and noted it in your record. The plasma biomarker assay is still processing. The plan is to meet again once both results are available.',
  medicinesNote: 'No prescription has been added to this plan. Prescriptions appear here only as your clinician wrote them.',
}

export const DEMO_UPLOADS = [
  {
    id: 'up-demo-1',
    name: 'Previous-blood-test-2025.pdf',
    sizeLabel: '480 KB',
    kind: 'pdf' as const,
    status: 'ready' as const,
    addedAt: '26 Sep 2026',
    demo: true,
  },
  {
    id: 'up-demo-2',
    name: 'Clinic-letter-photo.jpg',
    sizeLabel: '1.2 MB',
    kind: 'image' as const,
    status: 'ready' as const,
    addedAt: '26 Sep 2026',
    demo: true,
  },
]

export const CONCERN_LABELS: Record<string, string> = {
  memory: 'Memory',
  attention: 'Attention',
  'finding-words': 'Finding words',
  'everyday-tasks': 'Everyday tasks',
  behaviour: 'Behaviour or mood',
  other: 'Something else',
  none: 'No particular concern',
}

export const ONSET_LABELS: Record<string, string> = {
  days: 'Recently, within days',
  'weeks-months': 'Over weeks or months',
  'over-a-year': 'More than a year ago',
  'not-sure': 'Not sure',
}

export const PERMISSION_LABELS: Record<string, { label: string; detail: string }> = {
  bookings: { label: 'Help with bookings', detail: 'Find clinicians and request appointments.' },
  observations: {
    label: 'Contribute observations',
    detail: 'Add your own notes. They stay labelled as yours.',
  },
  'care-plan': { label: 'View care plan', detail: 'See next steps from the clinician.' },
  'selected-reports': {
    label: 'View selected reports',
    detail: 'Only reports the patient chooses to share.',
  },
}

export function clinicianById(id?: string) {
  return CLINICIANS.find((c) => c.id === id)
}
export function orderById(id?: string) {
  return ORDERS.find((o) => o.id === id)
}
export function labById(id?: string) {
  return LAB_PROVIDERS.find((l) => l.id === id)
}
export function reportById(id?: string) {
  return REPORTS.find((r) => r.id === id)
}

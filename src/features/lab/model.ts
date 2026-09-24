/**
 * Laboratory workspace view-model (DESIGN.md › Orders, laboratory reports and
 * critical results). Derives every order in Example Diagnostics' queue from
 * the shared demo store, plus a few clearly labelled background orders.
 *
 * Operational states stay distinct. Laboratory validation (release) and
 * clinician review are separate; clinician review is the clinic's state.
 */
import { CLINICIANS, EPISODE_DATES, ORDERS, ORG, REPORTS } from '@/demo/fixtures'
import { STAGE_META, hasReached, labCollectionFor } from '@/demo/episode'
import type { DemoState } from '@/demo/types'
import type { Tone } from '@/demo/types'

/* ------------------------------------------------------------------ */
/* Demo dates ("06 Oct 2026")                                          */
/* ------------------------------------------------------------------ */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDemoDate(s: string) {
  const [d, m, y] = s.split(' ')
  return new Date(Date.UTC(Number(y), MONTHS.indexOf(m), Number(d)))
}

/** Adds whole days to a demo date string and returns the same format. */
export function shiftDate(s: string, days: number) {
  const d = parseDemoDate(s)
  d.setUTCDate(d.getUTCDate() + days)
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/**
 * The lab workspace's "today". Follows STAGE_META, except that once the lab
 * records the booked collection the day moves to the collection date, so the
 * queue never shows a sample collected "tomorrow".
 */
export function labToday(state: DemoState) {
  const p = state.lab.b12
  if (state.stage === 'collection-arranged' && p && p !== 'received') return collectionFor(state).date
  return STAGE_META[state.stage].when
}

/* ------------------------------------------------------------------ */
/* Operational states                                                  */
/* ------------------------------------------------------------------ */

export type LabState =
  | 'order-received'
  | 'needs-clarification'
  | 'collection-arranged'
  | 'collected'
  | 'specimen-received'
  | 'processing'
  | 'released'

export const STATE_LABEL: Record<LabState, string> = {
  'order-received': 'Order received',
  'needs-clarification': 'Needs clarification',
  'collection-arranged': 'Collection arranged',
  collected: 'Collected',
  'specimen-received': 'Specimen received',
  processing: 'Processing',
  released: 'Lab report released',
}

/**
 * Same tone rule as the clinician workspace, so one state looks the same in
 * both: in progress = neutral, released = info, needs attention = warning.
 */
export const STATE_TONE: Record<LabState, Tone> = {
  'order-received': 'neutral',
  'needs-clarification': 'warning',
  'collection-arranged': 'neutral',
  collected: 'neutral',
  'specimen-received': 'neutral',
  processing: 'neutral',
  released: 'info',
}

export interface Collection {
  type: 'home' | 'visit'
  date: string
  time: string
  provider: string
  /** Recorded collection time, once the lab marks it collected. */
  collectedOn?: string
}

export interface LabOrder {
  ref: string
  /** 'b12' | 'plasma' for the demo patient's orders; 'background' for synthetic queue rows. */
  kind: 'b12' | 'plasma' | 'background'
  patientName: string
  patientAge: string
  /** Short name for tables. */
  test: string
  /** The requested test exactly as written on the order. */
  testExact: string
  orderingClinician: string
  clinic: string
  orderedOn: string
  specimen: string
  state: LabState
  delivery?: { status: 'confirmed' | 'failed'; on: string }
  releasedOn?: string
  /** Clinic's state, not the lab's. */
  clinicianReviewedOn?: string
  owner: string
  due: string
  processingLab: string
  collection?: Collection
  correctedVersion?: boolean
}

/* ------------------------------------------------------------------ */
/* Background queue (synthetic, clearly labelled)                      */
/* ------------------------------------------------------------------ */

const farhan = CLINICIANS[1]
const primaryCare = CLINICIANS[2]
const kavya = CLINICIANS[0]

function backgroundOrders(today: string): LabOrder[] {
  return [
    {
      ref: 'ORD-DEMO-0138',
      kind: 'background',
      patientName: 'A. Verma (demo)',
      patientAge: '54',
      test: 'HbA1c - example',
      testExact: 'HbA1c - example order',
      orderingClinician: farhan.name,
      clinic: farhan.clinic,
      orderedOn: shiftDate(today, -1),
      specimen: 'Blood sample',
      state: 'specimen-received',
      owner: 'Lab bench (demo)',
      due: today,
      processingLab: ORG.lab,
      collection: { type: 'visit', date: today, time: '8:30 AM IST', provider: ORG.lab, collectedOn: `${today}, 8:40 AM IST` },
    },
    {
      ref: 'ORD-DEMO-0139',
      kind: 'background',
      patientName: 'K. Nair (demo)',
      patientAge: '71',
      test: 'Lipid profile - example',
      testExact: 'Lipid profile - example order',
      orderingClinician: primaryCare.name,
      clinic: primaryCare.clinic,
      orderedOn: shiftDate(today, -1),
      specimen: 'Blood sample',
      state: 'collection-arranged',
      owner: 'Home collection team (demo)',
      due: `${today}, 11:30 AM IST`,
      processingLab: ORG.lab,
      collection: { type: 'home', date: today, time: '11:30 AM IST', provider: ORG.lab },
    },
    {
      ref: 'ORD-DEMO-0140',
      kind: 'background',
      patientName: 'F. Qureshi (demo)',
      patientAge: '59',
      test: '“Thyroid panel?” - ambiguous request',
      testExact: 'Thyroid panel?',
      orderingClinician: primaryCare.name,
      clinic: primaryCare.clinic,
      orderedOn: today,
      specimen: 'Not stated on the order',
      state: 'needs-clarification',
      owner: 'Lab coordinator (demo)',
      due: today,
      processingLab: ORG.lab,
    },
    {
      ref: 'ORD-DEMO-0141',
      kind: 'background',
      patientName: 'M. Joshi (demo)',
      patientAge: '62',
      test: 'Complete blood count - example',
      testExact: 'Complete blood count - example order',
      orderingClinician: farhan.name,
      clinic: farhan.clinic,
      orderedOn: shiftDate(today, -2),
      specimen: 'Blood sample',
      state: 'released',
      releasedOn: shiftDate(today, -1),
      delivery: { status: 'confirmed', on: shiftDate(today, -1) },
      owner: 'Ordering clinic - clinician review',
      due: 'No lab action due',
      processingLab: ORG.lab,
      collection: { type: 'home', date: shiftDate(today, -2), time: '8:00 AM IST', provider: ORG.lab },
    },
  ]
}

/* ------------------------------------------------------------------ */
/* The demo patient's two orders                                        */
/* ------------------------------------------------------------------ */

function collectionFor(state: DemoState): Collection {
  const c = labCollectionFor(state.labBooking)
  return {
    type: c.collection,
    date: c.date,
    time: c.time,
    provider: `${c.provider.name} - ${c.provider.label.toLowerCase()}`,
    collectedOn: c.collectedOn,
  }
}

type Progress = 'collection-arranged' | 'collected' | 'specimen-received' | 'processing'

function labProgress(state: DemoState): Progress {
  const p = state.lab.b12
  return p === 'collected' || p === 'specimen-received' || p === 'processing' ? p : 'collection-arranged'
}

export function demoPatientOrders(state: DemoState, patient: { fullName: string; age: string }): LabOrder[] {
  const stage = state.stage
  if (!hasReached(stage, 'tests-requested')) return []
  const [b12Fixture, plasmaFixture] = ORDERS
  const booked = hasReached(stage, 'collection-arranged')
  const released = hasReached(stage, 'report-released')
  const reviewed = hasReached(stage, 'reviewed')
  const progress = booked && !released ? labProgress(state) : undefined
  const collection = booked ? collectionFor(state) : undefined
  const today = labToday(state)
  const report = REPORTS[0]

  const base = {
    patientName: patient.fullName,
    patientAge: patient.age,
    orderingClinician: b12Fixture.orderedBy,
    clinic: kavya.clinic,
    orderedOn: b12Fixture.orderedOn,
    specimen: b12Fixture.specimen,
  }

  /* Vitamin B12: processed and released by this lab. */
  let b12: LabOrder
  if (released) {
    const failed = stage === 'delivery-problem'
    b12 = {
      ...base,
      ref: b12Fixture.orderRef,
      kind: 'b12',
      test: b12Fixture.shortName,
      testExact: b12Fixture.name,
      state: 'released',
      releasedOn: report.releasedOn,
      delivery: { status: failed ? 'failed' : 'confirmed', on: EPISODE_DATES.released },
      clinicianReviewedOn: reviewed ? EPISODE_DATES.reviewed : undefined,
      owner: failed ? ORG.support : reviewed ? 'No owner needed - complete' : 'Ordering clinic - clinician review',
      due: failed ? today : 'No lab action due',
      processingLab: ORG.lab,
      collection,
      correctedVersion: state.lab.correctedVersion,
    }
  } else if (progress) {
    const owner: Record<Progress, string> = {
      'collection-arranged': collection?.type === 'visit' ? 'Centre reception (demo)' : 'Home collection team (demo)',
      collected: 'Lab reception (demo)',
      'specimen-received': 'Lab bench (demo)',
      processing: 'Lab bench (demo)',
    }
    const due: Record<Progress, string> = {
      'collection-arranged': `${collection?.date}, ${collection?.time}`,
      collected: today,
      'specimen-received': today,
      processing: 'After laboratory validation - no date set',
    }
    b12 = {
      ...base,
      ref: b12Fixture.orderRef,
      kind: 'b12',
      test: b12Fixture.shortName,
      testExact: b12Fixture.name,
      state: progress,
      owner: owner[progress],
      due: due[progress],
      processingLab: ORG.lab,
      collection,
    }
  } else {
    b12 = {
      ...base,
      ref: b12Fixture.orderRef,
      kind: 'b12',
      test: b12Fixture.shortName,
      testExact: b12Fixture.name,
      state: 'order-received',
      owner: 'Patient or family (books collection)',
      due: 'When collection is booked',
      processingLab: ORG.lab,
    }
  }

  /*
   * Plasma biomarker assay: collected in the same visit, then sent to the
   * reference laboratory, where it stays processing for the whole demo.
   */
  const plasmaState: LabState = released ? 'processing' : (progress ?? 'order-received')
  const plasmaOwner: Record<LabState, string> = {
    'order-received': 'Patient or family (books collection)',
    'needs-clarification': 'Lab coordinator (demo)',
    'collection-arranged': b12.owner,
    collected: 'Lab reception (demo)',
    'specimen-received': 'Lab reception (demo) - send to reference laboratory',
    processing: ORG.referenceLab,
    released: ORG.referenceLab,
  }
  const plasma: LabOrder = {
    ...base,
    ref: plasmaFixture.orderRef,
    kind: 'plasma',
    test: plasmaFixture.shortName,
    testExact: plasmaFixture.name,
    specimen: plasmaFixture.specimen,
    state: plasmaState,
    owner: plasmaOwner[plasmaState],
    due:
      plasmaState === 'processing'
        ? 'No estimate supplied'
        : plasmaState === 'order-received'
          ? 'When collection is booked'
          : plasmaState === 'collection-arranged'
            ? b12.due
            : today,
    processingLab: ORG.referenceLab,
    collection,
  }
  return [b12, plasma]
}

/** Every order in this lab's queue, ordered by reference. */
export function labQueue(state: DemoState, patient: { fullName: string; age: string }) {
  const today = labToday(state)
  return [...backgroundOrders(today), ...demoPatientOrders(state, patient)].sort((a, b) => a.ref.localeCompare(b.ref))
}

/* ------------------------------------------------------------------ */
/* The state line (vertical Careline on the order page)                */
/* ------------------------------------------------------------------ */

export interface StateStep {
  id: string
  label: string
  sublabel?: string
  state: 'completed' | 'current' | 'upcoming' | 'not-needed'
}

export function orderStateSteps(o: LabOrder): StateStep[] {
  const clarifying = o.state === 'needs-clarification'
  const failed = o.delivery?.status === 'failed'
  // Position of the order on the operational state line.
  const position = (() => {
    switch (o.state) {
      case 'order-received':
        return 0
      case 'needs-clarification':
        return 1
      case 'collection-arranged':
        return 2
      case 'collected':
        return 3
      case 'specimen-received':
        return 4
      case 'processing':
        return 5
      case 'released':
        return o.clinicianReviewedOn ? 8 : o.delivery ? 7 : 6
    }
  })()
  const at = (i: number): StateStep['state'] => (i < position ? 'completed' : i === position ? 'current' : 'upcoming')
  const c = o.collection
  const referenceLab = o.kind === 'plasma'

  return [
    { id: 'received', label: 'Order received', sublabel: `${o.orderedOn} · from ${o.orderingClinician}`, state: at(0) },
    {
      id: 'clarification',
      label: 'Needs clarification',
      sublabel: clarifying ? 'Waiting for the ordering clinic. The lab does not guess.' : 'The order was complete and clear',
      state: clarifying ? 'current' : 'not-needed',
    },
    {
      id: 'arranged',
      label: 'Collection arranged',
      sublabel: c
        ? `${c.type === 'home' ? 'Home collection' : 'Centre visit'} · ${c.date}, ${c.time}`
        : clarifying
          ? 'On hold until the order is clear'
          : 'Booked by the patient or family',
      state: at(2),
    },
    {
      id: 'collected',
      label: 'Collected',
      sublabel: position >= 3 ? (c?.collectedOn ?? 'Recorded by the collector') : 'Two identifiers checked at collection',
      state: at(3),
    },
    {
      id: 'specimen',
      label: 'Specimen received',
      sublabel: referenceLab ? 'At this lab, then sent to the reference laboratory' : 'Label checked against the order at reception',
      state: at(4),
    },
    {
      id: 'processing',
      label: 'Processing',
      sublabel: referenceLab ? `At ${o.processingLab} · No estimate supplied` : 'At this lab',
      state: at(5),
    },
    {
      id: 'released',
      label: 'Lab report released',
      sublabel: o.releasedOn ? `${o.releasedOn} · after laboratory validation` : 'After laboratory validation. Not clinician review.',
      state: at(6),
    },
    {
      id: 'delivery',
      label: failed ? 'Delivery failed' : 'Delivery confirmed',
      sublabel: failed
        ? `Owner: ${ORG.support}. Retry once the route is fixed.`
        : o.delivery
          ? `${o.delivery.on} · to ${o.clinic} and the patient’s record`
          : 'To the ordering clinic and the patient’s record',
      state: at(7),
    },
    {
      id: 'reviewed',
      label: 'Clinician reviewed',
      sublabel: o.clinicianReviewedOn
        ? `${o.clinicianReviewedOn} · recorded by the clinic, not the lab`
        : 'Recorded by the clinic, not the lab',
      state: at(8),
    },
  ]
}

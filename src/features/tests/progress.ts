/**
 * Investigation status for the patient (PATIENT.md › Separate laboratory and
 * imaging progress). Lab release, delivery to the care team and clinician
 * review are three separate events and are always computed separately.
 *
 * Everything is derived from the demo stage plus the lab workspace's
 * demo-only progress, so the patient view matches the other workspaces.
 */
import type { CarelineStep } from '@/components/ui'
import { hasReached, labCollectionFor, STAGE_META } from '@/demo/episode'
import { EPISODE_DATES, ORG, PENDING_REPORT, REPORTS } from '@/demo/fixtures'
import type { DemoState, InvestigationOrder, LabProvider, Tone } from '@/demo/types'

export const LAB_STEPS = [
  'Order accepted',
  'Collection booked',
  'Collected',
  'Sample received',
  'Processing',
  'Report released',
] as const

const B12_REPORT = REPORTS.find((r) => r.id === 'b12')!

/** Collection type in plain words. */
export const COLLECTION_TEXT = { home: 'Home collection', visit: 'Visit the centre' } as const

export interface BookingSummary {
  provider: LabProvider
  collection: 'home' | 'visit'
  date: string
  time: string
  /** Recorded collection time, once the provider collects. */
  collectedOn: string
}

/** The booked collection, if one exists at this point in the episode. */
export function bookingFor(state: DemoState): BookingSummary | undefined {
  if (!hasReached(state.stage, 'collection-arranged')) return undefined
  const { provider, collection, date, time, collectedOn } = labCollectionFor(state.labBooking)
  return { provider, collection, date, time, collectedOn }
}

/** Index into LAB_STEPS for the shared blood collection, before any release. */
function collectionIndex(state: DemoState) {
  if (!hasReached(state.stage, 'collection-arranged')) return 0
  switch (state.lab.b12) {
    case 'collected':
      return 2
    case 'specimen-received':
      return 3
    case 'processing':
      return 4
    default:
      return 1
  }
}

export interface ReviewState {
  released: boolean
  delivered: boolean
  deliveryFailed: boolean
  reviewed: boolean
}

/** Release, delivery and review for an order's report. Never merged into one flag. */
export function reviewStateFor(orderId: string, state: DemoState): ReviewState {
  const released = orderId === 'b12' && hasReached(state.stage, 'report-released')
  const deliveryFailed = released && state.stage === 'delivery-problem'
  return {
    released,
    deliveryFailed,
    delivered: released && !deliveryFailed,
    reviewed: released && hasReached(state.stage, 'reviewed') && state.stage !== 'delivery-problem',
  }
}

/** Index into LAB_STEPS for one order. The plasma assay never passes Processing in this demo. */
export function labIndexFor(orderId: string, state: DemoState) {
  const { released } = reviewStateFor(orderId, state)
  if (released) return 5
  if (orderId !== 'b12' && hasReached(state.stage, 'report-released')) return 4
  return collectionIndex(state)
}

/** Short status for badges: Requested → Booked → Collected → Processing → Report released. */
export function orderStatus(orderId: string, state: DemoState): { label: string; tone: Tone } {
  const i = labIndexFor(orderId, state)
  if (i === 0) return { label: 'Requested', tone: 'info' }
  if (i === 1) return { label: 'Booked', tone: 'info' }
  if (i === 2 || i === 3) return { label: 'Collected', tone: 'info' }
  if (i === 4) return { label: 'Processing', tone: 'neutral' }
  return { label: 'Report released', tone: 'info' }
}

/** Review badge for a released report. */
export function reviewBadge(r: ReviewState): { label: string; tone: Tone } | undefined {
  if (!r.released) return undefined
  if (r.reviewed) return { label: 'Clinician reviewed', tone: 'info' }
  return { label: 'Available - not yet reviewed', tone: 'neutral' }
}

function states(labels: readonly string[], index: number, finished: boolean) {
  return labels.map((label, i) => ({
    label,
    state: (finished || i < index ? 'completed' : i === index ? 'current' : 'upcoming') as CarelineStep['state'],
  }))
}

export interface LastUpdate {
  when: string
  what: string
  who: string
}

export interface OrderProgress {
  lab: CarelineStep[]
  after: CarelineStep[]
  last: LastUpdate
  review: ReviewState
  /** Plain note shown under the lab line (pending report, estimate). */
  note?: string
}

/** Full progress view-model for one order. */
export function progressFor(order: InvestigationOrder, state: DemoState): OrderProgress {
  const booking = bookingFor(state)
  const providerName = booking?.provider.name ?? 'the provider you choose'
  const isB12 = order.id === 'b12'
  const review = reviewStateFor(order.id, state)
  const index = labIndexFor(order.id, state)
  const referenceLab = order.id === 'plasma' && booking?.provider.processingLab ? ORG.referenceLab : undefined
  const processor = referenceLab ?? providerName

  const sub: string[] = [
    booking
      ? `Accepted by ${providerName}`
      : `Sent by ${order.orderedBy} on ${order.orderedOn}. Choose a provider to book collection.`,
    booking ? `${COLLECTION_TEXT[booking.collection]}, ${booking.date}, ${booking.time}` : 'Not booked yet',
    index >= 2 && booking ? booking.collectedOn : `By ${providerName}`,
    referenceLab ? `Sent to ${referenceLab} for processing` : `At ${providerName}`,
    `At ${processor}`,
    isB12 && review.released ? B12_REPORT.releasedOn : 'By the laboratory',
  ]

  const lab: CarelineStep[] = states(LAB_STEPS, index, review.released).map((s, i) => ({
    ...s,
    id: `${order.id}-${i}`,
    sublabel: sub[i],
  }))

  let after: CarelineStep[]
  if (review.deliveryFailed) {
    after = [
      {
        id: `${order.id}-delivery`,
        label: 'Delivery to care team',
        state: 'current',
        sublabel: `Delivery failed - NeuroVX support is following up. Owner: ${ORG.support}`,
      },
      {
        id: `${order.id}-review`,
        label: 'Clinician reviewed',
        state: 'upcoming',
        sublabel: 'Waits until the report reaches the care team',
      },
    ]
  } else if (review.reviewed) {
    after = [
      {
        id: `${order.id}-delivery`,
        label: 'Delivered to care team',
        state: 'completed',
        sublabel: `${ORG.clinic} · ${EPISODE_DATES.released}`,
      },
      {
        id: `${order.id}-review`,
        label: 'Clinician reviewed',
        state: 'completed',
        sublabel: `Reviewed by ${order.orderedBy} on ${EPISODE_DATES.reviewed}`,
      },
    ]
  } else if (review.delivered) {
    after = [
      {
        id: `${order.id}-delivery`,
        label: 'Delivered to care team',
        state: 'current',
        sublabel: `Sent to ${ORG.clinic} on ${EPISODE_DATES.released}`,
      },
      {
        id: `${order.id}-review`,
        label: 'Clinician reviewed',
        state: 'upcoming',
        sublabel: `Not yet. ${order.orderedBy} will review it and explain what it means.`,
      },
    ]
  } else {
    after = [
      { id: `${order.id}-delivery`, label: 'Delivered to care team', state: 'upcoming', sublabel: 'After the report is released' },
      { id: `${order.id}-review`, label: 'Clinician reviewed', state: 'upcoming', sublabel: `${order.orderedBy} reviews the report` },
    ]
  }

  const collectedDay = booking?.date ?? EPISODE_DATES.collection
  let last: LastUpdate
  if (review.reviewed) {
    last = { when: EPISODE_DATES.reviewed, what: `Reviewed by ${order.orderedBy}`, who: order.orderedBy }
  } else if (review.deliveryFailed) {
    last = { when: B12_REPORT.releasedOn, what: 'Released, but delivery to the care team failed', who: ORG.support }
  } else if (review.released) {
    last = { when: B12_REPORT.releasedOn, what: 'Report released and delivered to the care team', who: providerName }
  } else if (index >= 2 && referenceLab) {
    last = { when: collectedDay, what: 'Sample sent for processing', who: referenceLab }
  } else if (index === 4) {
    last = { when: collectedDay, what: 'Processing', who: providerName }
  } else if (index === 3) {
    last = { when: collectedDay, what: 'Sample received', who: providerName }
  } else if (index === 2) {
    last = { when: booking?.collectedOn ?? EPISODE_DATES.collection, what: 'Sample collected', who: providerName }
  } else if (index === 1) {
    last = { when: STAGE_META['collection-arranged'].when, what: 'Collection booked', who: providerName }
  } else {
    last = { when: `${order.orderedOn}, 6:10 PM IST`, what: `Order sent by ${order.orderedBy}`, who: order.orderedBy }
  }

  let note: string | undefined
  if (order.id === 'plasma' && index >= 2) note = PENDING_REPORT.note
  else if (isB12 && booking && !review.released) note = `Turnaround: ${booking.provider.turnaround}. This is an estimate, not a promise.`

  return { lab, after, last, review, note }
}

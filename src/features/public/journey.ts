/**
 * The public "Example journey" view-model: the fixture timeline grouped by
 * Careline stage, with what each workspace sees at that point. Built from
 * `TIMELINE`, `EPISODE_DATES` and people from `usePeople()`; no new facts.
 */
import { CARELINE_STEPS, type CarelineStepId } from '@/demo/episode'
import { CLINICIANS, EPISODE_DATES, ORG, TIMELINE } from '@/demo/fixtures'
import type { SourceKind, TimelineEvent, Tone } from '@/demo/types'

export interface JourneyEvent {
  id: string
  date: string
  time?: string
  title: string
  detail: string
  source: SourceKind
  sourceName?: string
  review?: string
  reviewTone?: Tone
}

export interface JourneyGroup {
  id: CarelineStepId
  label: string
  sublabel: string
  events: JourneyEvent[]
  sees: { family: string; clinician: string; lab: string }
}

const GROUP_EVENTS: Record<CarelineStepId, string[]> = {
  prepare: ['ev-checkin', 'ev-observations', 'ev-assessment'],
  visit: ['ev-booking', 'ev-confirmed', 'ev-visit'],
  tests: ['ev-orders', 'ev-collected', 'ev-released'],
  review: ['ev-reviewed'],
  ongoing: [],
}

export function buildJourney(people: { name: string; helperName: string; helperFull: string }): JourneyGroup[] {
  const { name, helperName, helperFull } = people
  const clinician = CLINICIANS[0].name

  /* Public page speaks in the third person; fixture copy is written for the patient app. */
  const THIRD_PERSON: Record<string, Partial<JourneyEvent>> = {
    'ev-orders': { title: 'Tests requested by the clinician' },
    'ev-released': { detail: `Available to ${name} and delivered to the care team.` },
  }

  const toEvent = (e: TimelineEvent): JourneyEvent => ({
    id: e.id,
    date: e.date,
    time: e.time,
    title: e.title,
    detail: e.detail,
    source: e.source,
    sourceName: e.source === 'care-partner' ? helperFull : e.sourceName,
    review: e.review,
    reviewTone: e.reviewTone,
    ...THIRD_PERSON[e.id],
  })

  const byId = new Map(TIMELINE.map((e) => [e.id, e]))

  const sees: Record<CarelineStepId, JourneyGroup['sees']> = {
    prepare: {
      family: `${helperName} helps ${name} share what has changed. ${helperName}’s observations are kept separate from ${name}’s own answers.`,
      clinician: 'Nothing yet. Information reaches a clinic only when a visit is requested.',
      lab: 'Nothing. No tests have been requested.',
    },
    visit: {
      family: 'The request shows as “Appointment requested” until the clinic confirms it.',
      clinician: `${clinician} accepts the request and opens the visit packet, with the source of each item.`,
      lab: 'Nothing yet.',
    },
    tests: {
      family: `Sees the tests ${clinician} requested and books a home collection. The released report shows as “Report available - not yet reviewed”.`,
      clinician: 'Sends two clinician-directed orders.',
      lab: `${ORG.lab} receives the orders, collects the sample and releases the Vitamin B12 report. The plasma biomarker assay is still processing.`,
    },
    review: {
      family: 'Home shows “Your clinician added a care update”.',
      clinician: 'Reviews the report and updates the care plan.',
      lab: 'Sees that the report was delivered to the care team.',
    },
    ongoing: {
      family: 'A care plan with a suggested follow-up visit, with the same clinician and care episode.',
      clinician: 'The follow-up list shows who needs a next visit.',
      lab: 'The plasma biomarker assay report follows when it is released.',
    },
  }

  return CARELINE_STEPS.map((step) => {
    const events = GROUP_EVENTS[step.id].map((id) => byId.get(id)).filter((e): e is TimelineEvent => Boolean(e)).map(toEvent)
    if (step.id === 'ongoing') {
      events.push({
        id: 'ev-follow-up',
        date: EPISODE_DATES.followUp,
        title: 'Follow-up visit suggested',
        detail: `Suggested by ${EPISODE_DATES.followUp}, with the same clinician.`,
        source: 'clinician',
        sourceName: clinician,
      })
    }
    return { id: step.id, label: step.label, sublabel: step.sublabel, events, sees: sees[step.id] }
  })
}

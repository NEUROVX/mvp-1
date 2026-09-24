import type { ReactNode } from 'react'
import { ArrowLink, Button, Callout, DemoTag, PageHeader, StatusBadge } from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { CARE_PLAN_SUMMARY, clinicianById, CLINICIANS, EPISODE_DATES, findSlot, ORDERS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { DemoState, EpisodeStage, Tone } from '@/demo/types'
import { bookingFor, COLLECTION_TEXT, labIndexFor, orderStatus as labOrderStatus } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

/**
 * My care (PATIENT.md › Stable navigation: "What am I doing with my care team?").
 * Four sections separated by dividers, each with an honest status and one
 * fitting action. Everything is derived from the shared store and the stage.
 */
export default function MyCarePage() {
  usePageTitle('My care')
  const { hasRecordAccess } = usePeople()
  return (
    <div className="space-y-8">
      <PageHeader
        title="My care"
        lede="What you’re doing with your care team."
        actions={hasRecordAccess ? <DemoTag /> : undefined}
      />
      {hasRecordAccess ? <CareSections /> : <LimitedHelperCare />}
    </div>
  )
}

interface Item {
  key: string
  name: string
  status: { label: string; tone: Tone }
  detail?: string
  action?: { label: string; to: string }
}

function CareSections() {
  const { state } = useDemo()
  const people = usePeople()
  const stage = state.stage
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      <CareSection
        id="checkins"
        title="Check-ins and assessments"
        summary="What has been shared before a visit."
        items={checkInItems(state, people.persona === 'patient', people.helper.firstName, people.name)}
      />
      <CareSection id="appointments" title="Appointments" summary="Visits with your clinician." items={appointmentItems(state)} />
      <CareSection
        id="tests"
        title="Tests and scans"
        summary="Only what your clinician requests."
        items={testItems(state)}
        footer={
          hasReached(stage, 'collection-arranged') ? (
            <ArrowLink to="/app/care/tests/progress">View test progress</ArrowLink>
          ) : hasReached(stage, 'tests-requested') ? (
            <ArrowLink to="/app/care/tests">View requested tests</ArrowLink>
          ) : null
        }
      />
      <CareSection id="care-plan" title="Care plan" summary="Written by your clinician after review." items={carePlanItems(stage)} />
    </div>
  )
}

function CareSection({
  id,
  title,
  summary,
  items,
  footer,
}: {
  id: string
  title: string
  summary: string
  items: Item[]
  footer?: ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="grid gap-4 p-5 sm:p-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <div>
        <h2 id={`${id}-heading`} className="text-heading-sm text-ink">
          {title}
        </h2>
        <p className="mt-1 text-body-md text-muted">{summary}</p>
      </div>
      <div className="min-w-0">
        <ul className="divide-y divide-border">
          {items.map((it) => (
            <CareItem key={it.key} item={it} />
          ))}
        </ul>
        {footer ? <div className="mt-2 border-t border-border pt-2">{footer}</div> : null}
      </div>
    </section>
  )
}

function CareItem({ item }: { item: Item }) {
  return (
    <li className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-2">
        <p className="text-label text-ink">{item.name}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <StatusBadge tone={item.status.tone}>{item.status.label}</StatusBadge>
          {item.detail ? <span className="text-body-md text-muted tabular">{item.detail}</span> : null}
        </div>
      </div>
      {item.action ? (
        <ArrowLink to={item.action.to} className="shrink-0 whitespace-nowrap">
          {item.action.label}
        </ArrowLink>
      ) : null}
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Derivations                                                         */
/* ------------------------------------------------------------------ */

function checkInItems(state: DemoState, isPatient: boolean, helperName: string, name: string): Item[] {
  const items: Item[] = []
  const c = state.checkIn
  items.push({
    key: 'check-in',
    name: 'Care check-in',
    ...(c.status === 'saved'
      ? {
          status: { label: 'Saved', tone: 'info' as Tone },
          detail: c.savedAt,
          action: { label: 'Review check-in', to: '/app/care/check-in' },
        }
      : c.status === 'in-progress'
        ? {
            status: { label: 'In progress', tone: 'info' as Tone },
            detail: 'Saved part-way',
            action: { label: 'Continue check-in', to: '/app/care/check-in' },
          }
        : {
            status: { label: 'Not started', tone: 'neutral' as Tone },
            detail: 'Concerns, timing and everyday changes',
            action: { label: 'Start care check-in', to: '/app/care/check-in' },
          }),
  })

  const o = state.observations
  if (isPatient) {
    items.push({
      key: 'observations',
      name: 'Family observations',
      status: o.status === 'saved' ? { label: `Added by ${helperName}`, tone: 'info' } : { label: 'Not added', tone: 'neutral' },
      detail: o.status === 'saved' ? (o.savedAt ? `Saved on ${o.savedAt}` : undefined) : `${helperName} can add these from their own account`,
      action: o.status === 'saved' ? { label: 'View observations', to: '/app/care/observations' } : undefined,
    })
  } else {
    items.push({
      key: 'observations',
      name: 'Family observations',
      status: o.status === 'saved' ? { label: 'Saved', tone: 'info' } : { label: 'Not added', tone: 'neutral' },
      detail: o.status === 'saved' ? o.savedAt : 'Your own notes, kept separate',
      action:
        o.status === 'saved'
          ? { label: 'Review observations', to: '/app/care/observations' }
          : { label: 'Add observations', to: '/app/care/observations' },
    })
  }

  const a = state.assessment
  const assessmentName = 'Memory and thinking assessment'
  if (a.status === 'completed') {
    items.push({
      key: 'assessment',
      name: assessmentName,
      status: { label: 'Completed - not yet reviewed', tone: 'neutral' },
      detail: a.completedAt ? `Demo completion on ${a.completedAt}. No score.` : 'Demo completion. No score.',
      action: { label: 'View summary', to: '/app/care/assessment/summary' },
    })
  } else if (a.status === 'interrupted') {
    items.push({
      key: 'assessment',
      name: assessmentName,
      status: { label: 'Could not be completed', tone: 'neutral' },
      detail: 'Not a result. An assisted assessment is possible.',
      action: { label: 'What this means', to: '/app/care/assessment/summary' },
    })
  } else if (a.status === 'in-progress') {
    items.push({
      key: 'assessment',
      name: assessmentName,
      status: { label: 'In progress', tone: 'info' },
      action: { label: 'Continue assessment', to: '/app/care/assessment' },
    })
  } else {
    items.push({
      key: 'assessment',
      name: assessmentName,
      status: { label: 'Not started', tone: 'neutral' },
      detail: isPatient ? 'Optional. It never blocks booking.' : `Optional. ${name} answers it, not a helper.`,
      action: { label: 'Review instructions', to: '/app/care/assessment' },
    })
  }
  return items
}

function appointmentItems(state: DemoState): Item[] {
  const stage = state.stage
  const clin = clinicianById(state.booking.clinicianId) ?? CLINICIANS[0]
  const slot = findSlot(clin, state.booking.slotId) ?? clin.slots[0]
  const mode = (state.booking.mode ?? slot.mode) === 'video' ? 'Video visit' : 'In clinic'
  const when = `${slot.date}, ${slot.time} · ${mode}`

  if (stage === 'existing-care') {
    return [
      {
        key: 'continuing',
        name: `Visits with ${clin.name}`,
        status: { label: 'Continuing care', tone: 'info' },
        detail: 'No first-time screening needed',
        action: { label: 'Review next visit', to: '/app/care/visit' },
      },
    ]
  }
  if (!hasReached(stage, 'booking-requested')) {
    return [
      {
        key: 'none',
        name: 'Clinician visit',
        status: { label: 'No appointment yet', tone: 'neutral' },
        detail: 'You can book without an assessment',
        action: { label: 'Find a clinician', to: '/app/care/find-clinician' },
      },
    ]
  }
  if (stage === 'booking-requested') {
    return [
      {
        key: 'visit',
        name: `Visit with ${clin.name}`,
        status: { label: 'Request sent - confirmation pending', tone: 'warning' },
        detail: `Requested: ${when}`,
        action: { label: 'View request', to: '/app/care/visit' },
      },
    ]
  }
  if (stage === 'booking-confirmed' || stage === 'info-requested') {
    const items: Item[] = [
      {
        key: 'visit',
        name: `Visit with ${clin.name}`,
        status: { label: 'Confirmed', tone: 'info' },
        detail: when,
        action: { label: 'Review visit details', to: '/app/care/visit' },
      },
    ]
    if (stage === 'info-requested') {
      items.push({
        key: 'info',
        name: 'Information requested by your clinician',
        status: { label: 'Action needed', tone: 'warning' },
        detail: 'A list of current medicines',
        action: { label: 'View request', to: '/app/care/visit#requests' },
      })
    }
    return items
  }

  const items: Item[] = [
    {
      key: 'visit',
      name: `Visit with ${clin.name}`,
      status: { label: 'Completed', tone: 'neutral' },
      detail: when,
      action: { label: 'View visit details', to: '/app/care/visit' },
    },
  ]
  if (stage === 'follow-up-due') {
    items.push(
      state.booking.followUp
        ? {
            key: 'follow-up',
            name: 'Follow-up visit',
            status: { label: 'Request sent - confirmation pending', tone: 'warning' },
            detail: followUpLine(clin, state.booking.followUp.slotId, state.booking.followUp.mode),
            action: { label: 'View request', to: '/app/care/visit' },
          }
        : {
            key: 'follow-up',
            name: 'Follow-up visit',
            status: { label: 'To book', tone: 'info' },
            detail: `Suggested by ${EPISODE_DATES.followUp}`,
            action: { label: 'Book follow-up', to: '/app/care/clinicians/kavya-rao?visit=follow-up' },
          },
    )
  }
  return items
}

function followUpLine(clin: ReturnType<typeof clinicianById>, slotId: string, mode: 'in-clinic' | 'video') {
  const slot = findSlot(clin, slotId)
  if (!slot) return 'Same clinician and care episode'
  return `Requested: ${slot.date}, ${slot.time} · ${mode === 'video' ? 'Video visit' : 'In clinic'}`
}

function testItems(state: DemoState): Item[] {
  const stage = state.stage
  if (!hasReached(stage, 'tests-requested')) {
    return [
      {
        key: 'none',
        name: 'Clinician-requested tests',
        status: { label: 'None requested', tone: 'neutral' },
        detail: 'Your clinician requests tests only if needed',
      },
    ]
  }
  const reviewed = hasReached(stage, 'reviewed')
  return ORDERS.map((o) => {
    let status: Item['status']
    let detail: string | undefined
    let action: Item['action']
    if (stage === 'tests-requested') {
      status = { label: 'Requested by your clinician', tone: 'info' }
      detail = `Ordered by ${o.orderedBy} on ${o.orderedOn}`
    } else if (stage === 'collection-arranged') {
      // The booking the person actually made, and the lab's progress (same source as Tests and Test progress).
      const booking = bookingFor(state)
      const lab = labOrderStatus(o.id, state)
      const collected = labIndexFor(o.id, state) >= 2
      status = collected ? lab : { label: 'Collection booked', tone: 'info' }
      detail = !booking
        ? `${EPISODE_DATES.collection}, ${EPISODE_DATES.collectionTime}`
        : collected
          ? `Collected ${booking.collectedOn}`
          : `${COLLECTION_TEXT[booking.collection]}, ${booking.date}, ${booking.time}`
    } else if (o.id !== 'b12') {
      status = { label: 'Processing', tone: 'neutral' }
      detail = 'The provider has not released this report yet'
    } else if (reviewed) {
      status = { label: `Clinician reviewed ${EPISODE_DATES.reviewed}`, tone: 'info' }
      detail = `Released ${EPISODE_DATES.released}`
      action = { label: 'View report', to: '/app/records/reports/b12' }
    } else if (stage === 'delivery-problem') {
      status = { label: 'Available - not yet shared with care team', tone: 'warning' }
      detail = `Released ${EPISODE_DATES.released}`
      action = { label: 'View report', to: '/app/records/reports/b12' }
    } else {
      status = { label: 'Available - not yet reviewed', tone: 'neutral' }
      detail = `Released ${EPISODE_DATES.released}`
      action = { label: 'View report', to: '/app/records/reports/b12' }
    }
    return { key: o.id, name: o.shortName, status, detail, action }
  })
}

function carePlanItems(stage: EpisodeStage): Item[] {
  if (!hasReached(stage, 'reviewed')) {
    return [
      {
        key: 'plan',
        name: 'Your care plan',
        status: { label: 'None yet', tone: 'neutral' },
        detail: 'Your clinician writes it after reviewing your information',
      },
    ]
  }
  return [
    {
      key: 'plan',
      name: 'Your care plan',
      status: { label: `Updated ${CARE_PLAN_SUMMARY.updated}`, tone: 'info' },
      detail: `From ${CARE_PLAN_SUMMARY.author}`,
      action: { label: 'View care plan', to: '/app/care/plan' },
    },
  ]
}

/* ------------------------------------------------------------------ */
/* Limited helper                                                      */
/* ------------------------------------------------------------------ */

function LimitedHelperCare() {
  const { state } = useDemo()
  const { possessive } = usePeople()
  const o = state.observations
  return (
    <div className="space-y-8">
      <Callout
        tone="info"
        title={`We need to arrange permission to view ${possessive} record`}
        action={<Button to="/app/access">Help arrange access</Button>}
      >
        <p>Appointments, tests and the care plan appear here once access is arranged. This is about access, not about health.</p>
      </Callout>
      <div className="rounded-lg border border-border bg-surface">
        <CareSection
          id="own-observations"
          title="Your observations"
          summary="What you have noticed at home, saved as yours."
          items={[
            {
              key: 'observations',
              name: 'Family observations',
              status: o.status === 'saved' ? { label: 'Saved', tone: 'info' } : { label: 'Not added', tone: 'neutral' },
              detail: o.status === 'saved' ? o.savedAt : `Kept separate from ${possessive} own answers`,
              action: { label: o.status === 'saved' ? 'Review observations' : 'Add observations', to: '/app/care/observations' },
            },
          ]}
        />
      </div>
    </div>
  )
}

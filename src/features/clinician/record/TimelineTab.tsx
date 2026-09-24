import { useState } from 'react'
import { SelectField, Timeline, type TimelineEntry } from '@/components/ui'
import { hasReached, STAGE_META } from '@/demo/episode'
import { TIMELINE } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { TimelineType } from '@/demo/types'
import { CLINICIAN, clinicianOf } from '../data'

const TYPE_LABELS: Record<TimelineType, string> = {
  visit: 'Visit',
  assessment: 'Assessment',
  test: 'Test',
  care: 'Care',
  note: 'Note',
}

/** Record tab each event opens in this workspace (fixture links point to the patient app). */
const CLINICIAN_LINKS: Record<string, { href: string; label: string }> = {
  'ev-assessment': { href: '?tab=assessments', label: 'Open in Assessments' },
  'ev-orders': { href: '?tab=results', label: 'Open in Results' },
  'ev-released': { href: '?tab=results', label: 'Open in Results' },
  'ev-reviewed': { href: '?tab=care-plan', label: 'Open in Care plan' },
}

/** Clinic-side wording where the fixture speaks to the patient. */
const CLINICIAN_TITLES: Record<string, string> = {
  'ev-orders': 'Investigations ordered',
  'ev-reviewed': 'Report reviewed and care plan updated',
}

export function TimelineTab() {
  const { state } = useDemo()
  const { helper } = usePeople()
  const [filter, setFilter] = useState<'all' | TimelineType>('all')
  const accepted = Boolean(clinicianOf(state).summaryAccepted)
  const st = state.stage

  const entries: TimelineEntry[] = []
  for (const ev of TIMELINE) {
    if (!hasReached(st, ev.from)) continue
    let detail = ev.detail
    let review = ev.review
    let reviewTone = ev.reviewTone
    if ((ev.id === 'ev-checkin' || ev.id === 'ev-observations') && accepted) {
      review = 'Reviewed in summary'
      reviewTone = 'info'
    }
    if (ev.id === 'ev-released') {
      if (st === 'delivery-problem') {
        detail = 'Released by the laboratory. Delivery to this clinic failed.'
        review = 'Not received'
        reviewTone = 'warning'
      } else {
        detail = 'Delivered to this clinic.'
        if (hasReached(st, 'reviewed')) {
          review = `Reviewed by ${CLINICIAN.name}`
          reviewTone = 'info'
        }
      }
    }
    const link = CLINICIAN_LINKS[ev.id]
    entries.push({
      id: ev.id,
      date: ev.date,
      time: ev.time,
      typeLabel: TYPE_LABELS[ev.type],
      title: CLINICIAN_TITLES[ev.id] ?? ev.title,
      detail,
      source: ev.source,
      sourceName: ev.sourceName,
      review,
      reviewTone,
      href: link?.href,
      actionLabel: link?.label,
    })
    // The information request sits between confirmation and the visit.
    if (ev.id === 'ev-confirmed' && st === 'info-requested') {
      entries.push({
        id: 'ev-info',
        date: STAGE_META['info-requested'].when,
        typeLabel: 'Note',
        title: 'Information requested from the family',
        detail: state.booking.infoReply
          ? `A list of current medicines. ${helper.firstName} replied.`
          : 'A list of current medicines before the visit. No reply yet.',
        source: 'clinician',
        sourceName: CLINICIAN.name,
        review: state.booking.infoReply ? 'Reply received' : 'Waiting on the family',
        reviewTone: 'neutral',
      })
    }
  }

  const types = Array.from(new Set(entries.map((e) => e.typeLabel)))
  const shown = filter === 'all' ? entries : entries.filter((e) => e.typeLabel === TYPE_LABELS[filter])

  return (
    <section aria-labelledby="timeline-h" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 id="timeline-h" className="text-heading-sm text-ink">
            Timeline
          </h2>
          <p className="text-body-md text-muted">Every event in this care episode, oldest first, with its source.</p>
        </div>
        <SelectField
          label="Show"
          className="md:w-64"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | TimelineType)}
          options={[
            { value: 'all', label: 'All events' },
            ...(Object.keys(TYPE_LABELS) as TimelineType[])
              .filter((t) => types.includes(TYPE_LABELS[t]))
              .map((t) => ({ value: t, label: `${TYPE_LABELS[t]}s` })),
          ]}
        />
      </div>
      {shown.length ? (
        <Timeline entries={shown} label="Care episode timeline" />
      ) : (
        <p className="text-body-md text-muted">No events of this type yet.</p>
      )}
    </section>
  )
}

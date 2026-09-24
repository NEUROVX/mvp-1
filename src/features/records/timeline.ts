/**
 * Records timeline view-model (PATIENT.md › P18, DESIGN.md › Longitudinal
 * record). A chronological list, newest first. No charts: three dates are
 * not a trend.
 */
import type { TimelineEntry } from '@/components/ui'
import { collectedEventFor, hasReached } from '@/demo/episode'
import { clinicianById, findSlot, ORG, TIMELINE } from '@/demo/fixtures'
import type { DemoState, TimelineType } from '@/demo/types'

export type RecordFilter = 'all' | 'visits' | 'assessments' | 'tests' | 'care' | 'family'

export const RECORD_FILTERS: Array<{ value: RecordFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'visits', label: 'Visits' },
  { value: 'assessments', label: 'Assessments' },
  { value: 'tests', label: 'Tests and scans' },
  { value: 'care', label: 'Care plans' },
  { value: 'family', label: 'Family notes' },
]

const TYPE_LABEL: Record<TimelineType, string> = {
  visit: 'Visit',
  assessment: 'Assessment',
  test: 'Test',
  care: 'Care plan',
  note: 'Note',
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/** "09 Oct 2026" + "2:40 PM IST" → sortable number. Unknown formats sort as newest. */
export function sortKey(date: string, time?: string) {
  const m = /^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/.exec(date.trim())
  if (!m) return Number.MAX_SAFE_INTEGER
  const month = MONTHS.indexOf(m[2].toLowerCase())
  let minutes = 0
  const t = time ? /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(time) : null
  if (t) minutes = ((Number(t[1]) % 12) + (t[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(t[2])
  return Date.UTC(Number(m[3]), Math.max(0, month), Number(m[1])) + minutes * 60_000
}

const ACTION_LABEL: Array<[RegExp, string]> = [
  [/^\/app\/records\/reports\//, 'View report'],
  [/^\/app\/care\/plan/, 'View care plan'],
  [/^\/app\/care\/visit/, 'View visit details'],
  [/^\/app\/care\/assessment/, 'View summary'],
  [/^\/app\/care\/tests\/progress/, 'View test progress'],
  [/^\/app\/care\/tests/, 'View requested tests'],
]

export interface RecordItem {
  entry: TimelineEntry
  filter: Exclude<RecordFilter, 'all'> | 'other'
  key: number
  text: string
}

/** Timeline events that exist at this point in the episode, plus this tab's uploads. */
export function recordItems(state: DemoState): RecordItem[] {
  const reviewed = hasReached(state.stage, 'reviewed') && state.stage !== 'delivery-problem'
  const items: RecordItem[] = TIMELINE.filter((ev) => hasReached(state.stage, ev.from)).map((ev) => {
    let detail = ev.detail
    let date = ev.date
    let time = ev.time
    let sourceName = ev.sourceName
    let review = ev.review
    let reviewTone = ev.reviewTone
    if (ev.id === 'ev-booking' || ev.id === 'ev-visit') {
      // The visit as it was actually booked, matching Home, My care and the visit hub.
      const clin = clinicianById(state.booking.clinicianId)
      const slot = findSlot(clin, state.booking.slotId)
      if (clin && slot && ev.id === 'ev-booking') {
        const mode = (state.booking.mode ?? slot.mode) === 'video' ? 'video visit' : 'in clinic'
        detail = `${clin.name}, ${slot.date}, ${slot.time}, ${mode}.`
      }
      if (clin && slot && ev.id === 'ev-visit' && slot.date === ev.date) time = slot.time
    }
    if (ev.id === 'ev-collected') ({ date, time, detail, sourceName } = collectedEventFor(state.labBooking))
    if (ev.id === 'ev-released') {
      if (state.stage === 'delivery-problem') {
        detail = `Available to you. Not yet delivered to the care team - ${ORG.support} is following up.`
      }
      if (reviewed) {
        review = 'Clinician reviewed'
        reviewTone = 'info'
      } else {
        review = 'Available - not yet reviewed'
      }
    }
    const filter: RecordItem['filter'] =
      ev.type === 'visit'
        ? 'visits'
        : ev.type === 'assessment'
          ? 'assessments'
          : ev.type === 'test'
            ? 'tests'
            : ev.type === 'care'
              ? 'care'
              : ev.source === 'care-partner'
                ? 'family'
                : 'other'
    const actionLabel = ev.href ? ACTION_LABEL.find(([re]) => re.test(ev.href!))?.[1] : undefined
    return {
      filter,
      key: sortKey(date, time),
      text: `${ev.title} ${detail} ${sourceName}`.toLowerCase(),
      entry: {
        id: ev.id,
        date,
        time,
        typeLabel: TYPE_LABEL[ev.type],
        title: ev.title,
        detail,
        source: ev.source,
        sourceName,
        review,
        reviewTone,
        href: ev.href,
        actionLabel,
      },
    }
  })

  for (const u of state.uploads) {
    items.push({
      filter: 'tests',
      key: sortKey(u.addedAt),
      text: `${u.name} report added by you`.toLowerCase(),
      entry: {
        id: u.id,
        date: u.addedAt,
        typeLabel: 'Report added by you',
        title: u.name,
        detail: `${u.kind === 'pdf' ? 'PDF' : 'Image'} · ${u.sizeLabel} · Kept in this browser tab`,
        source: 'patient',
        sourceName: 'Original file kept as added',
        review: u.status === 'unreadable' ? 'Could not be read - add it again' : undefined,
        reviewTone: u.status === 'unreadable' ? 'warning' : undefined,
      },
    })
  }

  return items.sort((a, b) => b.key - a.key)
}

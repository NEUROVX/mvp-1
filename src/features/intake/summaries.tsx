/**
 * Read-only views of what the patient and the care partner shared. Used by the
 * check-in review, the observations page and the assessment summary. Sources
 * stay separate: patient-reported and care-partner-reported are never merged.
 */
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { CONCERN_LABELS, ONSET_LABELS } from '@/demo/fixtures'
import type { CheckInState, ObservationsState } from '@/demo/types'
import { CARE_CONTEXT_LABELS, concernChosen, YES_NO_LABELS } from './options'

export interface AnswerRow {
  key: string
  term: ReactNode
  detail: ReactNode
  /** Check-in step that asks this question (for "Change" links). */
  step?: '1' | '2' | '3' | '4'
}

const notAnswered = <span className="text-muted">Not answered</span>

export function checkInRows(c: CheckInState, who: { your: string }): AnswerRow[] {
  const rows: AnswerRow[] = [
    {
      key: 'context',
      term: 'What brings you here',
      detail: c.careContext ? CARE_CONTEXT_LABELS[c.careContext] : notAnswered,
      step: '1',
    },
    {
      key: 'concerns',
      term: 'What has changed',
      detail: c.concerns.length ? c.concerns.map((k) => CONCERN_LABELS[k]).join(', ') : notAnswered,
      step: '2',
    },
  ]
  if (concernChosen(c)) {
    rows.push(
      { key: 'onset', term: 'First noticed', detail: c.onset ? ONSET_LABELS[c.onset] : notAnswered, step: '2' },
      {
        key: 'daily',
        term: 'Everyday tasks harder than before',
        detail: c.dailyTasks ? YES_NO_LABELS[c.dailyTasks] : notAnswered,
        step: '2',
      },
    )
  }
  if (c.ownWords?.trim()) {
    rows.push({
      key: 'words',
      term: `In ${who.your} own words`,
      detail: <q className="text-ink">{c.ownWords.trim()}</q>,
      step: '2',
    })
  }
  if (concernChosen(c)) {
    rows.push({
      key: 'sudden',
      term: 'Did it happen suddenly',
      detail: c.suddenChange ? YES_NO_LABELS[c.suddenChange] : notAnswered,
      step: '3',
    })
  }
  rows.push(
    {
      key: 'support',
      term: 'Help with seeing, hearing or the screen',
      detail: c.hearingVisionSupport.length ? c.hearingVisionSupport.join(', ') : notAnswered,
      step: '4',
    },
  )
  return rows
}

export function observationRows(o: ObservationsState): AnswerRow[] {
  return [
    {
      key: 'items',
      term: 'Changes noticed',
      detail: o.items.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {o.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        notAnswered
      ),
    },
    { key: 'onset', term: 'First noticed', detail: o.onset ?? notAnswered },
    ...(o.notes?.trim() ? [{ key: 'notes', term: 'Notes', detail: <q>{o.notes.trim()}</q> }] : []),
  ]
}

/**
 * Hairline-separated answer list. Term above detail on mobile; two aligned
 * columns from `sm`. Optional trailing action per row (e.g. "Change").
 */
export function AnswerList({
  rows,
  action,
  className,
}: {
  rows: AnswerRow[]
  action?: (row: AnswerRow) => ReactNode
  className?: string
}) {
  return (
    <dl className={clsx('divide-y divide-border border-y border-border', className)}>
      {rows.map((r) => (
        <div key={r.key} className="grid gap-1 py-4 sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:gap-6">
          <dt className="text-body-md text-muted">{r.term}</dt>
          <dd className="min-w-0 text-data text-ink">{r.detail}</dd>
          {action ? <dd className="-my-2 sm:text-right">{action(r)}</dd> : null}
        </div>
      ))}
    </dl>
  )
}

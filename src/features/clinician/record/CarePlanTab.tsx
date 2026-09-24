import { ClipboardList } from 'lucide-react'
import { EmptyState, SourceLabel, StatusBadge } from '@/components/ui'
import { CARE_PLAN, CARE_PLAN_SUMMARY } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { CarePlanItem } from '@/demo/types'
import { isReviewed } from '../data'

const CATEGORY: Record<CarePlanItem['category'], string> = {
  'next-visit': 'Next visit',
  investigations: 'Investigations',
  medicines: 'Medicines',
  'daily-care': 'Daily care',
  'care-support': 'Care support',
  questions: 'Questions',
}

export function CarePlanTab() {
  const { state } = useDemo()
  if (!isReviewed(state.stage)) {
    return (
      <EmptyState title="No plan published yet" icon={<ClipboardList strokeWidth={1.75} />}>
        Publish a plan when you review results. The family sees it in their care plan, with your name and the date.
      </EmptyState>
    )
  }
  // A plan published without a follow-up has no next-visit item.
  const items = CARE_PLAN.filter((i) => i.category !== 'next-visit' || state.stage !== 'reviewed')
  const explanation = state.clinician.explanation ?? CARE_PLAN_SUMMARY.explanation

  return (
    <section aria-labelledby="plan-h" className="rounded-lg border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 id="plan-h" className="text-heading-sm text-ink">
            Care plan
          </h2>
          <p className="text-body-md text-muted">
            Version 1 · Published by {CARE_PLAN_SUMMARY.author} · {CARE_PLAN_SUMMARY.updated}
          </p>
        </div>
        <StatusBadge tone="info" className="self-start">
          Published to the family
        </StatusBadge>
      </div>

      <div className="space-y-3 border-b border-border px-5 py-5 sm:px-6">
        <h3 className="text-label text-ink">Explanation for the patient</h3>
        <p className="max-w-reading text-body-md text-ink">{explanation}</p>
        <p className="max-w-reading text-body-md text-muted">{CARE_PLAN_SUMMARY.medicinesNote}</p>
        <SourceLabel kind="clinician" name={CARE_PLAN_SUMMARY.author} />
      </div>

      <div className="px-5 pt-5 sm:px-6">
        <h3 className="text-label text-ink">Plan items as the family sees them</h3>
      </div>
      <ul className="divide-y divide-border px-5 sm:px-6">
        {items.map((it) => (
          <li key={it.id} className="grid gap-x-6 gap-y-1.5 py-4 md:grid-cols-[10rem_minmax(0,1fr)_auto]">
            <p className="text-body-md text-muted">{CATEGORY[it.category]}</p>
            <div className="min-w-0 space-y-1">
              <p className="text-label text-ink">{it.title}</p>
              <p className="text-body-md text-muted">{it.detail}</p>
              <p className="text-body-md text-ink">
                Owner: {it.owner}
                {it.due ? <span className="text-muted"> · {it.due}</span> : null}
              </p>
            </div>
            <div className="md:text-right">
              <StatusBadge tone="neutral">
                {it.status}
              </StatusBadge>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

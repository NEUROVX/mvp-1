import { FilePlus2, FolderOpen, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowLink,
  Button,
  DemoTag,
  EmptyState,
  PageHeader,
  StatusBadge,
  TextField,
  Timeline,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES, ORDERS, PENDING_REPORT, REPORTS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { AccessGate } from '@/features/records/AccessGate'
import { RECORD_FILTERS, recordItems, type RecordFilter } from '@/features/records/timeline'
import { ChoiceChips } from '@/features/tests/components'
import { orderStatus, reviewBadge, reviewStateFor } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

/** P18 · Records: searchable chronological list, newest first. No charts. */
export default function RecordsPage() {
  usePageTitle('Records')
  const { state } = useDemo()
  const { your, possessive } = usePeople()
  const Your = your.charAt(0).toUpperCase() + your.slice(1)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<RecordFilter>('all')

  const all = useMemo(() => recordItems(state), [state])
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((i) => (filter === 'all' || i.filter === filter) && (!q || i.text.includes(q)))
  }, [all, filter, query])
  const hasOrders = hasReached(state.stage, 'tests-requested')

  return (
    <div className="space-y-10">
      <PageHeader title="Records" lede={`${Your} visits, assessments, tests and care plans in one place, newest first.`} />

      <AccessGate>
        {all.length === 0 && !hasOrders ? (
          <EmptyState
            icon={<FolderOpen strokeWidth={1.75} />}
            title="No reports added yet."
            className="max-w-reading"
            action={
              <Button to="/app/care/reports-upload" variant="secondary" iconLeft={<FilePlus2 className="size-5" strokeWidth={1.75} />}>
                Add a report
              </Button>
            }
          >
            <p>You can continue your care without one.</p>
          </EmptyState>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-12">
            <ReportsList className="lg:col-start-2 lg:row-start-1" />

            <section aria-labelledby="history-heading" className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
              <h2 id="history-heading" className="sr-only">
                History
              </h2>
              <div className="space-y-5">
                <TextField
                  type="search"
                  label={`Search ${your} records`}
                  hint={`Only ${possessive} records are searched.`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="max-w-reading"
                />
                <ChoiceChips<RecordFilter>
                  legend="Show"
                  name="record-filter"
                  value={filter}
                  onChange={setFilter}
                  options={RECORD_FILTERS}
                />
              </div>

              <div className="rounded-lg border border-border bg-surface p-5 sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <p role="status" className="text-body-md text-muted">
                    <span className="font-semibold text-ink">{shown.length}</span>{' '}
                    {shown.length === 1 ? 'record' : 'records'}
                    {filter !== 'all' ? ` · ${RECORD_FILTERS.find((f) => f.value === filter)?.label}` : ''}
                  </p>
                  <DemoTag />
                </div>
                {shown.length ? (
                  <Timeline entries={shown.map((i) => i.entry)} label={`${possessive} records, newest first`} />
                ) : (
                  <EmptyState
                    icon={<SearchX strokeWidth={1.75} />}
                    title="No records match"
                    action={
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setQuery('')
                          setFilter('all')
                        }}
                      >
                        Clear search and filter
                      </Button>
                    }
                  >
                    <p>Try another word, or show all records.</p>
                  </EmptyState>
                )}
              </div>
            </section>
          </div>
        )}
      </AccessGate>
    </div>
  )
}

function ReportsList({ className }: { className?: string }) {
  const { state } = useDemo()
  const hasOrders = hasReached(state.stage, 'tests-requested')
  const deliveryFailed = state.stage === 'delivery-problem'

  return (
    <section aria-labelledby="reports-heading" className={className}>
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <h2 id="reports-heading" className="text-heading-sm text-ink">
          Reports
        </h2>
        {hasOrders ? (
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {ORDERS.map((o) => {
              const review = reviewStateFor(o.id, state)
              const badge = reviewBadge(review)
              const status = orderStatus(o.id, state)
              const report = REPORTS.find((r) => r.orderId === o.id)
              const title = report?.title ?? o.shortName
              let detail: string
              if (review.released) detail = `Released ${EPISODE_DATES.released} · ${report?.issuer}`
              else if (o.id === PENDING_REPORT.orderId && status.label === 'Processing') detail = PENDING_REPORT.status
              else detail = 'Not released yet'
              return (
                <li key={o.id} className="py-4">
                  <Link
                    to={`/app/records/reports/${o.id}`}
                    className="inline-flex min-h-11 items-center text-label text-primary underline decoration-1 underline-offset-[5px] hover:text-primary-hover"
                  >
                    {title}
                  </Link>
                  <p className="text-body-md text-muted">{detail}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge tone={badge?.tone ?? status.tone}>
                      {badge?.label ?? status.label}
                    </StatusBadge>
                    {review.released && deliveryFailed ? (
                      <StatusBadge tone="warning">
                        Not yet shared with the care team
                      </StatusBadge>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-2 text-body-md text-muted">
            No laboratory reports yet. They appear here when a provider releases them.
          </p>
        )}
        <div className="mt-2 border-t border-border pt-2">
          <ArrowLink to="/app/care/reports-upload">Add a report</ArrowLink>
        </div>
      </div>
    </section>
  )
}

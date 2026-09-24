import { clsx } from 'clsx'
import { FileText } from 'lucide-react'
import type { ReactNode } from 'react'
import { SourceLabel } from '@/components/ui'
import type { PacketItem } from './packet'

/** Receipt-style summary: term on the left, facts on the right, hairline rows. */
export function SummaryList({
  rows,
  className,
}: {
  rows: Array<{ term: ReactNode; detail: ReactNode }>
  className?: string
}) {
  return (
    <dl className={clsx('divide-y divide-border', className)}>
      {rows.map((r, i) => (
        <div key={i} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
          <dt className="text-body-md text-muted">{r.term}</dt>
          <dd className="min-w-0 space-y-0.5 text-body-md text-ink">{r.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Read-only list of visit-packet items, each with its source. */
export function PacketList({
  items,
  status,
  bare,
  className,
}: {
  items: PacketItem[]
  /** No outer border, e.g. inside a Disclosure. */
  bare?: boolean
  /** Optional per-item status text, e.g. "Shared". */
  status?: (item: PacketItem) => ReactNode
  className?: string
}) {
  return (
    <ul className={clsx('divide-y divide-border', !bare && 'rounded-lg border border-border bg-surface', className)}>
      {items.map((it) => (
        <li key={it.id} className={clsx('flex gap-3', bare ? 'py-4 first:pt-0 last:pb-0' : 'p-4')}>
          <FileText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
          <div className="min-w-0 space-y-1">
            <p className="text-label [overflow-wrap:anywhere] text-ink">{it.title}</p>
            <p className="text-body-md text-muted">{it.detail}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <SourceLabel kind={it.source} name={it.sourceName} />
              {status ? <span className="text-body-md text-muted">{status(it)}</span> : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

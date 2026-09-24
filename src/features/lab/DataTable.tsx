import { clsx } from 'clsx'
import type { ReactNode } from 'react'

/**
 * Operational table (DESIGN.md › Tables, search and operational views).
 * Wide screens: a real table with ≥48px rows and named actions, inside a
 * labelled region that scrolls on its own if it ever runs out of room.
 * Narrow screens: the same rows stacked as short records, so the page itself
 * never scrolls sideways.
 */
export interface Column<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /** Extra classes for the header and body cells (width, alignment). */
  className?: string
  /** Set to false when the stacked record already shows this value in its header. */
  stacked?: boolean
  /** Hide the stacked label (e.g. for an action). */
  stackedLabel?: boolean
}

export function DataTable<T>({
  label,
  columns,
  rows,
  rowKey,
  cardHeader,
  cardFooter,
  from = 'xl',
  minWidth = 'min-w-[60rem]',
  className,
}: {
  /** Accessible name for the table and its scroll region. */
  label: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Top of each stacked record on narrow screens. */
  cardHeader: (row: T) => ReactNode
  /** Bottom of each stacked record, usually the named action. */
  cardFooter?: (row: T) => ReactNode
  /** Width from which the real table is shown. */
  from?: 'lg' | 'xl'
  minWidth?: string
  className?: string
}) {
  const stacked = columns.filter((c) => c.stacked !== false)
  return (
    <div className={className}>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className={clsx(
          from === 'xl' ? 'hidden xl:block' : 'hidden lg:block',
          'relative overflow-x-auto rounded-lg border border-border bg-surface',
        )}
      >
        <table className={clsx('w-full border-collapse text-left', minWidth)}>
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className={clsx(
                    'border-b border-border bg-canvas px-4 py-3 align-bottom text-body-md font-semibold whitespace-nowrap text-muted first:pl-6 last:pr-6',
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border last:border-b-0">
                {columns.map((c) => (
                  <td key={c.id} className={clsx('px-4 py-3.5 align-top text-body-md text-ink first:pl-6 last:pr-6', c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={label} className={clsx(from === 'xl' ? 'xl:hidden' : 'lg:hidden', 'grid gap-3 md:grid-cols-2')}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="flex min-w-0 flex-col rounded-lg border border-border bg-surface p-4 sm:p-5">
            {cardHeader(row)}
            {stacked.length ? (
              <dl className="mt-4 grid gap-x-5 gap-y-3 border-t border-border pt-4 min-[360px]:grid-cols-2">
                {stacked.map((c) => (
                  <div key={c.id} className="min-w-0">
                    <dt className={clsx('text-body-md text-muted', c.stackedLabel === false && 'sr-only')}>{c.header}</dt>
                    <dd className="text-body-md text-ink">{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {cardFooter ? <div className="mt-auto pt-4">{cardFooter(row)}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

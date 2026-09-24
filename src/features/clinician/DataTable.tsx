import { clsx } from 'clsx'
import type { ReactNode } from 'react'

/**
 * Professional table (DESIGN.md › Tables, search and operational views).
 * A real <table> from 1024px; below that each row collapses to a stacked
 * block so nothing scrolls sideways at 390 or 320px. Row height ≥ 56px.
 */
export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  /** Row header (<th scope="row">) and the title of the stacked block. */
  primary?: boolean
  /** Action column: no label in the stacked layout. */
  action?: boolean
  className?: string
}

export interface RowGroup<T> {
  id: string
  /** Optional group header (e.g. "Today · 06 Oct 2026"). */
  label?: ReactNode
  rows: T[]
}

export function DataTable<T>({
  caption,
  columns,
  groups,
  rowKey,
  empty,
  className,
}: {
  caption: string
  columns: Column<T>[]
  groups: RowGroup<T>[]
  rowKey: (row: T) => string
  /** Shown when every group is empty. */
  empty?: ReactNode
  className?: string
}) {
  const total = groups.reduce((n, g) => n + g.rows.length, 0)
  const primary = columns.find((c) => c.primary) ?? columns[0]
  const details = columns.filter((c) => c !== primary && !c.action)
  const actions = columns.filter((c) => c.action)

  if (!total && empty) return <div className={className}>{empty}</div>

  return (
    <div className={clsx('overflow-hidden rounded-lg border border-border bg-surface', className)}>
      {/* Wide screens: a true table */}
      <table className="hidden w-full border-collapse text-left lg:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={clsx('px-4 py-3 align-bottom text-body-md font-semibold text-muted first:pl-6 last:pr-6', c.className)}
              >
                {c.action ? <span className="sr-only">{c.header}</span> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) =>
          g.rows.length ? (
            <tbody key={g.id}>
              {g.label ? (
                <tr className="border-b border-border bg-canvas">
                  <th scope="rowgroup" colSpan={columns.length} className="px-6 py-2.5 text-label text-ink">
                    {g.label}
                  </th>
                </tr>
              ) : null}
              {g.rows.map((row) => (
                <tr key={rowKey(row)} className="border-b border-border last:border-b-0">
                  {columns.map((c) => {
                    const cls = clsx(
                      'h-16 px-4 py-3 align-middle text-body-md text-ink first:pl-6 last:pr-6',
                      c.action && 'text-right whitespace-nowrap',
                      c.className,
                    )
                    return c === primary ? (
                      <th key={c.key} scope="row" className={clsx(cls, 'font-normal')}>
                        {c.cell(row)}
                      </th>
                    ) : (
                      <td key={c.key} className={cls}>
                        {c.cell(row)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          ) : null,
        )}
      </table>

      {/* Narrow screens: stacked rows, same content and order */}
      <div className="lg:hidden">
        {groups.map((g) =>
          g.rows.length ? (
            <section key={g.id} aria-label={typeof g.label === 'string' ? g.label : caption}>
              {g.label ? (
                <p className="border-b border-border bg-canvas px-4 py-2.5 text-label text-ink sm:px-5">{g.label}</p>
              ) : null}
              <ul className="divide-y divide-border border-b border-border last:border-b-0">
                {g.rows.map((row) => (
                  <li key={rowKey(row)} className="space-y-3 px-4 py-4 sm:px-5">
                    <div className="text-label text-ink">{primary.cell(row)}</div>
                    {details.length ? (
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 min-[360px]:grid-cols-[7.5rem_minmax(0,1fr)]">
                        {details.map((c) => (
                          <div key={c.key} className="contents">
                            <dt className="text-body-md text-muted">{c.header}</dt>
                            <dd className="-mt-1.5 text-body-md text-ink min-[360px]:mt-0">{c.cell(row)}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {actions.length ? (
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {actions.map((c) => (
                          <div key={c.key}>{c.cell(row)}</div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}
      </div>
    </div>
  )
}

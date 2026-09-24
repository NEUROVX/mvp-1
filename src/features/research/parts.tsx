import { clsx } from 'clsx'
import type { ReactNode } from 'react'

/**
 * A research-overview section: heading and short framing on the left, the
 * content on the right at wide widths; one column on narrow screens.
 */
export function ResearchSection({
  id,
  title,
  intro,
  children,
  className,
}: {
  id?: string
  title: string
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  const headingId = `${id ?? title.toLowerCase().replace(/[^a-z]+/g, '-')}-title`
  return (
    <section id={id} aria-labelledby={headingId} className={clsx('border-t border-border pt-10', className)}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0 space-y-2">
          <h2 id={headingId} className="text-heading-md text-ink">
            {title}
          </h2>
          {intro ? <div className="text-body-md text-muted [&_p+p]:mt-2">{intro}</div> : null}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

/** An empty value in a structure-only table: a visible dash, announced as "No data". */
export function NoData() {
  return (
    <>
      <span aria-hidden="true" className="text-muted">
        —
      </span>
      <span className="sr-only">No data</span>
    </>
  )
}

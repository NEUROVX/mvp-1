/**
 * Small layout pieces for focused patient tasks (FocusedLayout pages).
 * They compose the kit; they do not add gutters or a page max-width.
 */
import { clsx } from 'clsx'
import { Siren } from 'lucide-react'
import { forwardRef, useEffect, useRef, type ReactNode } from 'react'
import { TextLink } from '@/components/ui'

/** Page title for focused tasks: 28px mobile, 32px desktop (PATIENT.md › Typography). */
export const TaskTitle = forwardRef<HTMLHeadingElement, { children: ReactNode; className?: string }>(function TaskTitle(
  { children, className },
  ref,
) {
  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className={clsx(
        'text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.015em] text-ink focus:outline-none md:text-patient-title',
        className,
      )}
    >
      {children}
    </h1>
  )
})

/** Lede under a task title: patient body text, reading width. */
export function TaskLede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('max-w-reading text-body-lg text-muted', className)}>{children}</p>
}

/**
 * When `key` changes after the first render (a new step inside one route),
 * scroll to the top and move focus to the new heading so screen-reader users
 * hear where they are.
 */
export function useFocusOnChange<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    ref.current?.focus({ preventScroll: true })
  }, [key])
  return ref
}

/** The white task surface on the canvas. One per task area; never nested. */
export function Panel({ children, className, as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' }) {
  return <As className={clsx('rounded-lg border border-border bg-surface p-5 sm:p-8', className)}>{children}</As>
}

/** h2 inside a task panel or page section. */
export function PanelHeading({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h2 id={id} className={clsx('text-heading-sm text-ink', className)}>
      {children}
    </h2>
  )
}

/**
 * Primary action first in reading order. Mobile: full-width stack.
 * Desktop: one row, left aligned, with an optional trailing status.
 */
export function ActionRow({ children, status, className }: { children: ReactNode; status?: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 [&>*]:w-full sm:[&>*]:w-auto sm:[&>*]:shrink-0">
        {children}
      </div>
      {status ? <div className="sm:ml-auto">{status}</div> : null}
    </div>
  )
}

/** Persistent quiet safety route on onboarding and check-in (PATIENT.md › Progressive intake). */
export function UrgentHelpLine({ className }: { className?: string }) {
  return (
    <p className={clsx('flex items-start gap-2.5 text-body-md text-muted', className)}>
      <Siren aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" strokeWidth={1.75} />
      <span>
        Sudden changes in speech, strength or confusion? <TextLink to="/urgent">Get urgent help</TextLink>
      </span>
    </p>
  )
}

/** Two-column fact row (term | detail) with a hairline, used for "Before you begin" facts. */
export function FactRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-border py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
      <dt className="text-label text-ink">{term}</dt>
      <dd className="min-w-0 text-body-lg text-ink [&_p+p]:mt-1">{children}</dd>
    </div>
  )
}

import { clsx } from 'clsx'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { InlineStatus, TextLink } from '@/components/ui'

/** Section heading row used across the workspace: h2 + optional aside. */
export function SectionHead({
  id,
  title,
  aside,
  description,
  className,
}: {
  id?: string
  title: ReactNode
  aside?: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('mb-4 space-y-1', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 id={id} className="text-heading-sm text-ink">
          {title}
        </h2>
        {aside ? <div className="flex flex-wrap items-center gap-3">{aside}</div> : null}
      </div>
      {description ? <p className="max-w-reading text-body-md text-muted">{description}</p> : null}
    </div>
  )
}

/**
 * Named row action (never icon-only). The visually hidden suffix gives each
 * link a unique accessible name, e.g. "Open record for R. Iyer (demo)".
 */
export function RowAction({ to, children, context }: { to: string; children: ReactNode; context?: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-12 items-center gap-1.5 text-label text-primary hover:text-primary-hover"
    >
      <span className="underline decoration-1 underline-offset-[5px] group-hover:decoration-2">{children}</span>
      {context ? <span className="sr-only"> for {context}</span> : null}
      <ArrowRight aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2} />
    </Link>
  )
}

/**
 * Wrapper for an always-mounted live region that takes no space while empty
 * (the region stays in the accessibility tree so later messages are announced).
 */
export function LiveSlot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx(className, '[&:has(>p:empty)]:m-0 [&:has(>p:empty)]:h-0 [&:has(>p:empty)]:overflow-hidden')}>
      {children}
    </div>
  )
}

/**
 * Feedback after a clinician action that changes the shared episode:
 * "Accepted. Asha’s care team view is updated." + a quiet link to /app.
 * The live region is always mounted so the message is announced.
 */
export function ActionFeedback({ message, extra }: { message?: string; extra?: ReactNode }) {
  return (
    <InlineStatus>
      {message ? (
        <>
          {message}{' '}
          <TextLink to="/app">See the patient view</TextLink>
          {extra}
        </>
      ) : null}
    </InlineStatus>
  )
}

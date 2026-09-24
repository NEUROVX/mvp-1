import { clsx } from 'clsx'
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { Button } from './Button'
import { StatusBadge } from './Primitives'
import type { Tone } from '@/demo/types'

/**
 * The next-step card (DESIGN.md › The next-step card): the most important
 * shared patient component.
 * Structure: status -> task title -> one sentence why -> date/preparation
 * details when known -> named owner when known -> one action.
 * Only one primary action; at most one quiet alternative.
 */
export function NextStepCard({
  eyebrow = 'Your next step',
  status,
  title,
  body,
  details,
  owner,
  primary,
  alternative,
  children,
  headingLevel = 2,
  className,
}: {
  eyebrow?: string
  status?: { label: string; tone: Tone }
  title: string
  body: ReactNode
  details?: string[]
  owner?: string
  primary?: { label: string; to?: string; onClick?: () => void }
  alternative?: { label: string; to?: string; onClick?: () => void }
  children?: ReactNode
  headingLevel?: 2 | 3
  className?: string
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const titleId = useId()
  return (
    <section
      aria-labelledby={titleId}
      className={clsx('rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-label text-primary">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full border-2 border-primary" />
          {eyebrow}
        </p>
        {status ? <StatusBadge tone={status.tone}>{status.label}</StatusBadge> : null}
      </div>

      <H id={titleId} className="mt-4 text-heading-md text-ink sm:text-[1.75rem] sm:leading-[1.25]">
        {title}
      </H>
      <p className="mt-2 max-w-reading text-body-lg text-ink">{body}</p>

      {details?.length || owner ? (
        <ul className="mt-5 space-y-2 border-t border-border pt-4">
          {details?.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-body-md text-ink">
              <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
              <span className="tabular">{d}</span>
            </li>
          ))}
          {owner ? (
            <li className="flex items-start gap-2.5 text-body-md text-muted">
              <UserRound aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
              <span>{owner}</span>
            </li>
          ) : null}
        </ul>
      ) : null}

      {children ? <div className="mt-5">{children}</div> : null}

      {primary || alternative ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
          {primary ? (
            primary.to ? (
              <Button to={primary.to} size="lg" iconRight={<ArrowRight className="size-5" />}>
                {primary.label}
              </Button>
            ) : (
              <Button onClick={primary.onClick} size="lg" iconRight={<ArrowRight className="size-5" />}>
                {primary.label}
              </Button>
            )
          ) : null}
          {alternative ? (
            alternative.to ? (
              <Button to={alternative.to} variant="quiet">
                {alternative.label}
              </Button>
            ) : (
              <Button onClick={alternative.onClick} variant="quiet">
                {alternative.label}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

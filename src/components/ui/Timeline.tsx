import { clsx } from 'clsx'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SourceLabel, StatusBadge } from './Primitives'
import type { SourceKind, Tone } from '@/demo/types'

/**
 * Chronological record list (DESIGN.md › Longitudinal record): a list
 * before it is a chart. Each item: type, date, source, review state, action.
 */
export interface TimelineEntry {
  id: string
  date: string
  time?: string
  typeLabel: string
  title: string
  detail?: ReactNode
  source: SourceKind
  sourceName?: string
  review?: string
  reviewTone?: Tone
  href?: string
  actionLabel?: string
}

export function Timeline({ entries, className, label = 'Timeline' }: { entries: TimelineEntry[]; className?: string; label?: string }) {
  return (
    <ol aria-label={label} className={clsx('relative', className)}>
      {entries.map((e, i) => (
        <li key={e.id} className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 pb-6 last:pb-0 sm:grid-cols-[8.5rem_auto_minmax(0,1fr)]">
          <div className="col-span-2 mb-1 text-body-md text-muted tabular sm:col-span-1 sm:mb-0 sm:pt-0.5 sm:text-right">
            <span className="text-ink font-medium">{e.date}</span>
            {e.time ? <span className="block text-metadata sm:text-body-md">{e.time}</span> : null}
          </div>
          <div aria-hidden="true" className="relative flex justify-center">
            <span className="relative z-10 mt-1.5 size-3 rounded-full border-2 border-primary bg-surface" />
            {i < entries.length - 1 ? <span className="absolute top-5 -bottom-6 w-0.5 bg-border" /> : null}
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className="text-metadata font-medium text-muted">{e.typeLabel}</p>
            <p className="text-label text-ink">{e.title}</p>
            {e.detail ? <div className="text-body-md text-muted">{e.detail}</div> : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-0.5">
              <SourceLabel kind={e.source} name={e.sourceName} />
              {e.review ? (
                <StatusBadge tone={e.reviewTone ?? 'neutral'} size="sm">
                  {e.review}
                </StatusBadge>
              ) : null}
            </div>
            {e.href ? (
              <Link to={e.href} className="inline-flex min-h-11 items-center gap-1.5 text-label text-primary hover:text-primary-hover">
                {e.actionLabel ?? 'Open'}
                <span className="sr-only">: {e.title}</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

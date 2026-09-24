/**
 * Shared Learn building blocks used in both contexts:
 * public (/learn…, inside PublicLayout) and app (/app/learn…, inside PatientLayout).
 */
import { clsx } from 'clsx'
import { ArrowUpRight, BookOpen, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PageHeader, StatusBadge } from '@/components/ui'
import { readingTime, typeLabel, type Article } from './articles'
import { articlePath, type LearnContext } from './paths'
import { SOURCES, type SourceId } from './sources'

/** Public pages own their gutters and section spacing; the patient layout provides its own. */
export function LearnFrame({ context, children }: { context: LearnContext; children: ReactNode }) {
  if (context === 'app') return <>{children}</>
  return <div className="page-gutter mx-auto max-w-page pt-10 pb-16 md:pt-14 md:pb-24">{children}</div>
}

/** h1 block. Public: 36px heading. App: the patient PageHeader. */
export function LearnHeader({
  context,
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  context: LearnContext
  eyebrow?: ReactNode
  title: string
  lede?: ReactNode
  children?: ReactNode
  className?: string
}) {
  if (context === 'app') {
    return <PageHeader eyebrow={eyebrow} title={title} lede={lede} meta={children} className={className} />
  }
  return (
    <header className={clsx('max-w-reading space-y-3', className)}>
      {eyebrow ? <div className="text-label text-primary">{eyebrow}</div> : null}
      <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">{title}</h1>
      {lede ? <p className="text-body-lg text-muted">{lede}</p> : null}
      {children ? <div className="pt-1">{children}</div> : null}
    </header>
  )
}

/** NeuroLearn's discreet identity: a book symbol and the name. No avatar. */
export function NeuroLearnMark({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 text-label text-primary', className)}>
      <BookOpen aria-hidden="true" className="size-5" strokeWidth={1.75} />
      NeuroLearn
    </span>
  )
}

/** Readable source references with their checked date. */
export function SourceList({
  ids,
  note,
  className,
  heading = 'Sources',
  headingAs: H = 'p',
}: {
  ids: SourceId[]
  note?: string
  className?: string
  heading?: string
  headingAs?: 'p' | 'h2' | 'h3'
}) {
  return (
    <div className={className}>
      <H className={H === 'h2' ? 'text-heading-sm text-ink' : 'text-label text-ink'}>{heading}</H>
      {ids.length ? (
        <ul className="mt-2 space-y-3">
          {ids.map((id) => {
            const s = SOURCES[id]
            return (
              <li key={id} className="text-body-md">
                <a href={s.url} target="_blank" rel="noreferrer" className="group inline prose-link">
                  {s.title}
                  <ArrowUpRight aria-hidden="true" className="ml-0.5 inline size-4 align-[-2px]" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span className="block text-muted">
                  {s.publisher} · checked <span className="tabular">{s.checked}</span>
                </span>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-1 text-body-md text-muted">{note}</p>
      )}
    </div>
  )
}

/** One editorial list row for a guide or update. */
export function ArticleRow({
  article,
  context,
  headingLevel = 3,
  showDescription = true,
  compact = false,
}: {
  article: Article
  context: LearnContext
  headingLevel?: 2 | 3
  showDescription?: boolean
  /** Single column, for narrow containers such as the Saved view. */
  compact?: boolean
}) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article
      className={clsx(
        'group relative grid gap-x-8 gap-y-2 py-6',
        compact ? 'grid-cols-[minmax(0,1fr)_auto]' : 'md:grid-cols-[10rem_minmax(0,1fr)_auto]',
      )}
    >
      <p className={clsx('text-body-md text-muted', compact && 'col-span-2')}>
        <span className="font-semibold text-ink">{typeLabel(article)}</span>
        <span aria-hidden="true" className={compact ? undefined : 'md:hidden'}> · </span>
        <span className={compact ? undefined : 'md:block'}>{article.topic}</span>
      </p>
      <div className="min-w-0 space-y-2">
        <H className="text-heading-sm text-ink">
          <Link
            to={articlePath(context, article.slug)}
            className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-150 after:absolute after:inset-0 group-hover:text-primary group-hover:decoration-current"
          >
            {article.title}
          </Link>
        </H>
        {showDescription ? <p className="max-w-reading text-body-md text-muted">{article.description}</p> : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
          <StatusBadge tone="neutral">{article.reviewLabel}</StatusBadge>
          <span className="text-body-md text-muted tabular">
            Updated {article.updated} · {readingTime(article)}
          </span>
        </div>
      </div>
      <ChevronRight
        aria-hidden="true"
        className={clsx(
          'size-6 self-center text-muted transition-colors duration-150 group-hover:text-primary',
          compact ? 'block' : 'hidden md:block',
        )}
        strokeWidth={1.75}
      />
    </article>
  )
}

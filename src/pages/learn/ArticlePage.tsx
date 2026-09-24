import { clsx } from 'clsx'
import { ArrowLeft, Bookmark, BookmarkCheck, BookOpen, FileQuestion, OctagonAlert, Printer } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, EmptyState, InlineStatus, StatusBadge } from '@/components/ui'
import { articleBySlug, GUIDES, readingTime, typeLabel, type ArticleBlock } from '@/features/learn/articles'
import { LearnFrame, SourceList } from '@/features/learn/components'
import { articlePath, learnBase, neurolearnPath, type LearnContext } from '@/features/learn/paths'
import { useSavedArticles } from '@/features/learn/storage'
import { usePageTitle } from '@/lib/hooks'

/** Text size steps. The default stays at patient body size (18px); larger steps only grow. */
const TEXT_SIZES = [
  { label: 'Standard', className: 'text-body-lg' },
  { label: 'Large', className: 'text-[1.25rem] leading-[1.65]' },
  { label: 'Largest', className: 'text-[1.375rem] leading-[1.65]' },
] as const

export default function ArticlePage({ context }: { context: LearnContext }) {
  const { slug } = useParams()
  const article = articleBySlug(slug)
  usePageTitle(article ? article.title : 'Article not found')
  const { isSaved, toggle } = useSavedArticles()
  const [size, setSize] = useState(0)
  const [status, setStatus] = useState('')

  if (!article) {
    return (
      <LearnFrame context={context}>
        <h1 className="sr-only">Article not found</h1>
        <EmptyState
          icon={<FileQuestion strokeWidth={1.75} />}
          title="This article is not available"
          action={<Button to={learnBase(context)}>Go to Learn</Button>}
          className="max-w-reading"
        >
          The link may be out of date, or the article may have been removed. Guides and updates are listed in Learn.
        </EmptyState>
      </LearnFrame>
    )
  }

  const saved = isSaved(article.slug)
  const others = GUIDES.filter((g) => g.slug !== article.slug)
  const isPublic = context === 'public'

  return (
    <LearnFrame context={context}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,42.5rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <article className="min-w-0" aria-labelledby="article-title">
          <Link
            to={learnBase(context)}
            className="-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-body-md font-medium text-primary hover:text-primary-hover print:hidden"
          >
            <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.75} />
            All guides and updates
          </Link>

          <header className="mt-4 space-y-4">
            <p className="text-body-md text-muted">
              <span className="font-semibold text-ink">{typeLabel(article)}</span> · {article.topic}
            </p>
            <h1
              id="article-title"
              className={clsx(
                'text-ink',
                isPublic ? 'text-heading-lg-mobile md:text-heading-lg' : 'text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.015em] md:text-patient-title',
              )}
            >
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusBadge tone={article.type === 'guide' ? 'warning' : 'neutral'}>{article.reviewLabel}</StatusBadge>
              <span className="text-body-md text-muted tabular">
                Updated {article.updated} · {readingTime(article)}
              </span>
            </div>
          </header>

          {/* Reading tools */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-y border-border py-2 print:hidden">
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => {
                const now = toggle(article.slug)
                setStatus(now ? 'Saved in this browser tab.' : 'Removed from saved.')
              }}
              className={toolClass}
            >
              {saved ? (
                <BookmarkCheck aria-hidden="true" className="size-5 text-primary" strokeWidth={1.75} />
              ) : (
                <Bookmark aria-hidden="true" className="size-5" strokeWidth={1.75} />
              )}
              {saved ? 'Saved' : 'Save article'}
            </button>
            <Link to={neurolearnPath(context, article.askQuestion)} className={toolClass}>
              <BookOpen aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {/* Shorter on phones so the tools fit in two tidy rows instead of three ragged ones. */}
              <span className="sm:hidden">Ask NeuroLearn</span>
              <span className="hidden sm:inline">Ask NeuroLearn about this</span>
            </Link>
            <button type="button" onClick={() => window.print()} className={toolClass}>
              <Printer aria-hidden="true" className="size-5" strokeWidth={1.75} />
              Print
            </button>
            <div role="group" aria-label="Text size" className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setSize((s) => Math.max(0, s - 1))
                  setStatus(`Text size: ${TEXT_SIZES[Math.max(0, size - 1)].label}.`)
                }}
                disabled={size === 0}
                className={sizeClass}
              >
                <span aria-hidden="true">A−</span>
                <span className="sr-only">Smaller text</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSize((s) => Math.min(TEXT_SIZES.length - 1, s + 1))
                  setStatus(`Text size: ${TEXT_SIZES[Math.min(TEXT_SIZES.length - 1, size + 1)].label}.`)
                }}
                disabled={size === TEXT_SIZES.length - 1}
                className={clsx(sizeClass, 'text-[1.125rem]')}
              >
                <span aria-hidden="true">A+</span>
                <span className="sr-only">Larger text</span>
              </button>
            </div>
          </div>
          <div className="mt-2 print:hidden">
            <InlineStatus>{status}</InlineStatus>
          </div>

          <div className={clsx('mt-6 text-ink', TEXT_SIZES[size].className)}>
            <section aria-label="Summary" className="rounded-lg bg-canvas p-5 sm:p-6 print:border print:border-border">
              <p className="text-label text-muted">In brief</p>
              <p className="mt-2">{article.summary}</p>
            </section>

            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id} className="mt-10">
                <h2 id={s.id} className="text-heading-md text-ink">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-4">
                  {s.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            {article.glossary?.length ? (
              <section aria-labelledby="glossary" className="mt-10">
                <h2 id="glossary" className="text-heading-md text-ink">
                  Glossary
                </h2>
                <dl className="mt-3 divide-y divide-border border-y border-border">
                  {article.glossary.map((g) => (
                    <div key={g.term} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                      <dt className="font-semibold">{g.term}</dt>
                      <dd className="text-muted">{g.definition}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section aria-labelledby="not-this" className="mt-10">
              <h2 id="not-this" className="text-heading-sm text-ink">
                {article.notThis.heading}
              </h2>
              <p className="mt-2 text-muted">{article.notThis.text}</p>
            </section>

            <SourceList
              ids={article.sources}
              note={article.sourcesNote}
              headingAs="h2"
              className="mt-10 border-t border-border pt-8"
            />
          </div>
        </article>

        <aside aria-label="More from Learn" className="min-w-0 print:hidden lg:pt-16">
          <div className="space-y-8 lg:sticky lg:top-28">
            <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
              <h2 className="text-heading-sm text-ink">Still have a question?</h2>
              <p className="mt-2 text-body-md text-muted">
                NeuroLearn explains general topics with sources. It does not diagnose or prescribe.
              </p>
              <Button to={neurolearnPath(context, article.askQuestion)} variant="secondary" className="mt-4" fullWidth>
                Ask NeuroLearn
              </Button>
            </section>
            {others.length ? (
              <section>
                <h2 className="text-label text-ink">More guides</h2>
                <ul className="mt-2 divide-y divide-border border-y border-border">
                  {others.map((g) => (
                    <li key={g.slug}>
                      <Link
                        to={articlePath(context, g.slug)}
                        className="block py-3 text-body-md font-medium text-primary underline decoration-transparent underline-offset-4 hover:decoration-current"
                      >
                        {g.title}
                      </Link>
                      <p className="-mt-2 pb-3 text-body-md text-muted">{readingTime(g)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </aside>
      </div>
    </LearnFrame>
  )
}

const toolClass =
  'inline-flex min-h-12 items-center gap-2 rounded-md px-3 text-body-md font-medium text-ink transition-colors duration-150 hover:bg-canvas'
const sizeClass =
  'inline-flex size-12 items-center justify-center rounded-md border border-control text-body-md font-semibold text-ink transition-colors duration-150 hover:bg-canvas disabled:cursor-not-allowed disabled:border-border disabled:text-muted'

function Block({ block }: { block: ArticleBlock }) {
  if (block.kind === 'p') return <p>{block.text}</p>
  if (block.kind === 'ul') {
    return (
      <ul className="list-disc space-y-2 pl-6 marker:text-muted">
        {block.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    )
  }
  return (
    <div className="flex gap-3 rounded-md bg-error-surface p-4 sm:p-5">
      <OctagonAlert aria-hidden="true" className="mt-1 size-5 shrink-0 text-error" strokeWidth={2} />
      <div className="min-w-0 space-y-2">
        <p>{block.text}</p>
        <p className="text-body-md">
          <a href="tel:112" className="prose-link font-semibold">
            Call 112
          </a>
          <span className="text-muted"> · </span>
          <Link to="/urgent" className="prose-link">
            Urgent help guidance
          </Link>
        </p>
      </div>
    </div>
  )
}

import { ArrowRight, Bookmark, MessageCircleQuestion, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button, EmptyState, InlineStatus, SelectField, Tabs, TextLink } from '@/components/ui'
import { useDemo } from '@/demo/store'
import { articleBySlug, GUIDES, UPDATES } from '@/features/learn/articles'
import { ArticleRow, LearnFrame, LearnHeader, NeuroLearnMark } from '@/features/learn/components'
import { STARTERS } from '@/features/learn/neurolearn'
import { LEARN_VIEWS, neurolearnPath, type LearnContext, type LearnView } from '@/features/learn/paths'
import { useMinWidth, useSavedArticles } from '@/features/learn/storage'
import { usePageTitle } from '@/lib/hooks'

const VIEW_LABELS: Record<LearnView, string> = {
  guides: 'Guides',
  updates: 'Articles & updates',
  ask: 'Ask NeuroLearn',
  saved: 'Saved',
}

export default function LearnHubPage({ context }: { context: LearnContext }) {
  usePageTitle('Learn')
  const [params, setParams] = useSearchParams()
  const requested = params.get('view') as LearnView | null
  const view: LearnView = requested && LEARN_VIEWS.includes(requested) ? requested : 'guides'

  const setView = (v: LearnView) => {
    const next = new URLSearchParams(params)
    if (v === 'guides') next.delete('view')
    else next.set('view', v)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const wide = useMinWidth(640)

  const panels: Record<LearnView, ReactNode> = {
    guides: <GuidesPanel context={context} />,
    updates: <UpdatesPanel context={context} />,
    ask: <AskPanel context={context} />,
    saved: <SavedPanel context={context} />,
  }

  return (
    <LearnFrame context={context}>
      <LearnHeader
        context={context}
        title="Learn"
        lede="Clear explanations of memory concerns, assessments and everyday care."
      >
        {context === 'public' ? (
          <p className="text-body-md text-muted">No account needed. Everything here is general education.</p>
        ) : null}
      </LearnHeader>

      {wide ? (
        <Tabs
          className="mt-10"
          label="Learn views"
          value={view}
          onChange={(id) => setView(id as LearnView)}
          tabs={LEARN_VIEWS.map((v) => ({ id: v, label: VIEW_LABELS[v], panel: panels[v] }))}
        />
      ) : (
        /* Mobile: a clear view selector instead of an overflowing tab strip. */
        <div className="mt-8">
          <SelectField
            label="Show"
            value={view}
            onChange={(e) => setView(e.target.value as LearnView)}
            options={LEARN_VIEWS.map((v) => ({ value: v, label: VIEW_LABELS[v] }))}
          />
          <div className="mt-8">{panels[view]}</div>
        </div>
      )}
    </LearnFrame>
  )
}

/** The tab already names the view, so the panel opens with a one-line description, not a repeated heading. */
function PanelIntro({ children }: { children: ReactNode }) {
  return <p className="max-w-reading text-body-lg text-muted">{children}</p>
}

function GuidesPanel({ context }: { context: LearnContext }) {
  return (
    <section className="space-y-4">
      <PanelIntro>Evergreen explanations for patients and families. Each guide is a draft until it has been clinically reviewed.</PanelIntro>
      <div className="divide-y divide-border border-y border-border">
        {GUIDES.map((a) => (
          <ArticleRow key={a.slug} article={a} context={context} headingLevel={2} />
        ))}
      </div>
    </section>
  )
}

function UpdatesPanel({ context }: { context: LearnContext }) {
  return (
    <section className="space-y-4">
      <PanelIntro>News and company announcements, kept apart from guides. Updates are not clinical guidance.</PanelIntro>
      <div className="divide-y divide-border border-y border-border">
        {UPDATES.map((a) => (
          <ArticleRow key={a.slug} article={a} context={context} headingLevel={2} />
        ))}
      </div>
      <p className="max-w-reading pt-2 text-body-md text-muted">
        Research updates and personal stories will appear here after editorial review. There are none in this preview.
      </p>
    </section>
  )
}

function AskPanel({ context }: { context: LearnContext }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div className="max-w-reading space-y-4">
        <NeuroLearnMark />
        <h2 className="text-heading-md text-ink">Your guide to understanding brain care</h2>
        <p className="text-body-lg text-ink">
          NeuroLearn explains terms, appointments and tests in plain language, with sources you can check.
        </p>
        <p className="text-body-lg text-muted">NeuroLearn provides education, not a diagnosis or treatment plan.</p>
        <div className="pt-2">
          <Button to={neurolearnPath(context)} iconRight={<ArrowRight className="size-5" />}>
            Ask NeuroLearn
          </Button>
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="text-label text-ink">Start with a question</h3>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
          {STARTERS.map((q) => (
            <li key={q}>
              <Link
                to={neurolearnPath(context, q)}
                className="group flex min-h-14 items-center gap-3 px-4 py-3 text-body-md text-ink transition-colors duration-150 hover:bg-canvas"
              >
                <MessageCircleQuestion aria-hidden="true" className="size-5 shrink-0 text-muted" strokeWidth={1.75} />
                <span className="min-w-0 flex-1">{q}</span>
                <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SavedPanel({ context }: { context: LearnContext }) {
  const { state, set } = useDemo()
  const { saved, remove } = useSavedArticles()
  const [status, setStatus] = useState('')
  const savedArticles = saved.map((slug) => articleBySlug(slug)).filter((a) => a !== undefined)

  const removeQuestion = (q: string) => {
    set((s) => ({ ...s, questions: s.questions.filter((x) => x !== q) }))
    setStatus('Question removed.')
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <section className="min-w-0 space-y-4" aria-labelledby="saved-questions">
        <div className="space-y-1">
          <h2 id="saved-questions" className="text-heading-md text-ink">
            Questions for your clinician
          </h2>
          <p className="text-body-md text-muted">Saved in this browser tab. Bring them to the visit.</p>
        </div>
        {state.questions.length ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {state.questions.map((q) => (
              <li key={q} className="flex items-start gap-3 py-3 pr-2 pl-4">
                <MessageCircleQuestion aria-hidden="true" className="mt-3 size-5 shrink-0 text-muted" strokeWidth={1.75} />
                <p className="min-w-0 flex-1 py-2.5 text-body-md text-ink">{q}</p>
                <button
                  type="button"
                  onClick={() => removeQuestion(q)}
                  className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-md px-3 text-body-md font-medium text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink"
                >
                  <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Remove<span className="sr-only">: {q}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<MessageCircleQuestion strokeWidth={1.75} />}
            title="No saved questions yet"
            action={
              <Button to={neurolearnPath(context)} variant="secondary">
                Ask NeuroLearn
              </Button>
            }
          >
            When NeuroLearn can’t answer something, save it here to ask your clinician.
          </EmptyState>
        )}
        {context === 'app' && state.questions.length ? (
          <p className="text-body-md text-muted">
            These also appear in your <TextLink to="/app/care/visit#questions">visit preparation</TextLink>.
          </p>
        ) : null}
        <InlineStatus>{status}</InlineStatus>
      </section>

      <section className="min-w-0 space-y-4" aria-labelledby="saved-articles">
        <div className="space-y-1">
          <h2 id="saved-articles" className="text-heading-md text-ink">
            Saved guides and articles
          </h2>
          <p className="text-body-md text-muted">Saved in this browser tab only.</p>
        </div>
        {savedArticles.length ? (
          <div className="divide-y divide-border border-y border-border">
            {savedArticles.map((a) => (
              <div key={a.slug} className="relative">
                <ArticleRow article={a} context={context} showDescription={false} headingLevel={3} compact />
                <button
                  type="button"
                  onClick={() => {
                    remove(a.slug)
                    setStatus('Removed from saved.')
                  }}
                  className="relative z-10 -mt-3 mb-4 inline-flex min-h-12 items-center gap-1.5 rounded-md px-1 text-body-md font-medium text-muted hover:text-ink"
                >
                  <Trash2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Remove<span className="sr-only">: {a.title}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={<Bookmark strokeWidth={1.75} />} title="No saved guides yet">
            Use “Save article” on any guide to keep it here while this tab is open.
          </EmptyState>
        )}
      </section>
    </div>
  )
}

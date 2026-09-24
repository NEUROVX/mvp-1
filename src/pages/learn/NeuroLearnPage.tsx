import { ArrowRight, Eraser, Flag, MessageCircleQuestion, OctagonAlert, Phone, Send } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button, Callout, Disclosure, InlineStatus, TextField, TextLink } from '@/components/ui'
import { useDemo, usePeople } from '@/demo/store'
import { articleBySlug } from '@/features/learn/articles'
import { LearnFrame, LearnHeader, NeuroLearnMark, SourceList } from '@/features/learn/components'
import { respond, STARTERS, type NeuroLearnResponse } from '@/features/learn/neurolearn'
import { articlePath, learnViewPath, type LearnContext } from '@/features/learn/paths'
import { ReportConcernDialog } from '@/features/learn/ReportConcernDialog'
import { useSessionState } from '@/features/learn/storage'
import { usePageTitle } from '@/lib/hooks'

interface Exchange {
  id: string
  question: string
}

type SaveState = 'saved' | 'already'

export default function NeuroLearnPage({ context }: { context: LearnContext }) {
  usePageTitle('Ask NeuroLearn')
  const { possessive } = usePeople()
  const { state, set } = useDemo()
  const [params, setParams] = useSearchParams()
  const [exchanges, setExchanges] = useSessionState<Exchange[]>(`nvx-neurolearn-${context}`, [])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [announce, setAnnounce] = useState('')
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({})
  const [concernFor, setConcernFor] = useState<Exchange | null>(null)
  const focusId = useRef<string | null>(null)
  const handledQuery = useRef<string | null>(null)
  const focusInput = () => document.getElementById('neurolearn-question')?.focus()

  const ask = (raw: string) => {
    const question = raw.trim()
    if (!question) {
      setError('Type a question, or choose one of the suggested questions.')
      focusInput()
      return
    }
    const ex: Exchange = { id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, question }
    focusId.current = ex.id
    setExchanges((list) => [...list, ex])
    setDraft('')
    setError('')
    const r = respond(question)
    setAnnounce(
      r.kind === 'urgent'
        ? 'NeuroLearn showed an urgent safety message.'
        : r.kind === 'fallback'
          ? 'NeuroLearn does not have a reviewed answer for that yet.'
          : 'NeuroLearn answered your question.',
    )
  }

  // ?q= prefill: only ever from a link the person chose. Answer once, then tidy the URL.
  const q = params.get('q')
  useEffect(() => {
    if (!q || handledQuery.current === q) return
    handledQuery.current = q
    ask(q)
    const next = new URLSearchParams(params)
    next.delete('q')
    setParams(next, { replace: true, preventScrollReset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  // Move focus to a new answer after an explicit action, so it is read next.
  useEffect(() => {
    if (!focusId.current) return
    const el = document.getElementById(`answer-${focusId.current}`)
    focusId.current = null
    if (el) {
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }
  }, [exchanges])

  const saveQuestion = (ex: Exchange, text: string) => {
    const already = state.questions.includes(text)
    if (!already) set((s) => ({ ...s, questions: [...s.questions, text] }))
    setSaveState((m) => ({ ...m, [ex.id]: already ? 'already' : 'saved' }))
  }

  const clearChat = () => {
    setExchanges([])
    setSaveState({})
    setAnnounce('Chat cleared.')
    focusInput()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(draft)
  }

  const asked = new Set(exchanges.map((e) => e.question))
  const starters = STARTERS.filter((s) => !asked.has(s))

  const privacy =
    context === 'app'
      ? `This conversation stays in this browser tab and is cleared when you close it. NeuroLearn cannot see ${possessive} records.`
      : 'This conversation stays in this browser tab and is cleared when you close it. NeuroLearn cannot see anyone’s health records.'

  return (
    <LearnFrame context={context}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,42.5rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <div className="min-w-0">
          <LearnHeader
            context={context}
            eyebrow={<NeuroLearnMark />}
            title="What would you like to understand?"
            lede="NeuroLearn explains brain-care topics. It does not diagnose or prescribe."
          />

          <Callout tone="info" title="NeuroLearn provides education, not a diagnosis or treatment plan." className="mt-6">
            <p>In this preview, answers are pre-written and reviewed for wording only - they are not generated.</p>
          </Callout>

          {exchanges.length ? (
            <section aria-labelledby="conversation-heading" className="mt-10">
              <h2 id="conversation-heading" className="sr-only">
                Conversation
              </h2>
              <ol className="space-y-10">
                {exchanges.map((ex) => (
                  <ExchangeItem
                    key={ex.id}
                    ex={ex}
                    context={context}
                    response={respond(ex.question)}
                    saveState={saveState[ex.id]}
                    onSave={(text) => saveQuestion(ex, text)}
                    onReport={() => setConcernFor(ex)}
                  />
                ))}
              </ol>
            </section>
          ) : null}

          {starters.length ? (
          <section aria-labelledby="suggested-heading" className="mt-10">
            <h2 id="suggested-heading" className="text-label text-ink">
              {exchanges.length ? 'Other questions you could ask' : 'Suggested questions'}
            </h2>
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
              {starters.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => ask(s)}
                    className="group flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-body-md text-ink transition-colors duration-150 hover:bg-canvas"
                  >
                    <MessageCircleQuestion aria-hidden="true" className="size-5 shrink-0 text-muted" strokeWidth={1.75} />
                    <span className="min-w-0 flex-1">{s}</span>
                    <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          ) : null}

          <form onSubmit={onSubmit} noValidate className="mt-8" aria-label="Ask NeuroLearn">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <TextField
                  id="neurolearn-question"
                  label="Ask a question"
                  value={draft}
                  error={error || undefined}
                  autoComplete="off"
                  onChange={(e) => {
                    setDraft(e.target.value)
                    if (error) setError('')
                  }}
                />
              </div>
              <Button type="submit" iconRight={<Send className="size-5" />} className="shrink-0 sm:mt-[calc(1.4rem+6px)]">
                Send
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-reading text-body-md text-muted">{privacy}</p>
            {exchanges.length ? (
              <Button variant="quiet" onClick={clearChat} iconLeft={<Eraser className="size-5" />} className="shrink-0 self-start">
                Clear chat
              </Button>
            ) : null}
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {announce}
          </p>
        </div>

        <aside aria-labelledby="how-heading" className="min-w-0 lg:pt-2">
          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 id="how-heading" className="text-heading-sm text-ink">
              How NeuroLearn works
            </h2>
            <dl className="mt-4 space-y-4 text-body-md">
              <div>
                <dt className="font-semibold text-ink">Education only</dt>
                <dd className="text-muted">
                  It explains general topics. It can’t diagnose, prescribe, change medicines or say which test someone needs.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Pre-written in this preview</dt>
                <dd className="text-muted">Answers are written in advance. Nothing is generated.</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Sources you can check</dt>
                <dd className="text-muted">Answers list their sources and the date they were checked, or say when there is none.</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Questions for your clinician</dt>
                <dd className="text-muted">
                  Save anything you want to ask. It stays in your{' '}
                  <TextLink to={learnViewPath(context, 'saved')}>saved questions</TextLink>.
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-border pt-4 text-body-md text-ink">
              <span className="font-semibold">Urgent concern?</span> Call 112 or read{' '}
              <TextLink to="/urgent">urgent help guidance</TextLink>.
            </p>
          </div>
        </aside>
      </div>

      <ReportConcernDialog open={concernFor !== null} onClose={() => setConcernFor(null)} question={concernFor?.question} />
    </LearnFrame>
  )
}

function ExchangeItem({
  ex,
  context,
  response,
  saveState,
  onSave,
  onReport,
}: {
  ex: Exchange
  context: LearnContext
  response: NeuroLearnResponse
  saveState?: SaveState
  onSave: (text: string) => void
  onReport: () => void
}) {
  return (
    <li className="space-y-4">
      <div className="ml-auto max-w-[36rem] rounded-lg bg-accent-soft px-5 py-4 sm:w-fit">
        <p className="text-label text-primary-hover">You asked</p>
        <p className="mt-1 text-body-lg text-ink">{ex.question}</p>
      </div>

      <div id={`answer-${ex.id}`} tabIndex={-1} className="scroll-mt-28 focus-visible:outline-offset-4">
        {response.kind === 'urgent' ? (
          <UrgentPanel />
        ) : (
          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
            <NeuroLearnMark />
            {response.kind === 'answer' ? (
              <AnswerBody
                context={context}
                answer={response.answer}
                saveText={response.answer.suggestedQuestion ?? ex.question}
                saveState={saveState}
                onSave={onSave}
                onReport={onReport}
              />
            ) : (
              <FallbackBody context={context} saveText={ex.question} saveState={saveState} onSave={onSave} onReport={onReport} />
            )}
          </div>
        )}
      </div>
    </li>
  )
}

function AnswerBody({
  context,
  answer,
  saveText,
  saveState,
  onSave,
  onReport,
}: {
  context: LearnContext
  answer: Extract<NeuroLearnResponse, { kind: 'answer' }>['answer']
  saveText: string
  saveState?: SaveState
  onSave: (text: string) => void
  onReport: () => void
}) {
  const related = articleBySlug(answer.articleSlug)
  return (
    <>
      <p className="mt-3 text-body-lg text-ink">{answer.short}</p>
      <Disclosure summary="More detail" className="mt-5">
        <div className="space-y-3">
          {answer.detail.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </div>
      </Disclosure>
      <SourceList ids={answer.sources} note={answer.sourcesNote} className="mt-5" />
      {related ? (
        <p className="mt-4 text-body-md text-ink">
          Read more: <TextLink to={articlePath(context, related.slug)}>{related.title}</TextLink>
        </p>
      ) : null}
      {answer.suggestedQuestion ? (
        <p className="mt-5 rounded-md bg-canvas px-4 py-3 text-body-md text-ink">
          A question you could save: <span className="font-semibold">“{answer.suggestedQuestion}”</span>
        </p>
      ) : null}
      <AnswerActions context={context} saveText={saveText} saveState={saveState} onSave={onSave} onReport={onReport} />
    </>
  )
}

function FallbackBody({
  context,
  saveText,
  saveState,
  onSave,
  onReport,
}: {
  context: LearnContext
  saveText: string
  saveState?: SaveState
  onSave: (text: string) => void
  onReport: () => void
}) {
  return (
    <>
      <p className="mt-3 text-body-lg text-ink">I don’t have a reviewed answer for that yet.</p>
      <p className="mt-2 text-body-md text-muted">
        Rather than guess, NeuroLearn only gives answers that have been prepared in advance. A clinician can help with this
        question. You can save it to ask at the visit.
      </p>
      <p className="mt-3 text-body-md">
        <TextLink to={context === 'app' ? '/app/care/find-clinician' : '/start?next=find-clinician'}>Find a clinician</TextLink>
      </p>
      <AnswerActions context={context} saveText={saveText} saveState={saveState} onSave={onSave} onReport={onReport} />
    </>
  )
}

function AnswerActions({
  context,
  saveText,
  saveState,
  onSave,
  onReport,
}: {
  context: LearnContext
  saveText: string
  saveState?: SaveState
  onSave: (text: string) => void
  onReport: () => void
}) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
        <Button variant="secondary" onClick={() => onSave(saveText)} disabled={saveState !== undefined}>
          {saveState ? (
            'Question saved'
          ) : (
            <>
              {/* Very narrow screens: a shorter label so the button never wraps. */}
              <span className="min-[22.5rem]:hidden">Save for my clinician</span>
              <span className="hidden min-[22.5rem]:inline">Save a question for my clinician</span>
            </>
          )}
        </Button>
        <Button variant="quiet" onClick={onReport} iconLeft={<Flag className="size-4" />} className="self-start sm:self-auto">
          Report a concern
        </Button>
      </div>
      <InlineStatus>
        {saveState === 'saved' ? (
          <>
            Saved to your questions. <Link className="prose-link" to={learnViewPath(context, 'saved')}>View saved questions</Link>
          </>
        ) : saveState === 'already' ? (
          'This question is already in your saved questions.'
        ) : null}
      </InlineStatus>
    </div>
  )
}

/** Urgent language leaves ordinary chat (DESIGN.md › NeuroLearn). Placeholder wording until clinician-authored. */
function UrgentPanel() {
  return (
    <div role="alert" className="rounded-lg border border-error bg-error-surface p-5 sm:p-6">
      <div className="flex gap-3">
        <OctagonAlert aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-error" strokeWidth={2} />
        <div className="min-w-0 space-y-3">
          <h3 className="text-heading-sm text-ink">This may need urgent help</h3>
          <p className="text-body-lg text-ink">
            If someone has sudden weakness, numbness, trouble speaking, a seizure, has collapsed, or may harm themselves,
            call 112 now. Do not wait for an appointment or for NeuroLearn.
          </p>
          <p className="text-body-md text-muted">
            Safety wording placeholder. A clinician-authored message will replace it before any real use.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <Button href="tel:112" iconLeft={<Phone className="size-5" />}>
              Call 112
            </Button>
            <Button to="/urgent" variant="secondary">
              Urgent help guidance
            </Button>
          </div>
          <SourceList ids={['nhs-stroke']} heading="Source" className="pt-2" />
        </div>
      </div>
    </div>
  )
}


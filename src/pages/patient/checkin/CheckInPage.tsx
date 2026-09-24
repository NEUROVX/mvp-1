import { ChevronLeft, Info, UsersRound } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  CheckboxGroup,
  Disclosure,
  ErrorSummary,
  FlowProgress,
  InlineStatus,
  RadioGroup,
  SourceLabel,
  StatusBadge,
  TextArea,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { CONCERN_LABELS, EPISODE_DATES, ONSET_LABELS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { CareContext, CheckInState, ConcernKey, OnsetKey, YesNoUnsure } from '@/demo/types'
import {
  CARE_CONTEXT_LABELS,
  concernChosen,
  normalizeSupport,
  resumeView,
  SUPPORT_OPTIONS,
  type CheckInView,
} from '@/features/intake/options'
import { AnswerList, checkInRows } from '@/features/intake/summaries'
import { ActionRow, Panel, PanelHeading, TaskLede, TaskTitle, UrgentHelpLine, useFocusOnChange } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

const VIEWS: CheckInView[] = ['1', '2', '3', '4', 'review', 'saved']
const STEP_LABELS: Record<'1' | '2' | '3' | '4', string> = {
  '1': 'Care context',
  '2': 'What has changed',
  '3': 'Timing and safety',
  '4': 'Patient context',
}
const CONCERN_ORDER: ConcernKey[] = ['memory', 'attention', 'finding-words', 'everyday-tasks', 'behaviour', 'other', 'none']
const ONSET_ORDER: OnsetKey[] = ['days', 'weeks-months', 'over-a-year', 'not-sure']
const YES_NO: Array<{ value: YesNoUnsure; label: string }> = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-sure', label: 'Not sure' },
]

type Errors = Partial<Record<'context' | 'concerns' | 'onset' | 'daily' | 'sudden' | 'support', string>>

/**
 * P02 care check-in (PATIENT.md › Progressive intake; PATIENT-ONE-STEP § 1).
 * Four short steps in one route (`?step=`), so each step can be linked to and
 * browser Back works. Answers are kept in this browser tab as they change, so
 * a person can leave and resume at the first unanswered step.
 */
export default function CheckInPage() {
  usePageTitle('Care check-in')
  const { state, set, jumpTo } = useDemo()
  const people = usePeople()
  const { name, possessive, you, your, persona } = people
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const isSaved = state.checkIn.status === 'saved'
  const [draft, setDraft] = useState<CheckInState>(() => {
    const support = normalizeSupport(state.checkIn.hearingVisionSupport)
    return support.length ? { ...state.checkIn, hearingVisionSupport: support } : state.checkIn
  })
  const [errors, setErrors] = useState<Errors>({})
  const [justSaved, setJustSaved] = useState(false)
  const urgentRef = useRef<HTMLDivElement>(null)

  const param = params.get('step') as CheckInView | null
  let view: CheckInView = param && VIEWS.includes(param) ? param : resumeView(state.checkIn)
  if (view === 'saved' && state.checkIn.status !== 'saved') view = 'review'
  const titleRef = useFocusOnChange<HTMLHeadingElement>(view)

  // Give the resume point a URL of its own, without adding a history entry.
  useEffect(() => {
    if (!param || !VIEWS.includes(param)) setParams({ step: view }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const go = (v: CheckInView) => {
    setErrors({})
    setParams({ step: v })
  }

  /** Keep the draft; while not yet saved, also keep answers in the store (resume). */
  const update = (patch: Partial<CheckInState>) => {
    setDraft((d) => ({ ...d, ...patch }))
    // A saved check-in is edited as a draft and only changes on "Save check-in".
    set((s) =>
      s.checkIn.status === 'saved'
        ? s
        : {
            ...s,
            stage: s.stage === 'new' ? 'intake-saved' : s.stage,
            checkIn: { ...s.checkIn, ...patch, status: 'in-progress' },
          },
    )
  }

  const fail = (e: Errors) => {
    setErrors(e)
    requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
  }

  const progressStatus =
    state.checkIn.status === 'in-progress' ? <InlineStatus>Progress saved in this browser tab</InlineStatus> : null

  const errorList = (Object.keys(errors) as Array<keyof Errors>)
    .filter((k) => errors[k])
    .map((k) => ({ field: k, message: errors[k] as string }))

  const backButton = (to: CheckInView) => (
    <Button variant="quiet" onClick={() => go(to)} iconLeft={<ChevronLeft className="size-5" />}>
      Back
    </Button>
  )

  /* ---------------- Step 1: care context ---------------- */
  if (view === '1') {
    const ctx = draft.careContext
    return (
      <StepFrame step="1" title="What brings you here?" lede="Choose the one that fits best." titleRef={titleRef} errors={errorList}>
        {persona !== 'patient' ? (
          <p className="flex max-w-reading items-start gap-3 text-body-md text-ink">
            <UsersRound aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
            <span>
              Answer with {name} if you can. Your own observations have a separate step, so they stay labelled as yours.
            </span>
          </p>
        ) : null}
        <Panel className="space-y-6">
          <div id="context">
            <RadioGroup<CareContext>
              name="care-context"
              legend={<span className="sr-only">What brings you here?</span>}
              value={ctx}
              error={errors.context}
              onChange={(v) => update({ careContext: v })}
              options={[
                {
                  value: 'new-concern',
                  label: CARE_CONTEXT_LABELS['new-concern'],
                  description: 'Something has changed in memory or thinking.',
                },
                {
                  value: 'existing-care',
                  label: CARE_CONTEXT_LABELS['existing-care'],
                  description: 'There is already a clinician, a plan or a diagnosis.',
                },
                {
                  value: 'prescribed-test',
                  label: CARE_CONTEXT_LABELS['prescribed-test'],
                  description: 'A clinician has given you a test order.',
                },
              ]}
            />
          </div>
          {ctx === 'existing-care' ? (
            <Callout tone="info" title="You don’t need to repeat first-time questions">
              <p>Your records, current plan and next visit stay together. You can add past reports at any time.</p>
            </Callout>
          ) : null}
          {ctx === 'prescribed-test' ? (
            <Callout tone="info" title="Upload the order so it can be checked">
              <p>Add a photo or PDF of the test order. It is checked for the right person and service before any booking.</p>
            </Callout>
          ) : null}
        </Panel>
        <ActionRow status={progressStatus}>
          {ctx === 'existing-care' ? (
            <Button
              size="lg"
              onClick={() => {
                jumpTo('existing-care')
                navigate('/app')
              }}
            >
              {persona === 'patient' ? 'Continue to your care' : `Continue to ${possessive} care`}
            </Button>
          ) : ctx === 'prescribed-test' ? (
            <Button size="lg" to="/app/care/reports-upload?type=order">
              Upload your test order
            </Button>
          ) : (
            <Button size="lg" onClick={() => (ctx ? go('2') : fail({ context: 'Choose what brings you here' }))}>
              Continue
            </Button>
          )}
        </ActionRow>
      </StepFrame>
    )
  }

  /* ---------------- Step 2: what has changed ---------------- */
  if (view === '2') {
    const chosen = concernChosen(draft)
    const none = draft.concerns.includes('none')
    const next = () => {
      const e: Errors = {}
      if (!draft.concerns.length) e.concerns = 'Choose at least one change, or No particular concern'
      if (chosen && !draft.onset) e.onset = 'Choose when the change was first noticed'
      if (chosen && !draft.dailyTasks) e.daily = 'Say whether everyday tasks are harder than before'
      if (Object.keys(e).length) return fail(e)
      go(chosen ? '3' : '4')
    }
    return (
      <StepFrame
        step="2"
        title="What has changed?"
        lede="Describe what you have noticed in everyday life. There are no right or wrong answers."
        titleRef={titleRef}
        errors={errorList}
      >
        <Panel className="space-y-8">
          <div id="concerns">
            <CheckboxGroup<ConcernKey>
              name="concerns"
              legend={<span className="sr-only">What has changed?</span>}
              hint="Choose all that apply."
              value={draft.concerns}
              error={errors.concerns}
              onChange={(v) => update({ concerns: v })}
              columns={2}
              options={CONCERN_ORDER.map((k) => ({ value: k, label: CONCERN_LABELS[k], exclusive: k === 'none' }))}
            />
          </div>

          {none ? (
            <Callout tone="info" title="You can still talk to a clinician" action={<ArrowLink to="/app/care/find-clinician">Find a clinician</ArrowLink>}>
              <p>If you have questions about memory or thinking, a clinician can help. Nothing here labels anyone’s health.</p>
            </Callout>
          ) : null}

          {chosen ? (
            <>
              <div id="onset" className="border-t border-border pt-8">
                <RadioGroup<OnsetKey>
                  name="onset"
                  legend="When did you first notice it?"
                  value={draft.onset}
                  error={errors.onset}
                  onChange={(v) => update({ onset: v })}
                  columns={2}
                  options={ONSET_ORDER.map((k) => ({ value: k, label: ONSET_LABELS[k] }))}
                />
              </div>

              <div id="daily" className="space-y-3 border-t border-border pt-8">
                <RadioGroup<YesNoUnsure>
                  name="daily-tasks"
                  legend="Are everyday tasks harder than before?"
                  hint={`Think about change, not tasks ${you} never did.`}
                  value={draft.dailyTasks}
                  error={errors.daily}
                  onChange={(v) => update({ dailyTasks: v })}
                  columns={3}
                  options={YES_NO}
                />
                <Disclosure summary="Examples">
                  Managing medicines, handling money, or finding the way on familiar journeys. Ask whether these have
                  become harder, not whether they were ever done.
                </Disclosure>
              </div>

              <div className="border-t border-border pt-8">
                <TextArea
                  label={`In ${your} own words`}
                  optional
                  hint="A sentence or two is enough."
                  value={draft.ownWords ?? ''}
                  onChange={(e) => update({ ownWords: e.target.value })}
                />
              </div>
            </>
          ) : null}
        </Panel>
        <ActionRow status={progressStatus}>
          <Button size="lg" onClick={next}>
            Continue
          </Button>
          {backButton('1')}
        </ActionRow>
      </StepFrame>
    )
  }

  /* ---------------- Step 3: timing and safety ---------------- */
  if (view === '3') {
    const sudden = draft.suddenChange
    const choose = (v: YesNoUnsure) => {
      update({ suddenChange: v })
      if (v === 'yes') requestAnimationFrame(() => urgentRef.current?.scrollIntoView({ block: 'nearest' }))
    }
    return (
      <StepFrame
        step="3"
        title="Did the change happen suddenly?"
        lede="Sudden means within hours or a day."
        titleRef={titleRef}
        errors={errorList}
        above={
          sudden === 'yes' ? (
            <div ref={urgentRef}>
              <Callout
                tone="error"
                role="alert"
                title="A sudden change needs urgent care"
                action={
                  <Button to="/urgent" size="lg">
                    Get urgent help
                  </Button>
                }
              >
                <p>Sudden confusion, weakness or difficulty speaking needs medical help now, not a routine appointment.</p>
              </Callout>
            </div>
          ) : null
        }
      >
        <Panel className="space-y-6">
          <div id="sudden">
            <RadioGroup<YesNoUnsure>
              name="sudden"
              legend={<span className="sr-only">Did the change happen suddenly, within hours or a day?</span>}
              value={sudden}
              error={errors.sudden}
              onChange={choose}
              options={[
                { value: 'yes', label: 'Yes', description: 'It came on within hours or a day.' },
                { value: 'no', label: 'No', description: 'It came on gradually.' },
                { value: 'not-sure', label: 'Not sure' },
              ]}
            />
          </div>
          {sudden === 'not-sure' ? (
            <Callout tone="warning" title="If you are unsure, it is safer to check" action={<ArrowLink to="/urgent">Get urgent help</ArrowLink>}>
              <p>If the change came on quickly or is getting worse, get urgent help. Otherwise you can continue.</p>
            </Callout>
          ) : null}
          <p className="flex items-start gap-2.5 text-body-md text-muted">
            <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            This question does not rule out an emergency.
          </p>
        </Panel>
        <ActionRow status={sudden === 'yes' ? null : progressStatus}>
          {sudden === 'yes' ? (
            <Button variant="quiet" onClick={() => update({ suddenChange: 'no' })}>
              <span className="sm:hidden">Not sudden - change my answer</span>
              <span className="hidden sm:inline">The change was not sudden - change my answer</span>
            </Button>
          ) : (
            <Button size="lg" onClick={() => (sudden ? go('4') : fail({ sudden: 'Choose Yes, No or Not sure' }))}>
              Continue
            </Button>
          )}
          {backButton('2')}
        </ActionRow>
      </StepFrame>
    )
  }

  /* ---------------- Step 4: patient context ---------------- */
  if (view === '4') {
    const later = ['Medicines', 'Health conditions', 'Family history']
    return (
      <StepFrame
        step="4"
        title="What should the clinician know?"
        lede="A little context helps the clinician plan the visit."
        titleRef={titleRef}
        errors={errorList}
      >
        <Panel className="space-y-8">
          <div id="support">
            <CheckboxGroup<string>
              name="support"
              legend={`Would ${you} need help seeing, hearing or using the screen?`}
              hint="Choose all that apply. These are never counted as memory or thinking difficulties."
              value={draft.hearingVisionSupport}
              error={errors.support}
              onChange={(v) => update({ hearingVisionSupport: v })}
              columns={2}
              options={SUPPORT_OPTIONS.map((o) => ({ value: o, label: o, exclusive: o === 'No' }))}
            />
          </div>
          <section aria-labelledby="add-later" className="space-y-3 border-t border-border pt-8">
            <h2 id="add-later" className="text-label text-ink">
              You can add these before the visit
            </h2>
            <p className="text-body-md text-muted">No need to answer now. They can go in the visit packet later.</p>
            <ul className="divide-y divide-border border-y border-border">
              {later.map((item) => (
                <li key={item} className="flex min-h-12 items-center justify-between gap-4 py-2 text-body-md text-ink">
                  {item}
                  <StatusBadge tone="neutral">Add later</StatusBadge>
                </li>
              ))}
            </ul>
          </section>
        </Panel>
        <ActionRow status={progressStatus}>
          <Button
            size="lg"
            onClick={() =>
              draft.hearingVisionSupport.length ? go('review') : fail({ support: 'Choose at least one option, or No' })
            }
          >
            Continue
          </Button>
          {backButton(concernChosen(draft) ? '3' : '2')}
        </ActionRow>
      </StepFrame>
    )
  }

  /* ---------------- Review ---------------- */
  if (view === 'review') {
    const save = () => {
      set((s) => ({
        ...s,
        stage: hasReached(s.stage, 'assessment-ready') ? s.stage : 'assessment-ready',
        checkIn: { ...draft, status: 'saved', savedAt: EPISODE_DATES.checkIn },
      }))
      setJustSaved(true)
      go('saved')
    }
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <TaskTitle ref={titleRef}>Check your answers</TaskTitle>
          <TaskLede>
            {isSaved
              ? `Saved on ${state.checkIn.savedAt ?? EPISODE_DATES.checkIn}. Change anything, then save again.`
              : 'Saving keeps these answers together for the clinician. You can still change them before the visit.'}
          </TaskLede>
        </div>
        <Panel className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <PanelHeading>What {persona === 'patient' ? 'you' : `${name} and you`} shared</PanelHeading>
            <SourceLabel kind="patient" name={people.fullName} />
          </div>
          <AnswerList
            rows={checkInRows(draft, { your })}
            action={(r) =>
              r.step ? (
                <Button variant="quiet" onClick={() => go(r.step as CheckInView)}>
                  Change<span className="sr-only"> {typeof r.term === 'string' ? r.term.toLowerCase() : 'answer'}</span>
                </Button>
              ) : null
            }
          />
        </Panel>
        <ActionRow>
          <Button size="lg" onClick={save}>
            Save check-in
          </Button>
          {backButton('4')}
        </ActionRow>
        <UrgentHelpLine className="border-t border-border pt-6" />
      </div>
    )
  }

  /* ---------------- Saved ---------------- */
  const helper = persona !== 'patient'
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {justSaved ? (
          <InlineStatus>Saved in this browser tab</InlineStatus>
        ) : (
          <p className="text-body-md text-muted">Saved on {state.checkIn.savedAt ?? EPISODE_DATES.checkIn}</p>
        )}
        <TaskTitle ref={titleRef}>Check-in saved</TaskTitle>
        <TaskLede>
          {helper ? `${possessive} answers are` : 'Your answers are'} saved as patient reported. You can change them before
          the visit.
        </TaskLede>
      </div>
      <section aria-labelledby="next-heading" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
        <p className="text-label text-primary">Your next step</p>
        <h2 id="next-heading" className="mt-2 text-heading-md text-ink">
          {helper ? 'Add your own observations' : 'Read about the assessment'}
        </h2>
        <p className="mt-2 max-w-reading text-body-lg text-ink">
          {helper
            ? `What you notice day to day is saved as a separate record, labelled as yours. It never replaces ${possessive} own answers.`
            : 'See what to expect before you start. You can book a clinician first if you prefer.'}
        </p>
        <ActionRow className="mt-6">
          {helper ? (
            <Button size="lg" to="/app/care/observations">
              Add your own observations
            </Button>
          ) : (
            <Button size="lg" to="/app/care/assessment">
              Review assessment instructions
            </Button>
          )}
          <Button variant="quiet" to="/app">
            Go to Home
          </Button>
        </ActionRow>
      </section>
      <p className="text-body-md text-muted">
        Need to change something?{' '}
        <button type="button" className="prose-link" onClick={() => go('review')}>
          Review your answers
        </button>
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function StepFrame({
  step,
  title,
  lede,
  titleRef,
  errors,
  above,
  children,
}: {
  step: '1' | '2' | '3' | '4'
  title: string
  lede: string
  titleRef: Ref<HTMLHeadingElement>
  errors: Array<{ field: string; message: string }>
  above?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-8">
      {above}
      <div className="space-y-6">
        <FlowProgress step={Number(step)} total={4} label={STEP_LABELS[step]} />
        <div className="space-y-3">
          <TaskTitle ref={titleRef}>{title}</TaskTitle>
          <TaskLede>{lede}</TaskLede>
        </div>
      </div>
      <ErrorSummary errors={errors} />
      {children}
      <UrgentHelpLine className="border-t border-border pt-6" />
    </div>
  )
}

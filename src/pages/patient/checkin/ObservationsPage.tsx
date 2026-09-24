import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Button,
  CheckboxGroup,
  ErrorSummary,
  InlineStatus,
  SelectField,
  SourceLabel,
  TextArea,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { OBSERVATION_ITEMS, OBSERVATION_ONSETS } from '@/features/intake/options'
import { AnswerList, observationRows } from '@/features/intake/summaries'
import { ActionRow, Panel, PanelHeading, TaskLede, TaskTitle, useFocusOnChange } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

const NONE = 'None of these'
type Field = 'items' | 'onset'

/**
 * P06 family observations (PATIENT.md › Assessment experience and respondent handoff).
 * The care partner's own record, labelled as theirs. It never replaces the
 * patient's answers or an assessment.
 */
export default function ObservationsPage() {
  usePageTitle('Your observations')
  const { state, set, setStage } = useDemo()
  const { name, possessive, helper, persona } = usePeople()
  const navigate = useNavigate()
  const helperName = [helper.firstName, helper.lastName].filter(Boolean).join(' ')

  const saved = state.observations.status === 'saved'
  const [editing, setEditing] = useState(!saved)
  const [justSaved, setJustSaved] = useState(false)
  const [items, setItems] = useState<string[]>(state.observations.items)
  const [onset, setOnset] = useState(state.observations.onset ?? '')
  const [notes, setNotes] = useState(state.observations.notes ?? '')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const titleRef = useFocusOnChange<HTMLHeadingElement>(editing)

  if (persona === 'patient') {
    return (
      <div className="space-y-6">
        <TaskTitle>Family observations</TaskTitle>
        <TaskLede>
          This page is for family members who help with your care. What they notice is saved as their own record,
          labelled as theirs. It never replaces your answers.
        </TaskLede>
        <ActionRow>
          <Button size="lg" to="/app">
            Go to Home
          </Button>
        </ActionRow>
      </div>
    )
  }

  const noneChosen = items.includes(NONE)
  const onSave = () => {
    const e: Partial<Record<Field, string>> = {}
    if (!items.length) e.items = `Choose at least one, or ${NONE}`
    if (items.length && !noneChosen && !onset) e.onset = 'Choose when you first noticed these changes'
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
      return
    }
    set((s) => ({
      ...s,
      observations: {
        status: 'saved',
        items,
        onset: noneChosen ? undefined : onset,
        notes: notes.trim() || undefined,
        savedAt: EPISODE_DATES.checkIn,
      },
    }))
    setJustSaved(true)
    setEditing(false)
  }

  const header = (
    <div className="space-y-4">
      <div className="space-y-3">
        <TaskTitle ref={titleRef}>Your observations</TaskTitle>
        <TaskLede>
          What have you noticed day to day? This is saved as a separate record, labelled as yours. It never replaces{' '}
          {possessive} own answers.
        </TaskLede>
      </div>
      <SourceLabel kind="care-partner" name={helperName} />
    </div>
  )

  if (editing) {
    const errorList = (Object.keys(errors) as Field[])
      .filter((k) => errors[k])
      .map((k) => ({ field: k, message: errors[k] as string }))
    return (
      <div className="space-y-8">
        {header}
        <ErrorSummary errors={errorList} />
        <Panel className="space-y-8">
          <div id="items">
            <CheckboxGroup<string>
              name="observations"
              legend={`What have you noticed about ${name}?`}
              hint="Choose all that apply."
              value={items}
              error={errors.items}
              onChange={setItems}
              options={OBSERVATION_ITEMS.map((o) => ({ value: o, label: o, exclusive: o === NONE }))}
            />
          </div>
          {!noneChosen ? (
            <div className="border-t border-border pt-8">
              <SelectField
                id="onset"
                label="When did you first notice?"
                placeholder="Choose one"
                options={OBSERVATION_ONSETS}
                value={onset}
                onChange={(e) => setOnset(e.target.value)}
                error={errors.onset}
              />
            </div>
          ) : null}
          <div className="border-t border-border pt-8">
            <TextArea
              label="Anything else the clinician should know?"
              optional
              hint="For example, a recent change you have taken over, such as paying bills."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Panel>
        <ActionRow>
          <Button size="lg" onClick={onSave}>
            Save observations
          </Button>
          {saved ? (
            <Button
              variant="quiet"
              onClick={() => {
                setItems(state.observations.items)
                setOnset(state.observations.onset ?? '')
                setNotes(state.observations.notes ?? '')
                setErrors({})
                setEditing(false)
              }}
            >
              Cancel changes
            </Button>
          ) : null}
        </ActionRow>
      </div>
    )
  }

  const assessmentDone = state.assessment.status === 'completed' || state.assessment.status === 'interrupted'
  const obs = state.observations

  return (
    <div className="space-y-8">
      {header}
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <PanelHeading>What you shared</PanelHeading>
          {justSaved ? (
            <InlineStatus>Saved in this browser tab</InlineStatus>
          ) : (
            <p className="text-body-md text-muted">Saved on {obs.savedAt ?? EPISODE_DATES.checkIn}</p>
          )}
        </div>
        <AnswerList rows={observationRows(obs)} />
        <Button variant="secondary" onClick={() => setEditing(true)}>
          Change your observations
        </Button>
      </Panel>

      <section aria-labelledby="available-heading" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
        <p className="text-label text-primary">Your next step</p>
        {assessmentDone ? (
          <>
            <h2 id="available-heading" className="mt-2 text-heading-md text-ink">
              Your observations are ready for the clinician
            </h2>
            <p className="mt-2 max-w-reading text-body-lg text-ink">
              They are kept next to {possessive} assessment summary, with their own label.
            </p>
            <ActionRow className="mt-6">
              <Button size="lg" to="/app/care/assessment/summary">
                View the summary
              </Button>
              <Button variant="quiet" to="/app">
                Go to Home
              </Button>
            </ActionRow>
          </>
        ) : (
          <>
            <h2 id="available-heading" className="mt-2 text-heading-md text-ink">
              Is {name} available to do the assessment now?
            </h2>
            <p className="mt-2 max-w-reading text-body-lg text-ink">
              The assessment needs {possessive} own answers. If now is not a good time, you can arrange the visit and
              do it later or with a clinician.
            </p>
            <ActionRow className="mt-6">
              <Button size="lg" to="/app/care/assessment">
                Yes, {name} is here
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  // Only move the episode when it has not already passed this point.
                  if (!hasReached(state.stage, 'assessment-completed')) setStage('family-only')
                  navigate('/app')
                }}
              >
                Not now
              </Button>
            </ActionRow>
          </>
        )}
      </section>
    </div>
  )
}

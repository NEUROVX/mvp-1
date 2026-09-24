import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  Checkbox,
  CheckboxGroup,
  ErrorSummary,
  Initials,
  RadioGroup,
  TextField,
} from '@/components/ui'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { AssessmentState } from '@/demo/types'
import { normalizeSupport, SUPPORT_OPTIONS } from '@/features/intake/options'
import { ActionRow, FactRow, Panel, PanelHeading, TaskLede, TaskTitle, useFocusOnChange } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

type EducationMode = 'years' | 'none' | 'not-sure'
type Reading = NonNullable<AssessmentState['readingComfort']>
type Field = 'education' | 'education-years' | 'reading' | 'support' | 'consent'

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?'
}

/**
 * P04 "Before you begin" (PATIENT.md › Assessment experience and respondent handoff;
 * PATIENT-ONE-STEP § 2). Explains respondent, mode, equipment and assistance,
 * gathers three context questions, and hands the device to the patient.
 * No duration is shown: the selected assessment would set it.
 */
export default function AssessmentIntroPage() {
  usePageTitle('Before you begin')
  const { state, set } = useDemo()
  const { name, possessive, fullName, helper, persona, patient } = usePeople()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const isPatient = persona === 'patient'
  const view = params.get('view') === 'handoff' && !isPatient ? 'handoff' : 'intro'
  const titleRef = useFocusOnChange<HTMLHeadingElement>(view)

  const a = state.assessment
  const fromCheckIn = !a.supportNeeds.length && state.checkIn.hearingVisionSupport.length > 0
  const [eduMode, setEduMode] = useState<EducationMode | undefined>(
    a.education === 'none' || a.education === 'not-sure' ? a.education : a.education ? 'years' : undefined,
  )
  const [years, setYears] = useState(a.education && /^\d+$/.test(a.education) ? a.education : '')
  const [reading, setReading] = useState<Reading | undefined>(a.readingComfort)
  const [support, setSupport] = useState<string[]>(
    normalizeSupport(a.supportNeeds.length ? a.supportNeeds : state.checkIn.hearingVisionSupport),
  )
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})

  const language = patient.language && patient.language !== 'Other' ? patient.language : 'the preferred language'
  const who = isPatient ? 'you' : name
  const whose = isPatient ? 'your' : possessive
  const helperName = [helper.firstName, helper.lastName].filter(Boolean).join(' ')

  const start = () => {
    set((s) => ({ ...s, assessment: { ...s.assessment, status: 'in-progress', section: 1 } }))
    navigate('/app/care/assessment/session')
  }

  const submit = () => {
    const e: Partial<Record<Field, string>> = {}
    if (!eduMode) e.education = 'Choose the years of education, No formal schooling or Not sure'
    else if (eduMode === 'years' && (!/^\d{1,2}$/.test(years) || Number(years) > 30))
      e['education-years'] = 'Enter the number of years, for example 10'
    if (!reading) e.reading = `Say whether ${who} ${isPatient ? 'are' : 'is'} comfortable reading in ${language}`
    if (!support.length) e.support = 'Choose at least one option, or No'
    if (!consent) e.consent = 'Tick the box to confirm you understand this preview'
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
      return
    }
    const education = eduMode === 'years' ? String(Number(years)) : (eduMode as string)
    set((s) => ({ ...s, assessment: { ...s.assessment, education, readingComfort: reading, supportNeeds: support } }))
    if (isPatient) start()
    else setParams({ view: 'handoff' })
  }

  /* ---------------- Handoff to the patient (care partner route) ---------------- */
  if (view === 'handoff') {
    return (
      <div className="space-y-8">
        <Button variant="quiet" onClick={() => setParams({})} iconLeft={<ChevronLeft className="size-5" />}>
          Back to instructions
        </Button>
        <div className="space-y-3">
          <TaskTitle ref={titleRef}>Now it is {possessive} turn</TaskTitle>
          <TaskLede className="text-ink">
            You can help set up the device. Assessment answers must come from {name}, using the instructions for this
            assessment.
          </TaskLede>
        </div>

        <Panel className="space-y-6">
          <PanelHeading>Who does what</PanelHeading>
          <ul className="divide-y divide-border border-y border-border">
            <li className="flex items-center gap-4 py-4">
              <Initials>{initials(helper.firstName, helper.lastName)}</Initials>
              <div className="min-w-0">
                <p className="text-label text-ink">{helperName} (you)</p>
                <p className="text-body-md text-muted">Sets up the device. Does not answer.</p>
              </div>
            </li>
            <li className="flex items-center gap-4 py-4">
              <Initials>{initials(patient.firstName, patient.lastName)}</Initials>
              <div className="min-w-0">
                <p className="text-label text-ink">{fullName}</p>
                <p className="text-body-md text-muted">Gives all the answers.</p>
              </div>
            </li>
          </ul>
          <ActionRow>
            <Button size="lg" onClick={start}>
              {name} is ready - start
            </Button>
            <Button variant="secondary" to="/app">
              {name} is not available
            </Button>
            <Button variant="quiet" to="/app/care/find-clinician">
              We need an assisted visit
            </Button>
          </ActionRow>
        </Panel>
      </div>
    )
  }

  /* ---------------- Intro ---------------- */
  const errorList = (Object.keys(errors) as Field[])
    .filter((k) => errors[k])
    .map((k) => ({ field: k, message: errors[k] as string }))

  const finished = a.status === 'completed' || a.status === 'interrupted'

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <TaskTitle ref={titleRef}>Before you begin</TaskTitle>
        <TaskLede className="text-ink">
          This assessment may help your clinician understand memory and thinking. It does not diagnose a condition on
          its own.
        </TaskLede>
      </div>

      <dl className="border-b border-border">
        <FactRow term="Who answers">
          <p>{isPatient ? 'You' : fullName}</p>
          <p className="text-body-md text-muted">
            {isPatient
              ? 'Someone can help you set up the device. The answers need to come from you.'
              : `You can help set up the device. The answers need to come from ${name}.`}
          </p>
        </FactRow>
        <FactRow term="Assessment">
          <p>Assessment preview - not a clinical test.</p>
          <p className="text-body-md text-muted">
            In a live service, an authorized assessment and version would be chosen for {whose} language, age and
            setting.
          </p>
        </FactRow>
        <FactRow term="Time">Set by the selected assessment</FactRow>
        <FactRow term="You will need">
          <ul className="list-disc space-y-1 pl-5 marker:text-muted">
            <li>A quiet place</li>
            <li>Glasses or a hearing aid, if {isPatient ? 'you use them' : `${name} uses them`}</li>
            <li>This device</li>
          </ul>
        </FactRow>
      </dl>

      {finished ? (
        a.status === 'completed' ? (
          <Callout
            tone="info"
            title={`The assessment preview was completed on ${a.completedAt ?? EPISODE_DATES.assessment}`}
            action={<Button to="/app/care/assessment/summary">View your summary</Button>}
          >
            <p>Assessments are not repeated here to change a result.</p>
          </Callout>
        ) : (
          <Callout
            tone="neutral"
            title="This assessment could not be completed as planned"
            action={<Button to="/app/care/find-clinician">Find a clinician</Button>}
          >
            <p>This is not a result. A clinician can arrange an assisted assessment.</p>
          </Callout>
        )
      ) : (
        <>
          <ErrorSummary errors={errorList} />
          <Panel className="space-y-8">
            <div className="space-y-1">
              <PanelHeading>A few questions first</PanelHeading>
              <p className="text-body-md text-muted">
                These help choose a suitable version. They are not part of any score.
              </p>
            </div>

            <div id="education" className="space-y-4 border-t border-border pt-8">
              <RadioGroup<EducationMode>
                name="education"
                legend="Years of completed education"
                hint="Count school, college and any further study."
                value={eduMode}
                error={errors.education}
                onChange={setEduMode}
                options={[
                  { value: 'years', label: 'Number of years' },
                  { value: 'none', label: 'No formal schooling' },
                  { value: 'not-sure', label: 'Not sure' },
                ]}
              />
              {eduMode === 'years' ? (
                <TextField
                  id="education-years"
                  label="Years completed"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={2}
                  value={years}
                  onChange={(e) => setYears(e.target.value.replace(/[^\d]/g, ''))}
                  error={errors['education-years']}
                  className="sm:w-40"
                />
              ) : null}
            </div>

            <div id="reading" className="border-t border-border pt-8">
              <RadioGroup<Reading>
                name="reading"
                legend={`${isPatient ? 'Are you' : `Is ${name}`} comfortable reading in ${language}?`}
                hint="This asks for a supported version, not a translation."
                value={reading}
                error={errors.reading}
                onChange={setReading}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'spoken', label: 'Prefer spoken instructions' },
                ]}
              />
            </div>

            <div id="support" className="border-t border-border pt-8">
              <CheckboxGroup<string>
                name="support"
                legend={`Would ${who} need help seeing, hearing or using the screen?`}
                hint={
                  fromCheckIn
                    ? 'From the check-in. Change it if needed.'
                    : 'Choose all that apply. These are never counted as memory or thinking difficulties.'
                }
                value={support}
                error={errors.support}
                onChange={setSupport}
                columns={2}
                options={SUPPORT_OPTIONS.map((o) => ({ value: o, label: o, exclusive: o === 'No' }))}
              />
            </div>

            <div id="consent" className="space-y-2 border-t border-border pt-8">
              {errors.consent ? <p className="text-body-md font-medium text-error">{errors.consent}</p> : null}
              <Checkbox
                name="consent"
                checked={consent}
                onChange={setConsent}
                label="I understand this preview produces no score and is not a diagnosis."
              />
            </div>
          </Panel>

          <ActionRow>
            <Button size="lg" onClick={submit}>
              {isPatient ? 'Start assessment' : `Hand over to ${name}`}
            </Button>
          </ActionRow>
        </>
      )}

      <section aria-labelledby="other-ways" className="space-y-2 border-t border-border pt-6">
        <h2 id="other-ways" className="text-label text-ink">
          Prefer another way?
        </h2>
        <div className="flex flex-col items-start gap-x-8 sm:flex-row sm:flex-wrap">
          <ArrowLink to="/app/support#assisted">Arrange an assisted assessment</ArrowLink>
          <ArrowLink to="/app/care/find-clinician">Book a clinician instead</ArrowLink>
        </div>
      </section>
    </div>
  )
}

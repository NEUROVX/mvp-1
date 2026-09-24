import { useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  Button,
  Checkbox,
  DemoTag,
  ErrorSummary,
  FlowProgress,
  RadioGroup,
  SelectField,
  TextField,
} from '@/components/ui'
import { useDemo } from '@/demo/store'
import type { PatientProfile } from '@/demo/types'
import { joinName, LANGUAGES, SEX_OPTIONS, splitName } from '@/features/intake/options'
import { ActionRow, Panel, PanelHeading, TaskLede, TaskTitle, UrgentHelpLine } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

type CareFor = 'myself' | 'family'
type Sex = NonNullable<PatientProfile['sex']>
type Field = 'name' | 'age' | 'language'

/**
 * P01 page 1 — "Who is the care for?" (PATIENT-ONE-STEP § 1, PATIENT.md › Identity and permission).
 * One labelled choice first, then four fields. Names are split on save only;
 * the person types one name. No ID numbers, insurance, location or research.
 */
export default function WhoForPage() {
  usePageTitle('Who is the care for?')
  const { state, set } = useDemo()
  const navigate = useNavigate()
  const { search } = useLocation()

  const [careFor, setCareFor] = useState<CareFor>(state.careFor)
  const [name, setName] = useState(joinName(state.patient))
  const [age, setAge] = useState(state.patient.age ? String(state.patient.age) : '')
  const [approximate, setApproximate] = useState(state.patient.ageApproximate)
  const [sex, setSex] = useState<Sex | undefined>(state.patient.sex)
  const [language, setLanguage] = useState(state.patient.language)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const summaryRef = useRef<HTMLDivElement>(null)

  const myself = careFor === 'myself'

  const validate = () => {
    const e: Partial<Record<Field, string>> = {}
    if (!name.trim()) e.name = myself ? 'Enter your name' : 'Enter the name of the person receiving care'
    const n = Number(age.trim())
    if (!age.trim()) e.age = myself ? 'Enter your age' : 'Enter their age'
    else if (!/^\d{1,3}$/.test(age.trim()) || n < 1 || n > 120) e.age = 'Enter the age in years, as a number from 1 to 120'
    if (!language) e.language = 'Choose a preferred language'
    return e
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => summaryRef.current?.querySelector<HTMLElement>('#error-summary')?.focus())
      return
    }
    const { firstName, lastName } = splitName(name)
    set((s) => ({
      ...s,
      careFor,
      patient: {
        ...s.patient,
        firstName,
        lastName,
        age: Number(age.trim()),
        ageApproximate: approximate,
        sex,
        language,
      },
    }))
    navigate(`/start/access${search}`)
  }

  const errorList = (Object.keys(errors) as Field[])
    .filter((k) => errors[k])
    .map((k) => ({ field: k, message: errors[k] as string }))

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <FlowProgress step={1} total={2} label="Who the care is for" />
        <div className="space-y-3">
          <TaskTitle>Who is the care for?</TaskTitle>
          <TaskLede>Start with a few details. You can add more before a visit.</TaskLede>
        </div>
      </div>

      <div ref={summaryRef}>
        <ErrorSummary errors={errorList} />
      </div>

      <Panel className="space-y-8">
        <RadioGroup<CareFor>
          name="care-for"
          legend={<span className="sr-only">Who is the care for?</span>}
          value={careFor}
          onChange={setCareFor}
          columns={2}
          options={[
            { value: 'myself', label: 'For myself', description: 'The care is for me.' },
            { value: 'family', label: 'Helping a family member', description: 'I help someone I care for.' },
          ]}
        />

        <div className="space-y-6 border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <PanelHeading>{myself ? 'About you' : 'About the person receiving care'}</PanelHeading>
            <DemoTag>Prefilled demo data</DemoTag>
          </div>

          <TextField
            id="name"
            label={myself ? 'Your name' : 'Patient’s name'}
            autoComplete={myself ? 'name' : 'off'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <TextField
              id="age"
              label="Age"
              inputMode="numeric"
              autoComplete="off"
              maxLength={3}
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^\d]/g, ''))}
              error={errors.age}
              className="sm:w-40"
            />
            <div className="sm:mt-[1.775rem] sm:w-fit">
              <Checkbox checked={approximate} onChange={setApproximate} label="This is approximate" name="age-approximate" />
            </div>
          </div>

          <RadioGroup<Sex>
            name="sex"
            legend="Sex"
            optional
            value={sex}
            onChange={setSex}
            columns={2}
            options={SEX_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />

          <SelectField
            id="language"
            label="Preferred language"
            hint="This preview is in English. Available assessment languages may differ from the app language."
            placeholder="Choose a language"
            options={LANGUAGES}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            error={errors.language}
          />
        </div>
      </Panel>

      <ActionRow>
        <Button type="submit" size="lg">
          Continue
        </Button>
      </ActionRow>

      <UrgentHelpLine className="border-t border-border pt-6" />
    </form>
  )
}

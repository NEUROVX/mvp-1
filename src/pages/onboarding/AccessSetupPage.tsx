import { ChevronLeft } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  Button,
  Callout,
  CheckboxGroup,
  DemoTag,
  ErrorSummary,
  FlowProgress,
  RadioGroup,
  SelectField,
  TextField,
} from '@/components/ui'
import { PERMISSION_LABELS } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { PermissionKey, Persona } from '@/demo/types'
import { joinName, RELATIONSHIPS, splitName } from '@/features/intake/options'
import { ActionRow, Panel, PanelHeading, TaskLede, TaskTitle, UrgentHelpLine } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

type Agreement = 'yes' | 'support' | 'not-sure'
type Field = 'helper-name' | 'relationship' | 'contact' | 'permissions' | 'agreement'

const DEFAULT_CONTACT = /\(demo\)$/

/** Turn what was typed into a display line; phone numbers are masked. */
function contactLine(raw: string) {
  const v = raw.trim()
  if (v.includes('@')) return v
  const digits = v.replace(/\D/g, '')
  return `Mobile number ending ${digits.slice(-4)}`
}

function validContact(raw: string) {
  const v = raw.trim()
  if (v.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  return v.replace(/\D/g, '').length >= 7
}

/**
 * P01 page 2 — access, permission and privacy (PATIENT.md › Identity and permission).
 * Family members say who they are, what they want to help with and whether the
 * patient agrees. Relationship alone never grants record access.
 */
export default function AccessSetupPage() {
  usePageTitle('Set up access')
  const { state, set, jumpTo } = useDemo()
  const navigate = useNavigate()
  const { search } = useLocation()
  const next = new URLSearchParams(search).get('next')

  const myself = state.careFor === 'myself'
  const name = state.patient.firstName || 'the patient'
  const possessive = state.patient.firstName ? `${state.patient.firstName}’s` : 'their'

  const [helperName, setHelperName] = useState(joinName(state.helper))
  const [relationship, setRelationship] = useState(state.helper.relationship)
  const [contact, setContact] = useState(() => {
    if (!DEFAULT_CONTACT.test(state.contactMethod) && state.contactMethod.includes('@')) return state.contactMethod
    const first = (myself ? state.patient.firstName : state.helper.firstName) || 'name'
    const last = myself ? state.patient.lastName : state.helper.lastName
    return `${[first, last].filter(Boolean).join('.').toLowerCase()}@example.com`
  })
  const [permissions, setPermissions] = useState<PermissionKey[]>(state.permissions)
  const [agreement, setAgreement] = useState<Agreement | undefined>(state.persona === 'limited-helper' ? 'not-sure' : 'yes')
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const summaryRef = useRef<HTMLDivElement>(null)

  const validate = () => {
    const e: Partial<Record<Field, string>> = {}
    if (!validContact(contact)) e.contact = 'Enter a mobile number or an email address'
    if (!myself) {
      if (!helperName.trim()) e['helper-name'] = 'Enter your name'
      if (!relationship) e.relationship = `Choose how you are related to ${name}`
      if (!permissions.length) e.permissions = 'Choose at least one way you would like to help'
      if (!agreement) e.agreement = `Tell us whether ${name} agrees to you helping`
    }
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
    const persona: Persona = myself ? 'patient' : agreement === 'yes' ? 'care-partner' : 'limited-helper'
    // Load a clean "new" episode first (keeps names and persona), then apply
    // what was entered here so the contact line is not reset by the preset.
    jumpTo('new')
    set((s) => ({
      ...s,
      persona,
      careFor: state.careFor,
      helper: myself ? s.helper : { ...splitName(helperName), relationship },
      permissions: myself ? s.permissions : permissions,
      contactMethod: contactLine(contact),
      onboarded: true,
    }))
    navigate(next === 'find-clinician' ? '/app/care/find-clinician' : '/app')
  }

  const errorList = (Object.keys(errors) as Field[])
    .filter((k) => errors[k])
    .map((k) => ({ field: k, message: errors[k] as string }))

  const privacy = (
    <section aria-labelledby="privacy-heading" className="space-y-3 border-t border-border pt-8">
      <PanelHeading id="privacy-heading">Your care and privacy</PanelHeading>
      <ul className="max-w-reading list-disc space-y-2 pl-5 text-body-md text-ink marker:text-muted">
        <li>We save the details from these two pages and anything you add later, so you do not have to repeat them.</li>
        <li>In this preview, everything stays in this browser tab. Nothing is sent anywhere.</li>
        <li>Research is separate. It is never part of signing up for care.</li>
      </ul>
    </section>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-6">
        <FlowProgress step={2} total={2} label="Access and privacy" />
        <div className="space-y-3">
          <TaskTitle>{myself ? 'How can we reach you?' : `How you will help ${name}`}</TaskTitle>
          <TaskLede>
            {myself
              ? 'One way to reach you is enough. Then you can start your care.'
              : `Tell us about you and what you would like to help with. ${name} stays in charge of their care.`}
          </TaskLede>
        </div>
      </div>

      <div ref={summaryRef}>
        <ErrorSummary errors={errorList} />
      </div>

      <Panel className="space-y-8">
        {myself ? (
          <TextField
            id="contact"
            label="Mobile number or email"
            hint="One way is enough."
            autoComplete="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            error={errors.contact}
          />
        ) : (
          <>
            <section aria-labelledby="about-you" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <PanelHeading id="about-you">About you</PanelHeading>
                <DemoTag>Prefilled demo data</DemoTag>
              </div>
              <TextField
                id="helper-name"
                label="Your name"
                autoComplete="name"
                value={helperName}
                onChange={(e) => setHelperName(e.target.value)}
                error={errors['helper-name']}
              />
              <SelectField
                id="relationship"
                label={`Your relationship to ${name}`}
                placeholder="Choose one"
                options={RELATIONSHIPS}
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                error={errors.relationship}
              />
              <TextField
                id="contact"
                label="How to reach you: mobile number or email"
                hint="One way is enough."
                autoComplete="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                error={errors.contact}
              />
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <div id="permissions">
                <CheckboxGroup<PermissionKey>
                  name="permissions"
                  legend="What would you like to help with?"
                  legendSize="lg"
                  hint="Choose all that apply."
                  value={permissions}
                  onChange={setPermissions}
                  error={errors.permissions}
                  options={(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((k) => ({
                    value: k,
                    label: PERMISSION_LABELS[k].label,
                    description: PERMISSION_LABELS[k].detail,
                  }))}
                />
              </div>
              <p className="max-w-reading text-body-md text-ink">
                Being family does not by itself give access to health records. {name} chooses what you can see.
              </p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <div id="agreement">
                <RadioGroup<Agreement>
                  name="agreement"
                  legend={`Has ${name} agreed to you helping?`}
                  legendSize="lg"
                  value={agreement}
                  onChange={setAgreement}
                  error={errors.agreement}
                  options={[
                    { value: 'yes', label: `Yes, ${name} agrees` },
                    { value: 'support', label: `${name} needs support to decide` },
                    { value: 'not-sure', label: 'Not sure yet' },
                  ]}
                />
              </div>
              {agreement && agreement !== 'yes' ? (
                <Callout tone="info" title="You can still help while access is arranged">
                  <p>You can explore and add your own observations. We will help arrange access.</p>
                  <p>
                    After setup, choose <strong className="font-semibold">Help arrange access</strong> in Support. A
                    person can explain the options, including support for {name} to decide. {possessive} records stay
                    private until then.
                  </p>
                </Callout>
              ) : null}
            </section>
          </>
        )}

        {privacy}
      </Panel>

      <ActionRow>
        <Button type="submit" size="lg">
          {myself ? 'Continue to your care' : `Continue to ${possessive} care`}
        </Button>
        <Button to={`/start${search}`} variant="quiet" iconLeft={<ChevronLeft className="size-5" />}>
          Back
        </Button>
      </ActionRow>

      <UrgentHelpLine className="border-t border-border pt-6" />
    </form>
  )
}

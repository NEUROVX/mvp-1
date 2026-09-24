import { Info } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLink, Button, ErrorSummary, RadioGroup, TextArea, TextField } from '@/components/ui'
import { NodeList } from '@/features/public/Section'
import { usePageTitle } from '@/lib/hooks'

type Role = 'patient-family' | 'clinician' | 'hospital' | 'lab' | 'research' | 'other'

const ROLES: Array<{ value: Role; label: string }> = [
  { value: 'patient-family', label: 'Patient or family member' },
  { value: 'clinician', label: 'Clinician' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'lab', label: 'Diagnostic lab' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
]

interface Values {
  name: string
  organization: string
  role?: Role
  contact: string
  message: string
}

const EMPTY: Values = { name: '', organization: '', role: undefined, contact: '', message: '' }

const FIELD = { name: 'pilot-name', role: 'pilot-role', contact: 'pilot-contact' } as const

function validate(v: Values) {
  const errors: Array<{ field: string; message: string }> = []
  if (!v.name.trim()) errors.push({ field: FIELD.name, message: 'Enter your name' })
  if (!v.role) errors.push({ field: FIELD.role, message: 'Choose the option that best describes you' })
  const contact = v.contact.trim()
  if (!contact) {
    errors.push({ field: FIELD.contact, message: 'Enter an email address or phone number' })
  } else {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    const phone = /^[+\d\s()-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 7
    if (!email && !phone)
      errors.push({ field: FIELD.contact, message: 'Enter an email address, like name@example.com, or a phone number' })
  }
  return errors
}

export default function PilotPage() {
  usePageTitle('Discuss a pilot')
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([])
  const [attempted, setAttempted] = useState(false)
  const [failedSubmits, setFailedSubmits] = useState(0)
  const [done, setDone] = useState(false)
  const doneRef = useRef<HTMLHeadingElement>(null)

  // Move focus to the error summary after each failed submit.
  useEffect(() => {
    if (failedSubmits > 0) document.getElementById('error-summary')?.focus()
  }, [failedSubmits])
  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value }
    setValues(next)
    // After a failed attempt, keep messages in step with what the person fixes.
    if (attempted) setErrors(validate(next))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setAttempted(true)
    setErrors(found)
    if (found.length) {
      setFailedSubmits((n) => n + 1)
      return
    }
    setDone(true)
  }

  const errorFor = (field: string) => errors.find((x) => x.field === field)?.message

  return (
    <div className="bg-surface">
      <div className="page-gutter mx-auto max-w-page pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-5 lg:pr-12">
            <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">Discuss a pilot</h1>
            <p className="mt-4 text-body-lg text-muted">
              For patients, families and healthcare partners helping shape NeuroVX.
            </p>
            <h2 className="mt-10 text-label text-ink">A conversation could cover</h2>
            <NodeList
              className="mt-4"
              items={[
                'How NeuroVX could fit the way your clinic, lab or family works',
                'What a small, supervised pilot would involve',
                'What is unclear or missing in this preview',
              ]}
            />
            <p className="mt-10 flex items-start gap-3 border-t border-border pt-6 text-body-md text-muted">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
              <span>This is a prototype. Nothing you enter here is sent or stored.</span>
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            {done ? (
              <div role="status" className="rounded-lg border border-border bg-canvas p-6 sm:p-8">
                <h2 ref={doneRef} tabIndex={-1} className="text-heading-md text-ink">
                  Prototype: nothing was sent.
                </h2>
                <p className="mt-3 text-body-lg text-ink">In a live service, the NeuroVX team would reply to you.</p>
                <p className="mt-2 text-body-md text-muted">
                  What you typed was not saved anywhere. It is cleared when you leave this page.
                </p>
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setValues(EMPTY)
                      setErrors([])
                      setAttempted(false)
                      setDone(false)
                    }}
                  >
                    Start again
                  </Button>
                  <ArrowLink to="/">Back to the homepage</ArrowLink>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} aria-labelledby="pilot-form-title" className="rounded-lg border border-border p-5 sm:p-8">
                <h2 id="pilot-form-title" className="text-heading-md text-ink">
                  Tell us about you
                </h2>
                <p className="mt-1 text-body-md text-muted">All fields are required unless marked optional.</p>

                {errors.length && failedSubmits > 0 ? (
                  <div className="mt-6">
                    <ErrorSummary errors={errors} />
                  </div>
                ) : null}

                <div className="mt-8 space-y-7">
                  <TextField
                    id={FIELD.name}
                    label="Your name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    error={errorFor(FIELD.name)}
                  />
                  <TextField
                    id="pilot-organization"
                    label="Organization"
                    optional
                    autoComplete="organization"
                    value={values.organization}
                    onChange={(e) => update('organization', e.target.value)}
                  />
                  <div id={FIELD.role}>
                    <RadioGroup<Role>
                      name="role"
                      legend="Which best describes you?"
                      value={values.role}
                      onChange={(r) => update('role', r)}
                      options={ROLES}
                      columns={2}
                      error={errorFor(FIELD.role)}
                    />
                  </div>
                  <TextField
                    id={FIELD.contact}
                    label="How should we reach you?"
                    hint="An email address or phone number."
                    autoComplete="email"
                    value={values.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    error={errorFor(FIELD.contact)}
                  />
                  <TextArea
                    id="pilot-message"
                    label="Message"
                    optional
                    hint="What would you like to discuss?"
                    rows={5}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Send message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

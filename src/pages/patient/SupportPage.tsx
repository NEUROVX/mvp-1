import { OctagonAlert } from 'lucide-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  DemoTag,
  DescriptionList,
  Disclosure,
  InlineStatus,
  PageHeader,
  RadioGroup,
  SelectField,
  StatusBadge,
  TextArea,
  TextLink,
} from '@/components/ui'
import { clinicianById, CLINICIANS, EPISODE_DATES, ORG, reportById } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { useSessionState } from '@/features/learn/storage'
import { usePageTitle } from '@/lib/hooks'

type HelpKind = 'assisted-assessment' | 'clinic-booking'
type ContactTime = 'morning' | 'afternoon' | 'evening' | 'any'

interface HelpRequest {
  id: string
  kind: HelpKind
  time: ContactTime
  note: string
  recordedOn: string
}

const KIND_LABEL: Record<HelpKind, string> = {
  'assisted-assessment': 'Arrange an assisted assessment',
  'clinic-booking': 'Ask the clinic to book for you',
}
const TIME_LABEL: Record<ContactTime, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  any: 'Any time',
}

/**
 * Support (PATIENT.md › Support: "Who can help?"). Human help and practical
 * support. No invented phone numbers or email addresses; requests are
 * recorded in this browser tab only, and the page says so.
 */
export default function SupportPage() {
  usePageTitle('Support')
  const { hash } = useLocation()

  // Deep links such as /app/support#sharing: scroll once this lazily loaded page has rendered.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!el) return
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.scrollIntoView()
    el.focus({ preventScroll: true })
  }, [hash])

  return (
    <div className="space-y-8">
      <PageHeader title="Support" lede="Human help and practical support." />

      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-5 py-4">
        <OctagonAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" strokeWidth={2} />
        <p className="text-body-md text-ink">
          <span className="font-semibold">Urgent concern?</span> If someone has sudden symptoms or may be in danger, call
          112. Support here is not for emergencies. <TextLink to="/urgent">Urgent help guidance</TextLink>
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        <SupportSection id="using" title="Using NeuroVX" summary="Short answers to common questions.">
          <div className="space-y-3">
            <Disclosure summary="Where is my information saved?">
              In this preview, everything stays in this browser tab and is cleared when you close it. Nothing is sent to a
              clinic, a lab or anyone else.
            </Disclosure>
            <Disclosure summary="What does “not yet reviewed” mean?">
              A clinician has not looked at the information yet. It is not a result and it is not an all-clear. When a
              clinician reviews it, you will see their name and the date.
            </Disclosure>
            <Disclosure summary="Can a family member help?">
              Yes, with permission. A care partner signs in to their own account and can only do what the patient allows.
              See <TextLink to="/app/access">People and access</TextLink>.
            </Disclosure>
            <Disclosure summary="Who is responsible for each step?">
              Each step names who is responsible, such as the clinic or the lab. If something is stuck, NeuroVX support
              follows up and shows the case on this page. Phone and email support are not available in this preview.
            </Disclosure>
          </div>
        </SupportSection>

        <SupportSection id="sharing" title="Sharing reports" summary="When a report has not reached your care team.">
          <SharingCase />
        </SupportSection>

        <SupportSection id="assisted" title="Assisted help" summary="When doing a step alone is not right.">
          <AssistedHelp />
        </SupportSection>

        <SupportSection id="access" title="Access and permissions" summary="Who can see what, and why.">
          <p className="max-w-reading text-body-md text-ink">
            See who can view this care record, what each person can do, and how to change it. Only the patient can change
            permissions.
          </p>
          <ArrowLink to="/app/access" className="mt-2">
            Review people and access
          </ArrowLink>
        </SupportSection>

        <SupportSection id="caregiver" title="Caregiver support" summary="Practical help for families.">
          <p className="max-w-reading text-body-md text-ink">
            Services such as caregiver education, support at home and help finding a provider.
          </p>
          <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <StatusBadge tone="neutral">Concept - not available in this preview</StatusBadge>
            <ArrowLink to="/care-support">About care and support</ArrowLink>
          </div>
        </SupportSection>

        <SupportSection id="understand" title="Understanding terms and tests" summary="Education, not a diagnosis.">
          <p className="max-w-reading text-body-md text-ink">
            NeuroLearn explains appointments, assessments and tests in plain language, with sources.
          </p>
          <ArrowLink to="/app/learn/neurolearn" className="mt-2">
            Ask NeuroLearn
          </ArrowLink>
        </SupportSection>
      </div>
    </div>
  )
}

function SupportSection({
  id,
  title,
  summary,
  children,
}: {
  id: string
  title: string
  summary: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="grid gap-4 p-5 sm:p-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12"
    >
      <div>
        <h2 id={`${id}-heading`} className="text-heading-sm text-ink">
          {title}
        </h2>
        <p className="mt-1 text-body-md text-muted">{summary}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

/** The delivery-failure case is human-owned and named (PATIENT.md › Report delivery failed). */
function SharingCase() {
  const { state } = useDemo()
  const { hasRecordAccess } = usePeople()
  const report = reportById('b12')
  const clin = clinicianById(state.booking.clinicianId) ?? CLINICIANS[0]

  if (state.stage !== 'delivery-problem' || !hasRecordAccess || !report) {
    return (
      <p className="max-w-reading text-body-md text-ink">
        There are no open sharing issues. If a report does not reach your care team, NeuroVX support follows up with the
        provider and shows the case here.
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-canvas p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-heading-sm text-ink">Report sharing issue</h3>
        <div className="flex items-center gap-2">
          <StatusBadge tone="warning">Open</StatusBadge>
          <DemoTag />
        </div>
      </div>
      <p className="mt-2 max-w-reading text-body-md text-ink">
        Your {report.title} is available to you, but it has not reached {clin.name} yet. You do not need to do anything.
        This page updates when the report is shared.
      </p>
      <DescriptionList
        className="mt-5"
        columns={2}
        items={[
          { term: 'Owner', detail: ORG.support },
          { term: 'Opened', detail: <span className="tabular">{EPISODE_DATES.released}</span> },
          { term: 'Status', detail: `Following up with ${report.issuer}` },
          { term: 'Report', detail: report.title },
        ]}
      />
      <ArrowLink to="/app/records/reports/b12" className="mt-4">
        View report
      </ArrowLink>
    </div>
  )
}

function AssistedHelp() {
  const [params] = useSearchParams()
  const preset = params.get('request')
  const [kind, setKind] = useState<HelpKind | undefined>(
    preset === 'assisted-assessment' || preset === 'clinic-booking' ? preset : undefined,
  )
  const [time, setTime] = useState<ContactTime | ''>('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ kind?: string; time?: string }>({})
  const [status, setStatus] = useState('')
  const [requests, setRequests] = useSessionState<HelpRequest[]>('nvx-support-requests-v1', [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!kind) next.kind = 'Choose what would help.'
    if (!time) next.time = 'Choose a preferred contact time.'
    setErrors(next)
    if (!kind || !time) return
    setRequests((list) => [
      ...list,
      { id: `req-${Date.now().toString(36)}`, kind, time, note: note.trim(), recordedOn: EPISODE_DATES.today },
    ])
    setKind(undefined)
    setTime('')
    setNote('')
    setStatus('Prototype: request recorded in this browser tab only.')
  }

  return (
    <div className="space-y-6">
      <p className="max-w-reading text-body-md text-ink">
        Some steps work better with a person. The clinic can arrange an assisted assessment, or book the appointment for
        you.
      </p>
      <form onSubmit={submit} noValidate className="max-w-reading space-y-6">
        <RadioGroup<HelpKind>
          name="help-kind"
          legend="What would help?"
          value={kind}
          error={errors.kind}
          onChange={(v) => {
            setKind(v)
            setErrors((x) => ({ ...x, kind: undefined }))
          }}
          options={[
            {
              value: 'assisted-assessment',
              label: KIND_LABEL['assisted-assessment'],
              description: 'A trained person sets up the assessment with you, or a clinician gives it in person.',
            },
            {
              value: 'clinic-booking',
              label: KIND_LABEL['clinic-booking'],
              description: 'The clinic contacts you to arrange the appointment.',
            },
          ]}
        />
        <SelectField
          label="Preferred contact time"
          value={time}
          error={errors.time}
          placeholder="Choose a time"
          onChange={(e) => {
            setTime(e.target.value as ContactTime)
            setErrors((x) => ({ ...x, time: undefined }))
          }}
          options={(Object.keys(TIME_LABEL) as ContactTime[]).map((t) => ({ value: t, label: TIME_LABEL[t] }))}
        />
        <TextArea
          label="Note"
          optional
          hint="For example, hearing difficulties or a preferred language."
          value={note}
          rows={3}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="space-y-2">
          <Button type="submit">Request help</Button>
          <InlineStatus>{status}</InlineStatus>
        </div>
      </form>

      {requests.length ? (
        <div>
          <h3 className="text-label text-ink">Your requests</h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-body-md font-medium text-ink">{KIND_LABEL[r.kind]}</p>
                  <p className="text-body-md text-muted">
                    Contact: {TIME_LABEL[r.time]} · Recorded <span className="tabular">{r.recordedOn}</span>
                    {r.note ? ` · “${r.note}”` : ''}
                  </p>
                </div>
                <StatusBadge tone="neutral" className="self-start sm:self-auto">
                  Not sent - prototype
                </StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

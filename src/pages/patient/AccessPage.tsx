import { Building2, Check, FlaskConical } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  ArrowLink,
  Button,
  Callout,
  CheckboxGroup,
  DemoTag,
  InlineStatus,
  Initials,
  PageHeader,
  StatusBadge,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { clinicianById, CLINICIANS, EPISODE_DATES, ORG, PERMISSION_LABELS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { PermissionKey } from '@/demo/types'
import { useSessionState } from '@/features/learn/storage'
import { usePageTitle } from '@/lib/hooks'

const PERMISSION_ORDER: PermissionKey[] = ['bookings', 'observations', 'care-plan', 'selected-reports']

/**
 * People and access (PATIENT.md › Access, notifications and files; DESIGN.md
 * › Care-partner access and sharing). Who can see what, why and since when;
 * only the patient changes permissions; research is separate and never on by default.
 */
export default function AccessPage() {
  usePageTitle('People and access')
  const { patient, helper, persona, possessive, your, name, hasRecordAccess } = usePeople()
  const helperName = `${helper.firstName} ${helper.lastName}`.trim()
  const signedIn =
    persona === 'patient'
      ? `${patient.firstName} ${patient.lastName} - patient`
      : persona === 'care-partner'
        ? `${helperName} - care partner`
        : `${helperName || 'Helper'} - access not arranged`

  return (
    <div className="space-y-10">
      <PageHeader
        title="People and access"
        lede={
          hasRecordAccess
            ? `Who can see ${your} care record, what they can do, and why.`
            : `You are helping ${name}. Access to ${possessive} record has not been arranged yet.`
        }
        meta={
          <dl className="flex flex-wrap gap-x-10 gap-y-3 text-body-md">
            <div>
              <dt className="text-muted">Whose care</dt>
              <dd className="font-semibold text-ink">
                {patient.firstName} {patient.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Signed in</dt>
              <dd className="font-semibold text-ink">{signedIn}</dd>
            </div>
          </dl>
        }
      />

      {hasRecordAccess ? <WhoCanSee /> : <ArrangeAccess />}

      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {hasRecordAccess ? (
          <Section id="permissions" title="Changing permissions" summary="Only the patient decides.">
            {persona === 'patient' ? <EditPermissions /> : <ReadOnlyPermissions />}
          </Section>
        ) : null}

        {hasRecordAccess ? (
        <Section id="research" title="Research permissions" summary="Separate from care.">
          <StatusBadge tone="neutral">Concept - not available in this preview</StatusBadge>
          <p className="mt-3 max-w-reading text-body-lg text-ink">
            Not set. Research is separate from care and never turned on by default. Saying no, or not deciding, never
            changes anyone’s care.
          </p>
        </Section>
        ) : null}

        <Section id="notifications" title="Notifications" summary="Discreet by default.">
          <p className="max-w-reading text-body-lg text-ink">
            Messages outside NeuroVX never show names, results or diagnoses. On a shared phone, a notification would only
            say:
          </p>
          <blockquote className="mt-3 max-w-reading rounded-md border border-border bg-canvas px-4 py-3 text-body-lg text-ink">
            You have an update in NeuroVX.
          </blockquote>
          <p className="mt-3 max-w-reading text-body-md text-muted">
            Opening an update asks you to sign in and shows whose care it is about. Notifications are a concept - none are
            sent in this preview.
          </p>
        </Section>

        <Section id="switching" title="Switching person" summary="Always your choice.">
          <p className="max-w-reading text-body-lg text-ink">Switching between people is always deliberate.</p>
          <p className="mt-2 max-w-reading text-body-md text-muted">
            {hasRecordAccess ? `You are viewing ${your} care.` : `You are helping ${name}.`} This demo includes one person. If you helped more than one person, you would
            choose whose care to open, and NeuroVX would never switch without asking.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ id, title, summary, children }: { id: string; title: string; summary: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="grid gap-4 p-5 sm:p-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
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

/* ------------------------------------------------------------------ */
/* Who can see                                                         */
/* ------------------------------------------------------------------ */

interface AccessRow {
  key: string
  who: string
  role: string
  mark: ReactNode
  what: ReactNode
  why: string
  since: string
}

function WhoCanSee() {
  const { state } = useDemo()
  const { patient, helper, persona, your, name } = usePeople()
  const clin = clinicianById(state.booking.clinicianId) ?? CLINICIANS[0]
  const initials = (first: string, last: string) => `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()

  const rows: AccessRow[] = [
    {
      key: 'patient',
      who: `${patient.firstName} ${patient.lastName}`,
      role: 'Patient',
      mark: <Initials>{initials(patient.firstName, patient.lastName)}</Initials>,
      what: 'Full access',
      why: persona === 'patient' ? 'Your own care record' : 'Their own care record',
      since: EPISODE_DATES.today,
    },
  ]
  if (helper.firstName) {
    rows.push({
      key: 'helper',
      who: `${helper.firstName} ${helper.lastName}`,
      role: `Care partner${helper.relationship ? ` · ${helper.relationship}` : ''}`,
      mark: <Initials>{initials(helper.firstName, helper.lastName)}</Initials>,
      what: state.permissions.length ? (
        <ul className="space-y-1">
          {PERMISSION_ORDER.filter((p) => state.permissions.includes(p)).map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" strokeWidth={2.5} />
              {PERMISSION_LABELS[p].label}
            </li>
          ))}
        </ul>
      ) : (
        'No permissions at the moment'
      ),
      why: `Helping ${name} arrange and prepare for care`,
      since: EPISODE_DATES.today,
    })
  }
  if (hasReached(state.stage, 'booking-requested')) {
    rows.push({
      key: 'clinic',
      who: ORG.clinic,
      role: `Clinic · ${clin.name}`,
      mark: <OrgMark icon={<Building2 />} />,
      what: 'Visit packet for this care episode',
      why: `To prepare for the appointment with ${clin.name}`,
      since: EPISODE_DATES.bookingRequested,
    })
  }
  if (hasReached(state.stage, 'tests-requested')) {
    rows.push({
      key: 'lab',
      who: ORG.lab,
      role: 'Diagnostic lab',
      mark: <OrgMark icon={<FlaskConical />} />,
      what: 'Order and reports for this episode',
      why: `To carry out the tests ${clin.name} requested`,
      since: EPISODE_DATES.testsRequested,
    })
  }

  return (
    <section aria-labelledby="who-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="who-heading" className="text-heading-md text-ink">
          Who can see {your} information
        </h2>
        <DemoTag />
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((r) => (
          <li key={r.key} className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
            <div className="flex min-w-0 items-start gap-3">
              {r.mark}
              <div className="min-w-0">
                <h3 className="text-label text-ink">{r.who}</h3>
                <p className="text-body-md text-muted">{r.role}</p>
              </div>
            </div>
            <dl className="grid gap-x-8 gap-y-3 text-body-md sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_7.5rem]">
              <div className="min-w-0">
                <dt className="text-muted">Can see or do</dt>
                <dd className="mt-0.5 text-ink">{r.what}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted">Why</dt>
                <dd className="mt-0.5 text-ink">{r.why}</dd>
              </div>
              <div>
                <dt className="text-muted">Since</dt>
                <dd className="mt-0.5 text-ink tabular">{r.since}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  )
}

function OrgMark({ icon }: { icon: ReactNode }) {
  return (
    <span aria-hidden="true" className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-canvas text-muted [&>svg]:size-5 [&>svg]:stroke-[1.75]">
      {icon}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Permissions                                                         */
/* ------------------------------------------------------------------ */

function RevocationNote() {
  return (
    <p className="mt-4 max-w-reading text-body-md text-muted">
      Removing a permission stops future access in NeuroVX. It does not delete copies a clinic or lab has already lawfully
      kept as part of care, or files someone has already downloaded.
    </p>
  )
}

function EditPermissions() {
  const { state, set } = useDemo()
  const { helper } = usePeople()
  const [value, setValue] = useState<PermissionKey[]>(state.permissions)
  const [status, setStatus] = useState('')

  const same =
    value.length === state.permissions.length && value.every((v) => state.permissions.includes(v))

  return (
    <div>
      <CheckboxGroup<PermissionKey>
        name="permissions"
        legend={`What ${helper.firstName} can help with`}
        hint="You can change this at any time."
        value={value}
        onChange={(v) => {
          setValue(v)
          setStatus('')
        }}
        options={PERMISSION_ORDER.map((p) => ({
          value: p,
          label: PERMISSION_LABELS[p].label,
          description: PERMISSION_LABELS[p].detail,
        }))}
      />
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        <Button
          onClick={() => {
            if (same) {
              setStatus('No changes to save.')
              return
            }
            set({ permissions: PERMISSION_ORDER.filter((p) => value.includes(p)) })
            setStatus('Changes saved in this browser tab.')
          }}
        >
          Save changes
        </Button>
        <InlineStatus>{status}</InlineStatus>
      </div>
      <RevocationNote />
    </div>
  )
}

function ReadOnlyPermissions() {
  const { name } = usePeople()
  return (
    <div>
      <Callout tone="neutral" title={`Only ${name} can change this.`}>
        <p>A care partner can’t change another person’s permissions.</p>
      </Callout>
      <RevocationNote />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Limited helper                                                      */
/* ------------------------------------------------------------------ */

function ArrangeAccess() {
  const { name, possessive } = usePeople()
  const [requested, setRequested] = useSessionState<boolean>('nvx-access-request-v1', false)
  const [status, setStatus] = useState('')

  return (
    <section aria-labelledby="arrange-heading" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="arrange-heading" className="text-heading-md text-ink">
          Help arrange access
        </h2>
        <StatusBadge tone="neutral">{requested ? 'Request recorded' : 'Access not arranged'}</StatusBadge>
      </div>
      <p className="mt-2 max-w-reading text-body-lg text-ink">
        You can’t see {possessive} record yet. Nothing is shown or attached just because a name or phone number matches.
      </p>

      <ol className="mt-6 max-w-reading space-y-5">
        <Step n={1} title={`Ask ${name} to add you`}>
          {name} signs in to their own account and chooses what you can help with.
        </Step>
        <Step n={2} title="Or use clinic-assisted verification">
          If {name} can’t do this alone, the clinic can check identity and authority with you both.
        </Step>
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <Button
          size="lg"
          className="w-full !px-4 sm:w-auto sm:!px-6"
          onClick={() => {
            setRequested(true)
            setStatus(`Request recorded in this demo. ${name} would need to approve it.`)
          }}
          disabled={requested}
        >
          {requested ? 'Request recorded' : `Request access from ${name}`}
        </Button>
        <ArrowLink to="/app/care/observations">Add your own observations</ArrowLink>
      </div>
      <div className="mt-3">
        <InlineStatus>{status || (requested ? `Request recorded in this demo. ${name} would need to approve it.` : '')}</InlineStatus>
      </div>
      <p className="mt-4 border-t border-border pt-4 text-body-md text-muted">
        Presenters can switch who is signed in with the Demo button.
      </p>
    </section>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary text-metadata font-semibold text-primary tabular"
      >
        {n}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-label text-ink">
          <span className="sr-only">Step {n}: </span>
          {title}
        </p>
        <p className="mt-1 text-body-md text-muted">{children}</p>
      </div>
    </li>
  )
}

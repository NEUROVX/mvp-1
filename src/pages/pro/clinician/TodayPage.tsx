import { AlertTriangle, FileText } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, DemoTag, Initials, PageHeader, StatusBadge, TextField, TextLink } from '@/components/ui'
import { EPISODE_DATES, ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { ClinicianDialogs, useClinicianActions } from '@/features/clinician/actions'
import {
  B12_REPORT,
  CLINICIAN,
  hasOrders,
  packetParts,
  RECORD_PATH,
  recordTabPath,
  requestedSlot,
  SAMPLE_VISITS,
  workspaceToday,
  type VisitRow,
} from '@/features/clinician/data'
import { DataTable, type RowGroup } from '@/features/clinician/DataTable'
import { ActionFeedback, LiveSlot, RowAction, SectionHead } from '@/features/clinician/parts'
import { usePageTitle } from '@/lib/hooks'

export default function TodayPage() {
  usePageTitle('Today')
  const { state } = useDemo()
  const { fullName, patient, helper } = usePeople()
  const actions = useClinicianActions()
  const [query, setQuery] = useState('')
  const st = state.stage
  const today = workspaceToday(st)
  const slot = requestedSlot(state)

  // Keep keyboard focus in place once the pressed button disappears.
  const firstFeedback = useRef(true)
  useEffect(() => {
    if (firstFeedback.current) {
      firstFeedback.current = false
      return
    }
    if (actions.feedback) document.getElementById('respond-h')?.focus()
  }, [actions.feedback])

  /* ---------- visits: background rows + the demo patient ---------- */
  const groups = useMemo(() => {
    const demoRow: VisitRow = {
      id: 'demo',
      time: slot.time.replace(' IST', ''),
      patient: `${fullName}, ${patient.age}`,
      reason: 'New memory concern',
      packet: st === 'tests-requested' ? 'Visit completed' : 'Visit packet received',
      packetTone: st === 'tests-requested' ? 'neutral' : 'info',
      owner: CLINICIAN.name,
      href: RECORD_PATH,
      demoPatient: true,
    }
    const todays = [...SAMPLE_VISITS]
    const upcoming: VisitRow[] = []
    if (st === 'tests-requested' && slot.date === today) todays.push(demoRow)
    if (st === 'booking-confirmed' || st === 'info-requested')
      upcoming.push({ ...demoRow, time: `${slot.date.replace(/ \d{4}$/, '')}, ${demoRow.time}` })

    const q = query.trim().toLowerCase()
    const match = (r: VisitRow) => !q || [r.patient, r.reason, r.packet].some((v) => v.toLowerCase().includes(q))
    const out: RowGroup<VisitRow>[] = [{ id: 'today', label: upcoming.length ? `Today · ${today}` : undefined, rows: todays.filter(match) }]
    if (upcoming.length) out.push({ id: 'upcoming', label: 'Upcoming', rows: upcoming.filter(match) })
    return out
  }, [fullName, patient.age, query, slot, st, today])

  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div className="space-y-10">
      <PageHeader
        title="Today"
        meta={
          <p className="text-body-md text-muted">
            <span className="tabular font-semibold text-ink">{today}</span> · {CLINICIAN.name} · {ORG.clinic}
          </p>
        }
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-8">
        {/* ---------------- Needs your response ---------------- */}
        <section aria-labelledby="respond-h" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="respond-h" tabIndex={-1} className="text-heading-sm text-ink">
              Needs your response
            </h2>
            {st === 'booking-requested' ? (
              <StatusBadge tone="warning">
                1 appointment request
              </StatusBadge>
            ) : null}
          </div>

          {st === 'booking-requested' ? (
            <article aria-labelledby="request-h" className="rounded-lg border border-border bg-surface shadow-1">
              <div className="flex min-w-0 gap-4 p-5 sm:p-6">
                <span className="hidden sm:block">
                  <Initials>{initials}</Initials>
                </span>
                <div className="min-w-0 space-y-2">
                  <h3 id="request-h" className="text-heading-sm text-ink">
                    {fullName}, {patient.age}
                  </h3>
                  <p className="text-body-md text-ink">
                    <span className="block font-semibold sm:inline">Appointment request</span>
                    <span aria-hidden="true" className="hidden sm:inline">
                      {' '}
                      ·{' '}
                    </span>
                    Requested{' '}
                    <span className="tabular whitespace-nowrap">{slot.when}</span> · {slot.modeLabel}
                  </p>
                  <p className="text-body-md text-muted">Visit packet attached ({packetParts(state).join(', ')})</p>
                  <p className="text-metadata text-muted">
                    Sent by {helper.firstName} {helper.lastName}, care partner, on {EPISODE_DATES.bookingRequested}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
                <Button onClick={actions.acceptRequest}>Accept request</Button>
                <Button variant="secondary" onClick={() => actions.setDialog('propose')}>
                  Propose another time
                </Button>
                <span className="sm:ml-auto">
                  <RowAction to={RECORD_PATH} context={fullName}>
                    Open visit packet
                  </RowAction>
                </span>
              </div>
            </article>
          ) : (
            <p className="rounded-lg border border-border bg-surface px-5 py-4 text-body-md text-muted sm:px-6">
              Nothing needs your response right now.
            </p>
          )}
          <LiveSlot className="mt-3">
            <ActionFeedback
              message={actions.feedback}
              extra={
                <>
                  {' '}
                  · <TextLink to={RECORD_PATH}>Open record</TextLink>
                </>
              }
            />
          </LiveSlot>
        </section>

        {/* ---------------- Results to review ---------------- */}
        <section aria-labelledby="results-h" className="min-w-0">
          <SectionHead id="results-h" title="Results to review" />
          {st === 'report-released' ? (
            <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
              <div className="flex gap-3">
                <FileText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
                <div className="min-w-0 space-y-1.5">
                  <p className="text-label text-ink">
                    {B12_REPORT.title} · {fullName}
                  </p>
                  <p className="text-body-md text-muted">
                    Released {EPISODE_DATES.released} by {B12_REPORT.issuer}
                  </p>
                  <StatusBadge tone="info">
                    Not yet reviewed
                  </StatusBadge>
                </div>
              </div>
              <Button to={recordTabPath('results')} fullWidth className="mt-5">
                Review report
              </Button>
            </div>
          ) : st === 'delivery-problem' ? (
            <div className="rounded-lg border border-border bg-warning-surface p-5 sm:p-6">
              <div className="flex gap-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" strokeWidth={2} />
                <div className="min-w-0 space-y-1.5">
                  <p className="text-label text-ink">Expected report not received - delivery failed</p>
                  <p className="text-body-md text-ink">
                    {B12_REPORT.title} · {fullName}
                  </p>
                  <p className="text-body-md font-medium text-ink">Owner: {ORG.support}</p>
                </div>
              </div>
              <div className="mt-2 pl-8">
                <RowAction to={recordTabPath('results')} context={fullName}>
                  View order
                </RowAction>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface px-5 py-4 sm:px-6">
              <p className="text-body-md text-muted">No results waiting for review.</p>
              {hasOrders(st) ? (
                <RowAction to="/pro/clinician/orders">Orders in progress</RowAction>
              ) : null}
            </div>
          )}
        </section>
      </div>

      {/* ---------------- Today's visits ---------------- */}
      <section aria-labelledby="visits-h">
        <div className="mb-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="visits-h" className="text-heading-sm text-ink">
              Today’s visits
            </h2>
            <DemoTag>Example rows</DemoTag>
          </div>
          <TextField
            type="search"
            label="Search this clinic’s visits"
            hint="Today and upcoming. Patient name, reason or packet status."
            className="max-w-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DataTable<VisitRow>
          caption={`Visits for ${today}`}
          rowKey={(r) => r.id}
          groups={groups}
          empty={
            <p className="rounded-lg border border-border bg-surface px-5 py-4 text-body-md text-muted sm:px-6">
              No visits match “{query.trim()}”. Search covers today’s and upcoming visits in this clinic only.
            </p>
          }
          columns={[
            { key: 'time', header: 'Time (IST)', cell: (r) => <span className="tabular">{r.time}</span>, className: 'w-40' },
            {
              key: 'patient',
              header: 'Patient',
              primary: true,
              cell: (r) => <span className={r.demoPatient ? 'font-semibold' : 'font-medium'}>{r.patient}</span>,
            },
            { key: 'reason', header: 'Reason', cell: (r) => r.reason },
            {
              key: 'packet',
              header: 'Packet status',
              cell: (r) => (
                <StatusBadge tone={r.packetTone}>
                  {r.packet}
                </StatusBadge>
              ),
            },
            { key: 'owner', header: 'Owner', cell: (r) => r.owner },
            {
              key: 'action',
              header: 'Action',
              action: true,
              cell: (r) => (
                <RowAction to={r.href} context={r.patient}>
                  Open record
                </RowAction>
              ),
            },
          ]}
        />
      </section>

      <ClinicianDialogs actions={actions} />
    </div>
  )
}

import { clsx } from 'clsx'
import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Callout, Careline, DescriptionList, SourceLabel, StatusBadge } from '@/components/ui'
import { ORG, PENDING_REPORT, REPORTS } from '@/demo/fixtures'
import { orderStateSteps, type LabOrder } from './model'

const ORDER_OF_STATES = [
  'order-received',
  'needs-clarification',
  'collection-arranged',
  'collected',
  'specimen-received',
  'processing',
  'released',
] as const

function reached(o: LabOrder, s: (typeof ORDER_OF_STATES)[number]) {
  return ORDER_OF_STATES.indexOf(o.state) >= ORDER_OF_STATES.indexOf(s)
}

function SectionTitle({ id, children, aside }: { id: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <h2 id={id} className="text-heading-sm text-ink">
        {children}
      </h2>
      {aside}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Identity check                                                       */
/* ------------------------------------------------------------------ */

type CheckState = 'done' | 'pending' | 'problem'

function Check({ state, label, detail }: { state: CheckState; label: string; detail: string }) {
  return (
    <li className="flex gap-3 py-3">
      <span aria-hidden="true" className="mt-0.5 shrink-0">
        {state === 'done' ? (
          <CheckCircle2 className="size-5 text-primary" strokeWidth={2} />
        ) : state === 'problem' ? (
          <AlertTriangle className="size-5 text-warning" strokeWidth={2} />
        ) : (
          <Circle className="size-5 text-control" strokeWidth={1.75} />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-label text-ink">{label}</span>
        <span className="block text-body-md text-muted">{detail}</span>
      </span>
    </li>
  )
}

export function IdentityCheck({ order }: { order: LabOrder }) {
  const unclear = order.state === 'needs-clarification'
  return (
    <section aria-labelledby="identity-title" className="space-y-5">
      <SectionTitle id="identity-title">Identity check</SectionTitle>
      <DescriptionList
        className="min-[360px]:grid-cols-2"
        items={[
          { term: 'Patient', detail: order.patientName },
          { term: 'Age', detail: <span className="tabular">{order.patientAge}</span> },
          { term: 'Order reference', detail: <span className="tabular">{order.ref}</span> },
          { term: 'Ordered on', detail: <span className="tabular">{order.orderedOn}</span> },
          { term: 'Ordering clinician', detail: order.orderingClinician },
          { term: 'Clinic', detail: order.clinic },
        ]}
      />
      <div>
        <h3 className="text-label text-ink">Checks</h3>
        <p className="text-body-md text-muted">For reference. Each check is recorded in the lab’s own system.</p>
        <ul className="mt-2 divide-y divide-border border-t border-border">
          <Check state="done" label="Identity matches order" detail="Checked when the order arrived" />
          <Check
            state={unclear ? 'problem' : 'done'}
            label="Requested test is clear"
            detail={unclear ? 'Not clear. Needs clarification before collection.' : 'Named exactly on the order'}
          />
          <Check
            state={reached(order, 'collected') ? 'done' : 'pending'}
            label="Two identifiers confirmed at collection"
            detail={reached(order, 'collected') ? 'Recorded at collection' : 'Due at collection'}
          />
          <Check
            state={reached(order, 'specimen-received') ? 'done' : 'pending'}
            label="Specimen label matches order"
            detail={reached(order, 'specimen-received') ? 'Checked at reception' : 'Due at reception'}
          />
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Requested test, specimen, collection, processing lab                 */
/* ------------------------------------------------------------------ */

export function RequestedTest({ order }: { order: LabOrder }) {
  const c = order.collection
  const unclear = order.state === 'needs-clarification'
  return (
    <section aria-labelledby="test-title" className="space-y-5">
      <SectionTitle id="test-title">Requested test</SectionTitle>
      <DescriptionList
        columns={2}
        items={[
          {
            term: unclear ? 'Requested test, as written' : 'Requested test (exact name)',
            detail: unclear ? `“${order.testExact}”` : order.testExact,
          },
          {
            term: 'Specimen',
            detail: (
              <>
                <span className="block">{order.specimen}</span>
                <span className="block font-normal text-muted">
                  {unclear ? 'Cannot be confirmed until the order is clear' : 'Requirements as stated on the order - confirmed by the lab'}
                </span>
              </>
            ),
          },
          {
            term: 'Collection',
            detail: c ? (
              <>
                <span className="block">
                  {c.type === 'home' ? 'Home collection' : 'Centre visit'} · <span className="tabular">{c.date}, {c.time}</span>
                </span>
                <span className="block font-normal text-muted">{c.provider}</span>
              </>
            ) : unclear ? (
              'On hold until the order is clear'
            ) : (
              'Not booked yet. The patient or family chooses a provider and time.'
            ),
          },
          {
            term: 'Processing lab',
            detail: (
              <>
                <span className="block">{order.processingLab}</span>
                <span className="block font-normal text-muted">
                  {order.processingLab === ORG.lab ? 'This lab' : 'Partner laboratory. The specimen is sent there after reception.'}
                </span>
              </>
            ),
          },
        ]}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Report and version history                                           */
/* ------------------------------------------------------------------ */

const NOT_REPRODUCED =
  'Values are entered in the lab’s own system and appear in the original report (not reproduced in this prototype).'

export function ReportSection({ order, today, correctionReason }: { order: LabOrder; today: string; correctionReason?: string }) {
  const report = REPORTS[0]
  const released = order.state === 'released'
  const isB12 = order.kind === 'b12'

  return (
    <section aria-labelledby="report-title" className="space-y-5">
      <SectionTitle id="report-title" aside={released ? <SourceLabel kind="lab" name={isB12 ? report.issuer : 'Example Diagnostics'} /> : null}>
        Report
      </SectionTitle>

      {!released ? (
        <div className="space-y-2">
          <p className="text-label text-ink">
            {order.kind === 'plasma' && order.state === 'processing' ? PENDING_REPORT.status : 'Not released'}
          </p>
          <p className="max-w-reading text-body-md text-muted">
            {order.kind === 'plasma' && order.state === 'processing' ? PENDING_REPORT.note : NOT_REPRODUCED}
          </p>
        </div>
      ) : (
        <>
          <DescriptionList
            columns={2}
            items={
              isB12
                ? [
                    { term: 'Report', detail: report.title },
                    { term: 'Issued by', detail: report.issuerLabel },
                    { term: 'Specimen', detail: report.specimen },
                    { term: 'Assay and platform', detail: report.assay },
                    { term: 'Collected', detail: <span className="tabular">{order.collection?.collectedOn ?? report.collectedOn}</span> },
                    { term: 'Released', detail: <span className="tabular">{report.releasedOn}</span> },
                    { term: 'Quality flags', detail: report.qualityFlags },
                    { term: 'Laboratory interpretation', detail: report.labInterpretation },
                  ]
                : [
                    { term: 'Issued by', detail: ORG.lab },
                    { term: 'Released', detail: <span className="tabular">{order.releasedOn}</span> },
                  ]
            }
          />
          <div className="rounded-md border border-border bg-canvas p-4">
            <p className="text-label text-ink">Result</p>
            <p className="mt-1 text-body-md text-ink">{NOT_REPRODUCED}</p>
          </div>
          <VersionHistory
            versions={
              isB12 && order.correctedVersion
                ? [
                    { v: 2, title: 'Corrected report', issued: today, note: correctionReason ?? 'Reason recorded in the lab’s own system', current: true },
                    { v: 1, title: 'Original release', issued: report.releasedOn, note: `Replaced by version 2 on ${today}. Kept for traceability.`, current: false },
                  ]
                : [{ v: 1, title: 'Original release', issued: order.releasedOn ?? '', note: 'No corrections', current: true }]
            }
          />
        </>
      )}

      <Callout tone="neutral" title="Critical results">
        This workspace does not monitor results or send alerts. A critical value follows the lab’s approved
        call-and-acknowledge procedure: a named person phones the ordering clinician, records the acknowledgement and
        escalates if no one answers.
      </Callout>
    </section>
  )
}

function VersionHistory({
  versions,
}: {
  versions: Array<{ v: number; title: string; issued: string; note: string; current: boolean }>
}) {
  return (
    <div>
      <h3 className="text-label text-ink">Version history</h3>
      <p className="text-body-md text-muted">A correction is a new version. Earlier versions are never overwritten.</p>
      <ol className="mt-2 divide-y divide-border border-t border-border">
        {versions.map((ver) => (
          <li key={ver.v} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className={clsx('text-label', ver.current ? 'text-ink' : 'text-muted')}>
                Version {ver.v} · {ver.title}
              </p>
              <p className="text-body-md text-muted">
                Issued <span className="tabular">{ver.issued}</span>
              </p>
              <p className="text-body-md text-ink">{ver.note}</p>
            </div>
            <StatusBadge tone={ver.current ? 'info' : 'neutral'} className="shrink-0 self-start">
              {ver.current ? 'Current version' : 'Superseded - still traceable'}
            </StatusBadge>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Operational state line                                               */
/* ------------------------------------------------------------------ */

export function StateLine({ order }: { order: LabOrder }) {
  return (
    <section aria-labelledby="states-title" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 id="states-title" className="text-heading-sm text-ink">
        Order states
      </h2>
      <p className="mt-1 text-body-md text-muted">Laboratory release and clinician review are separate states.</p>
      <Careline className="mt-5" orientation="vertical" size="sm" label={`States for order ${order.ref}`} steps={orderStateSteps(order)} />
    </section>
  )
}

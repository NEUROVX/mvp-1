import { ArrowRight, FileQuestion } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  Careline,
  DemoTag,
  DescriptionList,
  Disclosure,
  EmptyState,
  PageHeader,
  SourceLabel,
  StatusBadge,
  type CarelineStep,
} from '@/components/ui'
import { hasReached, labCollectionFor } from '@/demo/episode'
import { CARE_PLAN_SUMMARY, EPISODE_DATES, orderById, ORG, PENDING_REPORT, reportById } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { InvestigationOrder, Report } from '@/demo/types'
import { BackLink } from '@/features/booking/BackLink'
import { AccessGate } from '@/features/records/AccessGate'
import { OriginalReportButton } from '@/features/records/OriginalReportDialog'
import { SaveQuestionButton } from '@/features/records/SaveQuestionDialog'
import { bookingFor, orderStatus, progressFor, reviewStateFor } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

const FOLLOW_UP = '/app/care/clinicians/kavya-rao?visit=follow-up'

/** P16 · Report details and human review. One canonical page per released report. */
export default function ReportDetailPage() {
  const { reportId } = useParams()
  const { state } = useDemo()
  const { hasRecordAccess } = usePeople()
  const report = reportById(reportId)
  const order = orderById(reportId)
  // Without record access, not even the report name is shown (PATIENT.md › Access incomplete).
  const title = !hasRecordAccess ? 'Report' : (report?.title ?? (order ? order.shortName : 'Report'))
  usePageTitle(title)

  const back = <BackLink to="/app/records">Back to records</BackLink>

  let body: ReactNode
  if (!hasRecordAccess) {
    body = <PageHeader title="Report" />
  } else if (!order) {
    body = (
      <>
        <PageHeader title="We could not find this report" />
        <EmptyState
          icon={<FileQuestion strokeWidth={1.75} />}
          title="This report is not in this record"
          action={<ArrowLink to="/app/records">Back to records</ArrowLink>}
        >
          <p>Check the link, or find the report in Records.</p>
        </EmptyState>
      </>
    )
  } else if (!hasReached(state.stage, 'tests-requested')) {
    body = (
      <>
        <PageHeader title={title} />
        <EmptyState
          icon={<FileQuestion strokeWidth={1.75} />}
          title="No report here yet"
          action={<ArrowLink to="/app/records">Back to records</ArrowLink>}
        >
          <p>A report appears here only after a clinician requests the test and the provider releases it.</p>
        </EmptyState>
      </>
    )
  } else if (report && reviewStateFor(order.id, state).released) {
    body = <ReleasedReport report={report} order={order} />
  } else {
    body = <PendingReport order={order} title={title} />
  }

  return (
    <div className="space-y-8">
      {back}
      {body}
      {hasRecordAccess ? null : <AccessGate>{null}</AccessGate>}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function PendingReport({ order, title }: { order: InvestigationOrder; title: string }) {
  const { state } = useDemo()
  const status = orderStatus(order.id, state)
  const booking = bookingFor(state)
  const processing = status.label === 'Processing'
  const plasmaProcessing = order.id === PENDING_REPORT.orderId && processing

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        lede="The provider has not released this report yet."
        meta={<StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
      />
      <section aria-labelledby="pending-heading" className="max-w-reading rounded-lg border border-border bg-surface p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="pending-heading" className="text-heading-sm text-ink">
            Where this report is
          </h2>
          <DemoTag />
        </div>
        <DescriptionList
          className="mt-5"
          items={[
            { term: 'Status', detail: plasmaProcessing ? PENDING_REPORT.status : status.label },
            { term: 'Test', detail: order.name },
            { term: 'Ordered by', detail: `${order.orderedBy}, ${order.orderedOn}` },
            { term: 'Provider', detail: booking ? booking.provider.name : 'Not chosen yet' },
            {
              term: 'Expected release',
              detail:
                order.id === 'b12' && booking
                  ? `${booking.provider.turnaround}. This is an estimate, not a promise.`
                  : 'No estimate is shown because the provider has not supplied one.',
            },
          ]}
        />
        {order.limitations ? (
          <Disclosure summary="About this test" className="mt-6">
            <p className="text-body-lg">{order.limitations}</p>
          </Disclosure>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:gap-5">
          {booking ? (
            <Button to="/app/care/tests/progress" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full sm:w-auto">
              View test progress
            </Button>
          ) : (
            <Button to="/app/care/tests/providers" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full sm:w-auto">
              Choose a provider
            </Button>
          )}
          <Button to="/app/support" variant="quiet">
            Contact support
          </Button>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function ReleasedReport({ report, order }: { report: Report; order: InvestigationOrder }) {
  const { state } = useDemo()
  const { your } = usePeople()
  const r = reviewStateFor(order.id, state)
  const corrected = Boolean(state.lab.correctedVersion)
  const versions = corrected
    ? [...report.versions, { version: report.versions.length + 1, issuedOn: 'After the original release (demo)', note: 'Updated report issued by the laboratory' }]
    : report.versions
  const currentReport = { ...report, versions }
  const Your = your.charAt(0).toUpperCase() + your.slice(1)

  const followUpDue = state.stage === 'follow-up-due' && !state.booking.followUp
  let primary: ReactNode = null
  if (r.reviewed && followUpDue) {
    primary = (
      <Button to={FOLLOW_UP} size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full sm:w-auto">
        Book follow-up
      </Button>
    )
  } else if (r.reviewed) {
    primary = (
      <Button to="/app/care/plan" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full sm:w-auto">
        View clinician explanation
      </Button>
    )
  }

  const progress = progressFor(order, state)
  const releaseSteps: CarelineStep[] = [
    { id: 'released', label: 'Released by the laboratory', state: 'completed', sublabel: report.releasedOn },
    ...progress.after,
  ]

  const meta = [
    <>
      Released <span className="font-medium text-ink tabular">{EPISODE_DATES.released}</span>
    </>,
    <>
      Shared with {ORG.clinic}:{' '}
      <span className="font-semibold text-ink">{r.delivered ? 'delivered' : 'not yet delivered'}</span>
    </>,
    <>
      Clinical review:{' '}
      <span className="font-semibold text-ink">
        {r.reviewed ? `Reviewed by ${order.orderedBy} on ${EPISODE_DATES.reviewed}` : 'not yet reviewed'}
      </span>
    </>,
  ]

  return (
    <div className="space-y-8">
      <header className="space-y-5">
        <PageHeader title={report.title} lede="Available from the laboratory" />
        <p className="flex flex-col gap-1 text-body-md text-muted xl:flex-row xl:gap-x-3">
          {meta.map((m, i) => (
            <span key={i} className="inline-flex gap-x-3">
              {i > 0 ? (
                <span aria-hidden="true" className="hidden text-muted xl:inline">
                  |
                </span>
              ) : null}
              <span>{m}</span>
            </span>
          ))}
        </p>
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-4">
          {primary}
          <OriginalReportButton report={currentReport} variant={primary ? 'secondary' : 'primary'} />
          <SaveQuestionButton clinician={order.orderedBy} context={report.title} className="sm:pt-0.5" />
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-12">
        <div className="min-w-0 space-y-8">
          {r.deliveryFailed ? (
            <Callout
              tone="warning"
              title="Your report is available, but has not reached the care team"
              action={
                <Button to="/app/support#sharing" variant="secondary">
                  Get help sharing
                </Button>
              }
            >
              <p>Sending it to {ORG.clinic} failed. NeuroVX support is following up. You can still read the report.</p>
              <p>Owner: {ORG.support}</p>
            </Callout>
          ) : null}

          {!r.reviewed ? (
            <Callout tone="info" title="Not yet reviewed by a clinician">
              <p>
                {Your} clinician has not reviewed this report yet. You can read it now. {order.orderedBy} will review it
                and explain what it means.
              </p>
            </Callout>
          ) : (
            <section aria-labelledby="explanation-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
              <h2 id="explanation-heading" className="text-heading-sm text-ink">
                Clinician explanation
              </h2>
              <p className="mt-3 max-w-reading text-body-lg text-ink">{CARE_PLAN_SUMMARY.explanation}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <SourceLabel kind="clinician" name={`${CARE_PLAN_SUMMARY.author}, ${CARE_PLAN_SUMMARY.updated}`} />
                <ArrowLink to="/app/care/plan">View care plan</ArrowLink>
              </div>
            </section>
          )}

          {corrected ? (
            <Callout tone="info" title="The provider issued an updated report">
              <p>The current version is shown. The earlier version stays in the version history.</p>
            </Callout>
          ) : null}

          <section aria-labelledby="details-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="details-heading" className="text-heading-sm text-ink">
                Report details
              </h2>
              <DemoTag />
            </div>
            <p className="mt-2 max-w-reading text-body-md text-muted">
              As issued by the laboratory. The original file is the record of truth.
            </p>
            <DescriptionList
              columns={2}
              className="mt-6"
              items={[
                { term: 'Issued by', detail: report.issuerLabel },
                { term: 'Specimen', detail: report.specimen },
                { term: 'Assay', detail: report.assay },
                { term: 'Collected', detail: <span className="tabular">{labCollectionFor(state.labBooking).collectedOn}</span> },
                { term: 'Released', detail: <span className="tabular">{report.releasedOn}</span> },
                { term: 'Quality flags', detail: report.qualityFlags },
              ]}
            />
            <DescriptionList
              className="mt-6 border-t border-border pt-6"
              items={[
                { term: 'Result', detail: report.resultNote },
                { term: 'Laboratory interpretation', detail: report.labInterpretation },
                {
                  term: 'Version history',
                  detail: (
                    <ol className="space-y-1">
                      {versions.map((v) => (
                        <li key={v.version}>
                          Version {v.version} · <span className="tabular">{v.issuedOn}</span>
                          <span className="font-normal text-muted"> · {v.note}</span>
                        </li>
                      ))}
                    </ol>
                  ),
                },
              ]}
            />
            <div className="mt-6 border-t border-border pt-4">
              <SourceLabel kind="lab" name={report.issuer} />
            </div>
          </section>
        </div>

        <aside aria-labelledby="states-heading" className="space-y-4 lg:pt-1">
          <h2 id="states-heading" className="text-heading-sm text-ink">
            Release, delivery and review
          </h2>
          <p className="text-body-md text-muted">Three separate steps. Each is marked only when it happens.</p>
          <Careline steps={releaseSteps} orientation="vertical" size="sm" label="Release, delivery and review" />
          <ArrowLink to="/app/care/tests/progress">View test progress</ArrowLink>
        </aside>
      </div>
    </div>
  )
}

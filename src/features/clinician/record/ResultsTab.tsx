import { FileText, Hourglass } from 'lucide-react'
import { Button, Callout, EmptyState, SourceLabel, StatusBadge } from '@/components/ui'
import { EPISODE_DATES, ORG, PENDING_REPORT } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { ClinicianActions } from '../actions'
import {
  B12_REPORT,
  bookedCollection,
  CLINICIAN,
  DEMO_ORDERS,
  hasOrders,
  isReleased,
  isReviewed,
  orderStatus,
  plasmaProcessing,
} from '../data'
import { DataTable } from '../DataTable'
import { SectionHead } from '../parts'

type OrderRow = (typeof DEMO_ORDERS)[number]

export function ResultsTab({ actions }: { actions: ClinicianActions }) {
  const { state } = useDemo()
  const st = state.stage

  if (!hasOrders(st)) {
    return (
      <EmptyState title="No investigations ordered yet" icon={<FileText strokeWidth={1.75} />}>
        Orders you send appear here with their status, from collection to review. Laboratory reports arrive here too.
      </EmptyState>
    )
  }

  const failed = st === 'delivery-problem'
  const reviewed = isReviewed(st)
  const corrected = Boolean(state.lab.correctedVersion)

  return (
    <div className="space-y-10">
      <section aria-labelledby="orders-h">
        <SectionHead
          id="orders-h"
          title="Orders"
          description="Changes to an order are made here, not by the patient."
        />
        <DataTable<OrderRow>
          caption="Investigation orders for this patient"
          rowKey={(o) => o.id}
          groups={[{ id: 'orders', rows: DEMO_ORDERS }]}
          columns={[
            { key: 'test', header: 'Test', primary: true, cell: (o) => <span className="font-semibold">{o.shortName}</span> },
            { key: 'ref', header: 'Reference', cell: (o) => o.orderRef, className: 'whitespace-nowrap' },
            { key: 'ordered', header: 'Ordered', cell: (o) => <span className="tabular">{o.orderedOn} · {o.orderedBy}</span> },
            { key: 'specimen', header: 'Specimen', cell: (o) => o.specimen },
            {
              key: 'status',
              header: 'Status',
              cell: (o) => {
                const s = orderStatus(state, o.id)
                return s ? (
                  <StatusBadge tone={s.tone}>
                    {s.label}
                  </StatusBadge>
                ) : null
              },
            },
            { key: 'owner', header: 'Owner', cell: (o) => orderStatus(state, o.id)?.owner },
          ]}
        />
      </section>

      <section aria-labelledby="reports-h">
        <SectionHead id="reports-h" title="Reports" />
        <div className="space-y-6">
          {isReleased(st) ? (
            <article aria-labelledby="b12-h" className="rounded-lg border border-border bg-surface">
              <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h3 id="b12-h" className="text-heading-sm text-ink">
                    {B12_REPORT.title}
                  </h3>
                  <SourceLabel kind="lab" name={B12_REPORT.issuerLabel} />
                </div>
                <StatusBadge tone={failed ? 'warning' : 'info'} className="self-start">
                  {failed ? 'Not received' : reviewed ? `Reviewed ${EPISODE_DATES.reviewed}` : 'Not yet reviewed'}
                </StatusBadge>
              </div>
              <div className="border-b border-border px-5 py-4 sm:px-6">
                <p className="text-body-md text-muted">Result</p>
                <p className="text-data text-ink">Values in the original report (not reproduced in this prototype)</p>
              </div>
              <dl className="grid gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
                {[
                  ['Issuer', B12_REPORT.issuerLabel],
                  ['Assay', B12_REPORT.assay],
                  ['Specimen', B12_REPORT.specimen],
                  ['Collected', bookedCollection(state).collectedOn],
                  ['Released', B12_REPORT.releasedOn],
                  [
                    'Version',
                    corrected
                      ? '2 - Corrected report (version 1 superseded, still traceable)'
                      : `${B12_REPORT.versions[0].version} - ${B12_REPORT.versions[0].note}`,
                  ],
                  ['Quality flags', B12_REPORT.qualityFlags],
                  [
                    'Delivery',
                    failed ? 'Not received - delivery failed' : `Delivered to clinic ${EPISODE_DATES.released}`,
                  ],
                  [
                    'Review',
                    failed
                      ? 'Cannot be reviewed until received'
                      : reviewed
                        ? `Reviewed by ${CLINICIAN.name} · ${EPISODE_DATES.reviewed}`
                        : 'Not yet reviewed',
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0 space-y-0.5">
                    <dt className="text-body-md text-muted">{k}</dt>
                    <dd className="text-data text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-border px-5 py-5 sm:px-6">
                {failed ? (
                  <Callout tone="warning" title="Expected report not received - delivery failed">
                    <p>
                      The laboratory released this report, but it did not reach the clinic. Owner: {ORG.support}. You can
                      review it once it arrives.
                    </p>
                  </Callout>
                ) : (
                  // "Mark reviewed and update care plan" stays in the next-step panel above, so it is not repeated here.
                  <Button variant="secondary" iconLeft={<FileText className="size-5" />} onClick={() => actions.setDialog('report')}>
                    Open original report
                  </Button>
                )}
              </div>
            </article>
          ) : (
            <p className="text-body-md text-muted">No reports released yet. The laboratory releases each report when it is ready.</p>
          )}

          {plasmaProcessing(state) ? (
            <div className="flex gap-4 rounded-lg border border-border bg-surface px-5 py-5 sm:px-6">
              <Hourglass aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
              <div className="min-w-0 space-y-1">
                <h3 className="text-label text-ink">{PENDING_REPORT.title}</h3>
                <p className="text-body-md text-ink">Processing - no estimate supplied</p>
                <p className="text-body-md text-muted">{PENDING_REPORT.note}</p>
                <p className="text-body-md text-muted">Status from {ORG.referenceLab}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

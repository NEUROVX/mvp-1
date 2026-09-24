import { ClipboardList, Inbox } from 'lucide-react'
import { useState } from 'react'
import { Button, Callout, Dialog, EmptyState, PageHeader, StatusBadge } from '@/components/ui'
import { EPISODE_DATES, ORG, PENDING_REPORT } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { Tone } from '@/demo/types'
import {
  B12_REPORT,
  DEMO_ORDERS,
  hasOrders,
  isReleased,
  isReviewed,
  orderStatus,
  plasmaProcessing,
  recordTabPath,
} from '@/features/clinician/data'
import { DataTable } from '@/features/clinician/DataTable'
import { RowAction, SectionHead } from '@/features/clinician/parts'
import { usePageTitle } from '@/lib/hooks'

type OrderRow = (typeof DEMO_ORDERS)[number]

interface ResultRow {
  id: string
  report: string
  from: string
  received: string
  review: { label: string; tone: Tone }
  action: string
}

export default function OrdersPage() {
  usePageTitle('Orders & results')
  const { state } = useDemo()
  const { fullName } = usePeople()
  const [changeOpen, setChangeOpen] = useState(false)
  const st = state.stage
  const failed = st === 'delivery-problem'

  const results: ResultRow[] = []
  if (isReleased(st)) {
    const reviewed = isReviewed(st)
    results.push({
      id: 'b12',
      report: B12_REPORT.title,
      from: B12_REPORT.issuer,
      received: failed ? 'Not received - delivery failed' : `Delivered ${EPISODE_DATES.released}`,
      review: failed
        ? { label: `Owner: ${ORG.support}`, tone: 'warning' }
        : reviewed
          ? { label: `Reviewed ${EPISODE_DATES.reviewed}`, tone: 'info' }
          : { label: 'Not yet reviewed', tone: 'info' },
      action: failed ? 'View order' : reviewed ? 'Open report' : 'Review',
    })
  }
  if (plasmaProcessing(state)) {
    results.push({
      id: 'plasma',
      report: PENDING_REPORT.title,
      from: ORG.referenceLab,
      received: 'Processing - no estimate supplied',
      review: { label: 'Waiting on the laboratory', tone: 'neutral' },
      action: 'View order',
    })
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Orders & results"
        meta={<p className="text-body-md text-muted">Investigations you ordered and the reports sent to this clinic.</p>}
      />

      {failed ? (
        <Callout tone="warning" title="Expected report not received - delivery failed" role="status">
          <p>
            The Vitamin B12 report for {fullName} was released by the laboratory but did not reach the clinic. Owner:{' '}
            {ORG.support}.
          </p>
        </Callout>
      ) : null}

      <section aria-labelledby="orders-h">
        <SectionHead id="orders-h" title="Orders" description="Changes to an order are made here, not by the patient." />
        {hasOrders(st) ? (
          <DataTable<OrderRow>
            caption="Orders placed by this clinic"
            rowKey={(o) => o.id}
            groups={[{ id: 'orders', rows: DEMO_ORDERS }]}
            columns={[
              { key: 'ref', header: 'Reference', cell: (o) => o.orderRef, className: 'whitespace-nowrap' },
              {
                key: 'test',
                header: 'Test',
                primary: true,
                cell: (o) => <span className="font-semibold">{o.shortName}</span>,
              },
              { key: 'patient', header: 'Patient', cell: () => fullName, className: 'whitespace-nowrap' },
              { key: 'ordered', header: 'Ordered', cell: (o) => <span className="tabular">{o.orderedOn}</span>, className: 'whitespace-nowrap' },
              {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (o) => {
                  const s = orderStatus(state, o.id)
                  return s ? (
                    <StatusBadge tone={s.tone} size="sm">
                      {s.label}
                    </StatusBadge>
                  ) : null
                },
              },
              { key: 'owner', header: 'Owner', cell: (o) => orderStatus(state, o.id)?.owner },
              {
                key: 'action',
                header: 'Actions',
                action: true,
                cell: (o) => (
                  <span className="inline-flex flex-wrap items-center gap-x-5">
                    <RowAction to={recordTabPath('results')} context={`${o.shortName}, ${fullName}`}>
                      Open in record
                    </RowAction>
                    {st === 'tests-requested' || st === 'collection-arranged' ? (
                      <Button variant="quiet" onClick={() => setChangeOpen(true)}>
                        Change order<span className="sr-only">: {o.shortName}</span>
                      </Button>
                    ) : null}
                  </span>
                ),
              },
            ]}
          />
        ) : (
          <EmptyState
            title="No orders yet"
            icon={<ClipboardList strokeWidth={1.75} />}
            action={<Button variant="secondary" to="/pro/clinician/patients">Go to patients</Button>}
          >
            Orders you send from a patient record appear here, with their status from collection to review.
          </EmptyState>
        )}
      </section>

      <section aria-labelledby="inbox-h">
        <SectionHead id="inbox-h" title="Results inbox" description="Reports arrive here from the laboratory. Released is not the same as reviewed." />
        <DataTable<ResultRow>
          caption="Results sent to this clinic"
          rowKey={(r) => r.id}
          groups={[{ id: 'results', rows: results }]}
          empty={
            <EmptyState title="No results yet" icon={<Inbox strokeWidth={1.75} />}>
              {hasOrders(st)
                ? 'The laboratory has not released a report for your open orders yet.'
                : 'Reports for the orders you send will arrive here.'}
            </EmptyState>
          }
          columns={[
            { key: 'report', header: 'Report', primary: true, cell: (r) => <span className="font-semibold">{r.report}</span> },
            { key: 'patient', header: 'Patient', cell: () => fullName, className: 'whitespace-nowrap' },
            { key: 'from', header: 'From', cell: (r) => r.from },
            { key: 'received', header: 'Received', cell: (r) => r.received },
            {
              key: 'review',
              header: 'Review state',
              cell: (r) => (
                <StatusBadge tone={r.review.tone} size="sm">
                  {r.review.label}
                </StatusBadge>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              action: true,
              cell: (r) => (
                <RowAction to={recordTabPath('results')} context={`${r.report}, ${fullName}`}>
                  {r.action}
                </RowAction>
              ),
            },
          ]}
        />
      </section>

      <Dialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        title="Change order"
        footer={<Button onClick={() => setChangeOpen(false)}>Close</Button>}
      >
        <Callout tone="neutral" title="Concept - not available in this preview">
          <p>
            In a live service you would amend or cancel the order here, and the laboratory and the family would see the
            change. Nothing has been changed.
          </p>
        </Callout>
      </Dialog>
    </div>
  )
}

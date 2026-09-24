import { Callout, DemoTag, EmptyState, StatusBadge } from '@/components/ui'
import { ORG } from '@/demo/fixtures'
import { DataTable, type Column } from '@/features/lab/DataTable'
import type { LabOrder } from '@/features/lab/model'
import { DueCell, LabHeader, OpenOrderButton, OpenOrderLink, OrderCardHeader, PatientCell } from '@/features/lab/parts'
import { useLab } from '@/features/lab/useLab'
import { usePageTitle } from '@/lib/hooks'

function Delivery({ order }: { order: LabOrder }) {
  if (order.delivery?.status === 'failed')
    return (
      <span className="flex flex-col items-start gap-1.5">
        <StatusBadge tone="warning" className="whitespace-nowrap">Delivery failed</StatusBadge>
        <span className="text-body-md text-muted">Owner: {ORG.support}</span>
      </span>
    )
  return (
    <span className="flex flex-col items-start gap-1.5">
      <StatusBadge tone="info" className="whitespace-nowrap">Delivery confirmed</StatusBadge>
      <span className="text-body-md text-muted tabular">{order.delivery?.on}</span>
    </span>
  )
}

function Version({ order }: { order: LabOrder }) {
  return order.correctedVersion ? (
    <span className="flex flex-col items-start gap-1.5">
      <StatusBadge tone="neutral" className="whitespace-nowrap">Corrected - version 2</StatusBadge>
      <span className="text-body-md text-muted">Version 1 superseded, still traceable</span>
    </span>
  ) : (
    <span className="whitespace-nowrap">Version 1</span>
  )
}

function ClinicReview({ order }: { order: LabOrder }) {
  return order.clinicianReviewedOn ? (
    <span>
      Clinician reviewed <span className="tabular">{order.clinicianReviewedOn}</span>
      <span className="block text-metadata text-muted">Recorded by the clinic</span>
    </span>
  ) : (
    <span className="text-muted">Not reported to the lab</span>
  )
}

const RELEASED: Column<LabOrder>[] = [
  { id: 'ref', header: 'Order', stacked: false, cell: (o) => <span className="font-semibold whitespace-nowrap tabular">{o.ref}</span> },
  { id: 'patient', header: 'Patient', stacked: false, cell: (o) => <PatientCell order={o} /> },
  { id: 'test', header: 'Test', stacked: false, cell: (o) => o.test },
  {
    id: 'released',
    header: 'Lab report released',
    cell: (o) => <DueCell due={o.releasedOn ?? ''} />,
  },
  { id: 'delivery', header: 'Delivery', className: 'min-w-[12rem]', cell: (o) => <Delivery order={o} /> },
  { id: 'version', header: 'Version', className: 'min-w-[12rem]', cell: (o) => <Version order={o} /> },
  { id: 'review', header: 'Clinic review', cell: (o) => <ClinicReview order={o} /> },
  { id: 'action', header: 'Action', stacked: false, cell: (o) => <OpenOrderLink order={o} /> },
]

const PROCESSING: Column<LabOrder>[] = [
  { id: 'ref', header: 'Order', stacked: false, cell: (o) => <span className="font-semibold whitespace-nowrap tabular">{o.ref}</span> },
  { id: 'patient', header: 'Patient', stacked: false, cell: (o) => <PatientCell order={o} /> },
  { id: 'test', header: 'Test', stacked: false, cell: (o) => o.test },
  {
    id: 'lab',
    header: 'Processing lab and owner',
    cell: (o) => (
      <>
        <span className="block">{o.processingLab}</span>
        <span className="block text-body-md text-muted">{o.processingLab === ORG.lab ? 'This lab' : 'Partner laboratory'}</span>
      </>
    ),
  },
  { id: 'expected', header: 'Expected', cell: (o) => o.due },
  { id: 'action', header: 'Action', stacked: false, cell: (o) => <OpenOrderLink order={o} /> },
]

export default function ResultsPage() {
  usePageTitle('Results')
  const { orders, today } = useLab()
  const released = orders.filter((o) => o.state === 'released')
  const processing = orders.filter((o) => o.state === 'processing')

  return (
    <div className="space-y-10">
      <LabHeader
        title="Results"
        lede="Reports this lab has released, and tests still processing here or at a partner laboratory. Result values stay in the original report."
        today={today}
      />

      <section aria-labelledby="released-title" className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="released-title" className="text-heading-sm text-ink">
            Released
          </h2>
          <DemoTag>Synthetic results</DemoTag>
        </div>
        {released.length ? (
          <DataTable
            label="Released reports"
            columns={RELEASED}
            rows={released}
            rowKey={(o) => o.ref}
            minWidth="min-w-[64rem]"
            cardHeader={(o) => (
              <OrderCardHeader order={o}>
                <StatusBadge tone="info">Lab report released</StatusBadge>
              </OrderCardHeader>
            )}
            cardFooter={(o) => <OpenOrderButton order={o} />}
          />
        ) : (
          <EmptyState title="No reports released">Released reports appear here after laboratory validation.</EmptyState>
        )}
      </section>

      <section aria-labelledby="processing-title" className="space-y-5">
        <h2 id="processing-title" className="text-heading-sm text-ink">
          Processing
        </h2>
        {processing.length ? (
          <DataTable
            label="Tests processing"
            columns={PROCESSING}
            rows={processing}
            rowKey={(o) => o.ref}
            from="lg"
            minWidth="min-w-[56rem]"
            cardHeader={(o) => (
              <OrderCardHeader order={o}>
                <StatusBadge tone="neutral">Processing</StatusBadge>
              </OrderCardHeader>
            )}
            cardFooter={(o) => <OpenOrderButton order={o} />}
          />
        ) : (
          <EmptyState title="Nothing processing">Tests appear here once the specimen is received and processing starts.</EmptyState>
        )}
      </section>

      <Callout tone="neutral" title="Critical results" className="max-w-reading">
        This workspace does not monitor results or send alerts. A critical value follows the lab’s approved
        call-and-acknowledge procedure: a named person phones the ordering clinician, records the acknowledgement and
        escalates if no one answers.
      </Callout>
    </div>
  )
}

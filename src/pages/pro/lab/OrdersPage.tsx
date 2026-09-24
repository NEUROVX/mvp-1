import { AlertCircle, Search } from 'lucide-react'
import { useState } from 'react'
import { Button, DemoTag, EmptyState, Segmented, TextField } from '@/components/ui'
import { CLINICIANS } from '@/demo/fixtures'
import { DataTable, type Column } from '@/features/lab/DataTable'
import type { LabOrder } from '@/features/lab/model'
import { DueCell, LabHeader, OpenOrderButton, OpenOrderLink, OrderCardHeader, OrderStatus, PatientCell } from '@/features/lab/parts'
import { useLab } from '@/features/lab/useLab'
import { usePageTitle } from '@/lib/hooks'

type View = 'all' | 'open' | 'released'

const COLUMNS: Column<LabOrder>[] = [
  { id: 'ref', header: 'Order', stacked: false, cell: (o) => <span className="font-semibold whitespace-nowrap tabular">{o.ref}</span> },
  { id: 'patient', header: 'Patient', stacked: false, cell: (o) => <PatientCell order={o} /> },
  { id: 'test', header: 'Test', stacked: false, className: 'min-w-[9rem]', cell: (o) => o.test },
  { id: 'clinician', header: 'Ordering clinician', cell: (o) => o.orderingClinician },
  { id: 'specimen', header: 'Specimen', cell: (o) => o.specimen },
  { id: 'status', header: 'Status', stacked: false, cell: (o) => <OrderStatus order={o} /> },
  { id: 'owner', header: 'Owner', className: 'min-w-[10rem]', cell: (o) => o.owner },
  { id: 'due', header: 'Due', cell: (o) => <DueCell due={o.due} /> },
  { id: 'action', header: 'Action', stacked: false, cell: (o) => <OpenOrderLink order={o} /> },
]

function isException(o: LabOrder) {
  return o.state === 'needs-clarification' || o.delivery?.status === 'failed'
}

export default function OrdersPage() {
  usePageTitle('Orders')
  const { orders, today } = useLab()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('all')

  const q = query.trim().toLowerCase()
  const shown = orders.filter((o) => {
    if (view === 'open' && o.state === 'released') return false
    if (view === 'released' && o.state !== 'released') return false
    if (!q) return true
    return [o.ref, o.patientName, o.test, o.testExact, o.orderingClinician].some((v) => v.toLowerCase().includes(q))
  })
  const exceptions = orders.filter(isException).length
  const hasDemoPatient = orders.some((o) => o.kind !== 'background')

  return (
    <div className="space-y-8">
      <LabHeader
        title="Orders"
        lede="Every order sent to this lab, with its state, owner and next due date. Open an order to verify it and move it on."
        today={today}
        actions={
          <Button variant="secondary" to="/pro/lab/exceptions" iconLeft={<AlertCircle className="size-5" strokeWidth={1.75} />}>
            Exceptions ({exceptions})
          </Button>
        }
      />

      <section aria-labelledby="queue-title" className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="queue-title" className="text-heading-sm text-ink">
            Order queue
          </h2>
          <DemoTag>Synthetic orders</DemoTag>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="relative w-full md:max-w-lg">
            <TextField
              label="Search this lab’s orders"
              hint="Order reference, patient or test. Searches only orders sent to this lab."
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              className="[&_input]:pl-11"
            />
            <Search aria-hidden="true" className="pointer-events-none absolute bottom-3.5 left-4 size-5 text-muted" strokeWidth={1.75} />
          </div>
          <Segmented<View>
            label="Show orders"
            value={view}
            onChange={setView}
            className="self-start md:self-auto"
            options={[
              { value: 'all', label: 'All' },
              { value: 'open', label: 'In progress' },
              { value: 'released', label: 'Released' },
            ]}
          />
        </div>

        <p aria-live="polite" className="text-body-md text-muted">
          Showing <span className="tabular">{shown.length}</span> of <span className="tabular">{orders.length}</span> orders
        </p>

        {shown.length ? (
          <DataTable
            label="Order queue"
            columns={COLUMNS}
            rows={shown}
            rowKey={(o) => o.ref}
            minWidth="min-w-[68rem]"
            cardHeader={(o) => <OrderCardHeader order={o} />}
            cardFooter={(o) => <OpenOrderButton order={o} />}
          />
        ) : (
          <EmptyState
            title="No orders match"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setView('all')
                }}
              >
                Clear search
              </Button>
            }
          >
            Only orders sent to this lab are searched. Check the reference or clear the search.
          </EmptyState>
        )}

        {!hasDemoPatient ? (
          <p className="max-w-reading text-body-md text-muted">
            New orders appear here when a clinic sends them. In this demo, {CLINICIANS[0].name} has not sent the care
            episode’s orders yet.
          </p>
        ) : null}
      </section>
    </div>
  )
}

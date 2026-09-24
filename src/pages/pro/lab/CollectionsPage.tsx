import { Link } from 'react-router'
import { DemoTag, EmptyState, StatusBadge, TextLink } from '@/components/ui'
import { LAB_PROVIDERS, ORG } from '@/demo/fixtures'
import { DataTable, type Column } from '@/features/lab/DataTable'
import { shiftDate, type LabOrder } from '@/features/lab/model'
import { LabHeader, OpenOrderButton, OpenOrderLink, orderPath } from '@/features/lab/parts'
import { useLab } from '@/features/lab/useLab'
import { usePageTitle } from '@/lib/hooks'

interface CollectionRow {
  key: string
  primary: LabOrder
  orders: LabOrder[]
  day: string
  time: string
  sortKey: string
}

function dayLabel(date: string, today: string) {
  return date === today ? 'Today' : date === shiftDate(today, 1) ? `Tomorrow, ${date}` : date
}

function When({ row }: { row: CollectionRow }) {
  return (
    <span className="tabular">
      <span className="block font-semibold">{row.day}</span>
      <span className="block whitespace-nowrap">{row.time}</span>
    </span>
  )
}

function CollectionStatus({ order, today }: { order: LabOrder; today: string }) {
  if (order.state === 'collection-arranged') return <StatusBadge tone="info">Collection arranged</StatusBadge>
  const at = order.collection?.collectedOn
  return (
    <span className="flex flex-col items-start gap-1.5">
      <StatusBadge tone="info">Collected</StatusBadge>
      {at ? (
        <span className="text-body-md text-muted tabular">{at.startsWith(`${today}, `) ? at.slice(today.length + 2) : at}</span>
      ) : null}
    </span>
  )
}

function Place({ order }: { order: LabOrder }) {
  const home = order.collection?.type === 'home'
  return (
    <>
      <span className="block">{home ? 'Home collection' : 'Centre visit'}</span>
      <span className="block text-metadata text-muted">
        {home ? 'Address held by the lab, not shown here' : LAB_PROVIDERS[0].area}
      </span>
    </>
  )
}

function OrdersCell({ row }: { row: CollectionRow }) {
  return (
    <ul className="space-y-1">
      {row.orders.map((o) => (
        <li key={o.ref}>
          <span className="font-semibold tabular">{o.ref}</span>
          <span className="block text-muted">{o.test}</span>
        </li>
      ))}
    </ul>
  )
}

const columns = (today: string): Column<CollectionRow>[] => [
  { id: 'when', header: 'When', stacked: false, className: 'w-[12rem]', cell: (r) => <When row={r} /> },
  { id: 'type', header: 'Type', cell: (r) => <Place order={r.primary} /> },
  { id: 'orders', header: 'Orders', stacked: false, cell: (r) => <OrdersCell row={r} /> },
  {
    id: 'patient',
    header: 'Patient',
    stacked: false,
    cell: (r) => (
      <span className="whitespace-nowrap">
        {r.primary.patientName}, <span className="tabular">{r.primary.patientAge}</span>
      </span>
    ),
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: (r) => (r.primary.state === 'collection-arranged' ? r.primary.owner : 'Done - specimen is with the lab'),
  },
  { id: 'status', header: 'Status', stacked: false, className: 'w-[13rem]', cell: (r) => <CollectionStatus order={r.primary} today={today} /> },
  { id: 'action', header: 'Action', stacked: false, cell: (r) => <OpenOrderLink order={r.primary} /> },
]

export default function CollectionsPage() {
  usePageTitle('Collections')
  const { orders, today, state } = useLab()

  const rows: CollectionRow[] = []
  // The care episode's home collection covers both of its orders in one visit.
  if (state.stage === 'collection-arranged') {
    const episode = orders.filter((o) => o.kind !== 'background')
    const [b12] = episode
    if (b12?.collection) {
      rows.push({
        key: 'episode',
        primary: b12,
        orders: episode,
        day: dayLabel(b12.collection.date, today),
        time: b12.collection.time,
        sortKey: `${b12.collection.date === today ? 0 : 1}-${b12.collection.time}`,
      })
    }
  }
  for (const o of orders) {
    if (o.kind !== 'background' || !o.collection) continue
    if (o.state !== 'collection-arranged' && o.state !== 'collected' && o.state !== 'specimen-received') continue
    rows.push({
      key: o.ref,
      primary: o,
      orders: [o],
      day: dayLabel(o.collection.date, today),
      time: o.collection.time,
      sortKey: `${o.collection.date === today ? 0 : 1}-${o.collection.time}`,
    })
  }
  rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'en', { numeric: true }))

  const onHold = orders.find((o) => o.state === 'needs-clarification')

  return (
    <div className="space-y-8">
      <LabHeader
        title="Collections"
        lede="Home collections and centre visits booked with this lab. Check two identifiers against the order before every collection."
        today={today}
      />

      <section aria-labelledby="collections-title" className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="collections-title" className="text-heading-sm text-ink">
            Today and upcoming
          </h2>
          <DemoTag>Synthetic collections</DemoTag>
        </div>

        {rows.length ? (
          <DataTable
            label="Collections today and upcoming"
            columns={columns(today)}
            rows={rows}
            rowKey={(r) => r.key}
            from="lg"
            minWidth="min-w-[56rem]"
            cardHeader={(r) => (
              <div className="space-y-3">
                <div>
                  <p className="text-label text-ink tabular">
                    {r.day} · {r.time}
                  </p>
                  <p className="text-body-md text-ink">
                    {r.primary.patientName}, {r.primary.patientAge}
                  </p>
                </div>
                <OrdersCell row={r} />
                <CollectionStatus order={r.primary} today={today} />
              </div>
            )}
            cardFooter={(r) => <OpenOrderButton order={r.primary} label={`Open ${r.primary.ref}`} />}
          />
        ) : (
          <EmptyState title="No collections booked">Collections appear here once a patient or family books one.</EmptyState>
        )}

        <div className="max-w-reading space-y-2 text-body-md text-muted">
          {state.stage === 'collection-arranged' ? (
            <p>
              The care episode’s specimens are taken in one visit. After reception, the plasma specimen goes to{' '}
              {ORG.referenceLab} for processing.
            </p>
          ) : null}
          {onHold ? (
            <p>
              <Link to={orderPath(onHold.ref)} className="prose-link tabular">
                {onHold.ref}
              </Link>{' '}
              is not scheduled. It needs clarification from the clinic first.{' '}
              <TextLink to="/pro/lab/exceptions">See exceptions</TextLink>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}

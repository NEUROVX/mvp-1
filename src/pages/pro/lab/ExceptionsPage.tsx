import { Link } from 'react-router'
import { DemoTag, EmptyState, StatusBadge } from '@/components/ui'
import { ORDERS, ORG } from '@/demo/fixtures'
import { DataTable, type Column } from '@/features/lab/DataTable'
import type { LabOrder } from '@/features/lab/model'
import { LabHeader, OpenOrderButton, OpenOrderLink, orderPath } from '@/features/lab/parts'
import { useLab } from '@/features/lab/useLab'
import { usePageTitle } from '@/lib/hooks'

interface OpenException {
  order: LabOrder
  type: string
  what: string
  next: string
  owner: string
}

function openExceptionFor(o: LabOrder): OpenException | null {
  if (o.state === 'needs-clarification')
    return {
      order: o,
      type: 'Needs clarification',
      what: `Ambiguous request from ${o.clinic}: “${o.testExact}”. No tests or specimen are named.`,
      next: 'Request clarification from the clinic. Do not guess the tests.',
      owner: o.owner,
    }
  if (o.delivery?.status === 'failed')
    return {
      order: o,
      type: 'Delivery failed',
      what: `The report was released on ${o.delivery.on} but did not reach ${o.clinic}.`,
      next: 'NeuroVX support fixes the delivery route. The lab then retries delivery.',
      owner: ORG.support,
    }
  return null
}

const OPEN_COLUMNS: Column<OpenException>[] = [
  { id: 'type', header: 'Exception', stacked: false, className: 'w-[13rem]', cell: (e) => <StatusBadge tone="warning">{e.type}</StatusBadge> },
  {
    id: 'order',
    header: 'Order',
    stacked: false,
    className: 'w-[14rem]',
    cell: (e) => (
      <>
        <span className="block font-semibold whitespace-nowrap tabular">{e.order.ref}</span>
        <span className="block whitespace-nowrap">
          {e.order.patientName}, <span className="tabular">{e.order.patientAge}</span>
        </span>
      </>
    ),
  },
  { id: 'what', header: 'What happened', cell: (e) => e.what },
  { id: 'next', header: 'Next action', cell: (e) => e.next },
  { id: 'owner', header: 'Owner', cell: (e) => e.owner },
  { id: 'action', header: 'Action', stacked: false, cell: (e) => <OpenOrderLink order={e.order} /> },
]

interface Category {
  name: string
  meaning: string
  next: string
  owner: string
  /** Closed or open items of this type, if any. */
  items?: Array<{ ref: string; note: string }>
}

const CATEGORY_COLUMNS: Column<Category>[] = [
  { id: 'name', header: 'Type', stacked: false, className: 'w-[13rem]', cell: (c) => <span className="font-semibold">{c.name}</span> },
  { id: 'meaning', header: 'What it means', cell: (c) => c.meaning },
  { id: 'next', header: 'Next action', cell: (c) => c.next },
  { id: 'owner', header: 'Owner', cell: (c) => c.owner },
  { id: 'now', header: 'In this lab now', stacked: false, className: 'w-[14rem]', cell: (c) => <CategoryNow category={c} /> },
]

function CategoryNow({ category }: { category: Category }) {
  if (!category.items?.length) return <StatusBadge tone="neutral">None open</StatusBadge>
  return (
    <ul className="space-y-1">
      {category.items.map((it) => (
        <li key={it.ref}>
          <Link to={orderPath(it.ref)} className="prose-link font-semibold tabular">
            {it.ref}
          </Link>
          <span className="block text-body-md text-muted">{it.note}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ExceptionsPage() {
  usePageTitle('Exceptions')
  const { orders, today, state } = useLab()
  const open = orders.map(openExceptionFor).filter((e): e is OpenException => e !== null)
  const deliveryOpen = open.some((e) => e.type === 'Delivery failed')

  const categories: Category[] = [
    {
      name: 'Insufficient sample',
      meaning: 'There is not enough specimen to run the requested test.',
      next: 'Tell the ordering clinic and arrange a recollection with the patient or family.',
      owner: 'Lab coordinator (demo)',
    },
    {
      name: 'Recollection required',
      meaning: 'The specimen cannot be used, for example because it is unlabelled or damaged.',
      next: 'Book a new collection and record why. Do not run the test on the old specimen.',
      owner: 'Collection team lead (demo)',
    },
    {
      name: 'Delayed processing',
      meaning: 'Processing is later than the lab said it would be.',
      next: 'Tell the ordering clinic. Give a new estimate only if the lab has one.',
      owner: 'Lab bench lead (demo)',
    },
    {
      name: 'Corrected report',
      meaning: 'A released report needed a correction.',
      next: 'Issue a new version with the reason. Keep the original visible as superseded, and tell the clinic.',
      owner: 'Lab quality lead (demo)',
      items: state.lab.correctedVersion && orders.some((o) => o.correctedVersion)
        ? [{ ref: ORDERS[0].orderRef, note: 'Version 2 issued. Closed, still traceable.' }]
        : undefined,
    },
  ]
  if (!deliveryOpen)
    categories.push({
      name: 'Delivery failed',
      meaning: 'A released report did not reach the ordering clinic or the patient’s record.',
      next: 'NeuroVX support fixes the delivery route. The lab then retries delivery.',
      owner: ORG.support,
    })

  return (
    <div className="space-y-10">
      <LabHeader
        title="Exceptions"
        lede="Orders that cannot move forward until someone acts. Each one names the next action and who owns it."
        today={today}
      />

      <section aria-labelledby="open-title" className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="open-title" className="text-heading-sm text-ink">
            Open now
          </h2>
          <DemoTag>Synthetic orders</DemoTag>
        </div>
        {open.length ? (
          <DataTable
            label="Open exceptions"
            columns={OPEN_COLUMNS}
            rows={open}
            rowKey={(e) => e.order.ref}
            minWidth="min-w-[64rem]"
            cardHeader={(e) => (
              <div className="space-y-3">
                <StatusBadge tone="warning">{e.type}</StatusBadge>
                <div>
                  <p className="text-label text-ink tabular">{e.order.ref}</p>
                  <p className="text-body-md text-ink">
                    {e.order.patientName}, {e.order.patientAge}
                  </p>
                </div>
              </div>
            )}
            cardFooter={(e) => <OpenOrderButton order={e.order} />}
          />
        ) : (
          <EmptyState title="No open exceptions">Every order in the queue can move forward.</EmptyState>
        )}
      </section>

      <section aria-labelledby="types-title" className="space-y-5">
        <div className="max-w-reading space-y-1">
          <h2 id="types-title" className="text-heading-sm text-ink">
            Other exception types
          </h2>
          <p className="text-body-md text-muted">
            None of these are open in this demo. Each has a named owner and a next action before it happens.
          </p>
        </div>
        <DataTable
          label="Exception types"
          columns={CATEGORY_COLUMNS}
          rows={categories}
          rowKey={(c) => c.name}
          from="lg"
          minWidth="min-w-[56rem]"
          cardHeader={(c) => (
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-label text-ink">{c.name}</p>
              <CategoryNow category={c} />
            </div>
          )}
        />
      </section>
    </div>
  )
}

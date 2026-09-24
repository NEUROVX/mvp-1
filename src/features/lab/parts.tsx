import { clsx } from 'clsx'
import { ArrowRight, CalendarDays } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PageHeader, StatusBadge } from '@/components/ui'
import { STATE_LABEL, STATE_TONE, type LabOrder } from './model'

export const orderPath = (ref: string) => `/pro/lab/orders/${ref}`

/** Workspace page header: h1, one-line purpose and the demo's "today". */
export function LabHeader({ title, lede, today, actions }: { title: string; lede: ReactNode; today: string; actions?: ReactNode }) {
  return (
    <PageHeader
      title={title}
      meta={
        <div className="space-y-2">
          <p className="max-w-reading text-body-md text-muted">{lede}</p>
          <p className="inline-flex items-center gap-2 text-body-md text-ink">
            <CalendarDays aria-hidden="true" className="size-5 text-muted" strokeWidth={1.75} />
            <span>
              <span className="text-muted">Today in this demo: </span>
              <time className="font-medium tabular">{today}</time>
            </span>
          </p>
        </div>
      }
      actions={actions}
    />
  )
}

/** Operational state as text. Delivery and the clinic's review are shown separately from the lab's release. */
export function OrderStatus({ order, className }: { order: LabOrder; className?: string }) {
  return (
    <div className={clsx('flex flex-col items-start gap-1.5', className)}>
      <StatusBadge tone={STATE_TONE[order.state]} className="whitespace-nowrap">
        {STATE_LABEL[order.state]}
      </StatusBadge>
      {order.delivery?.status === 'failed' ? <StatusBadge tone="warning" className="whitespace-nowrap">Delivery failed</StatusBadge> : null}
      {order.delivery?.status === 'confirmed' ? (
        <span className="text-body-md text-muted">
          Delivery confirmed <span className="tabular whitespace-nowrap">{order.delivery.on}</span>
        </span>
      ) : null}
      {order.correctedVersion ? <StatusBadge tone="neutral" className="whitespace-nowrap">Corrected - version 2</StatusBadge> : null}
      {order.clinicianReviewedOn ? (
        <span className="text-body-md text-muted">
          Clinic: clinician reviewed <span className="tabular whitespace-nowrap">{order.clinicianReviewedOn}</span>
        </span>
      ) : null}
    </div>
  )
}

/**
 * Named row action, styled like the clinician workspace's row actions
 * ("Open record →"): underlined text and an arrow, never icon-only.
 */
function OrderLink({ order, label, className }: { order: LabOrder; label: string; className?: string }) {
  return (
    <Link
      to={orderPath(order.ref)}
      className={clsx(
        'group inline-flex min-h-12 items-center gap-1.5 text-label whitespace-nowrap text-primary hover:text-primary-hover',
        className,
      )}
    >
      <span className="underline decoration-1 underline-offset-[5px] group-hover:decoration-2">{label}</span>
      {label.includes(order.ref) ? null : <span className="sr-only"> {order.ref}</span>}
      <ArrowRight aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2} />
    </Link>
  )
}

/** Named "Open order" action for a table row. */
export function OpenOrderLink({ order }: { order: LabOrder }) {
  return <OrderLink order={order} label="Open order" className="-my-3" />
}

/** The same named action at the foot of a stacked record. */
export function OpenOrderButton({ order, label = 'Open order' }: { order: LabOrder; label?: string }) {
  return <OrderLink order={order} label={label} />
}

/** Stacked-record header: reference, patient, test, then status. */
export function OrderCardHeader({ order, children }: { order: LabOrder; children?: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="min-w-0">
        <p className="text-label text-ink tabular">{order.ref}</p>
        <p className="text-body-md text-ink">
          {order.patientName}, {order.patientAge}
        </p>
        <p className="text-body-md text-muted">{order.test}</p>
      </div>
      {children ?? <OrderStatus order={order} />}
    </div>
  )
}

/** A due date: date and time on separate lines so neither breaks mid-way. */
export function DueCell({ due }: { due: string }) {
  const i = due.indexOf(', ')
  if (i < 0 || !/\d{4}$/.test(due.slice(0, i)))
    return <span className={clsx('tabular', /^\d{2} \w{3} \d{4}$/.test(due) && 'whitespace-nowrap')}>{due}</span>
  return (
    <span className="tabular">
      <span className="whitespace-nowrap">{due.slice(0, i)}</span>
      <span className="block whitespace-nowrap text-muted">{due.slice(i + 2)}</span>
    </span>
  )
}

/** Patient cell: name and age. */
export function PatientCell({ order }: { order: LabOrder }) {
  return (
    <span className="whitespace-nowrap">
      {order.patientName}, <span className="tabular">{order.patientAge}</span>
    </span>
  )
}

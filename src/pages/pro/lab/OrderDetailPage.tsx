import { ArrowLeft, FileSearch } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, DemoTag, Divider, EmptyState, PageHeader } from '@/components/ui'
import { CLINICIANS, ORDERS } from '@/demo/fixtures'
import { OrderActions } from '@/features/lab/OrderActions'
import { IdentityCheck, ReportSection, RequestedTest, StateLine } from '@/features/lab/OrderSections'
import { useLab } from '@/features/lab/useLab'
import { usePageTitle } from '@/lib/hooks'

function BackToOrders() {
  return (
    <Link to="/pro/lab" className="-ml-1 inline-flex min-h-12 items-center gap-2 px-1 text-label text-primary hover:text-primary-hover">
      <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2} />
      All orders
    </Link>
  )
}

export default function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const { orders, today } = useLab()
  const order = orders.find((o) => o.ref === orderId)
  const [correctionReason, setCorrectionReason] = useState<string>()
  usePageTitle(order || ORDERS.some((o) => o.orderRef === orderId) ? `Order ${orderId}` : 'Order not found')

  if (!order) {
    const notYet = ORDERS.some((o) => o.orderRef === orderId)
    return (
      <div className="space-y-6">
        <BackToOrders />
        <PageHeader
          title={
            notYet ? (
              <>
                Order <span className="whitespace-nowrap">{orderId}</span>
              </>
            ) : (
              'Order not found'
            )
          }
        />
        <EmptyState
          icon={<FileSearch strokeWidth={1.75} />}
          title={notYet ? 'Not in this lab’s queue yet' : 'No matching order in this lab’s queue'}
          action={
            <Button variant="secondary" to="/pro/lab">
              Back to orders
            </Button>
          }
        >
          {notYet
            ? `In this demo, ${CLINICIANS[0].name} has not sent this order yet. It appears in the queue once the clinic sends it.`
            : `There is no order with the reference “${orderId}”. Check the reference. The order may have been sent to another lab.`}
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackToOrders />
      <PageHeader
        title={
          <>
            Order <span className="whitespace-nowrap">{order.ref}</span>
          </>
        }
        meta={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body-md text-muted">
            <span className="text-ink">
              {order.test} · {order.patientName}, {order.patientAge}
            </span>
            <DemoTag>{order.kind === 'background' ? 'Synthetic order' : 'Demo episode'}</DemoTag>
          </p>
        }
      />

      {/* Mobile order: state and action first, then details, then the state line. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:grid-rows-[auto_auto_1fr] lg:items-start xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="lg:col-start-2 lg:row-start-1">
          <OrderActions key={order.ref} order={order} onCorrected={setCorrectionReason} />
        </div>

        <div className="min-w-0 space-y-8 rounded-lg border border-border bg-surface p-5 sm:p-8 lg:col-start-1 lg:row-span-3 lg:row-start-1">
          <IdentityCheck order={order} />
          <Divider />
          <RequestedTest order={order} />
          <Divider />
          <ReportSection order={order} today={today} correctionReason={correctionReason} />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <StateLine order={order} />
        </div>
      </div>
    </div>
  )
}

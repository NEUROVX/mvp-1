import { ArrowRight, FlaskConical } from 'lucide-react'
import { useId } from 'react'
import {
  ArrowLink,
  Button,
  DemoTag,
  DescriptionList,
  Disclosure,
  EmptyState,
  PageHeader,
  SourceLabel,
  StatusBadge,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES, ORDERS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { InvestigationOrder } from '@/demo/types'
import { AccessGate } from '@/features/records/AccessGate'
import { QuietRoutes } from '@/features/tests/components'
import { bookingFor, COLLECTION_TEXT, orderStatus, reviewBadge, reviewStateFor } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

const LEARN_TESTS = `/app/learn/neurolearn?q=${encodeURIComponent('What does this test measure?')}`

const OTHER_ROUTES = [
  {
    to: '/app/care/reports-upload?type=order',
    label: 'Upload an order to be checked',
    detail: 'Have an order from another clinician? It is checked before anything is booked.',
  },
  { to: '/app/care/visit#questions', label: 'Ask a clinician about a test' },
  { to: LEARN_TESTS, label: 'Learn about tests' },
]

/** P12 · Tests requested by your clinician. */
export default function RequestedTestsPage() {
  usePageTitle('Tests requested by your clinician')
  const { state } = useDemo()
  const { hasRecordAccess } = usePeople()
  const requested = hasReached(state.stage, 'tests-requested')
  const booking = bookingFor(state)
  const first = ORDERS[0]

  // A helper without record access sees only the access route (PATIENT.md › Access incomplete).
  if (!requested || !hasRecordAccess) {
    return (
      <div className="space-y-10">
        <PageHeader title="Tests requested by your clinician" />
        <AccessGate>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <EmptyState icon={<FlaskConical strokeWidth={1.75} />} title="No tests have been requested" className="self-start">
              <p>Tests are only arranged when your clinician asks for them.</p>
            </EmptyState>
            <QuietRoutes title="Other options" links={OTHER_ROUTES} />
          </div>
        </AccessGate>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Tests requested by your clinician"
        lede={
          <>
            {first.orderedBy} requested these tests after the visit on {EPISODE_DATES.testsRequested}.{' '}
            <span className="text-ink">Changes to this order need your clinician.</span>
          </>
        }
        actions={
          booking ? (
            <Button to="/app/care/tests/progress" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full md:w-auto">
              View progress
            </Button>
          ) : (
            <Button to="/app/care/tests/providers" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full md:w-auto">
              <span className="sm:hidden">Choose where to test</span>
              <span className="hidden sm:inline">Choose where to complete your tests</span>
            </Button>
          )
        }
      />

      <AccessGate>
        <div className="space-y-10">
          {booking ? (
            <p className="max-w-reading text-body-lg text-ink">
              Booked with <span className="font-semibold">{booking.provider.name}</span>:{' '}
              {COLLECTION_TEXT[booking.collection].toLowerCase()}, {booking.date}, {booking.time}.
            </p>
          ) : null}

          <section aria-label="Requested tests" className="rounded-lg border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-8">
              <p className="text-body-md text-muted">
                <span className="font-semibold text-ink">{ORDERS.length} tests</span> · Ordered by {first.orderedBy} on{' '}
                {first.orderedOn}
              </p>
              <DemoTag />
            </div>
            <ul className="divide-y divide-border">
              {ORDERS.map((o) => (
                <li key={o.id}>
                  <OrderSection order={o} />
                </li>
              ))}
            </ul>
          </section>

          <QuietRoutes title="Questions about these tests?" links={OTHER_ROUTES} className="max-w-reading" />
        </div>
      </AccessGate>
    </div>
  )
}

function OrderSection({ order }: { order: InvestigationOrder }) {
  const { state } = useDemo()
  const titleId = useId()
  const status = orderStatus(order.id, state)
  const review = reviewStateFor(order.id, state)
  const badge = reviewBadge(review)

  return (
    <article aria-labelledby={titleId} className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          {badge ? <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge> : null}
          {review.deliveryFailed ? <StatusBadge tone="warning">Not yet shared with the care team</StatusBadge> : null}
          <span className="text-body-md text-muted tabular">{order.orderRef}</span>
        </div>
        <h2 id={titleId} className="text-heading-md text-ink">
          {order.name}
        </h2>
        <p className="text-body-md text-muted">
          Ordered by {order.orderedBy} on {order.orderedOn}
        </p>
        <p className="max-w-reading text-body-lg text-ink">{order.explanation}</p>
        <SourceLabel kind="clinician" name={order.explanationSource} />
        {order.limitations ? (
          <Disclosure summary="About this test" className="mt-2 max-w-reading">
            <p className="text-body-lg">{order.limitations}</p>
          </Disclosure>
        ) : null}
        {review.released ? (
          <div className="pt-1">
            <ArrowLink to={`/app/records/reports/${order.id}`}>View report</ArrowLink>
          </div>
        ) : null}
      </div>
      <DescriptionList
        className="content-start lg:border-l lg:border-border lg:pl-8"
        items={[
          { term: 'Specimen', detail: order.specimen },
          {
            term: 'Collection',
            detail: order.homeCollection
              ? 'Home collection or a centre visit, where the provider offers it'
              : 'At the provider’s centre',
          },
          { term: 'Preparation', detail: order.preparation },
        ]}
      />
    </article>
  )
}

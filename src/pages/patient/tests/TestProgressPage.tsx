import { clsx } from 'clsx'
import { ArrowRight, CalendarDays, Clock3, FlaskConical, House, MapPin } from 'lucide-react'
import { useId } from 'react'
import { useLocation } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  Careline,
  DemoTag,
  EmptyState,
  PageHeader,
  StatusBadge,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { ORDERS, ORG } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { InvestigationOrder } from '@/demo/types'
import { AccessGate } from '@/features/records/AccessGate'
import { bookingFor, COLLECTION_TEXT, orderStatus, progressFor, reviewBadge } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

/** P15 · Test progress: one lab line per order, then delivery and review as separate steps. */
export default function TestProgressPage() {
  usePageTitle('Test progress')
  const { state } = useDemo()
  const location = useLocation()
  const justBooked = Boolean((location.state as { justBooked?: boolean } | null)?.justBooked)
  const requested = hasReached(state.stage, 'tests-requested')
  const booking = bookingFor(state)
  const collected = hasReached(state.stage, 'report-released') || Boolean(state.lab.b12 && state.lab.b12 !== 'received')

  return (
    <div className="space-y-10">
      <PageHeader
        title="Test progress"
        lede="Each test moves on its own. Release by the laboratory, delivery to the care team and clinician review are separate steps."
      />

      <AccessGate>
        {!requested ? (
          <EmptyState
            icon={<FlaskConical strokeWidth={1.75} />}
            title="No tests in progress"
            action={<ArrowLink to="/app/care/tests">Tests requested by your clinician</ArrowLink>}
          >
            <p>Tests are only arranged when your clinician asks for them.</p>
          </EmptyState>
        ) : (
          <div className="space-y-10">
            {justBooked && booking ? (
              <Callout tone="info" role="status" title={`Booked. ${booking.provider.name} confirmed your collection (demo).`}>
                <p>Saved in this browser tab. You can follow each test below.</p>
              </Callout>
            ) : null}

            {!booking ? (
              <Callout
                tone="info"
                title="Collection is not booked yet"
                action={
                  <Button to="/app/care/tests/providers" iconRight={<ArrowRight className="size-5" />}>
                    Choose a provider
                  </Button>
                }
              >
                <p>Choose a provider that can do both tests. Progress starts once the collection is booked.</p>
              </Callout>
            ) : null}

            {booking && !collected ? <PreparationPanel /> : null}

            {state.stage === 'delivery-problem' ? (
              <Callout
                tone="warning"
                title="Your report is available, but has not reached the care team"
                action={
                  <Button to="/app/support#sharing" variant="secondary">
                    Get help sharing
                  </Button>
                }
              >
                <p>
                  The laboratory released the Vitamin B12 report. Sending it to {ORG.clinic} failed. NeuroVX support is
                  following up.
                </p>
                <p>Owner: {ORG.support}</p>
              </Callout>
            ) : null}

            <div className="space-y-6">
              {ORDERS.map((o) => (
                <OrderProgress key={o.id} order={o} />
              ))}
            </div>
          </div>
        )}
      </AccessGate>
    </div>
  )
}

function PreparationPanel() {
  const { state } = useDemo()
  const booking = bookingFor(state)!
  const home = booking.collection === 'home'
  return (
    <section aria-labelledby="prep-heading" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-label text-primary">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full border-2 border-primary" />
          Your collection visit
        </p>
        <StatusBadge tone="info">Booked</StatusBadge>
      </div>
      <h2 id="prep-heading" className="mt-4 text-heading-md text-ink">
        Preparation
      </h2>
      <p className="mt-2 max-w-reading text-body-lg text-ink">
        {booking.provider.name} confirms any preparation before the visit. NeuroVX does not add fasting or medicine
        instructions.
      </p>
      <ul className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
        <li className="flex items-start gap-2.5 text-body-md text-ink">
          <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
          <span className="tabular">
            {booking.date}, {booking.time}
          </span>
        </li>
        <li className="flex items-start gap-2.5 text-body-md text-ink">
          {home ? (
            <House aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
          ) : (
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
          )}
          <span>
            {COLLECTION_TEXT[booking.collection]} by {booking.provider.name}
            <span className="block text-muted">
              {home ? 'Address confirmed with the provider - not collected in this preview' : booking.provider.area}
            </span>
          </span>
        </li>
      </ul>
    </section>
  )
}

function OrderProgress({ order }: { order: InvestigationOrder }) {
  const { state } = useDemo()
  const titleId = useId()
  const p = progressFor(order, state)
  const status = orderStatus(order.id, state)
  const review = reviewBadge(p.review)

  return (
    <article aria-labelledby={titleId} className="rounded-lg border border-border bg-surface">
      <header className="space-y-3 border-b border-border px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          {review ? <StatusBadge tone={review.tone}>{review.label}</StatusBadge> : null}
          {p.review.deliveryFailed ? <StatusBadge tone="warning">Not yet shared with the care team</StatusBadge> : null}
          <span className="text-body-md text-muted tabular">{order.orderRef}</span>
          <DemoTag className="ml-auto" />
        </div>
        <h2 id={titleId} className="text-heading-md text-ink">
          {order.shortName}
        </h2>
        <p className="flex items-start gap-2 text-body-md text-muted">
          <Clock3 aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
          <span>
            <span className="font-semibold text-ink">Last update:</span>{' '}
            <span className="tabular">{p.last.when}</span> · {p.last.what}.{' '}
            <span>Responsible: {p.last.who}</span>
          </span>
        </p>
        {p.note ? <p className="max-w-reading text-body-md text-ink">{p.note}</p> : null}
        {p.review.released ? (
          <ArrowLink to={`/app/records/reports/${order.id}`}>View report</ArrowLink>
        ) : null}
      </header>
      <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-2 md:gap-12">
        <div className="min-w-0">
          <h3 className="mb-4 text-label text-ink">At the laboratory</h3>
          <Careline steps={p.lab} orientation="vertical" label={`${order.shortName}: laboratory progress`} />
        </div>
        <div className={clsx('min-w-0 md:border-l md:border-border md:pl-12', p.review.released && 'order-first md:order-none')}>
          <h3 className="mb-4 text-label text-ink">After release</h3>
          <Careline steps={p.after} orientation="vertical" label={`${order.shortName}: delivery and review`} />
        </div>
      </div>
    </article>
  )
}

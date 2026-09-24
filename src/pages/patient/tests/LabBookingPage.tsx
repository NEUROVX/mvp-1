import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  DemoTag,
  DescriptionList,
  EmptyState,
  PageHeader,
  RadioGroup,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { labById, ORDERS } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { LabProvider } from '@/demo/types'
import { BackLink } from '@/features/booking/BackLink'
import { AccessGate } from '@/features/records/AccessGate'
import { capabilityOf, COLLECTION_OPTION_TEXT, collectionOptionsFor } from '@/features/tests/components'
import { bookingFor } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

type Collection = 'home' | 'visit'

/** P14 · Book sample collection (focused layout). */
export default function LabBookingPage() {
  usePageTitle('Book sample collection')
  const [params] = useSearchParams()
  const { state } = useDemo()
  const provider = labById(params.get('provider') ?? undefined)
  const booking = bookingFor(state)

  let body
  if (!hasReached(state.stage, 'tests-requested')) {
    body = (
      <EmptyState
        title="No tests have been requested"
        action={<ArrowLink to="/app/care/tests">Tests requested by your clinician</ArrowLink>}
      >
        <p>Tests are only arranged when your clinician asks for them.</p>
      </EmptyState>
    )
  } else if (booking) {
    body = (
      <Callout
        tone="info"
        title={`Your collection is already booked with ${booking.provider.name}`}
        action={
          <Button to="/app/care/tests/progress" iconRight={<ArrowRight className="size-5" />}>
            View progress
          </Button>
        }
      >
        <p>
          {COLLECTION_OPTION_TEXT[booking.collection]}, {booking.date}, {booking.time}. Changes to a booking go through
          the provider.
        </p>
      </Callout>
    )
  } else if (!provider) {
    body = (
      <EmptyState
        title="We could not find this provider"
        action={<ArrowLink to="/app/care/tests/providers">Back to the list of providers</ArrowLink>}
      >
        <p>Choose a provider from the list. Your clinician’s order has not changed.</p>
      </EmptyState>
    )
  } else if (!capabilityOf(provider).all) {
    body = (
      <EmptyState
        title="This provider does not offer every requested test"
        action={<ArrowLink to="/app/care/tests/providers">Choose another provider</ArrowLink>}
      >
        <p>You would need a second provider for the other test. Booking two providers is a concept - not available in this preview.</p>
      </EmptyState>
    )
  } else {
    body = <BookingForm provider={provider} />
  }

  return (
    <div className="space-y-8">
      <BackLink to="/app/care/tests/providers">Back to providers</BackLink>
      <PageHeader
        title="Book sample collection"
        lede="Check the details, then choose how and when the sample is collected."
      />
      <AccessGate>{body}</AccessGate>
    </div>
  )
}

function BookingForm({ provider }: { provider: LabProvider }) {
  const { set, setStage } = useDemo()
  const { fullName, you } = usePeople()
  const navigate = useNavigate()
  const options = collectionOptionsFor(provider)
  const [collection, setCollection] = useState<Collection>(options[0])
  const [slotId, setSlotId] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const slotsRef = useRef<HTMLDivElement>(null)

  const slots = provider.slots.filter((s) => s.collection === collection)
  const orderedBy = ORDERS[0].orderedBy

  const book = () => {
    const slot = slots.find((s) => s.id === slotId)
    if (!slot) {
      setError('Choose a collection time.')
      slotsRef.current?.querySelector<HTMLInputElement>('input')?.focus()
      return
    }
    set({ labBooking: { providerId: provider.id, slotId: slot.id, collection } })
    setStage('collection-arranged')
    navigate('/app/care/tests/progress', { state: { justBooked: true } })
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        book()
      }}
      className="space-y-8"
    >
      <section aria-labelledby="summary-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="summary-heading" className="text-heading-sm text-ink">
            Summary
          </h2>
          <DemoTag />
        </div>
        <DescriptionList
          className="mt-5"
          items={[
            {
              term: 'Tests',
              detail: (
                <ul className="space-y-1">
                  {ORDERS.map((o) => (
                    <li key={o.id}>{o.name}</li>
                  ))}
                </ul>
              ),
            },
            {
              term: 'Provider',
              detail: (
                <>
                  {provider.name} - {provider.label.toLowerCase()}
                  <span className="block font-normal text-muted">{provider.area}</span>
                </>
              ),
            },
            ...(provider.processingLab ? [{ term: 'Processing laboratory', detail: provider.processingLab }] : []),
            { term: 'Patient', detail: fullName },
            { term: 'Ordered by', detail: `${orderedBy}, ${ORDERS[0].orderedOn}` },
          ]}
        />
      </section>

      <section aria-labelledby="when-heading" className="space-y-6">
        <h2 id="when-heading" className="text-heading-sm text-ink">
          Collection
        </h2>
        <RadioGroup<Collection>
          name="collection"
          legend="How should the sample be collected?"
          value={collection}
          onChange={(v) => {
            setCollection(v)
            setSlotId(undefined)
            setError(undefined)
          }}
          options={options.map((o) => ({
            value: o,
            label: COLLECTION_OPTION_TEXT[o],
            description:
              o === 'home'
                ? 'A collector from the provider comes to the patient’s home. Address confirmed with the provider - not collected in this preview.'
                : `At ${provider.name}, ${provider.area}.`,
          }))}
        />
        <div ref={slotsRef}>
          <RadioGroup
            name="slot"
            legend="Choose a time"
            hint="Times offered by the provider for this collection type."
            error={error}
            value={slotId}
            onChange={(v) => {
              setSlotId(v)
              setError(undefined)
            }}
            columns={2}
            options={slots.map((s) => ({ value: s.id, label: s.date, description: s.time }))}
          />
        </div>
      </section>

      <section aria-labelledby="terms-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
        <h2 id="terms-heading" className="text-heading-sm text-ink">
          Cost, preparation and sharing
        </h2>
        <DescriptionList
          className="mt-5"
          items={[
            {
              term: 'Total',
              detail: (
                <>
                  <span className="tabular">{provider.fee}</span>
                  <span className="block font-normal text-muted">{provider.feeNote}</span>
                </>
              ),
            },
            { term: 'Discount', detail: 'No discount in this preview' },
            { term: 'Cancellation', detail: 'The provider sets cancellation terms. Placeholder - not shown in this preview.' },
            {
              term: 'Preparation',
              detail: 'The provider will confirm any preparation. NeuroVX does not add fasting or medicine instructions.',
            },
            { term: 'Who receives the report', detail: `The report will go to ${you} and to ${orderedBy}, who ordered it.` },
          ]}
        />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Book sample collection
        </Button>
        <Button to="/app/care/tests/providers" variant="quiet">
          Choose a different provider
        </Button>
      </div>
    </form>
  )
}

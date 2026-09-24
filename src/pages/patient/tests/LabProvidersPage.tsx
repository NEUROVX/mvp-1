import { ArrowRight, List, Map as MapIcon, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  ArrowLink,
  Button,
  Callout,
  DemoTag,
  EmptyState,
  PageHeader,
  SampleMap,
  Segmented,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { DEMO_AREA, LAB_PROVIDERS } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import { AccessGate } from '@/features/records/AccessGate'
import {
  ChoiceChips,
  collectionOptionsFor,
  ProviderCard,
  sortByCapability,
  TestsNeeded,
} from '@/features/tests/components'
import { bookingFor } from '@/features/tests/progress'
import { usePageTitle } from '@/lib/hooks'

type CollectionFilter = 'any' | 'home' | 'visit'
type View = 'list' | 'map'

/** P13 · Find a lab: capability-matched list first, sample map as an alternative view. */
export default function LabProvidersPage() {
  usePageTitle('Choose where to complete your tests')
  const { state } = useDemo()
  const requested = hasReached(state.stage, 'tests-requested')
  const booking = bookingFor(state)
  const [collection, setCollection] = useState<CollectionFilter>('any')
  const [view, setView] = useState<View>('list')
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const providers = useMemo(
    () =>
      sortByCapability(
        LAB_PROVIDERS.filter((p) => collection === 'any' || collectionOptionsFor(p).includes(collection)),
      ),
    [collection],
  )
  const selected = providers.find((p) => p.id === selectedId) ?? providers[0]

  if (!requested) {
    return (
      <div className="space-y-10">
        <PageHeader title="Choose where to complete your tests" />
        <EmptyState
          title="No tests have been requested"
          action={<ArrowLink to="/app/care/tests">Tests requested by your clinician</ArrowLink>}
        >
          <p>Tests are only arranged when your clinician asks for them.</p>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Choose where to complete your tests"
        lede="Pick a provider that can do the tests your clinician requested. You choose the place and time. The tests stay as ordered."
      />

      <AccessGate>
        <div className="space-y-10">
          {booking ? (
            <Callout
              tone="info"
              title={`Your collection is booked with ${booking.provider.name}`}
              action={
                <Button to="/app/care/tests/progress" variant="secondary" iconRight={<ArrowRight className="size-5" />}>
                  View progress
                </Button>
              }
            >
              <p>Changes to a booking go through the provider. The list below is for reference.</p>
            </Callout>
          ) : null}

          <div className="grid gap-8 rounded-lg border border-border bg-surface p-5 sm:p-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
            <TestsNeeded />
            <div className="space-y-3 lg:border-l lg:border-border lg:pl-8">
              <h2 className="text-label text-ink">How providers are listed</h2>
              <p className="text-body-md text-ink">
                Providers that offer every requested test are listed first. Then by distance.
              </p>
              <p className="text-body-md text-muted">
                Search area: {DEMO_AREA}. Distance is not a measure of quality.
              </p>
            </div>
          </div>

          <section aria-labelledby="providers-heading" className="space-y-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <ChoiceChips<CollectionFilter>
                legend="Collection"
                name="collection"
                value={collection}
                onChange={(v) => {
                  setCollection(v)
                  setSelectedId(undefined)
                }}
                options={[
                  { value: 'any', label: 'Any' },
                  { value: 'home', label: 'Home collection' },
                  { value: 'visit', label: 'Visit a centre' },
                ]}
              />
              <Segmented<View>
                label="Show providers as"
                value={view}
                onChange={setView}
                options={[
                  { value: 'list', label: 'List', icon: <List /> },
                  { value: 'map', label: 'Map', icon: <MapIcon /> },
                ]}
                className="self-start md:self-auto"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <h2 id="providers-heading" className="text-heading-sm text-ink" aria-live="polite">
                {providers.length === 1 ? '1 provider' : `${providers.length} providers`} in this search
              </h2>
              <DemoTag />
            </div>

            {providers.length === 0 ? (
              <EmptyState
                icon={<SearchX strokeWidth={1.75} />}
                title="No matching provider in this search"
                action={
                  <div className="flex flex-col gap-1">
                    <ArrowLink to="/app/support">Ask support to help find a provider</ArrowLink>
                    <ArrowLink to="/app/care/reports-upload?type=order">Use a provider outside NeuroVX and add the report</ArrowLink>
                  </div>
                }
              >
                <p>Try another collection option. Your clinician’s order stays exactly as written.</p>
              </EmptyState>
            ) : view === 'list' ? (
              <ol className="space-y-6">
                {providers.map((p) => (
                  <li key={p.id}>
                    <ProviderCard provider={p} canChoose={!booking} />
                  </li>
                ))}
              </ol>
            ) : (
              <div className="space-y-6">
                <SampleMap
                  label="Sample map of providers in this search"
                  points={providers.map((p) => ({ id: p.id, label: p.name, ...p.mapPosition }))}
                  selectedId={selected?.id}
                  onSelect={setSelectedId}
                />
                {selected ? (
                  <div className="space-y-3">
                    <p className="text-body-md text-muted" role="status">
                      Selected on the map: <span className="font-semibold text-ink">{selected.name}</span>
                    </p>
                    <ProviderCard provider={selected} selected canChoose={!booking} />
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </AccessGate>
    </div>
  )
}

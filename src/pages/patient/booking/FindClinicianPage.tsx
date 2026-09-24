import { clsx } from 'clsx'
import { ChevronDown, Info, List, LocateFixed, Map as MapIcon, SlidersHorizontal, TriangleAlert } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  DemoTag,
  EmptyState,
  PageHeader,
  SampleMap,
  Segmented,
  SelectField,
  TextField,
  TextLink,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { CLINICIANS, clinicianById, DEMO_AREA } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { Clinician, VisitMode } from '@/demo/types'
import { ClinicianResult } from '@/features/booking/ClinicianResult'
import {
  clinicianType,
  distanceKm,
  feeAmount,
  hasActiveBooking,
  nextSlot,
  slotTime,
  TYPE_LABEL,
  type ClinicianType,
} from '@/features/booking/lib'
import { usePageTitle } from '@/lib/hooks'

type View = 'list' | 'map'
type Sort = 'soonest' | 'nearest' | 'fee'
interface Filters {
  view: View
  mode: VisitMode | 'any'
  type: ClinicianType | 'any'
  lang: string
  sort: Sort
}

const SORT_LABEL: Record<Sort, string> = {
  soonest: 'Soonest available',
  nearest: 'Nearest',
  fee: 'Lowest fee',
}

const LANGUAGES = Array.from(new Set(CLINICIANS.flatMap((c) => c.languages)))

/** Short pin labels keep the sample map legible at 320px. */
function pinLabel(c: Clinician) {
  if (c.name.startsWith('Dr. ')) return `Dr. ${c.name.split(' ').slice(-1)[0]}`
  return 'Primary care'
}

export default function FindClinicianPage() {
  usePageTitle('Find care near you')
  const { state } = useDemo()
  const { your } = usePeople()
  const [params, setParams] = useSearchParams()
  const [area, setArea] = useState(DEMO_AREA)
  const [locationNote, setLocationNote] = useState(false)
  const [selectedId, setSelectedId] = useState<string>()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterHeadingId = useId()
  const filterPanelId = useId()

  // Filters live in state (queued like any state update) and are mirrored to
  // the URL so Back and deep links such as ?view=map keep them.
  const [f, setF] = useState<Filters>(() => ({
    view: params.get('view') === 'map' ? 'map' : 'list',
    mode: (params.get('mode') ?? 'any') as Filters['mode'],
    type: (params.get('type') ?? 'any') as Filters['type'],
    lang: params.get('lang') ?? 'any',
    sort: (params.get('sort') ?? 'soonest') as Sort,
  }))
  const { view, mode, type, lang, sort } = f
  const activeCount = [mode, type, lang].filter((v) => v !== 'any').length
  const filtersActive = activeCount > 0

  useEffect(() => {
    const next = new URLSearchParams(window.location.search)
    const entries: Array<[keyof Filters, string, string]> = [
      ['view', view, 'list'],
      ['mode', mode, 'any'],
      ['type', type, 'any'],
      ['lang', lang, 'any'],
      ['sort', sort, 'soonest'],
    ]
    for (const [k, v, fallback] of entries) {
      if (v === fallback) next.delete(k)
      else next.set(k, v)
    }
    if (next.toString() !== new URLSearchParams(window.location.search).toString()) setParams(next, { replace: true })
  }, [view, mode, type, lang, sort, setParams])

  const update = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }))
  const clearFilters = () => update({ mode: 'any', type: 'any', lang: 'any' })

  const modeFilter = mode === 'any' ? undefined : mode
  const results = useMemo(() => {
    const list = CLINICIANS.filter(
      (c) =>
        (!modeFilter || c.modes.includes(modeFilter)) &&
        (type === 'any' || clinicianType(c) === type) &&
        (lang === 'any' || c.languages.includes(lang)),
    )
    const soonest = (c: Clinician) => {
      const s = nextSlot(c, modeFilter)
      return s ? slotTime(s) : Number.MAX_SAFE_INTEGER
    }
    return list.sort((a, b) =>
      sort === 'nearest' ? distanceKm(a) - distanceKm(b) : sort === 'fee' ? feeAmount(a) - feeAmount(b) : soonest(a) - soonest(b),
    )
  }, [modeFilter, type, lang, sort])

  const selected = results.find((c) => c.id === selectedId) ?? results[0]

  // Duplicate-booking guard (PATIENT.md › avoid duplicate bookings when two care partners act).
  const stage = state.stage
  const booked = clinicianById(state.booking.clinicianId)
  const guard =
    hasActiveBooking(stage)
      ? {
          title: 'You already have a visit request or booking',
          body: 'Check it before requesting another, so the clinic does not receive two requests.',
        }
      : hasReached(stage, 'tests-requested') && stage !== 'existing-care'
        ? {
            title: 'You already have a visit in this care episode',
            body: `To see ${booked?.name ?? 'the same clinician'} again, book a follow-up from your visit page. Choose someone new here only for a different clinician or a second opinion.`,
          }
        : null

  const countText = `${results.length} ${results.length === 1 ? 'clinician matches' : 'clinicians match'}`

  return (
    <div className="space-y-8">
      {guard ? (
        <Callout
          tone="info"
          title={guard.title}
          action={<ArrowLink to="/app/care/visit">View your visit</ArrowLink>}
        >
          <p>{guard.body}</p>
        </Callout>
      ) : null}

      <div className="space-y-4">
        <PageHeader
          title="Find care near you"
          lede={`Choose a clinician for ${your} consultation. You can meet in person or by video.`}
        />
        <p className="flex items-start gap-2.5 text-body-md text-ink">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" strokeWidth={1.75} />
          <span>
            This page is for routine appointments. For sudden or severe symptoms,{' '}
            <TextLink to="/urgent">get urgent help now</TextLink>.
          </span>
        </p>
      </div>

      {/* Search area */}
      <section aria-label="Search area" className="max-w-[46rem]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <TextField
            label="City, locality or PIN code"
            hint="This preview has sample results for one area only."
            value={area}
            onChange={(e) => setArea(e.target.value)}
            autoComplete="off"
            className="min-w-0 flex-1"
          />
          <Button
            variant="secondary"
            iconLeft={<LocateFixed className="size-5" />}
            onClick={() => setLocationNote(true)}
            className="shrink-0 whitespace-nowrap"
          >
            Use my location
          </Button>
        </div>
        <p role="status">
          {locationNote ? (
            <span className="mt-3 flex items-start gap-2 text-body-md text-ink">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
              Location is not used in this preview. Search by area instead.
            </span>
          ) : null}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        {/* Filters: always open from lg; a disclosure on smaller screens so results come sooner. */}
        <section aria-labelledby={filterHeadingId} className="lg:col-start-1 lg:row-start-1">
          <div className="hidden min-h-12 items-center justify-between gap-3 lg:flex">
            <h2 id={filterHeadingId} className="text-heading-sm text-ink">
              Filter and sort
            </h2>
            {filtersActive ? (
              <Button variant="quiet" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
          <h2 className="lg:hidden">
            <button
              type="button"
              aria-expanded={filtersOpen}
              aria-controls={filterPanelId}
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-control bg-surface px-4 text-left text-label text-ink hover:border-ink"
            >
              <span className="inline-flex items-center gap-2.5">
                <SlidersHorizontal aria-hidden="true" className="size-5 text-muted" strokeWidth={1.75} />
                Filter and sort
                {activeCount ? <span className="font-normal text-muted">({activeCount} active)</span> : null}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={clsx('size-5 shrink-0 text-muted transition-transform duration-150', filtersOpen && 'rotate-180')}
              />
            </button>
          </h2>
          <div
            id={filterPanelId}
            className={clsx('mt-4 grid-cols-2 gap-x-3 gap-y-4 lg:mt-3 lg:grid lg:grid-cols-1', filtersOpen ? 'grid' : 'hidden')}
          >
            <SelectField
              label="Visit mode"
              value={mode}
              onChange={(e) => update({ mode: e.target.value as Filters['mode'] })}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'in-clinic', label: 'In clinic' },
                { value: 'video', label: 'Video' },
              ]}
            />
            <SelectField
              label="Language"
              value={lang}
              onChange={(e) => update({ lang: e.target.value })}
              options={[{ value: 'any', label: 'Any' }, ...LANGUAGES.map((l) => ({ value: l, label: l }))]}
            />
            <SelectField
              label="Clinician type"
              value={type}
              onChange={(e) => update({ type: e.target.value as Filters['type'] })}
              className="col-span-2 lg:col-span-1"
              options={[
                { value: 'any', label: 'Any' },
                ...(Object.keys(TYPE_LABEL) as ClinicianType[]).map((t) => ({ value: t, label: TYPE_LABEL[t] })),
              ]}
            />
            <SelectField
              label="Sort by"
              value={sort}
              onChange={(e) => update({ sort: e.target.value as Sort })}
              className="col-span-2 lg:col-span-1"
              options={(Object.keys(SORT_LABEL) as Sort[]).map((s) => ({ value: s, label: SORT_LABEL[s] }))}
            />
            {filtersActive ? (
              <div className="col-span-2 lg:hidden">
                <Button variant="quiet" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        {/* Results */}
        <section aria-label="Results" className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <h2 className="sr-only">Results</h2>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p role="status" className="text-label text-ink">
                  {countText}
                </p>
                <DemoTag />
              </div>
              <p className="text-body-md text-muted">
                Sorted by {SORT_LABEL[sort].toLowerCase()}. Never by paid placement.
              </p>
            </div>
            <Segmented<View>
              label="Show results as"
              value={view}
              onChange={(v) => update({ view: v })}
              options={[
                { value: 'list', label: 'List', icon: <List /> },
                { value: 'map', label: 'Map', icon: <MapIcon /> },
              ]}
            />
          </div>

          <div className="mt-5">
            {results.length === 0 ? (
              <EmptyState
                title="No clinicians match these filters"
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              >
                Try another visit mode, clinician type or language.
              </EmptyState>
            ) : view === 'list' ? (
              <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
                {results.map((c) => (
                  <li key={c.id}>
                    <ClinicianResult clinician={c} mode={modeFilter} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-5">
                <SampleMap
                  label={`Sample map of ${results.length} ${results.length === 1 ? 'clinician' : 'clinicians'}`}
                  points={results.map((c) => ({
                    id: c.id,
                    label: pinLabel(c),
                    x: Math.min(Math.max(c.mapPosition.x, 18), 74),
                    y: Math.max(c.mapPosition.y, 24),
                  }))}
                  selectedId={selected?.id}
                  onSelect={setSelectedId}
                />
                {selected ? (
                  <div className="space-y-3">
                    <p className="text-body-md text-muted">
                      Select a pin to see that clinician. The list shows the same results.
                    </p>
                    <p role="status" className="sr-only">
                      Showing {selected.name}
                    </p>
                    <div className="rounded-lg border border-primary bg-surface">
                      <ClinicianResult clinician={selected} mode={modeFilter} />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {/* Help */}
        <section aria-labelledby="booking-help" className="border-t border-border pt-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          <h2 id="booking-help" className="text-label text-ink">
            Need help choosing, or prefer the clinic to book for you?
          </h2>
          <p className="mt-1 text-body-md text-muted">Support explains your options and how an assisted booking works.</p>
          <ArrowLink to="/app/support#assisted" className="mt-2">
            Get booking help
          </ArrowLink>
        </section>
      </div>
    </div>
  )
}

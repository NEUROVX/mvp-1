import { clsx } from 'clsx'
import { Check, CircleCheck, CircleMinus, MapPin } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { ArrowLink, Button, DescriptionList, StatusBadge } from '@/components/ui'
import { ORDERS } from '@/demo/fixtures'
import type { LabProvider } from '@/demo/types'

/* ------------------------------------------------------------------ */
/* Capability matching (PATIENT.md › P13: capability before distance)  */
/* ------------------------------------------------------------------ */

export function capabilityOf(p: LabProvider) {
  const rows = ORDERS.map((order) => {
    const offer = p.offers.find((o) => o.orderId === order.id)
    return { order, available: Boolean(offer?.available), note: offer?.note }
  })
  const count = rows.filter((r) => r.available).length
  return { rows, count, total: ORDERS.length, all: count === ORDERS.length, missing: rows.filter((r) => !r.available) }
}

function km(p: LabProvider) {
  const n = parseFloat(p.distance)
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

/** Providers that offer every requested test first, then by distance. */
export function sortByCapability(list: LabProvider[]) {
  return [...list].sort((a, b) => capabilityOf(b).count - capabilityOf(a).count || km(a) - km(b))
}

/**
 * Collection options the provider can actually use for these orders.
 * Home collection only when every order supports it; never for imaging.
 */
export function collectionOptionsFor(p: LabProvider) {
  const homeOk = ORDERS.every((o) => o.homeCollection && o.kind === 'lab')
  return p.collectionOptions.filter((c) => c !== 'home' || homeOk)
}

export const COLLECTION_OPTION_TEXT = { home: 'Home collection', visit: 'Visit the centre' } as const

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

/** The exact tests on the order, shown before any choice is made. */
export function TestsNeeded({ className, headingLevel = 2 }: { className?: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className={className}>
      <H className="text-label text-ink">Tests you need</H>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {ORDERS.map((o) => (
          <li key={o.id} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <span className="text-data text-ink">{o.name}</span>
            <span className="shrink-0 text-body-md text-muted tabular">
              {o.specimen} · <span className="whitespace-nowrap">{o.orderRef}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Radio choices drawn as wrapping chips. 48px targets, text always visible. */
export function ChoiceChips<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  className,
}: {
  legend: ReactNode
  name: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <fieldset className={clsx('min-w-0', className)}>
      <legend className="mb-2 text-label text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value
          return (
            <label
              key={o.value}
              className={clsx(
                'inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-4 text-label transition-colors duration-150',
                'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary',
                on ? 'border-primary bg-accent-soft text-primary' : 'border-control bg-surface text-ink hover:border-ink',
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={o.value}
                checked={on}
                onChange={() => onChange(o.value)}
              />
              {on ? <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} /> : null}
              {o.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Quiet alternative routes, e.g. "Ask a clinician about a test". */
export function QuietRoutes({
  title,
  links,
  className,
}: {
  title: string
  links: Array<{ to: string; label: string; detail?: string }>
  className?: string
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={className}>
      <h2 id={id} className="text-heading-sm text-ink">
        {title}
      </h2>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {links.map((l) => (
          <li key={l.to} className="py-2">
            <ArrowLink to={l.to}>{l.label}</ArrowLink>
            {l.detail ? <p className="pb-1 text-body-md text-muted">{l.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Provider card                                                       */
/* ------------------------------------------------------------------ */

export function ProviderCard({
  provider,
  selected,
  canChoose,
}: {
  provider: LabProvider
  /** Highlighted because its map pin is selected. */
  selected?: boolean
  /** False once a collection is already booked. */
  canChoose: boolean
}) {
  const titleId = useId()
  const cap = capabilityOf(provider)
  const options = collectionOptionsFor(provider)
  const facts = [
    {
      term: 'Collection options',
      detail: options
        .map((o, i) => (i === 0 ? COLLECTION_OPTION_TEXT[o] : COLLECTION_OPTION_TEXT[o].toLowerCase()))
        .join(' or '),
    },
    ...(provider.processingLab ? [{ term: 'Processing laboratory', detail: provider.processingLab }] : []),
    {
      term: 'Fee',
      detail: (
        <>
          <span className="tabular">{provider.fee}</span>
          <span className="block font-normal text-muted">{provider.feeNote}</span>
        </>
      ),
    },
    { term: 'Turnaround', detail: provider.turnaround },
    { term: 'Accessibility', detail: provider.accessibility },
    { term: 'Accreditation', detail: provider.accreditation },
  ]

  return (
    <article
      aria-labelledby={titleId}
      className={clsx(
        'rounded-lg border bg-surface p-5 transition-colors duration-150 sm:p-8',
        selected ? 'border-primary ring-1 ring-primary' : 'border-border',
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 id={titleId} className="text-heading-sm text-ink">
              {provider.name}
            </h3>
            <span className="text-body-md text-muted">{provider.label}</span>
          </div>
          <p className="flex items-start gap-2 text-body-md text-muted">
            <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            <span>
              {provider.area}
              <span className="block tabular">{provider.distance}</span>
            </span>
          </p>
        </div>
        <StatusBadge tone={cap.all ? 'info' : 'warning'} className="self-start">
          Offers {cap.count} of {cap.total} requested tests
        </StatusBadge>
      </div>

      <div className="mt-6 grid gap-8 border-t border-border pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
        <div>
          <h4 className="text-label text-ink">Requested tests</h4>
          <ul className="mt-3 space-y-4">
            {cap.rows.map((r) => (
              <li key={r.order.id} className="flex gap-3">
                {r.available ? (
                  <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2} />
                ) : (
                  <CircleMinus aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={2} />
                )}
                <div className="min-w-0">
                  <p className="text-data text-ink">{r.order.shortName}</p>
                  <p className="text-body-md text-muted">
                    <span className="font-semibold text-ink">
                      {r.available ? 'Available' : 'Not offered here'}
                    </span>
                    {r.note ? <span>. {r.note}</span> : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DescriptionList items={facts} columns={2} className="lg:border-l lg:border-border lg:pl-10" />
      </div>

      {canChoose ? (
        <div className="mt-6 border-t border-border pt-6">
          {cap.all ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button to={`/app/care/tests/book?provider=${provider.id}`} size="lg" className="w-full sm:w-auto">
                Choose this provider
              </Button>
              <p className="text-body-md text-muted">You check the details before anything is booked.</p>
            </div>
          ) : (
            <div className="max-w-reading space-y-1">
              <p className="text-label text-ink">Not selectable in this preview</p>
              <p className="text-body-md text-muted">
                You would need a second provider for the other test (
                {cap.missing.map((m) => m.order.shortName).join(', ')}). Booking two providers is a concept - not
                available in this preview.
              </p>
              <ArrowLink to="/app/support">Get help choosing a provider</ArrowLink>
            </div>
          )}
        </div>
      ) : null}
    </article>
  )
}

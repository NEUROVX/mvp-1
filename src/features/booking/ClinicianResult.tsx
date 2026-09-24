import { clsx } from 'clsx'
import { FileCheck2 } from 'lucide-react'
import { useId } from 'react'
import { Button, Initials, VisuallyHidden } from '@/components/ui'
import type { Clinician, VisitMode } from '@/demo/types'
import { locality, MODE_LABEL, modesText, nextSlot, weekdayShort } from './lib'

/**
 * One clinician in the Find care results. Calm and factual: actual specialty,
 * practical details, next slot and fee. No ratings, badges or "top" labels.
 */
export function ClinicianResult({
  clinician: c,
  mode,
  className,
}: {
  clinician: Clinician
  /** When a visit-mode filter is active, show the next slot in that mode. */
  mode?: VisitMode
  className?: string
}) {
  const titleId = useId()
  const slot = nextSlot(c, mode)
  const facts: Array<{ term: string; detail: string }> = [
    { term: 'Clinic', detail: c.clinic },
    { term: 'Location', detail: locality(c) },
    { term: 'Distance', detail: c.distance },
    { term: 'Languages', detail: c.languages.join(', ') },
    { term: 'Visit types', detail: modesText(c.modes) },
  ]

  return (
    <article aria-labelledby={titleId} className={clsx('grid gap-5 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_14.5rem] md:gap-8', className)}>
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <Initials>{c.initials}</Initials>
          <div className="min-w-0">
            <h3 id={titleId} className="text-heading-sm text-ink">
              {c.name}
            </h3>
            <p className="text-body-md text-muted">{c.label}</p>
          </div>
        </div>

        <div className="mt-4 space-y-4 md:pl-15">
          <p className="text-body-md font-semibold text-ink">{c.specialty}</p>
          <dl className="space-y-1.5 text-body-md">
            {facts.map((f) => (
              <div key={f.term} className="flex flex-wrap gap-x-2 sm:grid sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-4">
                <dt className="text-muted">{f.term}</dt>
                <dd className="min-w-0 text-ink">{f.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-1.5">
            {c.acceptsPacket ? (
              <p className="flex items-start gap-2 text-body-md text-ink">
                <FileCheck2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
                Accepts your visit packet
              </p>
            ) : null}
            <p className="text-body-md text-muted">{c.credentials}</p>
          </div>
        </div>
      </div>

      <div className="grid content-start gap-5 border-t border-border pt-5 sm:grid-cols-2 md:grid-cols-1 md:border-t-0 md:border-l md:pt-0 md:pl-8">
        <div>
          <p className="text-body-md text-muted">Next available</p>
          {slot ? (
            <>
              <p className="tabular mt-0.5 text-data text-ink">
                {weekdayShort(slot.date)} {slot.date}
              </p>
              <p className="tabular text-data text-ink">
                {slot.time} · {MODE_LABEL[slot.mode]}
              </p>
            </>
          ) : (
            <p className="mt-0.5 text-data text-ink">No times listed</p>
          )}
        </div>
        <div>
          <p className="text-body-md text-muted">Consultation fee</p>
          <p className="tabular mt-0.5 text-data text-ink">
            {c.fee}
          </p>
          <p className="text-body-md text-muted">{c.feeNote}</p>
        </div>
        <Button to={`/app/care/clinicians/${c.id}`} variant="secondary" fullWidth className="sm:col-span-2 md:col-span-1">
          View availability
          <VisuallyHidden> for {c.name}</VisuallyHidden>
        </Button>
      </div>
    </article>
  )
}

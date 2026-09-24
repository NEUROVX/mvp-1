import { clsx } from 'clsx'
import { MapPin } from 'lucide-react'

/**
 * An abstract sample map for list/map toggles (PATIENT.md › P08, P13).
 * Not a real map and no mapping service is integrated: it shows the same
 * filtered results as the list, and selecting a pin selects its list item.
 * Positions are percentages from fixtures (mapPosition).
 */
export interface MapPoint {
  id: string
  label: string
  x: number
  y: number
}

export function SampleMap({
  points,
  selectedId,
  onSelect,
  label = 'Sample map',
  className,
}: {
  points: MapPoint[]
  selectedId?: string
  onSelect: (id: string) => void
  label?: string
  className?: string
}) {
  return (
    <figure className={clsx('overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <div className="relative aspect-[4/3] w-full bg-canvas sm:aspect-[16/10]" role="group" aria-label={label}>
        <svg aria-hidden="true" viewBox="0 0 100 62.5" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <g className="stroke-border" strokeWidth="0.35" fill="none">
            {[10, 22, 34, 46, 58].map((y) => (
              <path key={`h${y}`} d={`M0 ${y} H100`} />
            ))}
            {[12, 28, 44, 60, 76, 92].map((x) => (
              <path key={`v${x}`} d={`M${x} 0 V62.5`} />
            ))}
          </g>
          <path d="M0 48 C 22 40, 40 52, 60 38 S 88 22, 100 26" className="stroke-control" strokeWidth="0.6" fill="none" strokeDasharray="1.4 1" />
          <rect x="62" y="44" width="16" height="10" rx="1.5" className="fill-accent-soft" />
          <rect x="6" y="4" width="14" height="9" rx="1.5" className="fill-accent-soft" />
        </svg>
        {points.map((p) => {
          const on = p.id === selectedId
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(p.id)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={clsx(
                'absolute z-10 inline-flex min-h-11 -translate-x-1/2 -translate-y-full items-center gap-1.5 rounded-md border px-2.5 text-metadata font-semibold shadow-1 transition-colors duration-150',
                on ? 'border-primary bg-primary text-white' : 'border-control bg-surface text-ink hover:border-primary',
              )}
            >
              <MapPin aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
              <span className="max-w-[9rem] truncate">{p.label}</span>
            </button>
          )
        })}
      </div>
      <figcaption className="border-t border-border px-4 py-3 text-body-md text-muted">
        Sample map - not to scale and not a real location. Addresses are listed as text.
      </figcaption>
    </figure>
  )
}

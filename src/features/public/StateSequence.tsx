import { clsx } from 'clsx'

/**
 * A short sequence of operational states with the owner of each one
 * (DESIGN.md › Orders, laboratory reports: keep states distinct). Explains
 * the service; it is not the progress of a real order. Horizontal from md.
 */
export interface SequenceState {
  name: string
  owner: string
}

const COLS: Record<number, string> = { 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5' }

export function StateSequence({ states, label, className }: { states: SequenceState[]; label: string; className?: string }) {
  return (
    <ol aria-label={label} className={clsx('grid gap-0 md:gap-4', COLS[states.length], className)}>
      {states.map((s, i) => {
        const last = i === states.length - 1
        return (
          <li key={s.name} className="relative flex gap-4 pb-6 last:pb-0 md:block md:pb-0">
            {!last ? (
              <>
                <span aria-hidden="true" className="absolute top-7 bottom-0 left-[11px] w-px bg-primary/30 md:hidden" />
                <span aria-hidden="true" className="absolute top-3 right-[-1rem] left-8 hidden h-px bg-primary/30 md:block" />
              </>
            ) : null}
            <span
              aria-hidden="true"
              className="relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-surface text-metadata font-semibold text-primary tabular"
            >
              {i + 1}
            </span>
            <div className="min-w-0 md:mt-3">
              <p className="text-label text-ink">{s.name}</p>
              <p className="text-body-md text-muted">{s.owner}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

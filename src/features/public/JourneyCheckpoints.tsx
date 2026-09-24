import { clsx } from 'clsx'

/**
 * The four homepage checkpoints on a public Careline (DESIGN.md › Homepage, section 3).
 * Horizontal from lg, vertical below. The first node is the entry point; the
 * testing checkpoint is drawn with a dashed node and says in words that it is
 * conditional. This is an explanation of the service, not anyone's progress.
 */
export interface Checkpoint {
  title: string
  body: string
  note?: string
  conditional?: boolean
  entry?: boolean
}

export function JourneyCheckpoints({ steps, className }: { steps: Checkpoint[]; className?: string }) {
  return (
    <ol aria-label="Care journey checkpoints" className={clsx('grid gap-0 lg:grid-cols-4 lg:gap-8', className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
            {/* Connecting line: vertical on small screens, horizontal from lg. */}
            {!last ? (
              <>
                <span aria-hidden="true" className="absolute top-10 bottom-0 left-[19px] w-px bg-primary/30 lg:hidden" />
                <span
                  aria-hidden="true"
                  className={clsx(
                    'absolute top-5 right-[-2rem] left-12 hidden h-px lg:block',
                    steps[i + 1]?.conditional || step.conditional
                      ? 'border-t border-dashed border-primary/45'
                      : 'bg-primary/30',
                  )}
                />
              </>
            ) : null}

            <span
              aria-hidden="true"
              className={clsx(
                'relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-label tabular',
                step.entry && 'bg-primary text-white ring-4 ring-accent-soft',
                !step.entry && !step.conditional && 'border-2 border-primary bg-surface text-primary',
                step.conditional && 'border-2 border-dashed border-control bg-surface text-muted',
              )}
            >
              {i + 1}
            </span>

            <div className="min-w-0 pt-1.5 lg:mt-6 lg:pt-0">
              <h3 className="text-heading-sm text-ink">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-body-md text-muted lg:max-w-[16rem]">{step.body}</p>
              {step.note ? (
                <p className="mt-3 inline-flex items-center rounded-sm border border-border bg-surface px-2.5 py-1 text-body-md font-medium text-ink">
                  {step.note}
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

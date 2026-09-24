import { clsx } from 'clsx'
import { Check, ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

/**
 * The Careline (DESIGN.md › Creative direction). A quiet blue line joining a
 * few real care checkpoints, with one emphasized current step.
 * It is NOT an EEG trace, a severity curve or evidence of improvement.
 * Node state is always written as text, never colour alone.
 */
export type CarelineState = 'completed' | 'current' | 'upcoming' | 'not-needed'

export interface CarelineStep {
  id?: string
  label: string
  sublabel?: string
  state: CarelineState
}

const STATE_TEXT: Record<CarelineState, string> = {
  completed: 'Completed',
  current: 'Current step',
  upcoming: 'Not started',
  'not-needed': 'Not needed',
}

function Node({ state, index, size }: { state: CarelineState; index: number; size: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'size-6' : 'size-8'
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'relative z-10 inline-flex shrink-0 items-center justify-center rounded-full',
        dim,
        state === 'completed' && 'border-2 border-primary bg-surface text-primary',
        state === 'current' && 'border-2 border-primary bg-primary text-white ring-4 ring-accent-soft',
        state === 'upcoming' && 'border-[1.5px] border-control bg-surface text-muted',
        state === 'not-needed' && 'border-[1.5px] border-dashed border-control bg-surface text-muted',
      )}
    >
      {state === 'completed' ? (
        <Check className={size === 'sm' ? 'size-3.5' : 'size-4'} strokeWidth={2.5} />
      ) : (
        <span className={clsx('tabular font-semibold', size === 'sm' ? 'text-[0.75rem]' : 'text-metadata')}>{index + 1}</span>
      )}
    </span>
  )
}

export function Careline({
  steps,
  orientation = 'horizontal',
  size = 'md',
  label = 'Care journey',
  showSublabels = true,
  className,
}: {
  steps: CarelineStep[]
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
  label?: string
  showSublabels?: boolean
  className?: string
}) {
  if (orientation === 'vertical') {
    return (
      <ol aria-label={label} className={clsx('relative', className)}>
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          return (
            <li key={step.id ?? step.label} className="relative flex gap-4 pb-6 last:pb-0" aria-current={step.state === 'current' ? 'step' : undefined}>
              {!last ? (
                <span
                  aria-hidden="true"
                  className={clsx(
                    'absolute top-8 bottom-0 w-0.5',
                    size === 'sm' ? 'left-[11px] top-6' : 'left-[15px]',
                    step.state === 'completed' ? 'bg-primary' : 'bg-border',
                  )}
                />
              ) : null}
              <Node state={step.state} index={i} size={size} />
              <div className="min-w-0 pt-0.5">
                <p className={clsx('text-label', step.state === 'current' ? 'text-primary' : step.state === 'upcoming' ? 'text-muted' : 'text-ink')}>
                  {step.label}
                </p>
                <p className="text-body-md text-muted">
                  <span className="sr-only">{STATE_TEXT[step.state]}. </span>
                  {step.state === 'current' ? (
                    <span className="font-medium text-primary-hover">Now{showSublabels && step.sublabel ? ' · ' : ''}</span>
                  ) : null}
                  {step.state === 'not-needed' ? `Not needed${showSublabels && step.sublabel ? ' · ' : ''}` : null}
                  {showSublabels ? step.sublabel : null}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol aria-label={label} className={clsx('grid gap-3', className)} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <li key={step.id ?? step.label} className="relative min-w-0" aria-current={step.state === 'current' ? 'step' : undefined}>
            <div className="relative flex items-center">
              <Node state={step.state} index={i} size={size} />
              {!last ? (
                <span
                  aria-hidden="true"
                  className={clsx('ml-2 h-0.5 flex-1 rounded-full', step.state === 'completed' ? 'bg-primary' : 'bg-border')}
                />
              ) : null}
            </div>
            <p
              className={clsx(
                'mt-3 text-label',
                size === 'sm' && '!text-metadata !font-semibold',
                step.state === 'current' ? 'text-primary' : step.state === 'upcoming' ? 'text-muted' : 'text-ink',
              )}
            >
              {step.label}
            </p>
            <p className={clsx('text-muted', size === 'sm' ? 'text-metadata' : 'text-body-md')}>
              <span className="sr-only">{STATE_TEXT[step.state]}. </span>
              {step.state === 'current' ? <span className="font-medium text-primary-hover">Now</span> : null}
              {step.state === 'not-needed' ? 'Not needed' : null}
              {showSublabels && step.sublabel ? (
                <span className="block">{step.sublabel}</span>
              ) : null}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Mobile Careline (PATIENT.md › Home): show the current stage with
 * "View journey" to expand a vertical list. No squeezed horizontal strip.
 */
export function CarelineCompact({ steps, label = 'Care journey', className }: { steps: CarelineStep[]; label?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const currentIndex = Math.max(0, steps.findIndex((s) => s.state === 'current'))
  const current = steps[currentIndex]
  return (
    <div className={clsx('rounded-lg border border-border bg-surface p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Node state="current" index={currentIndex} size="sm" />
          <p className="min-w-0 text-body-md text-ink">
            <span className="text-muted">
              Step {currentIndex + 1} of {steps.length} ·{' '}
            </span>
            <span className="font-semibold">{current?.label}</span>
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md px-2 text-label text-primary hover:text-primary-hover"
        >
          {open ? 'Hide journey' : 'View journey'}
          <ChevronDown aria-hidden="true" className={clsx('size-4 transition-transform duration-150', open && 'rotate-180')} />
        </button>
      </div>
      <div id={id} hidden={!open} className="mt-4 border-t border-border pt-4">
        <Careline steps={steps} orientation="vertical" size="sm" label={label} />
      </div>
    </div>
  )
}

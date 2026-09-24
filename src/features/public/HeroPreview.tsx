import { clsx } from 'clsx'
import { Check, ClipboardList, FileText, MessageCircleQuestion } from 'lucide-react'
import type { ReactNode } from 'react'
import { Careline, type CarelineStep } from '@/components/ui'

/**
 * Homepage hero preview (DESIGN.md › Homepage, section 1): a realistic mini
 * product surface, not a dashboard and not a device frame. Nothing here
 * implies a real appointment, result or clinician endorsement. It reads as a
 * plain list with every decoration removed.
 */
const ROWS: Array<{ icon: ReactNode; label: string; state: string; done?: boolean }> = [
  { icon: <ClipboardList strokeWidth={1.75} />, label: 'Your concerns and history', state: 'Added', done: true },
  { icon: <FileText strokeWidth={1.75} />, label: 'Previous reports', state: 'Optional' },
  { icon: <MessageCircleQuestion strokeWidth={1.75} />, label: 'Questions to discuss', state: 'Draft' },
]

const STEPS: CarelineStep[] = [
  { label: 'Concerns', state: 'completed' },
  { label: 'Visit', state: 'current' },
  { label: 'Results', state: 'upcoming' },
  { label: 'Follow‑up', state: 'upcoming' }, // non-breaking hyphen keeps the label on one line
]

/* The kit's vertical layout writes "Now · <sublabel>", so the current step carries one. */
const VERTICAL_STEPS: CarelineStep[] = STEPS.map((s) => (s.state === 'current' ? { ...s, sublabel: 'Getting ready' } : s))

const CURRENT_FIX = '[&_[aria-current=step]>div>span:first-child]:bg-primary'

export function HeroPreview({ className }: { className?: string }) {
  return (
    <figure className={clsx('min-w-0', className)}>
      <div className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
        <p className="text-label text-primary">Your next step</p>
        <p className="mt-2 text-heading-md text-ink">Prepare for your clinician visit</p>
        <p className="mt-2 text-body-md text-muted">Review your concerns and bring any previous reports.</p>

        <ul className="mt-6 divide-y divide-border border-y border-border">
          {ROWS.map((row) => (
            <li key={row.label} className="flex min-h-14 items-center gap-3 py-3">
              <span aria-hidden="true" className="shrink-0 text-muted [&>svg]:size-5">
                {row.icon}
              </span>
              <span className="min-w-0 flex-1 text-body-md font-medium text-ink">{row.label}</span>
              <span
                className={clsx(
                  'inline-flex shrink-0 items-center gap-1 text-body-md',
                  row.done ? 'text-primary-hover' : 'text-muted',
                )}
              >
                {row.done ? <Check aria-hidden="true" className="size-4" strokeWidth={2.25} /> : null}
                {row.state}
              </span>
            </li>
          ))}
        </ul>

        {/* Horizontal from 380px; on the narrowest phones the same kit Careline runs
            vertically so labels never collide. Only one of the two is ever displayed.
            The arbitrary variant keeps the current node filled where the kit's base
            node background wins the cascade (reported to the kit owner). */}
        <div className="mt-6 hidden min-[380px]:block">
          <Careline steps={STEPS} size="sm" label="Illustrative care journey" className={CURRENT_FIX} />
        </div>
        <div className="mt-6 min-[380px]:hidden">
          <Careline
            steps={VERTICAL_STEPS}
            size="sm"
            orientation="vertical"
            label="Illustrative care journey"
            className="[&_[aria-current=step]>span.z-10]:bg-primary"
          />
        </div>
      </div>
      <figcaption className="mt-3 text-body-md text-muted">Illustrative product preview</figcaption>
    </figure>
  )
}

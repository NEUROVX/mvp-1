import { clsx } from 'clsx'
import { Link } from 'react-router'

/**
 * NeuroVX wordmark: text, plus a small Careline glyph (two nodes on a line).
 * Rendered as text, not a logo file (PATIENT-ONE-STEP › Shapes).
 */
export function Wordmark({ to = '/', onNavy, size = 'md', className }: { to?: string; onNavy?: boolean; size?: 'sm' | 'md'; className?: string }) {
  return (
    <Link
      to={to}
      className={clsx('inline-flex min-h-11 items-center gap-2 rounded-sm', onNavy ? 'text-white' : 'text-navy', className)}
    >
      <CarelineGlyph className={size === 'sm' ? 'h-4 w-7' : 'h-5 w-8'} onNavy={onNavy} />
      <span className={clsx('font-bold tracking-[-0.02em]', size === 'sm' ? 'text-heading-sm' : 'text-[1.375rem] leading-none')}>
        NeuroVX
      </span>
      <span className="sr-only">home</span>
    </Link>
  )
}

export function CarelineGlyph({ className, onNavy }: { className?: string; onNavy?: boolean }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden="true" fill="none">
      <path d="M3 14 H13 L19 6 H29" className={onNavy ? 'stroke-white' : 'stroke-navy'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3.5" cy="14" r="2.5" className={onNavy ? 'fill-navy stroke-white' : 'fill-surface stroke-navy'} strokeWidth="1.75" />
      <circle cx="28.5" cy="6" r="2.75" className={onNavy ? 'fill-primary stroke-white' : 'fill-primary stroke-primary'} strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Step indicator for focused flows: "Step 1 of 3 · Who is the care for?"
 * Written as text; the bar is decorative.
 */
export function FlowProgress({ step, total, label, className }: { step: number; total: number; label: string; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      <p className="text-body-md text-muted">
        <span className="font-semibold text-ink">
          Step {step} of {total}
        </span>{' '}
        · {label}
      </p>
      <div aria-hidden="true" className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={clsx('h-1 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')} />
        ))}
      </div>
    </div>
  )
}

import { clsx } from 'clsx'
import { Link } from 'react-router'
import lockupUrl from '@/assets/brand/neurovx-lockup.svg'
import lockupWhiteUrl from '@/assets/brand/neurovx-lockup-white.svg'

/** Intrinsic proportions of the lockup artwork (viewBox 2617.7 x 567). */
const LOCKUP_RATIO = 2617.7 / 567

/**
 * The NeuroVX logo: brain mark plus the NEUROVX wordmark, as one horizontal
 * lockup. Full colour on light surfaces, all white on navy. The artwork keeps
 * its own brand colours; they are not UI tokens (see IMPLEMENTATION.md › Logo).
 */
export function Logo({ onNavy, className }: { onNavy?: boolean; className?: string }) {
  return (
    <img
      src={onNavy ? lockupWhiteUrl : lockupUrl}
      alt="NeuroVX"
      width={Math.round(40 * LOCKUP_RATIO)}
      height={40}
      className={clsx('block w-auto max-w-none shrink-0', className)}
    />
  )
}

/**
 * The logo as the home link in every header and the public footer.
 * md is 40px tall, sm 36px; compact drops to 32px below 400px so tight
 * headers fit at 320px. collapse shows only the brain mark below 390px,
 * for headers that must keep their text labels.
 */
export function Wordmark({
  to = '/',
  onNavy,
  size = 'md',
  compact,
  collapse,
  className,
}: {
  to?: string
  onNavy?: boolean
  size?: 'sm' | 'md'
  compact?: boolean
  collapse?: boolean
  className?: string
}) {
  const height = size === 'sm' ? 'min-[400px]:h-9' : 'min-[400px]:h-10'
  return (
    <Link to={to} className={clsx('inline-flex min-h-11 shrink-0 items-center rounded-sm', className)}>
      {/* Collapsed: clip the lockup to the mark (476 of 2617.7 viewBox units; 27px at 32px tall). */}
      <span className={clsx('block', collapse && 'max-[389px]:w-[27px] max-[389px]:overflow-hidden')}>
        <Logo onNavy={onNavy} className={clsx(compact || collapse ? 'h-8' : size === 'sm' ? 'h-9' : 'h-10', height)} />
      </span>
      <span className="sr-only">home</span>
    </Link>
  )
}

/** The Careline motif (two nodes on a line). Decorative, not the logo. */
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

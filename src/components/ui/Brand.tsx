import { clsx } from 'clsx'
import { Link } from 'react-router'

const LOGO_MARK = '/brand/neurovx-mark.png'
const LOGO_WORDMARK = '/brand/neurovx-wordmark.png'

/** NeuroVX logo lockup: brain mark plus the NEUROVX lettering, from public/brand. */
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
  /** Hide the glyph below 400px so tight headers fit at 320px. */
  compact?: boolean
  /** Show only the brain mark below 390px, for headers that must keep their text labels. */
  collapse?: boolean
  className?: string
}) {
  return (
    <Link
      to={to}
      className={clsx('inline-flex min-h-11 items-center gap-2 rounded-sm', onNavy ? 'text-white' : 'text-navy', className)}
    >
      <LogoLockup size={size} compact={compact} collapse={collapse} onNavy={onNavy} />
      <span className="sr-only">home</span>
    </Link>
  )
}

/** The logo lockup without a link, for headers where leaving would lose progress. */
export function LogoLockup({
  size = 'md',
  compact,
  collapse,
  onNavy,
}: {
  size?: 'sm' | 'md'
  compact?: boolean
  collapse?: boolean
  onNavy?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={clsx(size === 'sm' ? 'h-8' : 'h-10', compact && !collapse && 'hidden min-[400px]:block')} onNavy={onNavy} />
      <img
        src={LOGO_WORDMARK}
        alt="NeuroVX"
        className={clsx('w-auto', size === 'sm' ? 'h-3.5' : 'h-4', onNavy && 'brightness-0 invert', collapse && 'max-[389px]:hidden')}
      />
      {collapse && <span className="sr-only min-[390px]:hidden">NeuroVX</span>}
    </span>
  )
}

/** The brain mark on its own. Decorative: pair it with text or the wordmark. */
export function LogoMark({ className, onNavy }: { className?: string; onNavy?: boolean }) {
  return <img src={LOGO_MARK} alt="" aria-hidden="true" className={clsx('w-auto', onNavy && 'brightness-0 invert', className)} />
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

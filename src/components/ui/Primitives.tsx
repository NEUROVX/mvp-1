import { clsx } from 'clsx'
import { AlertTriangle, ArrowRight, CheckCircle2, Info, OctagonAlert } from 'lucide-react'
import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import type { SourceKind, Tone } from '@/demo/types'

/* ------------------------------------------------------------------ */
/* Text links                                                          */
/* ------------------------------------------------------------------ */

/** Underlined link for use inside paragraphs (DESIGN.md: links in paragraphs are underlined). */
export function TextLink({
  to,
  href,
  children,
  className,
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
}) {
  const cls = clsx('prose-link', className)
  if (to) return <Link to={to} className={cls}>{children}</Link>
  return (
    <a href={href} className={cls} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

/** Standalone navigational link with an arrow, e.g. "Explore patient care →". Min 44px target. */
export function ArrowLink({
  to,
  children,
  className,
  onNavy,
}: {
  to: string
  children: ReactNode
  className?: string
  onNavy?: boolean
}) {
  return (
    <Link
      to={to}
      className={clsx(
        'group inline-flex min-h-11 items-center gap-1.5 text-label',
        onNavy ? 'text-white' : 'text-primary hover:text-primary-hover',
        className,
      )}
    >
      <span className="underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-current">
        {children}
      </span>
      <ArrowRight aria-hidden="true" className="size-[18px] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" strokeWidth={2} />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  as: As = 'div',
  elevated,
  padding = 'md',
  className,
  children,
  ...rest
}: {
  as?: ElementType
  elevated?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
} & HTMLAttributes<HTMLElement>) {
  return (
    <As
      className={clsx(
        'rounded-lg border border-border bg-surface',
        elevated && 'shadow-1',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-4 sm:p-6',
        padding === 'lg' && 'p-5 sm:p-8',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={clsx('border-0 border-t border-border', className)} />
}

/* ------------------------------------------------------------------ */
/* Status, provenance and demo labels                                  */
/* ------------------------------------------------------------------ */

const toneClasses: Record<Tone, string> = {
  info: 'bg-accent-soft text-primary-hover',
  warning: 'bg-warning-surface text-warning',
  error: 'bg-error-surface text-error',
  neutral: 'bg-canvas text-muted border border-border',
}

/** Status label. Always carries text; colour is never the only signal. */
export function StatusBadge({
  tone = 'info',
  icon,
  size = 'md',
  children,
  className,
}: {
  tone?: Tone
  icon?: ReactNode
  size?: 'md' | 'sm'
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center gap-1.5 rounded-sm',
        size === 'md' ? 'px-2.5 py-1 text-label' : 'px-2 py-0.5 text-metadata font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">{icon}</span> : null}
      <span className="min-w-0">{children}</span>
    </span>
  )
}

/** One discreet label for synthetic data (PATIENT-ONE-STEP: one "Demo" label, not repeated disclaimers). */
export function DemoTag({ children = 'Demo data', className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-sm border border-border bg-canvas px-2 py-0.5 text-metadata font-medium text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** "Product preview - not for clinical use." Readable, never a tiny footnote. */
export function PrototypeNote({ className, onNavy }: { className?: string; onNavy?: boolean }) {
  return (
    <p className={clsx('text-body-md', onNavy ? 'text-navy-muted' : 'text-muted', className)}>
      Product preview - not for clinical use.
    </p>
  )
}

const SOURCE_TEXT: Record<SourceKind, string> = {
  patient: 'Patient reported',
  'care-partner': 'Care partner reported',
  clinician: 'Clinician documented',
  lab: 'Laboratory reported',
  imaging: 'Imaging provider reported',
  system: 'Recorded by NeuroVX',
}

/** Provenance label (DESIGN.md: keep sources distinct). */
export function SourceLabel({ kind, name, className }: { kind: SourceKind; name?: string; className?: string }) {
  return (
    <span className={clsx('inline-flex flex-wrap items-center gap-x-1.5 text-body-md text-muted', className)}>
      <span className="font-semibold text-ink">{SOURCE_TEXT[kind]}</span>
      {name ? <span>· {name}</span> : null}
    </span>
  )
}
export function sourceText(kind: SourceKind) {
  return SOURCE_TEXT[kind]
}

/* ------------------------------------------------------------------ */
/* Callouts                                                            */
/* ------------------------------------------------------------------ */

const calloutIcon: Record<Tone, ReactNode> = {
  info: <Info strokeWidth={2} />,
  neutral: <Info strokeWidth={2} />,
  warning: <AlertTriangle strokeWidth={2} />,
  error: <OctagonAlert strokeWidth={2} />,
}

/** Inline message block. Use `error` only for real errors or approved urgent notices. */
export function Callout({
  tone = 'info',
  title,
  children,
  action,
  className,
  role,
}: {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  className?: string
  role?: 'status' | 'alert'
}) {
  return (
    <div
      role={role}
      className={clsx(
        'flex gap-3 rounded-md p-4 sm:p-5',
        tone === 'info' && 'bg-accent-soft text-ink',
        tone === 'neutral' && 'border border-border bg-canvas text-ink',
        tone === 'warning' && 'bg-warning-surface text-ink',
        tone === 'error' && 'bg-error-surface text-ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'mt-0.5 shrink-0 [&>svg]:size-5',
          tone === 'info' && 'text-primary',
          tone === 'neutral' && 'text-muted',
          tone === 'warning' && 'text-warning',
          tone === 'error' && 'text-error',
        )}
      >
        {calloutIcon[tone]}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="text-label text-ink">{title}</p> : null}
        {children ? <div className="text-body-md text-ink [&_p+p]:mt-2">{children}</div> : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  )
}

/** Polite live region for saved/sending states. Say "Saved" only after the save succeeded. */
export function InlineStatus({ children, tone = 'info' }: { children?: ReactNode; tone?: 'info' | 'error' }) {
  return (
    <p role="status" aria-live="polite" className={clsx('flex min-h-6 items-center gap-2 text-body-md', tone === 'error' ? 'text-error' : 'text-muted')}>
      {children ? (
        <>
          {tone === 'info' ? <CheckCircle2 aria-hidden="true" className="size-5 text-primary" /> : <OctagonAlert aria-hidden="true" className="size-5" />}
          <span>{children}</span>
        </>
      ) : null}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Headings                                                            */
/* ------------------------------------------------------------------ */

/** Page header for patient and workspace screens. The h1 receives focus on navigation. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  meta,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  className?: string
}) {
  return (
    <header className={clsx('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="min-w-0 max-w-reading space-y-2">
        {eyebrow ? <div className="text-label text-primary">{eyebrow}</div> : null}
        <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-patient-title">{title}</h1>
        {lede ? <p className="text-body-lg text-muted">{lede}</p> : null}
        {meta ? <div className="pt-1">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}

/** Public section heading: 36px desktop / 28px mobile. */
export function SectionHeading({
  as: As = 'h2',
  children,
  className,
  id,
}: {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <As id={id} className={clsx('text-heading-lg-mobile text-ink md:text-heading-lg', className)}>
      {children}
    </As>
  )
}

/** Small uppercase-free eyebrow above a public heading. Sentence case only. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('text-label text-primary', className)}>{children}</p>
}

/* ------------------------------------------------------------------ */
/* Lists, avatars, empty states                                        */
/* ------------------------------------------------------------------ */

export function DescriptionList({
  items,
  className,
  columns = 1,
}: {
  items: Array<{ term: ReactNode; detail: ReactNode }>
  className?: string
  columns?: 1 | 2
}) {
  return (
    <dl className={clsx('grid gap-x-8 gap-y-4', columns === 2 && 'sm:grid-cols-2', className)}>
      {items.map((it, i) => (
        <div key={i} className="min-w-0 space-y-0.5">
          <dt className="text-body-md text-muted">{it.term}</dt>
          <dd className="text-data text-ink">{it.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Initials({ children, size = 'md', className }: { children: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-primary-hover',
        size === 'sm' && 'size-8 text-metadata',
        size === 'md' && 'size-11 text-body-md',
        size === 'lg' && 'size-14 text-heading-sm',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  title,
  children,
  action,
  icon,
  className,
}: {
  title: ReactNode
  children?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('rounded-lg border border-dashed border-control/60 bg-surface p-6 sm:p-8', className)}>
      {icon ? <div aria-hidden="true" className="mb-3 text-muted [&>svg]:size-6">{icon}</div> : null}
      <p className="text-heading-sm text-ink">{title}</p>
      {children ? <div className="mt-1 max-w-reading text-body-md text-muted">{children}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}

/** Collapsible detail using native <details>. Summary is a 48px target. */
export function Disclosure({
  summary,
  children,
  defaultOpen,
  className,
}: {
  summary: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  return (
    <details open={defaultOpen} className={clsx('group rounded-md border border-border bg-surface', className)}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-label text-ink [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-muted transition-transform duration-150 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </summary>
      <div className="border-t border-border px-4 py-4 text-body-md text-ink">{children}</div>
    </details>
  )
}

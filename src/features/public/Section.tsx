import { clsx } from 'clsx'
import type { ReactNode } from 'react'

/**
 * Full-bleed public section. Owns the page gutter, the 1200px content width
 * and the 96 / 64 / 48px vertical rhythm (DESIGN.md › Responsive structure).
 * `tone="canvas"` is the occasional pale-blue separation; most sections stay white.
 * `rule` draws a hairline across the content width when two white sections meet.
 */
export function PublicSection({
  id,
  labelledBy,
  tone = 'white',
  rule,
  className,
  innerClassName,
  children,
}: {
  id?: string
  labelledBy?: string
  tone?: 'white' | 'canvas'
  rule?: boolean
  className?: string
  innerClassName?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // Anchor targets receive programmatic focus (tabindex -1) so screen readers
      // land on them; like the layout's <main>, they are not controls, so no ring.
      className={clsx(tone === 'canvas' ? 'bg-canvas' : 'bg-surface', id && 'focus:outline-none', className)}
    >
      <div className={clsx('page-gutter mx-auto max-w-page', innerClassName)}>
        <div className={clsx('section-y', rule && 'border-t border-border')}>{children}</div>
      </div>
    </section>
  )
}

/**
 * Opening block for secondary public pages: one h1 (36px desktop / 28px mobile),
 * a readable lede and optional actions. The homepage owns its own display hero.
 */
export function PageIntro({
  title,
  lede,
  children,
  aside,
  className,
}: {
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('bg-surface', className)}>
      <div className="page-gutter mx-auto max-w-page pt-12 pb-10 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16">
        <div className={clsx(aside && 'grid gap-10 lg:grid-cols-12 lg:gap-6')}>
          <div className={clsx('min-w-0', aside && 'lg:col-span-7')}>
            <h1 className="max-w-[20ch] text-heading-lg-mobile text-ink md:text-heading-lg">{title}</h1>
            {lede ? <div className="mt-4 max-w-reading text-body-lg text-muted">{lede}</div> : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
          {aside ? <div className="min-w-0 lg:col-span-5 lg:pt-2">{aside}</div> : null}
        </div>
      </div>
    </div>
  )
}

/** Plain bulleted list with a small blue node instead of a default bullet. */
export function NodeList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={clsx('space-y-3', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-body-md text-ink">
          <span aria-hidden="true" className="mt-[0.55em] size-2 shrink-0 rounded-full border-2 border-primary" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

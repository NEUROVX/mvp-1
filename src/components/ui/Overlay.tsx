import { clsx } from 'clsx'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

/**
 * Dialog on the native <dialog> element: focus moves in, Escape closes,
 * focus returns to the opener. Use only for consequential confirmations or
 * a genuinely focused task (DESIGN.md › Motion and feedback).
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<Element | null>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      opener.current = document.activeElement
      d.showModal()
    } else if (!open && d.open) {
      d.close()
      if (opener.current instanceof HTMLElement) opener.current.focus()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className={clsx(
        'm-auto w-[calc(100%-2rem)] rounded-lg border border-border bg-surface p-0 text-ink shadow-2 backdrop:bg-navy/40',
        size === 'md' ? 'max-w-[35rem]' : 'max-w-[45rem]',
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="min-w-0 space-y-1">
          <h2 id={titleId} className="text-heading-sm text-ink">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="text-body-md text-muted">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
        >
          <X aria-hidden="true" className="size-5" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      {children ? <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div> : null}
      {footer ? <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">{footer}</div> : null}
    </dialog>
  )
}

/**
 * Accessible tabs (roving tabindex, arrow keys). For the clinician record:
 * Summary, Timeline, Assessments, Results, Care plan.
 */
export function Tabs({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: Array<{ id: string; label: string; panel: ReactNode }>
  value?: string
  onChange?: (id: string) => void
  label: string
  className?: string
}) {
  const [internal, setInternal] = useState(tabs[0]?.id)
  const active = value ?? internal
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const select = (id: string) => {
    setInternal(id)
    onChange?.(id)
  }
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = tabs.length
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % n
    if (e.key === 'ArrowLeft') next = (i - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next >= 0) {
      e.preventDefault()
      const t = tabs[next]
      select(t.id)
      refs.current[t.id]?.focus()
    }
  }
  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t, i) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el
              }}
              role="tab"
              type="button"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={clsx(
                '-mb-px min-h-12 shrink-0 border-b-2 px-4 text-label whitespace-nowrap transition-colors duration-150',
                selected ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-offset-8"
        >
          {t.id === active ? t.panel : null}
        </div>
      ))}
    </div>
  )
}

/** Segmented control for 2–3 views (e.g. List / Map). Uses radio semantics. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: Array<{ value: T; label: string; icon?: ReactNode }>
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={clsx('inline-flex rounded-md border border-control bg-surface p-1', className)}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={clsx(
              'inline-flex min-h-10 items-center gap-2 rounded-[7px] px-3.5 text-label transition-colors duration-150',
              on ? 'bg-accent-soft text-primary' : 'text-muted hover:text-ink',
            )}
          >
            {o.icon ? <span aria-hidden="true" className="[&>svg]:size-[18px]">{o.icon}</span> : null}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

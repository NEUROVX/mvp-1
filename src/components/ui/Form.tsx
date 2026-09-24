import { clsx } from 'clsx'
import { Check } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

/**
 * Form controls (DESIGN.md › Buttons, controls and forms)
 * - Persistent visible label; placeholder is never the label.
 * - Required/optional stated in text: "(optional)".
 * - 48px minimum control height; control boundary uses control-border (3:1).
 * - Errors are associated with aria-describedby and written as recovery steps.
 */

const controlBase =
  'block w-full min-h-12 rounded-md border border-control bg-surface px-4 py-2.5 text-body-md text-ink placeholder:text-muted transition-colors duration-150 hover:border-ink focus-visible:border-primary aria-[invalid=true]:border-error disabled:bg-canvas disabled:text-muted'

interface FieldProps {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  optional?: boolean
  className?: string
}

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-label text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-body-md text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-body-md font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: ReactNode, error?: ReactNode) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
}

export function TextField({
  label,
  hint,
  error,
  optional,
  className,
  id: idProp,
  ...input
}: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        className={controlBase}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional && input.required}
        {...input}
      />
    </FieldShell>
  )
}

export function TextArea({
  label,
  hint,
  error,
  optional,
  className,
  id: idProp,
  rows = 4,
  ...input
}: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea
        id={id}
        rows={rows}
        className={clsx(controlBase, 'min-h-28 resize-y leading-[1.6]')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...input}
      />
    </FieldShell>
  )
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  className,
  id: idProp,
  options,
  placeholder,
  ...select
}: FieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
    options: Array<{ value: string; label: string }>
    placeholder?: string
  }) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="relative">
        <select
          id={id}
          className={clsx(controlBase, 'appearance-none pr-11')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          {...select}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </div>
    </FieldShell>
  )
}

/* ------------------------------------------------------------------ */
/* Choice groups: radios and checkboxes rendered as calm option rows    */
/* ------------------------------------------------------------------ */

export interface ChoiceOption<T extends string = string> {
  value: T
  label: ReactNode
  description?: ReactNode
  /** Checkbox groups: selecting this clears the others (e.g. "No particular concern"). */
  exclusive?: boolean
  disabled?: boolean
}

interface GroupProps<T extends string> {
  legend: ReactNode
  hint?: ReactNode
  error?: ReactNode
  optional?: boolean
  options: ChoiceOption<T>[]
  columns?: 1 | 2 | 3 | 4
  className?: string
  /** Visually smaller legend for nested groups. */
  legendSize?: 'md' | 'lg'
}

function Group<T extends string>({
  legend,
  hint,
  error,
  optional,
  className,
  legendSize = 'md',
  children,
  id,
}: Omit<GroupProps<T>, 'options' | 'columns'> & { children: ReactNode; id: string }) {
  return (
    <fieldset
      className={clsx('min-w-0 space-y-3', className)}
      aria-describedby={describedBy(id, hint, error)}
      aria-invalid={error ? true : undefined}
    >
      <legend className={clsx('mb-1 text-ink', legendSize === 'lg' ? 'text-heading-sm' : 'text-label')}>
        {legend}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 text-body-md text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-body-md font-medium text-error">
          {error}
        </p>
      ) : null}
      {children}
    </fieldset>
  )
}

const gridCols = (c?: number) =>
  clsx('grid gap-3', c === 2 && 'sm:grid-cols-2', c === 3 && 'sm:grid-cols-3', c === 4 && 'sm:grid-cols-2 lg:grid-cols-4')

function OptionRow({
  type,
  checked,
  disabled,
  label,
  description,
  input,
}: {
  type: 'radio' | 'checkbox'
  checked: boolean
  disabled?: boolean
  label: ReactNode
  description?: ReactNode
  input: ReactNode
}) {
  return (
    <label
      className={clsx(
        'relative flex min-h-12 cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors duration-150',
        'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-primary',
        checked ? 'border-primary bg-accent-soft' : 'border-control bg-surface hover:border-ink',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      {input}
      <span
        aria-hidden="true"
        className={clsx(
          'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center border-2 transition-colors duration-150',
          type === 'radio' ? 'rounded-full' : 'rounded-[4px]',
          checked ? 'border-primary bg-primary text-white' : 'border-control bg-surface',
        )}
      >
        {checked ? (
          type === 'radio' ? <span className="size-2 rounded-full bg-white" /> : <Check className="size-3.5" strokeWidth={3} />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-body-md font-medium text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-body-md text-muted">{description}</span> : null}
      </span>
    </label>
  )
}

export function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  columns,
  ...group
}: GroupProps<T> & { name: string; value?: T; onChange: (value: T) => void }) {
  const id = useId()
  return (
    <Group id={id} {...group}>
      <div className={gridCols(columns)}>
        {options.map((o) => (
          <OptionRow
            key={o.value}
            type="radio"
            checked={value === o.value}
            disabled={o.disabled}
            label={o.label}
            description={o.description}
            input={
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={o.value}
                checked={value === o.value}
                disabled={o.disabled}
                onChange={() => onChange(o.value)}
              />
            }
          />
        ))}
      </div>
    </Group>
  )
}

export function CheckboxGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  columns,
  ...group
}: GroupProps<T> & { name: string; value: T[]; onChange: (value: T[]) => void }) {
  const id = useId()
  const toggle = (o: ChoiceOption<T>) => {
    const has = value.includes(o.value)
    if (has) return onChange(value.filter((v) => v !== o.value))
    if (o.exclusive) return onChange([o.value])
    const exclusives = options.filter((x) => x.exclusive).map((x) => x.value)
    onChange([...value.filter((v) => !exclusives.includes(v)), o.value])
  }
  return (
    <Group id={id} {...group}>
      <div className={gridCols(columns)}>
        {options.map((o) => (
          <OptionRow
            key={o.value}
            type="checkbox"
            checked={value.includes(o.value)}
            disabled={o.disabled}
            label={o.label}
            description={o.description}
            input={
              <input
                type="checkbox"
                className="sr-only"
                name={name}
                value={o.value}
                checked={value.includes(o.value)}
                disabled={o.disabled}
                onChange={() => toggle(o)}
              />
            }
          />
        ))}
      </div>
    </Group>
  )
}

/** Single checkbox (e.g. consent). Label text must describe the choice fully. */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  name,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  name?: string
}) {
  return (
    <OptionRow
      type="checkbox"
      checked={checked}
      label={label}
      description={description}
      input={<input type="checkbox" className="sr-only" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} />}
    />
  )
}

/** Error summary for longer forms. Focus it after a failed submit. */
export function ErrorSummary({ errors, id = 'error-summary' }: { errors: Array<{ field: string; message: string }>; id?: string }) {
  if (!errors.length) return null
  return (
    <div id={id} tabIndex={-1} role="alert" className="rounded-md border-2 border-error bg-error-surface p-4 sm:p-5">
      <p className="text-label text-error">Check {errors.length === 1 ? 'this answer' : 'these answers'}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-body-md text-ink">
        {errors.map((e) => (
          <li key={e.field}>
            <a className="prose-link" href={`#${e.field}`}>
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

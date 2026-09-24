import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

/**
 * Buttons (DESIGN.md › Buttons, controls and forms)
 * - primary: one filled blue button per main task area
 * - secondary: outlined
 * - quiet: text-link action (still a 48px target)
 * - destructive: error red, keep it away from routine actions
 * - on-navy: primary action placed on a navy surface
 * Sizes: md = 48px (default), lg = 52px (patient primary action).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive' | 'on-navy'
export type ButtonSize = 'md' | 'lg'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  className?: string
  children: ReactNode
}

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
    href?: undefined
    loading?: boolean
    loadingLabel?: string
  }
type AsLink = CommonProps & { to: string; href?: undefined; state?: unknown; replace?: boolean }
type AsAnchor = CommonProps & { href: string; to?: undefined; external?: boolean }

export type ButtonProps = AsButton | AsLink | AsAnchor

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-md text-label text-center transition-colors duration-150 select-none',
    'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
    size === 'lg' ? 'min-h-[52px] px-6 py-3' : 'min-h-12 px-5 py-2.5',
    variant === 'primary' &&
      'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover disabled:bg-border disabled:text-muted',
    variant === 'secondary' &&
      'border border-primary bg-surface text-primary hover:bg-accent-soft active:bg-accent-soft disabled:border-border disabled:text-muted disabled:bg-surface',
    variant === 'quiet' &&
      '!px-1 text-primary underline decoration-1 underline-offset-[5px] hover:text-primary-hover hover:decoration-2 disabled:text-muted',
    variant === 'destructive' && 'bg-error text-white hover:opacity-90 disabled:bg-border disabled:text-muted',
    variant === 'on-navy' && 'bg-white text-navy hover:bg-accent-soft',
    fullWidth && 'w-full',
    className,
  )
}

export function Button(props: ButtonProps) {
  const { variant, size, iconLeft, iconRight, fullWidth, className, children } = props
  const classes = buttonClasses({ variant, size, fullWidth, className })
  const content = (
    <>
      {iconLeft ? <span aria-hidden="true" className="shrink-0">{iconLeft}</span> : null}
      <span>{children}</span>
      {iconRight ? <span aria-hidden="true" className="shrink-0">{iconRight}</span> : null}
    </>
  )

  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} state={props.state} replace={props.replace} className={classes}>
        {content}
      </Link>
    )
  }
  if ('href' in props && props.href !== undefined) {
    const ext = props.external
    return (
      <a href={props.href} className={classes} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {content}
      </a>
    )
  }
  const {
    variant: _v,
    size: _s,
    iconLeft: _l,
    iconRight: _r,
    fullWidth: _f,
    className: _c,
    children: _ch,
    loading,
    loadingLabel,
    type,
    ...rest
  } = props as AsButton
  return (
    <button type={type ?? 'button'} className={classes} aria-busy={loading || undefined} {...rest}>
      {loading ? (
        <>
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        content
      )}
    </button>
  )
}

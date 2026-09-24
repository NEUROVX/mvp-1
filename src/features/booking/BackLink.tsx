import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** Quiet "← Back to …" link above a page header. 44px target. */
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group -ml-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-1 text-label text-primary hover:text-primary-hover"
    >
      <ArrowLeft aria-hidden="true" className="size-5 shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" strokeWidth={2} />
      <span className="underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors duration-150 group-hover:decoration-current">
        {children}
      </span>
    </Link>
  )
}

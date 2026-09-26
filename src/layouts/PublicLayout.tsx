import { clsx } from 'clsx'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Wordmark } from '@/components/ui'
import { useRouteFocus } from '@/lib/hooks'
import { SkipLink } from './shared'

/** Public navigation (DESIGN.md › Navigation architecture). Text links, no mega-menu. */
export const PUBLIC_NAV = [
  { to: '/patients', label: 'Patients & families' },
  { to: '/partners', label: 'Healthcare partners' },
  { to: '/research', label: 'Research' },
  { to: '/learn', label: 'Learn' },
  { to: '/care-support', label: 'Care & support' },
]

export function PublicLayout() {
  useRouteFocus()
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <SkipLink />
      <PublicHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

function PublicHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) firstLinkRef.current?.focus()
  }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="page-gutter mx-auto flex h-[72px] max-w-page items-center justify-between gap-6">
        <Wordmark compact />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {PUBLIC_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'inline-flex min-h-11 items-center rounded-md px-3 text-body-md font-medium transition-colors duration-150',
                      isActive ? 'bg-accent-soft text-primary' : 'text-ink hover:text-primary',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/sign-in" className="hidden min-h-11 items-center rounded-md px-3 text-body-md font-medium text-muted hover:text-ink sm:inline-flex">
            Sign in
          </Link>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="public-menu"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-control px-3.5 text-label text-ink lg:hidden"
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <div id="public-menu" hidden={!open} className="border-t border-border bg-surface shadow-2 lg:hidden">
        <nav aria-label="Main" className="page-gutter mx-auto max-w-page py-4">
          <ul className="divide-y divide-border">
            {PUBLIC_NAV.map((item, i) => (
              <li key={item.to}>
                <NavLink
                  ref={i === 0 ? firstLinkRef : undefined}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx('flex min-h-14 items-center text-heading-sm', isActive ? 'text-primary' : 'text-ink')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/sign-in" className="flex min-h-14 items-center text-body-lg text-muted">
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="on-navy bg-navy text-white">
      <div className="page-gutter mx-auto max-w-page py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Wordmark onNavy />
            <p className="max-w-[26rem] text-body-md text-navy-muted">
              India-first neuroscience care infrastructure, starting with memory and cognitive care.
            </p>
            <p className="text-body-md text-navy-muted">Product preview - not for clinical use.</p>
          </div>
          <nav aria-label="Explore" className="md:col-span-3">
            <p className="text-label text-white">Explore</p>
            <ul className="mt-3 space-y-1">
              {PUBLIC_NAV.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company" className="md:col-span-2">
            <p className="text-label text-white">NeuroVX</p>
            <ul className="mt-3 space-y-1">
              <li><FooterLink to="/contact">Contact</FooterLink></li>
              <li><FooterLink to="/pilot">Discuss a pilot</FooterLink></li>
              <li><FooterLink to="/care-and-research">Care and research</FooterLink></li>
            </ul>
          </nav>
          <nav aria-label="Legal" className="md:col-span-2">
            <p className="text-label text-white">Policies</p>
            <ul className="mt-3 space-y-1">
              <li><FooterLink to="/privacy">Privacy</FooterLink></li>
              <li><FooterLink to="/terms">Terms</FooterLink></li>
              <li><FooterLink to="/accessibility">Accessibility</FooterLink></li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-navy-rule pt-6 text-body-md text-navy-muted sm:flex-row sm:justify-between">
          <p>© 2026 NeuroVX. Prototype with synthetic data.</p>
          <p>Clinical decisions remain with qualified healthcare professionals.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex min-h-11 items-center text-body-md text-navy-muted underline-offset-4 hover:text-white hover:underline">
      {children}
    </Link>
  )
}

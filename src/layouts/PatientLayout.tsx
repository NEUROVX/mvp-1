import { clsx } from 'clsx'
import { BookOpen, HeartHandshake, House, LifeBuoy, LogOut, FolderOpen, Settings2, CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { DemoTag, Wordmark } from '@/components/ui'
import { usePeople } from '@/demo/store'
import { useRouteFocus } from '@/lib/hooks'
import { DemoControls, PrototypeFooter, SkipLink } from './shared'

/**
 * Patient / family workspace (DESIGN.md + PATIENT.md › Stable navigation).
 * Five destinations in a fixed order. Desktop: 240px left navigation and a
 * 72px header that always states whose care is open and who is signed in.
 * Mobile: five labelled bottom destinations and a visible context header.
 */
export const PATIENT_NAV: Array<{ to: string; label: string; icon: ReactNode; end?: boolean }> = [
  { to: '/app', label: 'Home', icon: <House />, end: true },
  { to: '/app/care', label: 'My care', icon: <HeartHandshake /> },
  { to: '/app/records', label: 'Records', icon: <FolderOpen /> },
  { to: '/app/learn', label: 'Learn', icon: <BookOpen /> },
  { to: '/app/support', label: 'Support', icon: <LifeBuoy /> },
]

export function PatientLayout() {
  useRouteFocus()
  return (
    <div className="min-h-dvh bg-canvas">
      <SkipLink />
      <Sidebar />
      <div className="lg:pl-60">
        <ContextHeader />
        <main id="main" tabIndex={-1} className="page-gutter mx-auto max-w-page pt-6 pb-32 focus:outline-none sm:pt-8 lg:pb-16">
          <Outlet />
          <PrototypeFooter className="mt-16 border-t border-border pt-6" />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-[72px] items-center gap-2 px-5">
        <Wordmark to="/app" />
        <DemoTag>Demo</DemoTag>
      </div>
      <nav aria-label="Patient" className="flex-1 px-3 pt-4">
        <ul className="space-y-1">
          {PATIENT_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex min-h-12 items-center gap-3 rounded-md px-3 text-label transition-colors duration-150 [&_svg]:size-[22px]',
                    isActive ? 'bg-accent-soft text-primary' : 'text-ink hover:bg-canvas',
                  )
                }
              >
                <span aria-hidden="true" className="[&>svg]:stroke-[1.75]">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-border px-3 py-4">
        <SideLink to="/app/access" icon={<Settings2 />}>People and access</SideLink>
        <SideLink to="/" icon={<LogOut />}>Sign out</SideLink>
        <p className="px-3 pt-2 text-metadata text-muted">Language: English</p>
      </div>
    </aside>
  )
}

function SideLink({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex min-h-11 items-center gap-3 rounded-md px-3 text-body-md font-medium [&_svg]:size-5 [&_svg]:stroke-[1.75]',
          isActive ? 'bg-accent-soft text-primary' : 'text-muted hover:text-ink',
        )
      }
    >
      <span aria-hidden="true">{icon}</span>
      {children}
    </NavLink>
  )
}

/** "Asha's care | Signed in as Meera - care partner" — on every private screen. */
function ContextHeader() {
  const { careTitle, signedInAs, persona } = usePeople()
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="page-gutter mx-auto flex min-h-[72px] max-w-page items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">
            <Wordmark to="/app" size="sm" />
          </div>
          <p className="hidden min-w-0 text-body-md text-ink lg:block">
            <span className="text-label">{careTitle}</span>
            <span aria-hidden="true" className="mx-2 text-border">|</span>
            <span className={clsx(persona === 'limited-helper' ? 'text-warning' : 'text-muted')}>{signedInAs}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DemoControls className="mr-2 hidden lg:inline-flex" />
          <Link to="/app/support" className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-body-md font-medium text-muted hover:text-ink">
            <CircleHelp aria-hidden="true" className="size-5" strokeWidth={1.75} />
            Help
          </Link>
          <Link to="/app/access" className="inline-flex min-h-11 items-center rounded-md px-3 text-body-md font-medium text-muted hover:text-ink lg:hidden">
            Access
          </Link>
        </div>
      </div>
      <div className="page-gutter flex items-center justify-between gap-3 border-t border-border bg-canvas py-2 lg:hidden">
        <p className="min-w-0 text-body-md text-ink">
          <span className="font-semibold">{careTitle}</span>
          <span aria-hidden="true" className="mx-1.5 text-muted">·</span>
          <span className={clsx(persona === 'limited-helper' ? 'text-warning' : 'text-muted')}>{signedInAs}</span>
        </p>
        <DemoControls className="lg:hidden" />
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav aria-label="Patient" className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-5">
        {PATIENT_NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-[68px] flex-col items-center justify-center gap-1 px-1 text-[0.8125rem] leading-tight font-semibold [&_svg]:size-6',
                  isActive ? 'text-primary' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span aria-hidden="true" className={clsx('rounded-full px-3 py-0.5 [&>svg]:stroke-[1.75]', isActive && 'bg-accent-soft')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

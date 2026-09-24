import { clsx } from 'clsx'
import {
  AlertCircle,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FlaskConical,
  Inbox,
  LayoutGrid,
  ListChecks,
  Repeat2,
  Syringe,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'
import { DemoTag, Wordmark } from '@/components/ui'
import { useRouteFocus } from '@/lib/hooks'
import { DemoControls, PrototypeFooter, SkipLink } from './shared'

/**
 * Professional workspaces (DESIGN.md › Navigation architecture): one NeuroVX
 * identity, different role-specific workspaces. Each keeps organization and
 * role context visible. Workspace body text is 16px.
 */
type WorkspaceId = 'clinician' | 'lab' | 'research'

const WORKSPACES: Record<
  WorkspaceId,
  { name: string; org: string; user: string; nav: Array<{ to: string; label: string; icon: LucideIcon; end?: boolean }> }
> = {
  clinician: {
    name: 'Clinician workspace',
    org: 'Example Neuro Clinic - illustrative',
    user: 'Dr. Kavya Rao',
    nav: [
      { to: '/pro/clinician', label: 'Today', icon: CalendarCheck, end: true },
      { to: '/pro/clinician/patients', label: 'Patients', icon: UsersRound },
      { to: '/pro/clinician/orders', label: 'Orders & results', icon: ClipboardList },
      { to: '/pro/clinician/follow-up', label: 'Follow-up', icon: Repeat2 },
    ],
  },
  lab: {
    name: 'Laboratory workspace',
    org: 'Example Diagnostics - illustrative provider',
    user: 'Lab coordinator (demo)',
    nav: [
      { to: '/pro/lab', label: 'Orders', icon: Inbox, end: true },
      { to: '/pro/lab/collections', label: 'Collections', icon: Syringe },
      { to: '/pro/lab/results', label: 'Results', icon: FileCheck2 },
      { to: '/pro/lab/exceptions', label: 'Exceptions', icon: AlertCircle },
    ],
  },
  research: {
    name: 'Research workspace - concept',
    org: 'Separately governed · no patient data',
    user: 'Concept preview',
    nav: [
      { to: '/pro/research', label: 'Overview', icon: LayoutGrid, end: true },
      { to: '/pro/research#studies', label: 'Studies', icon: ListChecks },
      { to: '/pro/research#cohorts', label: 'Cohorts', icon: BarChart3 },
      { to: '/pro/research#requests', label: 'Requests', icon: FlaskConical },
    ],
  },
}

export function WorkspaceLayout({ workspace }: { workspace: WorkspaceId }) {
  useRouteFocus()
  const ws = WORKSPACES[workspace]
  return (
    <div className="min-h-dvh bg-canvas">
      <SkipLink />
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 max-w-[90rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
            <Wordmark to={`/pro/${workspace}`} size="sm" />
            <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
            <p className="min-w-0 text-body-md">
              <span className="font-semibold text-ink">{ws.name}</span>
              <span className="text-muted"> · {ws.org}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex">
              <DemoTag>Demo</DemoTag>
            </span>
            <DemoControls variant="inline" />
            <p className="hidden text-body-md text-muted md:block">{ws.user}</p>
            <Link to="/sign-in" className="inline-flex min-h-11 items-center rounded-md px-3 text-body-md font-medium text-primary hover:text-primary-hover">
              Switch workspace
            </Link>
          </div>
        </div>
        <nav aria-label={ws.name} className="border-t border-border">
          <ul className="mx-auto flex max-w-[90rem] gap-1 overflow-x-auto px-2 sm:px-4">
            {ws.nav.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      '-mb-px inline-flex min-h-12 items-center gap-2 border-b-2 px-3 text-label whitespace-nowrap transition-colors duration-150',
                      isActive && !item.to.includes('#') ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-ink',
                    )
                  }
                >
                  <item.icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-[90rem] px-4 pt-6 pb-24 focus:outline-none sm:px-6 sm:pt-8">
        <Outlet />
        <PrototypeFooter className="mt-16 border-t border-border pt-6" />
      </main>
      <DemoControls />
    </div>
  )
}

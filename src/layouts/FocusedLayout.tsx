import { CircleHelp } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { DemoTag, Wordmark } from '@/components/ui'
import { usePeople } from '@/demo/store'
import { useRouteFocus } from '@/lib/hooks'
import { DemoControls, PrototypeFooter, SkipLink } from './shared'

/**
 * Focused task layout for onboarding, check-in, assessment and booking
 * confirmation. No navigation chrome: one centred column (max 720px), a way
 * to save and leave, and help. Patient context stays visible once signed in.
 */
export function FocusedLayout() {
  useRouteFocus()
  const { pathname } = useLocation()
  const { careTitle, signedInAs } = usePeople()
  const inApp = pathname.startsWith('/app')
  const inSession = pathname.endsWith('/assessment/session')

  return (
    <div className="min-h-dvh bg-canvas">
      <SkipLink />
      <header className="border-b border-border bg-surface">
        <div className="page-gutter mx-auto flex min-h-[72px] max-w-page items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Wordmark to={inApp ? '/app' : '/'} size="sm" />
            <DemoTag>Demo</DemoTag>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!inSession ? (
              <Link
                to={inApp ? '/app/support' : '/contact'}
                className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-body-md font-medium text-muted hover:text-ink"
              >
                <CircleHelp aria-hidden="true" className="size-5" strokeWidth={1.75} />
                <span>Get help</span>
              </Link>
            ) : null}
            <Link
              to={inApp ? '/app' : '/'}
              className="inline-flex min-h-11 items-center rounded-md border border-control px-3.5 text-label text-ink hover:border-primary hover:text-primary"
            >
              {inApp ? 'Save and exit' : 'Exit'}
            </Link>
          </div>
        </div>
        {inApp ? (
          <div className="page-gutter border-t border-border bg-canvas py-2">
            <p className="mx-auto max-w-task text-body-md text-ink">
              <span className="font-semibold">{careTitle}</span>
              <span aria-hidden="true" className="mx-1.5 text-muted">·</span>
              <span className="text-muted">{signedInAs}</span>
            </p>
          </div>
        ) : null}
      </header>
      <main id="main" tabIndex={-1} className="page-gutter mx-auto max-w-task pt-8 pb-24 focus:outline-none sm:pt-12">
        <Outlet />
        <PrototypeFooter className="mt-16 border-t border-border pt-6" />
      </main>
      {!inSession ? <DemoControls /> : null}
    </div>
  )
}

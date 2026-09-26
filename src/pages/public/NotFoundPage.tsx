import { ArrowLink, Button, LogoMark } from '@/components/ui'
import { usePageTitle } from '@/lib/hooks'

export default function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <div className="bg-surface">
      <div className="page-gutter mx-auto max-w-page pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32">
        <div className="max-w-reading">
          <LogoMark className="h-16" />
          <h1 className="mt-6 text-heading-lg-mobile text-ink md:text-heading-lg">We could not find that page</h1>
          <p className="mt-4 text-body-lg text-muted">
            The link may be out of date, or the page may not be part of this preview. Nothing you entered has been lost.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Button to="/">Go to the homepage</Button>
            <ArrowLink to="/app">Open the patient preview</ArrowLink>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 border-t border-border pt-6">
            <p className="text-body-md text-muted">Looking for something to read?</p>
            <ArrowLink to="/learn">Visit Learn</ArrowLink>
          </div>
        </div>
      </div>
    </div>
  )
}

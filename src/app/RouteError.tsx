import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/ui'

export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  if (import.meta.env.DEV) console.error(error)
  return (
    <div className="page-gutter mx-auto max-w-reading py-24">
      <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">
        {notFound ? 'This page is not available' : 'This page could not be shown'}
      </h1>
      <p className="mt-3 text-body-lg text-muted">
        {notFound
          ? 'The link may be out of date. Nothing you entered has been lost.'
          : 'Something went wrong while showing this page. Your demo progress is kept in this browser tab.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button to="/">Go to the homepage</Button>
        <Button to="/app" variant="secondary">
          Open the patient workspace
        </Button>
      </div>
    </div>
  )
}

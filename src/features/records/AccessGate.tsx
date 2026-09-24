import { KeyRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, Callout } from '@/components/ui'
import { usePeople } from '@/demo/store'

/**
 * Permission boundary (PATIENT.md › Loading, error, waiting and empty states:
 * "Access incomplete"). A helper without record access sees an access route,
 * never the record itself and never a medical warning.
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const { hasRecordAccess, name } = usePeople()
  if (hasRecordAccess) return <>{children}</>
  return (
    <Callout
      tone="neutral"
      title="We need to arrange permission to view this record"
      action={
        <Button to="/app/access" variant="secondary" iconLeft={<KeyRound className="size-5" />}>
          Help arrange access
        </Button>
      }
      className="max-w-reading"
    >
      <p>
        You can help {name} once {name} agrees, or once access is arranged with support. Nothing from {name}’s
        record is shown until then.
      </p>
    </Callout>
  )
}

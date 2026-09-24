import { Eye } from 'lucide-react'
import { Initials, PageHeader } from '@/components/ui'
import { EPISODE_DATES, ORG } from '@/demo/fixtures'
import { usePeople } from '@/demo/store'
import { CLINICIAN, sexText } from '../data'

/**
 * Identity bar (DESIGN.md › Tables: keep essential identity context visible
 * when opening details). Owns the page h1.
 */
export function IdentityBar() {
  const { fullName, patient, helper } = usePeople()
  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`.toUpperCase()

  const facts = [
    { term: 'Age', detail: patient.ageApproximate ? `${patient.age} (approximate)` : String(patient.age) },
    { term: 'Sex', detail: sexText(patient.sex) },
    { term: 'Preferred language', detail: patient.language || 'Not recorded' },
    {
      term: 'Care partner',
      detail: `${helper.firstName} ${helper.lastName} · ${helper.relationship} · authorized helper`,
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="hidden sm:block">
            <Initials size="lg">{initials}</Initials>
          </span>
          <PageHeader
            title={fullName}
            className="min-w-0"
            meta={
              <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
                {facts.map((f) => (
                  <div key={f.term} className="min-w-0">
                    <dt className="text-metadata text-muted">{f.term}</dt>
                    <dd className="text-data text-ink">{f.detail}</dd>
                  </div>
                ))}
              </dl>
            }
          />
        </div>
        <div className="flex shrink-0 items-start gap-2.5 border-t border-border pt-4 xl:max-w-sm xl:border-t-0 xl:border-l xl:pt-1 xl:pl-6">
          <Eye aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
          <div className="space-y-0.5">
            <p className="text-body-md text-ink">
              Viewing as <span className="font-semibold">{CLINICIAN.name}</span> · {ORG.clinic}
            </p>
            <p className="text-metadata text-muted">
              Access began when the family shared a visit packet on {EPISODE_DATES.bookingRequested}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

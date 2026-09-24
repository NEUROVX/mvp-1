import { useMemo, useState } from 'react'
import { Callout, DemoTag, PageHeader, TextField } from '@/components/ui'
import { ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import {
  clinicHasAccess,
  DEMO_PATIENT_ID,
  episodeRow,
  RECORD_PATH,
  SAMPLE_PATIENTS,
  type PatientRow,
} from '@/features/clinician/data'
import { DataTable } from '@/features/clinician/DataTable'
import { RowAction } from '@/features/clinician/parts'
import { usePageTitle } from '@/lib/hooks'

export default function PatientsPage() {
  usePageTitle('Patients')
  const { state } = useDemo()
  const { fullName, patient, helper } = usePeople()
  const [query, setQuery] = useState('')
  const access = clinicHasAccess(state.stage)

  const rows = useMemo(() => {
    const list: PatientRow[] = []
    if (access) {
      const e = episodeRow(state, `${helper.firstName} ${helper.lastName}`)
      list.push({
        id: DEMO_PATIENT_ID,
        name: fullName,
        age: patient.ageApproximate ? `${patient.age} (approx.)` : String(patient.age),
        lastEvent: e.lastDate ? `${e.lastEvent} · ${e.lastDate}` : e.lastEvent,
        nextStep: e.nextStep,
        owner: e.owner,
        href: RECORD_PATH,
        demoPatient: true,
      })
    }
    list.push(...SAMPLE_PATIENTS)
    const q = query.trim().toLowerCase()
    return q ? list.filter((r) => [r.name, r.lastEvent, r.nextStep, r.owner].some((v) => v.toLowerCase().includes(q))) : list
  }, [access, fullName, helper.firstName, helper.lastName, patient.age, patient.ageApproximate, query, state])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patients"
        meta={<p className="text-body-md text-muted">People who shared information with {ORG.clinic}, and who owns each next step.</p>}
      />

      {!access ? (
        <Callout tone="neutral" title="The demo patient is not listed yet.">
          <p>They appear here once the family requests an appointment and shares a visit packet with this clinic.</p>
        </Callout>
      ) : null}

      <section aria-labelledby="patients-h">
        <div className="mb-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="patients-h" className="text-heading-sm text-ink">
              Your clinic’s patients
            </h2>
            <DemoTag>Example rows</DemoTag>
          </div>
          <TextField
            type="search"
            label="Search your clinic’s patients"
            hint="Name, last event, next step or owner. This clinic only."
            className="max-w-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DataTable<PatientRow>
          caption="Patients of this clinic"
          rowKey={(r) => r.id}
          groups={[{ id: 'all', rows }]}
          empty={
            <p className="rounded-lg border border-border bg-surface px-5 py-4 text-body-md text-muted sm:px-6">
              No patients match “{query.trim()}”. Search covers this clinic’s patients only.
            </p>
          }
          columns={[
            {
              key: 'name',
              header: 'Patient',
              primary: true,
              cell: (r) => <span className={r.demoPatient ? 'font-semibold' : 'font-medium'}>{r.name}</span>,
            },
            { key: 'age', header: 'Age', cell: (r) => <span className="tabular">{r.age}</span>, className: 'w-24' },
            { key: 'last', header: 'Last event', cell: (r) => r.lastEvent },
            {
              key: 'next',
              header: 'Next step',
              cell: (r) => <span className={r.demoPatient ? 'font-medium' : undefined}>{r.nextStep}</span>,
            },
            { key: 'owner', header: 'Owner', cell: (r) => r.owner },
            {
              key: 'action',
              header: 'Action',
              action: true,
              cell: (r) => (
                <RowAction to={r.href} context={r.name}>
                  Open record
                </RowAction>
              ),
            },
          ]}
        />
      </section>
    </div>
  )
}

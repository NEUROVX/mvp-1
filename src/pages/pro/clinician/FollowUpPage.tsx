import { Repeat2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DemoTag, EmptyState, PageHeader, Segmented, StatusBadge } from '@/components/ui'
import { EPISODE_DATES, ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import {
  CLINICIAN,
  DEMO_PATIENT_ID,
  RECORD_PATH,
  recordTabPath,
  SAMPLE_FOLLOW_UPS,
  type FollowUpRow,
} from '@/features/clinician/data'
import { DataTable } from '@/features/clinician/DataTable'
import { RowAction } from '@/features/clinician/parts'
import { usePageTitle } from '@/lib/hooks'

type Filter = 'all' | 'you' | 'others'

export default function FollowUpPage() {
  usePageTitle('Follow-up')
  const { state } = useDemo()
  const { fullName } = usePeople()
  const [filter, setFilter] = useState<Filter>('all')
  const st = state.stage

  const rows = useMemo(() => {
    const list: FollowUpRow[] = []
    if (st === 'follow-up-due')
      list.push({
        id: DEMO_PATIENT_ID,
        patient: fullName,
        item: 'Follow-up visit to discuss results',
        due: `Suggested by ${EPISODE_DATES.followUp}`,
        owner: 'Family books it',
        waitingOn: 'others',
        href: recordTabPath('care-plan'),
        demoPatient: true,
      })
    if (st === 'reviewed' || st === 'follow-up-due')
      list.push({
        id: `${DEMO_PATIENT_ID}-plasma`,
        patient: fullName,
        item: 'Review the plasma biomarker assay when it is released',
        due: 'When released - no estimate supplied',
        owner: `${ORG.referenceLab}, then ${CLINICIAN.name}`,
        waitingOn: 'others',
        href: recordTabPath('results'),
        demoPatient: true,
      })
    if (st === 'existing-care')
      list.push({
        id: DEMO_PATIENT_ID,
        patient: fullName,
        item: 'Arrange the next visit',
        due: 'No date set',
        owner: 'Family',
        waitingOn: 'others',
        href: RECORD_PATH,
        demoPatient: true,
      })
    list.push(...SAMPLE_FOLLOW_UPS)
    return filter === 'all' ? list : list.filter((r) => r.waitingOn === filter)
  }, [filter, fullName, st])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Follow-up"
        meta={
          <p className="text-body-md text-muted">
            Next steps after a visit or a result, and who owns each one. Patients and families book their own visits.
          </p>
        }
      />

      <section aria-labelledby="follow-h">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="follow-h" className="text-heading-sm text-ink">
              Open follow-up items
            </h2>
            <DemoTag>Example rows</DemoTag>
          </div>
          <Segmented<Filter>
            label="Show follow-up items"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'you', label: 'Waiting on you' },
              { value: 'others', label: 'Waiting on others' },
            ]}
          />
        </div>
        <DataTable<FollowUpRow>
          caption="Follow-up items for this clinic"
          rowKey={(r) => r.id}
          groups={[{ id: 'items', rows }]}
          empty={
            <EmptyState title={filter === 'you' ? 'Nothing is waiting on you' : 'No follow-up items'} icon={<Repeat2 strokeWidth={1.75} />}>
              {filter === 'you'
                ? 'Items owned by families, laboratories or the clinic desk are under “Waiting on others”.'
                : 'Follow-up items appear here after a visit or a reviewed result.'}
            </EmptyState>
          }
          columns={[
            {
              key: 'patient',
              header: 'Patient',
              primary: true,
              className: 'whitespace-nowrap',
              cell: (r) => <span className={r.demoPatient ? 'font-semibold' : 'font-medium'}>{r.patient}</span>,
            },
            { key: 'item', header: 'Follow-up item', cell: (r) => r.item },
            { key: 'due', header: 'Due', cell: (r) => r.due },
            {
              key: 'owner',
              header: 'Owner',
              cell: (r) => (
                <span className="inline-flex flex-col items-start gap-1">
                  <span>{r.owner}</span>
                  {r.waitingOn === 'you' ? (
                    <StatusBadge tone="info">
                      Waiting on you
                    </StatusBadge>
                  ) : null}
                </span>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              action: true,
              cell: (r) => (
                <RowAction to={r.href} context={r.patient}>
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

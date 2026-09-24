import { ArrowLeft, UserRoundX } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Button, Callout, EmptyState, PageHeader, Tabs } from '@/components/ui'
import { useDemo } from '@/demo/store'
import { ClinicianDialogs, useClinicianActions } from '@/features/clinician/actions'
import { clinicHasAccess, DEMO_PATIENT_ID, RECORD_TABS, SAMPLE_IDS, type RecordTab } from '@/features/clinician/data'
import { ActionPanel } from '@/features/clinician/record/ActionPanel'
import { AssessmentsTab } from '@/features/clinician/record/AssessmentsTab'
import { CarePlanTab } from '@/features/clinician/record/CarePlanTab'
import { IdentityBar } from '@/features/clinician/record/IdentityBar'
import { ResultsTab } from '@/features/clinician/record/ResultsTab'
import { SummaryTab } from '@/features/clinician/record/SummaryTab'
import { TimelineTab } from '@/features/clinician/record/TimelineTab'
import { usePageTitle } from '@/lib/hooks'

function BackLink() {
  return (
    <Link
      to="/pro/clinician/patients"
      className="inline-flex min-h-11 items-center gap-1.5 text-label text-primary hover:text-primary-hover"
    >
      <ArrowLeft aria-hidden="true" className="size-[18px]" strokeWidth={2} />
      Patients
    </Link>
  )
}

export default function PatientRecordPage() {
  usePageTitle('Patient record')
  const { patientId } = useParams()
  const { state } = useDemo()

  if (patientId !== DEMO_PATIENT_ID) {
    const sample = patientId ? SAMPLE_IDS.has(patientId) : false
    return (
      <div className="space-y-6">
        <BackLink />
        <PageHeader title="Patient record" />
        <EmptyState
          title="No record found in this workspace"
          icon={<UserRoundX strokeWidth={1.75} />}
          action={<Button to="/pro/clinician/patients">Back to patients</Button>}
        >
          {sample
            ? 'This is a background example row. Only the demo patient’s record is part of this preview.'
            : 'Check the link, or search your clinic’s patients.'}
        </EmptyState>
      </div>
    )
  }

  if (!clinicHasAccess(state.stage)) {
    return (
      <div className="space-y-6">
        <BackLink />
        <PageHeader title="Patient record" />
        <Callout tone="neutral" title="This clinic has no access to this person’s information yet.">
          <p>Access starts when they share a visit packet.</p>
        </Callout>
      </div>
    )
  }

  return <RecordView />
}

const TAB_IDS = RECORD_TABS.map((t) => t.id)

function RecordView() {
  const actions = useClinicianActions()
  const [params, setParams] = useSearchParams()
  const q = params.get('tab') as RecordTab | null
  const tab: RecordTab = q && TAB_IDS.includes(q) ? q : 'summary'

  const setTab = (t: RecordTab) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('tab', t)
        return next
      },
      { replace: true },
    )

  // After an action changes the episode, the button that was pressed is gone:
  // move focus to the updated next-step heading so keyboard users keep their place.
  const nextHeading = useRef<HTMLHeadingElement>(null)
  const firstFeedback = useRef(true)
  useEffect(() => {
    if (firstFeedback.current) {
      firstFeedback.current = false
      return
    }
    if (actions.feedback) nextHeading.current?.focus()
  }, [actions.feedback])

  // On narrow screens the tab strip scrolls sideways: keep the selected tab in view
  // (horizontal scroll of the strip only, never the page).
  useEffect(() => {
    const sel = document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    const list = sel?.parentElement
    if (!sel || !list || list.scrollWidth <= list.clientWidth) return
    const left = sel.offsetLeft - list.offsetLeft
    if (left < list.scrollLeft || left + sel.offsetWidth > list.scrollLeft + list.clientWidth)
      list.scrollLeft = Math.max(0, left - 16)
  }, [tab])

  // A link elsewhere on the page (e.g. the timeline) changed the tab: focus it.
  const lastTab = useRef(tab)
  const fromTablist = useRef(false)
  useEffect(() => {
    if (lastTab.current === tab) return
    lastTab.current = tab
    if (fromTablist.current) {
      fromTablist.current = false
      return
    }
    document.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus()
  }, [tab])

  return (
    <div className="space-y-6">
      <BackLink />
      <IdentityBar />
      <ActionPanel ref={nextHeading} actions={actions} onTab={setTab} />
      <Tabs
        label="Patient record"
        className="pt-2 [&_[role=tab]]:px-3 sm:[&_[role=tab]]:px-4"
        value={tab}
        onChange={(id) => {
          fromTablist.current = true
          setTab(id as RecordTab)
        }}
        tabs={RECORD_TABS.map((t) => ({
          id: t.id,
          label: t.label,
          panel:
            t.id === 'summary' ? (
              <SummaryTab />
            ) : t.id === 'timeline' ? (
              <TimelineTab />
            ) : t.id === 'assessments' ? (
              <AssessmentsTab />
            ) : t.id === 'results' ? (
              <ResultsTab actions={actions} />
            ) : (
              <CarePlanTab />
            ),
        }))}
      />
      <ClinicianDialogs actions={actions} />
    </div>
  )
}

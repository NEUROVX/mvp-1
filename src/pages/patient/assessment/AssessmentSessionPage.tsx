import { CircleCheck, CircleStop } from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Dialog, InlineStatus } from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { Panel, TaskLede, TaskTitle, useFocusOnChange } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

const SECTIONS = 3

/**
 * P05 assessment shell (PATIENT.md › Assessment experience; PATIENT-ONE-STEP § 3).
 * A distraction-free container only: no test items, word lists, drawings,
 * timers, points, hints, pause, audio or going back to improve. Continue
 * demonstrates navigation and ends in "Demo completion" with no score.
 * "Stop and arrange help" is always available and records an interruption.
 */
export default function AssessmentSessionPage() {
  usePageTitle('Assessment preview')
  const { state, set } = useDemo()
  const { possessive, persona } = usePeople()
  const navigate = useNavigate()
  const [confirmStop, setConfirmStop] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const a = state.assessment
  const section = a.status === 'in-progress' ? Math.min(Math.max(a.section, 1), SECTIONS) : 1
  const view = a.status === 'completed' ? 'done' : a.status === 'interrupted' ? 'stopped' : 'section'
  const titleRef = useFocusOnChange<HTMLHeadingElement>(`${view}-${section}`)

  const next = () => {
    if (section < SECTIONS) {
      set((s) => ({ ...s, assessment: { ...s.assessment, status: 'in-progress', section: section + 1 } }))
      return
    }
    set((s) => ({
      ...s,
      // Booking first is allowed: never move an episode that is already further on.
      stage: hasReached(s.stage, 'assessment-completed') ? s.stage : 'assessment-completed',
      assessment: { ...s.assessment, status: 'completed', section: SECTIONS, completedAt: EPISODE_DATES.assessment },
    }))
    setJustCompleted(true)
  }

  const stop = () => {
    set((s) => ({
      ...s,
      stage: hasReached(s.stage, 'assessment-completed') ? s.stage : 'cannot-assess',
      assessment: { ...s.assessment, status: 'interrupted', section },
    }))
    setConfirmStop(false)
    navigate('/app/care/assessment/summary')
  }

  if (view === 'done') {
    return (
      <Panel className="space-y-6 sm:p-10">
        <div className="flex items-center gap-3 text-primary">
          <CircleCheck aria-hidden="true" className="size-6" strokeWidth={1.75} />
          <p className="text-label">Assessment preview</p>
        </div>
        <div className="space-y-3">
          <TaskTitle ref={titleRef}>Demo completion</TaskTitle>
          <TaskLede className="text-ink">
            This preview produced no score. {persona === 'patient' ? 'Your' : possessive} clinician will see that the
            preview was completed, and when.
          </TaskLede>
        </div>
        {justCompleted ? <InlineStatus>Completion saved in this browser tab</InlineStatus> : null}
        <Button size="lg" to="/app/care/assessment/summary" className="w-full sm:w-auto">
          View your summary
        </Button>
      </Panel>
    )
  }

  if (view === 'stopped') {
    return (
      <Panel className="space-y-6 sm:p-10">
        <TaskTitle ref={titleRef}>This assessment was stopped</TaskTitle>
        <TaskLede className="text-ink">This is not a result. A clinician can arrange an assisted assessment.</TaskLede>
        <Button size="lg" to="/app/care/assessment/summary" className="w-full sm:w-auto">
          View your summary
        </Button>
      </Panel>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-label text-muted">Assessment preview</p>
          <TaskTitle ref={titleRef}>
            Section {section} of {SECTIONS}
          </TaskTitle>
        </div>
        <div aria-hidden="true" className="flex gap-1.5">
          {Array.from({ length: SECTIONS }, (_, i) => (
            <span key={i} className={clsx('h-1 flex-1 rounded-full', i < section ? 'bg-primary' : 'bg-border')} />
          ))}
        </div>
      </div>

      <section
        aria-label={`Section ${section} content`}
        className="flex min-h-[22rem] flex-col rounded-lg border-2 border-dashed border-control/60 bg-surface sm:min-h-[28rem]"
      >
        <div className="flex justify-end px-3 pt-2 sm:px-4">
          <Button variant="quiet" onClick={() => setConfirmStop(true)} iconLeft={<CircleStop className="size-5" strokeWidth={1.75} />}>
            Stop and arrange help
          </Button>
        </div>
        <div className="grid flex-1 place-items-center px-6 pb-12 text-center">
          <div className="max-w-md space-y-3">
            <p className="text-heading-sm text-ink sm:text-heading-md">Authorized assessment content will appear here</p>
            <p className="text-body-md text-muted">Assessment content placeholder - not a clinical test</p>
          </div>
        </div>
      </section>

      <div className="flex sm:justify-end">
        <Button size="lg" onClick={next} className="w-full sm:w-auto sm:min-w-44">
          Continue
        </Button>
      </div>

      <Dialog
        open={confirmStop}
        onClose={() => setConfirmStop(false)}
        title="Stop the assessment?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmStop(false)}>
              Keep going
            </Button>
            <Button onClick={stop}>Stop and arrange help</Button>
          </>
        }
      >
        <p className="text-body-lg text-ink">
          The assessment will stop here. This is not a result. A clinician can arrange an assisted assessment.
        </p>
      </Dialog>
    </div>
  )
}

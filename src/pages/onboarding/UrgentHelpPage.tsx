import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button, Callout } from '@/components/ui'
import { TaskLede, TaskTitle } from '@/features/intake/ui'
import { usePageTitle } from '@/lib/hooks'

const SIGNS = [
  'Sudden confusion',
  'New weakness or numbness in the face, arm or leg',
  'New difficulty speaking or understanding',
  'A sudden, severe headache',
  'Fainting or a seizure',
]

/**
 * Urgent-help route (PATIENT.md › Progressive intake; SCOPE.md § 2: 112 / 108).
 * A labelled guidance placeholder, not a triage algorithm. No routine booking
 * and no reassurance that an emergency has been ruled out.
 */
export default function UrgentHelpPage() {
  usePageTitle('Get urgent help')
  const navigate = useNavigate()

  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <TaskTitle>Sudden changes need urgent care</TaskTitle>
        <TaskLede>Some changes need medical help straight away, not a routine appointment.</TaskLede>
        <p className="w-fit max-w-full rounded-sm border border-control px-3 py-1.5 text-body-md text-ink">
          <strong className="font-semibold">Guidance placeholder</strong> - clinician-approved wording will replace this
          before any real use.
        </p>
      </div>

      <Callout tone="error" title="Get help now">
        <p className="text-body-lg">
          Call <strong className="font-bold">112</strong> now (India national emergency number) or go to the nearest
          emergency department. Many states also use <strong className="font-bold">108</strong> for ambulances.
        </p>
      </Callout>

      <section aria-labelledby="signs-heading" className="space-y-3">
        <h2 id="signs-heading" className="text-heading-sm text-ink">
          Act now if any of these start suddenly
        </h2>
        <ul className="divide-y divide-border border-y border-border">
          {SIGNS.map((s) => (
            <li key={s} className="flex items-start gap-4 py-4 text-body-lg text-ink">
              <span aria-hidden="true" className="mt-[0.7rem] size-2 shrink-0 rounded-full bg-ink" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:gap-6">
        <Button variant="secondary" onClick={goBack} iconLeft={<ChevronLeft className="size-5" />}>
          Go back
        </Button>
        <Button variant="quiet" to="/">
          Go to the NeuroVX homepage
        </Button>
      </div>
    </div>
  )
}

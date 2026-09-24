import { clsx } from 'clsx'
import { FlaskConical, MonitorSmartphone, RotateCcw, Stethoscope, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button, Dialog, RadioGroup } from '@/components/ui'
import { GOLDEN_PATH, STAGE_META } from '@/demo/episode'
import { useDemo, usePeople } from '@/demo/store'
import type { EpisodeStage, Persona } from '@/demo/types'

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[60] rounded-md bg-primary px-4 py-3 text-label text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  )
}

/**
 * Presenter-only demo controls. Opens on request only (never auto-opens).
 * Moves the single fictional care episode to a point in time, switches who is
 * signed in, and links the three workspaces that share the episode.
 */
export function DemoControls({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const { state, jumpTo, setPersona, reset } = useDemo()
  const { name, helper } = usePeople()
  const navigate = useNavigate()
  const variants = (Object.keys(STAGE_META) as EpisodeStage[]).filter((s) => STAGE_META[s].group === 'variant')

  const stageOption = (s: EpisodeStage) => ({
    value: s,
    label: STAGE_META[s].label,
    description: STAGE_META[s].when,
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          'fixed z-40 inline-flex min-h-11 items-center gap-2 rounded-md border border-navy bg-navy px-3.5 text-label text-white shadow-2 hover:bg-primary-hover',
          className ?? 'bottom-4 left-4',
        )}
      >
        <MonitorSmartphone aria-hidden="true" className="size-5" />
        Demo
        <span className="sr-only">controls for presenters</span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title="Demo controls"
        description="For presenters. Moves the fictional care episode to a point in time. Nothing is sent anywhere."
        footer={
          <>
            <Button
              variant="secondary"
              iconLeft={<RotateCcw className="size-5" />}
              onClick={() => {
                reset()
                setOpen(false)
                navigate('/')
              }}
            >
              Reset demo
            </Button>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </>
        }
      >
        <div className="space-y-8">
          <RadioGroup<Persona>
            name="persona"
            legend="Who is signed in to the patient workspace"
            value={state.persona}
            onChange={setPersona}
            columns={3}
            options={[
              { value: 'care-partner', label: `${helper.firstName} - care partner`, description: 'Authorized helper' },
              { value: 'patient', label: `${name} - patient`, description: 'Own account' },
              { value: 'limited-helper', label: 'Helper, no access yet', description: 'Access not arranged' },
            ]}
          />

          <RadioGroup<EpisodeStage>
            name="stage"
            legend="Care episode: main path"
            hint="Each point includes everything that happened before it."
            value={state.stage}
            onChange={(s) => jumpTo(s)}
            columns={2}
            options={GOLDEN_PATH.map(stageOption)}
          />

          <RadioGroup<EpisodeStage>
            name="stage-variant"
            legend="Care episode: other situations"
            value={state.stage}
            onChange={(s) => jumpTo(s)}
            columns={2}
            options={variants.map(stageOption)}
          />

          <div>
            <p className="text-label text-ink">Open a workspace</p>
            <p className="mt-1 text-body-md text-muted">All three share this episode. Actions in one appear in the others.</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { to: '/app', label: 'Patient and family', icon: <UsersRound className="size-5" /> },
                { to: '/pro/clinician', label: 'Clinician', icon: <Stethoscope className="size-5" /> },
                { to: '/pro/lab', label: 'Diagnostic lab', icon: <FlaskConical className="size-5" /> },
              ].map((w) => (
                <li key={w.to}>
                  <Link
                    to={w.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center gap-3 rounded-md border border-control px-4 text-label text-ink hover:border-primary hover:text-primary"
                  >
                    <span aria-hidden="true">{w.icon}</span>
                    {w.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  )
}

/** One discreet line at the bottom of private screens. */
export function PrototypeFooter({ className }: { className?: string }) {
  return (
    <p className={clsx('text-body-md text-muted', className)}>
      Product preview - not for clinical use. All people, clinics and results shown are fictional.
    </p>
  )
}

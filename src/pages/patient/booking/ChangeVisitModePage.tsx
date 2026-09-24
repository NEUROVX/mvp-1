import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Callout, DemoTag, EmptyState, PageHeader, RadioGroup, TextLink } from '@/components/ui'
import { clinicianById } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { Clinician, Slot, VisitMode } from '@/demo/types'
import { BackLink } from '@/features/booking/BackLink'
import { AccessGate } from '@/features/records/AccessGate'
import {
  findSlot,
  hasActiveBooking,
  isConfirmedStage,
  isSlotTaken,
  locality,
  MODE_LABEL,
  slotLabel,
  sortSlots,
  weekday,
  weekdayShort,
} from '@/features/booking/lib'
import { SummaryList } from '@/features/booking/SummaryList'
import { usePageTitle } from '@/lib/hooks'

export default function ChangeVisitModePage() {
  usePageTitle('Change your visit')
  const { state } = useDemo()
  const { hasRecordAccess } = usePeople()
  const c = clinicianById(state.booking.clinicianId)
  const current = findSlot(c, state.booking.slotId)

  if (!hasRecordAccess) {
    return (
      <div className="space-y-6">
        <BackLink to="/app/care/visit">Back to your visit</BackLink>
        <PageHeader title="Change your visit" />
        <AccessGate>{null}</AccessGate>
      </div>
    )
  }

  if (!hasActiveBooking(state.stage) || !c || !current) {
    return (
      <div className="space-y-6">
        <BackLink to="/app/care/visit">Back to your visit</BackLink>
        <PageHeader title="Change your visit" />
        <EmptyState
          title="There is no upcoming visit to change"
          action={
            <Button to="/app/care/visit" variant="secondary">
              View visit details
            </Button>
          }
        >
          A time can be changed after you request an appointment and before the visit takes place.
        </EmptyState>
      </div>
    )
  }
  return <ChangeVisit c={c} current={current} />
}

function ChangeVisit({ c, current }: { c: Clinician; current: Slot }) {
  const navigate = useNavigate()
  const { state, set } = useDemo()
  const wasConfirmed = isConfirmedStage(state.stage)
  const currentMode = state.booking.mode ?? current.mode

  const [mode, setMode] = useState<VisitMode>(currentMode)
  const [slotId, setSlotId] = useState<string | undefined>(current.id)
  const [error, setError] = useState<string>()

  const slots = sortSlots(c.slots.filter((s) => s.mode === mode))
  const chosen = findSlot(c, slotId)
  const unchanged = chosen?.id === current.id

  const submit = () => {
    if (!chosen) {
      setError('Choose a time for this visit type.')
      return
    }
    if (unchanged) {
      setError('Choose a different time or visit type to request a change.')
      return
    }
    set((s) => ({
      ...s,
      // A change needs clinic confirmation again (SCOPE.md › stage transitions).
      stage: wasConfirmed ? 'booking-requested' : s.stage,
      booking: {
        ...s.booking,
        slotId: chosen.id,
        mode: chosen.mode,
        // Kept in the store so the visit hub still shows the confirmed time after a reload.
        previous: wasConfirmed ? { slotId: current.id, mode: currentMode } : s.booking.previous,
      },
    }))
    navigate('/app/care/visit', {
      state: { changeFrom: `${slotLabel(current)} · ${MODE_LABEL[currentMode]}`, wasConfirmed },
    })
  }

  const modeOptions = (['in-clinic', 'video'] as VisitMode[]).map((m) => {
    const offered = c.modes.includes(m)
    return {
      value: m,
      label: MODE_LABEL[m],
      description: !offered
        ? 'Not offered by this clinician'
        : m === 'in-clinic'
          ? `At ${c.clinic}, ${locality(c)}`
          : 'Join from home. The clinic sends joining details.',
      disabled: !offered,
    }
  })

  return (
    <div className="space-y-8">
      <BackLink to="/app/care/visit">Back to your visit</BackLink>

      <PageHeader
        title="Change your visit"
        lede={`Choose a new visit type or time with ${c.name}.`}
        meta={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-md text-ink">
            <span>
              {wasConfirmed ? 'Booked' : 'Requested'}: <span className="tabular">{slotLabel(current)}</span> ·{' '}
              {MODE_LABEL[currentMode]}
            </span>
            <DemoTag />
          </p>
        }
      />

      <Callout tone="info" title={wasConfirmed ? 'Your current time stays until the clinic confirms the change' : 'Your request is still pending'}>
        <p>
          {wasConfirmed
            ? `${c.clinic} checks the new time first. If it cannot, your visit stays as booked.`
            : `${c.clinic} has not confirmed the current request yet. The change replaces it.`}
        </p>
      </Callout>

      <RadioGroup<VisitMode>
        name="mode"
        legend="Visit type"
        legendSize="lg"
        columns={2}
        value={mode}
        onChange={(m) => {
          setMode(m)
          setSlotId(m === currentMode ? current.id : undefined)
          setError(undefined)
        }}
        options={modeOptions}
      />

      {slots.length ? (
        <RadioGroup
          name="slot"
          legend={`${MODE_LABEL[mode]} times`}
          legendSize="lg"
          hint="All times are IST."
          value={slotId}
          onChange={(v) => {
            setSlotId(v)
            setError(undefined)
          }}
          options={slots.map((s) => {
            const taken = isSlotTaken(s.id)
            return {
              value: s.id,
              label: (
                <span className="tabular">
                  {weekdayShort(s.date)} {slotLabel(s)}
                </span>
              ),
              description: s.id === current.id ? 'Your current time' : taken ? 'No longer available' : undefined,
              disabled: taken && s.id !== current.id,
            }
          })}
        />
      ) : (
        <p className="text-body-md text-ink">
          No {MODE_LABEL[mode].toLowerCase()} times are listed with this clinician.{' '}
          <TextLink to="/app/support#assisted">Ask support for help</TextLink>.
        </p>
      )}

      <section aria-labelledby="change-review" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <h2 id="change-review" className="mb-5 text-heading-sm text-ink">
          Check the change
        </h2>
        <SummaryList
          rows={[
            {
              term: wasConfirmed ? 'Current visit' : 'Current request',
              detail: (
                <p className="tabular">
                  {slotLabel(current)} · {MODE_LABEL[currentMode]}
                </p>
              ),
            },
            {
              term: 'New request',
              detail:
                chosen && !unchanged ? (
                  <>
                    <p className="tabular text-data">
                      {weekday(chosen.date)} {slotLabel(chosen)}
                    </p>
                    <p>{MODE_LABEL[chosen.mode]}</p>
                  </>
                ) : (
                  <p className="text-muted">Choose a different time or visit type</p>
                ),
            },
            { term: 'Clinician', detail: <p>{c.name}</p> },
            { term: 'Confirmation', detail: <p>The clinic confirms the change. Until then it is pending.</p> },
          ]}
        />
      </section>

      <div className="space-y-4 border-t border-border pt-6">
        <p role="alert" className="text-body-md font-medium text-error">
          {error}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button size="lg" onClick={submit} className="w-full sm:w-auto">
            Request change
          </Button>
          <Button to="/app/care/visit" variant="quiet">
            Keep current visit
          </Button>
        </div>
      </div>
    </div>
  )
}

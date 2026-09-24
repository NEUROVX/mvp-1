import { ArrowRight, Repeat2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  DemoTag,
  DescriptionList,
  Divider,
  EmptyState,
  Initials,
  PageHeader,
  RadioGroup,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { clinicianById } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { Clinician, Slot } from '@/demo/types'
import { BackLink } from '@/features/booking/BackLink'
import {
  findSlot,
  followUpSlots,
  groupByDate,
  hasActiveBooking,
  isSlotTaken,
  locality,
  MODE_LABEL,
  modesText,
  slotLabel,
  weekday,
} from '@/features/booking/lib'
import { usePageTitle } from '@/lib/hooks'

export default function ClinicianDetailPage() {
  const { clinicianId } = useParams()
  const [params] = useSearchParams()
  const { state } = useDemo()
  const c = clinicianById(clinicianId)
  const episodeClinicianId = state.booking.clinicianId ?? 'kavya-rao'
  // A follow-up reuses the same clinician and care episode (PATIENT.md › Care plan).
  const followUp = params.get('visit') === 'follow-up' && c?.id === episodeClinicianId
  usePageTitle(!c ? 'Clinician not available' : followUp ? 'Book a follow-up' : c.name)

  if (!c) {
    return (
      <div className="space-y-6">
        <BackLink to="/app/care/find-clinician">Back to search</BackLink>
        <PageHeader title="Clinician details" />
        <EmptyState
          title="This clinician is not available"
          action={
            <Button to="/app/care/find-clinician" variant="secondary">
              Back to search
            </Button>
          }
        >
          The link may be out of date, or this clinician is not listed in this preview. You can choose someone else.
        </EmptyState>
      </div>
    )
  }
  return <ClinicianDetail key={`${c.id}-${followUp}`} c={c} followUp={followUp} />
}

function ClinicianDetail({ c, followUp }: { c: Clinician; followUp: boolean }) {
  const navigate = useNavigate()
  const { state, set } = useDemo()
  const stage = state.stage
  const slots = followUp ? followUpSlots(c) : c.slots

  const initial = followUp
    ? state.booking.followUp?.slotId
    : state.booking.clinicianId === c.id
      ? state.booking.slotId
      : undefined
  const [slotId, setSlotId] = useState<string | undefined>(initial && !isSlotTaken(initial) ? initial : undefined)
  const [error, setError] = useState<string>()

  const existingFollowUp = followUp ? state.booking.followUp : undefined
  const existingFollowUpSlot = findSlot(c, existingFollowUp?.slotId)
  const guard = !followUp && hasActiveBooking(stage)

  const choose = () => {
    const slot = findSlot(c, slotId)
    if (!slot) {
      setError('Choose a time to continue.')
      return
    }
    const q = new URLSearchParams({ clinician: c.id, slot: slot.id })
    if (followUp) {
      q.set('visit', 'follow-up')
    } else if (!hasReached(stage, 'booking-requested')) {
      // No request exists yet: this becomes the booking being prepared.
      set((s) => ({ ...s, booking: { ...s.booking, clinicianId: c.id, slotId: slot.id, mode: slot.mode } }))
    }
    navigate(`/app/care/book/review?${q.toString()}`)
  }

  const optionFor = (s: Slot) => {
    const taken = isSlotTaken(s.id)
    return {
      value: s.id,
      label: <span className="tabular">{s.time}</span>,
      description: taken ? 'No longer available' : s.mode === 'in-clinic' ? 'In clinic' : 'Video visit',
      disabled: taken,
    }
  }

  return (
    <div className="space-y-8">
      <BackLink to={followUp ? '/app/care/plan' : '/app/care/find-clinician'}>
        {followUp ? 'Back to care plan' : 'Back to search'}
      </BackLink>

      {guard ? (
        <Callout
          tone="info"
          title="You already have a visit request or booking"
          action={<ArrowLink to="/app/care/visit">View your visit</ArrowLink>}
        >
          <p>Check it before requesting another, so the clinic does not receive two requests.</p>
        </Callout>
      ) : null}

      {existingFollowUp ? (
        <Callout
          tone="info"
          title="Follow-up requested - pending clinic confirmation"
          action={<ArrowLink to="/app/care/visit">View your visit</ArrowLink>}
        >
          <p>
            Requested:{' '}
            <span className="tabular">
              {existingFollowUpSlot ? slotLabel(existingFollowUpSlot) : 'time on your visit page'}
            </span>
            , {MODE_LABEL[existingFollowUp.mode].toLowerCase()}. Choosing another time replaces this request.
          </p>
        </Callout>
      ) : null}

      <div className="flex items-start gap-4 sm:gap-5">
        <Initials size="lg" className="mt-1">
          {c.initials}
        </Initials>
        <PageHeader
          className="min-w-0 flex-1"
          title={followUp ? 'Book a follow-up' : c.name}
          lede={followUp ? `${c.name} · ${c.specialty}` : `${c.label} · ${c.specialty}`}
          meta={
            followUp ? (
              <p className="flex items-start gap-2.5 text-body-md text-ink">
                <Repeat2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
                Same clinician and care episode. Your information stays with this visit.
              </p>
            ) : (
              <p className="text-body-md text-ink">
                {c.clinic} · {locality(c)}
              </p>
            )
          }
        />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10">
        {/* Slot picker: first on mobile, right column on desktop */}
        <section
          aria-labelledby="choose-time"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1"
        >
          <h2 id="choose-time" className="text-heading-md text-ink">
            {followUp ? 'Choose a follow-up time' : 'Choose a time'}
          </h2>
          <p className="mt-1 text-body-md text-muted">
            All times are IST. {c.name.startsWith('Dr.') ? 'The clinic' : 'The provider'} confirms your request.
          </p>

          {slots.length ? (
            <div className="mt-5 space-y-5">
              {groupByDate(slots).map((g) => (
                <RadioGroup
                  key={g.date}
                  name="slot"
                  legend={
                    <span className="tabular">
                      {weekday(g.date)} {g.date}
                    </span>
                  }
                  value={slotId}
                  onChange={(v) => {
                    setSlotId(v)
                    setError(undefined)
                  }}
                  options={g.slots.map(optionFor)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-body-md text-ink">
              No times are listed for this clinician in this preview.
            </p>
          )}

          <div className="mt-6 space-y-3">
            <p role="alert" className="text-body-md font-medium text-error">
              {error}
            </p>
            <Button size="lg" fullWidth onClick={choose} iconRight={<ArrowRight className="size-5" />}>
              Choose this time
            </Button>
            <p className="text-body-md text-muted">Nothing is sent yet. You check everything on the next page.</p>
          </div>
        </section>

        {/* Practical details */}
        <section
          aria-labelledby="about-clinician"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6 lg:col-start-1 lg:row-start-1"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="about-clinician" className="text-heading-md text-ink">
              {c.name.startsWith('Dr.') ? 'About this clinician' : 'About this provider'}
            </h2>
            <DemoTag />
          </div>
          <DescriptionList
            columns={2}
            className="mt-5"
            items={[
              { term: 'Specialty', detail: c.specialty },
              {
                term: 'Services',
                detail: (
                  <ul className="space-y-0.5">
                    {c.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ),
              },
              { term: 'Clinic', detail: c.clinic },
              { term: 'Address', detail: `Sample address in ${c.area}` },
              { term: 'Distance', detail: c.distance },
              { term: 'Languages', detail: c.languages.join(', ') },
              { term: 'Visit types', detail: modesText(c.modes) },
              { term: 'Accessibility', detail: c.accessibility },
            ]}
          />

          <Divider className="my-6" />
          <h3 className="text-heading-sm text-ink">Fees and cancellation</h3>
          <DescriptionList
            columns={2}
            className="mt-4"
            items={[
              {
                term: 'Consultation fee',
                detail: (
                  <>
                    <span className="tabular">{c.fee}</span>
                    <span className="block font-normal text-muted">{c.feeNote}</span>
                  </>
                ),
              },
              { term: 'NeuroVX service fee', detail: 'None in this preview' },
              { term: 'Cancellation', detail: c.cancellation },
              { term: 'Payment', detail: 'No payment is taken in this preview' },
            ]}
          />

          <Divider className="my-6" />
          <h3 className="text-heading-sm text-ink">Before you request</h3>
          <DescriptionList
            columns={2}
            className="mt-4"
            items={[
              { term: 'Credentials', detail: c.credentials },
              {
                term: 'Confirmation',
                detail:
                  c.confirmation === 'manual'
                    ? 'The clinic confirms requests. Until then your request is pending.'
                    : 'The clinic confirms bookings straight away.',
              },
              {
                term: 'Visit packet',
                detail: followUp
                  ? 'Already has the visit packet from the first visit in this care episode.'
                  : c.acceptsPacket
                  ? 'Accepts your visit packet. You choose what to share on the next page.'
                  : 'Does not receive the visit packet in this preview. Bring previous reports to the visit.',
              },
            ]}
          />
        </section>
      </div>
    </div>
  )
}

import { Lock, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  Checkbox,
  DemoTag,
  Disclosure,
  EmptyState,
  PageHeader,
  SourceLabel,
  StatusBadge,
  TextLink,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { clinicianById, EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { BookingState, Clinician, Slot } from '@/demo/types'
import { BackLink } from '@/features/booking/BackLink'
import {
  DEMO_TAKEN_SLOT,
  findSlot,
  hasActiveBooking,
  isSlotTaken,
  markSlotTaken,
  placeText,
  slotLabel,
  weekday,
} from '@/features/booking/lib'
import { packetItems, type ShareKey } from '@/features/booking/packet'
import { PacketList, SummaryList } from '@/features/booking/SummaryList'
import { usePageTitle } from '@/lib/hooks'

export default function BookingReviewPage() {
  const [params] = useSearchParams()
  const followUp = params.get('visit') === 'follow-up'
  usePageTitle(followUp ? 'Check and request your follow-up' : 'Check and request your appointment')
  const { state } = useDemo()

  const c = clinicianById(params.get('clinician') ?? state.booking.clinicianId)
  const slotId = params.get('slot') ?? (followUp ? state.booking.followUp?.slotId : state.booking.slotId)
  const slot = findSlot(c, slotId)

  if (!c || !slot) {
    return (
      <div className="space-y-6">
        <PageHeader title={followUp ? 'Check and request your follow-up' : 'Check and request your appointment'} />
        <EmptyState
          title="No time chosen yet"
          action={
            <Button to="/app/care/find-clinician" variant="secondary">
              Find a clinician
            </Button>
          }
        >
          Choose a clinician and a time first. Then you can check the details here before anything is sent.
        </EmptyState>
      </div>
    )
  }
  return <Review key={`${c.id}-${slot.id}-${followUp}`} c={c} slot={slot} followUp={followUp} />
}

function Review({ c, slot, followUp }: { c: Clinician; slot: Slot; followUp: boolean }) {
  const navigate = useNavigate()
  const { state, set } = useDemo()
  const { fullName, patient, helper, persona, name, your, hasRecordAccess } = usePeople()
  const stage = state.stage
  const items = packetItems(state)
  const uploadItems = items.filter((i) => i.shareKey === 'uploads')
  const sharedBefore = items.filter((i) => state.booking.share[i.shareKey])

  const [share, setShare] = useState<BookingState['share']>(state.booking.share)
  const [uploadSel, setUploadSel] = useState<string[]>(state.booking.share.uploads ? uploadItems.map((i) => i.id) : [])
  const [unavailable, setUnavailable] = useState(() => !followUp && isSlotTaken(slot.id))
  const alertRef = useRef<HTMLDivElement>(null)

  const detailHref = `/app/care/clinicians/${c.id}${followUp ? '?visit=follow-up' : ''}`
  const canBook = persona === 'patient' || (persona === 'care-partner' && state.permissions.includes('bookings'))

  const current = clinicianById(state.booking.clinicianId)
  const currentSlot = findSlot(current, state.booking.slotId)
  const sameAsCurrent =
    !followUp && hasActiveBooking(stage) && state.booking.clinicianId === c.id && state.booking.slotId === slot.id
  const replacing = !followUp && hasActiveBooking(stage) && !sameAsCurrent
  const afterVisit = !followUp && hasReached(stage, 'tests-requested')

  const isChecked = (key: ShareKey, id: string) => (key === 'uploads' ? uploadSel.includes(id) : share[key])
  const toggle = (key: ShareKey, id: string, on: boolean) => {
    if (key === 'uploads') setUploadSel((sel) => (on ? [...sel, id] : sel.filter((x) => x !== id)))
    else setShare((s) => ({ ...s, [key]: on }))
  }

  /** Items that exist use the person's choice; anything added later joins the packet. */
  const finalShare = (): BookingState['share'] => {
    if (!c.acceptsPacket) return { checkIn: false, observations: false, assessment: false, uploads: false }
    const has = (k: ShareKey) => items.some((i) => i.shareKey === k)
    return {
      checkIn: has('checkIn') ? share.checkIn : state.booking.share.checkIn,
      observations: has('observations') ? share.observations : state.booking.share.observations,
      assessment: has('assessment') ? share.assessment : state.booking.share.assessment,
      uploads: uploadItems.length ? uploadSel.length > 0 : state.booking.share.uploads,
    }
  }

  const request = () => {
    if (followUp) {
      set((s) => ({
        ...s,
        booking: {
          ...s.booking,
          clinicianId: s.booking.clinicianId ?? c.id,
          followUp: { slotId: slot.id, mode: slot.mode, status: 'requested' },
        },
      }))
      navigate('/app/care/visit', { state: { justRequested: 'follow-up' } })
      return
    }
    const packet = finalShare()
    if (slot.id === DEMO_TAKEN_SLOT && !isSlotTaken(slot.id)) {
      // Demonstrates PATIENT.md "This time is no longer available": keep the packet, choose again.
      markSlotTaken(slot.id)
      set((s) => ({ ...s, booking: { ...s.booking, share: packet } }))
      setUnavailable(true)
      requestAnimationFrame(() => alertRef.current?.focus())
      return
    }
    set((s) => ({
      ...s,
      stage: 'booking-requested',
      booking: {
        ...s.booking,
        clinicianId: c.id,
        slotId: slot.id,
        mode: slot.mode,
        share: packet,
        followUp: undefined,
        infoReply: undefined,
      },
    }))
    navigate('/app/care/visit', { state: { justRequested: 'appointment' } })
  }

  const chooseAnother = () => {
    set((s) => ({ ...s, booking: { ...s.booking, share: finalShare() } }))
    navigate(detailHref)
  }

  const requestedBy =
    persona === 'patient'
      ? 'Requested by you'
      : persona === 'care-partner'
        ? `Requested by ${helper.firstName} ${helper.lastName} - care partner`
        : `${helper.firstName} ${helper.lastName} is helping - record access not yet arranged`

  return (
    <div className="space-y-8">
      <BackLink to={detailHref}>Back to {c.name}</BackLink>

      <PageHeader
        title={followUp ? 'Check and request your follow-up' : 'Check and request your appointment'}
        lede={
          followUp
            ? 'Same clinician and care episode. Nothing is sent until you select Request follow-up.'
            : 'Check the details and choose what to share. Nothing is sent until you select Request appointment.'
        }
      />

      {!canBook ? (
        <Callout
          tone="info"
          title="Booking needs permission first"
          action={
            <Button to="/app/support#access" variant="secondary">
              Help arrange access
            </Button>
          }
        >
          <p>
            You can look at clinicians and times. Requesting an appointment for {name} needs access to be arranged first.
          </p>
        </Callout>
      ) : sameAsCurrent ? (
        <Callout tone="info" title="You have already requested this appointment">
          <p>It is on your visit page with its current status. Nothing new needs to be sent.</p>
        </Callout>
      ) : replacing ? (
        <Callout tone="warning" title="This replaces your current request">
          <p>
            You already have a visit with {current?.name ?? 'a clinician'}
            {currentSlot ? (
              <>
                {' '}
                on <span className="tabular">{slotLabel(currentSlot)}</span>
              </>
            ) : null}
            . Requesting this time replaces it, and the clinic must confirm again.
          </p>
        </Callout>
      ) : afterVisit ? (
        <Callout
          tone="info"
          title={current?.id === c.id ? `You have already seen ${c.name} in this care episode` : 'This is a separate request'}
          action={
            <ArrowLink to={`/app/care/clinicians/${current?.id ?? c.id}?visit=follow-up`}>Book a follow-up instead</ArrowLink>
          }
        >
          <p>
            A follow-up keeps the same care episode. A new clinician receives only what you choose to share below.
          </p>
        </Callout>
      ) : null}

      {/* Summary */}
      <section aria-labelledby="review-summary" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="review-summary" className="text-heading-sm text-ink">
            {followUp ? 'Follow-up visit' : 'Appointment'}
          </h2>
          <DemoTag />
        </div>
        <SummaryList
          rows={[
            {
              term: 'Patient',
              detail: (
                <>
                  <p className="text-data">
                    {fullName}, {patient.age}
                    {patient.ageApproximate ? ' (approximate age)' : ''}
                  </p>
                  <p className="text-muted">{requestedBy}</p>
                </>
              ),
            },
            {
              term: 'Clinician',
              detail: (
                <>
                  <p className="text-data">
                    {c.name} <span className="font-normal text-muted">· {c.label}</span>
                  </p>
                  <p>{c.specialty}</p>
                  <p className="text-muted">{c.clinic}</p>
                </>
              ),
            },
            {
              term: 'Requested time',
              detail: (
                <>
                  <p className="tabular text-data">
                    {weekday(slot.date)} {slotLabel(slot)}
                  </p>
                  {unavailable ? (
                    <p className="py-1">
                      <StatusBadge tone="warning">No longer available</StatusBadge>
                    </p>
                  ) : null}
                  <p>{placeText(c, slot.mode)}</p>
                  <p className="pt-1">
                    <TextLink to={detailHref}>Change time</TextLink>
                  </p>
                </>
              ),
            },
            {
              term: 'Availability',
              detail: (
                <p>
                  {c.confirmation === 'manual'
                    ? 'The clinic confirms manually. Until then, your request is pending.'
                    : 'The clinic confirms bookings straight away.'}
                </p>
              ),
            },
            {
              term: 'Fees',
              detail: (
                <>
                  <p>
                    Consultation fee <span className="tabular text-data">{c.fee}</span>{' '}
                    <span className="text-muted">· {c.feeNote}</span>
                  </p>
                  <p>NeuroVX service fee: none in this preview</p>
                  <p>No payment is taken in this preview.</p>
                  <p className="text-muted">Cancellation: {c.cancellation}</p>
                </>
              ),
            },
          ]}
        />
      </section>

      {/* Visit packet */}
      <section aria-labelledby="review-packet" className="space-y-4">
        <div className="space-y-1">
          <h2 id="review-packet" className="text-heading-md text-ink">
            {followUp || !c.acceptsPacket || !hasRecordAccess ? 'Visit packet' : 'Visit packet to share'}
          </h2>
          <p className="text-body-lg text-muted">
            {followUp
              ? `${c.clinic} already has the packet from ${your} first visit.`
              : c.acceptsPacket
                ? `Choose what ${c.clinic} receives with this request.`
                : `${c.clinic} does not receive the visit packet in this preview. Bring previous reports to the visit.`}
          </p>
        </div>

        {!hasRecordAccess ? (
          <p className="rounded-md border border-border bg-surface p-4 text-body-md text-ink">
            The visit packet holds {name}’s own information, so it appears here once access is arranged.
          </p>
        ) : followUp ? (
          <>
            {sharedBefore.length ? (
              <Disclosure summary={`What the clinic already has (${sharedBefore.length})`}>
                <PacketList items={sharedBefore} bare />
              </Disclosure>
            ) : null}
            {hasReached(stage, 'report-released') ? (
              <p className="flex items-start gap-2.5 text-body-md text-ink">
                <Send aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
                The Vitamin B12 report released on {EPISODE_DATES.released} is linked to this care episode, so this
                clinic already receives it.
              </p>
            ) : null}
          </>
        ) : c.acceptsPacket ? (
          items.length ? (
            <div className="space-y-3">
              {items.map((it) => (
                <Checkbox
                  key={it.id}
                  name="packet"
                  checked={isChecked(it.shareKey, it.id)}
                  onChange={(on) => toggle(it.shareKey, it.id, on)}
                  label={<span className="[overflow-wrap:anywhere]">{it.title}</span>}
                  description={
                    <>
                      {it.detail}
                      <span className="mt-1.5 flex">
                        <SourceLabel kind={it.source} name={it.sourceName} />
                      </span>
                    </>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-border bg-surface p-4 text-body-md text-ink">
              There is nothing in the visit packet yet. You can request the appointment now and add information later
              from {your} visit page.
            </p>
          )
        ) : null}

        {c.acceptsPacket && !followUp && hasRecordAccess ? (
          <ul className="space-y-2 pt-1">
            <li className="flex items-start gap-2.5 text-body-md text-ink">
              <Lock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
              {c.clinic} receives this packet for this visit only, not every future record.
            </li>
            <li className="flex items-start gap-2.5 text-body-md text-ink">
              <Send aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
              Reports linked to this care episode will also be shared with this clinic.
            </li>
          </ul>
        ) : null}
      </section>

      {unavailable ? (
        <div ref={alertRef} tabIndex={-1} role="alert" className="focus:outline-none">
          <Callout
            tone="warning"
            title="This time is no longer available"
            action={
              <Button onClick={chooseAnother} size="lg">
                Choose another time
              </Button>
            }
          >
            <p>
              <span className="tabular">{slotLabel(slot)}</span> was taken before your request reached the clinic.
              Nothing was sent. Your visit packet choices are kept.
            </p>
            <p>Demo: this time always shows this message once, so you can see how it is handled.</p>
          </Callout>
        </div>
      ) : null}

      {/* Action */}
      {!unavailable ? (
        <div className="space-y-4 border-t border-border pt-6">
          {!canBook ? null : sameAsCurrent ? (
            <Button to="/app/care/visit" size="lg" className="w-full sm:w-auto">
              View your visit
            </Button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button onClick={request} size="lg" className="w-full sm:w-auto">
                {followUp ? 'Request follow-up' : 'Request appointment'}
              </Button>
              <Button to={detailHref} variant="quiet">
                Choose a different time
              </Button>
            </div>
          )}
          <p className="max-w-reading text-body-md text-muted">
            After you request, {c.clinic} checks it and confirms. You will see its status on the visit page. No payment is
            taken.
          </p>
        </div>
      ) : null}
    </div>
  )
}

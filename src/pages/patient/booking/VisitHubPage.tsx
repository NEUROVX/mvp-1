import { clsx } from 'clsx'
import { CheckCircle2, FileText, Glasses, MonitorSmartphone, Pill } from 'lucide-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  ArrowLink,
  Button,
  Callout,
  Careline,
  DemoTag,
  Dialog,
  EmptyState,
  PageHeader,
  SourceLabel,
  StatusBadge,
  TextArea,
  TextLink,
  type CarelineStep,
} from '@/components/ui'
import { hasReached, STAGE_META } from '@/demo/episode'
import { CLINICIANS, clinicianById, EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { Clinician, Slot, Tone } from '@/demo/types'
import { findSlot, isConfirmedStage, MODE_LABEL, placeText, slotLabel, weekday } from '@/features/booking/lib'
import { packetItems, type PacketItem } from '@/features/booking/packet'
import { QuestionsSection } from '@/features/booking/QuestionsSection'
import { PacketList, SummaryList } from '@/features/booking/SummaryList'
import { usePageTitle } from '@/lib/hooks'

interface HubLocationState {
  justRequested?: 'appointment' | 'follow-up'
  changeFrom?: string
  wasConfirmed?: boolean
}

export default function VisitHubPage() {
  usePageTitle('Your visit')
  const { state, set, jumpTo } = useDemo()
  const { persona, possessive, your, hasRecordAccess, helper } = usePeople()
  const location = useLocation()
  const navigate = useNavigate()

  const stage = state.stage
  const c: Clinician = clinicianById(state.booking.clinicianId) ?? CLINICIANS[0]
  const slot: Slot = findSlot(c, state.booking.slotId) ?? c.slots[0]
  const followUp = state.booking.followUp
  const followUpSlot = findSlot(c, followUp?.slotId)

  const noBooking = !hasReached(stage, 'booking-requested')
  const requested = stage === 'booking-requested'
  const confirmed = isConfirmedStage(stage)
  const existing = stage === 'existing-care'
  const afterVisit = hasReached(stage, 'tests-requested') && !existing

  const [flash, setFlash] = useState<string>()
  const [changeFrom, setChangeFrom] = useState<string>()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelFollowUpOpen, setCancelFollowUpOpen] = useState(false)

  // Announce what just happened on the previous page, then clear it from history.
  useEffect(() => {
    const st = location.state as HubLocationState | null
    if (!st) return
    const t = window.setTimeout(() => {
      if (st.justRequested === 'appointment') setFlash(`Request sent to ${c.clinic}. Confirmation is pending.`)
      else if (st.justRequested === 'follow-up') setFlash(`Follow-up request sent to ${c.clinic}. Confirmation is pending.`)
      else if (st.changeFrom) {
        setFlash(
          st.wasConfirmed
            ? 'Change requested. Your current time stays until the clinic confirms the change.'
            : 'Change sent. The clinic confirms the new time.',
        )
        if (st.wasConfirmed) setChangeFrom(st.changeFrom)
      }
    }, 60)
    navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true, state: null })
    return () => window.clearTimeout(t)
    // Runs once for the navigation that opened the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const title = persona === 'patient' ? 'Your visit' : `${possessive} visit`
  const Your = persona === 'patient' ? 'Your' : possessive
  const badge: { label: string; tone: Tone } = noBooking
    ? { label: 'No visit booked', tone: 'neutral' }
    : requested
      ? { label: 'Requested - confirmation pending', tone: 'warning' }
      : stage === 'info-requested'
        ? { label: 'Confirmed · information requested', tone: 'warning' }
        : confirmed
          ? { label: 'Confirmed', tone: 'info' }
          : existing
            ? { label: followUp ? 'Next visit requested' : 'Next visit not booked', tone: followUp ? 'warning' : 'neutral' }
            : { label: 'Visit completed', tone: 'neutral' }

  const cancelRequest = () => {
    jumpTo('assessment-completed')
    setCancelOpen(false)
    setChangeFrom(undefined)
    setFlash('Request cancelled. Your check-in, reports and questions are still saved.')
    requestAnimationFrame(() => document.getElementById('visit-title')?.focus())
  }

  const cancelFollowUp = () => {
    set((s) => ({ ...s, booking: { ...s.booking, followUp: undefined } }))
    setCancelFollowUpOpen(false)
    setFlash('Follow-up request cancelled.')
  }

  const followUpHref = `/app/care/clinicians/${c.id}?visit=follow-up`

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <PageHeader
          title={
            <span id="visit-title" tabIndex={-1} className="focus:outline-none">
              {title}
            </span>
          }
          lede={
            noBooking
              ? 'When you request an appointment, its details, the visit packet and your questions stay together here.'
              : `Everything about ${your} visit with ${c.name} in one place.`
          }
          meta={
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
              <DemoTag />
            </div>
          }
        />
        <div role="status" aria-live="polite">
          {flash ? (
            <p className="flex items-start gap-2 pt-1 text-body-md text-ink">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              {flash}
            </p>
          ) : null}
        </div>
      </div>

      {!hasRecordAccess ? (
        <Callout
          tone="neutral"
          title="We need to arrange permission to view this record"
          action={
            <Button to="/app/support#access" variant="secondary">
              Help arrange access
            </Button>
          }
        >
          <p>Visit details, the visit packet and questions appear here once access is arranged.</p>
        </Callout>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0 space-y-8">
            {noBooking ? (
              <EmptyState
                title="No visit booked yet"
                action={
                  <Button to="/app/care/find-clinician" size="lg">
                    Find a clinician
                  </Button>
                }
              >
                Choose a clinician and a time. You check everything before anything is sent.
              </EmptyState>
            ) : null}

            {stage === 'info-requested' ? <InfoRequest c={c} onSent={() => setFlash('Sent to the clinic')} /> : null}

            {requested || confirmed ? (
              <StatusCard
                elevated={stage !== 'info-requested'}
                title={requested ? 'Request sent. Confirmation is pending.' : 'Your visit is booked'}
                body={
                  requested
                    ? `${c.clinic} has the request. Its reply will appear here. Until then, the time below is only requested.`
                    : `${c.clinic} confirmed this visit. The visit packet was delivered with it.`
                }
              >
                <BookingCareline stage={stage} visitDate={slot.date} />
                <SummaryList
                  className="mt-6 border-t border-border pt-5"
                  rows={[
                    {
                      term: requested ? 'Requested' : 'When',
                      detail: (
                        <>
                          <p className="tabular text-data">
                            {weekday(slot.date)} {slotLabel(slot)}
                          </p>
                          {requested ? <p className="text-muted">Requested, not yet confirmed</p> : null}
                        </>
                      ),
                    },
                    ...(requested && changeFrom
                      ? [
                          {
                            term: 'Current time',
                            detail: (
                              <>
                                <p className="tabular text-data">{changeFrom}</p>
                                <p className="text-muted">Stays until the clinic confirms the change</p>
                              </>
                            ),
                          },
                        ]
                      : []),
                    { term: 'Visit type', detail: <p>{placeText(c, state.booking.mode ?? slot.mode)}</p> },
                    {
                      term: 'Clinician',
                      detail: (
                        <>
                          <p className="text-data">
                            {c.name} <span className="font-normal text-muted">· {c.label}</span>
                          </p>
                          <p className="text-muted">{c.specialty}</p>
                        </>
                      ),
                    },
                    {
                      term: 'Visit packet',
                      detail: (
                        <p>
                          {requested
                            ? 'Sent with your request · not yet opened by the clinic'
                            : `Delivered to ${c.clinic} (demo)`}
                        </p>
                      ),
                    },
                  ]}
                />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                  <Button to="/app/care/visit/change-mode" variant="secondary">
                    Change time or visit type
                  </Button>
                  {requested ? (
                    <Button variant="quiet" onClick={() => setCancelOpen(true)}>
                      Cancel request
                    </Button>
                  ) : (
                    <Button to="/app/care/visit#packet" variant="quiet">
                      Add information
                    </Button>
                  )}
                </div>
              </StatusCard>
            ) : null}

            {requested ? (
              <p className="flex items-start gap-2.5 text-body-md text-muted">
                <MonitorSmartphone aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                <span>
                  In this demo, the clinic responds from the clinician workspace.{' '}
                  <TextLink to="/pro/clinician">Open the clinician workspace</TextLink>
                </span>
              </p>
            ) : null}

            {state.booking.infoReply && stage !== 'info-requested' ? (
              <AnsweredRequest c={c} reply={state.booking.infoReply} source={persona === 'patient' ? 'patient' : 'care-partner'} sourceName={persona === 'patient' ? undefined : `${helper.firstName} ${helper.lastName}`} />
            ) : null}

            {confirmed ? <BeforeTheVisit video={(state.booking.mode ?? slot.mode) === 'video'} /> : null}

            {afterVisit ? (
              <StatusCard
                elevated={!followUp && !hasReached(stage, 'reviewed')}
                title={`Visit on ${EPISODE_DATES.visit} - completed`}
                body={
                  hasReached(stage, 'reviewed')
                    ? `Visit notes stay with the clinic. ${c.name}’s next steps are in ${your} care plan.`
                    : `Visit notes stay with the clinic. ${c.name} requested tests after the visit.`
                }
              >
                <SummaryList
                  className="mt-6 border-t border-border pt-5"
                  rows={[
                    {
                      term: 'Clinician',
                      detail: (
                        <>
                          <p className="text-data">
                            {c.name} <span className="font-normal text-muted">· {c.label}</span>
                          </p>
                          <p className="text-muted">{c.clinic}</p>
                        </>
                      ),
                    },
                    {
                      term: 'Visit',
                      detail: (
                        <p className="tabular">
                          {slotLabel(slot)} · {MODE_LABEL[state.booking.mode ?? slot.mode]}
                        </p>
                      ),
                    },
                  ]}
                />
                <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-8">
                  <ArrowLink to="/app/care/tests">View requested tests</ArrowLink>
                  {hasReached(stage, 'reviewed') ? <ArrowLink to="/app/care/plan">View care plan</ArrowLink> : null}
                </div>
              </StatusCard>
            ) : null}

            {existing && !followUp ? (
              <StatusCard
                elevated
                title="Next visit"
                body={`${Your} care continues with ${c.name}. Book the next visit when it suits you. There is no need to repeat first-time screening.`}
              >
                <SummaryList
                  className="mt-6 border-t border-border pt-5"
                  rows={[
                    {
                      term: 'Clinician',
                      detail: (
                        <>
                          <p className="text-data">
                            {c.name} <span className="font-normal text-muted">· {c.label}</span>
                          </p>
                          <p className="text-muted">{c.clinic}</p>
                        </>
                      ),
                    },
                    { term: 'Status', detail: <p>Not booked yet</p> },
                  ]}
                />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                  <Button to={followUpHref} size="lg">
                    Book your next visit
                  </Button>
                  <Button to="/app/care/plan" variant="quiet">
                    View care plan
                  </Button>
                </div>
              </StatusCard>
            ) : null}

            {(afterVisit || existing) && followUp ? (
              <StatusCard
                elevated
                title="Follow-up requested - pending clinic confirmation"
                body={`Same clinician and care episode. ${c.clinic} confirms the time. Until then, it is only requested.`}
                eyebrow="Follow-up visit"
              >
                <SummaryList
                  className="mt-6 border-t border-border pt-5"
                  rows={[
                    {
                      term: 'Requested',
                      detail: (
                        <p className="tabular text-data">
                          {followUpSlot ? `${weekday(followUpSlot.date)} ${slotLabel(followUpSlot)}` : 'Time sent to the clinic'}
                        </p>
                      ),
                    },
                    { term: 'Visit type', detail: <p>{placeText(c, followUp.mode)}</p> },
                  ]}
                />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                  <Button to={followUpHref} variant="secondary">
                    Change follow-up time
                  </Button>
                  <Button variant="quiet" onClick={() => setCancelFollowUpOpen(true)}>
                    Cancel follow-up request
                  </Button>
                </div>
              </StatusCard>
            ) : null}

            {afterVisit && !followUp && hasReached(stage, 'reviewed') ? (
              <StatusCard
                elevated
                eyebrow="Follow-up visit"
                title={stage === 'follow-up-due' ? 'Plan your next visit' : 'Book a follow-up when you are ready'}
                body={`${Your} care plan suggests a follow-up by ${EPISODE_DATES.followUp}, with the same clinician and care episode.`}
              >
                <div className="mt-6">
                  <Button to={followUpHref} size="lg">
                    Book follow-up
                  </Button>
                </div>
              </StatusCard>
            ) : null}

            <QuestionsSection />
          </div>

          <div className="space-y-12">
            <PacketSection
              items={packetItems(state)}
              share={state.booking.share}
              clinic={c.clinic}
              mode={noBooking ? 'ready' : requested ? 'sent' : 'delivered'}
              reply={
                state.booking.infoReply
                  ? {
                      id: 'info-reply',
                      shareKey: 'checkIn',
                      title: 'Current medicines',
                      detail: 'Reply to the clinic’s information request.',
                      source: persona === 'patient' ? 'patient' : 'care-partner',
                      sourceName: persona === 'patient' ? undefined : `${helper.firstName} ${helper.lastName}`,
                    }
                  : undefined
              }
              showObservationsLink={persona === 'care-partner'}
            />
          </div>
        </div>
      )}

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this request?"
        description={`The request to ${c.name} for ${slotLabel(slot)} is withdrawn. Your check-in, reports and questions stay saved.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Keep request
            </Button>
            <Button variant="destructive" onClick={cancelRequest}>
              Cancel request
            </Button>
          </>
        }
      />
      <Dialog
        open={cancelFollowUpOpen}
        onClose={() => setCancelFollowUpOpen(false)}
        title="Cancel the follow-up request?"
        description={`The follow-up request to ${c.name} is withdrawn. Your care plan stays the same.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelFollowUpOpen(false)}>
              Keep request
            </Button>
            <Button variant="destructive" onClick={cancelFollowUp}>
              Cancel follow-up request
            </Button>
          </>
        }
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */

function StatusCard({
  title,
  body,
  children,
  elevated,
  eyebrow,
}: {
  title: string
  body: ReactNode
  children?: ReactNode
  elevated?: boolean
  eyebrow?: string
}) {
  return (
    <section className={clsx('rounded-lg border border-border bg-surface p-5 sm:p-8', elevated && 'shadow-1')}>
      {eyebrow ? <p className="mb-2 text-label text-primary">{eyebrow}</p> : null}
      <h2 className="text-heading-md text-ink">{title}</h2>
      <p className="mt-2 max-w-reading text-body-lg text-ink">{body}</p>
      {children}
    </section>
  )
}

/** Booking lifecycle on the Careline: request, clinic confirmation, preparation, visit. */
function BookingCareline({ stage, visitDate }: { stage: string; visitDate: string }) {
  const requested = stage === 'booking-requested'
  const steps: CarelineStep[] = [
    { label: 'Request sent', state: 'completed' },
    {
      label: requested ? 'Clinic confirms' : 'Clinic confirmed',
      sublabel: requested ? 'Its reply appears here' : undefined,
      state: requested ? 'current' : 'completed',
    },
    { label: 'Prepare', sublabel: 'Questions and reports', state: requested ? 'upcoming' : 'current' },
    { label: 'Visit', sublabel: visitDate, state: 'upcoming' },
  ]
  return (
    <div className="mt-6">
      <Careline steps={steps} label="Visit progress" className="hidden sm:grid" />
      <Careline steps={steps} label="Visit progress" orientation="vertical" size="sm" className="sm:hidden" />
    </div>
  )
}

/** Clinician's information request (info-requested stage). Heading id matches #requests. */
function InfoRequest({ c, onSent }: { c: Clinician; onSent: () => void }) {
  const { set } = useDemo()
  const [reply, setReply] = useState('')
  const [error, setError] = useState<string>()

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = reply.trim()
    if (!text) {
      setError('Write the current medicines, or write “Not sure”.')
      return
    }
    set((s) => ({ ...s, stage: 'booking-confirmed', booking: { ...s.booking, infoReply: text } }))
    onSent()
    requestAnimationFrame(() => document.getElementById('requests')?.focus())
  }

  return (
    <section aria-labelledby="requests" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-8">
      <h2 id="requests" tabIndex={-1} className="text-heading-md text-ink">
        Request from your clinician
      </h2>
      <Callout tone="warning" title={`${c.name} asked for a list of current medicines before the visit.`} className="mt-4">
        <p>
          <SourceLabel kind="clinician" name={`${c.name} · ${STAGE_META['info-requested'].when}`} />
        </p>
      </Callout>
      <form onSubmit={send} noValidate className="mt-5 space-y-4">
        <TextArea
          label="Current medicines"
          hint="Write each medicine and how often it is taken, if you know. Write “Not sure” if you do not know."
          value={reply}
          onChange={(e) => {
            setReply(e.target.value)
            if (error) setError(undefined)
          }}
          error={error}
          rows={5}
        />
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Send to the clinic
        </Button>
      </form>
    </section>
  )
}

function AnsweredRequest({
  c,
  reply,
  source,
  sourceName,
}: {
  c: Clinician
  reply: string
  source: 'patient' | 'care-partner'
  sourceName?: string
}) {
  return (
    <section aria-labelledby="requests" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="requests" tabIndex={-1} className="text-heading-sm text-ink focus:outline-none">
          Request from your clinician
        </h2>
        <StatusBadge tone="info">Sent to the clinic</StatusBadge>
      </div>
      <p className="mt-2 text-body-md text-muted">{c.name} asked for a list of current medicines before the visit.</p>
      <div className="mt-4 rounded-md bg-canvas p-4">
        <p className="text-label text-ink">Current medicines</p>
        <p className="mt-1 text-body-md whitespace-pre-line [overflow-wrap:anywhere] text-ink">{reply}</p>
        <div className="mt-2">
          <SourceLabel kind={source} name={sourceName} />
        </div>
      </div>
    </section>
  )
}

function BeforeTheVisit({ video }: { video: boolean }) {
  const items = [
    { icon: <Glasses />, text: 'Glasses or a hearing aid, if used' },
    { icon: <Pill />, text: 'A list of current medicines' },
    { icon: <FileText />, text: 'Previous reports, including any added here' },
  ]
  return (
    <section aria-labelledby="before-visit" className="space-y-4">
      <h2 id="before-visit" className="text-heading-sm text-ink">
        {video ? 'Have these nearby' : 'What to bring'}
      </h2>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {items.map((it) => (
          <li key={it.text} className="flex items-center gap-3 px-4 py-3.5 text-body-md text-ink">
            <span aria-hidden="true" className="text-muted [&>svg]:size-5 [&>svg]:stroke-[1.75]">
              {it.icon}
            </span>
            {it.text}
          </li>
        ))}
      </ul>
      <p className="text-body-md text-muted">The clinic will share any preparation. NeuroVX does not add its own.</p>
    </section>
  )
}

function PacketSection({
  items,
  share,
  clinic,
  mode,
  reply,
  showObservationsLink,
}: {
  items: PacketItem[]
  share: Record<string, boolean>
  clinic: string
  mode: 'ready' | 'sent' | 'delivered'
  reply?: PacketItem
  showObservationsLink: boolean
}) {
  const shown = mode === 'ready' ? items : items.filter((i) => share[i.shareKey])
  const list = reply ? [...shown, reply] : shown
  const statusLine =
    mode === 'ready'
      ? 'Not shared yet. You choose what to share when you request an appointment.'
      : mode === 'sent'
        ? 'Sent with your request · not yet opened by the clinic'
        : `Delivered to ${clinic} (demo)`

  return (
    <section aria-labelledby="packet" className="space-y-4">
      <div className="space-y-1">
        <h2 id="packet" tabIndex={-1} className="text-heading-sm text-ink focus:outline-none">
          Visit packet
        </h2>
        <p className="text-body-md text-muted">{statusLine}</p>
      </div>
      {list.length ? (
        <PacketList items={list} />
      ) : (
        <p className="rounded-lg border border-dashed border-control/60 bg-surface p-4 text-body-md text-muted">
          Nothing in the visit packet yet.
        </p>
      )}
      <div className="space-y-1 pt-1">
        <h3 className="text-label text-ink">Add information</h3>
        <p className="text-body-md text-muted">Anything you add appears in this packet.</p>
        <div className="flex flex-col">
          <ArrowLink to="/app/care/check-in">Update the check-in</ArrowLink>
          <ArrowLink to="/app/care/reports-upload">Add previous reports</ArrowLink>
          {showObservationsLink ? <ArrowLink to="/app/care/observations">Add family observations</ArrowLink> : null}
        </div>
      </div>
    </section>
  )
}

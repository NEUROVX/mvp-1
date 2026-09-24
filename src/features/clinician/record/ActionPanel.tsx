import { forwardRef, type ReactNode } from 'react'
import { Button, SourceLabel, StatusBadge } from '@/components/ui'
import { STAGE_META } from '@/demo/episode'
import { EPISODE_DATES, ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { Tone } from '@/demo/types'
import { ReviewButton, type ClinicianActions } from '../actions'
import { B12_REPORT, LAB_SHORT, packetParts, requestedSlot, type RecordTab } from '../data'
import { ActionFeedback, LiveSlot } from '../parts'

interface PanelContent {
  status: { label: string; tone: Tone }
  title: string
  body: ReactNode
  owner?: string
  buttons?: ReactNode
}

/**
 * The record's one next-step surface. It adapts to where the shared episode
 * is, and every action here moves the family's Home forward.
 */
export const ActionPanel = forwardRef<HTMLHeadingElement, { actions: ClinicianActions; onTab: (t: RecordTab) => void }>(
  function ActionPanel({ actions, onTab }, headingRef) {
    const { state } = useDemo()
    const { fullName, helper } = usePeople()
    const slot = requestedSlot(state)
    const open = actions.setDialog

    const c: PanelContent = (() => {
      switch (state.stage) {
        case 'booking-requested':
          return {
            status: { label: 'Needs your response', tone: 'warning' },
            title: 'Appointment request',
            body: (
              <>
                Requested {slot.when} · {slot.modeLabel}. Visit packet attached: {packetParts(state).join(', ')}.
              </>
            ),
            buttons: (
              <>
                <Button onClick={actions.acceptRequest}>Accept request</Button>
                <Button variant="secondary" onClick={() => open('propose')}>
                  Propose another time
                </Button>
              </>
            ),
          }
        case 'booking-confirmed':
          return {
            status: { label: 'Confirmed', tone: 'info' },
            title: `Visit ${slot.when}`,
            body: state.booking.infoReply
              ? 'The family replied to your request for current medicines. Their reply is in the summary under important missing information.'
              : 'Review the draft summary before the visit. Ask the family for anything missing, or order investigations after you have seen the patient.',
            buttons: (
              <>
                <Button onClick={() => open('order')}>Order investigations</Button>
                <Button variant="secondary" onClick={() => open('info')}>
                  Request information
                </Button>
              </>
            ),
          }
        case 'info-requested':
          return {
            status: { label: 'Waiting on the family', tone: 'neutral' },
            title: 'Waiting for the family’s reply',
            body: state.booking.infoReply ? (
              <span className="block space-y-2">
                <span className="block">Reply to your request for a list of current medicines:</span>
                <span className="block border-l-2 border-border pl-4 text-ink">“{state.booking.infoReply}”</span>
                <SourceLabel kind="care-partner" name={`${helper.firstName} ${helper.lastName}`} />
              </span>
            ) : (
              <>
                You asked for a list of current medicines on {STAGE_META['info-requested'].when}. The request is on
                the family’s Home.
              </>
            ),
            owner: `Waiting on: ${helper.firstName} ${helper.lastName}, care partner`,
          }
        case 'tests-requested':
          return {
            status: { label: 'Ordered', tone: 'neutral' },
            title: 'Tests ordered',
            body: `Vitamin B12 and a plasma biomarker assay, ordered ${EPISODE_DATES.testsRequested}. The family chooses where to complete them.`,
            owner: 'Waiting on: Family',
            buttons: (
              <Button variant="secondary" onClick={() => onTab('results')}>
                View orders
              </Button>
            ),
          }
        case 'collection-arranged':
          return {
            status: { label: 'Collection arranged', tone: 'neutral' },
            title: 'Sample collection booked',
            body: `Home collection on ${EPISODE_DATES.collection}, ${EPISODE_DATES.collectionTime}, by ${ORG.lab}.`,
            owner: `Waiting on: ${LAB_SHORT}`,
            buttons: (
              <Button variant="secondary" onClick={() => onTab('results')}>
                View orders
              </Button>
            ),
          }
        case 'report-released':
          return {
            status: { label: 'Not yet reviewed', tone: 'info' },
            title: `${B12_REPORT.title} received`,
            body: `Released ${B12_REPORT.releasedOn} by ${LAB_SHORT} and delivered to this clinic. The plasma biomarker assay is still processing.`,
            buttons: (
              <>
                <ReviewButton onClick={() => open('review')} />
                <Button variant="secondary" onClick={() => open('report')}>
                  Open original report
                </Button>
              </>
            ),
          }
        case 'delivery-problem':
          return {
            status: { label: 'Not received', tone: 'warning' },
            title: 'Expected report not received',
            body: 'The laboratory released the Vitamin B12 report, but delivery to this clinic failed. You can review it once it arrives.',
            owner: `Owner: ${ORG.support}`,
            buttons: (
              <Button variant="secondary" onClick={() => onTab('results')}>
                View results
              </Button>
            ),
          }
        case 'reviewed':
          return {
            status: { label: 'Reviewed', tone: 'info' },
            title: 'Care plan published',
            body: `You reviewed the Vitamin B12 report on ${EPISODE_DATES.reviewed}. The plasma biomarker assay is still processing.`,
            buttons: (
              <Button variant="secondary" onClick={() => onTab('care-plan')}>
                View care plan
              </Button>
            ),
          }
        case 'follow-up-due':
          return {
            status: { label: 'Follow-up to book', tone: 'info' },
            title: 'Follow-up visit in the plan',
            body: `Suggested by ${EPISODE_DATES.followUp}, with the same clinician and care episode.`,
            owner: 'Owner: the family books it',
            buttons: (
              <Button variant="secondary" onClick={() => onTab('care-plan')}>
                View care plan
              </Button>
            ),
          }
        case 'existing-care':
          return {
            status: { label: 'Returning patient', tone: 'neutral' },
            title: 'Continuing care',
            body: 'Records and the current plan are here. No first-time screening is needed.',
            buttons: (
              <Button variant="secondary" onClick={() => onTab('care-plan')}>
                View care plan
              </Button>
            ),
          }
        default:
          return {
            status: { label: 'No task due', tone: 'neutral' },
            title: 'Nothing needs your action',
            body: `The care plan for ${fullName} is up to date.`,
            buttons: (
              <Button variant="secondary" onClick={() => onTab('care-plan')}>
                View care plan
              </Button>
            ),
          }
      }
    })()

    return (
      <section aria-labelledby="record-next" className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 max-w-reading space-y-2">
            <StatusBadge tone={c.status.tone} size="sm">
              {c.status.label}
            </StatusBadge>
            <h2 id="record-next" ref={headingRef} tabIndex={-1} className="text-heading-sm text-ink">
              {c.title}
            </h2>
            <div className="text-body-md text-muted">{c.body}</div>
            {c.owner ? <p className="text-body-md font-medium text-ink">{c.owner}</p> : null}
          </div>
          {c.buttons ? (
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">{c.buttons}</div>
          ) : null}
        </div>
        <LiveSlot className="mt-4">
          <ActionFeedback message={actions.feedback} />
        </LiveSlot>
      </section>
    )
  },
)

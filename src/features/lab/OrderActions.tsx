import { ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Button, Dialog, DescriptionList, InlineStatus, TextArea } from '@/components/ui'
import { ORDERS, ORG } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import { orderPath, OrderStatus } from './parts'
import type { LabOrder } from './model'

type DialogKind = 'collected' | 'release' | 'correct' | null

const SAVED = 'Saved in this browser tab.'

/**
 * The order's current state and the actions available for that state only
 * (DESIGN.md › Laboratory flow). Consequential steps are confirmed in a dialog.
 */
export function OrderActions({
  order,
  onCorrected,
}: {
  order: LabOrder
  /** Receives the reason when a corrected report is issued. */
  onCorrected: (reason: string) => void
}) {
  const { set, setStage, state } = useDemo()
  // The episode snapshot a status message belongs to. A jump from the Demo panel clears stale messages.
  const stateKey = `${state.stage}|${state.lab.b12 ?? ''}|${state.lab.correctedVersion ? 1 : 0}`
  const [status, setStatus] = useState<{ text: string; key?: string }>()
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string>()
  const [clarification, setClarification] = useState(
    'Please confirm which thyroid tests you are requesting for this patient, and the specimen you need.',
  )
  const [clarificationError, setClarificationError] = useState<string>()
  const [clarificationSent, setClarificationSent] = useState<string>()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusHeading = useRef(false)
  const titleId = useId()

  // After an action changes the state, move focus to the new state's title (explicit user action only).
  useEffect(() => {
    if (!focusHeading.current) return
    focusHeading.current = false
    setStatus((st) => (st && !st.key ? { ...st, key: stateKey } : st))
    headingRef.current?.focus()
  })
  const shownStatus = status && (!status.key || status.key === stateKey) ? status.text : undefined

  const act = (change: () => void, message: string) => {
    change()
    setDialog(null)
    setStatus({ text: message })
    focusHeading.current = true
  }
  const setB12 = (b12: 'collected' | 'specimen-received' | 'processing') =>
    set((s) => ({ ...s, lab: { ...s.lab, b12 } }))

  const b12Ref = ORDERS[0].orderRef
  const c = order.collection
  const collectionLine = c ? `${c.type === 'home' ? 'Home collection' : 'Centre visit'} on ${c.date}, ${c.time}` : undefined
  const reviewed = Boolean(order.clinicianReviewedOn)
  const failed = order.delivery?.status === 'failed'

  /* ---------- What the panel says and offers, per state ---------- */
  let title: string
  let body: ReactNode
  let owner = order.owner
  let actions: ReactNode = null

  if (order.kind === 'b12') {
    switch (order.state) {
      case 'order-received':
        title = 'Waiting for collection to be booked'
        body = 'The patient or family chooses a provider and a time. The lab does not book on their behalf.'
        owner = 'Patient or family, through NeuroVX'
        break
      case 'collection-arranged':
        title = 'Collect the sample'
        body = `${collectionLine}. Check two identifiers against the order before collecting.`
        actions = <Button onClick={() => setDialog('collected')}>Mark collected</Button>
        break
      case 'collected':
        title = 'Receive the specimen'
        body = 'Check the label against the order at reception before accepting the specimen.'
        actions = (
          <Button onClick={() => act(() => setB12('specimen-received'), `Specimen received at the lab. ${SAVED}`)}>
            Mark specimen received
          </Button>
        )
        break
      case 'specimen-received':
        title = 'Start processing'
        body = 'Run the test exactly as named on the order.'
        actions = (
          <Button onClick={() => act(() => setB12('processing'), `Processing started. ${SAVED}`)}>Start processing</Button>
        )
        break
      case 'processing':
        title = 'Validate and release the report'
        body = 'Release only through the authorized lab process, after laboratory validation.'
        actions = <Button onClick={() => setDialog('release')}>Release report</Button>
        break
      default:
        if (failed) {
          title = 'Delivery failed'
          body = `The report was released but has not reached the care team. ${ORG.support} owns the follow-up. Retry once they confirm the route works.`
          actions = (
            <Button
              onClick={() => act(() => setStage('report-released'), `Delivery retried and confirmed. ${SAVED}`)}
            >
              Retry delivery
            </Button>
          )
        } else {
          title = reviewed ? 'Complete for the lab' : 'Report delivered'
          body = reviewed
            ? `The clinic recorded clinician review on ${order.clinicianReviewedOn}. That is the clinic’s state, not the lab’s.`
            : `Delivered to ${order.clinic} and the patient’s record on ${order.delivery?.on}. Clinician review is the clinic’s step, not the lab’s.`
          actions = (
            <>
              {!order.correctedVersion ? (
                <Button variant="secondary" onClick={() => setDialog('correct')}>
                  Issue corrected report
                </Button>
              ) : null}
              {state.stage === 'report-released' ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    act(
                      () => setStage('delivery-problem'),
                      `Delivery failure simulated. ${ORG.support} now owns the follow-up. ${SAVED}`,
                    )
                  }
                >
                  Simulate delivery failure
                </Button>
              ) : null}
            </>
          )
        }
    }
  } else if (order.kind === 'plasma') {
    if (order.state === 'order-received') {
      title = 'Waiting for collection to be booked'
      body = 'The patient or family chooses a provider and a time. The lab does not book on their behalf.'
      owner = 'Patient or family, through NeuroVX'
    } else if (order.state === 'processing') {
      title = 'Processing at the reference laboratory'
      body = `Sent to ${ORG.referenceLab}. No estimate supplied. That laboratory releases the report, not this one.`
    } else {
      title = `Recorded with ${b12Ref}`
      body = `Both specimens come from the same collection. Record collection and reception on ${b12Ref}. After reception this specimen goes to ${ORG.referenceLab} for processing.`
      actions = (
        <Button variant="secondary" to={orderPath(b12Ref)}>
          Open {b12Ref}
        </Button>
      )
    }
  } else if (order.state === 'needs-clarification') {
    title = 'Ask the clinic what is needed'
    body = `The order says “${order.testExact}”. It does not name the tests or the specimen. Request clarification rather than guessing.`
  } else {
    title = 'Background demo order'
    body = 'This order fills out the demo queue. Its state does not change in this preview.'
  }

  const clarifyForm =
    order.state === 'needs-clarification' ? (
      clarificationSent ? (
        <div className="space-y-2 rounded-md border border-border bg-canvas p-4">
          <p className="text-label text-ink">Your request to {order.clinic}</p>
          <p className="text-body-md text-ink">{clarificationSent}</p>
          <p className="text-body-md text-muted">Waiting for the clinic’s reply. The order stays on hold.</p>
        </div>
      ) : (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!clarification.trim()) {
              setClarificationError('Write what the clinic needs to clarify.')
              return
            }
            setClarificationError(undefined)
            setClarificationSent(clarification.trim())
            setStatus({
              text: 'Request recorded in this demo only. Nothing was sent. The order stays on hold until the clinic replies.',
              key: stateKey,
            })
          }}
        >
          <TextArea
            label="Message to the clinic"
            hint={`Goes to ${order.clinic}.`}
            value={clarification}
            onChange={(e) => setClarification(e.target.value)}
            error={clarificationError}
            rows={5}
          />
          <Button type="submit" fullWidth>
            Request clarification
          </Button>
        </form>
      )
    ) : null

  return (
    <section aria-labelledby={titleId} className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-6">
      <p className="text-body-md text-muted">Current state</p>
      <OrderStatus order={order} className="mt-2" />
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className="mt-5 text-heading-sm text-ink">
        {title}
      </h2>
      <p className="mt-2 text-body-md text-ink">{body}</p>
      <DescriptionList
        className="mt-5 border-t border-border pt-4"
        items={[
          { term: 'Owner', detail: owner },
          { term: 'Due', detail: <span className="tabular">{order.due}</span> },
        ]}
      />

      {actions ? <div className="mt-6 flex flex-col gap-3 [&>*]:w-full">{actions}</div> : null}
      {clarifyForm ? <div className="mt-6">{clarifyForm}</div> : null}

      {/* Always mounted so messages are announced; takes no space while empty. */}
      <div className="mt-3 [&:has(>p:empty)]:m-0 [&:has(>p:empty)]:h-0 [&:has(>p:empty)]:overflow-hidden">
        <InlineStatus>{shownStatus}</InlineStatus>
      </div>

      {order.kind !== 'background' ? (
        <div className="mt-3 flex flex-col border-t border-border pt-2">
          <ViewLink to="/app">See the patient view</ViewLink>
          <ViewLink to="/pro/clinician/orders">See the clinician view</ViewLink>
        </div>
      ) : null}

      {/* ---------- Confirmations ---------- */}
      <Dialog
        open={dialog === 'collected'}
        onClose={() => setDialog(null)}
        title="Mark as collected?"
        description="Confirm the collector checked two identifiers against the order before collecting."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button onClick={() => act(() => setB12('collected'), `Marked collected. ${SAVED}`)}>Mark collected</Button>
          </>
        }
      >
        <DescriptionList
          items={[
            { term: 'Patient', detail: `${order.patientName}, ${order.patientAge}` },
            { term: 'Orders in this collection', detail: `${order.ref} and ${ORDERS[1].orderRef}` },
            { term: 'Collection', detail: collectionLine ?? 'Not booked' },
            { term: 'Collection time recorded', detail: c?.collectedOn ?? 'As entered by the collector' },
          ]}
        />
      </Dialog>

      <Dialog
        open={dialog === 'release'}
        onClose={() => setDialog(null)}
        title="Release this report?"
        description="Release through the authorized lab process. Laboratory validation is not clinician review."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                act(() => setStage('report-released'), `Report released and delivered to ${order.clinic}. ${SAVED}`)
              }
            >
              Release report
            </Button>
          </>
        }
      >
        <ul className="list-disc space-y-2 pl-5 text-body-md text-ink marker:text-muted">
          <li>The report goes to {order.clinic} and to the patient’s record.</li>
          <li>{order.orderingClinician} reviews it separately. The lab does not interpret it for the patient.</li>
          <li>A critical value follows the lab’s call-and-acknowledge procedure, not this screen.</li>
        </ul>
      </Dialog>

      <Dialog
        open={dialog === 'correct'}
        onClose={() => {
          setDialog(null)
          setReasonError(undefined)
        }}
        title="Issue a corrected report"
        description="A correction creates version 2. Version 1 stays visible, marked as superseded."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDialog(null)
                setReasonError(undefined)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!reason.trim()) {
                  setReasonError('Enter the reason for the correction.')
                  return
                }
                setReasonError(undefined)
                onCorrected(reason.trim())
                act(
                  () => set((s) => ({ ...s, lab: { ...s.lab, correctedVersion: true } })),
                  `Corrected report issued as version 2. Version 1 stays traceable. ${SAVED}`,
                )
              }}
            >
              Issue corrected report
            </Button>
          </>
        }
      >
        <TextArea
          label="Reason for the correction"
          hint="Say what changed and why. The reason stays with the version history."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={reasonError}
          rows={4}
        />
      </Dialog>
    </section>
  )
}

function ViewLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex min-h-12 items-center gap-1.5 text-label text-primary hover:text-primary-hover">
      <span className="underline decoration-1 underline-offset-[5px] group-hover:decoration-2">{children}</span>
      <ArrowRight aria-hidden="true" className="size-[18px]" strokeWidth={2} />
    </Link>
  )
}

import { FileText } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  Button,
  Callout,
  Checkbox,
  CheckboxGroup,
  DescriptionList,
  Dialog,
  SourceLabel,
  TextArea,
} from '@/components/ui'
import { CARE_PLAN_SUMMARY, EPISODE_DATES, ORDERS, ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { B12_REPORT, CLINICIAN, requestedSlot } from './data'

/* ------------------------------------------------------------------ */
/* Store transitions (docs/SCOPE.md §5, clinician rows)                 */
/* ------------------------------------------------------------------ */

export type ClinicianDialog = 'propose' | 'info' | 'order' | 'review' | 'report' | null

export function useClinicianActions() {
  const { set, setStage } = useDemo()
  const { possessive } = usePeople()
  const [feedback, setFeedback] = useState<string>()
  const [dialog, setDialog] = useState<ClinicianDialog>(null)
  const updated = `${possessive} care team view is updated.`

  const acceptRequest = useCallback(() => {
    setStage('booking-confirmed')
    setFeedback(`Accepted. ${updated}`)
  }, [setStage, updated])

  const requestInfo = useCallback(() => {
    setStage('info-requested')
    setDialog(null)
    setFeedback(`Request sent. ${updated}`)
  }, [setStage, updated])

  const sendOrder = useCallback(() => {
    setStage('tests-requested')
    setDialog(null)
    setFeedback(`Order sent. ${updated}`)
  }, [setStage, updated])

  const markReviewed = useCallback(
    (explanation: string, followUp: boolean) => {
      set((s) => ({
        ...s,
        stage: followUp ? 'follow-up-due' : 'reviewed',
        clinician: { ...s.clinician, explanation },
      }))
      setDialog(null)
      setFeedback(followUp ? `Reviewed. Plan published with a follow-up. ${updated}` : `Reviewed. Care plan published. ${updated}`)
    },
    [set, updated],
  )

  return { feedback, setFeedback, dialog, setDialog, acceptRequest, requestInfo, sendOrder, markReviewed }
}

export type ClinicianActions = ReturnType<typeof useClinicianActions>

/**
 * "Mark reviewed and update care plan". On narrow screens the visible label is
 * shortened so the button never wraps; the accessible name stays complete.
 */
export function ReviewButton({ onClick, variant = 'primary' }: { onClick: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <Button variant={variant} onClick={onClick} aria-label="Mark reviewed and update care plan">
      <span className="sm:hidden">Mark reviewed</span>
      <span className="hidden sm:inline">Mark reviewed and update care plan</span>
    </Button>
  )
}

/** Every dialog the workspace can open. Always mounted so focus returns cleanly. */
export function ClinicianDialogs({ actions }: { actions: ClinicianActions }) {
  const close = () => actions.setDialog(null)
  return (
    <>
      <ProposeTimeDialog open={actions.dialog === 'propose'} onClose={close} />
      <RequestInfoDialog open={actions.dialog === 'info'} onClose={close} onSend={actions.requestInfo} />
      <OrderDialog open={actions.dialog === 'order'} onClose={close} onSend={actions.sendOrder} />
      <ReviewDialog open={actions.dialog === 'review'} onClose={close} onPublish={actions.markReviewed} />
      <OriginalReportDialog open={actions.dialog === 'report'} onClose={close} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Dialogs                                                              */
/* ------------------------------------------------------------------ */

function ProposeTimeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useDemo()
  const slot = requestedSlot(state)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Propose another time"
      description={`Requested: ${slot.when} · ${slot.modeLabel}`}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <Callout tone="neutral" title="Concept - not available in this preview">
        <p>
          In a live service you could offer other times and the family would choose one. Nothing has been sent. The
          request stays open until you accept it.
        </p>
      </Callout>
    </Dialog>
  )
}

function RequestInfoDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: () => void }) {
  const { state } = useDemo()
  const { fullName, helper } = usePeople()
  const slot = requestedSlot(state)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Request information"
      description="Ask the family for something you need before the visit."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSend}>Send request</Button>
        </>
      }
    >
      <DescriptionList
        items={[
          { term: 'Request', detail: 'A list of current medicines' },
          { term: 'Sent to', detail: `${fullName} and ${helper.firstName} ${helper.lastName}, care partner` },
          { term: 'Needed', detail: `Before the visit on ${slot.date}` },
          { term: 'From', detail: `${CLINICIAN.name} · ${ORG.clinic}` },
        ]}
      />
      <p className="mt-5 text-body-md text-muted">The request appears on the family’s Home and visit page.</p>
    </Dialog>
  )
}

const DEFAULT_ORDER_TEXT = ORDERS.map((o) => `${o.shortName}: ${o.explanation}`).join('\n\n')

function OrderDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: () => void }) {
  const { fullName, patient } = usePeople()
  const [tests, setTests] = useState<string[]>(ORDERS.map((o) => o.id))
  const [text, setText] = useState(DEFAULT_ORDER_TEXT)
  const [error, setError] = useState<string>()

  const send = () => {
    if (!ORDERS.every((o) => tests.includes(o.id))) {
      setError('This preview sends the two example laboratory orders together. Select both to send.')
      return
    }
    setError(undefined)
    onSend()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Order investigations"
      description={`For ${fullName}, ${patient.age} · Ordering clinician: ${CLINICIAN.name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={send}>Send order</Button>
        </>
      }
    >
      <div className="space-y-6">
        <CheckboxGroup
          name="order-tests"
          legend="Tests to order"
          hint="Specimen requirements are confirmed by the laboratory the family chooses."
          value={tests}
          error={error}
          onChange={(v) => {
            setTests(v)
            setError(undefined)
          }}
          options={[
            ...ORDERS.map((o) => ({
              value: o.id,
              label: o.name,
              description: `${o.specimen} · ${o.homeCollection ? 'Home collection possible' : 'At a collection centre'}`,
            })),
            {
              value: 'mri',
              label: 'MRI brain - example',
              description: 'Imaging orders: Concept - not available in this preview',
              disabled: true,
            },
          ]}
        />
        <TextArea
          label="Explanation for the patient"
          hint="Sent with the order. In this preview the family sees the approved example wording."
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </Dialog>
  )
}

function ReviewDialog({
  open,
  onClose,
  onPublish,
}: {
  open: boolean
  onClose: () => void
  onPublish: (explanation: string, followUp: boolean) => void
}) {
  const { fullName } = usePeople()
  const [text, setText] = useState(CARE_PLAN_SUMMARY.explanation)
  const [followUp, setFollowUp] = useState(false)
  const [error, setError] = useState<string>()

  const publish = () => {
    if (!text.trim()) {
      setError('Write a short explanation for the patient before publishing.')
      return
    }
    setError(undefined)
    onPublish(text.trim(), followUp)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Mark reviewed and update care plan"
      description={`${B12_REPORT.title} · ${fullName} · Released ${EPISODE_DATES.released}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={publish}>{followUp ? 'Publish plan with follow-up' : 'Publish care plan'}</Button>
        </>
      }
    >
      <div className="space-y-6">
        <p className="text-body-md text-ink">
          The family sees your explanation in their care plan. The report is marked as reviewed by {CLINICIAN.name}.
        </p>
        <TextArea
          label="Explanation for the patient"
          hint="Plain language. Describe what you reviewed and what happens next."
          rows={5}
          value={text}
          error={error}
          onChange={(e) => {
            setText(e.target.value)
            setError(undefined)
          }}
        />
        <Checkbox
          checked={followUp}
          onChange={setFollowUp}
          label="Add a follow-up visit to the plan"
          description={`The family books it. Suggested by ${EPISODE_DATES.followUp}.`}
        />
      </div>
    </Dialog>
  )
}

function OriginalReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const r = B12_REPORT
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Original report"
      description={`${r.title} · ${r.issuerLabel}`}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-control bg-canvas p-5">
          <FileText aria-hidden="true" className="size-6 text-muted" strokeWidth={1.75} />
          <p className="text-label text-ink">The laboratory’s original document opens here</p>
          <p className="text-body-md text-muted">
            It shows the result, units, reference range and interpretation exactly as the laboratory issued them. This
            prototype does not reproduce values.
          </p>
        </div>
        <DescriptionList
          columns={2}
          items={[
            { term: 'Assay', detail: r.assay },
            { term: 'Specimen', detail: r.specimen },
            { term: 'Version', detail: `${r.versions[0].version} - ${r.versions[0].note}` },
            { term: 'Issued', detail: r.versions[0].issuedOn },
          ]}
        />
        <SourceLabel kind="lab" name={r.issuer} />
      </div>
    </Dialog>
  )
}

import { useState } from 'react'
import { Button, Callout, Dialog, RadioGroup, TextArea } from '@/components/ui'

type ConcernType = 'wrong' | 'harm' | 'other'

/**
 * "Report a concern" about a NeuroLearn answer (DESIGN.md › NeuroLearn).
 * The prototype does not send anything, and says so after submission.
 */
export function ReportConcernDialog({
  open,
  onClose,
  question,
}: {
  open: boolean
  onClose: () => void
  question?: string
}) {
  const [type, setType] = useState<ConcernType | undefined>()
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const close = () => {
    onClose()
    // Reset after the close so the next report starts fresh.
    setTimeout(() => {
      setType(undefined)
      setDetails('')
      setError('')
      setDone(false)
    }, 200)
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Report a concern about this answer"
      description={question ? `About the answer to: “${question}”` : undefined}
      footer={
        done ? (
          <Button onClick={close}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" form="neurolearn-concern">
              Submit report
            </Button>
          </>
        )
      }
    >
      {done ? (
        <Callout tone="info" title="Prototype: nothing was sent." role="status">
          <p>In a live service, the team responsible for NeuroLearn content would review this report.</p>
          <p>If the concern is about someone’s health right now, contact their clinician. In an emergency, call 112.</p>
        </Callout>
      ) : (
        <form
          id="neurolearn-concern"
          noValidate
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            if (!type) {
              setError('Choose what the concern is about.')
              return
            }
            setDone(true)
          }}
        >
          <RadioGroup<ConcernType>
            name="concern-type"
            legend="What is the concern?"
            value={type}
            error={error || undefined}
            onChange={(v) => {
              setType(v)
              setError('')
            }}
            options={[
              { value: 'wrong', label: 'The answer is wrong or unclear' },
              { value: 'harm', label: 'The answer could cause harm' },
              { value: 'other', label: 'Something else' },
            ]}
          />
          <TextArea
            label="Tell us more"
            optional
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
          />
        </form>
      )}
    </Dialog>
  )
}

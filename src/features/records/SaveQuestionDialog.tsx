import { MessageSquarePlus } from 'lucide-react'
import { useState } from 'react'
import { Button, Dialog, InlineStatus, TextArea, TextLink } from '@/components/ui'
import { useDemo } from '@/demo/store'

/**
 * "Save a question for my clinician" (PATIENT.md › P16). Adds to the shared
 * questions list the visit hub shows. Says "Saved" only after the store update.
 */
export function SaveQuestionButton({
  clinician,
  context,
  className,
  showLink = true,
}: {
  clinician: string
  /** Show "View saved questions" after saving (off where the list is already on screen). */
  showLink?: boolean
  /** What the question is about, shown as help text, e.g. "Vitamin B12 report". */
  context?: string
  className?: string
}) {
  const { set } = useDemo()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [saved, setSaved] = useState(false)

  const save = () => {
    const q = text.trim()
    if (!q) {
      setError('Write your question, or close this window.')
      return
    }
    set((s) => ({ ...s, questions: [...s.questions, q] }))
    setText('')
    setError(undefined)
    setOpen(false)
    setSaved(true)
  }

  return (
    <div className={className}>
      <Button
        variant="quiet"
        iconLeft={<MessageSquarePlus className="size-5" strokeWidth={1.75} />}
        onClick={() => {
          setSaved(false)
          setOpen(true)
        }}
      >
        Save a question for my clinician
      </Button>
      <InlineStatus>
        {saved ? (
          <>
            Question saved in this browser tab.
            {showLink ? (
              <>
                {' '}
                <TextLink to="/app/care/visit#questions">View saved questions</TextLink>
              </>
            ) : null}
          </>
        ) : null}
      </InlineStatus>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Save a question for my clinician"
        description={`${clinician} can go through it with you at the next visit.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save question</Button>
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
        >
          <TextArea
            label="Your question"
            hint={context ? `About: ${context}. Write it in your own words.` : 'Write it in your own words.'}
            error={error}
            value={text}
            rows={3}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError(undefined)
            }}
          />
        </form>
      </Dialog>
    </div>
  )
}

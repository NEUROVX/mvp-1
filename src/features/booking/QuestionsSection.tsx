import { MessageCircleQuestion, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button, InlineStatus, TextField } from '@/components/ui'
import { useDemo } from '@/demo/store'

/**
 * Questions for the clinician (PATIENT.md › P11 visit hub). Stored in the
 * shared demo store, so NeuroLearn and the care plan see the same list.
 * The heading id matches the /app/care/visit#questions deep link.
 */
export function QuestionsSection() {
  const { state, set } = useDemo()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<string>()
  const questions = state.questions

  const save = (e: FormEvent) => {
    e.preventDefault()
    const q = draft.trim()
    if (!q) {
      setError('Write a question before saving it.')
      return
    }
    set((s) => ({ ...s, questions: [...s.questions, q] }))
    setDraft('')
    setError(undefined)
    setStatus('Question saved in this browser tab.')
  }

  const remove = (index: number) => {
    set((s) => ({ ...s, questions: s.questions.filter((_, i) => i !== index) }))
    setStatus('Question removed.')
  }

  return (
    <section aria-labelledby="questions" className="space-y-4">
      <div className="space-y-1">
        <h2 id="questions" tabIndex={-1} className="text-heading-sm text-ink">
          Questions for your clinician
        </h2>
        <p className="text-body-md text-muted">Write down what you want to ask. They stay with this visit.</p>
      </div>

      {questions.length ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {questions.map((q, i) => (
            <li key={`${i}-${q}`} className="flex items-start gap-3 py-2 pr-2 pl-4">
              <MessageCircleQuestion aria-hidden="true" className="mt-3 size-5 shrink-0 text-muted" strokeWidth={1.75} />
              <p className="min-w-0 flex-1 py-2.5 text-body-md [overflow-wrap:anywhere] text-ink">{q}</p>
              <button
                type="button"
                onClick={() => remove(i)}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-md text-muted hover:bg-canvas hover:text-ink"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={2} />
                <span className="sr-only">Remove question: {q}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-control/60 bg-surface p-4 text-body-md text-muted">
          No questions saved yet
        </p>
      )}

      <form onSubmit={save} noValidate className="space-y-3">
        <TextField
          label="Add a question"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            if (error) setError(undefined)
          }}
          error={error}
          autoComplete="off"
        />
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          Save question
        </Button>
      </form>
      <InlineStatus>{status}</InlineStatus>
    </section>
  )
}

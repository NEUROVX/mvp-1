import { Callout, DescriptionList, SourceLabel, StatusBadge } from '@/components/ui'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'

/**
 * DESIGN.md › Assessments and their results: record instrument/version, date,
 * respondent, assistance, completion and validity. No invented score.
 */
export function AssessmentsTab() {
  const { state } = useDemo()
  const { fullName } = usePeople()
  const a = state.assessment
  const shared = state.booking.share.assessment

  if (!shared || a.status === 'not-started') {
    return (
      <section aria-labelledby="assess-h" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <h2 id="assess-h" className="text-heading-sm text-ink">
          Assessments
        </h2>
        <p className="mt-2 text-body-md text-muted">
          {shared ? 'No assessment has been recorded for this episode.' : 'The family did not share the assessment preview with this clinic.'}
        </p>
      </section>
    )
  }

  const interrupted = a.status === 'interrupted'
  const completion = a.status === 'completed' ? 'Demo completion' : interrupted ? 'Interrupted' : 'In progress'

  return (
    <section aria-labelledby="assess-h" className="rounded-lg border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-1">
          <h2 id="assess-h" className="text-heading-sm text-ink">
            Assessment preview (not a clinical instrument)
          </h2>
          <SourceLabel kind="system" name="Assessment preview" />
        </div>
        <StatusBadge tone="neutral" size="sm" className="self-start">
          Not interpretable - preview only
        </StatusBadge>
      </div>
      <div className="space-y-6 px-5 py-6 sm:px-6">
        <DescriptionList
          columns={2}
          className="lg:grid-cols-4"
          items={[
            { term: 'Instrument', detail: 'Assessment preview (not a clinical instrument)' },
            { term: 'Version', detail: 'Prototype' },
            { term: 'Date', detail: a.completedAt ?? (interrupted ? EPISODE_DATES.assessment : 'Not recorded') },
            { term: 'Respondent', detail: fullName },
            {
              term: 'Assistance',
              detail: a.supportNeeds.length ? `Support needs noted: ${a.supportNeeds.join(', ')}` : 'None recorded',
            },
            { term: 'Completion', detail: interrupted ? `Interrupted in section ${a.section} of 3` : completion },
            { term: 'Validity', detail: 'Not interpretable - preview only' },
            { term: 'Score', detail: 'None - prototype' },
          ]}
        />
        <Callout tone="neutral" title="No score is produced in this prototype.">
          <p>
            The preview shows where authorized assessment content would appear. It records completion only.
            {interrupted
              ? ' It could not be completed as planned. That is not a result. A clinician-approved alternative, such as an assisted assessment, may be needed.'
              : ' It is not a diagnosis and cannot rule anything in or out.'}
          </p>
        </Callout>
        {a.education || a.readingComfort ? (
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="text-label text-ink">Context recorded before the preview</h3>
            <DescriptionList
              columns={2}
              items={[
                { term: 'Years of schooling', detail: a.education ?? 'Not recorded' },
                {
                  term: 'Comfortable reading on screen',
                  detail: a.readingComfort === 'yes' ? 'Yes' : a.readingComfort === 'no' ? 'No' : a.readingComfort === 'spoken' ? 'Prefers spoken instructions' : 'Not recorded',
                },
              ]}
            />
            <SourceLabel kind="patient" />
          </div>
        ) : null}
      </div>
    </section>
  )
}

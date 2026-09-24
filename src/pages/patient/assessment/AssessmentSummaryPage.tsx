import { ClipboardList } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Button,
  Callout,
  DemoTag,
  DescriptionList,
  Disclosure,
  EmptyState,
  PageHeader,
  SourceLabel,
  StatusBadge,
  TextLink,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { normalizeSupport } from '@/features/intake/options'
import { AnswerList, checkInRows, observationRows } from '@/features/intake/summaries'
import { usePageTitle } from '@/lib/hooks'

const EDUCATION_TEXT: Record<string, string> = { none: 'No formal schooling', 'not-sure': 'Not sure' }
const READING_TEXT = { yes: 'Yes', no: 'No', spoken: 'Prefers spoken instructions' } as const

/**
 * P07 summary before clinical review (PATIENT.md › Summary before clinical review;
 * DESIGN.md › Assessments and their results). Sources stay separate. No score,
 * no zero, no failure label: "Not completed" or "Needs an assisted assessment".
 */
export default function AssessmentSummaryPage() {
  const { state } = useDemo()
  const people = usePeople()
  const { name, persona, helper, fullName, your } = people
  const a = state.assessment
  const completed = a.status === 'completed'
  const interrupted = a.status === 'interrupted'
  usePageTitle(completed ? 'Your information is ready' : interrupted ? 'Assessment not completed' : 'Assessment summary')

  if (!completed && !interrupted) {
    return (
      <div className="space-y-8">
        <PageHeader title="Your assessment summary" lede="A summary appears here after the assessment preview." />
        <EmptyState
          icon={<ClipboardList strokeWidth={1.75} />}
          title={a.status === 'in-progress' ? 'The assessment preview was not finished' : 'No assessment summary yet'}
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button to="/app/care/assessment">Review assessment instructions</Button>
              <Button variant="quiet" to="/app/care/find-clinician">
                Book a clinician instead
              </Button>
            </div>
          }
        >
          The assessment is optional. You can book a clinician without it.
        </EmptyState>
      </div>
    )
  }

  const booked = hasReached(state.stage, 'booking-requested')
  const hasUploads = state.uploads.length > 0
  const helperName = [helper.firstName, helper.lastName].filter(Boolean).join(' ')
  const support = normalizeSupport(a.supportNeeds)
  const date = a.completedAt ?? EPISODE_DATES.assessment

  const record = completed
    ? [
        { term: 'Assessment', detail: 'Memory and thinking assessment - preview' },
        { term: 'Result', detail: 'Demo completion - no score in this prototype' },
        { term: 'Date', detail: <span className="tabular">{date}</span> },
        { term: 'Mode', detail: 'Self-guided preview on this device' },
        { term: 'Respondent', detail: fullName },
        { term: 'Assistance', detail: persona === 'patient' ? 'None recorded' : `Device set-up by ${helperName}` },
      ]
    : [
        { term: 'Assessment', detail: 'Memory and thinking assessment - preview' },
        { term: 'Status', detail: `Stopped in section ${a.section} of 3 - not completed` },
        { term: 'Result', detail: 'No reliable score available' },
        { term: 'Date', detail: <span className="tabular">{EPISODE_DATES.assessment}</span> },
        { term: 'Mode', detail: 'Self-guided preview on this device' },
        { term: 'Next', detail: 'Needs an assisted assessment' },
      ]

  const details = [
    { term: 'Preferred language', detail: state.patient.language || 'Not recorded' },
    {
      term: 'Years of education',
      detail: a.education ? (EDUCATION_TEXT[a.education] ?? `${a.education} years`) : 'Not recorded',
    },
    { term: 'Comfortable reading', detail: a.readingComfort ? READING_TEXT[a.readingComfort] : 'Not recorded' },
    { term: 'Help with seeing, hearing or the screen', detail: support.length ? support.join(', ') : 'Not recorded' },
  ]

  /* ---------------- Next step (the one shadowed surface) ---------------- */
  let next: { title: string; body: string; primary: ReactNode; alt?: ReactNode }
  if (booked) {
    next = {
      title: state.stage === 'booking-requested' ? 'Your appointment request is pending' : 'Your visit details are in one place',
      body: 'This summary is part of the visit packet you chose to share.',
      primary: <Button to="/app/care/visit">View your appointment</Button>,
    }
  } else if (interrupted) {
    next = {
      title: 'A clinician can help with the next step',
      body: 'A clinician can arrange an assisted assessment and talk through what has changed.',
      primary: <Button to="/app/care/find-clinician">Find a clinician</Button>,
    }
  } else if (hasUploads) {
    next = {
      title: 'Find a clinician for your visit',
      body: 'You can share this summary and your reports when you request an appointment.',
      primary: <Button to="/app/care/find-clinician">Find a clinician</Button>,
    }
  } else {
    next = {
      title: 'Add any past reports',
      body: 'Reports you already have can help the clinician prepare. You can skip this.',
      primary: <Button to="/app/care/reports-upload">Add past reports</Button>,
      alt: (
        <Button variant="quiet" to="/app/care/find-clinician">
          Skip to booking
        </Button>
      ),
    }
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={completed ? 'Your information is ready for a clinician' : 'This assessment could not be completed as planned'}
        lede={
          completed
            ? 'Here is what was shared and what was completed. A clinician has not reviewed it yet.'
            : 'No reliable score is available. That is not a result about memory or thinking.'
        }
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">
              {completed ? 'Completed - not yet reviewed' : 'Needs an assisted assessment'}
            </StatusBadge>
            <DemoTag />
          </div>
        }
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        {/* Next step first in reading order, so it leads on mobile. */}
        <aside aria-labelledby="next-step" className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-1 sm:p-6">
            <p className="text-label text-primary">Your next step</p>
            <h2 id="next-step" className="mt-2 text-heading-sm text-ink">
              {next.title}
            </h2>
            <p className="mt-2 text-body-md text-ink">{next.body}</p>
            <div className="mt-5 flex flex-col gap-2 [&>*]:w-full">
              {next.primary}
              {next.alt}
            </div>
            <div className="mt-5 border-t border-border pt-4">
              <Button variant="secondary" to="/app/care/check-in" fullWidth>
                Edit your history
              </Button>
              <p className="mt-2 text-body-md text-muted">
                Check-in answers can be changed. Completed assessment responses are locked and cannot be edited.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-10 lg:col-start-1 lg:row-start-1">
          <Section
            id="shared"
            title={persona === 'patient' ? 'What you shared' : `What ${name} shared`}
            source={<SourceLabel kind="patient" name={fullName} />}
          >
            {state.checkIn.status === 'saved' ? (
              <AnswerList rows={checkInRows(state.checkIn, { your })} />
            ) : (
              <p className="text-body-md text-ink">
                Not completed. <TextLink to="/app/care/check-in">Start care check-in</TextLink>
              </p>
            )}
          </Section>

          {state.observations.status === 'saved' ? (
            <Section id="family" title="Family observations" source={<SourceLabel kind="care-partner" name={helperName} />}>
              <AnswerList rows={observationRows(state.observations)} />
              <p className="text-body-md text-muted">Kept separate from {people.possessive} own answers.</p>
            </Section>
          ) : persona !== 'patient' ? (
            <Section id="family" title="Family observations">
              <p className="text-body-md text-ink">
                None added yet. <TextLink to="/app/care/observations">Add your own observations</TextLink>
              </p>
            </Section>
          ) : null}

          <Section
            id="completed"
            title={completed ? 'What was completed' : 'What was recorded'}
            source={<SourceLabel kind="system" />}
          >
            <DescriptionList columns={2} items={record} className="border-y border-border py-5" />
            <Disclosure summary="Assessment details">
              <DescriptionList items={details} />
            </Disclosure>
          </Section>

          <Section id="review" title="What still needs review">
            <Callout tone="info" title="Not yet reviewed by a clinician. This is not a diagnosis.">
              <p>
                {completed
                  ? 'Your clinician will look at this alongside your history. A brief assessment cannot rule a condition in or out.'
                  : 'Stopping early can happen for many reasons, such as tiredness or the device. A clinician can arrange an assisted assessment.'}
              </p>
            </Callout>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, source, children }: { id: string; title: string; source?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="max-w-[46rem] space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${id}-heading`} className="text-heading-md text-ink">
          {title}
        </h2>
        {source}
      </div>
      {children}
    </section>
  )
}

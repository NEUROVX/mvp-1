import { CalendarClock, ClipboardList, UserRound } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import {
  ArrowLink,
  Callout,
  DemoTag,
  DescriptionList,
  EmptyState,
  NextStepCard,
  PageHeader,
  SourceLabel,
  StatusBadge,
} from '@/components/ui'
import { hasReached } from '@/demo/episode'
import { CARE_PLAN, CARE_PLAN_SUMMARY } from '@/demo/fixtures'
import { useDemo } from '@/demo/store'
import type { CarePlanItem, Tone } from '@/demo/types'
import { AccessGate } from '@/features/records/AccessGate'
import { SaveQuestionButton } from '@/features/records/SaveQuestionDialog'
import { usePageTitle } from '@/lib/hooks'

const ACTION_LABEL: Record<string, string> = {
  'cp-follow-up': 'Book follow-up',
  'cp-plasma': 'View test progress',
  'cp-support': 'Go to support',
  'cp-questions': 'View saved questions',
}

const STATUS_TONE: Record<string, Tone> = {
  'To book': 'info',
  Requested: 'info',
  Processing: 'neutral',
}

/** P17 · Your care plan: clinician-authored, explanation first, only populated categories. */
export default function CarePlanPage() {
  usePageTitle('Your care plan')
  const { state } = useDemo()
  const hasPlan = hasReached(state.stage, 'reviewed') && state.stage !== 'delivery-problem'
  const existing = state.stage === 'existing-care'
  const noTask = state.stage === 'no-task'
  const followUpRequested = Boolean(state.booking.followUp)
  const followUpPrimary = (state.stage === 'follow-up-due' || state.stage === 'reviewed') && !followUpRequested

  if (!hasPlan) {
    return (
      <div className="space-y-10">
        <PageHeader title="Your care plan" />
        <AccessGate>
          <EmptyState
            icon={<ClipboardList strokeWidth={1.75} />}
            title="No care plan yet"
            action={<ArrowLink to="/app/care">Go to My care</ArrowLink>}
          >
            <p>Your clinician adds one after your visit and any results.</p>
          </EmptyState>
        </AccessGate>
      </div>
    )
  }

  const byCategory = (c: CarePlanItem['category']) => CARE_PLAN.filter((i) => i.category === c)
  const followUp = byCategory('next-visit')[0]
  const followUpItem: CarePlanItem | undefined = followUp
    ? followUpRequested
      ? { ...followUp, status: 'Requested', href: '/app/care/visit' }
      : noTask
        ? { ...followUp, status: 'No action due now', due: undefined }
        : followUp
    : undefined

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <PageHeader
          title="Your care plan"
          lede={existing ? 'This is the current plan. It stays in place until your clinician changes it.' : undefined}
        />
        <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-4">
          {existing ? <StatusBadge tone="info">Current plan</StatusBadge> : null}
          <p className="flex flex-col gap-1 text-body-md text-muted lg:flex-row lg:gap-x-3">
            {[
              `From ${CARE_PLAN_SUMMARY.author} (${CARE_PLAN_SUMMARY.authorLabel.toLowerCase()})`,
              `Updated ${CARE_PLAN_SUMMARY.updated}`,
              'Version 1',
            ].map((m, i) => (
              <span key={m} className="inline-flex items-center gap-x-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="hidden text-muted lg:inline">
                    |
                  </span>
                ) : null}
                <span className={i === 0 ? 'font-medium text-ink' : undefined}>{m}</span>
              </span>
            ))}
          </p>
        </div>
      </header>

      <AccessGate>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-12">
          <div className="min-w-0 space-y-10">
            {noTask ? (
              <Callout tone="info" title="There are no new tasks in your care plan.">
                <p>This is not a medical all-clear. Contact the care team if anything changes.</p>
              </Callout>
            ) : null}

            <section aria-labelledby="explanation-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="explanation-heading" className="text-heading-sm text-ink">
                  What your clinician wrote
                </h2>
                <DemoTag />
              </div>
              <p className="mt-3 max-w-reading text-body-lg text-ink">{CARE_PLAN_SUMMARY.explanation}</p>
              <SourceLabel className="mt-4" kind="clinician" name={`${CARE_PLAN_SUMMARY.author}, ${CARE_PLAN_SUMMARY.updated}`} />
            </section>

            {followUpItem && followUpPrimary ? (
              <section aria-labelledby="next-visit-heading" className="space-y-4">
                <h2 id="next-visit-heading" className="text-heading-md text-ink">
                  Next visit
                </h2>
                <NextStepCard
                  headingLevel={3}
                  status={{ label: followUpItem.status, tone: 'info' }}
                  title={followUpItem.title}
                  body={followUpItem.detail}
                  details={followUpItem.due ? [followUpItem.due] : undefined}
                  owner={`Owner: ${followUpItem.owner}`}
                  primary={{ label: 'Book follow-up', to: followUpItem.href }}
                />
              </section>
            ) : null}

            <div className="divide-y divide-border rounded-lg border border-border bg-surface">
              {followUpItem && !followUpPrimary ? (
                <PlanSection title="Next visit">
                  <PlanItem item={followUpItem} actionLabel={followUpRequested ? 'View request' : undefined} />
                </PlanSection>
              ) : null}

              {byCategory('investigations').length ? (
                <PlanSection title="Tests">
                  {byCategory('investigations').map((i) => (
                    <PlanItem key={i.id} item={i} />
                  ))}
                </PlanSection>
              ) : null}

              <PlanSection title="Medicines">
                <div className="space-y-2">
                  <p className="max-w-reading text-body-lg text-ink">{CARE_PLAN_SUMMARY.medicinesNote}</p>
                  <p className="max-w-reading text-body-md text-muted">
                    Medicines appear only as your clinician prescribed them. NeuroLearn never changes them.
                  </p>
                </div>
              </PlanSection>

              {byCategory('daily-care').length ? (
                <PlanSection title="Daily care">
                  {byCategory('daily-care').map((i) => (
                    <PlanItem key={i.id} item={i} />
                  ))}
                </PlanSection>
              ) : null}

              {byCategory('care-support').length ? (
                <PlanSection title="Care support">
                  {byCategory('care-support').map((i) => (
                    <PlanItem key={i.id} item={i} />
                  ))}
                </PlanSection>
              ) : null}

              <QuestionsSection item={byCategory('questions')[0]} />
            </div>
          </div>

          <aside aria-labelledby="about-plan-heading" className="space-y-4">
            <h2 id="about-plan-heading" className="text-heading-sm text-ink">
              About this plan
            </h2>
            <DescriptionList
              items={[
                { term: 'Written by', detail: `${CARE_PLAN_SUMMARY.author} - ${CARE_PLAN_SUMMARY.authorLabel.toLowerCase()}` },
                { term: 'Updated', detail: CARE_PLAN_SUMMARY.updated },
                { term: 'Version', detail: 'Version 1. Earlier versions stay available when the plan changes.' },
                { term: 'Based on', detail: 'Your visit and the Vitamin B12 report' },
              ]}
            />
            <ArrowLink to="/app/records/reports/b12">View the Vitamin B12 report</ArrowLink>
          </aside>
        </div>
      </AccessGate>
    </div>
  )
}

function PlanSection({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="px-5 py-6 sm:px-8 sm:py-8">
      <h2 id={id} className="text-heading-sm text-ink">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-border">{children}</div>
    </section>
  )
}

function PlanItem({ item, actionLabel }: { item: CarePlanItem; actionLabel?: string }) {
  const titleId = useId()
  const label = actionLabel ?? ACTION_LABEL[item.id] ?? 'Open'
  return (
    <article aria-labelledby={titleId} className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h3 id={titleId} className="text-body-lg font-semibold text-ink">
          {item.title}
        </h3>
        <StatusBadge tone={STATUS_TONE[item.status] ?? 'neutral'} className="self-start">
          {item.status}
        </StatusBadge>
      </div>
      <p className="mt-1 max-w-reading text-body-lg text-ink">{item.detail}</p>
      <ul className="mt-3 space-y-1.5">
        <li className="flex items-start gap-2.5 text-body-md text-muted">
          <UserRound aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
          <span>
            <span className="sr-only">Owner: </span>
            {item.owner}
          </span>
        </li>
        {item.due ? (
          <li className="flex items-start gap-2.5 text-body-md text-ink">
            <CalendarClock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
            <span className="tabular">{item.due}</span>
          </li>
        ) : null}
      </ul>
      {item.href ? (
        <div className="mt-1">
          <ArrowLink to={item.href}>{label}</ArrowLink>
        </div>
      ) : null}
    </article>
  )
}

function QuestionsSection({ item }: { item?: CarePlanItem }) {
  const { state } = useDemo()
  return (
    <PlanSection title="Questions to discuss">
      <div>
        {item ? <p className="max-w-reading text-body-lg text-ink">{item.detail}</p> : null}
        {state.questions.length ? (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {state.questions.map((q, i) => (
              <li key={`${i}-${q}`} className="py-3 text-body-lg text-ink">
                {q}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-body-md text-muted">No questions saved yet.</p>
        )}
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6">
          <SaveQuestionButton clinician={CARE_PLAN_SUMMARY.author} context="your care plan" showLink={false} />
          {item?.href ? <ArrowLink to={item.href}>View saved questions</ArrowLink> : null}
        </div>
      </div>
    </PlanSection>
  )
}

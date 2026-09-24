import { BookOpen, ChevronRight, CircleHelp, FileUp, MessageCircleQuestion } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import {
  Callout,
  Careline,
  CarelineCompact,
  DemoTag,
  NextStepCard,
  PageHeader,
  SourceLabel,
} from '@/components/ui'
import { useDemo, useEpisode, usePeople } from '@/demo/store'
import { isBeforeVisit, latestUpdate, learnSuggestionFor } from '@/features/home/episodeView'
import { articleBySlug, readingTime } from '@/features/learn/articles'
import { articlePath, neurolearnPath } from '@/features/learn/paths'
import { usePageTitle } from '@/lib/hooks'

/**
 * Patient Home (PATIENT.md › Canonical patient Home; Home is a set of states).
 * One dominant next step, the Careline, at most two optional "Before your
 * visit" rows (or one "Latest update" after the visit) and one small
 * secondary column. No scores, feeds, widgets or promotions.
 */
export default function HomePage() {
  usePageTitle('Home')
  const { careTitle, hasRecordAccess } = usePeople()
  const { stage } = useEpisode()

  return (
    <div className="space-y-8">
      <PageHeader
        title={careTitle}
        lede="One step at a time. Your information stays together."
        actions={hasRecordAccess ? <DemoTag /> : undefined}
      />

      <div className="grid gap-8 xl:grid-cols-3 xl:gap-10">
        <div className="min-w-0 space-y-8 xl:col-span-2">
          {hasRecordAccess ? (
            <>
              <EpisodeNextStep />
              <CareJourney />
              {isBeforeVisit(stage) ? <BeforeYourVisit /> : <LatestUpdate />}
            </>
          ) : (
            <AccessNextStep />
          )}
        </div>

        <aside aria-label="Learning and help" className="min-w-0 space-y-3">
          <UnderstandNextStep />
          <Link
            to="/app/support"
            className="inline-flex min-h-12 items-center gap-2 rounded-md px-1 text-body-md font-medium text-primary underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-primary-hover hover:decoration-current"
          >
            <CircleHelp aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
            Need help using NeuroVX?
          </Link>
        </aside>
      </div>
    </div>
  )
}

/** The next step comes from the shared episode (src/demo/episode.ts); copy is not rewritten here. */
function EpisodeNextStep() {
  const { next } = useEpisode()
  return (
    <NextStepCard
      status={next.status}
      title={next.title}
      body={next.body}
      details={next.details}
      owner={next.owner}
      primary={next.primary}
      alternative={next.alternative}
    />
  )
}

/** Limited helper: access first, never a medical warning (PATIENT.md › Access incomplete). */
function AccessNextStep() {
  const { name, possessive } = usePeople()
  return (
    <NextStepCard
      status={{ label: 'Record access not arranged', tone: 'neutral' }}
      title={`We need to arrange permission to view ${possessive} record`}
      body={`This is about access, not about ${possessive} health. ${name} can add you from their own account, or the clinic can help verify you.`}
      primary={{ label: 'Help arrange access', to: '/app/access' }}
      alternative={{ label: 'Add your own observations', to: '/app/care/observations' }}
    >
      <Callout tone="info" title="What you can do now">
        <p>
          Add what you have noticed at home. It is saved as yours, separate from {possessive} own answers. You can also
          read guides in Learn. Nothing from {possessive} record is shown until access is arranged.
        </p>
      </Callout>
    </NextStepCard>
  )
}

function CareJourney() {
  const { careline } = useEpisode()
  return (
    <>
      <section
        aria-labelledby="journey-heading"
        className="hidden rounded-lg border border-border bg-surface px-6 pt-6 pb-7 sm:block"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="journey-heading" className="text-heading-sm text-ink">
            Your care journey
          </h2>
          <p className="text-body-md text-muted">Tests happen only if your clinician asks.</p>
        </div>
        <Careline steps={careline} label="Your care journey" className="mt-6" />
      </section>

      <section aria-labelledby="journey-heading-compact" className="space-y-3 sm:hidden">
        <h2 id="journey-heading-compact" className="text-heading-sm text-ink">
          Your care journey
        </h2>
        <CarelineCompact steps={careline} label="Your care journey" />
      </section>
    </>
  )
}

function BeforeYourVisit() {
  const { state } = useDemo()
  const uploads = state.uploads.length
  const questions = state.questions.length
  return (
    <section aria-labelledby="before-visit-heading">
      <h2 id="before-visit-heading" className="text-heading-sm text-ink">
        Before your visit
      </h2>
      <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
        <OptionalRow
          to="/app/care/reports-upload"
          icon={<FileUp strokeWidth={1.75} />}
          title="Add previous reports"
          detail="Past test reports or clinic letters, if you have them."
          count={uploads ? `${uploads} added` : undefined}
        />
        <OptionalRow
          to="/app/care/visit#questions"
          icon={<MessageCircleQuestion strokeWidth={1.75} />}
          title="Add questions for your clinician"
          detail="Write down what you want to ask, so nothing is forgotten."
          count={questions ? `${questions} saved` : undefined}
        />
      </ul>
    </section>
  )
}

function OptionalRow({
  to,
  icon,
  title,
  detail,
  count,
}: {
  to: string
  icon: ReactNode
  title: string
  detail: string
  count?: string
}) {
  return (
    <li>
      <Link
        to={to}
        className="group flex min-h-[4.5rem] items-center gap-4 rounded-lg px-4 py-4 transition-colors duration-150 hover:bg-canvas sm:px-5"
      >
        <span aria-hidden="true" className="hidden size-10 shrink-0 items-center justify-center rounded-md bg-canvas text-primary sm:inline-flex [&>svg]:size-5">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-label text-ink group-hover:text-primary">
            {title}
            <span className="font-normal text-muted"> (optional)</span>
          </span>
          <span className="block text-body-md text-muted">{detail}</span>
          {count ? <span className="mt-1 block text-body-md font-medium text-ink tabular sm:hidden">{count}</span> : null}
        </span>
        {count ? (
          <span className="hidden shrink-0 text-body-md font-medium text-ink tabular sm:inline">{count}</span>
        ) : null}
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted group-hover:text-primary" strokeWidth={1.75} />
      </Link>
    </li>
  )
}

/** After the visit: one quiet row for the latest record event, not a feed. */
function LatestUpdate() {
  const { stage } = useEpisode()
  const ev = latestUpdate(stage)
  if (!ev) return null
  return (
    <section aria-labelledby="latest-update-heading">
      <h2 id="latest-update-heading" className="text-heading-sm text-ink">
        Latest update
      </h2>
      <Link
        to="/app/records"
        className="group mt-3 flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-4 transition-colors duration-150 hover:bg-canvas sm:px-5"
      >
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block text-label text-ink group-hover:text-primary">{ev.title}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-md text-muted">
            <span className="tabular">{ev.date}</span>
            <SourceLabel kind={ev.source} name={ev.sourceName} />
          </span>
        </span>
        <span className="hidden shrink-0 text-label text-primary sm:inline">View in Records</span>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted group-hover:text-primary" strokeWidth={1.75} />
      </Link>
    </section>
  )
}

function UnderstandNextStep() {
  const { stage } = useEpisode()
  const { hasRecordAccess, persona } = usePeople()
  const suggestion = hasRecordAccess ? learnSuggestionFor(stage, persona === 'patient') : learnSuggestionFor('new')
  const article = articleBySlug(suggestion.slug)
  return (
    <section aria-labelledby="understand-heading" className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 id="understand-heading" className="text-heading-sm text-ink">
        Understand your next step
      </h2>
      {article ? (
        <Link to={articlePath('app', article.slug)} className="group mt-4 block rounded-md">
          <span className="flex items-center gap-2 text-body-md text-muted">
            <BookOpen aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
            Guide · {readingTime(article)}
          </span>
          <span className="mt-1 block text-body-lg font-semibold text-primary underline decoration-1 underline-offset-4 group-hover:text-primary-hover group-hover:decoration-2">
            {article.title}
          </span>
        </Link>
      ) : null}
      <div className="mt-5 border-t border-border pt-5">
        <Link to={neurolearnPath('app', suggestion.question)} className="group block rounded-md">
          <span className="flex items-start gap-2 text-body-md text-muted">
            <MessageCircleQuestion aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
            Your guide to understanding brain care
          </span>
          <span className="mt-1 block text-body-lg font-semibold text-primary underline decoration-1 underline-offset-4 group-hover:text-primary-hover group-hover:decoration-2">
            Ask NeuroLearn
          </span>
          <span className="mt-1 block text-body-md text-ink">“{suggestion.question}”</span>
        </Link>
        <p className="mt-2 text-body-md text-muted">Education, not a diagnosis or treatment plan.</p>
      </div>
    </section>
  )
}

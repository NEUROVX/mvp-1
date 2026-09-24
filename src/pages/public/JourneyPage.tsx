import { clsx } from 'clsx'
import { FlaskConical, Stethoscope, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowLink, Button, DemoTag, DescriptionList, SourceLabel, StatusBadge } from '@/components/ui'
import { CLINICIANS, EPISODE_DATES, ORG } from '@/demo/fixtures'
import { usePeople } from '@/demo/store'
import { buildJourney, type JourneyGroup } from '@/features/public/journey'
import { PageIntro, PublicSection } from '@/features/public/Section'
import { usePageTitle } from '@/lib/hooks'

export default function JourneyPage() {
  usePageTitle('Example journey')
  const { name, fullName, patient, helper } = usePeople()
  const groups = buildJourney({ name, helperName: helper.firstName, helperFull: `${helper.firstName} ${helper.lastName}` })
  const clinician = CLINICIANS[0]

  return (
    <>
      <PageIntro
        title="An example journey"
        lede="Follow one fictional care episode from a first concern to a follow-up, and see what each workspace sees along the way."
        aside={
          <div className="rounded-lg border border-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-label text-ink">The people in this example</h2>
              <DemoTag>Fictional</DemoTag>
            </div>
            <DescriptionList
              className="mt-5"
              items={[
                { term: 'Patient', detail: `${fullName}, ${patient.age}` },
                { term: 'Care partner', detail: `${helper.firstName} ${helper.lastName}, ${helper.relationship.toLowerCase()}` },
                { term: 'Clinician', detail: `${clinician.name} - illustrative clinician` },
                { term: 'Clinic', detail: ORG.clinic },
                { term: 'Diagnostic lab', detail: ORG.lab },
              ]}
            />
          </div>
        }
      >
        <p className="max-w-reading text-body-md text-muted">
          Every person, clinic and report here is fictional. No results, scores or diagnoses are shown.
        </p>
      </PageIntro>

      <PublicSection labelledBy="journey-list-title" tone="canvas">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="journey-list-title" className="text-heading-lg-mobile text-ink md:text-heading-lg">
            {name}’s care episode
          </h2>
          <p className="text-body-md text-muted tabular">
            {EPISODE_DATES.checkIn} to {EPISODE_DATES.followUp}
          </p>
        </div>

        <ol aria-label="Care episode stages" className="mt-12">
          {groups.map((g, i) => (
            <Stage key={g.id} group={g} index={i} last={i === groups.length - 1} />
          ))}
        </ol>
      </PublicSection>

      <PublicSection labelledBy="sides-title">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="min-w-0 lg:col-span-6">
            <h2 id="sides-title" className="text-heading-lg-mobile text-ink md:text-heading-lg">
              Try it from each side
            </h2>
            <p className="mt-4 text-body-lg text-muted">
              All three workspaces share this episode. An action in one appears in the others.
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-stretch gap-3 sm:items-start lg:col-span-6 lg:items-end">
            <Button to="/start" size="lg">
              Try the patient preview
            </Button>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
              <ArrowLink to="/pro/clinician">See the clinician’s side</ArrowLink>
              <ArrowLink to="/pro/lab">See the lab’s side</ArrowLink>
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  )
}

function Stage({ group, index, last }: { group: JourneyGroup; index: number; last: boolean }) {
  const titleId = `stage-${group.id}`
  return (
    <li aria-labelledby={titleId} className="relative pb-14 last:pb-0 lg:pb-16">
      {!last ? <span aria-hidden="true" className="absolute top-8 bottom-0 left-[15px] w-px bg-primary/30 sm:top-10 sm:left-[19px]" /> : null}

      <div className="flex gap-4 sm:gap-5">
        <span
          aria-hidden="true"
          className={clsx(
            'relative z-10 inline-flex size-8 shrink-0 sm:size-10 items-center justify-center rounded-full bg-surface text-label tabular',
            group.id === 'tests' ? 'border-2 border-dashed border-primary text-primary' : 'border-2 border-primary text-primary',
          )}
        >
          {index + 1}
        </span>
        <div className="min-w-0 sm:pt-1">
          <h3 id={titleId} className="text-heading-md text-ink">
            {group.label}
          </h3>
          <p className="text-body-md text-muted">{group.sublabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 pl-12 sm:pl-[60px] lg:grid-cols-12 lg:gap-6">
        <ul className="min-w-0 self-start divide-y divide-border rounded-lg border border-border bg-surface lg:col-span-7">
          {group.events.map((e) => (
            <li key={e.id} className="p-4 sm:p-6">
              <p className="text-body-md text-muted tabular">
                <span className="font-medium text-ink">{e.date}</span>
                {e.time ? ` · ${e.time}` : null}
              </p>
              <p className="mt-1 text-label text-ink">{e.title}</p>
              <p className="mt-1 text-body-md text-muted">{e.detail}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <SourceLabel kind={e.source} name={e.sourceName} />
                {e.review ? (
                  <StatusBadge tone={e.reviewTone ?? 'neutral'} size="sm">
                    {e.review}
                  </StatusBadge>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="min-w-0 lg:col-span-5">
          <p className="text-label text-ink">What each workspace sees</p>
          <dl className="mt-3 divide-y divide-border border-y border-border">
            <Sees icon={<UsersRound strokeWidth={1.75} />} term="Patient and family">
              {group.sees.family}
            </Sees>
            <Sees icon={<Stethoscope strokeWidth={1.75} />} term="Clinician">
              {group.sees.clinician}
            </Sees>
            <Sees icon={<FlaskConical strokeWidth={1.75} />} term="Diagnostic lab">
              {group.sees.lab}
            </Sees>
          </dl>
        </div>
      </div>
    </li>
  )
}

function Sees({ icon, term, children }: { icon: ReactNode; term: string; children: ReactNode }) {
  return (
    <div className="py-3.5">
      <dt className="flex items-center gap-2 text-label text-ink">
        <span aria-hidden="true" className="shrink-0 text-muted [&>svg]:size-5">
          {icon}
        </span>
        {term}
      </dt>
      <dd className="mt-0.5 pl-7 text-body-md text-muted">{children}</dd>
    </div>
  )
}

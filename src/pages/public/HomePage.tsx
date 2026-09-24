import { BookOpenText, FlaskConical, Info, Stethoscope, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowLink, Button, DemoTag, Eyebrow, SectionHeading, TextLink, Timeline, type TimelineEntry } from '@/components/ui'
import { EPISODE_DATES } from '@/demo/fixtures'
import { HeroPreview } from '@/features/public/HeroPreview'
import { JourneyCheckpoints, type Checkpoint } from '@/features/public/JourneyCheckpoints'
import { PublicSection } from '@/features/public/Section'
import { useHashTarget } from '@/features/public/useHashTarget'
import { usePageTitle } from '@/lib/hooks'

/* ------------------------------------------------------------------ */
/* Copy: DESIGN.md › "Homepage: exact content and composition"          */
/* ------------------------------------------------------------------ */

const AUDIENCES: Array<{ icon: ReactNode; audience: string; message: string; description: string; link: string; to: string }> = [
  {
    icon: <UsersRound strokeWidth={1.75} />,
    audience: 'Patients & families',
    message: 'Know what comes next.',
    description: 'Organize concerns, prepare for visits and keep your care information together.',
    link: 'Explore patient care',
    to: '/patients',
  },
  {
    icon: <Stethoscope strokeWidth={1.75} />,
    audience: 'Clinicians & hospitals',
    message: 'See the patient’s story together.',
    description: 'Review history, assessments and reports in one organized patient view.',
    link: 'Explore clinical workflows',
    to: '/partners#clinicians',
  },
  {
    icon: <FlaskConical strokeWidth={1.75} />,
    audience: 'Diagnostic labs',
    message: 'Keep orders and results connected.',
    description: 'Coordinate clinician-requested tests and return reports for review.',
    link: 'Explore lab workflows',
    to: '/partners#labs',
  },
]

const CHECKPOINTS: Checkpoint[] = [
  { title: 'Share your concerns', body: 'Record changes you or your family have noticed.', entry: true },
  { title: 'Meet a clinician', body: 'Bring your history and assessments to the conversation.' },
  {
    title: 'Complete recommended tests',
    body: 'Coordinate investigations requested by your clinician.',
    note: 'Only if your clinician asks',
    conditional: true,
  },
  { title: 'Continue your care', body: 'Keep reports, support and follow-ups together.' },
]

const CONTINUITY: TimelineEntry[] = [
  {
    id: 'home-concerns',
    date: EPISODE_DATES.checkIn,
    typeLabel: 'Concerns',
    title: 'Concerns shared',
    detail: 'Changes noticed at home, kept in the family member’s own words.',
    source: 'care-partner',
    review: 'Not yet reviewed',
    reviewTone: 'neutral',
  },
  {
    id: 'home-visit',
    date: EPISODE_DATES.visit,
    typeLabel: 'Visit',
    title: 'Clinician visit',
    detail: 'History, concerns and earlier reports discussed together.',
    source: 'clinician',
  },
  {
    id: 'home-b12',
    date: EPISODE_DATES.released,
    typeLabel: 'Test report',
    title: 'Vitamin B12 report released',
    detail: 'Available to the patient and delivered to the care team.',
    source: 'lab',
    review: 'Awaiting clinician review',
    reviewTone: 'info',
  },
]

const LEARNING = [
  {
    title: 'Preparing for a memory appointment',
    summary: 'What to bring, who can come with you and questions worth asking.',
    slug: 'preparing-for-a-memory-appointment',
  },
  {
    title: 'Understanding cognitive assessments',
    summary: 'What an assessment looks at, and what it cannot tell you on its own.',
    slug: 'understanding-cognitive-assessments',
  },
  {
    title: 'Supporting someone at home',
    summary: 'Everyday routines, safety and looking after yourself as a care partner.',
    slug: 'supporting-someone-at-home',
  },
]

export default function HomePage() {
  usePageTitle('')
  useHashTarget()
  return (
    <>
      <Hero />
      <AudienceRoutes />
      <CareJourney />
      <Continuity />
      <Learning />
      <TrustAndPilot />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section aria-labelledby="home-title" className="bg-canvas">
      <div className="page-gutter mx-auto max-w-page pt-12 pb-12 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="min-w-0 lg:col-span-7 lg:pr-12">
            <Eyebrow>Starting with memory and cognitive care</Eyebrow>
            <h1 id="home-title" className="mt-4 text-display-mobile text-ink md:text-display">
              <span className="block">Brain care.</span>
              <span className="block">Connected.</span>
            </h1>
            <div className="mt-6 max-w-[36rem] space-y-2">
              <p className="text-body-lg text-ink">NeuroVX brings patients, clinicians and diagnostic labs together.</p>
              <p className="text-body-lg text-muted">Keep assessments, reports and next steps in one place.</p>
            </div>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button to="/#care-journey" size="lg" className="w-full sm:w-auto">
                Explore your care journey
              </Button>
              <ArrowLink to="/partners">For healthcare partners</ArrowLink>
            </div>
            <p className="mt-8 flex items-start gap-2 text-body-md text-muted">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
              <span>Product preview - not for clinical use.</span>
            </p>
          </div>
          <HeroPreview className="lg:col-span-5" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Audience routes                                                  */
/* ------------------------------------------------------------------ */

function AudienceRoutes() {
  return (
    <PublicSection labelledBy="audiences-title">
      <SectionHeading id="audiences-title" className="max-w-[22ch]">
        Connected care, built around people.
      </SectionHeading>

      <ul className="mt-10 grid border-t border-border md:mt-12 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <li
            key={a.audience}
            className={
              i === 0
                ? 'flex flex-col py-8 md:pr-8 md:pb-0 lg:pr-10'
                : 'flex flex-col border-t border-border py-8 last:pb-0 md:border-t-0 md:border-l md:px-8 md:pb-0 lg:px-10 md:last:pr-0'
            }
          >
            <p className="flex items-center gap-2 text-label text-primary">
              <span aria-hidden="true" className="[&>svg]:size-5">
                {a.icon}
              </span>
              {a.audience}
            </p>
            <h3 className="mt-4 text-heading-md text-ink">{a.message}</h3>
            <p className="mt-3 flex-1 text-body-md text-muted">{a.description}</p>
            <ArrowLink to={a.to} className="mt-6 self-start">
              {a.link}
            </ArrowLink>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 md:mt-12 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="text-body-md text-muted">
          <span className="font-semibold text-ink">For research teams:</span> explore a future, separately governed research
          workspace.
        </p>
        <ArrowLink to="/research" className="shrink-0">
          Explore research
        </ArrowLink>
      </div>
    </PublicSection>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Care journey (the hero CTA scrolls here)                          */
/* ------------------------------------------------------------------ */

function CareJourney() {
  return (
    <PublicSection id="care-journey" labelledBy="journey-title" tone="canvas">
      <div className="max-w-reading">
        <SectionHeading id="journey-title">A clear next step at every stage.</SectionHeading>
        <p className="mt-4 text-body-lg text-muted">
          Start where you are. Not everyone needs every step, and people already in care can continue from follow-up.
        </p>
      </div>

      <JourneyCheckpoints steps={CHECKPOINTS} className="mt-12 lg:mt-16" />

      <div className="mt-12 border-t border-border pt-8 lg:mt-16">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Button to="/start" size="lg">
            Get started
          </Button>
          <Button to="/start?next=find-clinician" variant="quiet" className="self-start sm:self-auto">
            Find a clinician
          </Button>
        </div>
        <p className="mt-4 text-body-md text-muted">
          Already receiving care? <TextLink to="/sign-in">Sign in to continue</TextLink>
        </p>
      </div>
    </PublicSection>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Continuity preview                                               */
/* ------------------------------------------------------------------ */

function Continuity() {
  return (
    <PublicSection labelledBy="continuity-title">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-5 lg:pr-10">
          <SectionHeading id="continuity-title">Your care should not start from scratch at every visit.</SectionHeading>
          <p className="mt-4 text-body-lg text-muted">
            Bring patient observations, clinical reports and follow-up steps into one continuing record.
          </p>
          <p className="mt-4 text-body-md text-muted">
            Each entry keeps its source and its review state. A report being released is not the same as a clinician having
            reviewed it.
          </p>
          <ArrowLink to="/journey" className="mt-6">
            See an example journey
          </ArrowLink>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-lg border border-border bg-surface p-5 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <p className="text-label text-ink">Care record</p>
              <DemoTag>Synthetic example</DemoTag>
            </div>
            <Timeline entries={CONTINUITY} label="Example care record" />
          </div>
        </div>
      </div>
    </PublicSection>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Learning                                                         */
/* ------------------------------------------------------------------ */

function Learning() {
  return (
    <PublicSection labelledBy="learning-title" rule>
      <div className="max-w-reading">
        <SectionHeading id="learning-title">Understand more. Feel less lost.</SectionHeading>
        <p className="mt-4 text-body-lg text-muted">
          Explore clear explanations of memory concerns, assessments and everyday care.
        </p>
      </div>

      <ul className="mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:gap-8">
        {LEARNING.map((item) => (
          <li key={item.slug} className="flex flex-col border-t border-navy pt-5">
            <p className="text-body-md text-muted">Draft preview</p>
            <h3 className="mt-2 text-heading-sm text-ink">{item.title}</h3>
            <p className="mt-2 flex-1 text-body-md text-muted">{item.summary}</p>
            <ArrowLink to={`/learn/articles/${item.slug}`} className="mt-4 self-start">
              Read guide<span className="sr-only">: {item.title}</span>
            </ArrowLink>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col gap-6 rounded-lg bg-canvas p-6 sm:p-8 md:mt-16 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 gap-4">
          <span aria-hidden="true" className="mt-0.5 hidden shrink-0 text-primary sm:block [&>svg]:size-6">
            <BookOpenText strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="text-heading-sm text-ink">Have a question? Ask NeuroLearn.</h3>
            <p className="mt-1 text-body-md text-muted">An educational guide, not a clinician.</p>
          </div>
        </div>
        <Button to="/learn/neurolearn" variant="secondary" className="shrink-0 self-start md:self-auto">
          Ask NeuroLearn
        </Button>
      </div>
    </PublicSection>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Trust and pilot contact                                          */
/* ------------------------------------------------------------------ */

function TrustAndPilot() {
  return (
    <PublicSection labelledBy="trust-title" tone="canvas">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-7 lg:pr-10">
          <SectionHeading id="trust-title">Built to support clinical care.</SectionHeading>
          <p className="mt-4 max-w-reading text-body-lg text-muted">
            NeuroVX is being developed to organize information and care steps. Clinical decisions remain with qualified
            healthcare professionals.
          </p>
        </div>
        <div className="min-w-0 lg:col-span-5 lg:pt-2">
          <Button to="/pilot" size="lg" className="w-full sm:w-auto">
            Discuss a pilot
          </Button>
          <p className="mt-4 text-body-md text-muted">For patients, families and healthcare partners helping shape NeuroVX.</p>
          <p className="mt-6 text-body-md">
            <TextLink to="/care-and-research">How care and research are kept separate</TextLink>
          </p>
        </div>
      </div>
    </PublicSection>
  )
}

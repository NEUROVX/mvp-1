import { Check, CircleSlash, HeartHandshake, TriangleAlert, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowLink, Button, SectionHeading, TextLink } from '@/components/ui'
import { PERMISSION_LABELS } from '@/demo/fixtures'
import { NodeList, PageIntro, PublicSection } from '@/features/public/Section'
import { usePageTitle } from '@/lib/hooks'

const WHO: Array<{ icon: ReactNode; title: string; body: string; points: string[] }> = [
  {
    icon: <UserRound strokeWidth={1.75} />,
    title: 'For myself',
    body: 'You share your own concerns and decide who can help. Your answers stay yours.',
    points: [
      'Describe what has changed, in your own words',
      'Try an assessment preview when you feel ready',
      'Choose who can see what, and change it later',
    ],
  },
  {
    icon: <HeartHandshake strokeWidth={1.75} />,
    title: 'Helping a family member',
    body: 'You can help with bookings and add what you have noticed at home. You do not answer for the person you help.',
    points: [
      'Add your observations, labelled as yours',
      'Help find a clinician and request a visit',
      'See only what the person has chosen to share',
    ],
  },
]

const PREVIEW_STEPS = [
  { title: 'Share what has changed', body: 'A short check-in about concerns, timing and everyday life.' },
  { title: 'Try an assessment preview', body: 'Shows how an assessment would work. No score is produced.' },
  { title: 'Find a clinician and request a visit', body: 'You choose a time. The clinic confirms it.' },
  { title: 'Book the tests your clinician requests', body: 'Only the tests on your clinician’s order, if there are any.' },
  { title: 'See reports and your care plan', body: 'Each report shows whether a clinician has reviewed it yet.' },
]

const NOT = [
  { title: 'Not a diagnostic quiz', body: 'An assessment helps your clinician. It does not give you a diagnosis.' },
  { title: 'Not a brain-training game', body: 'There are no points, streaks or scores to improve.' },
  { title: 'Not a device store', body: 'Nothing is offered to you because of your answers or results.' },
  { title: 'Not trial enrollment', body: 'Using NeuroVX never signs you up for research.' },
]

export default function PatientsPage() {
  usePageTitle('Patients and families')
  return (
    <>
      <PageIntro
        title="Patients and families"
        lede="Share what has changed, prepare for a clinician visit and keep reports and next steps together. For yourself, or for someone you help."
      >
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Button to="/start" size="lg">
            Get started
          </Button>
          <Button to="/start?next=find-clinician" variant="quiet" className="self-start sm:self-auto">
            Find a clinician
          </Button>
        </div>
        <div className="mt-8 flex max-w-reading items-start gap-3 border-t border-border pt-6">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-error" strokeWidth={2} />
          <div className="space-y-1">
            <p className="text-body-md font-semibold text-ink">
              Sudden changes in speech, strength or confusion need urgent care.
            </p>
            <p className="text-body-md">
              <TextLink to="/urgent">Get urgent help</TextLink>
            </p>
          </div>
        </div>
      </PageIntro>

      {/* Who it's for */}
      <PublicSection labelledBy="who-title" tone="canvas">
        <SectionHeading id="who-title">Who it is for</SectionHeading>
        <div className="mt-10 grid md:grid-cols-2">
          {WHO.map((w, i) => (
            <div
              key={w.title}
              className={
                i === 0 ? 'pb-10 md:pr-10 md:pb-0 lg:pr-16' : 'border-t border-border pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-10 lg:pl-16'
              }
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-primary [&>svg]:size-6">
                  {w.icon}
                </span>
                <h3 className="text-heading-md text-ink">{w.title}</h3>
              </div>
              <p className="mt-3 max-w-[32rem] text-body-lg text-muted">{w.body}</p>
              <NodeList items={w.points} className="mt-6" />
            </div>
          ))}
        </div>
      </PublicSection>

      {/* What you can do in this preview */}
      <PublicSection labelledBy="preview-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-5 lg:pr-12">
            <SectionHeading id="preview-title">What you can do in this preview</SectionHeading>
            <p className="mt-4 text-body-lg text-muted">
              The preview follows one fictional care episode. You can move through it yourself. Nothing you enter leaves
              this browser tab.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <ol className="divide-y divide-border border-y border-border">
              {PREVIEW_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-5 py-5">
                  <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 text-label text-primary tabular">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-label text-ink">{s.title}</h3>
                    <p className="mt-1 text-body-md text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button to="/start" variant="secondary">
                Get started
              </Button>
              <Button to="/start?next=find-clinician" variant="quiet" className="self-start sm:self-auto">
                Find a clinician
              </Button>
            </div>
          </div>
        </div>
      </PublicSection>

      {/* How family help works */}
      <PublicSection labelledBy="family-title" rule>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-6 lg:pr-12">
            <SectionHeading id="family-title">How family help works</SectionHeading>
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-heading-sm text-ink">Your observations stay labelled as yours</h3>
                <p className="mt-2 text-body-md text-muted">
                  What you notice at home is kept separate from the answers of the person you help. Clinicians see who said
                  what.
                </p>
              </div>
              <div>
                <h3 className="text-heading-sm text-ink">Being family does not grant access on its own</h3>
                <p className="mt-2 text-body-md text-muted">
                  The person receiving care, or someone with the right authority, chooses what you can do. A relationship
                  alone is not permission.
                </p>
              </div>
              <div>
                <h3 className="text-heading-sm text-ink">Access can change</h3>
                <p className="mt-2 text-body-md text-muted">
                  Permissions can be changed at any time. Removing access stops future access. It cannot recall copies
                  already downloaded or lawfully kept.
                </p>
              </div>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-6">
            <div className="rounded-lg border border-border p-6 sm:p-8">
              <h3 className="text-heading-sm text-ink">Permissions, in plain language</h3>
              <p className="mt-1 text-body-md text-muted">Each one is chosen separately.</p>
              <ul className="mt-6 divide-y divide-border">
                {Object.values(PERMISSION_LABELS).map((p) => (
                  <li key={p.label} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2} />
                    <div className="min-w-0">
                      <p className="text-label text-ink">{p.label}</p>
                      <p className="mt-0.5 text-body-md text-muted">{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PublicSection>

      {/* What NeuroVX is not */}
      <PublicSection labelledBy="not-title" tone="canvas">
        <SectionHeading id="not-title">What NeuroVX is not</SectionHeading>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {NOT.map((n) => (
            <li key={n.title} className="border-t border-control/40 pt-5">
              <p className="flex items-center gap-2 text-label text-ink">
                <CircleSlash aria-hidden="true" className="size-5 shrink-0 text-muted" strokeWidth={1.75} />
                {n.title}
              </p>
              <p className="mt-2 text-body-md text-muted">{n.body}</p>
            </li>
          ))}
        </ul>
      </PublicSection>

      {/* Learn */}
      <PublicSection labelledBy="learn-title">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-reading">
            <h2 id="learn-title" className="text-heading-md text-ink">
              Want to understand more first?
            </h2>
            <p className="mt-2 text-body-lg text-muted">
              Clear guides on memory concerns, assessments and everyday care. No account needed.
            </p>
          </div>
          <ArrowLink to="/learn" className="shrink-0">
            Visit Learn
          </ArrowLink>
        </div>
      </PublicSection>
    </>
  )
}

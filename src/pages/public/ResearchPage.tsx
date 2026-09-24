import type { ReactNode } from 'react'
import { ArrowLink, Button, SectionHeading, StatusBadge, TextLink } from '@/components/ui'
import { PageIntro, PublicSection } from '@/features/public/Section'
import { usePageTitle } from '@/lib/hooks'

const PRINCIPLES: Array<{ title: string; body: ReactNode }> = [
  {
    title: 'Aggregate feasibility comes first',
    body: 'Research teams start with approved aggregate counts, definitions, date ranges and missing data. Not lists of patients.',
  },
  {
    title: 'Small numbers stay protected',
    body: 'Very small groups are suppressed or combined, so that no one can be singled out from a count.',
  },
  {
    title: 'No identifiable care records for sponsors by default',
    body: 'De-identified, pseudonymized and anonymous are different things. Each dataset is labelled precisely, with its permitted uses.',
  },
  {
    title: 'A cohort is not an eligible patient list',
    body: (
      <>
        Authorized site staff review possible candidates against the current protocol and version. The output reads{' '}
        <StatusBadge tone="info" size="sm" className="align-middle">
          Potential match - site review required
        </StatusBadge>{' '}
        and separates verified, unmet and unknown criteria.
      </>
    ),
  },
  {
    title: 'Being contacted is not joining a study',
    body: 'Permission to be contacted about research is separate from consent to take part in a particular study.',
  },
  {
    title: 'Nothing is pre-selected, and declining never affects care',
    body: 'Research choices are never checked by default. Saying no, or saying nothing, does not change anyone’s care.',
  },
]

export default function ResearchPage() {
  usePageTitle('Research')
  return (
    <>
      <PageIntro
        title="Research, separately governed"
        lede="A future workspace for research teams. Research can expand what is possible in brain care. It must never turn a person receiving care into inventory."
      >
        <div className="flex flex-col items-start gap-5">
          <StatusBadge tone="neutral">Concept - not available in this preview</StatusBadge>
          <p className="max-w-reading text-body-md text-muted">
            Research use would need its own lawful basis, ethics approvals, agreements and permissions. A consent checkbox
            alone is not enough.
          </p>
        </div>
      </PageIntro>

      <PublicSection labelledBy="principles-title" rule>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-4 lg:pr-8">
            <div className="lg:sticky lg:top-28">
              <SectionHeading id="principles-title">The principles we are designing to</SectionHeading>
              <p className="mt-4 text-body-lg text-muted">
                These describe intended rules for a future workspace. None of this is built with real data.
              </p>
            </div>
          </div>
          <ol className="min-w-0 divide-y divide-border border-y border-border lg:col-span-8">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="grid gap-2 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4">
                <span aria-hidden="true" className="text-heading-sm text-primary tabular">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-heading-sm text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-reading text-body-md leading-[1.8] text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PublicSection>

      <PublicSection labelledBy="research-patients-title" tone="canvas">
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          <div className="min-w-0 md:border-r md:border-border md:pr-10 lg:pr-16">
            <h2 id="research-patients-title" className="text-heading-md text-ink">
              For patients and families
            </h2>
            <p className="mt-4 text-heading-sm text-ink">No study options are available here right now.</p>
            <p className="mt-3 text-body-lg text-muted">
              This does not mean studies do not exist elsewhere. Your clinician can talk with you about research that may be
              relevant to you.
            </p>
            <p className="mt-6 text-body-md">
              <TextLink to="/care-and-research">How care and research are kept separate</TextLink>
            </p>
          </div>
          <div className="min-w-0 border-t border-border pt-12 md:border-t-0 md:pt-0 md:pl-10 lg:pl-16">
            <h2 className="text-heading-md text-ink">For research teams</h2>
            <p className="mt-4 text-body-lg text-muted">
              See how a governed feasibility workspace could look. The concept preview contains no patient data.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3">
              <Button to="/pro/research" className="w-full sm:w-auto">
                See the concept preview
              </Button>
              <ArrowLink to="/pilot">Discuss a pilot</ArrowLink>
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  )
}

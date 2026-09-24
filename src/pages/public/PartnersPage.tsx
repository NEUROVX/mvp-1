import { ArrowDown, Building2, FlaskConical, Stethoscope } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Button, DemoTag, SectionHeading, SourceLabel, StatusBadge } from '@/components/ui'
import { EPISODE_DATES } from '@/demo/fixtures'
import type { SourceKind } from '@/demo/types'
import { NodeList, PageIntro, PublicSection } from '@/features/public/Section'
import { StateSequence } from '@/features/public/StateSequence'
import { useHashTarget } from '@/features/public/useHashTarget'
import { usePageTitle } from '@/lib/hooks'

const SUMMARY_ROWS: Array<{ term: string; text: ReactNode; source: SourceKind }> = [
  { term: 'Presenting concern', text: 'Forgetting recent conversations, noticed over several months', source: 'patient' },
  { term: 'Observed at home', text: 'Repeats questions and needs reminders for appointments', source: 'care-partner' },
  {
    term: 'Investigations',
    text: (
      <>
        Vitamin B12 report released <span className="whitespace-nowrap">{EPISODE_DATES.released}</span>.{' '}
        <StatusBadge tone="info" size="sm">
          Awaiting clinician review
        </StatusBadge>
      </>
    ),
    source: 'lab',
  },
  { term: 'Last documented plan', text: 'Follow-up visit once results are reviewed', source: 'clinician' },
]

export default function PartnersPage() {
  usePageTitle('Healthcare partners')
  useHashTarget()
  return (
    <>
      <PageIntro
        title="Healthcare partners"
        lede="For clinicians, hospitals and diagnostic labs. NeuroVX keeps the patient’s story, clinician-directed orders and laboratory reports connected, with the source of every item visible."
      >
        <nav aria-label="On this page">
          <ul className="flex flex-col gap-1 sm:flex-row sm:gap-8">
            <li>
              <JumpLink to="/partners#clinicians" icon={<Stethoscope strokeWidth={1.75} />}>
                Clinicians and hospitals
              </JumpLink>
            </li>
            <li>
              <JumpLink to="/partners#labs" icon={<FlaskConical strokeWidth={1.75} />}>
                Diagnostic labs
              </JumpLink>
            </li>
          </ul>
        </nav>
      </PageIntro>

      {/* Clinicians */}
      <PublicSection id="clinicians" labelledBy="clinicians-title" rule>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-6 lg:pr-12">
            <SectionHeading id="clinicians-title">Clinicians and hospitals</SectionHeading>
            <p className="mt-3 text-heading-sm text-ink">See the patient’s story together.</p>
            <p className="mt-4 text-body-lg text-muted">
              Start each visit with a one-screen summary, then open the original sources behind it. The software organizes
              information. Clinical judgment stays with you.
            </p>
            <NodeList
              className="mt-8"
              items={[
                'A one-screen patient summary, with original responses and reports a click away',
                <>
                  Every generated summary is marked <span className="font-semibold">Draft summary - review required</span>{' '}
                  until you accept or edit it
                </>,
                'Patient, care partner, laboratory and clinician information kept distinct',
                'Tests are ordered by you. Nothing is ordered automatically',
                'Clear review states: a released report is not a reviewed report',
              ]}
            />
            <Button to="/pro/clinician" className="mt-10 w-full sm:w-auto">
              {/* Shortened on the narrowest phones so the label stays on one line. */}
              Open the clinician <span className="max-[399px]:hidden">workspace&nbsp;</span>preview
            </Button>
          </div>

          <figure className="min-w-0 lg:col-span-6">
            <div className="rounded-lg border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                <p className="text-label text-ink">Patient summary</p>
                <StatusBadge tone="info" size="sm">
                  Draft summary - review required
                </StatusBadge>
              </div>
              <dl className="divide-y divide-border px-5 sm:px-6">
                {SUMMARY_ROWS.map((row) => (
                  <div key={row.term} className="py-4">
                    <dt className="text-metadata font-medium text-muted">{row.term}</dt>
                    <dd className="mt-1 space-y-1.5">
                      <p className="text-body-md text-ink">{row.text}</p>
                      <SourceLabel kind={row.source} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center gap-3 text-body-md text-muted">
              <DemoTag>Synthetic example</DemoTag>
              Each line keeps its source. Nothing here is a real patient.
            </figcaption>
          </figure>
        </div>
      </PublicSection>

      {/* Labs */}
      <PublicSection id="labs" labelledBy="labs-title" tone="canvas">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-5 lg:pr-12">
            <SectionHeading id="labs-title">Diagnostic labs</SectionHeading>
            <p className="mt-3 text-heading-sm text-ink">Keep orders and results connected.</p>
            <p className="mt-4 text-body-lg text-muted">
              Receive clear, clinician-directed orders and return reports to the people who need them, with each state owned
              and visible.
            </p>
            <Button to="/pro/lab" className="mt-8 w-full sm:w-auto">
              Open the lab <span className="max-[399px]:hidden">workspace&nbsp;</span>preview
            </Button>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <NodeList
              items={[
                'Clear orders: patient identity, ordering clinician, requested test and specimen requirements',
                'Ask for clarification instead of guessing when an order is incomplete',
                'Collection, release, delivery and clinician review tracked as separate states',
                'Exceptions, such as a failed delivery, have a named owner and a way to retry',
              ]}
            />
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-surface p-5 sm:p-8 lg:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-heading-sm text-ink">How a report moves</h3>
            <p className="text-body-md text-muted">Four separate states, each with an owner</p>
          </div>
          <StateSequence
            className="mt-8"
            label="Report states"
            states={[
              { name: 'Sample collected', owner: 'Diagnostic lab' },
              { name: 'Lab report released', owner: 'Diagnostic lab, after its own validation' },
              { name: 'Delivery confirmed', owner: 'Care team confirms receipt' },
              { name: 'Clinician reviewed', owner: 'Ordering clinician' },
            ]}
          />
        </div>
      </PublicSection>

      {/* Hospitals and pilot */}
      <PublicSection labelledBy="hospitals-title">
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          <div className="min-w-0 md:border-r md:border-border md:pr-10 lg:pr-16">
            <div className="flex items-center gap-3">
              <Building2 aria-hidden="true" className="size-6 shrink-0 text-muted" strokeWidth={1.75} />
              <h2 id="hospitals-title" className="text-heading-md text-ink">
                Hospitals
              </h2>
            </div>
            <p className="mt-3 text-body-lg text-muted">
              Aggregate pathway operations: where patients are waiting, which tasks are delayed and who owns the next step.
              Identifiable details appear only when a staff member’s work needs them.
            </p>
            <StatusBadge tone="neutral" className="mt-5">
              Concept - not available in this preview
            </StatusBadge>
          </div>
          <div className="min-w-0 border-t border-border pt-12 md:border-t-0 md:pt-0 md:pl-10 lg:pl-16">
            <h2 className="text-heading-md text-ink">Shape a pilot with us</h2>
            <p className="mt-3 text-body-lg text-muted">
              We are looking for clinicians, hospitals and diagnostic labs to help shape how NeuroVX works in practice.
            </p>
            <Button to="/pilot" variant="secondary" className="mt-6 w-full sm:w-auto">
              Discuss a pilot
            </Button>
          </div>
        </div>
      </PublicSection>
    </>
  )
}

function JumpLink({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex min-h-12 items-center gap-2 text-label text-primary hover:text-primary-hover">
      <span aria-hidden="true" className="text-primary [&>svg]:size-5">
        {icon}
      </span>
      <span className="underline decoration-transparent underline-offset-[5px] group-hover:decoration-current">{children}</span>
      <ArrowDown aria-hidden="true" className="size-[18px]" strokeWidth={2} />
    </Link>
  )
}

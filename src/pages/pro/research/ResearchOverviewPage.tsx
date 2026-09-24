import { Check, FolderSearch, Inbox, X } from 'lucide-react'
import { Callout, Careline, EmptyState, PageHeader, StatusBadge } from '@/components/ui'
import { NoData, ResearchSection } from '@/features/research/parts'
import { usePageTitle } from '@/lib/hooks'

const WOULD = [
  'Answer an authorized study team’s feasibility question with approved aggregate counts',
  'Show the dataset’s scope, definitions, date ranges and missing data next to every figure',
  'Pass site-review requests to authorized staff at the site',
  'Record who looked at what, for which study and why',
]

const WOULD_NOT = [
  'Show identifiable care records to sponsors by default',
  'Allow unrestricted exports',
  'Enrol anyone automatically, or contact patients for a sponsor without authority',
  'Treat a cohort count as a list of eligible patients',
  'Change anyone’s care because of a research choice',
]

const PRINCIPLES = [
  {
    title: 'Lawful basis and approvals',
    body: 'Each study needs its applicable lawful basis, ethics approvals, agreements and safeguards. A consent toggle alone is not enough.',
  },
  {
    title: 'Data states are named precisely',
    body: 'De-identified, pseudonymized and anonymous are not interchangeable. Each dataset says which it is and what that permits.',
  },
  {
    title: 'Small-cell protection',
    body: 'Counts small enough to single someone out are suppressed or combined before anyone sees them.',
  },
  {
    title: 'Access audit',
    body: 'Every query and view is recorded against a named user, a study and a purpose.',
  },
  {
    title: 'No unrestricted exports',
    body: 'Results stay in the governed workspace. Any export is approved case by case.',
  },
  {
    title: 'Research never changes care',
    body: 'Declining, or never being asked, does not change anyone’s care. No research choice is pre-selected.',
  },
]

const STUDY_CONTEXT = [
  { term: 'Protocol and version', detail: 'The exact protocol the question belongs to, and which version is current' },
  { term: 'Sites', detail: 'Participating sites and the authorized staff at each' },
  { term: 'Dates', detail: 'Approval dates, the data cut-off and the source dates behind every figure' },
  { term: 'Permitted datasets', detail: 'Each dataset’s scope, data state and permitted uses' },
]

const CRITERIA_ROWS = ['Inclusion criterion A', 'Inclusion criterion B', 'Exclusion criterion A', 'All criteria combined']
const CRITERIA_COLUMNS = ['Definition', 'Date range', 'Denominator', 'Aggregate count', 'Missingness']

export default function ResearchOverviewPage() {
  usePageTitle('Research overview')

  return (
    <div className="space-y-10">
      <Callout tone="info" title="Concept preview.">
        No patient data is used or shown. Research on NeuroVX would be separately governed and is not available.
      </Callout>

      <PageHeader
        title="Research overview"
        meta={
          <p className="max-w-reading text-body-lg text-muted">
            What a separately governed research workspace would be for, and the rules it would follow. Aggregate first. No
            identifiable records by default.
          </p>
        }
      />

      <ResearchSection
        title="What this workspace is for"
        intro={
          <p>
            Aggregate feasibility for authorized studies. A study team could ask whether a study is workable. It would never
            see who the people are.
          </p>
        }
      >
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <h3 className="text-label text-ink">It would</h3>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {WOULD.map((item) => (
                <li key={item} className="flex gap-3 py-3 text-body-md text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-label text-ink">It would not</h3>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {WOULD_NOT.map((item) => (
                <li key={item} className="flex gap-3 py-3 text-body-md text-ink">
                  <X aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResearchSection>

      <ResearchSection
        title="Governance principles"
        intro={<p>Rules a research workspace would follow before any data could be used.</p>}
      >
        <ul className="grid gap-x-10 md:grid-cols-2 lg:-mt-5">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="border-b border-border py-5">
              <h3 className="text-label text-ink">{p.title}</h3>
              <p className="mt-1 text-body-md text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </ResearchSection>

      <ResearchSection
        id="studies"
        title="Studies"
        intro={<p>Each authorized study would have its own context and its own access controls.</p>}
      >
        <div className="space-y-6">
          <EmptyState icon={<FolderSearch strokeWidth={1.75} />} title="No studies in this concept preview">
            No study options are available here right now. That does not mean none exist elsewhere.
          </EmptyState>
          <div>
            <h3 className="text-label text-ink">What a study context would show</h3>
            <dl className="mt-3 divide-y divide-border border-y border-border">
              {STUDY_CONTEXT.map((row) => (
                <div key={row.term} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-label text-ink">{row.term}</dt>
                  <dd className="text-body-md text-muted">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </ResearchSection>

      <ResearchSection
        id="cohorts"
        title="Cohorts"
        intro={
          <>
            <p>Aggregate feasibility, shown as structure only.</p>
            <p>Every figure would carry its definition, date range, denominator and missing data.</p>
          </>
        }
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <div id="feasibility-caption" className="border-b border-border px-5 py-4">
                <p className="text-label text-ink">Aggregate feasibility</p>
                <p className="text-body-md text-muted">Not available in the concept preview - no data</p>
              </div>
              <div role="region" aria-labelledby="feasibility-caption" tabIndex={0} className="relative overflow-x-auto">
                <table aria-labelledby="feasibility-caption" className="w-full min-w-[42rem] border-collapse text-left">
                  <thead>
                    <tr>
                      <th scope="col" className="border-b border-border bg-canvas py-3 pr-4 pl-5 text-body-md font-semibold whitespace-nowrap text-muted">
                        Criterion
                      </th>
                      {CRITERIA_COLUMNS.map((c) => (
                        <th key={c} scope="col" className="border-b border-border bg-canvas px-4 py-3 text-body-md font-semibold whitespace-nowrap text-muted last:pr-5">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CRITERIA_ROWS.map((r) => (
                      <tr key={r} className="h-14 border-b border-border last:border-b-0">
                        <th scope="row" className="py-3 pr-4 pl-5 text-body-md font-medium whitespace-nowrap text-ink">
                          {r}
                        </th>
                        {CRITERIA_COLUMNS.map((c) => (
                          <td key={c} className="px-4 py-3 text-body-md last:pr-5">
                            <NoData />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-body-md text-muted md:hidden">Scroll the table sideways to see every column.</p>
            <p className="max-w-reading text-body-md text-muted">
              Small counts would be suppressed. A count below the governance-approved threshold would show as
              “Suppressed”, never as the number.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
            <h3 className="text-label text-ink">Example output label</h3>
            <p className="mt-1 text-body-md text-muted">Illustrates the structure only. There is no candidate and no data.</p>
            <div className="mt-5">
              <StatusBadge tone="info">Potential match - site review required</StatusBadge>
            </div>
            <dl className="mt-5 grid gap-x-6 gap-y-3 min-[360px]:grid-cols-3">
              {['Protocol', 'Protocol version', 'Source dates'].map((t) => (
                <div key={t}>
                  <dt className="text-body-md text-muted">{t}</dt>
                  <dd className="text-data">
                    <NoData />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-6 border-t border-border pt-5 sm:grid-cols-3">
              {[
                { title: 'Verified criteria', note: 'Confirmed from source records' },
                { title: 'Unmet criteria', note: 'Not met on current information' },
                { title: 'Unknown criteria', note: 'Not recorded. Never treated as met.' },
              ].map((g) => (
                <div key={g.title}>
                  <h4 className="text-label text-ink">{g.title}</h4>
                  <p className="text-body-md text-muted">{g.note}</p>
                  <ul className="mt-2 space-y-1 text-body-md">
                    <li>
                      <NoData />
                    </li>
                    <li>
                      <NoData />
                    </li>
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-border pt-4 text-body-md text-ink">
              A potential match is not a medical eligibility decision. Only authorized site staff review it, against the
              current protocol.
            </p>
          </div>
        </div>
      </ResearchSection>

      <ResearchSection
        id="requests"
        title="Requests"
        intro={<p>How a site-review request would flow. Each step needs its own authority.</p>}
      >
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
            <Careline
              orientation="vertical"
              label="Site-review request flow (concept)"
              steps={[
                {
                  id: 'ask',
                  label: 'Sponsor asks for site review',
                  sublabel: 'Using approved aggregate feasibility only. No names or records.',
                  state: 'upcoming',
                },
                {
                  id: 'review',
                  label: 'Authorized site staff review',
                  sublabel: 'Against the current protocol and version, within the site’s own care records.',
                  state: 'upcoming',
                },
                {
                  id: 'permission',
                  label: 'Separate research permission',
                  sublabel: 'The person decides. Care continues the same either way.',
                  state: 'upcoming',
                },
              ]}
            />
          </div>
          <Callout tone="neutral" title="Permission to contact is not study consent">
            Agreeing to be contacted about research is separate from consenting to a particular study. Each is asked for on
            its own, and neither is ever pre-selected.
          </Callout>
          <EmptyState icon={<Inbox strokeWidth={1.75} />} title="No requests in this concept preview">
            Research on NeuroVX is not available. Concept - not available in this preview.
          </EmptyState>
        </div>
      </ResearchSection>
    </div>
  )
}

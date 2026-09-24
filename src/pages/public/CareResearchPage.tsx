import type { ReactNode } from 'react'
import { ArrowLink, TextLink } from '@/components/ui'
import { usePageTitle } from '@/lib/hooks'

/**
 * Plain-language explainer of the intended separation of care and research
 * (DESIGN.md › Research, pharma and CRO workspace; › Care-partner access).
 * Long-document layout at reading width. It describes intent, not a built system.
 */
const AT_A_GLANCE = [
  'Care information is used for care.',
  'Research needs separate permission, approvals and agreements.',
  'Being contacted is not the same as joining a study.',
  'Saying no never changes your care.',
]

export default function CareResearchPage() {
  usePageTitle('How care and research are kept separate')
  return (
    <article className="bg-surface">
      <div className="page-gutter mx-auto max-w-page pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-reading">
          <header>
            <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">How care and research are kept separate</h1>
            <p className="mt-4 text-body-lg text-muted">
              This explains how NeuroVX is being designed to keep your care and any future research apart. It describes
              intended rules. Research is not part of this preview.
            </p>
          </header>

          <aside aria-labelledby="glance-title" className="mt-10 rounded-lg bg-canvas p-6 sm:p-8">
            <h2 id="glance-title" className="text-label text-ink">
              At a glance
            </h2>
            <ol className="mt-4 space-y-3">
              {AT_A_GLANCE.map((line, i) => (
                <li key={line} className="flex gap-4 text-body-lg text-ink">
                  <span aria-hidden="true" className="w-4 shrink-0 font-semibold text-primary tabular">
                    {i + 1}
                  </span>
                  <span className="min-w-0">{line}</span>
                </li>
              ))}
            </ol>
          </aside>

          <div className="mt-12 space-y-12">
            <Part id="care" title="Care information is used for care">
              <p>
                What you share for your care, such as concerns, observations, reports and care plans, is used to help you and
                the people caring for you. It is not a pool of data for other purposes.
              </p>
            </Part>

            <Part id="separate" title="Research needs its own permission">
              <p>
                Using information for research would need a separate lawful basis, ethics approvals, agreements and
                safeguards. A single checkbox is not enough.
              </p>
              <p>
                Research teams would start from approved aggregate counts, not from your record. Identifiable care records
                would not be shared with sponsors by default.
              </p>
            </Part>

            <Part id="contact" title="Being contacted is not joining a study">
              <p>
                You may one day be asked whether a research team can contact you. Saying yes only allows contact. Joining a
                particular study is a separate decision, made with the study team, after they explain it.
              </p>
              <p>
                A possible match is only that. Site staff must check it against the study’s current rules before anything
                else happens.
              </p>
            </Part>

            <Part id="default" title="Nothing is chosen for you">
              <p>Research choices are never checked in advance. If you do nothing, the answer is no.</p>
            </Part>

            <Part id="declining" title="Saying no never changes your care">
              <p>
                Declining, or not answering, does not affect your appointments, tests, reports or care plan in any way.
              </p>
            </Part>

            <Part id="revoking" title="You can change your mind">
              <p>
                You can withdraw a research permission later. That stops future use. It cannot promise the deletion of copies
                that have already been lawfully kept, for example as part of a completed study.
              </p>
            </Part>

            <Part id="family" title="Family members and research">
              <p>
                A family member who helps with your care does not gain any research permission through that role. Care-partner
                access and research permission are separate.
              </p>
            </Part>

            <Part id="preview" title="In this preview">
              <p>
                No research data is collected. The research workspace is a concept with no patient data. Everything you
                enter stays in this browser tab and is cleared when you close it.
              </p>
            </Part>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:gap-8">
            <ArrowLink to="/research">About the research concept</ArrowLink>
            <ArrowLink to="/privacy">What this preview stores</ArrowLink>
          </div>
          <p className="mt-6 text-body-md text-muted">
            Questions about how this should work? <TextLink to="/pilot">Discuss a pilot</TextLink>
          </p>
        </div>
      </div>
    </article>
  )
}

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-heading-md text-ink">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-body-lg text-ink">{children}</div>
    </section>
  )
}

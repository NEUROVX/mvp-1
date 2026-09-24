import { BookOpen, Check, House, Signpost, Stethoscope, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowLink, SectionHeading, StatusBadge, TextLink } from '@/components/ui'
import { PageIntro, PublicSection } from '@/features/public/Section'
import { usePageTitle } from '@/lib/hooks'

const SERVICES: Array<{ icon: ReactNode; title: string; body: string; available?: boolean }> = [
  {
    icon: <House strokeWidth={1.75} />,
    title: 'Support at home',
    body: 'Help with daily routines, home safety and personal care.',
  },
  {
    icon: <Signpost strokeWidth={1.75} />,
    title: 'Rehabilitation',
    body: 'Therapies such as speech, occupational and physical therapy, when a clinician recommends them.',
  },
  {
    icon: <BookOpen strokeWidth={1.75} />,
    title: 'Caregiver education',
    body: 'Sessions and guides for families who help someone at home.',
  },
  {
    icon: <Stethoscope strokeWidth={1.75} />,
    title: 'Help finding a provider',
    body: 'Find a clinician for memory and thinking concerns, and request a visit.',
    available: true,
  },
]

const LISTINGS_SHOW = [
  'What the device is intended for',
  'Manufacturer and model',
  'A verified seller',
  'Practical requirements and relevant warnings',
  'Whether a clinician needs to be involved',
  'Price, returns, warranty and support',
]

const WE_WONT = [
  'Offers triggered by a condition, an answer or a result',
  'Countdown offers or miracle-cure claims',
  'A cart filled in from a lab result',
  'Using health information to target advertising',
]

export default function CareSupportPage() {
  usePageTitle('Care and support')
  return (
    <>
      <PageIntro
        title="Care and support"
        lede="Practical help around care, organized by what you need. You choose when to look. Nothing here is pushed into your results."
      />

      <PublicSection labelledBy="services-title" rule>
        <SectionHeading id="services-title">Services, organized by need</SectionHeading>
        <ul className="mt-10 border-t border-border">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="grid gap-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-7"
            >
              <div className="flex items-center gap-3 lg:col-span-3">
                <span aria-hidden="true" className="shrink-0 text-primary [&>svg]:size-6">
                  {s.icon}
                </span>
                <h3 className="text-heading-sm text-ink">{s.title}</h3>
              </div>
              <p className="text-body-md text-muted lg:col-span-5">{s.body}</p>
              <div className="lg:col-span-4 lg:justify-self-end">
                {s.available ? (
                  <ArrowLink to="/start?next=find-clinician">Find a clinician</ArrowLink>
                ) : (
                  <StatusBadge tone="neutral" size="sm" className="lg:whitespace-nowrap">
                    Concept - not available in this preview
                  </StatusBadge>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-reading text-body-md text-muted">
          When services are live, each listing will show its scope, verified credentials, how it is delivered, availability,
          fees and contact details. No provider will be labelled the best.
        </p>
      </PublicSection>

      <PublicSection labelledBy="devices-title" tone="canvas">
        <div className="max-w-reading">
          <SectionHeading id="devices-title">Devices: a future, clearly separated catalogue</SectionHeading>
          <p className="mt-4 text-body-lg text-ink">There is no store in this preview.</p>
          <p className="mt-2 text-body-lg text-muted">
            A future catalogue would sit apart from care, with wellness products and medical devices listed separately.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-heading-sm text-ink">What each listing will show</h3>
            <ul className="mt-5 space-y-3">
              {LISTINGS_SHOW.map((item) => (
                <li key={item} className="flex gap-3 text-body-md text-ink">
                  <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-heading-sm text-ink">What we will not do</h3>
            <ul className="mt-5 space-y-3">
              {WE_WONT.map((item) => (
                <li key={item} className="flex gap-3 text-body-md text-ink">
                  <X aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PublicSection>

      <PublicSection labelledBy="help-title">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 id="help-title" className="text-heading-md text-ink">
              Already using the preview?
            </h2>
            <p className="mt-2 text-body-lg text-muted">Support, sharing and access settings live in the patient app.</p>
            <ArrowLink to="/app/support" className="mt-4">
              Open Support
            </ArrowLink>
          </div>
          <div>
            <h2 className="text-heading-md text-ink">Need help now?</h2>
            <p className="mt-2 text-body-lg text-muted">
              Sudden changes in speech, strength or confusion need urgent care.{' '}
              <TextLink to="/urgent">Get urgent help</TextLink>
            </p>
          </div>
        </div>
      </PublicSection>
    </>
  )
}

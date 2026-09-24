import { clsx } from 'clsx'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Button, Callout, InlineStatus, TextLink } from '@/components/ui'
import { useDemo } from '@/demo/store'
import { usePageTitle } from '@/lib/hooks'

type Kind = 'contact' | 'privacy' | 'terms' | 'accessibility'

const PAGES: Array<{ kind: Kind; to: string; label: string; title: string }> = [
  { kind: 'contact', to: '/contact', label: 'Contact', title: 'Contact' },
  { kind: 'privacy', to: '/privacy', label: 'Privacy', title: 'Privacy' },
  { kind: 'terms', to: '/terms', label: 'Terms', title: 'Terms of use' },
  { kind: 'accessibility', to: '/accessibility', label: 'Accessibility', title: 'Accessibility' },
]

/**
 * Contact, Privacy, Terms and Accessibility. No fabricated legal text and no
 * invented contact details: each page says plainly what is a placeholder and
 * lists only what is true of this preview.
 */
export default function InfoPage({ kind }: { kind: Kind }) {
  const page = PAGES.find((p) => p.kind === kind) ?? PAGES[0]
  usePageTitle(page.title)

  return (
    <div className="bg-surface">
      <div className="page-gutter mx-auto max-w-page pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            <div className="max-w-reading">
              {kind === 'contact' ? <ContactContent /> : null}
              {kind === 'privacy' ? <PrivacyContent /> : null}
              {kind === 'terms' ? <TermsContent /> : null}
              {kind === 'accessibility' ? <AccessibilityContent /> : null}
            </div>
          </div>

          <nav aria-label="Site information" className="min-w-0 lg:col-span-3 lg:row-start-1 lg:pt-2">
            <p className="text-label text-ink">Site information</p>
            <ul className="mt-3 border-l border-border">
              {PAGES.map((p) => {
                const current = p.kind === kind
                return (
                  <li key={p.kind}>
                    <Link
                      to={p.to}
                      aria-current={current ? 'page' : undefined}
                      className={clsx(
                        '-ml-px flex min-h-12 items-center border-l-2 pl-4 text-body-md transition-colors duration-150',
                        current ? 'border-primary font-semibold text-primary' : 'border-transparent text-ink hover:text-primary',
                      )}
                    >
                      {p.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Title({ children, lede }: { children: ReactNode; lede?: ReactNode }) {
  return (
    <header>
      <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">{children}</h1>
      {lede ? <p className="mt-4 text-body-lg text-muted">{lede}</p> : null}
    </header>
  )
}

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-heading-md text-ink">{title}</h2>
      <div className="mt-3 space-y-4 text-body-lg text-ink">{children}</div>
    </section>
  )
}

function FactList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 py-4 text-body-md text-ink">
          <span aria-hidden="true" className="mt-[0.55em] size-2 shrink-0 rounded-full border-2 border-primary" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <Callout tone="warning" title="Placeholder" className="mt-8">
      {children}
    </Callout>
  )
}

/* ------------------------------------------------------------------ */

function ContactContent() {
  return (
    <>
      <Title lede="Contact details will be published with the pilot. For now, use Discuss a pilot.">Contact</Title>
      <Button to="/pilot" className="mt-8 w-full sm:w-auto">
        Discuss a pilot
      </Button>
      <Part title="If you need medical help">
        <p>NeuroVX cannot answer medical questions or respond to emergencies.</p>
        <p>
          Sudden changes in speech, strength or confusion need urgent care. <TextLink to="/urgent">Get urgent help</TextLink>
        </p>
      </Part>
    </>
  )
}

function PrivacyContent() {
  const { reset } = useDemo()
  const [cleared, setCleared] = useState(false)
  return (
    <>
      <Title>Privacy</Title>
      <Placeholder>
        <p>Policy text has not been written yet. This page lists only what is true of this preview.</p>
      </Placeholder>

      <Part title="What is true about this preview">
        <FactList
          items={[
            'It uses demo data only. Every person, clinic, lab and report is fictional.',
            'What you enter is kept in this browser tab (sessionStorage) and is cleared when the tab closes.',
            'Nothing is sent to a server. There are no accounts and no backend.',
            'Files you pick in the preview stay in this tab. They are not uploaded anywhere.',
            'There are no analytics, advertising or tracking tools.',
            'The Discuss a pilot form does not send or store what you type.',
          ]}
        />
      </Part>

      <Part title="Reset the demo in this tab">
        <p className="text-body-md text-muted">
          This returns the demo to its starting example and replaces anything you entered in this tab.
        </p>
        <div className="flex flex-col items-start gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              reset()
              setCleared(true)
            }}
          >
            Reset the demo
          </Button>
          <InlineStatus>{cleared ? 'The demo was reset to its starting example.' : null}</InlineStatus>
        </div>
      </Part>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <Title>Terms of use</Title>
      <Placeholder>
        <p>Terms have not been written yet. This page lists only what is true of this preview.</p>
      </Placeholder>

      <Part title="What this preview is">
        <FactList
          items={[
            'A design prototype for demonstration and feedback. It is not a clinical service.',
            'Not for clinical use. It does not give medical advice, a diagnosis or treatment.',
            'Everything shown is fictional, including people, clinics, labs, reports, fees and appointment times.',
            'Nothing is booked, ordered, bought or sent.',
            'Clinical decisions remain with qualified healthcare professionals.',
          ]}
        />
      </Part>

      <Part title="If you need medical help">
        <p>
          Sudden changes in speech, strength or confusion need urgent care. <TextLink to="/urgent">Get urgent help</TextLink>
        </p>
      </Part>
    </>
  )
}

function AccessibilityContent() {
  return (
    <>
      <Title lede="We aim to meet WCAG 2.2 at level AA. This preview has not yet been tested with users, or with people who use assistive technology.">
        Accessibility
      </Title>

      <Part title="What this preview is designed to do">
        <FactList
          items={[
            'Let you reach and use everything with a keyboard, with a visible focus outline.',
            'Keep buttons and form fields at least 48 pixels tall, and other links at least 44 pixels.',
            'Reflow down to 320 pixels wide without sideways scrolling.',
            'Write status in words, never show it by colour alone.',
            'Give every form field a visible label, with errors that say how to fix them.',
            'Let text sizes follow your browser settings.',
          ]}
        />
      </Part>

      <Part title="Known limitations">
        <FactList
          items={[
            'Not yet tested with users, including people with memory concerns, care partners and people who use assistive technology.',
            'English only. A language preference can be recorded, but the interface is not translated.',
            'Maps are abstract samples. They do not show real places.',
          ]}
        />
      </Part>

      <Part title="Report a problem">
        <p>Tell us what happened and on which page. For now, issues are reported through the Discuss a pilot form.</p>
        <Button to="/pilot" variant="secondary" className="w-full sm:w-auto">
          Report an issue
        </Button>
      </Part>
    </>
  )
}

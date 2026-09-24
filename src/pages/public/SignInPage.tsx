import { clsx } from 'clsx'
import { ArrowRight, FlaskConical, HeartHandshake, Microscope, Stethoscope, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLink, DemoTag } from '@/components/ui'
import { CLINICIANS, LAB_PROVIDERS, ORG } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import { usePageTitle } from '@/lib/hooks'

interface Option {
  to: string
  icon: ReactNode
  kind: string
  title: string
  detail: string
  onChoose?: () => void
}

export default function SignInPage() {
  usePageTitle('Sign in')
  const { setPersona } = useDemo()
  const { name, helper } = usePeople()
  const clinician = CLINICIANS[0]
  const lab = LAB_PROVIDERS[0]

  const patientOptions: Option[] = [
    {
      to: '/app',
      icon: <HeartHandshake strokeWidth={1.75} />,
      kind: 'Care partner',
      title: `${helper.firstName} helping ${name}`,
      detail: `${helper.relationship}, with permission to help`,
      onChoose: () => setPersona('care-partner'),
    },
    {
      to: '/app?as=patient',
      icon: <UserRound strokeWidth={1.75} />,
      kind: 'Patient',
      title: name,
      detail: 'Using their own account',
      onChoose: () => setPersona('patient'),
    },
  ]

  const proOptions: Option[] = [
    {
      to: '/pro/clinician',
      icon: <Stethoscope strokeWidth={1.75} />,
      kind: 'Clinician',
      title: clinician.name,
      detail: ORG.clinic,
    },
    {
      to: '/pro/lab',
      icon: <FlaskConical strokeWidth={1.75} />,
      kind: 'Diagnostic lab',
      title: lab.name,
      detail: 'Orders, collections and report release',
    },
    {
      to: '/pro/research',
      icon: <Microscope strokeWidth={1.75} />,
      kind: 'Research',
      title: 'Concept preview',
      detail: 'No patient data',
    },
  ]

  return (
    <div className="bg-canvas">
      <div className="page-gutter mx-auto max-w-task pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <h1 className="text-heading-lg-mobile text-ink md:text-heading-lg">Choose a demo workspace</h1>
        <p className="mt-4 text-body-lg text-muted">
          There are no accounts in this preview. Each workspace opens the same fictional care episode.
        </p>
        <DemoTag className="mt-4">All names are fictional</DemoTag>

        <OptionGroup id="patient-group" title="Patient and family" options={patientOptions} />
        <OptionGroup id="pro-group" title="Professional workspaces" options={proOptions} />

        <div className="mt-12 flex flex-col gap-1 border-t border-border pt-8 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-body-lg text-ink">New to NeuroVX?</p>
          <ArrowLink to="/start">Get started</ArrowLink>
        </div>
      </div>
    </div>
  )
}

function OptionGroup({ id, title, options }: { id: string; title: string; options: Option[] }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-label text-ink">
        {title}
      </h2>
      <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
        {options.map((o, i) => (
          <li key={o.to}>
            <Link
              to={o.to}
              onClick={o.onChoose}
              className={clsx(
                'group flex min-h-20 items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-accent-soft sm:px-6',
                i === 0 && 'rounded-t-lg',
                i === options.length - 1 && 'rounded-b-lg',
              )}
            >
              <span aria-hidden="true" className="shrink-0 text-primary [&>svg]:size-6">
                {o.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-md text-muted">{o.kind}</span>
                <span className="block text-heading-sm text-ink group-hover:text-primary-hover">{o.title}</span>
                <span className="block text-body-md text-muted">{o.detail}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Route table. Every page is lazy-loaded so one unfinished page never breaks
 * another. Ownership of each page file is listed in docs/SCOPE.md.
 */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import { DemoProvider } from '@/demo/store'
import { FocusedLayout } from '@/layouts/FocusedLayout'
import { PatientLayout } from '@/layouts/PatientLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout'
import { RouteError } from './RouteError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page<P extends object = any>(load: () => Promise<{ default: ComponentType<P> }>) {
  const C: LazyExoticComponent<ComponentType<P>> = lazy(load)
  return (props: P) => (
    <Suspense fallback={<PageLoading />}>
      <C {...props} />
    </Suspense>
  )
}

function PageLoading() {
  return (
    <p role="status" className="py-24 text-center text-body-md text-muted">
      Loading page…
    </p>
  )
}

/* Public site — agent A */
const Home = page(() => import('@/pages/public/HomePage'))
const Patients = page(() => import('@/pages/public/PatientsPage'))
const Partners = page(() => import('@/pages/public/PartnersPage'))
const Research = page(() => import('@/pages/public/ResearchPage'))
const CareSupport = page(() => import('@/pages/public/CareSupportPage'))
const Journey = page(() => import('@/pages/public/JourneyPage'))
const Pilot = page(() => import('@/pages/public/PilotPage'))
const CareResearch = page(() => import('@/pages/public/CareResearchPage'))
const Info = page<{ kind: 'contact' | 'privacy' | 'terms' | 'accessibility' }>(() => import('@/pages/public/InfoPage'))
const SignIn = page(() => import('@/pages/public/SignInPage'))
const NotFound = page(() => import('@/pages/public/NotFoundPage'))

/* Learn (public + app) — agent E */
const LearnHub = page<{ context: 'public' | 'app' }>(() => import('@/pages/learn/LearnHubPage'))
const Article = page<{ context: 'public' | 'app' }>(() => import('@/pages/learn/ArticlePage'))
const NeuroLearn = page<{ context: 'public' | 'app' }>(() => import('@/pages/learn/NeuroLearnPage'))

/* Onboarding, check-in, assessment — agent B */
const WhoFor = page(() => import('@/pages/onboarding/WhoForPage'))
const AccessSetup = page(() => import('@/pages/onboarding/AccessSetupPage'))
const UrgentHelp = page(() => import('@/pages/onboarding/UrgentHelpPage'))
const CheckIn = page(() => import('@/pages/patient/checkin/CheckInPage'))
const Observations = page(() => import('@/pages/patient/checkin/ObservationsPage'))
const PastReports = page(() => import('@/pages/patient/checkin/PastReportsPage'))
const AssessmentIntro = page(() => import('@/pages/patient/assessment/AssessmentIntroPage'))
const AssessmentSession = page(() => import('@/pages/patient/assessment/AssessmentSessionPage'))
const AssessmentSummary = page(() => import('@/pages/patient/assessment/AssessmentSummaryPage'))

/* Booking and visit — agent C */
const FindClinician = page(() => import('@/pages/patient/booking/FindClinicianPage'))
const ClinicianDetail = page(() => import('@/pages/patient/booking/ClinicianDetailPage'))
const BookingReview = page(() => import('@/pages/patient/booking/BookingReviewPage'))
const VisitHub = page(() => import('@/pages/patient/booking/VisitHubPage'))
const ChangeVisitMode = page(() => import('@/pages/patient/booking/ChangeVisitModePage'))

/* Tests, records, care plan — agent D */
const RequestedTests = page(() => import('@/pages/patient/tests/RequestedTestsPage'))
const LabProviders = page(() => import('@/pages/patient/tests/LabProvidersPage'))
const LabBooking = page(() => import('@/pages/patient/tests/LabBookingPage'))
const TestProgress = page(() => import('@/pages/patient/tests/TestProgressPage'))
const Records = page(() => import('@/pages/patient/records/RecordsPage'))
const ReportDetail = page(() => import('@/pages/patient/records/ReportDetailPage'))
const CarePlan = page(() => import('@/pages/patient/records/CarePlanPage'))

/* Home, My care, Support, Access — agent E */
const PatientHome = page(() => import('@/pages/patient/HomePage'))
const MyCare = page(() => import('@/pages/patient/MyCarePage'))
const Support = page(() => import('@/pages/patient/SupportPage'))
const Access = page(() => import('@/pages/patient/AccessPage'))

/* Clinician workspace — agent F */
const ClinToday = page(() => import('@/pages/pro/clinician/TodayPage'))
const ClinPatients = page(() => import('@/pages/pro/clinician/PatientsPage'))
const ClinRecord = page(() => import('@/pages/pro/clinician/PatientRecordPage'))
const ClinOrders = page(() => import('@/pages/pro/clinician/OrdersPage'))
const ClinFollowUp = page(() => import('@/pages/pro/clinician/FollowUpPage'))

/* Lab + research workspaces — agent G */
const LabOrders = page(() => import('@/pages/pro/lab/OrdersPage'))
const LabOrderDetail = page(() => import('@/pages/pro/lab/OrderDetailPage'))
const LabCollections = page(() => import('@/pages/pro/lab/CollectionsPage'))
const LabResults = page(() => import('@/pages/pro/lab/ResultsPage'))
const LabExceptions = page(() => import('@/pages/pro/lab/ExceptionsPage'))
const ResearchOverview = page(() => import('@/pages/pro/research/ResearchOverviewPage'))

function Root() {
  return (
    <DemoProvider>
      <Outlet />
    </DemoProvider>
  )
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      {
        element: <PublicLayout />,
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Home /> },
          { path: 'patients', element: <Patients /> },
          { path: 'partners', element: <Partners /> },
          { path: 'research', element: <Research /> },
          { path: 'care-support', element: <CareSupport /> },
          { path: 'journey', element: <Journey /> },
          { path: 'pilot', element: <Pilot /> },
          { path: 'care-and-research', element: <CareResearch /> },
          { path: 'contact', element: <Info kind="contact" /> },
          { path: 'privacy', element: <Info kind="privacy" /> },
          { path: 'terms', element: <Info kind="terms" /> },
          { path: 'accessibility', element: <Info kind="accessibility" /> },
          { path: 'sign-in', element: <SignIn /> },
          { path: 'learn', element: <LearnHub context="public" /> },
          { path: 'learn/articles/:slug', element: <Article context="public" /> },
          { path: 'learn/neurolearn', element: <NeuroLearn context="public" /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        element: <FocusedLayout />,
        errorElement: <RouteError />,
        children: [
          { path: 'start', element: <WhoFor /> },
          { path: 'start/access', element: <AccessSetup /> },
          { path: 'urgent', element: <UrgentHelp /> },
          { path: 'app/care/check-in', element: <CheckIn /> },
          { path: 'app/care/observations', element: <Observations /> },
          { path: 'app/care/reports-upload', element: <PastReports /> },
          { path: 'app/care/assessment', element: <AssessmentIntro /> },
          { path: 'app/care/assessment/session', element: <AssessmentSession /> },
          { path: 'app/care/book/review', element: <BookingReview /> },
          { path: 'app/care/visit/change-mode', element: <ChangeVisitMode /> },
          { path: 'app/care/tests/book', element: <LabBooking /> },
        ],
      },
      {
        path: 'app',
        element: <PatientLayout />,
        errorElement: <RouteError />,
        children: [
          { index: true, element: <PatientHome /> },
          { path: 'care', element: <MyCare /> },
          { path: 'care/assessment/summary', element: <AssessmentSummary /> },
          { path: 'care/find-clinician', element: <FindClinician /> },
          { path: 'care/clinicians/:clinicianId', element: <ClinicianDetail /> },
          { path: 'care/visit', element: <VisitHub /> },
          { path: 'care/tests', element: <RequestedTests /> },
          { path: 'care/tests/providers', element: <LabProviders /> },
          { path: 'care/tests/progress', element: <TestProgress /> },
          { path: 'care/plan', element: <CarePlan /> },
          { path: 'records', element: <Records /> },
          { path: 'records/reports/:reportId', element: <ReportDetail /> },
          { path: 'learn', element: <LearnHub context="app" /> },
          { path: 'learn/articles/:slug', element: <Article context="app" /> },
          { path: 'learn/neurolearn', element: <NeuroLearn context="app" /> },
          { path: 'support', element: <Support /> },
          { path: 'access', element: <Access /> },
        ],
      },
      {
        path: 'pro/clinician',
        element: <WorkspaceLayout workspace="clinician" />,
        errorElement: <RouteError />,
        children: [
          { index: true, element: <ClinToday /> },
          { path: 'patients', element: <ClinPatients /> },
          { path: 'patients/:patientId', element: <ClinRecord /> },
          { path: 'orders', element: <ClinOrders /> },
          { path: 'follow-up', element: <ClinFollowUp /> },
        ],
      },
      {
        path: 'pro/lab',
        element: <WorkspaceLayout workspace="lab" />,
        errorElement: <RouteError />,
        children: [
          { index: true, element: <LabOrders /> },
          { path: 'orders/:orderId', element: <LabOrderDetail /> },
          { path: 'collections', element: <LabCollections /> },
          { path: 'results', element: <LabResults /> },
          { path: 'exceptions', element: <LabExceptions /> },
        ],
      },
      {
        path: 'pro/research',
        element: <WorkspaceLayout workspace="research" />,
        errorElement: <RouteError />,
        children: [{ index: true, element: <ResearchOverview /> }],
      },
    ],
  },
])

import { GitCompareArrows, PencilLine } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button, Dialog, InlineStatus, SourceLabel, StatusBadge, TextArea } from '@/components/ui'
import { EPISODE_DATES } from '@/demo/fixtures'
import { useDemo, usePeople } from '@/demo/store'
import type { DemoState } from '@/demo/types'
import {
  CARE_CONTEXT_LABELS,
  CLINICIAN,
  clinicianOf,
  concernText,
  DEMO_ORDERS,
  hasOrders,
  isReviewed,
  onsetText,
  orderStatus,
  workspaceToday,
  yesNo,
  type ClinicianState,
} from '../data'
import { LiveSlot } from '../parts'

type People = ReturnType<typeof usePeople>

const ONSET_PHRASE: Record<string, string> = {
  days: 'that started recently, within days',
  'weeks-months': 'over weeks or months',
  'over-a-year': 'that started more than a year ago',
  'not-sure': 'with the start not known',
}

const DAILY_TEXT: Record<string, string> = {
  yes: 'Changes in everyday tasks are reported.',
  no: 'No change in everyday tasks is reported.',
  'not-sure': 'Changes in everyday tasks are uncertain.',
}

/** The generated draft. It states missing information instead of smoothing it over. */
function draftNarrative(state: DemoState, p: People) {
  const c = state.checkIn
  const s: string[] = []
  const concerns = concernText(c.concerns).toLowerCase()
  s.push(
    `${p.fullName}, ${p.patient.age}${p.patient.ageApproximate ? ' (approximate)' : ''}, reports changes in ${concerns}${
      c.onset ? ` ${ONSET_PHRASE[c.onset] ?? ''}` : ''
    }.`,
  )
  s.push(`History from ${p.name}, with help from ${p.helper.firstName} (${p.helper.relationship.toLowerCase()}).`)
  if (c.dailyTasks) s.push(DAILY_TEXT[c.dailyTasks])
  if (state.booking.share.observations && state.observations.items.length)
    s.push(`Care partner observations: ${state.observations.items.join('; ').toLowerCase()}.`)
  if (state.assessment.status === 'completed') s.push('The assessment preview was completed; it produces no score.')
  if (state.assessment.status === 'interrupted') s.push('The assessment preview could not be completed as planned.')
  s.push(
    state.booking.infoReply
      ? 'Current medicines were supplied by the family. Family history and other conditions are not recorded.'
      : 'Current medicines, family history and other conditions are not recorded.',
  )
  return s.join(' ')
}

/* ------------------------------------------------------------------ */

function Row({ term, children, source }: { term: string; children: ReactNode; source?: ReactNode }) {
  return (
    <div className="grid gap-x-6 gap-y-1.5 py-4 @xl:grid-cols-[10rem_minmax(0,1fr)] @4xl:grid-cols-[10rem_minmax(0,1fr)_13rem]">
      <dt className="text-body-md text-muted">{term}</dt>
      <dd className="min-w-0 text-body-md text-ink">{children}</dd>
      {source ? <dd className="@xl:col-start-2 @4xl:col-start-3 @4xl:text-right">{source}</dd> : null}
    </div>
  )
}

function Quote({ children }: { children: ReactNode }) {
  return <blockquote className="mt-1.5 border-l-2 border-control pl-3 text-body-md text-ink">“{children}”</blockquote>
}

const NOT_SHARED = <span className="text-muted">Not shared with this clinic</span>

export function SummaryTab() {
  const { state, set } = useDemo()
  const people = usePeople()
  const { fullName, helper, name } = people
  const cl = clinicianOf(state)
  const today = workspaceToday(state.stage)
  const share = state.booking.share
  const c = state.checkIn
  const o = state.observations
  const helperName = `${helper.firstName} ${helper.lastName}`

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState<string>()
  const [compare, setCompare] = useState(false)
  const [msg, setMsg] = useState<string>()
  const [impression, setImpression] = useState(cl.impression ?? '')
  const [impressionError, setImpressionError] = useState<string>()
  const [impressionMsg, setImpressionMsg] = useState<string>()

  const patch = (p: Partial<ClinicianState>) =>
    set((s) => ({ ...s, clinician: { ...s.clinician, ...p } as DemoState['clinician'] }))

  const narrative = cl.summaryText ?? draftNarrative(state, people)
  const accepted = cl.summaryAccepted

  const saveEdit = () => {
    if (!draft.trim()) {
      setDraftError('The summary cannot be empty. Write the summary, or cancel to keep the previous text.')
      return
    }
    patch({ summaryText: draft.trim(), summaryEdited: `Edited by ${CLINICIAN.name} · ${today}`, summaryAccepted: undefined })
    setEditing(false)
    setMsg(accepted ? 'Changes saved. Accept the summary again when you are ready.' : 'Changes saved.')
  }

  const accept = () => {
    patch({ summaryAccepted: `Accepted by ${CLINICIAN.name} · ${today} (demo)` })
    setMsg('Summary accepted.')
  }

  const saveImpression = () => {
    if (!impression.trim()) {
      setImpressionError('Write your impression before saving.')
      return
    }
    patch({ impression: impression.trim(), impressionSaved: today })
    setImpressionMsg('Impression saved in this browser tab.')
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section aria-labelledby="summary-h" className="@container min-w-0 rounded-lg border border-border bg-surface">
        {/* Header: label, review state and source controls */}
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 id="summary-h" className="text-heading-sm text-ink">
                {accepted ? 'Reviewed summary' : 'Draft summary - review required'}
              </h2>
              <StatusBadge tone={accepted ? 'info' : 'warning'} size="sm">
                {accepted ? 'Accepted' : 'Review required'}
              </StatusBadge>
            </div>
            <p className="text-body-md text-muted">
              {accepted
                ? accepted
                : `Generated from the visit packet shared ${EPISODE_DATES.bookingRequested}. Not yet reviewed.`}
              {cl.summaryEdited ? ` · ${cl.summaryEdited}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button variant="secondary" iconLeft={<GitCompareArrows className="size-5" />} onClick={() => setCompare(true)}>
              Compare with source
            </Button>
            {!editing ? (
              <Button
                variant="secondary"
                iconLeft={<PencilLine className="size-5" />}
                onClick={() => {
                  setDraft(narrative)
                  setDraftError(undefined)
                  setEditing(true)
                  setMsg(undefined)
                }}
              >
                Edit summary
              </Button>
            ) : null}
          </div>
        </div>

        {/* Narrative */}
        <div className="border-b border-border px-5 py-5 sm:px-6">
          {editing ? (
            <div className="max-w-reading space-y-4">
              <TextArea
                label="Summary text"
                hint="Your edits are marked with your name and the date."
                rows={7}
                value={draft}
                error={draftError}
                onChange={(e) => {
                  setDraft(e.target.value)
                  setDraftError(undefined)
                }}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={saveEdit}>Save changes</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-reading space-y-2">
              <p className="text-body-md text-ink">{narrative}</p>
              <p className="text-metadata text-muted">
                {cl.summaryEdited ? cl.summaryEdited : 'Generated draft. Check it against the sources below.'}
              </p>
            </div>
          )}
        </div>

        {/* What the family reported */}
        <dl className="divide-y divide-border px-5 sm:px-6">
          <Row term="Presenting concern" source={share.checkIn ? <SourceLabel kind="patient" /> : undefined}>
            {share.checkIn ? (
              <>
                <p>{concernText(c.concerns)}</p>
                {c.ownWords ? <Quote>{c.ownWords}</Quote> : null}
              </>
            ) : (
              NOT_SHARED
            )}
          </Row>
          <Row term="Onset" source={share.checkIn ? <SourceLabel kind="patient" /> : undefined}>
            {share.checkIn ? onsetText(c.onset) : NOT_SHARED}
          </Row>
          <Row term="Source of history" source={<SourceLabel kind="system" />}>
            {fullName}, with help from {helperName} ({helper.relationship.toLowerCase()})
          </Row>
          <Row term="Functional change" source={share.checkIn ? <SourceLabel kind="patient" /> : undefined}>
            {share.checkIn ? <>Changes in everyday tasks: {yesNo(c.dailyTasks)}</> : NOT_SHARED}
          </Row>
          {share.checkIn && c.hearingVisionSupport.length ? (
            <Row term="Hearing and vision" source={<SourceLabel kind="patient" />}>
              {c.hearingVisionSupport.join(', ')}
            </Row>
          ) : null}
          <Row term="Important missing information">
            <ul className="space-y-1">
              <li>
                Current medicines:{' '}
                {state.booking.infoReply ? (
                  <>
                    “{state.booking.infoReply}”{' '}
                    <SourceLabel kind="care-partner" name={helperName} className="ml-1" />
                  </>
                ) : (
                  <span className="font-medium">Not recorded</span>
                )}
              </li>
              <li>
                Family history: <span className="font-medium">Not recorded</span>
              </li>
              <li>
                Other conditions: <span className="font-medium">Not recorded</span>
              </li>
            </ul>
          </Row>
        </dl>

        {/* Care partner observations, kept visually separate */}
        <div className="border-y border-border bg-canvas px-5 py-5 sm:px-6">
          <div className="grid gap-x-6 gap-y-2 @xl:grid-cols-[10rem_minmax(0,1fr)] @4xl:grid-cols-[10rem_minmax(0,1fr)_13rem]">
            <h3 className="text-body-md text-muted">Family observations</h3>
            <div className="min-w-0 text-body-md text-ink">
              {!share.observations ? (
                NOT_SHARED
              ) : o.status === 'saved' && o.items.length ? (
                <>
                  <ul className="list-disc space-y-1 pl-5 marker:text-muted">
                    {o.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  {o.onset ? <p className="mt-2">Noticed: {o.onset}</p> : null}
                  {o.notes ? <Quote>{o.notes}</Quote> : null}
                </>
              ) : (
                <span className="text-muted">No family observations recorded</span>
              )}
            </div>
            <div className="@xl:col-start-2 @4xl:col-start-3 @4xl:text-right">
              <SourceLabel kind="care-partner" name={`${helperName} (${helper.relationship.toLowerCase()})`} />
            </div>
          </div>
        </div>

        {/* Assessments, reports, investigations, plan */}
        <dl className="divide-y divide-border px-5 sm:px-6">
          <Row term="Assessment" source={<SourceLabel kind="system" name="Assessment preview" />}>
            {!share.assessment
              ? NOT_SHARED
              : state.assessment.status === 'completed'
                ? `Preview completed on ${state.assessment.completedAt ?? EPISODE_DATES.assessment} - no score in this prototype`
                : state.assessment.status === 'interrupted'
                  ? 'Could not be completed as planned'
                  : 'Not completed'}
          </Row>
          <Row
            term="Uploaded reports"
            source={
              state.uploads.length && share.uploads ? (
                <span className="text-body-md text-muted">Provided by the family, not yet verified</span>
              ) : undefined
            }
          >
            {!share.uploads ? (
              NOT_SHARED
            ) : state.uploads.length ? (
              <ul className="space-y-1">
                {state.uploads.map((u) => (
                  <li key={u.id} className="break-words">
                    {u.name}
                    <span className="text-muted"> · added {u.addedAt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              'No reports added yet'
            )}
          </Row>
          {state.questions.length ? (
            <Row term="Questions for the visit" source={<span className="text-body-md text-muted">Shared by the family</span>}>
              <ul className="space-y-1">
                {state.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </Row>
          ) : null}
          {hasOrders(state.stage) ? (
            <Row term="Investigations" source={<SourceLabel kind="clinician" name={CLINICIAN.name} />}>
              <ul className="space-y-1">
                {DEMO_ORDERS.map((ord) => (
                  <li key={ord.id}>
                    {ord.shortName} · <span className="text-muted">{orderStatus(state, ord.id)?.label}</span>
                  </li>
                ))}
              </ul>
            </Row>
          ) : null}
          {isReviewed(state.stage) ? (
            <Row term="Last documented plan" source={<SourceLabel kind="clinician" name={CLINICIAN.name} />}>
              Care plan version 1, published {EPISODE_DATES.reviewed}
              {state.stage === 'follow-up-due' ? `. Follow-up suggested by ${EPISODE_DATES.followUp}.` : '.'}
            </Row>
          ) : null}
        </dl>

        {/* Accept */}
        <div className="border-t border-border px-5 py-5 sm:px-6">
          {accepted ? (
            <p className="text-body-md text-muted">
              Accepted summaries stay in the record. If you edit it, accept it again.
            </p>
          ) : !editing ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
              <Button onClick={accept} className="shrink-0">
                Accept summary
              </Button>
              <p className="text-body-md text-muted">Accepting records your name and the date. It does not add a diagnosis.</p>
            </div>
          ) : (
            <p className="text-body-md text-muted">Save or cancel your edit before accepting the summary.</p>
          )}
          <LiveSlot className="mt-3">
            <InlineStatus>{msg}</InlineStatus>
          </LiveSlot>
        </div>
      </section>

      {/* Clinician's own impression, never generated */}
      <section aria-labelledby="impression-h" className="rounded-lg border border-border bg-surface p-5 sm:p-6 xl:sticky xl:top-32">
        <h2 id="impression-h" className="text-heading-sm text-ink">
          Clinical impression
        </h2>
        <p className="mt-1 text-body-md text-muted">Your own assessment of {name}. Nothing here is generated.</p>
        <div className="mt-5 space-y-4">
          <TextArea
            label="Clinician documented - not filled from any score"
            rows={7}
            value={impression}
            error={impressionError}
            onChange={(e) => {
              setImpression(e.target.value)
              setImpressionError(undefined)
              setImpressionMsg(undefined)
            }}
          />
          <Button variant="secondary" onClick={saveImpression} fullWidth>
            Save impression
          </Button>
          <LiveSlot>
            <InlineStatus>{impressionMsg}</InlineStatus>
          </LiveSlot>
          {cl.impression && cl.impressionSaved ? (
            <SourceLabel kind="clinician" name={`${CLINICIAN.name} · ${cl.impressionSaved}`} />
          ) : null}
        </div>
      </section>

      <CompareSourceDialog open={compare} onClose={() => setCompare(false)} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Compare with source: the original answers, verbatim                  */
/* ------------------------------------------------------------------ */

function SourceBlock({ title, source, children }: { title: string; source: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 border-b border-border pb-6 last:border-b-0 last:pb-0">
      <div className="space-y-1">
        <h3 className="text-label text-ink">{title}</h3>
        {source}
      </div>
      {children}
    </section>
  )
}

function Pairs({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_minmax(0,1fr)]">
      {items.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-body-md text-muted">{k}</dt>
          <dd className="-mt-1.5 text-body-md text-ink sm:mt-0">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function CompareSourceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useDemo()
  const { fullName, helper } = usePeople()
  const c = state.checkIn
  const o = state.observations
  const a = state.assessment
  const helperName = `${helper.firstName} ${helper.lastName}`
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Compare with source"
      description="The original answers exactly as shared in the visit packet. Nothing here has been edited."
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <div className="space-y-6">
        <SourceBlock
          title="Care check-in"
          source={
            <p className="text-body-md text-muted">
              <SourceLabel kind="patient" name={`${fullName}, with help from ${helperName}`} />
              {c.savedAt ? <span> · Saved {c.savedAt}</span> : null}
            </p>
          }
        >
          {state.booking.share.checkIn && c.status === 'saved' ? (
            <Pairs
              items={[
                ['Reason for care', c.careContext ? (CARE_CONTEXT_LABELS[c.careContext] ?? c.careContext) : 'Not recorded'],
                ['What has changed', concernText(c.concerns)],
                ['When it started', onsetText(c.onset)],
                ['Everyday tasks harder', yesNo(c.dailyTasks)],
                ['Sudden change', yesNo(c.suddenChange)],
                ['In their own words', c.ownWords ? `“${c.ownWords}”` : 'Not recorded'],
                ['Hearing and vision', c.hearingVisionSupport.length ? c.hearingVisionSupport.join(', ') : 'Not recorded'],
              ]}
            />
          ) : (
            <p className="text-body-md text-muted">Not shared with this clinic.</p>
          )}
        </SourceBlock>

        <SourceBlock
          title="Family observations"
          source={
            <p className="text-body-md text-muted">
              <SourceLabel kind="care-partner" name={`${helperName} (${helper.relationship.toLowerCase()})`} />
              {o.savedAt ? <span> · Saved {o.savedAt}</span> : null}
            </p>
          }
        >
          {state.booking.share.observations && o.status === 'saved' ? (
            <Pairs
              items={[
                ['Changes noticed', o.items.length ? o.items.join('; ') : 'Not recorded'],
                ['When it started', o.onset ?? 'Not recorded'],
                ['Notes', o.notes ? `“${o.notes}”` : 'Not recorded'],
              ]}
            />
          ) : (
            <p className="text-body-md text-muted">Not shared with this clinic.</p>
          )}
        </SourceBlock>

        <SourceBlock title="Assessment preview" source={<SourceLabel kind="system" name="Assessment preview" />}>
          <Pairs
            items={[
              [
                'Completion',
                a.status === 'completed' ? 'Demo completion' : a.status === 'interrupted' ? 'Interrupted' : 'Not completed',
              ],
              ['Date', a.completedAt ?? 'Not recorded'],
              ['Score', 'None - prototype'],
            ]}
          />
        </SourceBlock>

        <SourceBlock title="Reports added by the family" source={<p className="text-body-md text-muted">Not yet verified by the clinic</p>}>
          {state.uploads.length && state.booking.share.uploads ? (
            <ul className="space-y-1 text-body-md text-ink">
              {state.uploads.map((u) => (
                <li key={u.id} className="break-words">
                  {u.name} <span className="text-muted">· added {u.addedAt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-md text-muted">No reports added yet.</p>
          )}
        </SourceBlock>
      </div>
    </Dialog>
  )
}

/**
 * Option lists and small helpers shared by onboarding, check-in, family
 * observations and the assessment preview. Labels follow PATIENT.md and
 * PATIENT-ONE-STEP.md wording; nothing here is a clinical instrument.
 */
import type { CareContext, CheckInState, YesNoUnsure } from '@/demo/types'

export const LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Other'].map((l) => ({
  value: l,
  label: l,
}))

export const RELATIONSHIPS = [
  'Daughter',
  'Son',
  'Spouse or partner',
  'Sister or brother',
  'Other relative',
  'Friend',
  'Other',
].map((r) => ({ value: r, label: r }))

export const SEX_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'intersex', label: 'Intersex' },
  { value: 'prefer-not', label: 'Prefer not to say' },
] as const

export const CARE_CONTEXT_LABELS: Record<CareContext, string> = {
  'new-concern': 'A new concern',
  'existing-care': 'Already receiving care for memory or thinking',
  'prescribed-test': 'Arranging a test a clinician prescribed',
}

export const YES_NO_LABELS: Record<YesNoUnsure, string> = {
  yes: 'Yes',
  no: 'No',
  'not-sure': 'Not sure',
}

/** "Would … need help seeing, hearing or using the screen?" (PATIENT-ONE-STEP § 2). */
export const SUPPORT_OPTIONS = ['No', 'Seeing', 'Hearing', 'Hand movement or touch', 'Not sure'] as const

/** Map any saved wording (e.g. a preset's "Uses reading glasses") onto the option list. */
export function normalizeSupport(values: string[]): string[] {
  const out = new Set<string>()
  for (const v of values) {
    if ((SUPPORT_OPTIONS as readonly string[]).includes(v)) out.add(v)
    else if (/glass|see|sight|vision/i.test(v)) out.add('Seeing')
    else if (/hear/i.test(v)) out.add('Hearing')
    else if (/hand|touch|move/i.test(v)) out.add('Hand movement or touch')
  }
  return [...out]
}

export const OBSERVATION_ITEMS = [
  'Repeats the same question within a short time',
  'Misplaces everyday items',
  'Hesitates with familiar appliances or tasks',
  'Needs more help with money or medicines',
  'Gets lost on familiar routes',
  'Changes in mood or interest',
  'None of these',
] as const

export const OBSERVATION_ONSETS = [
  'In the last few weeks',
  'Over the last few months',
  'About a year ago',
  'More than a year ago',
  'Not sure',
].map((o) => ({ value: o, label: o }))

/** "Asha Devi Rao" → { firstName: "Asha", lastName: "Devi Rao" }. No forced name structure in the UI. */
export function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
}

export function joinName(p: { firstName: string; lastName: string }) {
  return [p.firstName, p.lastName].filter(Boolean).join(' ')
}

/** Which check-in step should a returning person resume at? */
export type CheckInView = '1' | '2' | '3' | '4' | 'review' | 'saved'

export function concernChosen(c: CheckInState) {
  return c.concerns.length > 0 && !c.concerns.includes('none')
}

export function resumeView(c: CheckInState): CheckInView {
  if (c.status === 'saved') return 'review'
  if (!c.careContext || c.careContext !== 'new-concern') return '1'
  if (!c.concerns.length) return '2'
  if (concernChosen(c) && (!c.onset || !c.dailyTasks)) return '2'
  if (concernChosen(c) && !c.suddenChange) return '3'
  if (!c.hearingVisionSupport.length) return '4'
  return 'review'
}

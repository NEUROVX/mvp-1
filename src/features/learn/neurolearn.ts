/**
 * NeuroLearn scripted matcher (demo). Answers are pre-written, general and
 * educational (DESIGN.md › NeuroLearn; PATIENT.md › NeuroLearn). Nothing is
 * generated. NeuroLearn never decides which test a person needs, never
 * diagnoses, prescribes or stages, and urgent language leaves ordinary chat.
 */
import type { SourceId } from './sources'

export type AnswerId =
  | 'memory-appointment'
  | 'assessment-measures'
  | 'preparing-questions'
  | 'which-test'
  | 'blood-biomarkers'
  | 'not-yet-reviewed'
  | 'caregiver-support'
  | 'limits'

export interface PreparedAnswer {
  id: AnswerId
  /** Short answer first. */
  short: string
  /** Optional further detail, behind "More detail". */
  detail: string[]
  sources: SourceId[]
  /** Shown instead of a source list when there is no suitable source. */
  sourcesNote?: string
  /** A related guide, by slug. */
  articleSlug?: string
  /** A better-worded question to save for the clinician. */
  suggestedQuestion?: string
}

export type NeuroLearnResponse =
  | { kind: 'answer'; answer: PreparedAnswer }
  | { kind: 'fallback' }
  | { kind: 'urgent' }

export const STARTERS = [
  'What happens at a memory appointment?',
  'What does a cognitive assessment measure?',
  'How can I prepare questions for my clinician?',
] as const

export const ANSWERS: Record<AnswerId, PreparedAnswer> = {
  'memory-appointment': {
    id: 'memory-appointment',
    short:
      'A memory appointment is a conversation with a clinician about changes in memory and thinking. They usually ask what has changed, when it started and how it affects everyday life.',
    detail: [
      'It often includes questions about general health, medicines, sleep and mood, a physical examination, and sometimes a short assessment of memory and thinking.',
      'With the person’s agreement, a family member who knows them well may be asked what they have noticed.',
      'One appointment rarely gives every answer. The clinician may suggest tests or a follow-up visit.',
    ],
    sources: ['detecd'],
    articleSlug: 'preparing-for-a-memory-appointment',
  },
  'assessment-measures': {
    id: 'assessment-measures',
    short:
      'A cognitive assessment looks at areas of thinking such as memory, attention, language and planning. It gives a clinician one piece of information. It does not diagnose a condition on its own.',
    detail: [
      'Each assessment is given and scored in a set way, so results can be compared fairly.',
      'Tiredness, illness, worry, hearing or vision difficulties and language can all affect how someone does. Tell the clinician about these.',
      'If an assessment cannot be completed, that is not a result. A clinician can arrange another approach, such as an assisted assessment.',
    ],
    sources: ['detecd', 'osu-self-assessment'],
    articleSlug: 'understanding-cognitive-assessments',
  },
  'preparing-questions': {
    id: 'preparing-questions',
    short:
      'Write down what you want to know before the visit, starting with what matters most. Keep each question short, and bring the list with you.',
    detail: [
      'Useful questions include: What could be causing these changes? Do I need any tests? When will we talk about the results? Who do I contact if things change?',
      'Note examples of the changes, with rough dates, and bring a list of all medicines.',
      'You can save questions here. They stay in your list for the visit.',
    ],
    sources: [],
    sourcesNote: 'This is general advice about preparing for appointments. It does not rely on a clinical source.',
    articleSlug: 'preparing-for-a-memory-appointment',
  },
  'which-test': {
    id: 'which-test',
    short:
      'NeuroLearn can’t tell you which test you need. That depends on your history and an examination, so a clinician decides.',
    detail: [
      'In general, an evaluation of memory concerns may include a conversation, an examination, a short assessment of thinking, and sometimes blood tests or brain imaging.',
      'Some blood tests look for common contributors that can often be addressed, such as low vitamin levels. Other tests, such as specific blood biomarker tests or scans, answer narrower questions. A clinician chooses them for a reason.',
      'A good next step is to save this question and ask your clinician at the visit.',
    ],
    sources: ['detecd', 'nia-biomarkers'],
    suggestedQuestion: 'Which tests do you recommend for me, and why?',
  },
  'blood-biomarkers': {
    id: 'blood-biomarkers',
    short:
      'Blood biomarker tests measure specific proteins in the blood that are linked with changes in the brain. They can support a clinician’s assessment of someone who has symptoms. They do not diagnose a condition on their own.',
    detail: [
      'They are not screening tests for people without symptoms.',
      'Different tests measure different things and have different intended uses. A clinician decides whether one is appropriate and reads the result with the person’s history, an examination and other findings.',
      'Results can take time to come back, and usually need a follow-up conversation.',
    ],
    sources: ['nia-biomarkers', 'bbm-guideline'],
  },
  'not-yet-reviewed': {
    id: 'not-yet-reviewed',
    short:
      '“Not yet reviewed” means a clinician has not looked at this information yet. It does not mean something is wrong, and it is not an all-clear either.',
    detail: [
      'In NeuroVX, a report being released by the lab, being delivered to your care team and being reviewed by your clinician are separate steps.',
      'When your clinician reviews it, you will see their name and the date.',
      'If you have questions while you wait, save them for your clinician.',
    ],
    sources: [],
    sourcesNote: 'This explains how NeuroVX labels information. It does not rely on a clinical source.',
  },
  'caregiver-support': {
    id: 'caregiver-support',
    short:
      'Supporting someone with memory changes often works best with steady routines, clear and respectful communication, and support for yourself too.',
    detail: [
      'Keep daily routines regular, and keep important items in the same place.',
      'Speak to the person directly, one question at a time, and allow time to answer.',
      'Share tasks with others and take breaks. Caring is demanding.',
    ],
    sources: [],
    sourcesNote: 'Sources will be added after clinical review.',
    articleSlug: 'supporting-someone-at-home',
  },
  limits: {
    id: 'limits',
    short:
      'NeuroLearn can’t say whether someone has a condition, and it can’t recommend, start or change medicines. Those decisions need a clinician who knows the person’s history.',
    detail: [
      'NeuroLearn explains general topics, such as what happens at an appointment or what a test is for.',
      'NeuroLearn cannot see anyone’s records or reports. The clinician who reviews a report can explain what it means for that person.',
      'If this question matters to you, save it and ask your clinician. It will be waiting in your list for the visit.',
    ],
    sources: [],
    sourcesNote: 'This explains what NeuroLearn can and cannot do. It does not rely on a clinical source.',
  },
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

/**
 * Urgent language exits ordinary chat. Deliberately broad: a false positive
 * shows safety guidance; a false negative could delay help.
 */
const URGENT: RegExp[] = [
  /\bsudden(ly)?\b/,
  /\bstroke\b/,
  /\b(can'?t|cannot|can not|unable to|not able to) (speak|talk|move|breathe|wake)\b/,
  /\bslurr/,
  /\bweak(ness)?\b/,
  /\bnumb(ness)?\b/,
  /\bcollaps/,
  /\bseizure|\bconvuls/,
  /\bunconscious|\bpassed out|\bfaint(ed|ing)?\b/,
  /\bemergency\b/,
  /\bchest pain\b/,
  /\bsuicid/,
  /\bself[- ]?harm/,
  /\b(kill|harm|hurt)(ing)? (my|him|her|them|your)sel(f|ves)\b/,
  /\bend (my|his|her|their) life\b/,
]

const RULES: Array<{ id: AnswerId; patterns: RegExp[] }> = [
  {
    id: 'which-test',
    patterns: [
      /\bwhich tests?\b/,
      /\bwhat tests? (should|do|would|will)\b/,
      /\bshould (i|we|she|he|they|my \w+) (get|have|take|do|book)\b/,
      /\b(need|get) (a |any )?(test|tests|scan)\b/,
      /\bbest test\b/,
    ],
  },
  { id: 'blood-biomarkers', patterns: [/\bbiomarker/, /\bblood tests?\b/, /\bplasma\b/, /\bamyloid\b|\bp-?tau\b|\btau\b/] },
  {
    id: 'assessment-measures',
    patterns: [/\bassessments?\b/, /\bcognitive (test|screen)/, /\bmemory test/, /\bmeasures?\b/, /\bwhat does (this|the|a) test (show|check)\b/],
  },
  {
    id: 'memory-appointment',
    patterns: [/\bappointment\b/, /\bmemory (clinic|visit)\b/, /\bfirst visit\b/, /\b(see|seeing|visit) (a |the )?(clinician|doctor|neurologist|specialist)\b/],
  },
  { id: 'preparing-questions', patterns: [/\bquestions?\b/, /\bprepar(e|ing)\b/, /\bwhat (should|to) (i |we )?ask\b/] },
  { id: 'not-yet-reviewed', patterns: [/\bnot (yet )?reviewed\b/, /\bunreviewed\b/, /\breview(ed)? mean/, /\bawaiting review\b/] },
  {
    id: 'caregiver-support',
    patterns: [
      /\bcare ?givers?\b|\bcarers?\b|\bcare partners?\b/,
      /\bsupport(ing)? (someone|my|a|him|her|them)\b/,
      /\bat home\b/,
      /\blook(ing)? after\b/,
      /\broutines?\b/,
    ],
  },
  {
    id: 'limits',
    patterns: [
      /\bdiagnos/,
      /\b(do|does) (i|she|he|they|my \w+) have\b/,
      /\bmedicines?\b|\bmedications?\b|\bdose\b|\bdrugs?\b|\bprescri/,
      /\btreatment\b|\bcure\b/,
      /\bstage\b/,
      /\b(my|her|his|their|mum'?s|mom'?s|mother'?s|father'?s|dad'?s) (report|result|results|score)\b/,
    ],
  },
]

function normalise(text: string) {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()
}

export function isUrgent(text: string) {
  const t = normalise(text)
  return URGENT.some((re) => re.test(t))
}

/** Pick the prepared answer with the most matching patterns. Ties go to the earlier rule. */
export function respond(question: string): NeuroLearnResponse {
  const t = normalise(question)
  if (URGENT.some((re) => re.test(t))) return { kind: 'urgent' }
  let best: { id: AnswerId; score: number } | null = null
  for (const rule of RULES) {
    const score = rule.patterns.filter((re) => re.test(t)).length
    if (score > 0 && (!best || score > best.score)) best = { id: rule.id, score }
  }
  return best ? { kind: 'answer', answer: ANSWERS[best.id] } : { kind: 'fallback' }
}

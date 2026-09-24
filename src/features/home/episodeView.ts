/**
 * Small, pure view helpers for patient Home and My care. They read the shared
 * episode (stage + fixtures) and never invent state of their own.
 */
import { hasReached } from '@/demo/episode'
import { TIMELINE } from '@/demo/fixtures'
import type { EpisodeStage, TimelineEvent } from '@/demo/types'

/** The visit has not happened yet: stages before the clinician's order, excluding existing care. */
export function isBeforeVisit(stage: EpisodeStage) {
  return !hasReached(stage, 'tests-requested') && stage !== 'existing-care'
}

/** The most recent timeline event that exists at this stage (for a single "Latest update" row). */
export function latestUpdate(stage: EpisodeStage): TimelineEvent | undefined {
  const reached = TIMELINE.filter((e) => hasReached(stage, e.from))
  return reached[reached.length - 1]
}

/**
 * The one learning suggestion on Home ("Understand your next step"),
 * matched to where the person is. Always one guide and one NeuroLearn question.
 */
export function learnSuggestionFor(stage: EpisodeStage): { slug: string; question: string } {
  switch (stage) {
    case 'assessment-ready':
      return { slug: 'understanding-cognitive-assessments', question: 'What does a cognitive assessment measure?' }
    case 'tests-requested':
    case 'collection-arranged':
      return { slug: 'supporting-someone-at-home', question: 'What are blood biomarker tests?' }
    case 'report-released':
    case 'delivery-problem':
      return { slug: 'supporting-someone-at-home', question: 'What does “not yet reviewed” mean?' }
    case 'reviewed':
    case 'follow-up-due':
    case 'existing-care':
    case 'no-task':
      return { slug: 'supporting-someone-at-home', question: 'How can I prepare questions for my clinician?' }
    default:
      return { slug: 'preparing-for-a-memory-appointment', question: 'What happens at a memory appointment?' }
  }
}

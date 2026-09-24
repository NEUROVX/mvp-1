/**
 * Learn is rendered in two contexts: the public site (/learn…) and the patient
 * workspace (/app/learn…). Links always stay inside the current context.
 */
export type LearnContext = 'public' | 'app'

export type LearnView = 'guides' | 'updates' | 'ask' | 'saved'

export const LEARN_VIEWS: LearnView[] = ['guides', 'updates', 'ask', 'saved']

export function learnBase(context: LearnContext) {
  return context === 'app' ? '/app/learn' : '/learn'
}

export function learnViewPath(context: LearnContext, view: LearnView) {
  return view === 'guides' ? learnBase(context) : `${learnBase(context)}?view=${view}`
}

export function articlePath(context: LearnContext, slug: string) {
  return `${learnBase(context)}/articles/${slug}`
}

export function neurolearnPath(context: LearnContext, question?: string) {
  const base = `${learnBase(context)}/neurolearn`
  return question ? `${base}?q=${encodeURIComponent(question)}` : base
}

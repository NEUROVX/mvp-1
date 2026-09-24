/**
 * Demo store. One fictional care episode shared by every workspace, so an
 * action in the clinician or lab workspace changes what the patient sees.
 *
 * Persistence: sessionStorage only (cleared when the tab closes). Data is
 * synthetic; nothing leaves the browser.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { carelineFor, INITIAL_STATE, nextStepFor, presetFor, STAGE_META } from './episode'
import type { DemoState, EpisodeStage, Persona } from './types'

const KEY = 'nvx-demo-v1'

function loadStored(): DemoState {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw) as DemoState
    return parsed?.version === 1 ? { ...INITIAL_STATE, ...parsed } : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

/**
 * Deep links for presenters and QA: `?demo=<stage>&as=<persona>` jumps the
 * fictional episode on load, e.g. /app?demo=report-released&as=patient
 */
function load(): DemoState {
  let s = loadStored()
  try {
    const q = new URLSearchParams(window.location.search)
    const stage = q.get('demo') as EpisodeStage | null
    const as = q.get('as') as Persona | null
    if (stage && stage in STAGE_META) s = presetFor(stage, s)
    if (as && ['care-partner', 'patient', 'limited-helper'].includes(as)) s = { ...s, persona: as }
  } catch {
    /* ignore malformed query */
  }
  return s
}

type Patch = Partial<DemoState> | ((s: DemoState) => DemoState)

interface DemoContextValue {
  state: DemoState
  /** Shallow-merge a patch, or pass an updater for nested changes. */
  set: (patch: Patch) => void
  /** Move the episode to a stage without touching other data. */
  setStage: (stage: EpisodeStage) => void
  /** Jump to a stage with a complete, consistent fixture state. */
  jumpTo: (stage: EpisodeStage) => void
  setPersona: (persona: Persona) => void
  reset: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(load)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: the demo still works in memory */
    }
  }, [state])

  const set = useCallback((patch: Patch) => {
    setState((s) => (typeof patch === 'function' ? patch(s) : { ...s, ...patch }))
  }, [])
  const setStage = useCallback((stage: EpisodeStage) => setState((s) => ({ ...s, stage })), [])
  const jumpTo = useCallback((stage: EpisodeStage) => setState((s) => presetFor(stage, s)), [])
  const setPersona = useCallback((persona: Persona) => setState((s) => ({ ...s, persona })), [])
  const reset = useCallback(() => setState(INITIAL_STATE), [])

  const value = useMemo(
    () => ({ state, set, setStage, jumpTo, setPersona, reset }),
    [state, set, setStage, jumpTo, setPersona, reset],
  )
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>')
  return ctx
}

/** Names and the signed-in context line, used by every private screen. */
export function usePeople() {
  const { state } = useDemo()
  const p = state.patient
  const h = state.helper
  const persona = state.persona
  const possessive = `${p.firstName}’s`
  const signedInAs =
    persona === 'patient'
      ? `Signed in as ${p.firstName}`
      : persona === 'care-partner'
        ? `Signed in as ${h.firstName} - care partner`
        : 'Record access not yet arranged'
  const careTitle = persona === 'limited-helper' ? `Helping ${p.firstName}` : `${possessive} care`
  return {
    patient: p,
    helper: h,
    persona,
    /** "Asha" */
    name: p.firstName,
    /** "Asha Rao" */
    fullName: `${p.firstName} ${p.lastName}`,
    /** "Asha’s" */
    possessive,
    /** "Asha's care" or "Helping Asha" */
    careTitle,
    /** "Signed in as Meera - care partner" */
    signedInAs,
    /** Second-person when the patient is signed in, third-person otherwise. */
    you: persona === 'patient' ? 'you' : p.firstName,
    your: persona === 'patient' ? 'your' : possessive,
    isHelper: persona !== 'patient',
    hasRecordAccess: persona !== 'limited-helper',
  }
}

/** Current episode view-model: next step + Careline. */
export function useEpisode() {
  const { state } = useDemo()
  const { name } = usePeople()
  return {
    stage: state.stage,
    next: nextStepFor(state.stage, name, state.booking, state.labBooking),
    careline: carelineFor(state.stage),
  }
}

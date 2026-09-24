/**
 * Small sessionStorage helpers for per-tab conveniences (saved articles, the
 * NeuroLearn conversation, demo support requests). Everything is cleared when
 * the tab closes. Reads and writes never throw: if storage is unavailable the
 * page still works in memory.
 */
import { useEffect, useState } from 'react'

export function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

/** useState that mirrors its value into sessionStorage under `key`. */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readSession(key, initial))
  useEffect(() => writeSession(key, value), [key, value])
  return [value, setValue] as const
}

const SAVED_ARTICLES_KEY = 'nvx-saved-articles-v1'

/** Saved article slugs for this browser tab. */
export function useSavedArticles() {
  const [saved, setSaved] = useSessionState<string[]>(SAVED_ARTICLES_KEY, [])
  const isSaved = (slug: string) => saved.includes(slug)
  const toggle = (slug: string) => {
    const next = !saved.includes(slug)
    setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]))
    return next
  }
  const remove = (slug: string) => setSaved((s) => s.filter((x) => x !== slug))
  return { saved, isSaved, toggle, remove }
}

/** True while the viewport is at least `px` wide. Used to swap tabs for a view selector on mobile. */
export function useMinWidth(px: number) {
  const query = `(min-width: ${px}px)`
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : true)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

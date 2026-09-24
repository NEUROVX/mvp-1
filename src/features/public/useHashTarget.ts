import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Lazy-loaded pages mount after the layout's route-focus effect has run, so a
 * deep link such as /partners#labs can miss its target on first load. Once the
 * page has mounted, bring the hash target into view and move focus to it.
 */
export function useHashTarget() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!el) return
    el.scrollIntoView()
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
    // Run once per mount; later hash changes are handled by the layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

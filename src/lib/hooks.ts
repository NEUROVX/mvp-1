import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/** Sets the document title as "<title> · NeuroVX". Call once per page. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · NeuroVX` : 'NeuroVX - Brain care. Connected.'
  }, [title])
}

/**
 * On route change: scroll to top (or to the hash target) and move focus to the
 * main landmark so screen-reader users hear the new page. Used by every layout.
 */
export function useRouteFocus() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      if (!hash) return
    }
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
        return
      }
    }
    window.scrollTo(0, 0)
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
  }, [pathname, hash])
}

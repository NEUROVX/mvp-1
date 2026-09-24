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
      // Pages are lazy-loaded, so the target may not exist yet: retry briefly.
      const id = decodeURIComponent(hash.slice(1))
      let frame = 0
      let tries = 0
      const seek = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView()
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })
        } else if (tries++ < 60) {
          frame = requestAnimationFrame(seek)
        }
      }
      seek()
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
  }, [pathname, hash])
}

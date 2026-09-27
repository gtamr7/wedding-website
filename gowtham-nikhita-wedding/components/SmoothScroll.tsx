'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

declare global {
  interface Window { smoothScroll?: Lenis }
}

// Smooths mouse-wheel scrolling. Chrome on Windows moves the page ~100px per
// wheel notch, which reads as choppy on a high-refresh screen even when every
// frame renders on time. Lenis eases between notches instead. Touch and
// trackpad scrolling stay native, and reduced-motion users get plain
// scrolling. Full-screen overlays opt out with data-lenis-prevent.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 })
    window.smoothScroll = lenis

    // Same-page section links are written "/#story", which Lenis's own
    // anchor handling ignores. Capture phase, so this runs before Next's
    // Link and its preventDefault stops Link doing an instant jump.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!target) return
      e.preventDefault()
      history.pushState(null, '', url.hash)
      // A whole-pixel target. Sections can start at fractional offsets while
      // the browser rounds scroll positions, and Lenis then never settles:
      // it keeps chasing the fraction and overrides every other scroll call.
      lenis.scrollTo(Math.round(target.getBoundingClientRect().top + window.scrollY))
    }
    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      lenis.destroy()
      delete window.smoothScroll
    }
  }, [])

  return null
}

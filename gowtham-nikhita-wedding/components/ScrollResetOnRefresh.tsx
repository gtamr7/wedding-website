'use client'

import { useEffect } from 'react'

export default function ScrollResetOnRefresh() {
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav?.type === 'reload') {
      window.history.replaceState(null, '', '/')
      window.scrollTo({ top: 0 })
    }
  }, [])
  return null
}

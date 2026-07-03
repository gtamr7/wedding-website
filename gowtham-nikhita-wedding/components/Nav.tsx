'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Our Story', href: '/#story' },
  { label: 'Schedule', href: '/#schedule' },
  { label: 'Travel', href: '/#travel' },
  { label: 'Registry', href: '/#registry' },
  { label: 'RSVP', href: '/rsvp' },
  { label: 'Photo Line-Up', href: '/photos' },
  { label: 'The Bets', href: '/bets' },
  { label: 'Guestbook', href: '/guestbook' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navBg = scrolled || !isHome
    ? 'bg-[#3A4A24]/97 backdrop-blur-sm shadow-sm border-b border-gold/15'
    : 'bg-transparent'

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="font-display text-xl lg:text-2xl italic text-gold tracking-wide hover:text-gold-light transition-colors"
          aria-label="Back to top"
        >
          G &amp; N
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-widest uppercase transition-colors duration-200 hover:text-gold text-ivory/80"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 transition-all duration-300 bg-ivory ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 bg-ivory ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 transition-all duration-300 bg-ivory ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#3A4A24]/98 backdrop-blur-sm border-t border-gold/15 overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col py-4 px-6 gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm tracking-widest uppercase text-ivory/80 hover:text-gold py-3 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

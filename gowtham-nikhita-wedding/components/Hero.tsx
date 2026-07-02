'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Countdown from './Countdown'
import TempleSilhouette from './TempleSilhouette'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  // Temple moves up slowly — classic parallax depth
  const templeY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  // Text drifts up slightly faster
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  // Temple fades as you scroll away
  const templeOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#2A3420' }}
      aria-label="Hero"
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2010] via-[#2A3420] to-[#3a4830] pointer-events-none" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          [12, 8], [28, 15], [45, 6], [62, 20], [78, 10], [90, 25],
          [8, 35], [35, 30], [55, 18], [72, 38], [88, 12], [20, 45],
          [48, 40], [65, 28], [82, 42], [5, 55], [30, 52], [58, 48],
          [75, 55], [92, 35], [15, 65], [40, 60], [70, 62],
        ].map(([x, y], i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-light"
            style={{ left: `${x}%`, top: `${y}%`, width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Temple silhouette — parallax layer */}
      <motion.div
        style={{ y: templeY, opacity: templeOpacity }}
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        aria-hidden="true"
      >
        <TempleSilhouette className="w-full h-auto" />
      </motion.div>

      {/* Atmospheric ground glow */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1a2010]/80 to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-7"
      >
        {/* Pre-line */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/60"
        >
          Together with their families
        </motion.p>

        {/* Names */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="font-display text-6xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide drop-shadow-[0_4px_32px_rgba(184,151,42,0.25)]"
        >
          Gowtham
          <span className="block text-2xl sm:text-3xl lg:text-4xl not-italic text-gold/40 my-3 tracking-widest font-light">
            &amp;
          </span>
          Nikhita
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="gold-divider w-32 opacity-50"
        />

        {/* Date & Venue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="space-y-1.5"
        >
          <p className="text-ivory/90 tracking-widest text-sm sm:text-base uppercase">
            February 17, 2027
          </p>
          <p className="text-ivory/40 text-xs sm:text-sm tracking-wider">
            Powel Crosley Estate · Sarasota, Florida
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="font-display text-lg sm:text-2xl italic text-olive-light/70"
        >
          A Tamil &amp; Telugu celebration of love
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-1"
        >
          <Countdown />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/30"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <path d="M2 5L8 11L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  )
}

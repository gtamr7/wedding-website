'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Countdown from './Countdown'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: '100vh' }}
      aria-label="Hero"
    >
      {/* Center bloom so names pop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,0,0.28) 0%, transparent 100%)' }}
      />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-7"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/70"
        >
          Together with their families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="font-display text-6xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide drop-shadow-[0_4px_40px_rgba(184,151,42,0.55)]"
        >
          Gowtham
          <span className="block text-2xl sm:text-3xl lg:text-4xl not-italic text-gold/50 my-3 tracking-widest font-light">
            &amp;
          </span>
          Nikhita
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="gold-divider w-32 opacity-60"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="space-y-1.5"
        >
          <p className="text-ivory/90 tracking-widest text-sm sm:text-base uppercase">
            February 17, 2027
          </p>
          <p className="text-ivory/50 text-xs sm:text-sm tracking-wider">
            Powel Crosley Estate · Sarasota, Florida
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="font-display text-lg sm:text-2xl italic text-gold-light/60"
        >
          A Tamil &amp; Telugu celebration of love
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-1"
        >
          <Countdown />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40"
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

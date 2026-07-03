'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Countdown from './Countdown'
import { SceneSky, SceneMid, SceneFore } from './TempleSilhouette'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  // Three layers at different speeds → real parallax depth
  const skyY  = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])  // slowest
  const midY  = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])  // medium
  const foreY = useTransform(scrollYProgress, [0, 1], ['0%', '48%'])  // fastest
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#020510' }}
      aria-label="Hero"
    >
      {/* Sky — barely moves */}
      <motion.div aria-hidden="true" style={{ y: skyY, position: 'absolute', top: '-15%', left: 0, right: 0, height: '130%' }}>
        <SceneSky className="w-full h-full" />
      </motion.div>

      {/* Bamboo grove + hills — medium speed */}
      <motion.div aria-hidden="true" style={{ y: midY, position: 'absolute', top: '-30%', left: 0, right: 0, height: '160%' }}>
        <SceneMid className="w-full h-full" />
      </motion.div>

      {/* Water + close bamboo + branches — fastest */}
      <motion.div aria-hidden="true" style={{ y: foreY, position: 'absolute', top: '-45%', left: 0, right: 0, height: '190%' }}>
        <SceneFore className="w-full h-full" />
      </motion.div>

      {/* Vignette so text pops */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,5,16,0.5) 0%, rgba(2,5,16,0.1) 45%, rgba(2,5,16,0.45) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 40% at 50% 44%, rgba(2,5,14,0.65) 0%, transparent 100%)' }} />

      {/* Text content — drifts up faster than the background */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-7"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/60"
        >
          Together with their families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="font-display text-6xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide drop-shadow-[0_4px_32px_rgba(184,151,42,0.35)]"
        >
          Gowtham
          <span className="block text-2xl sm:text-3xl lg:text-4xl not-italic text-gold/40 my-3 tracking-widest font-light">
            &amp;
          </span>
          Nikhita
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="gold-divider w-32 opacity-50"
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
          <p className="text-ivory/40 text-xs sm:text-sm tracking-wider">
            Powel Crosley Estate · Sarasota, Florida
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="font-display text-lg sm:text-2xl italic text-olive-light/70"
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

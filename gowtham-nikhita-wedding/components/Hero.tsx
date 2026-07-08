'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Countdown from './Countdown'
import FloatingPetals from './FloatingPetals'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  // Photo moves slower than the viewport scroll — classic parallax feel
  const photoY  = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const bgGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh' }}
      aria-label="Hero"
    >
      {/* Background photo — oversized vertically so parallax travel never shows an edge */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          style={{ y: photoY }}
          className="absolute -top-[25%] -bottom-[25%] left-0 right-0"
        >
          <Image
            src="/gallery/IMG_0563.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
            priority
          />
        </motion.div>
      </div>

      {/* Dark olive overlay — readable text without killing the photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(160deg, rgba(28,36,16,0.58) 0%, rgba(22,30,12,0.50) 50%, rgba(28,36,16,0.62) 100%)' }}
        aria-hidden="true"
      />

      {/* Parallax gold glow */}
      <motion.div
        style={{ y: bgGlowY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(184,151,42,0.12) 0%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 30% 25% at 30% 60%, rgba(184,151,42,0.06) 0%, transparent 100%)' }} />
      </motion.div>

      <FloatingPetals />

      {/* Centered text — no side photos */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <motion.div
          style={{ y: textY }}
          className="max-w-sm sm:max-w-md lg:max-w-xl text-center flex flex-col items-center gap-5 sm:gap-7 py-20"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/60"
          >
            together.forever.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="font-display text-5xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide"
            style={{ textShadow: '0 4px 40px rgba(184,151,42,0.4), 0 2px 16px rgba(0,0,0,0.5)' }}
          >
            Gowtham
            <span className="block text-xl sm:text-2xl lg:text-4xl not-italic text-gold/40 my-2 sm:my-3 tracking-widest font-light">
              &amp;
            </span>
            Nikhita
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="gold-divider w-28 opacity-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="space-y-2"
          >
            <p className="font-display italic text-gold-light/90 text-lg sm:text-xl tracking-wide">
              February 17–18, 2027
            </p>
            <p className="text-ivory/60 text-xs sm:text-sm tracking-widest uppercase">
              Powel Crosley Estate · Sarasota, Florida
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Countdown />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/25"
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

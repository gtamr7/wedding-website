'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Countdown from './Countdown'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const leftPhotoY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%'])
  const rightPhotoY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #182510 0%, #253119 50%, #192610 100%)',
      }}
      aria-label="Hero"
    >
      {/* Subtle gold bloom in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(184,151,42,0.07) 0%, transparent 100%)' }}
      />

      {/* Left floating photo */}
      <motion.div
        style={{ y: leftPhotoY }}
        className="hidden lg:block absolute left-8 xl:left-20 top-1/2 -translate-y-[55%] w-52 xl:w-60"
        aria-hidden="true"
      >
        <div className="relative h-72 xl:h-80 -rotate-6 rounded-xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
          <Image src="/gallery/IMG_9641.jpg" alt="" fill className="object-cover" sizes="240px" />
          <div className="absolute inset-0 bg-olive-dark/10" />
        </div>
      </motion.div>

      {/* Right floating photo */}
      <motion.div
        style={{ y: rightPhotoY }}
        className="hidden lg:block absolute right-8 xl:right-20 top-1/2 -translate-y-[45%] w-52 xl:w-60"
        aria-hidden="true"
      >
        <div className="relative h-72 xl:h-80 rotate-6 rounded-xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
          <Image src="/gallery/IMG_indian_attire.jpg" alt="" fill className="object-cover" sizes="240px" />
          <div className="absolute inset-0 bg-olive-dark/10" />
        </div>
      </motion.div>

      {/* Center text */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-6 max-w-xl mx-auto flex flex-col items-center gap-7"
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
          className="font-display text-6xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide"
          style={{ textShadow: '0 4px 40px rgba(184,151,42,0.25)' }}
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
          <p className="text-ivory/85 tracking-widest text-sm sm:text-base uppercase">
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
          className="font-display text-lg sm:text-xl italic text-olive-mid/90"
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

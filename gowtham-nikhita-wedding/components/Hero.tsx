'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Countdown from './Countdown'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const textY       = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
  const leftPhotoY  = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const rightPhotoY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #3D4E26 0%, #4A5C2F 45%, #3A4A24 100%)',
      }}
      aria-label="Hero"
    >
      {/* Subtle gold center bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(184,151,42,0.08) 0%, transparent 100%)' }}
      />

      {/* Three-column layout: photo — text — photo */}
      <div className="flex items-center justify-center min-h-screen gap-0 sm:gap-8 lg:gap-16 px-4">

        {/* Left photo */}
        <motion.div
          style={{ y: leftPhotoY }}
          className="shrink-0 w-14 sm:w-44 lg:w-56"
          aria-hidden="true"
        >
          <div
            className="relative rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 h-[110px] sm:h-[200px]"
            style={{ transform: 'rotate(-6deg)' }}
          >
            <Image
              src="/gallery/IMG_0400.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 176px, 224px"
              quality={90}
              priority
            />
          </div>
        </motion.div>

        {/* Center text */}
        <motion.div
          style={{ y: textY }}
          className="flex-1 max-w-sm sm:max-w-md lg:max-w-xl text-center flex flex-col items-center gap-5 sm:gap-7 py-20"
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
            style={{ textShadow: '0 4px 32px rgba(184,151,42,0.3)' }}
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
            className="space-y-1.5"
          >
            <p className="text-ivory/85 tracking-widest text-xs sm:text-sm uppercase">
              February 17, 2027
            </p>
            <p className="text-ivory/40 text-[10px] sm:text-xs tracking-wider">
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

        {/* Right photo */}
        <motion.div
          style={{ y: rightPhotoY }}
          className="shrink-0 w-14 sm:w-44 lg:w-56"
          aria-hidden="true"
        >
          <div
            className="relative rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 h-[110px] sm:h-[200px]"
            style={{ transform: 'rotate(6deg)' }}
          >
            <Image
              src="/gallery/IMG_0563.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 176px, 224px"
              quality={90}
              priority
            />
          </div>
        </motion.div>

      </div>

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

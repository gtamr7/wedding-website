'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Countdown from './Countdown'
import FloatingPetals from './FloatingPetals'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const photoY  = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const bgGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: '#111a0a' }}
      aria-label="Hero"
    >
      {/* Background photo */}
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

      {/* Dark olive overlay */}
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

      {/* Text — CSS animations avoid SSR hydration flash while preserving staggered reveal */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <motion.div
          style={{ y: textY }}
          className="max-w-sm sm:max-w-md lg:max-w-xl text-center flex flex-col items-center gap-5 sm:gap-7 py-20"
        >
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold-light/60"
            style={{ animation: 'heroFadeUp 0.8s ease-out 0.1s both' }}
          >
            together.forever.
          </p>

          <h1
            className="font-display text-5xl sm:text-7xl lg:text-9xl italic text-gold leading-none tracking-wide"
            style={{
              textShadow: '0 4px 40px rgba(184,151,42,0.4), 0 2px 16px rgba(0,0,0,0.5)',
              animation: 'heroFadeUp 1s ease-out 0.3s both',
            }}
          >
            Gowtham
            <span className="block text-xl sm:text-2xl lg:text-4xl not-italic text-gold/40 my-2 sm:my-3 tracking-widest font-light">
              &amp;
            </span>
            Nikhita
          </h1>

          <div
            className="gold-divider w-28"
            style={{ animation: 'heroGrowX 0.7s ease-out 0.7s both', transformOrigin: 'center' }}
          />

          <div
            className="space-y-2"
            style={{ animation: 'heroFadeUp 0.8s ease-out 0.9s both' }}
          >
            <p className="font-display italic text-gold-light/90 text-lg sm:text-xl tracking-wide">
              February 17–18, 2027
            </p>
            <p className="text-ivory/60 text-xs sm:text-sm tracking-widest uppercase">
              Powel Crosley Estate · Sarasota, Florida
            </p>
          </div>

          <div style={{ animation: 'heroFadeUp 0.8s ease-out 1.1s both' }}>
            <Countdown />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/25 animate-float" aria-hidden="true">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 5L8 11L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}

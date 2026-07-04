'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Countdown from './Countdown'
import FloatingPetals from './FloatingPetals'

const expandIcon = (
  <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/55 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const bgGlowY     = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
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
      <motion.div
        style={{ y: bgGlowY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(184,151,42,0.10) 0%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 30% 25% at 30% 60%, rgba(184,151,42,0.05) 0%, transparent 100%)' }} />
      </motion.div>

      <FloatingPetals />

      <div className="flex items-center justify-center min-h-screen sm:gap-8 lg:gap-16 px-6 sm:px-4">

        {/* Left photo — desktop only */}
        <motion.div
          style={{ y: leftPhotoY }}
          className="hidden sm:block shrink-0 sm:w-44 lg:w-56"
        >
          <div
            className="relative rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 h-[200px] sm:[transform:rotate(-6deg)] cursor-pointer group"
            onClick={() => setLightbox('/gallery/IMG_0400.jpg')}
          >
            <Image src="/gallery/IMG_0400.jpg" alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 176px, 224px" quality={90} priority />
            {expandIcon}
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

          {/* Mobile-only: two photos below countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="flex sm:hidden gap-4 mt-1"
          >
            <div
              className="w-28 h-40 relative rounded-xl overflow-hidden border border-gold/25 shadow-xl shadow-black/40 cursor-pointer group"
              onClick={() => setLightbox('/gallery/IMG_0400.jpg')}
            >
              <Image src="/gallery/IMG_0400.jpg" alt="" fill className="object-cover" sizes="112px" quality={90} priority />
              {expandIcon}
            </div>
            <div
              className="w-28 h-40 relative rounded-xl overflow-hidden border border-gold/25 shadow-xl shadow-black/40 cursor-pointer group"
              onClick={() => setLightbox('/gallery/IMG_0563.jpg')}
            >
              <Image src="/gallery/IMG_0563.jpg" alt="" fill className="object-cover" sizes="112px" quality={90} priority />
              {expandIcon}
            </div>
          </motion.div>
        </motion.div>

        {/* Right photo — desktop only */}
        <motion.div
          style={{ y: rightPhotoY }}
          className="hidden sm:block shrink-0 sm:w-44 lg:w-56"
        >
          <div
            className="relative rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 h-[200px] sm:[transform:rotate(6deg)] cursor-pointer group"
            onClick={() => setLightbox('/gallery/IMG_0563.jpg')}
          >
            <Image src="/gallery/IMG_0563.jpg" alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 176px, 224px" quality={90} priority />
            {expandIcon}
          </div>
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

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full h-full max-w-4xl max-h-[88vh] mx-6"
              onClick={e => e.stopPropagation()}
            >
              <Image src={lightbox} alt="" fill className="object-contain" sizes="90vw" quality={95} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const photos = [
  '/gallery/IMG_0314.jpg',
  '/gallery/IMG_0334.jpg',
  '/gallery/IMG_0400.jpg',
  '/gallery/IMG_0563.jpg',
  '/gallery/IMG_0388.jpg',
  '/gallery/IMG_0555.jpg',
  '/gallery/IMG_0600.jpg',
  '/gallery/IMG_0649.jpg',
  '/gallery/IMG_0363.jpg',
  '/gallery/IMG_0410.jpg',
  '/gallery/IMG_0473.jpg',
  '/gallery/IMG_indian_attire.jpg',
  '/gallery/IMG_9641.jpg',
  '/gallery/IMG_7335.jpg',
  '/gallery/IMG_couple_restaurant.jpg',
  '/gallery/IMG_0450.jpg',
  '/gallery/IMG_0502.jpg',
]

const N = photos.length

function getOffset(index: number, current: number) {
  let off = index - current
  if (off > N / 2) off -= N
  if (off < -N / 2) off += N
  return off
}

function cardStyle(offset: number) {
  const abs = Math.abs(offset)
  return {
    x: offset * 160,
    scale: abs === 0 ? 1 : abs === 1 ? 0.78 : 0.60,
    opacity: abs === 0 ? 1 : abs === 1 ? 0.62 : 0.28,
    zIndex: abs === 0 ? 10 : abs === 1 ? 6 : 3,
  }
}

export default function PhotoCarousel() {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const touchStartX = useRef<number>(0)

  const prev = () => setCurrent(c => (c - 1 + N) % N)
  const next = () => setCurrent(c => (c + 1) % N)

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) {
        if (e.key === 'ArrowLeft') setLightbox(i => i === null ? null : (i - 1 + N) % N)
        if (e.key === 'ArrowRight') setLightbox(i => i === null ? null : (i + 1) % N)
        if (e.key === 'Escape') setLightbox(null)
      } else {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const visibleCards = photos
    .map((src, i) => ({ src, i, offset: getOffset(i, current) }))
    .filter(c => Math.abs(c.offset) <= 2)
    .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset)) // paint back-to-front

  const lbPrev = () => setLightbox(i => i === null ? null : (i - 1 + N) % N)
  const lbNext = () => setLightbox(i => i === null ? null : (i + 1) % N)

  return (
    <>
      <div className="relative select-none">
        {/* Track */}
        <div
          className="relative h-[300px] sm:h-[400px] overflow-hidden flex items-center justify-center"
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
          }}
        >
          {visibleCards.map(({ src, i, offset }) => {
            const { x, scale, opacity, zIndex } = cardStyle(offset)
            return (
              <motion.div
                key={src}
                animate={{ x, scale, opacity, zIndex }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className="absolute cursor-pointer"
                onClick={() => offset === 0 ? setLightbox(i) : setCurrent(i)}
              >
                <div className="relative w-[170px] sm:w-[220px] h-[240px] sm:h-[300px] rounded-xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 170px, 220px"
                    quality={88}
                  />
                  {/* Expand hint on center card */}
                  {offset === 0 && (
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/40 to-transparent">
                      <span className="text-[10px] tracking-widest uppercase text-ivory/70">tap to expand</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/35 backdrop-blur-sm border border-gold/20 text-ivory hover:bg-black/55 transition-colors z-20"
          aria-label="Previous photo"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/35 backdrop-blur-sm border border-gold/20 text-ivory hover:bg-black/55 transition-colors z-20"
          aria-label="Next photo"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-5 flex-wrap max-w-xs mx-auto">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-5 bg-gold' : 'w-1.5 bg-ivory/25 hover:bg-ivory/45'
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
              {lightbox + 1} / {N}
            </div>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full mx-16"
              onClick={e => e.stopPropagation()}
            >
              <Image src={photos[lightbox]} alt="" fill className="object-contain" sizes="90vw" quality={95} priority />
            </motion.div>

            <button
              onClick={e => { e.stopPropagation(); lbPrev() }}
              className="absolute left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={e => { e.stopPropagation(); lbNext() }}
              className="absolute right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const photos = [
  '/gallery/IMG_0314.jpg',
  '/gallery/IMG_0334.jpg',
  '/gallery/IMG_0400.jpg',
  '/gallery/IMG_0563.jpg',
  '/gallery/IMG_0388.jpg',
  '/gallery/IMG_0410.jpg',
  '/gallery/IMG_0363.jpg',
  '/gallery/IMG_0473.jpg',
  '/gallery/IMG_0555.jpg',
  '/gallery/IMG_0600.jpg',
  '/gallery/IMG_0649.jpg',
  '/gallery/IMG_indian_attire.jpg',
  '/gallery/IMG_9641.jpg',
  '/gallery/IMG_7335.jpg',
  '/gallery/IMG_couple_restaurant.jpg',
  '/gallery/IMG_0450.jpg',
  '/gallery/IMG_0502.jpg',
]

export default function PhotoCarousel() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () => setLightbox(i => i === null ? null : (i - 1 + photos.length) % photos.length)
  const next = () => setLightbox(i => i === null ? null : (i + 1) % photos.length)

  return (
    <>
      {/* Scrollable photo strip */}
      <div
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth -mx-6 px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="shrink-0 snap-center relative rounded-xl overflow-hidden cursor-pointer group border border-gold/20 hover:border-gold/50 transition-colors focus:outline-none"
            style={{ width: 180, height: 240 }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="180px"
              quality={85}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
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
              {lightbox + 1} / {photos.length}
            </div>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full mx-16"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={photos[lightbox]}
                alt=""
                fill
                className="object-contain"
                sizes="90vw"
                quality={95}
                priority
              />
            </motion.div>

            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={e => { e.stopPropagation(); next() }}
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

'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const photos = [
  { src: '/gallery/IMG_0314.jpg', span: 'tall' },
  { src: '/gallery/IMG_0334.jpg', span: 'wide' },
  { src: '/gallery/IMG_0363.jpg', span: 'normal' },
  { src: '/gallery/IMG_0388.jpg', span: 'normal' },
  { src: '/gallery/IMG_0400.jpg', span: 'tall' },
  { src: '/gallery/IMG_0410.jpg', span: 'wide' },
  { src: '/gallery/IMG_0473.jpg', span: 'normal' },
  { src: '/gallery/IMG_0555.jpg', span: 'tall' },
  { src: '/gallery/IMG_0563.jpg', span: 'normal' },
  { src: '/gallery/IMG_0600.jpg', span: 'wide' },
  { src: '/gallery/IMG_0649.jpg', span: 'normal' },
]

function GalleryItem({ photo, index, onClick }: {
  photo: typeof photos[0]
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: 'easeOut' }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg cursor-pointer group ${
        photo.span === 'tall'   ? 'row-span-2' :
        photo.span === 'wide'   ? 'col-span-2' : ''
      }`}
    >
      <div className={`relative w-full ${
        photo.span === 'tall'   ? 'h-[520px]' :
        photo.span === 'wide'   ? 'h-[280px]' : 'h-[260px]'
      }`}>
        <Image
          src={photo.src}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        {/* Expand icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {/* Corner accents on hover */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
}

function Lightbox({ photos, index, onClose, onPrev, onNext }: {
  photos: typeof photos
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/50 text-xs tracking-widest uppercase">
        {index + 1} / {photos.length}
      </div>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-5xl max-h-[85vh] w-full h-full mx-16"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={photos[index].src}
          alt=""
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </motion.div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </motion.div>
  )
}

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = () => setLightboxIndex(i => i === null ? null : (i - 1 + photos.length) % photos.length)
  const next = () => setLightboxIndex(i => i === null ? null : (i + 1) % photos.length)

  return (
    <main className="min-h-screen bg-charcoal">
      {/* Header */}
      <div className="pt-32 pb-14 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs tracking-widest uppercase text-gold mb-3"
        >
          Gowtham &amp; Nikhita
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-display text-5xl sm:text-7xl italic text-ivory"
        >
          Gallery
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="gold-divider w-24 mt-5 mx-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-6 text-ivory/40 text-sm tracking-wide max-w-md mx-auto"
        >
          A collection of our favourite moments together
        </motion.p>
      </div>

      {/* Masonry grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-auto">
          {photos.map((photo, i) => (
            <GalleryItem
              key={photo.src}
              photo={photo}
              index={i}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

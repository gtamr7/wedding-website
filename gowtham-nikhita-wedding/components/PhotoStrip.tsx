'use client'

import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

const CONFIG = [
  { angle: -5, w: 185, h: 230 },
  { angle:  3, w: 215, h: 275 },
  { angle: -3, w: 185, h: 230 },
]

export default function PhotoStrip({ photos }: { photos: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <>
      <div ref={ref} className="flex justify-center items-end gap-4 sm:gap-7 py-8 px-4">
        {photos.slice(0, 3).map((src, i) => {
          const { angle, w, h } = CONFIG[i]
          return (
            <motion.div
              key={src}
              /* Use framer-motion's rotate — don't put rotate in style.transform */
              initial={{ opacity: 0, y: 28, rotate: angle }}
              animate={inView ? { opacity: 1, y: 0, rotate: angle } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
              style={{ width: w, height: h }}
              className="relative shrink-0 cursor-pointer group"
              onClick={() => setLightbox(src)}
            >
              {/* Inner div owns border-radius + overflow so clip works with rotation */}
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-gold/20 shadow-lg shadow-black/30">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 180px, 280px"
                  quality={90}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

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
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
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
    </>
  )
}

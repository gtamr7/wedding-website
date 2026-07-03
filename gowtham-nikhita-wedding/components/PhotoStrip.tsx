'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const CONFIG = [
  { angle: -5, w: 138, h: 170 },
  { angle:  3, w: 162, h: 208 },
  { angle: -3, w: 138, h: 170 },
]

export default function PhotoStrip({ photos }: { photos: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="flex justify-center items-end gap-5 sm:gap-8 py-8 px-4">
      {photos.slice(0, 3).map((src, i) => {
        const { angle, w, h } = CONFIG[i]
        return (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
            className="relative shrink-0 rounded-xl overflow-hidden border border-gold/20 shadow-lg shadow-black/30"
            style={{ width: w, height: h, transform: `rotate(${angle}deg)` }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="165px" />
          </motion.div>
        )
      })}
    </div>
  )
}

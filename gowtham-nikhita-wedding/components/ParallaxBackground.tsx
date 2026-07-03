'use client'

import Image from 'next/image'
import { useScroll, useTransform, motion } from 'framer-motion'

const PHOTOS = [
  '/gallery/IMG_indian_attire.jpg',
  '/gallery/IMG_9641.jpg',
  '/gallery/IMG_couple_restaurant.jpg',
  '/gallery/IMG_0450.jpg',
  '/gallery/IMG_0502.jpg',
]

function BgLayer({ src, idx, total }: { src: string; idx: number; total: number }) {
  const { scrollYProgress } = useScroll()

  const segStart = idx / total
  const segEnd = (idx + 1) / total
  const fade = 0.08

  let inputRange: number[]
  let outputRange: number[]

  if (idx === 0) {
    inputRange = [0, segEnd - fade, segEnd]
    outputRange = [1, 1, 0]
  } else if (idx === total - 1) {
    inputRange = [segStart - fade, segStart, 1]
    outputRange = [0, 1, 1]
  } else {
    inputRange = [segStart - fade, segStart, segEnd - fade, segEnd]
    outputRange = [0, 1, 1, 0]
  }

  const opacity = useTransform(scrollYProgress, inputRange, outputRange)

  const yFrom = idx === 0 ? 0 : segStart
  const yTo = idx === total - 1 ? 1 : segEnd
  const y = useTransform(scrollYProgress, [yFrom, yTo], ['0%', '-18%'])

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, y, willChange: 'transform, opacity' }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        priority={idx === 0}
        sizes="100vw"
      />
    </motion.div>
  )
}

export default function ParallaxBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {PHOTOS.map((src, i) => (
        <BgLayer key={src} src={src} idx={i} total={PHOTOS.length} />
      ))}
      {/* Dark overlay for text readability across all sections */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.44) 40%, rgba(0,0,0,0.58) 100%)',
        }}
      />
    </div>
  )
}

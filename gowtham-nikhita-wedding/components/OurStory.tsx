'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Timeline from './Timeline'
import PhotoCarousel from './PhotoCarousel'

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const chapters = [
  {
    num: '01',
    heading: 'The carpool',
    body: `They weren't set up. They were just going to pick up a friend. Nikki was driving, Gowtham was in the back seat, and they talked a little, but that little bit was enough to create a friendship that would last a lifetime.`,
  },
  {
    num: '02',
    heading: 'A very long detour',
    body: `For five years they were the kind of friends who never had to explain themselves. The kind that just felt like home. Then life pulled them apart for a stretch, but like a pendulum, they swung back to each other. This time something was different.`,
  },
  {
    num: '03',
    heading: 'Japan. A garden. A very overused bit.',
    body: `For years, Gowtham had a move. He'd drop down to one knee out of nowhere, let the moment hang just long enough, and then start tying his shoe. Every time. Nikki stopped falling for it eventually. So when he got down on one knee in a national garden in Japan on a warm summer afternoon, she probably thought she knew what was coming. She didn't. He had a ring.\n\nShe said yes.\n\nThey found some grass, put down a picnic blanket, and spent the rest of the day in the sun calling everyone they loved and barely getting the words out.`,
  },
]

export default function OurStory() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
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

  return (
    <section id="story" className="section-py px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Meet the Couple</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-ivory">Our Story</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        {/* Two-column: photos + narrative */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Stacked photo cards — sticky on desktop */}
          <div className="lg:sticky lg:top-24">
            <FadeIn delay={0.1}>
              <div className="relative mx-auto" style={{ width: '100%', maxWidth: '420px', height: '500px' }}>
                {/* Back card */}
                <div
                  className="absolute top-0 right-0 w-64 rounded-xl overflow-hidden border border-gold/15 shadow-xl cursor-pointer group"
                  style={{ height: '350px', transform: 'rotate(4deg)' }}
                  onClick={() => setLightbox('/gallery/IMG_0334.jpg')}
                >
                  <Image
                    src="/gallery/IMG_0334.jpg"
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 55vw, 256px"
                    quality={95}
                    priority
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/55 backdrop-blur-sm rounded-lg flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Front card */}
                <div
                  className="absolute bottom-0 left-0 w-72 rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 cursor-pointer group"
                  style={{ height: '370px', transform: 'rotate(-4deg)' }}
                  onClick={() => setLightbox('/gallery/IMG_0314.jpg')}
                >
                  <Image
                    src="/gallery/IMG_0314.jpg"
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 65vw, 288px"
                    quality={95}
                    priority
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/55 backdrop-blur-sm rounded-lg flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Narrative chapters */}
          <div className="space-y-10">
            {chapters.map((ch, i) => (
              <FadeIn key={ch.num} delay={0.15 + i * 0.1}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[10px] tracking-widest uppercase text-gold/50 font-medium">{ch.num}</span>
                  <h3 className="font-display text-3xl italic text-ivory">{ch.heading}</h3>
                </div>
                <div className="space-y-4">
                  {ch.body.split('\n\n').map((para, j) => (
                    <p key={j} className="text-ivory/65 leading-relaxed">{para}</p>
                  ))}
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.5}>
              <h3 className="font-display text-3xl italic text-ivory mb-0">The Journey</h3>
              <Timeline />
            </FadeIn>
          </div>
        </div>

        {/* Pull quote */}
        <FadeIn delay={0.1} className="mt-20 mb-6">
          <div className="text-center max-w-xl mx-auto px-6">
            <div className="gold-divider w-12 mx-auto mb-8 opacity-40" />
            <p className="font-display text-2xl sm:text-3xl italic text-ivory/80 leading-relaxed">
              They didn&apos;t fall in love. They grew into it slowly, the way the best things do.
            </p>
            <div className="gold-divider w-12 mx-auto mt-8 opacity-40" />
          </div>
        </FadeIn>

        {/* Photo carousel */}
        <FadeIn delay={0.1} className="mt-12">
          <p className="text-xs tracking-widest uppercase text-gold mb-5 text-center">Our Photos</p>
          <PhotoCarousel />
        </FadeIn>
      </div>

      {/* Lightbox */}
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

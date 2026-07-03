'use client'

import { useRef, useState } from 'react'
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

export default function OurStory() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section id="story" className="section-py px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Chapter One</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-ivory">Our Story</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Stacked floating photo cards */}
          <FadeIn delay={0.1}>
            <div className="relative mx-auto max-w-sm" style={{ height: '400px' }}>
              {/* Back card — bridge kiss */}
              <div
                className="absolute top-0 right-4 w-52 rounded-xl overflow-hidden border border-gold/15 shadow-xl cursor-pointer group"
                style={{ height: '300px', transform: 'rotate(4deg)' }}
                onClick={() => setLightbox('/gallery/IMG_0334.jpg')}
              >
                <Image
                  src="/gallery/IMG_0334.jpg"
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 320px"
                  quality={92}
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Front card — the proposal */}
              <div
                className="absolute bottom-0 left-0 w-56 rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40 cursor-pointer group"
                style={{ height: '320px', transform: 'rotate(-4deg)' }}
                onClick={() => setLightbox('/gallery/IMG_0314.jpg')}
              >
                <Image
                  src="/gallery/IMG_0314.jpg"
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 60vw, 350px"
                  quality={92}
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Narrative */}
          <div className="space-y-8">
            <FadeIn delay={0.15}>
              <h3 className="font-display text-3xl italic text-ivory">How it began</h3>
              <p className="text-ivory/65 leading-relaxed mt-3">
                Gowtham and Nikhita met in college through mutual friends — the kind of introduction
                that doesn&apos;t feel like much at the time. Nikki drove while Gowtham rode in the
                back seat like she was his personal Uber. They laughed, they talked, and by the time
                the ride was over a friendship had started that neither of them knew would change
                everything.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h3 className="font-display text-3xl italic text-ivory">Five years of friendship</h3>
              <p className="text-ivory/65 leading-relaxed mt-3">
                For five years they were the best of friends — the kind who know each other&apos;s
                families, finish each other&apos;s sentences, and show up without being asked. Life
                pulled them in different directions, but like a pendulum, Nikki came back. And this
                time, something was different. They&apos;ve been together ever since — nearly three
                years and counting.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <h3 className="font-display text-3xl italic text-ivory">The proposal</h3>
              <p className="text-ivory/65 leading-relaxed mt-3">
                Japan, 2025. A national garden on a warm summer day. Gowtham got down on one knee
                among the trees and asked the question he&apos;d been holding for years. She said
                yes. They spread a picnic blanket, sat in the sun, and soaked it all in — then
                called their families. Magical doesn&apos;t quite cover it.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <h3 className="font-display text-3xl italic text-ivory">Our journey</h3>
              <Timeline />
            </FadeIn>
          </div>
        </div>

        {/* Photo carousel — all 17 photos, scrollable */}
        <FadeIn delay={0.1} className="mt-16">
          <p className="text-xs tracking-widest uppercase text-gold mb-5">Our Photos</p>
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
    </section>
  )
}

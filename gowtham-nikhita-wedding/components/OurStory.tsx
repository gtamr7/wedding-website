'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Timeline from './Timeline'

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

  return (
    <section id="story" className="section-py bg-ivory px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Chapter One</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-charcoal">Our Story</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Photo placeholder */}
          <FadeIn delay={0.1}>
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-olive-light relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-olive-mid/50">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm mt-3 font-display italic">Photo coming soon</p>
              </div>
              {/* Decorative corner */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-sm" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-sm" />
            </div>
          </FadeIn>

          {/* Narrative */}
          <div className="space-y-6">
            <FadeIn delay={0.15}>
              <h3 className="font-display text-3xl italic text-charcoal">How it began</h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                Gowtham and Nikhita&apos;s story is one of those rare ones that starts quietly and
                grows into something that feels inevitable in hindsight. A shared world, a mutual
                network, and a moment of courage — that&apos;s all it took.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h3 className="font-display text-3xl italic text-charcoal">The proposal</h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                When the moment came, Gowtham made it personal, not performative. He proposed with
                all the sincerity and love that has defined their relationship from the start. Nikhita
                (Nikki) said yes — and then they called their families.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <h3 className="font-display text-3xl italic text-charcoal">What to expect</h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                Over three days in beautiful Sarasota, you&apos;ll witness a celebration that honors
                two families, two cultures, and one love. From the Sangeet night filled with music
                and dance, to the sacred Tamil &amp; Telugu Muhurtham ceremony, to an unforgettable
                waterfront reception — every moment has been crafted with you in mind.
              </p>
            </FadeIn>

            {/* Timeline */}
            <FadeIn delay={0.4}>
              <h3 className="font-display text-3xl italic text-charcoal">Our journey</h3>
              <Timeline />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

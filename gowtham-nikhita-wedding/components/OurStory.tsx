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
                Gowtham and Nikhita met in college through mutual friends — the kind of introduction
                that doesn&apos;t feel like much at the time. Nikki drove, Gowtham rode shotgun like
                she was his personal Uber driver. They laughed, they talked, and somewhere in that
                back seat a friendship was born that would quietly change everything.
              </p>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h3 className="font-display text-3xl italic text-charcoal">Five years of friendship</h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                For five years they were the best of friends — the kind who know each other&apos;s
                families, finish each other&apos;s sentences, and show up without being asked. Life
                pulled them in different directions, but like a pendulum, Nikki came back. And this
                time, something was different. They&apos;ve been together ever since — nearly three
                years and counting.
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <h3 className="font-display text-3xl italic text-charcoal">The proposal</h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">
                Japan, 2025. A national garden on a warm summer day. Gowtham got down on one knee
                among the trees and asked the question he&apos;d been holding for years. She said
                yes. They spread a picnic blanket, sat in the sun, and soaked it all in — then
                called their families. Magical doesn&apos;t quite cover it.
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

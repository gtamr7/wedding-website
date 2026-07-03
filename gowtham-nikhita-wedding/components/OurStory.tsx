'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
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
            <div className="relative mx-auto max-w-sm" style={{ height: '460px' }}>
              {/* Back card — bridge kiss */}
              <div
                className="absolute top-0 right-4 w-52 rounded-xl overflow-hidden border border-gold/15 shadow-xl"
                style={{ height: '310px', transform: 'rotate(3deg)' }}
              >
                <Image src="/gallery/IMG_0334.jpg" alt="" fill className="object-cover" sizes="208px" quality={90} />
              </div>
              {/* Front card — the proposal */}
              <div
                className="absolute bottom-0 left-0 w-56 rounded-xl overflow-hidden border border-gold/25 shadow-2xl shadow-black/40"
                style={{ height: '330px', transform: 'rotate(-3deg)' }}
              >
                <Image src="/gallery/IMG_0314.jpg" alt="" fill className="object-cover" sizes="224px" quality={90} />
              </div>
              {/* Accent card — ring closeup */}
              <div
                className="absolute w-28 rounded-lg overflow-hidden border border-gold/30 shadow-xl z-10"
                style={{ top: '148px', left: '12px', height: '160px', transform: 'rotate(6deg)' }}
              >
                <Image src="/gallery/IMG_0363.jpg" alt="" fill className="object-cover" sizes="112px" quality={90} />
              </div>
            </div>
          </FadeIn>

          {/* Narrative */}
          <div className="space-y-8">
            <FadeIn delay={0.15}>
              <h3 className="font-display text-3xl italic text-ivory">How it began</h3>
              <p className="text-ivory/65 leading-relaxed mt-3">
                Gowtham and Nikhita met in college through mutual friends — the kind of introduction
                that doesn&apos;t feel like much at the time. Nikki drove, Gowtham rode shotgun like
                she was his personal Uber driver. They laughed, they talked, and somewhere in that
                back seat a friendship was born that would quietly change everything.
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
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { venueShort } from '@/lib/wedding'

type Milestone = { year: string; heading: string; body: string; isWedding?: boolean }

const milestones: Milestone[] = [
  {
    year: 'Years Earlier',
    heading: 'A wall apart',
    body: `As kids they spent years of Sundays in the same building and never once met. Same Balavihar, adjoining rooms, with Nikki in dance class on one side and Gowtham learning Hinduism on the other. No hallway run-in, no glance across the parking lot. He couldn't have picked her out of a crowd. She had no idea he existed.

It would take another fifteen years.`,
  },
  {
    year: '2019',
    heading: 'The carpool',
    body: `They met at a university he didn't even go to. Gowtham was there for tennis, and they happened to meet while carpooling to pick up a friend. That little interaction was enough to make them friends.`,
  },
  {
    year: '2024',
    heading: 'A very long detour',
    body: `For five years they were the kind of friends who never had to explain themselves. The kind that just felt like home. Then life pulled them apart for a stretch, but like a pendulum, they swung back to each other. This time something was different.`,
  },
  {
    year: '2025',
    heading: 'Japan. A garden. A very overused bit.',
    body: `For years, Gowtham had a move. He'd drop down to one knee out of nowhere, let the moment hang just long enough, and then start tying his shoe. Every time. Nikki stopped falling for it eventually. So when he got down on one knee in a national garden in Japan on a warm summer afternoon, she probably thought she knew what was coming. She didn't. He had a ring.

She said yes.`,
  },
  {
    year: '2027',
    heading: 'The Wedding',
    body: `February 17 and 18 · ${venueShort()}`,
    isWedding: true,
  },
]

function Node({ m, index, isLast }: { m: Milestone; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative flex gap-6 sm:gap-8">
      <div className="flex flex-col items-center w-4 shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`w-4 h-4 rounded-full border-2 shrink-0 mt-2 ${
            m.isWedding
              ? 'bg-gold border-gold shadow-[0_0_0_4px_rgba(184,151,42,0.3)]'
              : 'bg-white/30 border-gold/60'
          }`}
        />
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            className="w-px flex-1 bg-gold/30 origin-top mt-1"
            style={{ minHeight: '3rem' }}
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
        className="pb-12"
      >
        <span className="text-[10px] tracking-widest uppercase text-gold font-medium">{m.year}</span>
        <h3 className="font-display text-2xl sm:text-3xl text-ivory mt-1">{m.heading}</h3>
        <div className="space-y-4 mt-3">
          {m.body.split('\n\n').map((para, j) => (
            <p key={j} className="text-ivory/80 leading-relaxed">{para}</p>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  return (
    <div>
      {milestones.map((m, i) => (
        <Node key={i} m={m} index={i} isLast={i === milestones.length - 1} />
      ))}
    </div>
  )
}

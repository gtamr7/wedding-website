'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const milestones = [
  { year: '2019', label: 'They Met', desc: 'A chance encounter that changed everything.' },
  { year: '2020', label: 'First Date', desc: 'Coffee turned into hours of conversation.' },
  { year: '2023', label: 'The Proposal', desc: 'He asked. She said yes. Obviously.' },
  { year: '2024', label: 'Engagement', desc: 'Celebrated with both families across two states.' },
  { year: '2027', label: 'The Wedding', desc: 'February 17 — Powel Crosley Estate, Sarasota.' },
]

function Node({ m, index, isLast }: { m: typeof milestones[0]; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative flex gap-6 sm:gap-10">
      {/* Line + dot column */}
      <div className="flex flex-col items-center w-6 shrink-0">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 }}
          className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 ${
            m.year === '2027'
              ? 'bg-gold border-gold shadow-[0_0_0_4px_rgba(184,151,42,0.2)]'
              : 'bg-ivory border-olive-mid'
          }`}
        />
        {/* Connecting line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            className="w-px flex-1 bg-olive-mid/40 origin-top mt-1"
            style={{ minHeight: '3rem' }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
        className="pb-10"
      >
        <span className="text-xs tracking-widest uppercase text-gold font-medium">{m.year}</span>
        <h4 className="font-display text-xl italic text-charcoal mt-0.5">{m.label}</h4>
        <p className="text-sm text-charcoal/60 mt-1 leading-relaxed">{m.desc}</p>
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  return (
    <div className="mt-12 max-w-sm">
      {milestones.map((m, i) => (
        <Node key={m.year} m={m} index={i} isLast={i === milestones.length - 1} />
      ))}
    </div>
  )
}

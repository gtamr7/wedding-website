'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const milestones = [
  { year: '2019', label: 'They Met',      desc: "He met her at a university he didn't even go to. Best friends from day one." },
  { year: '2024', label: 'First Date',    desc: 'Five years of friendship later. It was always going to be this way.' },
  { year: '2025', label: 'The Proposal',  desc: 'A national garden in Japan. A picnic. A yes.' },
  { year: '2027', label: 'The Wedding',   desc: 'February 17 and 18 at Powel Crosley Estate, Sarasota, Florida.' },
]

function Node({ m, index, isLast }: { m: typeof milestones[0]; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="relative flex gap-6 sm:gap-10">
      <div className="flex flex-col items-center w-6 shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 }}
          className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 ${
            m.label === 'The Wedding'
              ? 'bg-gold border-gold shadow-[0_0_0_4px_rgba(184,151,42,0.3)]'
              : 'bg-white/30 border-gold/60'
          }`}
        />
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            className="w-px flex-1 bg-gold/30 origin-top mt-1"
            style={{ minHeight: '3rem' }}
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
        className="pb-10"
      >
        <span className="text-xs tracking-widest uppercase text-gold font-medium">{m.year}</span>
        <h4 className="font-display text-xl italic text-ivory mt-0.5">{m.label}</h4>
        <p className="text-sm text-ivory/60 mt-1 leading-relaxed">{m.desc}</p>
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  return (
    <div className="mt-12 max-w-sm">
      {milestones.map((m, i) => (
        <Node key={i} m={m} index={i} isLast={i === milestones.length - 1} />
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PhotoGroup } from '@/lib/types'

type Status = 'now' | 'next' | 'done' | 'upcoming'

interface GroupCardProps {
  group: PhotoGroup
  status: Status
}

const statusConfig = {
  now: {
    badge: 'NOW',
    badgeClass: 'bg-gold text-white',
    cardClass: 'border-gold shadow-[0_0_0_2px_rgba(184,151,42,0.3)] bg-gold/5 animate-pulse-gold',
    numberClass: 'bg-gold text-white',
  },
  next: {
    badge: 'NEXT',
    badgeClass: 'border border-olive-mid text-olive-mid bg-olive-light/50',
    cardClass: 'border-olive-mid/60 bg-olive-light/20',
    numberClass: 'bg-olive-mid text-white',
  },
  done: {
    badge: '✓ DONE',
    badgeClass: 'bg-charcoal/10 text-charcoal/40',
    cardClass: 'border-charcoal/10 bg-white opacity-50',
    numberClass: 'bg-charcoal/20 text-charcoal/50',
  },
  upcoming: {
    badge: '',
    badgeClass: '',
    cardClass: 'border-olive-light bg-white',
    numberClass: 'bg-olive-light text-olive-dark',
  },
}

export default function GroupCard({ group, status }: GroupCardProps) {
  const [expanded, setExpanded] = useState(status === 'now')
  const cfg = statusConfig[status]

  return (
    <motion.div
      layout
      className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${cfg.cardClass}`}
    >
      <button
        className="w-full text-left p-4 sm:p-5 flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* Group number */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${cfg.numberClass}`}>
          {group.index + 1}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium leading-snug ${status === 'done' ? 'text-charcoal/40 line-through' : 'text-charcoal'}`}>
            {group.name}
          </p>
          <p className="text-xs text-charcoal/50 mt-0.5 truncate">{group.description}</p>
        </div>

        {/* Badge */}
        {cfg.badge && (
          <span className={`text-[10px] font-semibold tracking-widest uppercase rounded-full px-2.5 py-1 shrink-0 ${cfg.badgeClass}`}>
            {cfg.badge}
          </span>
        )}

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="shrink-0 text-charcoal/30"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && group.members && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-0 border-t border-charcoal/5">
              <p className="text-[11px] text-charcoal/40 uppercase tracking-widest mt-3 mb-2">Who&apos;s in this shot</p>
              <ul className="space-y-1">
                {group.members.map((m) => (
                  <li key={m} className="text-sm text-charcoal/70 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-olive-mid/60 shrink-0" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

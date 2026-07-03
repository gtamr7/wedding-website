'use client'

import { motion } from 'framer-motion'

interface OddsBarProps {
  labelA: string
  labelB: string
  countA: number
  countB: number
  userPick?: 'a' | 'b'
  result?: 'a' | 'b' | null
}

export default function OddsBar({ labelA, labelB, countA, countB, userPick, result }: OddsBarProps) {
  const total = countA + countB
  const pctA = total === 0 ? 50 : Math.round((countA / total) * 100)
  const pctB = 100 - pctA

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="relative h-8 rounded-full overflow-hidden bg-charcoal/5 flex">
        <motion.div
          className={`h-full rounded-l-full transition-all ${
            result === 'a' ? 'bg-gold' : userPick === 'a' ? 'bg-olive-mid' : 'bg-olive-mid/50'
          }`}
          initial={{ width: '50%' }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <motion.div
          className={`h-full rounded-r-full transition-all ${
            result === 'b' ? 'bg-gold' : userPick === 'b' ? 'bg-olive-dark' : 'bg-olive-dark/30'
          }`}
          initial={{ width: '50%' }}
          animate={{ width: `${pctB}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />

        {/* Center line */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/40" />

        {/* Percentage labels */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/90 select-none">
          {pctA}%
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/90 select-none">
          {pctB}%
        </span>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-charcoal/50">
        <span>{labelA} ({countA})</span>
        <span>{labelB} ({countB})</span>
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import OddsBar from './OddsBar'
import type { BetWithPicks } from '@/lib/types'

interface BetCardProps {
  bet: BetWithPicks
  guestName: string
  onPick: (betId: string, pick: 'a' | 'b') => Promise<void>
  index: number
}

function formatLine(line: number) {
  if (line === 0) return 'EVEN'
  return line > 0 ? `+${line}` : `${line}`
}

export default function BetCard({ bet, guestName, onPick, index }: BetCardProps) {
  const hasResult = bet.result !== null && bet.result !== undefined
  const userWon = hasResult && bet.user_pick === bet.result

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`rounded-xl border p-5 space-y-4 transition-all ${
        hasResult
          ? userWon
            ? 'border-gold/60 bg-gold/5'
            : 'border-charcoal/15 bg-charcoal/3'
          : 'border-olive-light/60 bg-white hover:border-olive-mid/40 hover:shadow-sm'
      }`}
    >
      {/* Category + result badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-widest font-semibold rounded-full px-2.5 py-1 ${
            bet.category === 'over_under'
              ? 'bg-olive-light text-olive-dark'
              : 'bg-gold/10 text-gold'
          }`}>
            {bet.category === 'over_under' ? 'O/U' : 'Prop'}
          </span>
          {bet.user_pick && !hasResult && (
            <span className="text-[10px] text-charcoal/40 uppercase tracking-wider">Your pick locked</span>
          )}
        </div>
        {hasResult && (
          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${userWon ? 'bg-gold text-white' : 'bg-charcoal/10 text-charcoal/40'}`}>
            {userWon ? '✓ Correct' : '✗ Wrong'}
          </span>
        )}
      </div>

      {/* Question */}
      <p className="font-display text-lg italic text-charcoal leading-snug">{bet.question}</p>

      {/* Odds bar */}
      <OddsBar
        labelA={bet.option_a}
        labelB={bet.option_b}
        countA={bet.picks_a}
        countB={bet.picks_b}
        userPick={bet.user_pick}
        result={bet.result}
      />

      {/* Pick buttons */}
      {!hasResult && guestName && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {(['a', 'b'] as const).map((pick) => {
            const label = pick === 'a' ? bet.option_a : bet.option_b
            const line = pick === 'a' ? bet.option_a_line : bet.option_b_line
            const isSelected = bet.user_pick === pick

            return (
              <motion.button
                key={pick}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPick(bet.id, pick)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-olive-dark bg-olive-dark text-white'
                    : 'border-olive-light text-charcoal hover:border-olive-mid hover:bg-olive-light/20'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{label}</span>
                  <span className={`text-xs shrink-0 ${isSelected ? 'text-white/70' : 'text-charcoal/40'}`}>
                    {formatLine(line)}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Result reveal */}
      {hasResult && (
        <div className="text-sm text-charcoal/60 pt-1">
          <span className="font-medium text-charcoal">
            Winner: {bet.result === 'a' ? bet.option_a : bet.option_b}
          </span>
          {bet.user_pick && (
            <span className="ml-2">
              (you picked {bet.user_pick === 'a' ? bet.option_a : bet.option_b})
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

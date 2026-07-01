'use client'

import { motion } from 'framer-motion'
import type { LeaderboardEntry } from '@/lib/types'

function getTitle(rank: number, pct: number): string {
  if (pct === 0) return 'Wildly Optimistic 😅'
  if (rank === 1) return 'Oracle of Atlanta 🔮'
  if (rank === 2) return 'Crystal Ball Carrier'
  if (rank === 3) return 'Educated Guesser'
  if (pct >= 70) return 'The Clairvoyant'
  if (pct >= 50) return 'Solid Bet'
  return 'Took a Swing'
}

export function buildLeaderboardFixed(
  bets: { id: string; result: string | null }[],
  picks: { bet_id: string; guest_name: string; pick: string }[]
): LeaderboardEntry[] {
  const resolvedBets = bets.filter((b) => b.result !== null)
  if (resolvedBets.length === 0) return []

  const resultMap = new Map(resolvedBets.map((b) => [b.id, b.result]))
  const guests = new Map<string, { correct: number; total: number }>()

  for (const pick of picks) {
    const result = resultMap.get(pick.bet_id)
    if (result === undefined) continue
    const entry = guests.get(pick.guest_name) ?? { correct: 0, total: 0 }
    entry.total++
    if (pick.pick === result) entry.correct++
    guests.set(pick.guest_name, entry)
  }

  const sorted = Array.from(guests.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.correct - a.correct || a.name.localeCompare(b.name))

  return sorted.map((e, i) => ({
    guest_name: e.name,
    correct: e.correct,
    total: e.total,
    title: getTitle(i + 1, e.total > 0 ? Math.round((e.correct / e.total) * 100) : 0),
  }))
}

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-charcoal/40">
        <p className="font-display text-2xl italic">Results pending</p>
        <p className="text-sm mt-2">The leaderboard appears after results are revealed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <motion.div
          key={e.guest_name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            i === 0 ? 'border-gold/50 bg-gold/5' : 'border-olive-light bg-white'
          }`}
        >
          <span className="text-xl w-8 text-center shrink-0">{medals[i] ?? `${i + 1}`}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-charcoal truncate">{e.guest_name}</p>
            <p className="text-xs text-charcoal/50 truncate">{e.title}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`font-semibold text-lg ${i === 0 ? 'text-gold' : 'text-charcoal'}`}>
              {e.correct}/{e.total}
            </p>
            <p className="text-xs text-charcoal/40">correct</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

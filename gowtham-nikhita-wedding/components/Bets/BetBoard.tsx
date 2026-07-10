'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Dices, Timer, Target } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Bet, BetPick, BetWithPicks } from '@/lib/types'
import BetCard from './BetCard'
import Leaderboard, { buildLeaderboardFixed } from './Leaderboard'

function enrichBets(bets: Bet[], picks: BetPick[], guestName: string): BetWithPicks[] {
  return bets.map((bet) => {
    const betPicks = picks.filter((p) => p.bet_id === bet.id)
    const guestPick = betPicks.find((p) => p.guest_name === guestName)
    return {
      ...bet,
      picks_a: betPicks.filter((p) => p.pick === 'a').length,
      picks_b: betPicks.filter((p) => p.pick === 'b').length,
      user_pick: guestPick?.pick,
    }
  })
}

export default function BetBoard() {
  const [guestName, setGuestName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [bets, setBets] = useState<Bet[]>([])
  const [picks, setPicks] = useState<BetPick[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'bets' | 'leaderboard'>('bets')
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('weddingGuestName')
    if (saved) setGuestName(saved)
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createSupabaseClient()
    const [{ data: betsData }, { data: picksData }] = await Promise.all([
      supabase.from('bets').select('*').eq('active', true).order('sort_order'),
      supabase.from('bet_picks').select('*'),
    ])
    if (betsData) setBets(betsData)
    if (picksData) setPicks(picksData)
    setLoading(false)
  }

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setGuestName(trimmed)
    localStorage.setItem('weddingGuestName', trimmed)
  }

  const handlePick = async (betId: string, pick: 'a' | 'b') => {
    if (!guestName || submitting) return
    setSubmitting(betId)

    // Optimistically update UI
    setPicks((prev) => {
      const without = prev.filter((p) => !(p.bet_id === betId && p.guest_name === guestName))
      return [...without, { id: crypto.randomUUID(), bet_id: betId, guest_name: guestName, pick, created_at: new Date().toISOString() }]
    })

    const supabase = createSupabaseClient()
    // Delete existing pick if any
    await supabase.from('bet_picks').delete().match({ bet_id: betId, guest_name: guestName })
    // Insert new pick
    await supabase.from('bet_picks').insert({ bet_id: betId, guest_name: guestName, pick })

    setSubmitting(null)
  }

  const enriched = enrichBets(bets, picks, guestName)
  const overUnder = enriched.filter((b) => b.category === 'over_under')
  const props = enriched.filter((b) => b.category === 'prop')
  const hasResults = bets.some((b) => b.result !== null)
  const leaderboard = buildLeaderboardFixed(bets, picks)

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Name gate */}
      <AnimatePresence>
        {!guestName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-olive-dark rounded-xl p-6 text-center border border-gold/20"
          >
            <p className="font-display text-2xl italic text-gold mb-1">Place Your Bets</p>
            <p className="text-olive-light/60 text-sm mb-5">Enter your name to start picking winners</p>
            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                className="flex-1 bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold"
                autoFocus
              />
              <button
                onClick={saveName}
                disabled={!nameInput.trim()}
                className="bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-40"
              >
                Let&apos;s go
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest banner */}
      {guestName && (
        <div className="flex items-center justify-between mb-6 bg-olive-light/30 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs text-charcoal/40 tracking-wider uppercase">Betting as</p>
            <p className="font-medium text-charcoal">{guestName}</p>
          </div>
          <button
            onClick={() => { setGuestName(''); setNameInput(''); localStorage.removeItem('weddingGuestName') }}
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-olive-light/30 rounded-xl p-1 mb-8">
        {(['bets', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            {t === 'leaderboard' ? (
              <span className="flex items-center justify-center gap-1.5">
                <Trophy size={13} />Leaderboard{!hasResults && ' (hidden)'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Dices size={13} />All Bets
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'bets' ? (
          <motion.div key="bets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Over/Unders */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display text-2xl italic text-charcoal flex items-center gap-2"><Timer size={20} strokeWidth={2.5} className="text-charcoal/50" />Over/Unders</h3>
                <div className="flex-1 h-px bg-olive-light" />
              </div>
              <div className="space-y-4">
                {overUnder.map((bet, i) => (
                  <BetCard key={bet.id} bet={bet} guestName={guestName} onPick={handlePick} index={i} />
                ))}
              </div>
            </div>

            {/* Props */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display text-2xl italic text-charcoal flex items-center gap-2"><Target size={20} strokeWidth={2.5} className="text-charcoal/50" />Prop Bets</h3>
                <div className="flex-1 h-px bg-olive-light" />
              </div>
              <div className="space-y-4">
                {props.map((bet, i) => (
                  <BetCard key={bet.id} bet={bet} guestName={guestName} onPick={handlePick} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Leaderboard entries={leaderboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

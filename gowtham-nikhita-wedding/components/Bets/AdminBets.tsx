'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Target, Trophy } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Bet, BetPick } from '@/lib/types'
import { buildLeaderboardFixed } from './Leaderboard'

type AuthState = 'loading' | 'locked' | 'unlocked'

function PinEntry({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, type: 'bets' }),
      })
      if (res.ok) {
        sessionStorage.setItem('betsAdminAuth', 'true')
        onUnlock()
      } else {
        setError('Incorrect PIN.')
        setPin('')
      }
    } catch {
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xs mx-auto text-center py-16">
      <div className="flex justify-center mb-4"><Lock size={36} strokeWidth={2.5} className="text-charcoal/30" /></div>
      <h2 className="font-display text-3xl italic text-charcoal mb-6">Bets Admin</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full text-center text-3xl tracking-widest text-charcoal border-2 border-olive-light rounded-xl py-4 bg-white focus:border-gold focus:outline-none transition-colors"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={pin.length !== 4 || loading}
          className="w-full bg-olive-dark text-white py-3 rounded-xl font-medium disabled:opacity-40 hover:bg-olive-mid transition-colors"
        >
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

function AdminPanel() {
  const [bets, setBets] = useState<Bet[]>([])
  const [picks, setPicks] = useState<BetPick[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [tab, setTab] = useState<'results' | 'leaderboard'>('results')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createSupabaseClient()
    const [{ data: betsData }, { data: picksData }] = await Promise.all([
      supabase.from('bets').select('*').order('sort_order'),
      supabase.from('bet_picks').select('*'),
    ])
    if (betsData) setBets(betsData)
    if (picksData) setPicks(picksData)
    setLoading(false)
  }

  const setResult = async (betId: string, result: 'a' | 'b' | null) => {
    setSaving(betId)
    const supabase = createSupabaseClient()
    await supabase.from('bets').update({ result }).eq('id', betId)
    setBets((prev) => prev.map((b) => b.id === betId ? { ...b, result } : b))
    setSaving(null)
  }

  const toggleActive = async (betId: string, active: boolean) => {
    const supabase = createSupabaseClient()
    await supabase.from('bets').update({ active }).eq('id', betId)
    setBets((prev) => prev.map((b) => b.id === betId ? { ...b, active } : b))
  }

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" /></div>

  const leaderboard = buildLeaderboardFixed(bets, picks)
  const resolvedCount = bets.filter((b) => b.result !== null).length

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl italic text-charcoal">Bets Admin</h2>
        <p className="text-charcoal/50 text-sm mt-1">
          {resolvedCount}/{bets.length} results set · {picks.length} total picks
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-olive-light/30 rounded-xl p-1 mb-6">
        {(['results', 'leaderboard'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            {t === 'results' ? (
              <span className="flex items-center justify-center gap-1.5"><Target size={13} />Set Results</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5"><Trophy size={13} />Leaderboard</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'results' ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {bets.map((bet) => {
              const betPicks = picks.filter((p) => p.bet_id === bet.id)
              const aCount = betPicks.filter((p) => p.pick === 'a').length
              const bCount = betPicks.filter((p) => p.pick === 'b').length
              return (
                <div key={bet.id} className={`rounded-xl border p-4 space-y-3 ${bet.active ? 'border-olive-light bg-white' : 'border-charcoal/10 bg-charcoal/3 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-charcoal text-sm leading-snug">{bet.question}</p>
                    <button
                      onClick={() => toggleActive(bet.id, !bet.active)}
                      className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-1 shrink-0 border transition-colors ${
                        bet.active ? 'border-olive-mid text-olive-mid hover:bg-olive-light/30' : 'border-charcoal/20 text-charcoal/40'
                      }`}
                    >
                      {bet.active ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  {/* Pick counts */}
                  <div className="flex gap-3 text-xs text-charcoal/50">
                    <span>{bet.option_a}: {aCount} picks</span>
                    <span>·</span>
                    <span>{bet.option_b}: {bCount} picks</span>
                  </div>

                  {/* Result buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal/40 uppercase tracking-wider mr-1">Winner:</span>
                    {(['a', 'b'] as const).map((pick) => {
                      const label = pick === 'a' ? bet.option_a : bet.option_b
                      const isSelected = bet.result === pick
                      return (
                        <button
                          key={pick}
                          onClick={() => setResult(bet.id, isSelected ? null : pick)}
                          disabled={saving === bet.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-gold border-gold text-white'
                              : 'border-olive-light text-charcoal hover:border-olive-mid'
                          }`}
                        >
                          {label} {isSelected && '✓'}
                        </button>
                      )
                    })}
                    {bet.result && (
                      <button onClick={() => setResult(bet.id, null)} className="text-xs text-charcoal/30 hover:text-red-400 transition-colors ml-1">
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-charcoal/40">
                <p className="font-display text-2xl italic">No results set yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((e, i) => (
                  <div key={e.guest_name} className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-gold/40 bg-gold/5' : 'border-olive-light bg-white'}`}>
                    <span className="w-8 text-center font-semibold text-charcoal/40 text-sm">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-charcoal">{e.guest_name}</p>
                      <p className="text-xs text-charcoal/40">{e.title}</p>
                    </div>
                    <span className={`font-semibold ${i === 0 ? 'text-gold' : 'text-charcoal'}`}>{e.correct}/{e.total}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminBets() {
  const [auth, setAuth] = useState<AuthState>('loading')

  useEffect(() => {
    const stored = sessionStorage.getItem('betsAdminAuth')
    setAuth(stored === 'true' ? 'unlocked' : 'locked')
  }, [])

  if (auth === 'loading') return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" /></div>

  return (
    <AnimatePresence mode="wait">
      {auth === 'locked' ? (
        <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PinEntry onUnlock={() => setAuth('unlocked')} />
        </motion.div>
      ) : (
        <motion.div key="unlocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AdminPanel />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'
import { PHOTO_GROUPS } from '@/lib/photoGroups'
import GroupCard from './GroupCard'

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
        body: JSON.stringify({ pin, type: 'photo' }),
      })
      if (res.ok) {
        sessionStorage.setItem('photoAdminAuth', 'true')
        onUnlock()
      } else {
        setError('Incorrect PIN. Try again.')
        setPin('')
      }
    } catch {
      setError('Connection error. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xs mx-auto text-center py-16">
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="font-display text-3xl italic text-charcoal mb-2">Coordinator Access</h2>
      <p className="text-charcoal/50 text-sm mb-8">Enter your 4-digit PIN to manage photo order</p>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full text-center text-3xl tracking-widest border-2 border-olive-light rounded-xl py-4 bg-white focus:border-gold focus:outline-none transition-colors"
          autoFocus
          aria-label="PIN"
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
        <button
          type="submit"
          disabled={pin.length !== 4 || loading}
          className="w-full bg-olive-dark text-white py-3 rounded-xl font-medium tracking-wider uppercase text-sm disabled:opacity-40 hover:bg-olive-mid transition-colors"
        >
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

function AdminPanel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedGroups, setCompletedGroups] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase
      .from('photo_order')
      .select('current_index, completed_groups')
      .eq('id', 'wedding')
      .single()
      .then(({ data }) => {
        if (data) {
          setCurrentIndex(data.current_index)
          setCompletedGroups(data.completed_groups ?? [])
        }
      })
  }, [])

  const persist = async (newIndex: number, newCompleted: number[]) => {
    setSaving(true)
    const supabase = createSupabaseClient()
    await supabase
      .from('photo_order')
      .update({ current_index: newIndex, completed_groups: newCompleted, updated_at: new Date().toISOString() })
      .eq('id', 'wedding')
    setCurrentIndex(newIndex)
    setCompletedGroups(newCompleted)
    setSaving(false)
    setResetConfirm(false)
  }

  // Advance current, mark current as done, skip already-done groups
  const nextGroup = async () => {
    const newCompleted = [...new Set([...completedGroups, currentIndex])]
    let nextIdx = currentIndex + 1
    while (nextIdx < PHOTO_GROUPS.length && newCompleted.includes(nextIdx)) nextIdx++
    await persist(Math.min(nextIdx, PHOTO_GROUPS.length), newCompleted)
  }

  const prevGroup = async () => {
    if (currentIndex > 0) await persist(currentIndex - 1, completedGroups)
  }

  // Set currently-shooting without touching completed
  const jumpTo = async (index: number) => {
    await persist(index, completedGroups)
  }

  // Toggle a group's done status without moving current
  const toggleDone = async (index: number) => {
    const newCompleted = completedGroups.includes(index)
      ? completedGroups.filter(i => i !== index)
      : [...new Set([...completedGroups, index])]
    await persist(currentIndex, newCompleted)
  }

  const reset = async () => {
    await persist(0, [])
  }

  const allDone = currentIndex >= PHOTO_GROUPS.length
  const canPrev = currentIndex > 0
  const canNext = currentIndex < PHOTO_GROUPS.length
  const nowGroup = PHOTO_GROUPS[currentIndex]

  return (
    <div className="max-w-xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl italic text-charcoal">Photo Order Control</h2>
        <p className="text-charcoal/50 text-sm mt-1">Changes broadcast to all guests instantly</p>
      </div>

      {/* Progress */}
      <div className="bg-olive-light/30 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-charcoal">Progress</span>
          <span className="text-sm text-charcoal/60">
            {completedGroups.length} / {PHOTO_GROUPS.length} done
          </span>
        </div>
        <div className="w-full h-2 bg-olive-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            animate={{ width: `${(completedGroups.length / PHOTO_GROUPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Current group display */}
      <AnimatePresence mode="wait">
        {!allDone && nowGroup ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border-2 rounded-xl p-5 mb-6 text-center ${
              completedGroups.includes(currentIndex)
                ? 'bg-charcoal/5 border-charcoal/15'
                : 'bg-gold/10 border-gold'
            }`}
          >
            <p className={`text-xs uppercase tracking-widest mb-1 ${completedGroups.includes(currentIndex) ? 'text-charcoal/40' : 'text-gold'}`}>
              {completedGroups.includes(currentIndex) ? 'Already done' : 'Currently Shooting'}
            </p>
            <p className="font-display text-2xl italic text-charcoal">
              #{currentIndex + 1} — {nowGroup.name}
            </p>
            <p className="text-sm text-charcoal/60 mt-1">{nowGroup.description}</p>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-olive-mid text-white rounded-xl p-5 mb-6 text-center"
          >
            <p className="font-display text-2xl italic">All groups complete! 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={prevGroup}
          disabled={!canPrev || saving}
          className="py-5 rounded-xl border-2 border-olive-mid text-olive-dark font-semibold text-lg disabled:opacity-30 hover:bg-olive-light/30 active:scale-95 transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={nextGroup}
          disabled={!canNext || saving}
          className="py-5 rounded-xl bg-olive-dark text-white font-semibold text-lg disabled:opacity-30 hover:bg-olive-mid active:scale-95 transition-all"
        >
          {saving ? '…' : 'Done, Next →'}
        </button>
      </div>

      {/* Group list — tap to set current, checkmark to toggle done */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-charcoal/40">All groups</p>
          <p className="text-xs text-charcoal/30">Tap row = set current · Checkmark = mark done</p>
        </div>
        <div className="space-y-2">
          {PHOTO_GROUPS.map((g, i) => {
            const isDone = completedGroups.includes(i)
            const isCurrent = i === currentIndex
            return (
              <div
                key={g.index}
                className={`flex items-center gap-2 rounded-lg border transition-all ${
                  isCurrent && !isDone
                    ? 'bg-gold/10 border-gold'
                    : isDone
                    ? 'bg-charcoal/4 border-charcoal/10'
                    : 'bg-white border-olive-light hover:border-olive-mid'
                }`}
              >
                {/* Tap to set current */}
                <button
                  onClick={() => jumpTo(i)}
                  className="flex items-center gap-3 flex-1 text-left px-4 py-3 text-sm"
                >
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 font-medium ${
                    isCurrent && !isDone ? 'bg-gold text-white' : isDone ? 'bg-charcoal/10 text-charcoal/40' : 'bg-olive-light text-olive-dark'
                  }`}>
                    {i + 1}
                  </span>
                  <span className={isDone ? 'text-charcoal/35 line-through' : isCurrent ? 'text-charcoal font-medium' : 'text-charcoal'}>
                    {g.name}
                  </span>
                </button>

                {/* Toggle done — 44px tap target wrapping smaller visual */}
                <button
                  onClick={() => toggleDone(i)}
                  className="mr-1 w-11 h-11 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                  aria-label={isDone ? 'Mark undone' : 'Mark done'}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isDone
                      ? 'bg-olive-dark border-olive-dark text-white'
                      : 'border-olive-light hover:border-olive-mid bg-white'
                  }`}>
                    {isDone && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      <div className="border border-red-200 rounded-xl p-4">
        <p className="text-xs uppercase tracking-wider text-red-400 mb-2">Danger Zone</p>
        {!resetConfirm ? (
          <button
            onClick={() => setResetConfirm(true)}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Reset to group 1
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-500">Reset all progress for all guests?</p>
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 border border-charcoal/20 py-2 rounded-lg text-sm hover:bg-charcoal/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminView() {
  const [auth, setAuth] = useState<AuthState>('loading')

  useEffect(() => {
    const stored = sessionStorage.getItem('photoAdminAuth')
    setAuth(stored === 'true' ? 'unlocked' : 'locked')
  }, [])

  if (auth === 'loading') {
    return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" /></div>
  }

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

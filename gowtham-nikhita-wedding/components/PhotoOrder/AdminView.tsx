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
  const [saving, setSaving] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase
      .from('photo_order')
      .select('current_index')
      .eq('id', 'wedding')
      .single()
      .then(({ data }) => { if (data) setCurrentIndex(data.current_index) })
  }, [])

  const updateIndex = async (newIndex: number) => {
    setSaving(true)
    const supabase = createSupabaseClient()
    await supabase
      .from('photo_order')
      .update({ current_index: newIndex, updated_at: new Date().toISOString() })
      .eq('id', 'wedding')
    setCurrentIndex(newIndex)
    setSaving(false)
    setResetConfirm(false)
  }

  const canPrev = currentIndex > 0
  const canNext = currentIndex < PHOTO_GROUPS.length

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
            {Math.min(currentIndex, PHOTO_GROUPS.length)} / {PHOTO_GROUPS.length} groups
          </span>
        </div>
        <div className="w-full h-2 bg-olive-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold rounded-full"
            animate={{ width: `${(Math.min(currentIndex, PHOTO_GROUPS.length) / PHOTO_GROUPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Current group display */}
      <AnimatePresence mode="wait">
        {currentIndex < PHOTO_GROUPS.length ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gold/10 border-2 border-gold rounded-xl p-5 mb-6 text-center"
          >
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Currently Shooting</p>
            <p className="font-display text-2xl italic text-charcoal">
              #{currentIndex + 1} — {PHOTO_GROUPS[currentIndex].name}
            </p>
            <p className="text-sm text-charcoal/60 mt-1">{PHOTO_GROUPS[currentIndex].description}</p>
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

      {/* Nav buttons — big for day-of use */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => canPrev && updateIndex(currentIndex - 1)}
          disabled={!canPrev || saving}
          className="py-5 rounded-xl border-2 border-olive-mid text-olive-dark font-semibold text-lg disabled:opacity-30 hover:bg-olive-light/30 active:scale-95 transition-all"
          aria-label="Previous group"
        >
          ← Previous
        </button>
        <button
          onClick={() => canNext && updateIndex(currentIndex + 1)}
          disabled={!canNext || saving}
          className="py-5 rounded-xl bg-olive-dark text-white font-semibold text-lg disabled:opacity-30 hover:bg-olive-mid active:scale-95 transition-all"
          aria-label="Next group"
        >
          Next Group →
        </button>
      </div>

      {saving && (
        <p className="text-center text-sm text-charcoal/40 mb-4">Saving…</p>
      )}

      {/* Jump to group */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-3">Jump to group</p>
        <div className="space-y-2">
          {PHOTO_GROUPS.map((g, i) => (
            <button
              key={g.index}
              onClick={() => updateIndex(i)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center gap-3 ${
                i === currentIndex
                  ? 'bg-gold/10 border border-gold text-charcoal font-medium'
                  : i < currentIndex
                  ? 'bg-white/50 border border-charcoal/10 text-charcoal/40 line-through'
                  : 'bg-white border border-olive-light hover:border-olive-mid text-charcoal'
              }`}
            >
              <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 ${
                i < currentIndex ? 'bg-charcoal/10 text-charcoal/40' : i === currentIndex ? 'bg-gold text-white' : 'bg-olive-light text-olive-dark'
              }`}>
                {i + 1}
              </span>
              {g.name}
            </button>
          ))}
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
            <p className="text-sm text-red-500">Are you sure? This resets progress for all guests.</p>
            <div className="flex gap-2">
              <button
                onClick={() => updateIndex(0)}
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

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import type { GuestbookEntry } from '@/lib/types'

type AuthState = 'loading' | 'locked' | 'unlocked'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function PinEntry({ onUnlock }: { onUnlock: (pin: string) => void }) {
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
        body: JSON.stringify({ pin, type: 'guestbook' }),
      })
      if (res.ok) {
        sessionStorage.setItem('guestbookAdminPin', pin)
        onUnlock(pin)
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
      <div className="flex justify-center mb-4"><Lock size={36} strokeWidth={2.5} className="text-charcoal/30" /></div>
      <h2 className="font-display text-3xl italic text-charcoal mb-2">Guestbook Review</h2>
      <p className="text-charcoal/50 text-sm mb-8">Enter your 4-digit PIN to approve messages</p>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password" inputMode="numeric" maxLength={4} value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••" autoFocus aria-label="PIN"
          className="w-full text-center text-3xl tracking-widest text-charcoal border-2 border-olive-light rounded-xl py-4 bg-white focus:border-gold focus:outline-none transition-colors"
        />
        {error && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm">
            {error}
          </motion.p>
        )}
        <button type="submit" disabled={pin.length !== 4 || loading}
          className="w-full bg-olive-dark text-white py-3 rounded-xl font-medium tracking-wider uppercase text-sm disabled:opacity-40 hover:bg-olive-mid transition-colors">
          {loading ? 'Checking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

function EntryCard({ entry, busy, onApprove, onHide, onDelete }: {
  entry: GuestbookEntry
  busy: boolean
  onApprove: () => void
  onHide: () => void
  onDelete: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className={`border-2 rounded-2xl p-5 transition-colors ${entry.visible ? 'border-olive-light bg-white' : 'border-gold/40 bg-gold/5'}`}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-display text-xl italic text-charcoal">{entry.name}</p>
          <p className="text-xs text-charcoal/40">{formatDate(entry.created_at)}</p>
        </div>
        <span className={`text-xs rounded-full px-2.5 py-1 shrink-0 ${entry.visible ? 'bg-olive-light/50 text-charcoal/60' : 'bg-gold/20 text-gold-dark'}`}>
          {entry.visible ? 'On the wall' : 'Awaiting review'}
        </span>
      </div>

      <p className="text-charcoal/80 leading-relaxed whitespace-pre-wrap">{entry.message}</p>

      {entry.photo_url && (
        <div className="mt-3 relative w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden border border-olive-light">
          <Image src={entry.photo_url} alt={`Photo from ${entry.name}`} fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {entry.visible ? (
          <button onClick={onHide} disabled={busy}
            className="px-4 py-2 rounded-xl border-2 border-olive-light text-sm text-charcoal/70 hover:border-olive-mid transition-colors disabled:opacity-40">
            Take down
          </button>
        ) : (
          <button onClick={onApprove} disabled={busy}
            className="px-4 py-2 rounded-xl bg-olive-dark text-white text-sm font-medium hover:bg-olive-mid transition-colors disabled:opacity-40">
            Approve
          </button>
        )}
        {confirmDelete ? (
          <>
            <button onClick={onDelete} disabled={busy}
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-40">
              Delete permanently
            </button>
            <button onClick={() => setConfirmDelete(false)} disabled={busy}
              className="px-4 py-2 rounded-xl text-sm text-charcoal/50 hover:text-charcoal transition-colors">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setConfirmDelete(true)} disabled={busy}
            className="px-4 py-2 rounded-xl text-sm text-charcoal/40 hover:text-red-500 transition-colors disabled:opacity-40">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default function GuestbookAdmin() {
  const [auth, setAuth] = useState<AuthState>('loading')
  const [pin, setPin] = useState('')
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('guestbookAdminPin')
    if (saved) { setPin(saved); setAuth('unlocked') } else setAuth('locked')
  }, [])

  const load = useCallback(async (adminPin: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/guestbook', { headers: { 'x-admin-pin': adminPin } })
      if (res.status === 401) {
        sessionStorage.removeItem('guestbookAdminPin')
        setAuth('locked')
        return
      }
      if (!res.ok) throw new Error()
      setEntries(await res.json() as GuestbookEntry[])
    } catch {
      setError('Could not load the guestbook. Try refreshing.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (auth === 'unlocked' && pin) void load(pin) }, [auth, pin, load])

  const setVisible = async (id: string, visible: boolean) => {
    setBusyId(id)
    setError('')
    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify({ id, visible }),
      })
      if (!res.ok) throw new Error()
      setEntries(prev => prev.map(e => e.id === id ? { ...e, visible } : e))
    } catch {
      setError('That change did not save. Try again.')
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string) => {
    setBusyId(id)
    setError('')
    try {
      const res = await fetch('/api/admin/guestbook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch {
      setError('Could not delete that entry. Try again.')
    } finally {
      setBusyId(null)
    }
  }

  if (auth === 'loading') return null
  if (auth === 'locked') return <PinEntry onUnlock={(p) => { setPin(p); setAuth('unlocked') }} />

  const pending = entries.filter(e => !e.visible)
  const live = entries.filter(e => e.visible)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl italic text-charcoal">Guestbook Review</h1>
        <div className="gold-divider w-24 mt-4 mx-auto" />
        <p className="text-charcoal/50 text-sm mt-4">
          {pending.length} awaiting review · {live.length} on the wall
        </p>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>}
      {loading && <p className="text-charcoal/40 text-sm text-center py-8">Loading…</p>}

      {!loading && entries.length === 0 && (
        <p className="text-center text-charcoal/30 py-12">No guestbook entries yet.</p>
      )}

      <AnimatePresence initial={false}>
        {pending.length > 0 && (
          <motion.section key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-12">
            <p className="text-xs uppercase tracking-widest text-gold mb-4">Awaiting review</p>
            <div className="space-y-4">
              {pending.map(e => (
                <EntryCard key={e.id} entry={e} busy={busyId === e.id}
                  onApprove={() => void setVisible(e.id, true)}
                  onHide={() => void setVisible(e.id, false)}
                  onDelete={() => void remove(e.id)} />
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {live.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-4">On the wall</p>
          <div className="space-y-4">
            {live.map(e => (
              <EntryCard key={e.id} entry={e} busy={busyId === e.id}
                onApprove={() => void setVisible(e.id, true)}
                onHide={() => void setVisible(e.id, false)}
                onDelete={() => void remove(e.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RsvpEntry } from '@/lib/types'

type AuthState = 'loading' | 'locked' | 'unlocked'
type SortKey = 'guest_name' | 'created_at' | 'party_size'
type SortDir = 'asc' | 'desc'

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
        body: JSON.stringify({ pin, type: 'rsvp' }),
      })
      if (res.ok) {
        sessionStorage.setItem('rsvpAdminAuth', pin)
        onUnlock(pin)
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
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="font-display text-3xl italic text-charcoal mb-6">RSVP Admin</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="w-full text-center text-3xl tracking-widest border-2 border-olive-light rounded-xl py-4 bg-white focus:border-gold focus:outline-none transition-colors"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!pin || loading}
          className="w-full bg-olive-dark text-white py-3 rounded-xl font-medium disabled:opacity-40 hover:bg-olive-mid transition-colors"
        >
          {loading ? 'Verifying…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

function EventBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-charcoal/70">{label}</span>
        <span className="font-medium text-charcoal">{count} <span className="text-charcoal/40 font-normal">guests · {pct}%</span></span>
      </div>
      <div className="h-2 bg-olive-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

function ExpandableNotes({ notes }: { notes: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(v => !v)} className="text-xs text-gold hover:text-gold-light transition-colors">
        {open ? 'hide note ▲' : 'see note ▼'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-charcoal/50 mt-1 italic leading-relaxed overflow-hidden"
          >
            {notes}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function RsvpAdmin() {
  const [auth, setAuth] = useState<AuthState>('loading')
  const [adminPin, setAdminPin] = useState('')
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'table'>('overview')

  useEffect(() => {
    const stored = sessionStorage.getItem('rsvpAdminAuth')
    if (stored) {
      setAdminPin(stored)
      setAuth('unlocked')
    } else {
      setAuth('locked')
    }
  }, [])

  useEffect(() => {
    if (auth === 'unlocked' && adminPin) fetchRsvps()
  }, [auth, adminPin])

  const fetchRsvps = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps', { headers: { 'x-admin-pin': adminPin } })
      if (!res.ok) throw new Error('Failed')
      setRsvps(await res.json())
    } catch {
      console.error('Failed to fetch RSVPs')
    } finally {
      setLoading(false)
    }
  }

  const deleteRsvp = async (id: string) => {
    if (!confirm('Delete this RSVP?')) return
    try {
      await fetch('/api/admin/rsvps', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ id }),
      })
      setRsvps(prev => prev.filter(r => r.id !== id))
    } catch { /* silent */ }
  }

  const exportCsv = () => {
    const headers = ['Lead Guest', 'Party Members', 'Email', 'Party Size', 'Sangeet', 'Wedding', 'Reception', 'Dietary', 'Hotel', 'Notes', 'Submitted']
    const rows = rsvps.map(r => {
      const members = Array.isArray(r.party_members)
        ? r.party_members.filter(m => m.firstName).map(m => `${m.firstName} ${m.lastName}`.trim()).join('; ')
        : ''
      return [
        r.guest_name, members, r.email, r.party_size,
        r.sangeet ? 'Yes' : 'No',
        r.wedding ? 'Yes' : 'No',
        r.reception ? 'Yes' : 'No',
        r.dietary_restrictions || '',
        r.needs_hotel ? 'Yes' : 'No',
        r.notes || '',
        new Date(r.created_at).toLocaleDateString(),
      ]
    })
    const csv = [headers, ...rows]
      .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `rsvps-${new Date().toISOString().slice(0, 10)}.csv`,
    })
    a.click()
  }

  const stats = useMemo(() => {
    const totalRsvps = rsvps.length
    const totalGuests = rsvps.reduce((s, r) => s + r.party_size, 0)
    const sangeet = rsvps.filter(r => r.sangeet).reduce((s, r) => s + r.party_size, 0)
    const wedding = rsvps.filter(r => r.wedding).reduce((s, r) => s + r.party_size, 0)
    const reception = rsvps.filter(r => r.reception).reduce((s, r) => s + r.party_size, 0)
    const hotel = rsvps.filter(r => r.needs_hotel).length
    const dietary = rsvps.filter(r => r.dietary_restrictions).map(r => ({ name: r.guest_name, note: r.dietary_restrictions! }))
    return { totalRsvps, totalGuests, sangeet, wedding, reception, hotel, dietary }
  }, [rsvps])

  const filtered = useMemo(() => {
    let list = rsvps
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.guest_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'guest_name') cmp = a.guest_name.localeCompare(b.guest_name)
      else if (sortKey === 'party_size') cmp = a.party_size - b.party_size
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rsvps, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    <span className="ml-1 text-charcoal/30">{sortKey !== k ? '↕' : sortDir === 'asc' ? '↑' : '↓'}</span>

  if (auth === 'loading') return null
  if (auth === 'locked') return <PinEntry onUnlock={pin => { setAdminPin(pin); setAuth('unlocked') }} />

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl italic text-charcoal">RSVP Dashboard</h1>
          <p className="text-charcoal/40 text-sm mt-1">{stats.totalRsvps} responses · {stats.totalGuests} total guests</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchRsvps} className="text-sm text-charcoal/50 hover:text-charcoal border border-olive-light rounded-xl px-4 py-2 transition-colors">
            ↻ Refresh
          </button>
          <button onClick={exportCsv} disabled={!rsvps.length} className="bg-gold text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-40">
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-olive-light/40 rounded-xl p-1 mb-8 w-fit">
        {(['overview', 'table'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/50 hover:text-charcoal'}`}
          >
            {tab === 'overview' ? '📊 Overview' : '📋 Guest List'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-charcoal/30">Loading…</div>
      ) : rsvps.length === 0 ? (
        <div className="text-center py-20 text-charcoal/30">
          <p className="font-display text-2xl italic mb-2">No RSVPs yet</p>
          <p className="text-sm">Responses will appear here as guests submit.</p>
        </div>
      ) : activeTab === 'overview' ? (
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Big numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'RSVPs received', value: stats.totalRsvps, emoji: '📬' },
              { label: 'Total guests', value: stats.totalGuests, emoji: '👥' },
              { label: 'Need hotel', value: stats.hotel, emoji: '🏨' },
              { label: 'Dietary notes', value: stats.dietary.length, emoji: '🍽️' },
            ].map(s => (
              <div key={s.label} className="bg-white border-2 border-olive-light rounded-xl p-5 text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="font-display text-4xl italic text-charcoal">{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-charcoal/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Event attendance bars */}
          <div className="bg-white border-2 border-olive-light rounded-xl p-6">
            <h2 className="font-display text-xl italic text-charcoal mb-5">Event Attendance</h2>
            <div className="space-y-4">
              <EventBar label="🎶 Sangeet — Feb 16" count={stats.sangeet} total={stats.totalGuests} color="bg-olive-mid" />
              <EventBar label="🪔 Muhurtham — Feb 17 Morning" count={stats.wedding} total={stats.totalGuests} color="bg-gold" />
              <EventBar label="🥂 Reception — Feb 17 Evening" count={stats.reception} total={stats.totalGuests} color="bg-olive-dark" />
            </div>
          </div>

          {/* Dietary restrictions */}
          {stats.dietary.length > 0 && (
            <div className="bg-white border-2 border-olive-light rounded-xl p-6">
              <h2 className="font-display text-xl italic text-charcoal mb-4">Dietary Restrictions</h2>
              <div className="space-y-2">
                {stats.dietary.map((d, i) => (
                  <div key={i} className="flex items-baseline gap-3 text-sm">
                    <span className="font-medium text-charcoal w-40 shrink-0 truncate">{d.name}</span>
                    <span className="text-charcoal/50">{d.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent RSVPs */}
          <div className="bg-white border-2 border-olive-light rounded-xl p-6">
            <h2 className="font-display text-xl italic text-charcoal mb-4">Recent RSVPs</h2>
            <div className="space-y-3">
              {rsvps.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-charcoal">{r.guest_name}</span>
                    <span className="text-charcoal/40 ml-2">party of {r.party_size}</span>
                  </div>
                  <span className="text-charcoal/30 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              ))}
              {rsvps.length > 5 && (
                <button onClick={() => setActiveTab('table')} className="text-xs text-gold hover:text-gold-light transition-colors">
                  View all {rsvps.length} RSVPs →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors mb-4"
          />

          <div className="overflow-x-auto rounded-xl border-2 border-olive-light">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-olive-light/50 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer" onClick={() => toggleSort('guest_name')}>
                    Name <SortIcon k="guest_name" />
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer text-center" onClick={() => toggleSort('party_size')}>
                    Party <SortIcon k="party_size" />
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60">Events</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 hidden md:table-cell">Dietary</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 text-center">Hotel</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer hidden lg:table-cell" onClick={() => toggleSort('created_at')}>
                    Submitted <SortIcon k="created_at" />
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-charcoal/30">No results.</td>
                  </tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-t border-olive-light/50 hover:bg-olive-light/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-charcoal">{r.guest_name}</span>
                      {Array.isArray(r.party_members) && r.party_members.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {r.party_members.filter(m => m.firstName).map((m, i) => (
                            <div key={i} className="text-xs text-charcoal/40">
                              + {m.firstName} {m.lastName}
                            </div>
                          ))}
                        </div>
                      )}
                      {r.notes && <ExpandableNotes notes={r.notes} />}
                    </td>
                    <td className="px-4 py-3 text-charcoal/50 hidden sm:table-cell">{r.email}</td>
                    <td className="px-4 py-3 text-center text-charcoal">{r.party_size}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {r.sangeet && <span className="text-xs text-olive-mid">🎶 Sangeet</span>}
                        {r.wedding && <span className="text-xs text-gold">🪔 Muhurtham</span>}
                        {r.reception && <span className="text-xs text-charcoal/60">🥂 Reception</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/50 text-xs hidden md:table-cell">{r.dietary_restrictions || '—'}</td>
                    <td className="px-4 py-3 text-center">{r.needs_hotel ? '🏨 Yes' : '—'}</td>
                    <td className="px-4 py-3 text-charcoal/30 text-xs hidden lg:table-cell">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteRsvp(r.id)} className="text-red-300 hover:text-red-500 transition-colors text-xs" title="Delete">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}

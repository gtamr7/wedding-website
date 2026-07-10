'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RsvpSubmission, GuestbookEntry } from '@/lib/types'

type AuthState = 'loading' | 'locked' | 'unlocked'
type SortKey = 'submitted_by' | 'submitted_at' | 'attending_count'
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
          className="w-full text-center text-3xl tracking-widest text-charcoal border-2 border-olive-light rounded-xl py-4 bg-white focus:border-gold focus:outline-none transition-colors"
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
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('submitted_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'guestbook'>('overview')
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([])
  const [gbLoading, setGbLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('rsvpAdminAuth')
    if (stored) { setAdminPin(stored); setAuth('unlocked') }
    else setAuth('locked')
  }, [])

  useEffect(() => {
    if (auth === 'unlocked' && adminPin) fetchRsvps()
  }, [auth, adminPin])

  useEffect(() => {
    if (auth === 'unlocked' && adminPin && activeTab === 'guestbook') fetchGuestbook()
  }, [auth, adminPin, activeTab])

  const fetchRsvps = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps', { headers: { 'x-admin-pin': adminPin } })
      if (!res.ok) throw new Error('Failed')
      setSubmissions(await res.json())
    } catch {
      console.error('Failed to fetch RSVPs')
    } finally {
      setLoading(false)
    }
  }

  const fetchGuestbook = async () => {
    setGbLoading(true)
    try {
      const res = await fetch('/api/admin/guestbook', { headers: { 'x-admin-pin': adminPin } })
      if (res.ok) setGuestbook(await res.json())
    } finally {
      setGbLoading(false)
    }
  }

  const deleteGuestbookEntry = async (id: string) => {
    setGuestbook(prev => prev.filter(e => e.id !== id))
    try {
      await fetch('/api/admin/guestbook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ id }),
      })
    } catch { fetchGuestbook() }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this RSVP submission?')) return
    try {
      await fetch('/api/admin/rsvps', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ id }),
      })
      setSubmissions(prev => prev.filter(s => s.id !== id))
    } catch { /* silent */ }
  }

  // CSV export — one row per guest (most useful for catering / seating)
  const exportCsv = () => {
    const headers = [
      'Submitted By', 'Email', 'Hotel Needed', 'Notes', 'Submitted',
      'Guest Name', 'Attending', 'Sangeet (Feb 17)', 'Ceremony (Feb 18)', 'Reception (Feb 18)', 'Dietary Restrictions',
    ]
    const rows: string[][] = []
    for (const s of submissions) {
      for (const g of s.guests) {
        rows.push([
          s.submitted_by,
          s.contact_email ?? '',
          s.needs_hotel ? 'Yes' : 'No',
          s.notes ?? '',
          new Date(s.submitted_at).toLocaleDateString(),
          g.name,
          g.attending ? 'Yes' : 'No',
          g.sangeet ? 'Yes' : 'No',
          g.wedding ? 'Yes' : 'No',
          g.reception ? 'Yes' : 'No',
          g.dietary ?? '',
        ])
      }
    }
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
    const allGuests = submissions.flatMap(s => s.guests.filter(g => g.attending))
    return {
      totalSubmissions: submissions.length,
      totalGuests: allGuests.length,
      sangeet: allGuests.filter(g => g.sangeet).length,
      wedding: allGuests.filter(g => g.wedding).length,
      reception: allGuests.filter(g => g.reception).length,
      hotel: submissions.filter(s => s.needs_hotel).length,
      dietary: allGuests
        .filter(g => g.dietary)
        .map(g => ({ name: g.name, note: g.dietary! })),
    }
  }, [submissions])

  const filtered = useMemo(() => {
    let list = submissions
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.submitted_by.toLowerCase().includes(q) ||
        (s.contact_email ?? '').toLowerCase().includes(q) ||
        s.guests.some(g => g.name.toLowerCase().includes(q))
      )
    }
    return [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'submitted_by') cmp = a.submitted_by.localeCompare(b.submitted_by)
      else if (sortKey === 'attending_count') cmp = a.attending_count - b.attending_count
      else cmp = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [submissions, search, sortKey, sortDir])

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
          <p className="text-charcoal/40 text-sm mt-1">{stats.totalSubmissions} submissions · {stats.totalGuests} attending guests</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchRsvps} className="text-sm text-charcoal/50 hover:text-charcoal border border-olive-light rounded-xl px-4 py-2 transition-colors">
            ↻ Refresh
          </button>
          <button onClick={exportCsv} disabled={!submissions.length} className="bg-gold text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-40">
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-olive-light/40 rounded-xl p-1 mb-8 w-fit">
        {(['overview', 'table', 'guestbook'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/50 hover:text-charcoal'}`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'table' ? '📋 Guest List' : '💌 Guestbook'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-charcoal/30">Loading…</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-charcoal/30">
          <p className="font-display text-2xl italic mb-2">No RSVPs yet</p>
          <p className="text-sm">Responses will appear here as guests submit.</p>
        </div>
      ) : activeTab === 'overview' ? (
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Submissions', value: stats.totalSubmissions, emoji: '📬' },
              { label: 'Total attending', value: stats.totalGuests, emoji: '👥' },
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

          <div className="bg-white border-2 border-olive-light rounded-xl p-6">
            <h2 className="font-display text-xl italic text-charcoal mb-5">Event Attendance</h2>
            <div className="space-y-4">
              <EventBar label="🎶 Sangeet — Feb 17" count={stats.sangeet} total={stats.totalGuests} color="bg-olive-mid" />
              <EventBar label="🪔 Ceremony (Kalyaanam) — Feb 18 Morning" count={stats.wedding} total={stats.totalGuests} color="bg-gold" />
              <EventBar label="🥂 Reception — Feb 18 Evening" count={stats.reception} total={stats.totalGuests} color="bg-olive-dark" />
            </div>
          </div>

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

          <div className="bg-white border-2 border-olive-light rounded-xl p-6">
            <h2 className="font-display text-xl italic text-charcoal mb-4">Recent Submissions</h2>
            <div className="space-y-3">
              {submissions.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-charcoal">{s.submitted_by}</span>
                    <span className="text-charcoal/40 ml-2">{s.attending_count} attending</span>
                  </div>
                  <span className="text-charcoal/30 text-xs">{new Date(s.submitted_at).toLocaleDateString()}</span>
                </div>
              ))}
              {submissions.length > 5 && (
                <button onClick={() => setActiveTab('table')} className="text-xs text-gold hover:text-gold-light transition-colors">
                  View all {submissions.length} submissions →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : activeTab === 'guestbook' ? (
        <motion.div key="guestbook" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-charcoal/50">{guestbook.length} entries</p>
            <button onClick={fetchGuestbook} className="text-sm text-charcoal/50 hover:text-charcoal border border-olive-light rounded-xl px-4 py-2 transition-colors">
              ↻ Refresh
            </button>
          </div>
          {gbLoading ? (
            <div className="text-center py-20 text-charcoal/30">Loading…</div>
          ) : guestbook.length === 0 ? (
            <div className="text-center py-20 text-charcoal/30 font-display text-2xl italic">No entries yet</div>
          ) : (
            <div className="space-y-3">
              {guestbook.map(entry => (
                <div key={entry.id} className="flex items-start gap-4 bg-white border-2 border-olive-light rounded-xl px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <p className="font-medium text-charcoal">{entry.name}</p>
                      <p className="text-xs text-charcoal/30">{new Date(entry.created_at).toLocaleDateString()}</p>
                      {!entry.visible && <span className="text-xs text-red-400 border border-red-200 rounded-full px-2">hidden</span>}
                    </div>
                    <p className="text-sm text-charcoal/60 mt-1 leading-relaxed">{entry.message}</p>
                    {entry.photo_url && (
                      <a href={entry.photo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:text-gold-light mt-1 inline-block">📷 View photo</a>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGuestbookEntry(entry.id)}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-red-300 hover:text-white hover:bg-red-400 transition-all border border-red-200 hover:border-red-400"
                    title="Delete"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer" onClick={() => toggleSort('submitted_by')}>
                    Submitted By <SortIcon k="submitted_by" />
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer text-center" onClick={() => toggleSort('attending_count')}>
                    Count <SortIcon k="attending_count" />
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60">Guests & Events</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 text-center">Hotel</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-charcoal/60 hidden lg:table-cell cursor-pointer" onClick={() => toggleSort('submitted_at')}>
                    Submitted <SortIcon k="submitted_at" />
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-charcoal/30">No results.</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="border-t border-olive-light/50 hover:bg-olive-light/20 transition-colors align-top">
                    <td className="px-4 py-3">
                      <span className="font-medium text-charcoal">{s.submitted_by}</span>
                      {s.notes && <div className="mt-1"><ExpandableNotes notes={s.notes} /></div>}
                    </td>
                    <td className="px-4 py-3 text-charcoal/50 hidden sm:table-cell">{s.contact_email ?? '—'}</td>
                    <td className="px-4 py-3 text-center text-charcoal">{s.attending_count}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        {s.guests.map(g => (
                          <div key={g.id} className="text-xs">
                            <span className={`font-medium ${g.attending ? 'text-charcoal' : 'text-charcoal/30 line-through'}`}>{g.name}</span>
                            {g.attending && (
                              <span className="ml-2 space-x-1">
                                {g.sangeet && <span className="text-olive-mid">🎶</span>}
                                {g.wedding && <span className="text-gold">🪔</span>}
                                {g.reception && <span className="text-charcoal/60">🥂</span>}
                              </span>
                            )}
                            {g.dietary && <span className="ml-2 text-charcoal/40 italic">({g.dietary})</span>}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{s.needs_hotel ? '🏨 Yes' : '—'}</td>
                    <td className="px-4 py-3 text-charcoal/30 text-xs hidden lg:table-cell">
                      {new Date(s.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteSubmission(s.id)} className="text-red-300 hover:text-red-500 transition-colors text-xs" title="Delete">✕</button>
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

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'
import type { RsvpEntry } from '@/lib/types'

type AuthState = 'loading' | 'locked' | 'unlocked'
type SortKey = 'guest_name' | 'created_at' | 'party_size'
type SortDir = 'asc' | 'desc'

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
        body: JSON.stringify({ pin, type: 'rsvp' }),
      })
      if (res.ok) {
        sessionStorage.setItem('rsvpAdminAuth', 'true')
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
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="font-display text-3xl italic text-charcoal mb-6">RSVP Admin</h2>
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
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={pin.length !== 4 || loading}
          className="w-full bg-olive-dark text-white py-3 rounded-xl font-medium disabled:opacity-40 hover:bg-olive-mid transition-colors"
        >
          {loading ? 'Verifying…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: number | string; emoji: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-olive-light rounded-xl p-4 text-center"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-display text-3xl italic text-charcoal">{value}</div>
      <div className="text-xs uppercase tracking-widest text-charcoal/40 mt-1">{label}</div>
    </motion.div>
  )
}

export default function RsvpAdmin() {
  const [auth, setAuth] = useState<AuthState>('loading')
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('rsvpAdminAuth') === 'true') {
      setAuth('unlocked')
    } else {
      setAuth('locked')
    }
  }, [])

  useEffect(() => {
    if (auth !== 'unlocked') return
    fetchRsvps()
  }, [auth])

  const fetchRsvps = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRsvps(data || [])
    } catch (err) {
      console.error('Failed to fetch RSVPs:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteRsvp = async (id: string) => {
    if (!confirm('Delete this RSVP?')) return
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('rsvps').delete().eq('id', id)
      if (error) throw error
      setRsvps((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete RSVP:', err)
    }
  }

  const exportCsv = () => {
    const headers = ['Name', 'Email', 'Party Size', 'Sangeet', 'Wedding', 'Reception', 'Dietary Restrictions', 'Needs Hotel', 'Notes', 'Submitted']
    const rows = rsvps.map((r) => [
      r.guest_name,
      r.email,
      r.party_size,
      r.sangeet ? 'Yes' : 'No',
      r.wedding ? 'Yes' : 'No',
      r.reception ? 'Yes' : 'No',
      r.dietary_restrictions || '',
      r.needs_hotel ? 'Yes' : 'No',
      r.notes || '',
      new Date(r.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = useMemo(() => {
    let list = rsvps
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.guest_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      )
    }
    list = [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'guest_name') cmp = a.guest_name.localeCompare(b.guest_name)
      else if (sortKey === 'party_size') cmp = a.party_size - b.party_size
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [rsvps, search, sortKey, sortDir])

  const stats = useMemo(() => {
    const total = rsvps.length
    const totalGuests = rsvps.reduce((s, r) => s + r.party_size, 0)
    const sangeetCount = rsvps.filter((r) => r.sangeet).reduce((s, r) => s + r.party_size, 0)
    const weddingCount = rsvps.filter((r) => r.wedding).reduce((s, r) => s + r.party_size, 0)
    const receptionCount = rsvps.filter((r) => r.reception).reduce((s, r) => s + r.party_size, 0)
    const hotelCount = rsvps.filter((r) => r.needs_hotel).length
    return { total, totalGuests, sangeetCount, weddingCount, receptionCount, hotelCount }
  }, [rsvps])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕'
    return sortDir === 'asc' ? '↑' : '↓'
  }

  if (auth === 'loading') return null
  if (auth === 'locked') return <PinEntry onUnlock={() => setAuth('unlocked')} />

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl italic text-charcoal">RSVP Dashboard</h1>
        <div className="gold-divider w-24 mt-4 mx-auto" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard emoji="📬" label="RSVPs" value={stats.total} />
        <StatCard emoji="👥" label="Total Guests" value={stats.totalGuests} />
        <StatCard emoji="🎶" label="Sangeet" value={stats.sangeetCount} />
        <StatCard emoji="💍" label="Wedding" value={stats.weddingCount} />
        <StatCard emoji="🥂" label="Reception" value={stats.receptionCount} />
        <StatCard emoji="🏨" label="Need Hotel" value={stats.hotelCount} />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
        />
        <button
          onClick={exportCsv}
          disabled={rsvps.length === 0}
          className="bg-gold text-white px-6 py-3 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-gold-light transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          Export CSV 📥
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-charcoal/40">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-charcoal/40">
          {rsvps.length === 0 ? 'No RSVPs yet.' : 'No results match your search.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border-2 border-olive-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-olive-light/50 text-left">
                <th
                  className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer hover:text-charcoal transition-colors"
                  onClick={() => toggleSort('guest_name')}
                >
                  Name {sortIcon('guest_name')}
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 hidden sm:table-cell">
                  Email
                </th>
                <th
                  className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer hover:text-charcoal transition-colors text-center"
                  onClick={() => toggleSort('party_size')}
                >
                  Party {sortIcon('party_size')}
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 text-center">
                  Events
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 hidden md:table-cell">
                  Dietary
                </th>
                <th className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 text-center">
                  Hotel
                </th>
                <th
                  className="px-4 py-3 font-medium text-xs uppercase tracking-widest text-charcoal/60 cursor-pointer hover:text-charcoal transition-colors hidden lg:table-cell"
                  onClick={() => toggleSort('created_at')}
                >
                  Date {sortIcon('created_at')}
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-t border-olive-light/50 hover:bg-olive-light/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-charcoal">
                      {r.guest_name}
                      {r.notes && (
                        <span className="block text-xs text-charcoal/40 mt-0.5 truncate max-w-[200px]" title={r.notes}>
                          💬 {r.notes}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-charcoal/60 hidden sm:table-cell">{r.email}</td>
                    <td className="px-4 py-3 text-center">{r.party_size}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {r.sangeet && <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">S</span>}
                        {r.wedding && <span className="text-xs bg-olive-dark/10 text-olive-dark px-2 py-0.5 rounded-full">W</span>}
                        {r.reception && <span className="text-xs bg-charcoal/10 text-charcoal px-2 py-0.5 rounded-full">R</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/50 text-xs hidden md:table-cell">
                      {r.dietary_restrictions || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.needs_hotel ? '🏨' : '—'}
                    </td>
                    <td className="px-4 py-3 text-charcoal/40 text-xs hidden lg:table-cell">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRsvp(r.id)}
                        className="text-red-400 hover:text-red-600 transition-colors text-xs"
                        title="Delete RSVP"
                      >
                        ✕
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

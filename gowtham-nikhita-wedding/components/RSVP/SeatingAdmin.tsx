'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Armchair } from 'lucide-react'
import { SangeetIcon, DiyaIcon, CheersIcon } from '@/components/icons/EventIcons'
import type { RsvpEntry } from '@/lib/types'

type AuthState = 'loading' | 'locked' | 'unlocked'

// ── PIN entry ───────────────────────────────────────────────────────────────

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
      <div className="flex justify-center mb-4"><Armchair size={40} strokeWidth={2.5} className="text-charcoal/30" /></div>
      <h2 className="font-display text-3xl italic text-charcoal mb-6">Seating Chart</h2>
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

// ── Party card ───────────────────────────────────────────────────────────────

function PartyCard({
  party,
  onDragStart,
  dimmed,
}: {
  party: RsvpEntry
  onDragStart: () => void
  dimmed?: boolean
}) {
  const members = Array.isArray(party.party_members)
    ? party.party_members.filter((m) => m.firstName)
    : []

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', party.id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart()
      }}
      className={`p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing bg-white select-none transition-opacity
        ${dimmed ? 'opacity-40' : 'border-olive-light hover:border-olive-mid hover:shadow-sm'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-charcoal text-sm leading-snug">{party.guest_name}</span>
        <span className="shrink-0 text-[11px] bg-olive-light text-charcoal/60 rounded-full px-2 py-0.5 font-medium">
          ×{party.party_size}
        </span>
      </div>
      {members.map((m, i) => (
        <div key={i} className="text-xs text-charcoal/35 mt-0.5 leading-snug">
          + {m.firstName} {m.lastName}
        </div>
      ))}
      <div className="flex items-center gap-2 mt-1.5">
        {party.sangeet   && <SangeetIcon size={11} className="text-olive-mid" aria-label="Sangeet" />}
        {party.wedding   && <DiyaIcon   size={11} className="text-gold"      aria-label="Muhurtham" />}
        {party.reception && <CheersIcon size={11} className="text-charcoal/50" aria-label="Reception" />}
        {party.dietary_restrictions && (
          <span
            className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded px-1 py-0.5 leading-none"
            title={party.dietary_restrictions}
          >
            dietary
          </span>
        )}
      </div>
    </div>
  )
}

// ── Table slot ───────────────────────────────────────────────────────────────

function TableSlot({
  tableNum,
  parties,
  capacity,
  onDrop,
  onDragStart,
  isOver,
  onDragOver,
  onDragLeave,
}: {
  tableNum: number
  parties: RsvpEntry[]
  capacity: number
  onDrop: (rsvpId: string, tableNum: number) => void
  onDragStart: (id: string) => void
  isOver: boolean
  onDragOver: () => void
  onDragLeave: () => void
}) {
  const seated = parties.reduce((s, p) => s + p.party_size, 0)
  const pct = capacity > 0 ? Math.round((seated / capacity) * 100) : 0
  const full = seated >= capacity

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); onDragOver() }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault()
        const id = e.dataTransfer.getData('text/plain')
        if (id) onDrop(id, tableNum)
        onDragLeave()
      }}
      className={`rounded-xl border-2 p-3 transition-all min-h-[120px] flex flex-col
        ${isOver
          ? 'border-gold bg-gold/8 shadow-md'
          : full
            ? 'border-olive-mid/40 bg-olive-light/20'
            : 'border-olive-light bg-white'
        }`}
    >
      {/* Table header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-charcoal text-sm">Table {tableNum}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 bg-olive-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${full ? 'bg-olive-mid' : 'bg-gold/60'}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <span className={`text-[11px] ${full ? 'text-olive-mid font-medium' : 'text-charcoal/40'}`}>
            {seated}/{capacity}
          </span>
        </div>
      </div>

      {/* Parties at this table */}
      <div className="space-y-2 flex-1">
        {parties.map((p) => (
          <PartyCard key={p.id} party={p} onDragStart={() => onDragStart(p.id)} />
        ))}
        {parties.length === 0 && (
          <div className={`flex-1 flex items-center justify-center py-3 rounded-lg border border-dashed text-xs
            ${isOver ? 'border-gold text-gold' : 'border-olive-light/60 text-charcoal/20'}`}
          >
            {isOver ? 'Drop here' : 'Empty'}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function SeatingAdmin() {
  const [auth, setAuth] = useState<AuthState>('loading')
  const [adminPin, setAdminPin] = useState('')
  const [parties, setParties] = useState<RsvpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tableCount, setTableCount] = useState(10)
  const [seatsPerTable, setSeatsPerTable] = useState(8)
  const [dragOverZone, setDragOverZone] = useState<number | 'unassigned' | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [migrationNeeded, setMigrationNeeded] = useState(false)
  const draggingId = useRef<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('rsvpAdminAuth')
    if (stored) { setAdminPin(stored); setAuth('unlocked') }
    else setAuth('locked')
  }, [])

  useEffect(() => {
    if (auth === 'unlocked' && adminPin) fetchParties()
  }, [auth, adminPin])

  const fetchParties = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps', { headers: { 'x-admin-pin': adminPin } })
      if (!res.ok) throw new Error('Failed')
      const data: RsvpEntry[] = await res.json()
      setParties(data)
      // Detect if table_number column exists (will be absent from all rows if not migrated)
      if (data.length > 0 && !('table_number' in data[0])) setMigrationNeeded(true)
    } catch {
      console.error('Failed to fetch parties')
    } finally {
      setLoading(false)
    }
  }

  const assignTable = async (rsvpId: string, tableNum: number | null) => {
    setParties((prev) =>
      prev.map((p) => p.id === rsvpId ? { ...p, table_number: tableNum } : p)
    )
    setSaving(true)
    setSaveError(false)
    try {
      const res = await fetch('/api/admin/seating', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ id: rsvpId, table_number: tableNum }),
      })
      if (!res.ok) throw new Error('Save failed')
    } catch {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const autoFill = async () => {
    const unassigned = [...parties.filter((p) => !p.table_number)]
      .sort((a, b) => b.party_size - a.party_size)

    const assignments: { [tableNum: number]: number } = {}
    for (let t = 1; t <= tableCount; t++) {
      assignments[t] = parties
        .filter((p) => p.table_number === t)
        .reduce((s, p) => s + p.party_size, 0)
    }

    const updates: { id: string; table_number: number }[] = []
    for (const party of unassigned) {
      for (let t = 1; t <= tableCount; t++) {
        if ((assignments[t] ?? 0) + party.party_size <= seatsPerTable) {
          assignments[t] = (assignments[t] ?? 0) + party.party_size
          updates.push({ id: party.id, table_number: t })
          break
        }
      }
    }

    if (updates.length === 0) return

    setParties((prev) =>
      prev.map((p) => {
        const u = updates.find((u) => u.id === p.id)
        return u ? { ...p, table_number: u.table_number } : p
      })
    )

    setSaving(true)
    try {
      await fetch('/api/admin/seating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ assignments: updates }),
      })
    } catch {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const exportCsv = () => {
    const rows = [...parties]
      .sort((a, b) => (a.table_number ?? 999) - (b.table_number ?? 999))
      .map((p) => {
        const members = Array.isArray(p.party_members)
          ? p.party_members.filter((m) => m.firstName).map((m) => `${m.firstName} ${m.lastName}`.trim()).join('; ')
          : ''
        const events = [p.sangeet && 'Sangeet', p.wedding && 'Muhurtham', p.reception && 'Reception']
          .filter(Boolean).join(', ')
        return [
          p.table_number ?? 'Unassigned',
          p.guest_name,
          members,
          p.party_size,
          events,
          p.dietary_restrictions ?? '',
        ]
      })

    const headers = ['Table', 'Lead Guest', 'Party Members', 'Party Size', 'Events', 'Dietary']
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `seating-${new Date().toISOString().slice(0, 10)}.csv`,
    })
    a.click()
  }

  const clearAll = async () => {
    if (!confirm('Clear all table assignments?')) return
    const updates = parties.filter((p) => p.table_number).map((p) => ({ id: p.id, table_number: null }))
    setParties((prev) => prev.map((p) => ({ ...p, table_number: null })))
    setSaving(true)
    try {
      await fetch('/api/admin/seating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': adminPin },
        body: JSON.stringify({ assignments: updates }),
      })
    } catch { /* silent */ }
    finally { setSaving(false) }
  }

  const stats = useMemo(() => {
    const totalParties = parties.length
    const totalGuests = parties.reduce((s, p) => s + p.party_size, 0)
    const assigned = parties.filter((p) => p.table_number)
    const assignedGuests = assigned.reduce((s, p) => s + p.party_size, 0)
    const unassigned = totalParties - assigned.length
    return { totalParties, totalGuests, assignedGuests, unassigned }
  }, [parties])

  const partiesAtTable = (t: number) => parties.filter((p) => p.table_number === t)
  const unassignedParties = parties.filter((p) => !p.table_number)

  if (auth === 'loading') return null
  if (auth === 'locked') return <PinEntry onUnlock={(pin) => { setAdminPin(pin); setAuth('unlocked') }} />

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl italic text-charcoal">Seating Chart</h1>
          <p className="text-charcoal/40 text-sm mt-1">
            {stats.totalParties} parties · {stats.totalGuests} guests ·{' '}
            <span className={stats.unassigned > 0 ? 'text-amber-500' : 'text-olive-mid'}>
              {stats.unassigned} unassigned
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            saveError ? 'bg-red-50 border-red-200 text-red-500' :
            saving    ? 'bg-gold/10 border-gold/30 text-gold' :
                        'bg-olive-light/30 border-olive-light text-charcoal/30'
          }`}>
            {saveError ? 'Save failed' : saving ? 'Saving…' : 'Saved'}
          </span>
          <button
            onClick={autoFill}
            disabled={unassignedParties.length === 0 || saving}
            className="bg-olive-dark text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-olive-mid transition-colors disabled:opacity-40"
          >
            Auto-fill
          </button>
          <button
            onClick={exportCsv}
            disabled={parties.length === 0}
            className="bg-gold text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            onClick={clearAll}
            disabled={saving}
            className="border-2 border-olive-light text-charcoal/50 px-4 py-2 rounded-xl text-sm hover:border-olive-mid transition-colors disabled:opacity-40"
          >
            Clear all
          </button>
          <button
            onClick={fetchParties}
            className="border-2 border-olive-light text-charcoal/50 px-3 py-2 rounded-xl text-sm hover:border-olive-mid transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Migration warning */}
      <AnimatePresence>
        {migrationNeeded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800"
          >
            <p className="font-medium mb-1">One SQL command needed to enable saving</p>
            <code className="block bg-amber-100 rounded-lg px-3 py-2 text-xs font-mono mt-2">
              ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS table_number INTEGER;
            </code>
            <p className="text-xs text-amber-600 mt-1">
              Run this in the{' '}
              <a
                href="https://supabase.com/dashboard/project/ljibbrlsckvuqvgfhxsg/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Supabase SQL editor
              </a>
              . Drag-and-drop still works — assignments just won&apos;t persist yet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table config */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white border-2 border-olive-light rounded-xl">
        <label className="flex items-center gap-2 text-sm text-charcoal/60">
          Tables
          <div className="flex items-center border-2 border-olive-light rounded-lg overflow-hidden">
            <button
              onClick={() => setTableCount((n) => Math.max(1, n - 1))}
              className="px-3 py-1.5 hover:bg-olive-light/50 transition-colors font-medium text-charcoal"
            >
              −
            </button>
            <span className="px-3 py-1.5 font-medium text-charcoal w-8 text-center">{tableCount}</span>
            <button
              onClick={() => setTableCount((n) => n + 1)}
              className="px-3 py-1.5 hover:bg-olive-light/50 transition-colors font-medium text-charcoal"
            >
              +
            </button>
          </div>
        </label>
        <label className="flex items-center gap-2 text-sm text-charcoal/60">
          Seats per table
          <input
            type="number"
            min={1}
            max={30}
            value={seatsPerTable}
            onChange={(e) => setSeatsPerTable(Math.max(1, Number(e.target.value)))}
            className="w-16 border-2 border-olive-light rounded-lg px-2 py-1.5 text-center text-charcoal font-medium focus:border-gold focus:outline-none transition-colors"
          />
        </label>
        <p className="text-xs text-charcoal/30 self-center">
          Total capacity: {tableCount * seatsPerTable} seats for {stats.totalGuests} guests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-charcoal/30">Loading…</div>
      ) : parties.length === 0 ? (
        <div className="text-center py-20 text-charcoal/30">
          <p className="font-display text-2xl italic mb-2">No RSVPs yet</p>
          <p className="text-sm">Parties will appear here once guests RSVP.</p>
        </div>
      ) : (
        <div className="flex gap-6 items-start">

          {/* Unassigned sidebar */}
          <div className="w-64 shrink-0">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOverZone('unassigned') }}
              onDragLeave={() => setDragOverZone(null)}
              onDrop={(e) => {
                e.preventDefault()
                const id = e.dataTransfer.getData('text/plain')
                if (id) assignTable(id, null)
                setDragOverZone(null)
              }}
              className={`rounded-xl border-2 p-3 min-h-[200px] transition-all
                ${dragOverZone === 'unassigned' ? 'border-gold bg-gold/5' : 'border-olive-light bg-olive-light/20'}`}
            >
              <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-3 font-medium">
                Unassigned · {unassignedParties.length}
              </p>
              <div className="space-y-2">
                {unassignedParties.map((p) => (
                  <PartyCard
                    key={p.id}
                    party={p}
                    onDragStart={() => { draggingId.current = p.id }}
                  />
                ))}
                {unassignedParties.length === 0 && (
                  <p className="text-xs text-charcoal/25 text-center py-4">All assigned!</p>
                )}
              </div>
            </div>
          </div>

          {/* Tables grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: tableCount }, (_, i) => i + 1).map((t) => (
              <TableSlot
                key={t}
                tableNum={t}
                parties={partiesAtTable(t)}
                capacity={seatsPerTable}
                isOver={dragOverZone === t}
                onDragOver={() => setDragOverZone(t)}
                onDragLeave={() => setDragOverZone(null)}
                onDragStart={(id) => { draggingId.current = id }}
                onDrop={(rsvpId, tableNum) => {
                  assignTable(rsvpId, tableNum)
                  setDragOverZone(null)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

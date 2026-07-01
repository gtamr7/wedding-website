'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GuestbookEntry } from '@/lib/types'
import GuestbookForm from './GuestbookForm'

const COLORS = [
  'bg-olive-light/60 border-olive-mid/20',
  'bg-gold/5 border-gold/20',
  'bg-ivory border-olive-light',
  'bg-olive-light/30 border-olive-light',
  'bg-white border-olive-light',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function GuestbookWall({ initialEntries }: { initialEntries: GuestbookEntry[] }) {
  const [entries, setEntries] = useState(initialEntries)

  const handleNewEntry = (name: string, message: string) => {
    const newEntry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name,
      message,
      visible: true,
      created_at: new Date().toISOString(),
    }
    setEntries((prev) => [newEntry, ...prev])
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Submit form */}
      <div className="max-w-lg mx-auto mb-16">
        <GuestbookForm onSubmit={handleNewEntry} />
      </div>

      {/* Gold divider */}
      <div className="gold-divider w-48 mx-auto mb-12 opacity-60" />

      {/* Entry wall */}
      {entries.length === 0 ? (
        <div className="text-center text-charcoal/30 py-12">
          <p className="font-display text-2xl italic">Be the first to leave a wish</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                className={`break-inside-avoid rounded-xl border p-5 ${COLORS[i % COLORS.length]}`}
              >
                <p className="text-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap">
                  &ldquo;{entry.message}&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between">
                  <p className="font-display text-base italic text-charcoal">{entry.name}</p>
                  <p className="text-[10px] text-charcoal/30">{formatDate(entry.created_at)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

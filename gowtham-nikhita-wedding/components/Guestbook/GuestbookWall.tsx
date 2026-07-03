'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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
  const [lightbox, setLightbox] = useState<string | null>(null)

  const handleNewEntry = (name: string, message: string, photoUrl?: string) => {
    const newEntry: GuestbookEntry = {
      id:         crypto.randomUUID(),
      name,
      message,
      photo_url:  photoUrl ?? null,
      visible:    true,
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
                className={`break-inside-avoid rounded-xl border overflow-hidden ${COLORS[i % COLORS.length]}`}
              >
                {/* Photo (if present) */}
                {entry.photo_url && (
                  <button
                    type="button"
                    className="block w-full relative aspect-[4/3] overflow-hidden group"
                    onClick={() => setLightbox(entry.photo_url!)}
                    aria-label="View photo"
                  >
                    <Image
                      src={entry.photo_url}
                      alt={`Photo from ${entry.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}

                {/* Text content */}
                <div className="p-5">
                  <p className="text-charcoal/80 text-sm leading-relaxed whitespace-pre-wrap">
                    &ldquo;{entry.message}&rdquo;
                  </p>
                  <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between">
                    <p className="font-display text-base italic text-charcoal">{entry.name}</p>
                    <p className="text-[10px] text-charcoal/30">{formatDate(entry.created_at)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full h-full max-w-3xl max-h-[88vh] mx-6"
              onClick={e => e.stopPropagation()}
            >
              <Image src={lightbox} alt="" fill className="object-contain" sizes="90vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

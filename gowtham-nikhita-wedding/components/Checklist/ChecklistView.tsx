'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PHOTO_GROUPS } from '@/lib/photoGroups'

type ChecklistData = {
  rsvped: boolean
  hasDietary: boolean
  hasHotel: boolean
  betsPlaced: number
  totalBets: number
  hasGuestbook: boolean
  photoGroup: number | null
}

type ItemDef = {
  key: string
  emoji: string
  label: string
  done: boolean
  tbd: boolean
  subtitle: string
  href: string
  showCta: boolean
}

function buildItems(data: ChecklistData): ItemDef[] {
  const photoName =
    data.photoGroup !== null && PHOTO_GROUPS[data.photoGroup]
      ? `Group ${data.photoGroup + 1}: ${PHOTO_GROUPS[data.photoGroup].name}`
      : null

  return [
    {
      key: 'rsvp',
      emoji: '📋',
      label: 'RSVP',
      done: data.rsvped,
      tbd: false,
      subtitle: data.rsvped ? "You're on the guest list" : 'Let us know you can make it before August 24.',
      href: '/rsvp',
      showCta: true,
    },
    {
      key: 'bets',
      emoji: '🎲',
      label: 'Wedding bets',
      done: data.betsPlaced > 0 && data.betsPlaced >= data.totalBets,
      tbd: false,
      subtitle:
        data.betsPlaced === 0
          ? `${data.totalBets} bets waiting. Pick your winners.`
          : data.betsPlaced < data.totalBets
          ? `${data.betsPlaced} of ${data.totalBets} bets placed. A few more to go.`
          : `All ${data.totalBets} bets placed.`,
      href: '/bets',
      showCta: true,
    },
    {
      key: 'guestbook',
      emoji: '✍️',
      label: 'Guestbook',
      done: data.hasGuestbook,
      tbd: false,
      subtitle: data.hasGuestbook
        ? 'Message left for the couple.'
        : 'Leave Gowtham & Nikhita a note they will keep forever.',
      href: '/guestbook',
      showCta: !data.hasGuestbook,
    },
    {
      key: 'photos',
      emoji: '📷',
      label: 'Photo group',
      done: data.photoGroup !== null,
      tbd: data.photoGroup === null,
      subtitle: photoName ?? 'Coming soon. Groups will be assigned once the guest list is finalized.',
      href: '/photos',
      showCta: data.photoGroup !== null,
    },
    {
      key: 'seating',
      emoji: '🪑',
      label: 'Seating chart',
      done: false,
      tbd: true,
      subtitle: 'Coming soon. Your table number will appear here before the wedding.',
      href: '',
      showCta: false,
    },
    {
      key: 'dietary',
      emoji: '🍽️',
      label: 'Dietary restrictions',
      done: data.hasDietary || (data.rsvped && !data.hasDietary),
      tbd: !data.rsvped,
      subtitle: data.hasDietary
        ? 'Dietary needs on file.'
        : data.rsvped
        ? 'None noted. Update your RSVP if you have restrictions.'
        : 'RSVP first, then add any dietary needs.',
      href: '/rsvp',
      showCta: data.rsvped && !data.hasDietary,
    },
    {
      key: 'hotel',
      emoji: '🏨',
      label: 'Hotel preference',
      done: data.hasHotel,
      tbd: !data.rsvped,
      subtitle: data.hasHotel
        ? 'Hotel preference noted.'
        : data.rsvped
        ? 'Let us know if you need a room.'
        : 'RSVP first, then note your hotel preference.',
      href: '/rsvp',
      showCta: data.rsvped && !data.hasHotel,
    },
  ]
}

function StatusIcon({ done, tbd }: { done: boolean; tbd: boolean }) {
  if (tbd) {
    return (
      <div className="w-9 h-9 rounded-full border-2 border-gold/40 bg-gold/8 flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
      </div>
    )
  }
  if (done) {
    return (
      <div className="w-9 h-9 rounded-full bg-olive-dark flex items-center justify-center shrink-0">
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3.5 3.5 5.5-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-9 h-9 rounded-full border-2 border-charcoal/20 bg-white flex items-center justify-center shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
    </div>
  )
}

function ChecklistCard({ item, index }: { item: ItemDef; index: number }) {
  const cardClass = `flex items-center gap-4 p-4 rounded-xl border transition-all ${
    item.done && !item.tbd
      ? 'bg-olive-dark/4 border-olive-dark/15'
      : item.tbd
      ? 'bg-gold/4 border-gold/15'
      : 'bg-white border-charcoal/10'
  } ${item.showCta && item.href ? 'active:scale-[0.99] active:bg-charcoal/4' : ''}`

  const inner = (
    <>
      <StatusIcon done={item.done} tbd={item.tbd} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm leading-snug ${item.done && !item.tbd ? 'text-charcoal/60' : 'text-charcoal'}`}>
          <span className="mr-1.5">{item.emoji}</span>
          {item.label}
        </p>
        <p className="text-xs text-charcoal/45 mt-0.5 leading-relaxed">{item.subtitle}</p>
      </div>
      {item.showCta && item.href && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-charcoal/25" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      {item.showCta && item.href ? (
        <Link href={item.href} className={cardClass}>
          {inner}
        </Link>
      ) : (
        <div className={cardClass}>
          {inner}
        </div>
      )}
    </motion.div>
  )
}

export default function ChecklistView() {
  const searchParams = useSearchParams()
  const [nameInput, setNameInput] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [data, setData] = useState<ChecklistData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fromUrl = searchParams.get('name')
    const fromStorage = localStorage.getItem('weddingGuestName')
    const initial = fromUrl ?? fromStorage ?? ''
    if (initial) {
      setNameInput(initial)
      lookup(initial)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lookup = async (name: string) => {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch(`/api/checklist?name=${encodeURIComponent(name.trim())}`)
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      setData(json)
      setSubmittedName(name.trim())
      localStorage.setItem('weddingGuestName', name.trim())
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lookup(nameInput)
  }

  const items = data ? buildItems(data) : []
  const doneCount = items.filter(i => i.done && !i.tbd).length

  return (
    <div>
      {/* Name entry */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="flex-1 border-2 border-olive-light rounded-xl px-4 py-3 text-base text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!nameInput.trim() || loading}
            className="bg-olive-dark text-white px-6 py-3 rounded-xl font-medium text-sm tracking-wide hover:bg-olive-mid transition-colors disabled:opacity-40 min-w-[64px]"
          >
            {loading ? '…' : 'Go'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={submittedName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Score */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-charcoal">
                  {doneCount === items.length
                    ? "You're all set!"
                    : `${doneCount} of ${items.length} complete`}
                </p>
                <p className="text-xs text-charcoal/40 truncate max-w-[140px]">{submittedName}</p>
              </div>
              <div className="h-1.5 w-full bg-olive-light/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-olive-dark rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(doneCount / items.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map((item, i) => (
                <ChecklistCard key={item.key} item={item} index={i} />
              ))}
            </div>

            <button
              onClick={() => { setData(null); setNameInput(''); setSubmittedName('') }}
              className="w-full text-center text-sm text-charcoal/35 hover:text-charcoal/55 transition-colors mt-8 py-3"
            >
              Not you? Search again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

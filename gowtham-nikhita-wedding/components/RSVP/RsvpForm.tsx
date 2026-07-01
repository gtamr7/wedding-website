'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function RsvpForm() {
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [sangeet, setSangeet] = useState(false)
  const [wedding, setWedding] = useState(false)
  const [reception, setReception] = useState(false)
  const [dietary, setDietary] = useState('')
  const [needsHotel, setNeedsHotel] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [eventError, setEventError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sangeet && !wedding && !reception) {
      setEventError(true)
      return
    }
    setEventError(false)

    if (needsHotel === null) return

    setState('submitting')

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('rsvps').insert({
        guest_name: guestName.trim(),
        email: email.trim().toLowerCase(),
        party_size: partySize,
        sangeet,
        wedding,
        reception,
        dietary_restrictions: dietary.trim() || null,
        needs_hotel: needsHotel,
        notes: notes.trim() || null,
      })
      if (error) throw error
      setState('success')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-16"
        >
          {/* Check animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-olive-dark/10 flex items-center justify-center mx-auto mb-6"
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-olive-dark"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>
          <h2 className="font-display text-4xl italic text-charcoal mb-3">We Can&apos;t Wait!</h2>
          <p className="text-charcoal/50 text-sm max-w-md mx-auto">
            Your RSVP has been received. We&apos;re so excited to celebrate with you in Sarasota!
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <button
              onClick={() => {
                setState('idle')
                setGuestName('')
                setEmail('')
                setPartySize(1)
                setSangeet(false)
                setWedding(false)
                setReception(false)
                setDietary('')
                setNeedsHotel(null)
                setNotes('')
              }}
              className="text-sm text-gold hover:text-gold-light transition-colors underline underline-offset-4"
            >
              Submit another RSVP
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto space-y-6"
        >
          {/* Guest Name */}
          <div>
            <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Your Name
            </label>
            <input
              id="rsvp-name"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="First & last name"
              maxLength={100}
              required
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="rsvp-email" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Email
            </label>
            <input
              id="rsvp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Party Size */}
          <div>
            <label htmlFor="rsvp-party" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Number of Guests (including you)
            </label>
            <select
              id="rsvp-party"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          {/* Events */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-3">
              Which events will you attend?
            </p>
            <div className="space-y-3">
              {([
                { key: 'sangeet', label: 'Sangeet', desc: 'Music, dancing & celebration', checked: sangeet, set: setSangeet },
                { key: 'wedding', label: 'Wedding Ceremony', desc: 'Tamil & Telugu Vedic ceremony', checked: wedding, set: setWedding },
                { key: 'reception', label: 'Reception', desc: 'Dinner, toasts & party', checked: reception, set: setReception },
              ] as const).map((event) => (
                <label
                  key={event.key}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    event.checked
                      ? 'border-gold bg-gold/5'
                      : 'border-olive-light bg-white hover:border-olive-mid'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={event.checked}
                    onChange={(e) => {
                      event.set(e.target.checked)
                      setEventError(false)
                    }}
                    className="mt-1 w-4 h-4 accent-gold"
                  />
                  <div>
                    <span className="font-medium text-charcoal">{event.label}</span>
                    <span className="block text-xs text-charcoal/40 mt-0.5">{event.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {eventError && (
              <p className="text-red-500 text-sm mt-2">Please select at least one event.</p>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label htmlFor="rsvp-dietary" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Dietary Restrictions <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <input
              id="rsvp-dietary"
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, gluten-free, nut allergy…"
              maxLength={200}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Hotel Accommodation */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-3">
              Do you need hotel accommodation?
            </p>
            <div className="flex gap-4">
              {([
                { value: true, label: 'Yes, I need a room' },
                { value: false, label: 'No, I\'m all set' },
              ] as const).map((opt) => (
                <label
                  key={String(opt.value)}
                  className={`flex-1 text-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    needsHotel === opt.value
                      ? 'border-gold bg-gold/5'
                      : 'border-olive-light bg-white hover:border-olive-mid'
                  }`}
                >
                  <input
                    type="radio"
                    name="hotel"
                    checked={needsHotel === opt.value}
                    onChange={() => setNeedsHotel(opt.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                </label>
              ))}
            </div>
            {needsHotel === null && state === 'error' && (
              <p className="text-red-500 text-sm mt-2">Please select an option.</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="rsvp-notes" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Anything else? <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <textarea
              id="rsvp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Song requests, special needs, love notes…"
              maxLength={500}
              rows={3}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Error */}
          {state === 'error' && (
            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!guestName.trim() || !email.trim() || needsHotel === null || state === 'submitting'}
            className="w-full bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
          >
            {state === 'submitting' ? 'Sending…' : 'Send RSVP 💌'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

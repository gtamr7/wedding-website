'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'

type Step = 'gate' | 'form' | 'success'
type FormState = 'idle' | 'submitting' | 'error'

export default function RsvpForm() {
  const [step, setStep] = useState<Step>('gate')

  // Gate
  const [nameInput, setNameInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [gateError, setGateError] = useState('')

  // Form
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [sangeet, setSangeet] = useState(false)
  const [wedding, setWedding] = useState(false)
  const [reception, setReception] = useState(false)
  const [dietary, setDietary] = useState('')
  const [needsHotel, setNeedsHotel] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [eventError, setEventError] = useState(false)

  const checkGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return
    setChecking(true)
    setGateError('')
    try {
      const res = await fetch('/api/rsvp/check-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      })
      const { found, matchedName } = await res.json()
      if (found) {
        setGuestName(matchedName || nameInput.trim())
        setStep('form')
      } else {
        setGateError('')
        setGateError('not-found')
      }
    } catch {
      setGateError('error')
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sangeet && !wedding && !reception) { setEventError(true); return }
    setEventError(false)
    if (needsHotel === null) return
    setFormState('submitting')
    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('rsvps').insert({
        guest_name: guestName.trim(),
        email: email.trim().toLowerCase(),
        party_size: partySize,
        sangeet, wedding, reception,
        dietary_restrictions: dietary.trim() || null,
        needs_hotel: needsHotel,
        notes: notes.trim() || null,
      })
      if (error) throw error
      setStep('success')
    } catch {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 3000)
    }
  }

  return (
    <AnimatePresence mode="wait">

      {/* ── Gate: name check ── */}
      {step === 'gate' && (
        <motion.div
          key="gate"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={checkGuest} className="space-y-5">
            <div>
              <label htmlFor="gate-name" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                Your Name
              </label>
              <input
                id="gate-name"
                type="text"
                value={nameInput}
                onChange={e => { setNameInput(e.target.value); setGateError('') }}
                placeholder="First & last name"
                autoComplete="name"
                required
                className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-lg"
              />
            </div>

            <AnimatePresence>
              {gateError === 'not-found' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm leading-relaxed"
                >
                  <p className="font-medium text-amber-800 mb-1">We don&apos;t see that name on our list.</p>
                  <p className="text-amber-700">
                    If you believe this is an error, please reach out to Gowtham or Nikhita directly and we&apos;ll get you sorted. We can&apos;t wait to celebrate with you!
                  </p>
                </motion.div>
              )}
              {gateError === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center">
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={!nameInput.trim() || checking}
              className="w-full bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
            >
              {checking ? 'Checking…' : 'Find My Invitation →'}
            </button>
          </form>
        </motion.div>
      )}

      {/* ── RSVP Form ── */}
      {step === 'form' && (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto space-y-6"
        >
          {/* Welcome back */}
          <div className="text-center pb-2">
            <p className="font-display text-2xl italic text-gold">Welcome, {guestName.split(' ')[0]}! 🎉</p>
            <p className="text-sm text-charcoal/40 mt-1">Please fill in your details below.</p>
          </div>

          {/* Guest Name (pre-filled, editable) */}
          <div>
            <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Your Name
            </label>
            <input
              id="rsvp-name"
              type="text"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
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
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPartySize(Number(e.target.value))}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map(n => (
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
                { key: 'sangeet', label: 'Sangeet', desc: 'Feb 16 · Music, dancing & celebration', checked: sangeet, set: setSangeet },
                { key: 'wedding', label: 'Wedding Ceremony', desc: 'Feb 17 · Tamil & Telugu Vedic ceremony', checked: wedding, set: setWedding },
                { key: 'reception', label: 'Reception', desc: 'Feb 17 · Dinner, toasts & party', checked: reception, set: setReception },
              ] as const).map(event => (
                <label
                  key={event.key}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${event.checked ? 'border-gold bg-gold/5' : 'border-olive-light bg-white hover:border-olive-mid'}`}
                >
                  <input
                    type="checkbox"
                    checked={event.checked}
                    onChange={e => { event.set(e.target.checked); setEventError(false) }}
                    className="mt-1 w-4 h-4 accent-gold"
                  />
                  <div>
                    <span className="font-medium text-charcoal">{event.label}</span>
                    <span className="block text-xs text-charcoal/40 mt-0.5">{event.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {eventError && <p className="text-red-500 text-sm mt-2">Please select at least one event.</p>}
          </div>

          {/* Dietary */}
          <div>
            <label htmlFor="rsvp-dietary" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Dietary Restrictions <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <input
              id="rsvp-dietary"
              type="text"
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, gluten-free, nut allergy…"
              maxLength={200}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Hotel */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-3">
              Do you need hotel accommodation?
            </p>
            <div className="flex gap-4">
              {([
                { value: true, label: 'Yes, I need a room' },
                { value: false, label: "No, I'm all set" },
              ] as const).map(opt => (
                <label
                  key={String(opt.value)}
                  className={`flex-1 text-center p-4 rounded-xl border-2 cursor-pointer transition-all ${needsHotel === opt.value ? 'border-gold bg-gold/5' : 'border-olive-light bg-white hover:border-olive-mid'}`}
                >
                  <input type="radio" name="hotel" checked={needsHotel === opt.value} onChange={() => setNeedsHotel(opt.value)} className="sr-only" />
                  <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="rsvp-notes" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Anything else? <span className="normal-case text-charcoal/30">(optional)</span>
            </label>
            <textarea
              id="rsvp-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Song requests, special needs, love notes…"
              maxLength={500}
              rows={3}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors resize-none"
            />
          </div>

          {formState === 'error' && (
            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('gate')}
              className="px-5 py-4 rounded-xl border-2 border-olive-light text-charcoal/50 text-sm hover:border-olive-mid transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={!guestName.trim() || !email.trim() || needsHotel === null || formState === 'submitting'}
              className="flex-1 bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
            >
              {formState === 'submitting' ? 'Sending…' : 'Send RSVP 💌'}
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Success ── */}
      {step === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-olive-dark/10 flex items-center justify-center mx-auto mb-6"
          >
            <motion.svg viewBox="0 0 24 24" className="w-10 h-10 text-olive-dark">
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
        </motion.div>
      )}

    </AnimatePresence>
  )
}

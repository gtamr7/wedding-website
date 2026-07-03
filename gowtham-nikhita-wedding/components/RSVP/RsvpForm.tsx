'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'

type Step = 'gate' | 'form' | 'success'
type FormState = 'idle' | 'submitting' | 'error'
type PartyMember = { firstName: string; lastName: string }

const MAX_PARTY = 5  // including the lead guest

export default function RsvpForm() {
  const [step, setStep] = useState<Step>('gate')

  // ── Gate ──
  const [gateFirst, setGateFirst] = useState('')
  const [gateLast,  setGateLast]  = useState('')
  const [checking,  setChecking]  = useState(false)
  const [gateError, setGateError] = useState('')

  // ── Form ──
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')

  // Additional party members
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])

  const [sangeet,   setSangeet]   = useState(false)
  const [wedding,   setWedding]   = useState(false)
  const [reception, setReception] = useState(false)
  const [dietary,   setDietary]   = useState('')
  const [needsHotel, setNeedsHotel] = useState<boolean | null>(null)
  const [notes,     setNotes]     = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [eventError, setEventError] = useState(false)

  // ── Gate submit ──
  const checkGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gateFirst.trim() || !gateLast.trim()) return
    setChecking(true)
    setGateError('')
    try {
      const res = await fetch('/api/rsvp/check-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: gateFirst.trim(), lastName: gateLast.trim() }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { found, matchedFirst, matchedLast } = await res.json()
      if (found) {
        setFirstName(matchedFirst || gateFirst.trim())
        setLastName(matchedLast  || gateLast.trim())
        setStep('form')
      } else {
        setGateError('not-found')
      }
    } catch {
      setGateError('error')
    } finally {
      setChecking(false)
    }
  }

  // ── Party member helpers ──
  const addMember = () => {
    if (partyMembers.length < MAX_PARTY - 1) {
      setPartyMembers(m => [...m, { firstName: '', lastName: '' }])
    }
  }
  const removeMember = (i: number) =>
    setPartyMembers(m => m.filter((_, idx) => idx !== i))
  const updateMember = (i: number, field: keyof PartyMember, val: string) =>
    setPartyMembers(m => m.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const totalGuests = 1 + partyMembers.length

  // ── Form submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sangeet && !wedding && !reception) { setEventError(true); return }
    setEventError(false)
    if (needsHotel === null) return
    setFormState('submitting')
    try {
      const supabase = createSupabaseClient()
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      // Filter out empty party members
      const cleanMembers = partyMembers
        .filter(m => m.firstName.trim())
        .map(m => ({ firstName: m.firstName.trim(), lastName: m.lastName.trim() }))

      const { error } = await supabase.from('rsvps').insert({
        guest_name:      fullName,
        first_name:      firstName.trim(),
        last_name:       lastName.trim(),
        email:           email.trim().toLowerCase(),
        party_size:      1 + cleanMembers.length,
        party_members:   cleanMembers,
        sangeet,
        wedding,
        reception,
        dietary_restrictions: dietary.trim() || null,
        needs_hotel:     needsHotel,
        notes:           notes.trim() || null,
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

      {/* ── Gate ── */}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="gate-first" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  First Name
                </label>
                <input
                  id="gate-first"
                  type="text"
                  value={gateFirst}
                  onChange={e => { setGateFirst(e.target.value); setGateError('') }}
                  placeholder="First"
                  autoComplete="given-name"
                  required
                  className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-base"
                />
              </div>
              <div>
                <label htmlFor="gate-last" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  Last Name
                </label>
                <input
                  id="gate-last"
                  type="text"
                  value={gateLast}
                  onChange={e => { setGateLast(e.target.value); setGateError('') }}
                  placeholder="Last"
                  autoComplete="family-name"
                  required
                  className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-base"
                />
              </div>
            </div>

            <AnimatePresence>
              {gateError === 'not-found' && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm leading-relaxed">
                  <p className="font-medium text-amber-800 mb-1">We don&apos;t see that name on our list.</p>
                  <p className="text-amber-700">
                    Please double-check your spelling or reach out to Gowtham or Nikhita directly — we&apos;d hate to miss you!
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
              disabled={!gateFirst.trim() || !gateLast.trim() || checking}
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
          {/* Welcome */}
          <div className="text-center pb-2">
            <p className="font-display text-2xl italic text-gold">Welcome, {firstName}!</p>
            <p className="text-sm text-charcoal/40 mt-1">Please fill in your details below.</p>
          </div>

          {/* Your name (pre-filled, editable) */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">Your Name</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First"
                required
                className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
              />
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last"
                required
                className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
              />
            </div>
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

          {/* Party members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-charcoal/50">
                Who else is coming with you?
              </p>
              <span className="text-xs text-charcoal/30">
                {totalGuests} / {MAX_PARTY} guests
              </span>
            </div>

            <div className="space-y-3">
              {partyMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={member.firstName}
                    onChange={e => updateMember(i, 'firstName', e.target.value)}
                    placeholder="First"
                    className="flex-1 border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-sm"
                  />
                  <input
                    type="text"
                    value={member.lastName}
                    onChange={e => updateMember(i, 'lastName', e.target.value)}
                    placeholder="Last"
                    className="flex-1 border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="flex-none w-10 h-10 flex items-center justify-center rounded-xl border-2 border-olive-light text-charcoal/40 hover:border-red-300 hover:text-red-400 transition-colors text-lg leading-none"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>

            {totalGuests < MAX_PARTY && (
              <button
                type="button"
                onClick={addMember}
                className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-olive-light text-sm text-charcoal/40 hover:border-olive-mid hover:text-charcoal/60 transition-colors"
              >
                + Add party member
              </button>
            )}

            {totalGuests >= MAX_PARTY && (
              <p className="mt-2 text-xs text-center text-charcoal/30">
                Maximum party size of {MAX_PARTY} reached.
              </p>
            )}
          </div>

          {/* Events */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-3">
              Which events will you attend?
            </p>
            <div className="space-y-3">
              {([
                { key: 'sangeet',   label: 'Sangeet',                      desc: 'Feb 17 · Music, dancing & celebration', checked: sangeet,   set: setSangeet },
                { key: 'wedding',   label: 'Muhurtham (Wedding Ceremony)', desc: 'Feb 18 · Tamil & Telugu Vedic ceremony', checked: wedding,   set: setWedding },
                { key: 'reception', label: 'Reception',                    desc: 'Feb 18 · Dinner, toasts & party',        checked: reception, set: setReception },
              ] as const).map(ev => (
                <label
                  key={ev.key}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${ev.checked ? 'border-gold bg-gold/5' : 'border-olive-light bg-white hover:border-olive-mid'}`}
                >
                  <input
                    type="checkbox"
                    checked={ev.checked}
                    onChange={e => { ev.set(e.target.checked); setEventError(false) }}
                    className="mt-1 w-4 h-4 accent-gold"
                  />
                  <div>
                    <span className="font-medium text-charcoal">{ev.label}</span>
                    <span className="block text-xs text-charcoal/40 mt-0.5">{ev.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {eventError && <p className="text-red-500 text-sm mt-2">Please select at least one event.</p>}
          </div>

          {/* Dietary */}
          <div>
            <label htmlFor="rsvp-dietary" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Dietary Restrictions <span className="normal-case text-charcoal/30">(optional — list for all guests)</span>
            </label>
            <input
              id="rsvp-dietary"
              type="text"
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, gluten-free, nut allergy…"
              maxLength={300}
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
                { value: true,  label: 'Yes, I need a room' },
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
              disabled={!firstName.trim() || !lastName.trim() || !email.trim() || needsHotel === null || formState === 'submitting'}
              className="flex-1 bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
            >
              {formState === 'submitting' ? 'Sending…' : `Send RSVP for ${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'} 💌`}
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
            Your RSVP for{' '}
            <span className="text-charcoal/70 font-medium">{firstName} {lastName}</span>
            {partyMembers.filter(m => m.firstName).length > 0 && (
              <> + {partyMembers.filter(m => m.firstName).length} more</>
            )}{' '}
            has been received. We&apos;re so excited to celebrate with you in Sarasota!
          </p>
        </motion.div>
      )}

    </AnimatePresence>
  )
}

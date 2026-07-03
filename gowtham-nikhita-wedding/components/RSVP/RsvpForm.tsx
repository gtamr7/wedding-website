'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase'

type Step = 'gate' | 'already-rsvped' | 'form' | 'success'
type FormState = 'idle' | 'submitting' | 'error'
type PartyMember = { firstName: string; lastName: string }

type ExistingRsvp = {
  id: string
  sangeet: boolean
  wedding: boolean
  reception: boolean
  party_size: number
  party_members: PartyMember[]
  dietary_restrictions: string | null
  needs_hotel: boolean
  notes: string | null
}

const MAX_PARTY = 5

const EVENTS = [
  {
    key: 'sangeet'   as const,
    label: 'Sangeet',
    desc:  'Feb 17 · Music, dancing & celebration',
    emoji: '🎶',
    calStart: '20270217T180000',
    calEnd:   '20270217T230000',
  },
  {
    key: 'wedding'   as const,
    label: 'Muhurtham (Ceremony)',
    desc:  'Feb 18 · Tamil & Telugu Vedic ceremony',
    emoji: '🪔',
    calStart: '20270218T090000',
    calEnd:   '20270218T130000',
  },
  {
    key: 'reception' as const,
    label: 'Reception',
    desc:  'Feb 18 · Dinner, toasts & party',
    emoji: '🥂',
    calStart: '20270218T180000',
    calEnd:   '20270218T230000',
  },
]

function calendarUrl(title: string, start: string, end: string) {
  return (
    'https://www.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${end}`,
      location: 'Powel Crosley Estate, 8374 N Tamiami Trail, Sarasota, FL 34243',
      details: 'Celebrating the wedding of Gowtham & Nikhita!',
    }).toString()
  )
}

export default function RsvpForm() {
  const [step, setStep] = useState<Step>('gate')

  // ── Gate ──
  const [gateFirst, setGateFirst] = useState('')
  const [gateLast,  setGateLast]  = useState('')
  const [checking,  setChecking]  = useState(false)
  const [gateError, setGateError] = useState('')

  // ── Existing RSVP ──
  const [existingRsvp, setExistingRsvp] = useState<ExistingRsvp | null>(null)
  const [isEditMode,   setIsEditMode]   = useState(false)

  // ── Form ──
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
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
      const { found, matchedFirst, matchedLast, alreadyRsvped, existingRsvp: existing } = await res.json()
      if (found) {
        setFirstName(matchedFirst || gateFirst.trim())
        setLastName(matchedLast  || gateLast.trim())
        if (alreadyRsvped && existing) {
          setExistingRsvp(existing)
          setStep('already-rsvped')
        } else {
          setStep('form')
        }
      } else {
        setGateError('not-found')
      }
    } catch {
      setGateError('error')
    } finally {
      setChecking(false)
    }
  }

  // ── Enter edit mode from already-rsvped screen ──
  const enterEditMode = () => {
    if (!existingRsvp) return
    setSangeet(existingRsvp.sangeet)
    setWedding(existingRsvp.wedding)
    setReception(existingRsvp.reception)
    setPartyMembers(
      Array.isArray(existingRsvp.party_members)
        ? existingRsvp.party_members.filter(m => m.firstName)
        : []
    )
    setDietary(existingRsvp.dietary_restrictions ?? '')
    setNeedsHotel(existingRsvp.needs_hotel)
    setNotes(existingRsvp.notes ?? '')
    setIsEditMode(true)
    setStep('form')
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

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    const cleanMembers = partyMembers
      .filter(m => m.firstName.trim())
      .map(m => ({ firstName: m.firstName.trim(), lastName: m.lastName.trim() }))

    const payload = {
      guest_name:           fullName,
      first_name:           firstName.trim(),
      last_name:            lastName.trim(),
      email:                email.trim().toLowerCase(),
      party_size:           1 + cleanMembers.length,
      party_members:        cleanMembers,
      sangeet,
      wedding,
      reception,
      dietary_restrictions: dietary.trim() || null,
      needs_hotel:          needsHotel,
      notes:                notes.trim() || null,
    }

    try {
      if (isEditMode && existingRsvp?.id) {
        const res = await fetch('/api/rsvp/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existingRsvp.id, ...payload }),
        })
        if (!res.ok) throw new Error('Update failed')
      } else {
        const supabase = createSupabaseClient()
        const { error } = await supabase.from('rsvps').insert(payload)
        if (error) throw error
      }
      setStep('success')
    } catch {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 3000)
    }
  }

  // Events the guest selected (for success / already-rsvped display)
  const selectedEvents = EVENTS.filter(ev =>
    ev.key === 'sangeet'   ? sangeet   :
    ev.key === 'wedding'   ? wedding   :
    ev.key === 'reception' ? reception : false
  )

  // Events from existing RSVP (for already-rsvped display)
  const existingEvents = EVENTS.filter(ev =>
    existingRsvp
      ? ev.key === 'sangeet'   ? existingRsvp.sangeet   :
        ev.key === 'wedding'   ? existingRsvp.wedding   :
        ev.key === 'reception' ? existingRsvp.reception : false
      : false
  )

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
                    Please double-check your spelling, or contact the bride or groom directly to get added.
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

      {/* ── Already RSVPed ── */}
      {step === 'already-rsvped' && existingRsvp && (
        <motion.div
          key="already-rsvped"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h2 className="font-display text-3xl italic text-charcoal">You&apos;re already on the list!</h2>
            <p className="text-charcoal/50 text-sm mt-2">
              We have an RSVP on file for <span className="font-medium text-charcoal/70">{firstName} {lastName}</span>.
            </p>
          </div>

          {/* Existing RSVP summary */}
          <div className="bg-olive-light/30 border-2 border-olive-light rounded-xl p-5 mb-6 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-2">Events you&apos;re attending</p>
              <div className="space-y-1.5">
                {existingEvents.length > 0
                  ? existingEvents.map(ev => (
                      <div key={ev.key} className="flex items-center gap-2 text-sm text-charcoal">
                        <span>{ev.emoji}</span>
                        <span className="font-medium">{ev.label}</span>
                        <span className="text-charcoal/40">· {ev.desc.split(' · ')[0]}</span>
                      </div>
                    ))
                  : <p className="text-sm text-charcoal/50">No events selected</p>
                }
              </div>
            </div>
            <div className="pt-2 border-t border-olive-light">
              <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">Party size</p>
              <p className="text-sm text-charcoal font-medium">{existingRsvp.party_size} {existingRsvp.party_size === 1 ? 'guest' : 'guests'}</p>
            </div>
            {existingRsvp.dietary_restrictions && (
              <div className="pt-2 border-t border-olive-light">
                <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">Dietary notes</p>
                <p className="text-sm text-charcoal">{existingRsvp.dietary_restrictions}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSangeet(existingRsvp.sangeet)
                setWedding(existingRsvp.wedding)
                setReception(existingRsvp.reception)
                setStep('success')
              }}
              className="w-full bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors"
            >
              Looks right — see my calendar links
            </button>
            <button
              onClick={enterEditMode}
              className="w-full py-4 rounded-xl border-2 border-olive-light text-charcoal/60 text-sm hover:border-olive-mid hover:text-charcoal transition-colors"
            >
              I need to update my RSVP
            </button>
            <button
              onClick={() => setStep('gate')}
              className="text-xs text-charcoal/30 hover:text-charcoal/50 transition-colors text-center"
            >
              ← That&apos;s not me
            </button>
          </div>
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
            <p className="font-display text-2xl italic text-gold">
              {isEditMode ? `Updating your RSVP, ${firstName}!` : `Welcome, ${firstName}!`}
            </p>
            <p className="text-sm text-charcoal/40 mt-1">
              {isEditMode ? 'Make your changes below and resubmit.' : 'Please fill in your details below.'}
            </p>
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
                Maximum party size of {MAX_PARTY} reached. Contact us for larger parties.
              </p>
            )}
          </div>

          {/* Events */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-3">
              Which events will you attend?
            </p>
            <div className="space-y-3">
              {EVENTS.map(ev => {
                const checked = ev.key === 'sangeet' ? sangeet : ev.key === 'wedding' ? wedding : reception
                const setter  = ev.key === 'sangeet' ? setSangeet : ev.key === 'wedding' ? setWedding : setReception
                return (
                  <label
                    key={ev.key}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'border-gold bg-gold/5' : 'border-olive-light bg-white hover:border-olive-mid'}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => { setter(e.target.checked); setEventError(false) }}
                      className="mt-1 w-4 h-4 accent-gold"
                    />
                    <div>
                      <span className="font-medium text-charcoal">{ev.label}</span>
                      <span className="block text-xs text-charcoal/40 mt-0.5">{ev.desc}</span>
                    </div>
                  </label>
                )
              })}
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
              onClick={() => { setStep(isEditMode ? 'already-rsvped' : 'gate'); setIsEditMode(false) }}
              className="px-5 py-4 rounded-xl border-2 border-olive-light text-charcoal/50 text-sm hover:border-olive-mid transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !email.trim() || needsHotel === null || formState === 'submitting'}
              className="flex-1 bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40"
            >
              {formState === 'submitting'
                ? (isEditMode ? 'Updating…' : 'Sending…')
                : isEditMode
                  ? 'Update RSVP →'
                  : `Send RSVP for ${totalGuests} ${totalGuests === 1 ? 'Guest' : 'Guests'} →`
              }
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Success ── */}
      {step === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 max-w-md mx-auto"
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

          <h2 className="font-display text-4xl italic text-charcoal mb-2">
            {isEditMode ? 'RSVP Updated!' : 'We Can\'t Wait!'}
          </h2>
          <p className="text-charcoal/50 text-sm max-w-sm mx-auto mb-8">
            {isEditMode
              ? `Your RSVP has been updated. See you in Sarasota, ${firstName}!`
              : <>
                  Your RSVP for{' '}
                  <span className="text-charcoal/70 font-medium">{firstName} {lastName}</span>
                  {partyMembers.filter(m => m.firstName).length > 0 && (
                    <> + {partyMembers.filter(m => m.firstName).length} more</>
                  )}{' '}
                  has been received. We&apos;re so excited to celebrate with you in Sarasota!
                </>
            }
          </p>

          {/* Event summary */}
          <div className="bg-olive-light/30 border-2 border-olive-light rounded-xl p-5 mb-6 text-left">
            <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-3">Your events</p>
            <div className="space-y-2">
              {selectedEvents.map(ev => (
                <div key={ev.key} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-charcoal">
                    <span>{ev.emoji}</span>
                    <span className="font-medium">{ev.label}</span>
                    <span className="text-charcoal/40">· {ev.desc.split(' · ')[0]}</span>
                  </div>
                  <a
                    href={calendarUrl(`Gowtham & Nikhita — ${ev.label}`, ev.calStart, ev.calEnd)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:text-gold-light transition-colors whitespace-nowrap shrink-0"
                  >
                    + Calendar
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-charcoal/30">
            Questions? Reach out to Gowtham or Nikhita directly.
          </p>
        </motion.div>
      )}

    </AnimatePresence>
  )
}

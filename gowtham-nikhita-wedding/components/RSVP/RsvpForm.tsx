'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Lock } from 'lucide-react'
import { SangeetIcon, DiyaIcon, CheersIcon } from '@/components/icons/EventIcons'

type EventIcon = (props: { size?: number; className?: string }) => React.JSX.Element

// ── Types ────────────────────────────────────────────────────
type Step = 'lookup' | 'party' | 'details' | 'already-rsvped' | 'success'

type PartyMember = {
  id: string | null
  name: string
  firstName: string
  lastName: string
  isSubmitter: boolean
}

type GuestChoice = {
  guestId: string
  name: string
  partyMembers: string[]
}

type AttendeeState = {
  guestListId: string | null
  name: string
  firstName: string
  isSubmitter: boolean
  attending: boolean
  sangeet: boolean
  wedding: boolean
  reception: boolean
  dietary: string
}

type ExistingRow = {
  submission_id: string
  guest_name: string
  attending: boolean
  sangeet: boolean
  wedding: boolean
  reception: boolean
  dietary_restrictions: string | null
  contact_email: string | null
  contact_phone: string | null
  needs_hotel: boolean
  notes: string | null
  submitted_by: string
  submitted_at: string
}

// ── Constants ────────────────────────────────────────────────
// The date shown to guests ("please RSVP by September 30") is a request, not a
// cutoff — it lives in app/rsvp/page.tsx and passing it changes nothing here.
// This is the hard close: once it passes, the form stops accepting submissions.
// Placeholder until the real December date is confirmed.
const RSVP_CLOSE_DATE = new Date('2026-12-31T23:59:59-05:00')

const EVENTS: { key: 'sangeet' | 'wedding' | 'reception'; label: string; desc: string; Icon: EventIcon; calStart: string; calEnd: string }[] = [
  { key: 'sangeet',   label: 'Sangeet',              desc: 'Feb 17 · Music, dancing & celebration', Icon: SangeetIcon, calStart: '20270217T180000', calEnd: '20270217T230000' },
  { key: 'wedding',   label: 'Ceremony (Kalyaanam)', desc: 'Feb 18 · Tamil/Telugu Hindu ceremony',   Icon: DiyaIcon,    calStart: '20270218T090000', calEnd: '20270218T130000' },
  { key: 'reception', label: 'Reception',             desc: 'Feb 18 · Dinner, toasts & party',       Icon: CheersIcon,  calStart: '20270218T180000', calEnd: '20270218T230000' },
]

function calendarUrl(title: string, start: string, end: string) {
  return (
    'https://www.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE', text: title,
      dates: `${start}/${end}`,
      location: 'Powel Crosley Estate, 8374 N Tamiami Trl, Sarasota, FL 34243',
      details: 'Celebrating the wedding of Gowtham & Nikhita!',
    }).toString()
  )
}

function initAttendee(m: PartyMember): AttendeeState {
  return {
    guestListId: m.id,
    name: m.name,
    firstName: m.firstName,
    isSubmitter: m.isSubmitter,
    attending: true,
    sangeet: false,
    wedding: false,
    reception: false,
    dietary: '',
  }
}

// ── Component ────────────────────────────────────────────────
export default function RsvpForm() {
  const [step, setStep] = useState<Step>('lookup')

  // Confetti on success
  useEffect(() => {
    if (step !== 'success') return
    const colors = ['#B8972A', '#D4B84A', '#FDFCF8', '#4A5C2F', '#6B7D4A']
    const burst = (x: number, angle: number) =>
      confetti({ particleCount: 70, angle, spread: 60, origin: { x, y: 0.9 }, colors, scalar: 1.1 })
    burst(0.2, 65)
    setTimeout(() => burst(0.8, 115), 120)
    setTimeout(() => burst(0.5, 90), 300)
  }, [step])

  // ── Lookup state ──────────────────────────────────────────
  const [lookupFirst, setLookupFirst] = useState('')
  const [lookupLast,  setLookupLast]  = useState('')
  const [looking,     setLooking]     = useState(false)
  const [lookupError, setLookupError] = useState<'not-found' | 'on-hold' | 'error' | ''>('')
  const [choices,     setChoices]     = useState<GuestChoice[]>([])

  // ── Party / submission state ──────────────────────────────
  const [party,       setParty]       = useState<PartyMember[]>([])
  const [partyId,     setPartyId]     = useState<string | null>(null)
  const [attendees,   setAttendees]   = useState<AttendeeState[]>([])
  const [submitterName, setSubmitterName] = useState('')

  // ── Details state ─────────────────────────────────────────
  const [email,        setEmail]        = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [needsHotel, setNeedsHotel] = useState<boolean | null>(null)
  const [notes,      setNotes]      = useState('')
  const [phone,      setPhone]      = useState('')

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailValid   = EMAIL_RE.test(email.trim())
  const emailsMatch  = email.trim().toLowerCase() === emailConfirm.trim().toLowerCase()
  const emailReady   = emailValid && emailsMatch

  // ── Existing RSVP ─────────────────────────────────────────
  const [existingRows, setExistingRows] = useState<ExistingRow[]>([])

  // ── Submit state ──────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [eventError, setEventError] = useState(false)

  // ── Deadline guard ────────────────────────────────────────
  if (new Date() >= RSVP_CLOSE_DATE) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-charcoal/8 flex items-center justify-center mx-auto mb-5"><Lock size={28} strokeWidth={2.5} className="text-charcoal/40" /></div>
        <h2 className="font-display text-3xl italic text-charcoal mb-2">RSVP submissions are closed</h2>
        <p className="text-charcoal/50 text-sm leading-relaxed">
          The deadline has passed. Please contact Gowtham or Nikhita directly.
        </p>
      </div>
    )
  }

  // ── Lookup submit ─────────────────────────────────────────
  const runLookup = async (payload: { firstName: string; lastName: string } | { guestId: string }) => {
    setLooking(true)
    setLookupError('')
    try {
      const res = await fetch('/api/rsvp/check-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const data = await res.json() as {
        found: boolean
        ambiguous?: boolean
        onHold?: boolean
        choices?: GuestChoice[]
        party: PartyMember[]
        partyId: string | null
        alreadyRsvped: boolean
        existingSubmission: ExistingRow[] | null
      }

      // Two guests share this name — ask which one before going any further
      if (data.ambiguous && data.choices?.length) { setChoices(data.choices); return }
      // Recognised, but their invitation is still being finalised
      if (data.onHold) { setLookupError('on-hold'); return }
      if (!data.found) { setLookupError('not-found'); return }

      setChoices([])
      const submitter = data.party.find(m => m.isSubmitter) ?? data.party[0]
      setParty(data.party)
      setPartyId(data.partyId)
      setSubmitterName(submitter?.name ?? `${lookupFirst} ${lookupLast}`.trim())
      setAttendees(data.party.map(initAttendee))

      if (data.alreadyRsvped && data.existingSubmission) {
        setExistingRows(data.existingSubmission)
        setStep('already-rsvped')
      } else {
        const isTestReviewer = (submitter?.name ?? '').trim().toLowerCase() === 'test reviewer'
        setStep(isTestReviewer ? 'details' : 'party')
      }
    } catch {
      setLookupError('error')
    } finally {
      setLooking(false)
    }
  }

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lookupFirst.trim()) return
    void runLookup({ firstName: lookupFirst.trim(), lastName: lookupLast.trim() })
  }

  // ── Attendee helpers ──────────────────────────────────────
  const updateAttendee = (i: number, patch: Partial<AttendeeState>) =>
    setAttendees(prev => prev.map((a, idx) => idx === i ? { ...a, ...patch } : a))

  const toggleAttending = (i: number, value: boolean) => {
    updateAttendee(i, {
      attending: value,
      // Clearing events when marking not attending; leave them untouched when re-enabling
      ...(!value && { sangeet: false, wedding: false, reception: false }),
    })
  }

  const attendingGuests = attendees.filter(a => a.attending)

  // ── Party → Details ───────────────────────────────────────
  const handlePartyNext = () => {
    const anyEventSelected = attendingGuests.some(a => a.sangeet || a.wedding || a.reception)
    if (!anyEventSelected && attendingGuests.length > 0) { setEventError(true); return }
    setEventError(false)
    setStep('details')
  }

  // ── Final submit ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (needsHotel === null) return
    setSubmitting(true)
    setSubmitError(false)
    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedBy:  submitterName,
          contactEmail: email.trim(),
          contactPhone: phone.trim() || null,
          partyId,
          needsHotel,
          notes:        notes.trim(),
          guests: attendees.map(a => ({
            name:        a.name,
            guestListId: a.guestListId,
            attending:   a.attending,
            sangeet:     a.sangeet,
            wedding:     a.wedding,
            reception:   a.reception,
            dietary:     a.dietary.trim(),
          })),
        }),
      })
      if (!res.ok) throw new Error()
      setStep('success')
    } catch {
      setSubmitError(true)
      setTimeout(() => setSubmitError(false), 4000)
    } finally {
      setSubmitting(false)
    }
  }

  // ── From already-rsvped ───────────────────────────────────
  // Attendees start from initAttendee defaults, which have every event set to
  // false. Both exits from the already-rsvped screen need the saved answers
  // loaded first — the edit form to show them, and the success screen to know
  // which calendar links to offer.
  const attendeesFromExisting = () =>
    attendees.map(a => {
      const row = existingRows.find(r => r.guest_name.toLowerCase() === a.name.toLowerCase())
      if (!row) return a
      return {
        ...a,
        attending:  row.attending,
        sangeet:    row.sangeet,
        wedding:    row.wedding,
        reception:  row.reception,
        dietary:    row.dietary_restrictions ?? '',
      }
    })

  const confirmExisting = () => {
    setAttendees(attendeesFromExisting())
    setStep('success')
  }

  const enterEditMode = () => {
    setAttendees(attendeesFromExisting())
    const firstRow = existingRows[0]
    if (firstRow) {
      setEmail(firstRow.contact_email ?? '')
      setPhone(firstRow.contact_phone ?? '')
      setNeedsHotel(firstRow.needs_hotel)
      setNotes(firstRow.notes ?? '')
    }
    const isTestReviewer = submitterName.trim().toLowerCase() === 'test reviewer'
    setStep(isTestReviewer ? 'details' : 'party')
  }

  // ── Existing submission summary ───────────────────────────
  const existingByGuest = existingRows.reduce<Record<string, ExistingRow>>((acc, r) => {
    if (!acc[r.guest_name]) acc[r.guest_name] = r
    return acc
  }, {})

  const submitterFirstName = submitterName.split(' ')[0]

  // ── Render ────────────────────────────────────────────────
  return (
    <>
    {/* Header. Hidden entirely on success — the confirmation is its own moment.
        The prompt and date only apply while the guest is still looking up. */}
    {step !== 'success' && (
      <div className="text-center mb-14">
        <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">RSVP</h1>
        <div className="gold-divider w-24 mt-4 mx-auto" />
        {step === 'lookup' && (
          <>
            <p className="text-charcoal/50 text-sm mt-4 max-w-md mx-auto">
              We&apos;d love to have you celebrate with us. Please type your full name below.
            </p>
            <p className="text-gold text-xs mt-2 font-medium tracking-wide">
              Please RSVP by September 30
            </p>
          </>
        )}
      </div>
    )}

    <AnimatePresence mode="wait">

      {/* ── Step: Lookup ── */}
      {step === 'lookup' && (
        <motion.div key="lookup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
          className="max-w-md mx-auto">
          <form onSubmit={handleLookup} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="lk-first" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">First Name</label>
                <input id="lk-first" type="text" value={lookupFirst}
                  onChange={e => { setLookupFirst(e.target.value); setLookupError(''); setChoices([]) }}
                  placeholder="First" autoComplete="given-name" required
                  className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-base" />
              </div>
              <div>
                <label htmlFor="lk-last" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                  Last Name <span className="lowercase tracking-normal text-charcoal/30">(if you use one)</span>
                </label>
                <input id="lk-last" type="text" value={lookupLast}
                  onChange={e => { setLookupLast(e.target.value); setLookupError(''); setChoices([]) }}
                  placeholder="Last" autoComplete="family-name"
                  className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-base" />
              </div>
            </div>

            <AnimatePresence>
              {choices.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-olive-light/20 border border-olive-light rounded-xl px-4 py-4 text-sm leading-relaxed">
                  <p className="font-medium text-charcoal mb-3">
                    We have more than one guest by that name — which one are you?
                  </p>
                  <div className="space-y-2">
                    {choices.map(c => (
                      <button key={c.guestId} type="button" disabled={looking}
                        onClick={() => void runLookup({ guestId: c.guestId })}
                        className="w-full text-left bg-white border-2 border-olive-light rounded-xl px-4 py-3 hover:border-gold transition-colors disabled:opacity-40">
                        <span className="block text-charcoal font-medium">{c.name}</span>
                        <span className="block text-xs text-charcoal/50 mt-0.5">
                          {c.partyMembers.length > 0
                            ? `Invited with ${c.partyMembers.join(', ')}`
                            : 'Individual invitation'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/40 mt-3">
                    Not sure? Reach out to Gowtham or Nikhita and we&apos;ll sort it out.
                  </p>
                </motion.div>
              )}
              {lookupError === 'on-hold' && (
                /* Deliberately says nothing about whether this guest is on the
                   list. It reads as a general status on RSVPs, not a response
                   about them, so it neither confirms nor denies an invitation. */
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-olive-light/25 border border-olive-light rounded-xl px-4 py-4 text-sm leading-relaxed">
                  <p className="font-medium text-charcoal mb-1">RSVPs are still being finalised</p>
                  <p className="text-charcoal/60">
                    We&apos;re ironing out a few details on our end. We&apos;ll reach out as soon
                    as everything is ready — thanks so much for your patience!
                  </p>
                </motion.div>
              )}
              {lookupError === 'not-found' && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm leading-relaxed">
                  <p className="font-medium text-amber-800 mb-1">We don&apos;t see that name on our list.</p>
                  <p className="text-amber-700">Check your spelling, or reach out to Gowtham or Nikhita to get added.</p>
                </motion.div>
              )}
              {lookupError === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-red-500 text-sm text-center">Something went wrong. Please try again.</motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={!lookupFirst.trim() || looking}
              className="w-full bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40">
              {looking ? 'Looking…' : 'Find My Invitation →'}
            </button>
          </form>

        </motion.div>
      )}

      {/* ── Step: Already RSVPed ── */}
      {step === 'already-rsvped' && (
        <motion.div key="already-rsvped" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
          className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h2 className="font-display text-3xl italic text-charcoal">You&apos;re already on the list!</h2>
            <p className="text-charcoal/50 text-sm mt-2">We have an RSVP on file for your party.</p>
          </div>

          <div className="bg-olive-light/30 border-2 border-olive-light rounded-xl p-5 mb-6 space-y-4">
            {Object.values(existingByGuest).map(row => (
              <div key={row.guest_name} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center ${row.attending ? 'bg-olive-dark' : 'bg-charcoal/15'}`}>
                  {row.attending && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${row.attending ? 'text-charcoal' : 'text-charcoal/40 line-through'}`}>{row.guest_name}</p>
                  {row.attending && (
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      {[row.sangeet && 'Sangeet', row.wedding && 'Ceremony', row.reception && 'Reception']
                        .filter(Boolean).join(' · ') || 'No events'}
                    </p>
                  )}
                  {!row.attending && <p className="text-xs text-charcoal/35">Not attending</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={confirmExisting}
              className="w-full bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors">
              Looks right — see calendar links
            </button>
            <button onClick={enterEditMode}
              className="w-full py-4 rounded-xl border-2 border-olive-light text-charcoal/60 text-sm hover:border-olive-mid hover:text-charcoal transition-colors">
              I need to update my RSVP
            </button>
            <button onClick={() => setStep('lookup')}
              className="text-xs text-charcoal/30 hover:text-charcoal/50 transition-colors text-center">
              ← That&apos;s not me
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Step: Party Selection ── */}
      {step === 'party' && (
        <motion.div key="party" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
          className="max-w-lg mx-auto">

          <div className="text-center mb-8">
            <p className="font-display text-2xl italic text-gold">Welcome, {submitterFirstName}!</p>
            <p className="text-sm text-charcoal/40 mt-1">Select who&apos;s attending and which events.</p>
          </div>

          <div className="space-y-4 mb-6">
            {attendees.map((a, i) => (
              <motion.div key={a.name} layout
                className={`rounded-xl border-2 transition-colors ${a.attending ? 'border-olive-mid bg-white' : 'border-olive-light bg-charcoal/3'}`}>

                {/* Name row + attending toggle */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <button type="button" onClick={() => toggleAttending(i, !a.attending)}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${a.attending ? 'bg-olive-dark border-olive-dark' : 'border-charcoal/25 bg-white'}`}
                    aria-label={a.attending ? 'Mark as not attending' : 'Mark as attending'}>
                    {a.attending && (
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none">
                        <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${a.attending ? 'text-charcoal' : 'text-charcoal/35'}`}>
                      {a.name}
                      {a.isSubmitter && <span className="ml-1.5 text-xs text-charcoal/35 font-normal">(you)</span>}
                    </p>
                    {!a.attending && <p className="text-xs text-charcoal/30 mt-0.5">Not attending</p>}
                  </div>
                </div>

                {/* Event checkboxes — only when attending */}
                <AnimatePresence>
                  {a.attending && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                      className="border-t border-olive-light/60 px-4 pb-4 pt-3 overflow-hidden">
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/35 mb-2.5">Events</p>
                      <div className="flex flex-wrap gap-2">
                        {/* Shortcut so a guest coming to everything taps once
                            instead of three times per person. */}
                        {(() => {
                          const allOn = a.sangeet && a.wedding && a.reception
                          return (
                            <button type="button"
                              onClick={() => updateAttendee(i, { sangeet: !allOn, wedding: !allOn, reception: !allOn })}
                              aria-pressed={allOn}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all select-none
                                ${allOn ? 'border-olive-dark bg-olive-dark text-white' : 'border-olive-light bg-white text-charcoal/45 hover:border-olive-mid'}`}>
                              All events
                            </button>
                          )
                        })()}
                        {EVENTS.map(ev => {
                          const checked = ev.key === 'sangeet' ? a.sangeet : ev.key === 'wedding' ? a.wedding : a.reception
                          return (
                            <label key={ev.key}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all select-none
                                ${checked ? 'border-gold bg-gold/10 text-charcoal' : 'border-olive-light bg-white text-charcoal/45 hover:border-olive-mid'}`}>
                              <input type="checkbox" checked={checked} className="sr-only"
                                onChange={e => updateAttendee(i, { [ev.key]: e.target.checked })} />
                              <ev.Icon size={14} className="shrink-0" />
                              <span>{ev.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {eventError && (
            <p className="text-red-500 text-sm text-center">Please select at least one event for attending guests.</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep('lookup')}
              className="px-5 py-4 rounded-xl border-2 border-olive-light text-charcoal/50 text-sm hover:border-olive-mid transition-colors">
              ← Back
            </button>
            <button type="button" onClick={handlePartyNext}
              className="flex-1 bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors">
              Continue →
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Step: Details ── */}
      {step === 'details' && (
        <motion.form key="details" onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
          className="max-w-lg mx-auto space-y-6">

          <div className="text-center pb-2">
            <p className="font-display text-2xl italic text-gold">A few more details</p>
            <p className="text-sm text-charcoal/40 mt-1">Almost done!</p>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <div>
              <label htmlFor="rsvp-email" className="block text-xs uppercase tracking-widests text-charcoal/50 mb-2">
                Your Email
              </label>
              <input
                id="rsvp-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="your@email.com"
                autoComplete="email"
                className={`w-full border-2 rounded-xl px-4 py-3 text-charcoal bg-white focus:outline-none transition-colors
                  ${emailTouched && !emailValid ? 'border-red-300 focus:border-red-400' : 'border-olive-light focus:border-gold'}`}
              />
              {emailTouched && !emailValid && (
                <p className="text-red-500 text-xs mt-1.5">Please enter a valid email address.</p>
              )}
            </div>
            <div>
              <label htmlFor="rsvp-email-confirm" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
                Confirm Email
              </label>
              <input
                id="rsvp-email-confirm"
                type="email"
                value={emailConfirm}
                onChange={e => setEmailConfirm(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                onPaste={e => e.preventDefault()}
                placeholder="your@email.com"
                autoComplete="off"
                className={`w-full border-2 rounded-xl px-4 py-3 text-charcoal bg-white focus:outline-none transition-colors
                  ${confirmTouched && !emailsMatch ? 'border-red-300 focus:border-red-400' : 'border-olive-light focus:border-gold'}`}
              />
              {confirmTouched && !emailsMatch && (
                <p className="text-red-500 text-xs mt-1.5">Emails don&apos;t match.</p>
              )}
            </div>
          </div>

          {/* Phone — day-of contact only */}
          <div>
            <label htmlFor="rsvp-phone" className="block text-xs uppercase tracking-widest text-charcoal/50 mb-2">
              Mobile Number <span className="normal-case text-charcoal/30">(optional — in case we need to reach you)</span>
            </label>
            <input
              id="rsvp-phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              autoComplete="tel"
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Dietary — one field per attending guest */}
          {attendingGuests.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-charcoal/50 mb-3">
                Dietary Restrictions <span className="normal-case text-charcoal/30">(optional)</span>
              </p>
              <div className="space-y-3">
                {attendees.map((a, i) => {
                  if (!a.attending) return null
                  return (
                    <div key={a.name}>
                      <label htmlFor={`dietary-${i}`} className="block text-sm font-semibold text-charcoal/80 mb-1.5">
                        {a.firstName}
                      </label>
                      <input id={`dietary-${i}`} type="text" value={a.dietary}
                        onChange={e => updateAttendee(i, { dietary: e.target.value })}
                        placeholder="e.g. Vegetarian, gluten-free, nut allergy…"
                        maxLength={200}
                        className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors text-sm" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Hotel */}
          <div>
            <p className="block text-xs uppercase tracking-widest text-charcoal/50 mb-1">Hotel Accommodation?</p>
            <p className="text-xs text-charcoal/35 mb-3">Hotel block details coming soon. We&apos;ll share booking info before you need to decide.</p>
            <div className="flex gap-4">
              {([{ value: true, label: 'Yes, I need a room' }, { value: false, label: "No, I'm all set" }] as const).map(opt => (
                <label key={String(opt.value)}
                  className={`flex-1 text-center p-4 rounded-xl border-2 cursor-pointer transition-all ${needsHotel === opt.value ? 'border-gold bg-gold/5' : 'border-olive-light bg-white hover:border-olive-mid'}`}>
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
            <textarea id="rsvp-notes" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Song requests, special needs, love notes…"
              maxLength={500} rows={3}
              className="w-full border-2 border-olive-light rounded-xl px-4 py-3 text-charcoal bg-white focus:border-gold focus:outline-none transition-colors resize-none" />
          </div>

          {submitError && (
            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(submitterName.trim().toLowerCase() === 'test reviewer' ? 'lookup' : 'party')}
              className="px-5 py-4 rounded-xl border-2 border-olive-light text-charcoal/50 text-sm hover:border-olive-mid transition-colors">
              ← Back
            </button>
            <button type="submit"
              disabled={!emailReady || needsHotel === null || submitting}
              className="flex-1 bg-olive-dark text-white py-4 rounded-xl font-medium tracking-wider uppercase text-sm hover:bg-olive-mid transition-colors disabled:opacity-40">
              {submitting ? 'Sending…' : `Send RSVP for ${attendees.length} ${attendees.length === 1 ? 'Guest' : 'Guests'} →`}
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Step: Success ── */}
      {step === 'success' && (
        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 max-w-md mx-auto">

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-olive-dark/10 flex items-center justify-center mx-auto mb-6">
            <motion.svg viewBox="0 0 24 24" className="w-10 h-10 text-olive-dark">
              <motion.path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth={2.5}
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
            </motion.svg>
          </motion.div>

          <h2 className="font-display text-4xl italic text-charcoal mb-2">We Can&apos;t Wait!</h2>
          <p className="text-charcoal/50 text-sm max-w-sm mx-auto mb-8">
            Your RSVP for <span className="text-charcoal/70 font-medium">{submitterName}</span>
            {attendees.length > 1 && <> + {attendees.length - 1} more</>}{' '}
            has been received. So excited to celebrate with you in Sarasota!
          </p>

          {/* Attending + events summary */}
          <div className="bg-olive-light/30 border-2 border-olive-light rounded-xl p-5 mb-6 text-left space-y-3">
            {attendees.map(a => {
              if (!a.attending) return null
              const evs = EVENTS.filter(ev =>
                ev.key === 'sangeet' ? a.sangeet : ev.key === 'wedding' ? a.wedding : a.reception
              )
              return (
                <div key={a.name}>
                  <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1.5">{a.name}</p>
                  <div className="space-y-1">
                    {evs.map(ev => (
                      <div key={ev.key} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-charcoal">
                          <ev.Icon size={14} className="shrink-0" />
                          <span className="font-medium">{ev.label}</span>
                        </div>
                        <a href={calendarUrl(`Gowtham & Nikhita: ${ev.label}`, ev.calStart, ev.calEnd)}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gold hover:text-gold-light transition-colors whitespace-nowrap shrink-0">
                          + Calendar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-charcoal/8">
            <a href={`/checklist?name=${encodeURIComponent(submitterName)}`}
              className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light font-medium transition-colors">
              See your full checklist →
            </a>
          </div>
          <p className="text-xs text-charcoal/30 mt-4">Questions? Reach out to Gowtham or Nikhita directly.</p>
        </motion.div>
      )}

    </AnimatePresence>
    </>
  )
}

'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const events = [
  {
    date: 'Feb 16',
    day: 'Sunday',
    name: 'Sangeet Night',
    emoji: '🎶',
    time: '6:00 PM – 10:00 PM',
    venue: 'Powel Crosley Estate, Sarasota, FL',
    description:
      'An evening of music, dance, and joyful celebration as both families come together for the first time. Performances, food, and the energy of two worlds colliding in the best way.',
    dresscode: 'Festive Indian attire — lehengas, sarees, sherwanis, kurtas',
    color: 'from-black/20 to-black/10',
    borderColor: 'border-gold/15',
    badgeColor: 'bg-olive-mid/50 text-ivory',
    calendar: {
      title: 'Sangeet Night — Gowtham & Nikhita',
      date: '20270216T180000',
      endDate: '20270216T220000',
      location: 'Powel Crosley Estate, 8490 Crosley Ln, Sarasota, FL 34241',
      description: 'An evening of music, dance, and joyful celebration. Festive Indian attire.',
    },
  },
  {
    date: 'Feb 17',
    day: 'Monday',
    name: 'Muhurtham',
    emoji: '🪔',
    time: '9:00 AM – 12:00 PM',
    venue: 'Powel Crosley Estate, Sarasota, FL',
    description:
      'The sacred Tamil & Telugu Vedic ceremony (Muhurtham) conducted according to ancient tradition. A profoundly moving ceremony rich with ritual, meaning, and family.',
    dresscode: 'Traditional Indian attire or formal Western',
    color: 'from-gold/12 to-black/15',
    borderColor: 'border-gold/45',
    badgeColor: 'bg-gold/20 text-gold-light',
    featured: true,
    calendar: {
      title: 'Muhurtham — Gowtham & Nikhita Wedding',
      date: '20270217T090000',
      endDate: '20270217T120000',
      location: 'Powel Crosley Estate, 8490 Crosley Ln, Sarasota, FL 34241',
      description: 'Tamil & Telugu Vedic wedding ceremony. Traditional Indian attire or formal Western.',
    },
  },
  {
    date: 'Feb 17',
    day: 'Monday Evening',
    name: 'Reception',
    emoji: '🥂',
    time: '6:00 PM – 11:45 PM',
    venue: 'Powel Crosley Estate, Sarasota, FL',
    description:
      'Dinner, dancing, speeches, and celebration under the Sarasota sky. The waterfront setting of Powel Crosley Estate provides a breathtaking backdrop for an evening to remember.',
    dresscode: 'Black tie optional / Cocktail attire',
    color: 'from-black/20 to-black/10',
    borderColor: 'border-gold/15',
    badgeColor: 'bg-olive-mid/40 text-ivory',
    calendar: {
      title: 'Reception — Gowtham & Nikhita Wedding',
      date: '20270217T180000',
      endDate: '20270217T235500',
      location: 'Powel Crosley Estate, 8490 Crosley Ln, Sarasota, FL 34241',
      description: 'Wedding reception — dinner, dancing, and celebration. Black tie optional / cocktail attire.',
    },
  },
]

function makeIcs(cal: typeof events[0]['calendar']) {
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gowtham & Nikhita Wedding//EN',
    'BEGIN:VEVENT',
    `DTSTART:${cal.date}`,
    `DTEND:${cal.endDate}`,
    `SUMMARY:${cal.title}`,
    `LOCATION:${cal.location}`,
    `DESCRIPTION:${cal.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`
}

function googleCalUrl(cal: typeof events[0]['calendar']) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: cal.title,
    dates: `${cal.date}/${cal.endDate}`,
    details: cal.description,
    location: cal.location,
  })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

function AddToCalendar({ cal }: { cal: typeof events[0]['calendar'] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs text-ivory/50 hover:text-gold transition-colors border border-white/15 hover:border-gold/40 rounded-full px-3 py-1.5"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="14" height="12" rx="1.5" />
          <path d="M1 7h14M5 1v4M11 1v4" strokeLinecap="round" />
        </svg>
        Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-full mb-2 z-20 bg-olive-dark/98 backdrop-blur-sm rounded-xl shadow-xl border border-gold/20 overflow-hidden w-44"
            >
              <a
                href={googleCalUrl(cal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-ivory hover:bg-white/8 transition-colors"
                onClick={() => setOpen(false)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#4285F4"/>
                  <path d="M12 11v6M9 14h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Google Calendar
              </a>
              <a
                href={makeIcs(cal)}
                download={`${cal.title.replace(/[^a-z0-9]/gi, '-')}.ics`}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-ivory hover:bg-white/8 transition-colors border-t border-gold/15"
                onClick={() => setOpen(false)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#1C1C1A"/>
                  <path d="M12 7v7M9 11l3 3 3-3M7 17h10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Apple / Outlook
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-xl border bg-gradient-to-br backdrop-blur-sm ${event.color} ${event.borderColor} p-7 sm:p-9 overflow-hidden group`}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: index * 0.15 + 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 origin-left ${'featured' in event && event.featured ? 'bg-gold' : 'bg-white/30'}`}
      />

      {'featured' in event && event.featured && (
        <div className="absolute top-4 right-4 text-xs tracking-widest uppercase text-gold border border-gold/40 rounded-full px-3 py-1 bg-gold/10">
          Main Event
        </div>
      )}

      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden="true">{event.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs tracking-wider uppercase font-medium rounded-full px-3 py-1 ${event.badgeColor}`}>
              {event.date} · {event.day}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl italic text-ivory">{event.name}</h3>

          <div className="mt-3 space-y-1 text-sm text-ivory/60">
            <p>⏰ {event.time}</p>
            <p>📍 {event.venue}</p>
          </div>

          <p className="mt-4 text-ivory/70 leading-relaxed text-sm sm:text-base">{event.description}</p>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-ivory/40 uppercase tracking-wider">Dress Code</p>
              <p className="text-sm text-ivory/70 mt-1">{event.dresscode}</p>
            </div>
            <AddToCalendar cal={event.calendar} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Schedule() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="schedule" className="section-py px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Feb 16–17, 2027</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-ivory">The Events</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        <div className="grid gap-6">
          {events.map((e, i) => <EventCard key={e.name} event={e} index={i} />)}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const events = [
  {
    date: 'Feb 16',
    day: 'Sunday',
    name: 'Sangeet Night',
    emoji: '🎶',
    time: 'Time TBD · Evening',
    venue: 'Venue TBD',
    description:
      'An evening of music, dance, and joyful celebration as both families come together for the first time. Performances, food, and the energy of two worlds colliding in the best way.',
    dresscode: 'Festive Indian attire — lehengas, sarees, sherwanis, kurtas',
    color: 'from-olive-mid/10 to-olive-light/30',
    borderColor: 'border-olive-mid/30',
    badgeColor: 'bg-olive-light text-olive-dark',
  },
  {
    date: 'Feb 17',
    day: 'Monday',
    name: 'Muhurtham',
    emoji: '🪔',
    time: 'Muhurtham time TBD · Morning',
    venue: 'Powel Crosley Estate, Sarasota, FL',
    description:
      'The sacred Tamil & Telugu Vedic ceremony (Muhurtham) conducted according to ancient tradition. A profoundly moving ceremony rich with ritual, meaning, and family.',
    dresscode: 'Traditional Indian attire or formal Western',
    color: 'from-gold/5 to-gold-light/10',
    borderColor: 'border-gold/40',
    badgeColor: 'bg-gold/10 text-gold',
    featured: true,
  },
  {
    date: 'Feb 17',
    day: 'Monday Evening',
    name: 'Reception',
    emoji: '🥂',
    time: 'Time TBD · Evening',
    venue: 'Powel Crosley Estate, Sarasota, FL',
    description:
      'Dinner, dancing, speeches, and celebration under the Sarasota sky. The waterfront setting of Powel Crosley Estate provides a breathtaking backdrop for an evening to remember.',
    dresscode: 'Black tie optional / Cocktail attire',
    color: 'from-olive-dark/5 to-olive-mid/10',
    borderColor: 'border-olive-dark/20',
    badgeColor: 'bg-charcoal/5 text-charcoal',
  },
]

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
      className={`relative rounded-xl border bg-gradient-to-br ${event.color} ${event.borderColor} p-7 sm:p-9 overflow-hidden group`}
    >
      {/* Animated border accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: index * 0.15 + 0.3 }}
        className={`absolute top-0 left-0 right-0 h-0.5 origin-left ${event.featured ? 'bg-gold' : 'bg-olive-mid/50'}`}
      />

      {event.featured && (
        <div className="absolute top-4 right-4 text-xs tracking-widest uppercase text-gold border border-gold/40 rounded-full px-3 py-1 bg-gold/5">
          Main Event
        </div>
      )}

      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden="true">{event.emoji}</span>
        <div className="flex-1 min-w-0">
          {/* Date pill */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs tracking-wider uppercase font-medium rounded-full px-3 py-1 ${event.badgeColor}`}>
              {event.date} · {event.day}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl italic text-charcoal">{event.name}</h3>

          <div className="mt-3 space-y-1 text-sm text-charcoal/60">
            <p>⏰ {event.time}</p>
            <p>📍 {event.venue}</p>
          </div>

          <p className="mt-4 text-charcoal/70 leading-relaxed text-sm sm:text-base">{event.description}</p>

          <div className="mt-4 pt-4 border-t border-charcoal/10">
            <p className="text-xs text-charcoal/50 uppercase tracking-wider">Dress Code</p>
            <p className="text-sm text-charcoal/70 mt-1">{event.dresscode}</p>
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
    <section id="schedule" className="section-py bg-olive-light/30 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Feb 16–17, 2027</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-charcoal">The Events</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        <div className="grid gap-6">
          {events.map((e, i) => <EventCard key={e.name} event={e} index={i} />)}
        </div>
      </div>
    </section>
  )
}

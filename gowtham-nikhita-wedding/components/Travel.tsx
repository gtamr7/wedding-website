'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const airports = [
  { code: 'SRQ', name: 'Sarasota-Bradenton International', distance: '~15 min', recommended: true },
  { code: 'TPA', name: 'Tampa International Airport', distance: '~1 hour' },
  { code: 'RSW', name: 'Fort Myers / Southwest Florida Intl', distance: '~1 hour' },
  { code: 'MCO', name: 'Orlando International Airport', distance: '~2 hours' },
]

const hotels = [
  {
    name: 'The Ritz-Carlton, Sarasota',
    type: 'Luxury',
    distance: '~10 min to venue',
    note: 'Waterfront property, exceptional service',
  },
  {
    name: 'Hyatt Regency Sarasota',
    type: 'Upscale',
    distance: '~12 min to venue',
    note: 'Great pool, central location on the Bay',
  },
  {
    name: 'Hampton Inn & Suites Sarasota/Bradenton Airport',
    type: 'Mid-range',
    distance: '~10 min to venue',
    note: 'Close to the airport and venue, free hot breakfast',
  },
  {
    name: 'Holiday Inn Express & Suites Sarasota',
    type: 'Budget-friendly',
    distance: '~12 min to venue',
    note: 'Good rates, includes breakfast',
  },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Travel() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInView = useInView(mapRef, { once: true, margin: '-80px' })

  return (
    <section id="travel" className="section-py px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs tracking-widest uppercase text-gold mb-3">Getting There</p>
          <h2 className="font-display text-5xl sm:text-6xl italic text-ivory">Travel & Stay</h2>
          <div className="gold-divider w-24 mt-5 mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column */}
          <div className="space-y-10">
            <FadeIn>
              <div>
                <h3 className="font-display text-2xl italic text-ivory mb-1">The Venue</h3>
                <div className="gold-divider w-12 mb-4" />
                <p className="text-ivory font-medium">Powel Crosley Estate</p>
                <p className="text-ivory/60 text-sm mt-1">8374 N Tamiami Trail, Sarasota, FL 34243</p>
                <p className="text-ivory/60 text-sm mt-3 leading-relaxed">
                  A stunning waterfront estate on Sarasota Bay, surrounded by manicured gardens and
                  century-old oaks draped in Spanish moss. The perfect backdrop for a celebration of
                  this magnitude.
                </p>
                <p className="text-xs text-ivory/40 mt-2">Ample parking on-site · Valet available</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <motion.div
                ref={mapRef}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={mapInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative rounded-xl overflow-hidden border border-gold/15 shadow-sm aspect-video bg-black/15"
              >
                <iframe
                  title="Powel Crosley Estate Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3544.3!2d-82.5259!3d27.4112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c3410a1f2cde29%3A0x3b7d4c2c9b56a0!2sPowel%20Crosley%20Estate!5e0!3m2!1sen!2sus!4v1000000000000"
                  className="absolute inset-0 w-full h-full"
                />
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={mapInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="w-6 h-6 bg-gold rounded-full border-2 border-white shadow-lg animate-pulse-gold" />
                </motion.div>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-start gap-3 bg-black/20 rounded-xl p-4 border border-gold/15">
                <span className="text-2xl" aria-hidden="true">☀️</span>
                <div>
                  <p className="font-medium text-ivory text-sm">February in Sarasota</p>
                  <p className="text-ivory/60 text-sm mt-1">
                    Expect ~75°F, low humidity, and sunny skies. Sarasota in February is paradise —
                    light layers for the evening ceremony.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right column */}
          <div className="space-y-10">
            <FadeIn delay={0.05}>
              <div>
                <h3 className="font-display text-2xl italic text-ivory mb-1">Nearest Airports</h3>
                <div className="gold-divider w-12 mb-5" />
                <div className="space-y-3">
                  {airports.map((a) => (
                    <div
                      key={a.code}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        a.recommended
                          ? 'bg-gold/12 border-gold/40'
                          : 'bg-black/15 border-gold/12'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-semibold text-gold w-12">{a.code}</span>
                        <div>
                          <p className="text-sm text-ivory leading-snug">{a.name}</p>
                          {a.recommended && (
                            <p className="text-[10px] uppercase tracking-wider text-gold mt-0.5">Recommended</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-ivory/50 whitespace-nowrap ml-2">{a.distance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ivory/40 mt-2">
                  Driving from Atlanta: ~8.5 hours via I-75 South — a beautiful drive!
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h3 className="font-display text-2xl italic text-ivory mb-1">Where to Stay</h3>
                <div className="gold-divider w-12 mb-5" />
                <div className="flex items-start gap-3 bg-gold/8 rounded-xl p-4 border border-gold/25 mb-5">
                  <span className="text-lg shrink-0" aria-hidden="true">🔔</span>
                  <p className="text-sm text-ivory/70 leading-relaxed">
                    <span className="text-gold font-medium">Hotel block & shuttle details coming soon.</span>{' '}
                    We&apos;re finalizing room blocks and transportation — check back for updates before booking.
                  </p>
                </div>
                <div className="space-y-3">
                  {hotels.map((h) => (
                    <div
                      key={h.name}
                      className="p-4 rounded-lg border border-gold/12 bg-black/15 hover:border-gold/35 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-ivory text-sm leading-snug">{h.name}</p>
                        <span className="text-[10px] uppercase tracking-wider text-gold/80 whitespace-nowrap shrink-0 border border-gold/30 rounded-full px-2 py-0.5">
                          {h.type}
                        </span>
                      </div>
                      <p className="text-xs text-ivory/50 mt-1">📍 {h.distance}</p>
                      <p className="text-xs text-ivory/60 mt-1">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

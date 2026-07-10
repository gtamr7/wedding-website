'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Sun, Bell, MapPin } from 'lucide-react'

const venuePhotos = [
  { src: '/venue-1.jpg', alt: 'Powel Crosley Estate — outdoor reception' },
  { src: '/venue-2.jpg', alt: 'Powel Crosley Estate — entrance' },
  { src: '/venue-3.webp', alt: 'Powel Crosley Estate — evening lights' },
]

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
  const collageRef = useRef<HTMLDivElement>(null)
  const collageInView = useInView(collageRef, { once: true, margin: '-60px' })
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1)
      if (e.key === 'ArrowRight' && lightboxIndex < venuePhotos.length - 1) setLightboxIndex(lightboxIndex + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex])

  // Lock body scroll when lightbox is open (prevents iOS background scroll)
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

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
          <div className="space-y-10 min-w-0">
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
                <p className="text-xs text-ivory/40 mt-2">Parking is limited · Shuttle service may be used</p>
              </div>
            </FadeIn>

            {/* Venue photo collage */}
            <div ref={collageRef}>
              {/* Mobile: snap-scroll row. Desktop: side-by-side with float offsets */}
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-10 sm:items-start">

                {venuePhotos.map((photo, i) => (
                  <motion.button
                    key={photo.src}
                    initial={{ opacity: 0, y: 18 }}
                    animate={collageInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, delay: 0.1 + i * 0.12 }}
                    onClick={() => setLightboxIndex(i)}
                    className={`snap-center shrink-0 w-[78vw] sm:w-auto sm:flex-1 rounded-xl overflow-hidden border shadow-xl cursor-zoom-in group relative
                      ${i === 0 ? 'border-gold/25 sm:-rotate-[1deg] sm:translate-y-0' : ''}
                      ${i === 1 ? 'border-gold/20 sm:rotate-[0.8deg] sm:translate-y-6' : ''}
                      ${i === 2 ? 'border-gold/30 sm:-rotate-[0.5deg] sm:translate-y-3' : ''}
                    `}
                    aria-label={`View ${photo.alt}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-105
                        ${i === 1 ? 'h-52 sm:h-52' : i === 2 ? 'h-52 sm:h-44' : 'h-52 sm:h-48'}
                      `}
                    />
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/55 backdrop-blur-sm rounded-lg flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Swipe hint — mobile only */}
              <p className="mt-2 text-center text-[11px] text-ivory/30 tracking-wide sm:hidden">Swipe to see more</p>

              {/* Open in Maps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={collageInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-4 flex justify-end"
              >
                <a
                  href="https://maps.google.com/?q=Powel+Crosley+Estate,+8374+N+Tamiami+Trl,+Sarasota,+FL+34243"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-gold/30 text-ivory/80 hover:text-gold hover:border-gold/60 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2C5.79 2 4 3.79 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" />
                    <circle cx="8" cy="6" r="1.5" />
                  </svg>
                  Open in Maps
                </a>
              </motion.div>
            </div>

            <FadeIn delay={0.15}>
              <div className="flex items-start gap-3 bg-black/20 rounded-xl p-4 border border-gold/15">
                <Sun size={22} className="text-gold/70 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-ivory text-sm">February in Sarasota</p>
                  <p className="text-ivory/60 text-sm mt-1">
                    Expect ~75°F, low humidity, and sunny skies. Sarasota in February is paradise.
                    Light layers for the evening reception.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right column */}
          <div className="space-y-10 min-w-0">
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
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-display text-xl font-semibold text-gold w-12 shrink-0">{a.code}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-ivory leading-snug">{a.name}</p>
                          {a.recommended && (
                            <p className="text-[10px] uppercase tracking-wider text-gold mt-0.5">Recommended</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-ivory/50 ml-2 text-right">{a.distance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ivory/40 mt-2">
                  Driving from Atlanta: ~8.5 hours via I-75 South. A beautiful drive!
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h3 className="font-display text-2xl italic text-ivory mb-1">Where to Stay</h3>
                <div className="gold-divider w-12 mb-5" />
                <div className="flex items-start gap-3 bg-gold/8 rounded-xl p-4 border border-gold/25 mb-5">
                  <Bell size={18} className="text-gold/70 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-ivory/70 leading-relaxed">
                    <span className="text-gold font-medium">Hotel block & shuttle details coming soon.</span>{' '}
                    We&apos;re finalizing room blocks and transportation. Check back for updates before booking.
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
                      <p className="flex items-center gap-1 text-xs text-ivory/50 mt-1"><MapPin size={11} className="shrink-0" />{h.distance}</p>
                      <p className="text-xs text-ivory/60 mt-1">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close — always in safe top-right corner */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 w-11 h-11 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:text-gold hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            {/* Image + side arrows */}
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-3xl px-4"
              onClick={e => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={venuePhotos[lightboxIndex].src}
                alt={venuePhotos[lightboxIndex].alt}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Prev */}
              {lightboxIndex > 0 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:text-gold transition-colors"
                  aria-label="Previous photo"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 3L5 8l5 5" />
                  </svg>
                </button>
              )}

              {/* Next */}
              {lightboxIndex < venuePhotos.length - 1 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:text-gold transition-colors"
                  aria-label="Next photo"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </button>
              )}
            </motion.div>

            {/* Dots — large tap targets below image */}
            <div className="flex gap-1 mt-5" onClick={e => e.stopPropagation()}>
              {venuePhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="p-3 flex items-center justify-center"
                  aria-label={`View photo ${i + 1}`}
                >
                  <span className={`block w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-gold' : 'bg-white/30'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

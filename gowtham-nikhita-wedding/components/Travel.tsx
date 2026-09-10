'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Sun, Bell, MapPin } from 'lucide-react'
import { VENUES, venueMapUrl, type VenueKey } from '@/lib/wedding'

// Photographs of the two venues, chosen by the couple. Each is tagged with the
// venue it belongs to and rendered beneath that venue's address rather than in
// one pooled collage — with two sites in two different cities, an unlabelled
// grid leaves a guest unable to tell which place they are looking at.
//
// Order within a venue is deliberate: the strongest shot leads, since it is the
// one that sets the tone at a glance.
//
// The lightbox indexes into this flat array, so the arrow keys walk all six in
// order and the strips stay in sync with it. Keep the venues grouped.
const venuePhotos: { src: string; alt: string; venue: VenueKey }[] = [
  { venue: 'monastery', src: '/venue/monastery-cloister.webp', alt: 'The vaulted cloister walk at the Ancient Spanish Monastery' },
  { venue: 'monastery', src: '/venue/monastery-exterior.webp', alt: 'The monastery chapel and its formal gardens from the lawn' },
  { venue: 'monastery', src: '/venue/monastery-courtyard.webp', alt: 'The fountain courtyard under the monastery’s timbered arcade' },
  { venue: 'garden', src: '/venue/garden-reception.jpeg', alt: 'Reception tables set under string lights at Miami Beach Botanical Garden' },
  { venue: 'garden', src: '/venue/garden-pond.webp', alt: 'The lily pond at the botanical garden lit at dusk' },
  { venue: 'garden', src: '/venue/garden-bridge.webp', alt: 'The red arched bridge in the botanical garden’s Japanese garden' },
]

// Distances are to Miami Beach, where two of the three events are. MIA and FLL
// are both fine — guests are told to take whichever fare suits them, so no one
// airport is flagged as the house recommendation.
const airports = [
  { code: 'MIA', name: 'Miami International Airport', distance: '~30 min' },
  { code: 'FLL', name: 'Fort Lauderdale–Hollywood International', distance: '~45 min' },
  { code: 'PBI', name: 'Palm Beach International Airport', distance: '~1.5 hours' },
]

/** The three photos belonging to one venue, laid out beneath its address.
 *  Mobile gets a snap-scrolling row; desktop fans them out slightly so the
 *  strip reads as a set of prints rather than a grid. */
function PhotoStrip({ venue, onOpen }: { venue: VenueKey; onOpen: (flatIndex: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  // Index into the flat array, not into the filtered one — the lightbox walks
  // all six photos in order.
  const photos = venuePhotos
    .map((p, flatIndex) => ({ ...p, flatIndex }))
    .filter(p => p.venue === venue)

  return (
    <div ref={ref} className="mt-4">
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden -mx-6 px-6 pb-1 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-6 sm:items-start">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.1 }}
            onClick={() => onOpen(photo.flatIndex)}
            className={`snap-center shrink-0 w-[70vw] sm:w-auto sm:flex-1 rounded-lg overflow-hidden border shadow-lg cursor-zoom-in group relative
              ${i === 0 ? 'border-gold/25 sm:-rotate-[1deg]' : ''}
              ${i === 1 ? 'border-gold/20 sm:rotate-[0.8deg] sm:translate-y-3' : ''}
              ${i === 2 ? 'border-gold/30 sm:-rotate-[0.5deg] sm:translate-y-1' : ''}
            `}
            aria-label={`View ${photo.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-40 sm:h-32 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-black/55 backdrop-blur-sm rounded-md flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2h4v4M6 14H2v-4M14 10l-4 4M2 6l4-4" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
      <p className="mt-1.5 text-center text-[11px] text-ivory/30 tracking-wide sm:hidden">Swipe to see more</p>
    </div>
  )
}

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
                <h3 className="font-display text-2xl italic text-ivory mb-1">The Venues</h3>
                <div className="gold-divider w-12 mb-4" />

                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-1">Feb 17 · Sangeet</p>
                    <p className="text-ivory font-medium">{VENUES.monastery.name}</p>
                    <p className="text-ivory/60 text-sm mt-1">
                      {VENUES.monastery.street}, {VENUES.monastery.city}, {VENUES.monastery.state} {VENUES.monastery.postalCode}
                    </p>
                    <a
                      href={venueMapUrl('monastery')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ivory/50 hover:text-gold transition-colors mt-1"
                    >
                      <MapPin size={11} className="shrink-0" />Open in Maps
                    </a>
                    <PhotoStrip venue="monastery" onOpen={setLightboxIndex} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gold/80 mb-1">Feb 18 · Ceremony &amp; Reception</p>
                    <p className="text-ivory font-medium">{VENUES.garden.name}</p>
                    <p className="text-ivory/60 text-sm mt-1">
                      {VENUES.garden.street}, {VENUES.garden.city}, {VENUES.garden.state} {VENUES.garden.postalCode}
                    </p>
                    <a
                      href={venueMapUrl('garden')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ivory/50 hover:text-gold transition-colors mt-1"
                    >
                      <MapPin size={11} className="shrink-0" />Open in Maps
                    </a>
                    <PhotoStrip venue="garden" onOpen={setLightboxIndex} />
                  </div>
                </div>

                <p className="text-xs text-ivory/40 mt-4 leading-relaxed">
                  The two sites are about 25 minutes apart. There is parking at both — a lot
                  at the monastery, a garage and street parking at the garden. Shuttle
                  service is being looked into and we&apos;ll confirm here.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex items-start gap-3 bg-black/20 rounded-xl p-4 border border-gold/15">
                <Sun size={22} strokeWidth={2.5} className="text-gold/70 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-ivory text-sm">February in Miami</p>
                  <p className="text-ivory/60 text-sm mt-1">
                    Expect ~76°F, sea breeze, and sunny skies — February is the best month
                    South Florida has. Light layers for the evening events.
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
                      className="flex items-center justify-between p-3 rounded-lg border bg-black/15 border-gold/12"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-display text-xl font-semibold text-gold w-12 shrink-0">{a.code}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-ivory leading-snug">{a.name}</p>
                        </div>
                      </div>
                      <span className="text-sm text-ivory/50 ml-2 text-right">{a.distance}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ivory/40 mt-2">
                  MIA and FLL are both easy — take whichever fare works out better.
                  Driving from Atlanta is ~10 hours via I-75 and the Florida Turnpike.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <h3 className="font-display text-2xl italic text-ivory mb-1">Where to Stay</h3>
                <div className="gold-divider w-12 mb-5" />
                <div className="flex items-start gap-3 bg-gold/8 rounded-xl p-4 border border-gold/25 mb-5">
                  <Bell size={18} strokeWidth={2.5} className="text-gold/70 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-ivory/70 leading-relaxed">
                    <span className="text-gold font-medium">Hotel block coming soon.</span>{' '}
                    Our planners are putting together a room block near {VENUES.garden.name} in
                    Miami Beach, so you&apos;ll be a short trip from both days. We&apos;ll post it
                    here with booking details — please hold off until then.
                  </p>
                </div>

                <p className="text-sm text-ivory/60 leading-relaxed">
                  There is a gap between the ceremony and the reception on the 18th — that
                  time is yours to head back and change.
                </p>
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

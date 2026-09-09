// Single source of truth for where and when the wedding is.
//
// The venue moved away from the original Sarasota booking in August 2026.
// Before this file existed the venue was hardcoded in 28 places across 7 files
// and the dates in 27 more, so changing either meant hunting through the whole
// codebase. Everything that names a venue or the dates should read from here.
//
// The wedding now runs across TWO venues, which is why this file exposes a
// VENUES map rather than the single VENUE object it started with: the sangeet
// is in North Miami Beach and the ceremony and reception share a second site in
// Miami Beach. Anything that wants "the location" in a decorative sense — hero,
// footer, timeline — still gets one umbrella string from venueShort(); anything
// a guest actually navigates by has to name the specific venue.

/** A place an event happens. `street` onwards feed calendar invites and maps. */
type Venue = {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
}

export const VENUES = {
  /** Sangeet, Feb 17. Roughly 25 minutes north of the garden. */
  monastery: {
    name: 'Ancient Spanish Monastery',
    street: '16711 W Dixie Hwy',
    city: 'North Miami Beach',
    state: 'FL',
    postalCode: '33160',
  },
  /** Ceremony and reception, Feb 18 — both events share this one site. */
  garden: {
    name: 'Miami Beach Botanical Garden',
    street: '2000 Convention Center Dr',
    city: 'Miami Beach',
    state: 'FL',
    postalCode: '33139',
  },
} as const satisfies Record<string, Venue>

export type VenueKey = keyof typeof VENUES

/**
 * Flip to true once the venues are public. While false the site names no venue
 * at all and the Travel section stays a placeholder — a stale venue is worse
 * than none, because guests book flights and hotels against it.
 */
export const VENUE_ANNOUNCED = true

/** The umbrella city, used where a specific venue would be noise. Both venues
 *  sit inside greater Miami; neither city name covers the other, so the region
 *  is what the decorative slots get. */
export const REGION = { city: 'Miami', state: 'FL' } as const

/** Shown wherever a venue would normally appear, while it is still unknown */
export const VENUE_TBA = 'Venue to be announced'

/**
 * Closes the RSVP form entirely.
 *
 * Every party is also flagged `on_hold` in the database, which stops the API
 * accepting a submission. This flag is the front of that: it replaces the
 * lookup form with a notice, so nobody types their name only to be told to
 * come back later. Set to false to reopen — and remember the database flags
 * have to be cleared too, leaving Meera Ramesh, Dhruv Patel and Sharrief
 * Muhammed held, since those three were on hold for their own reasons.
 */
export const RSVP_PAUSED = true

/** "Miami, FL" — the region alone. */
export function cityShort(): string {
  return [REGION.city, REGION.state].filter(Boolean).join(', ')
}

/** The location line for decorative use — hero, footer, timeline. Deliberately
 *  the region and not a venue: two of them would not fit and one would mislead. */
export function venueShort(): string {
  return cityShort() || VENUE_TBA
}

/** The venue's own name, for the schedule card a guest is reading to find out
 *  where to go. Falls back to the region while the venues are unannounced. */
export function venueName(key: VenueKey): string {
  if (!VENUE_ANNOUNCED) return VENUE_TBA
  return VENUES[key].name
}

/** Name plus city — enough to orient someone scanning the schedule, without
 *  the full postal address cluttering the card. */
export function venueLine(key: VenueKey): string {
  if (!VENUE_ANNOUNCED) return `${cityShort()} · ${VENUE_TBA}`
  const v = VENUES[key]
  return `${v.name} · ${v.city}, ${v.state}`
}

/** Full postal address for calendar invites and map links. Empty while
 *  unannounced, which is deliberate: a calendar entry with a stale address is
 *  worse than one with none, because it silently lives on in someone's phone. */
export function venueAddress(key: VenueKey): string {
  if (!VENUE_ANNOUNCED) return ''
  const v = VENUES[key]
  return [v.name, v.street, `${v.city}, ${v.state} ${v.postalCode}`].filter(Boolean).join(', ')
}

/** Google Maps search link for a venue. */
export function venueMapUrl(key: VenueKey): string {
  return `https://maps.google.com/?q=${encodeURIComponent(venueAddress(key) || cityShort())}`
}

export const DATES = {
  /** Display strings — change these if the dates move */
  range: 'February 17–18, 2027',
  rangeShort: 'Feb 17–18, 2027',
  sangeet: { date: 'Feb 17', day: 'Wednesday' },
  ceremony: { date: 'Feb 18', day: 'Thursday Morning' },
  reception: { date: 'Feb 18', day: 'Thursday Evening' },
} as const

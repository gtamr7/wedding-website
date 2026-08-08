// Single source of truth for where and when the wedding is.
//
// The venue moved away from Powel Crosley Estate in August 2026 and the
// replacement is undecided. Before this file existed the old venue was
// hardcoded in 28 places across 7 files and the dates in 27 more, so changing
// either meant hunting through the whole codebase. Everything that names the
// venue or the dates should read from here.
//
// To announce a new venue: fill in VENUE and set `announced` to true. Nothing
// else needs editing except the Travel page, which carries city-specific
// content that has to be rewritten by hand.

export const VENUE = {
  /** Flip to true once the venue is public. While false the site says TBA. */
  announced: false,

  name: '',
  /** Street address — used for calendar invites and map links */
  street: '',
  city: '',
  state: '',
  postalCode: '',
} as const

/** Shown wherever a venue would normally appear, while it is still unknown */
export const VENUE_TBA = 'Venue to be announced'

/** "Powel Crosley Estate, Sarasota, FL" — or the TBA text */
export function venueShort(): string {
  if (!VENUE.announced) return VENUE_TBA
  return [VENUE.name, VENUE.city, VENUE.state].filter(Boolean).join(', ')
}

/** Full postal address for calendar invites. Empty while unannounced, which
 *  is deliberate: a calendar entry with a stale address is worse than one
 *  with none, because it silently lives on in someone's phone. */
export function venueAddress(): string {
  if (!VENUE.announced) return ''
  return [VENUE.name, VENUE.street, `${VENUE.city}, ${VENUE.state} ${VENUE.postalCode}`]
    .filter(Boolean).join(', ')
}

export const DATES = {
  /** Display strings — change these if the dates move */
  range: 'February 17–18, 2027',
  rangeShort: 'Feb 17–18, 2027',
  sangeet: { date: 'Feb 17', day: 'Wednesday' },
  ceremony: { date: 'Feb 18', day: 'Thursday Morning' },
  reception: { date: 'Feb 18', day: 'Thursday Evening' },
} as const

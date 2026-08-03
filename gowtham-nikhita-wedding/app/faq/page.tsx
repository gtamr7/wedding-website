import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ · Gowtham & Nikhita',
  description: 'Answers to common questions about our wedding weekend.',
}

function FaqLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-gold hover:text-gold-light transition-colors"
    >
      {children}
    </a>
  )
}

const faqs = [
  {
    q: 'Is there parking at the venue?',
    a: 'Parking is limited, so please carpool if at all possible. There are also hotels within walking distance of the venue, which makes getting there and back much easier. Shuttle information will be released soon — check back here for updates.',
  },
  {
    q: 'Is there a hotel block?',
    a: 'Hotel block information is coming soon.',
  },
  {
    q: 'Where can I get outfits for the events?',
    // Tracking parameters (gclid, utm_*, srsltid) were stripped from these —
    // they came from ad clicks and would have passed those click IDs on to
    // every guest.
    a: (
      <>
        <p>
          If you&apos;re shopping for Indian attire and not sure where to start, here are a
          few places we&apos;d point you to.
        </p>

        <p className="mt-4 text-xs uppercase tracking-widest text-charcoal/45">In store</p>
        <p className="mt-1">
          Both are at Global Mall —{' '}
          <FaqLink href="https://www.google.com/maps/search/?api=1&query=Ladlee%20Global%20Mall">Ladlee</FaqLink>
          {' '}and{' '}
          <FaqLink href="https://www.google.com/maps/search/?api=1&query=Rahul%27s%20Clothing%20Global%20Mall">Rahul&apos;s Clothing</FaqLink>.
        </p>

        <p className="mt-4 text-xs uppercase tracking-widest text-charcoal/45">Online</p>
        <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
          {[
            ['Lashkaraa', 'https://www.lashkaraa.com/'],
            ['Kynah', 'https://shopkynah.com/pages/womens'],
            ['The Saree Room', 'https://www.thesareeroom.com/en-us'],
            ['Kalista', 'https://kalistastudio.in/collections/lehenga-sets'],
            ['Aza', 'https://www.azafashions.com/en-us/wedding'],
            ['Kalki', 'https://www.kalkifashion.com/'],
          ].map(([label, href], i, arr) => (
            <li key={href}>
              <FaqLink href={href}>{label}</FaqLink>{i < arr.length - 1 && <span className="text-charcoal/30">,</span>}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-charcoal/50">
          Shipping from overseas can take a few weeks, so give yourself time if you order online.
        </p>
      </>
    ),
  },
  {
    q: 'What’s the schedule for the weekend?',
    a: (
      <>
        See the{' '}
        <Link href="/#schedule" className="underline text-gold hover:text-gold-light transition-colors">
          Schedule
        </Link>{' '}
        section on the home page for the full weekend lineup.
      </>
    ),
  },
]

export default function FaqPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">FAQ</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 max-w-md mx-auto">
              A few common questions — more answers coming as details firm up.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b border-olive-dark/10 pb-8 last:border-0">
                <h2 className="font-display text-2xl italic text-charcoal mb-2">{q}</h2>
                {/* div rather than p: some answers contain lists */}
                <div className="text-charcoal/70 leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

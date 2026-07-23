import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ · Gowtham & Nikhita',
  description: 'Answers to common questions about our wedding weekend.',
}

const faqs = [
  {
    q: 'Is there parking at the venue?',
    a: 'Parking is limited, so please carpool if at all possible. Shuttle information will be released soon — check back here for updates.',
  },
  {
    q: 'Is there a hotel block?',
    a: 'Hotel block information is coming soon.',
  },
  {
    q: 'What’s the schedule for the weekend?',
    a: (
      <>
        See the{' '}
        <Link href="/#schedule" className="underline text-gold hover:text-gold-light transition-colors">
          Schedule section
        </Link>{' '}
        on the home page for the full weekend lineup.
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
                <p className="text-charcoal/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

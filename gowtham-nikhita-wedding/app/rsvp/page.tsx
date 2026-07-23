import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RsvpForm from '@/components/RSVP/RsvpForm'
export const metadata: Metadata = {
  title: 'RSVP · Gowtham & Nikhita',
  description: 'Let us know you\'re coming to our wedding celebration.',
}

export default function RsvpPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">RSVP</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 max-w-md mx-auto">
              We&apos;d love to have you celebrate with us. Please type your full name below.
            </p>
            <p className="text-gold text-xs mt-2 font-medium tracking-wide">
              Please RSVP by August 31
            </p>
          </div>

          <RsvpForm />

          <p className="text-[11px] text-charcoal/45 text-center mt-8 max-w-sm mx-auto leading-relaxed">
            SMS updates are optional and sent only to guests who opt in via the checkbox
            on the next page. Msg &amp; data rates may apply. Reply STOP to opt out.
            <a href="/privacy" className="underline ml-1 hover:text-charcoal/60 transition-colors">Privacy Policy</a>
            {' '}·{' '}
            <a href="/terms" className="underline hover:text-charcoal/60 transition-colors">Terms</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

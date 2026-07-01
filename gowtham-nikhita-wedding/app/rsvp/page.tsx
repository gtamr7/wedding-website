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
            <p className="text-xs tracking-widest uppercase text-gold mb-3">You&apos;re Invited</p>
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">RSVP</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 max-w-md mx-auto">
              We&apos;d love to have you celebrate with us. Please let us know which events you&apos;ll be attending.
            </p>
          </div>

          <RsvpForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

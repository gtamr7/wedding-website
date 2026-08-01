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
          {/* The header lives inside RsvpForm so it can respond to the current
              step — the "type your full name" prompt is wrong once you're past
              the lookup, and the whole block is wrong on the success screen. */}
          <RsvpForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

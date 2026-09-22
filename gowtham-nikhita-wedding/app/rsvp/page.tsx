import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RsvpForm from '@/components/RSVP/RsvpForm'
import InvitationCard from '@/components/RSVP/InvitationCard'

export const metadata: Metadata = {
  title: 'RSVP · Gowtham & Nikhita',
  description: 'Let us know you\'re coming to our wedding celebration.',
}

export default function RsvpPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-olive-dark pt-24 pb-20 px-4 sm:px-6">
        <InvitationCard>
          {/* The header lives inside RsvpForm so it can respond to the current
              step — the "type your full name" prompt is wrong once you're past
              the lookup, and the whole block is wrong on the success screen. */}
          <RsvpForm />
        </InvitationCard>
      </main>
      <Footer />
    </>
  )
}

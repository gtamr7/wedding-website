import type { Metadata } from 'next'
import Image from 'next/image'
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
      <main className="relative min-h-screen bg-olive-dark pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* A faded photo behind the card. The card is only as tall as the
            current step, and on a phone the lookup step left most of the
            screen as flat green below it. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image src="/gallery/IMG_0410.jpg" alt="" fill sizes="100vw" quality={60} className="object-cover object-[50%_70%] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-olive-dark/75 via-olive-dark/30 to-olive-dark/70" />
        </div>
        <div className="relative">
        <InvitationCard>
          {/* The header lives inside RsvpForm so it can respond to the current
              step — the "type your full name" prompt is wrong once you're past
              the lookup, and the whole block is wrong on the success screen. */}
          <RsvpForm />
        </InvitationCard>
        </div>
      </main>
      <Footer />
    </>
  )
}

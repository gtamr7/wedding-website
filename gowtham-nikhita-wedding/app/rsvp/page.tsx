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
        {/* The photo. On phones it sits faded behind the card, filling the
            flat green the lookup step left below it. On wider screens a
            portrait photo stretched to the full width put the card right over
            our heads, so there the page splits: card on the left, photo in
            the right 45%, fading into the olive where they meet. */}
        <div className="absolute inset-0 lg:left-auto lg:w-[45%] pointer-events-none" aria-hidden="true">
          <Image src="/gallery/IMG_0410.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" quality={60} className="object-cover object-[50%_70%] lg:object-[50%_100%] opacity-60 lg:opacity-85" />
          <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-olive-dark/75 via-olive-dark/30 to-olive-dark/70" />
          <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(to_right,var(--color-olive-dark)_0%,transparent_30%),linear-gradient(to_bottom,rgba(74,92,47,0.35)_0%,transparent_25%,transparent_80%,rgba(74,92,47,0.5)_100%)]" />
        </div>
        <div className="relative lg:w-[55%] lg:pt-4">
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

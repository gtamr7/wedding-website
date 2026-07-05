import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BetBoard from '@/components/Bets/BetBoard'
import PasswordGate from '@/components/PasswordGate'

export const metadata: Metadata = {
  title: 'The Bets · Gowtham & Nikhita',
  description: 'Wedding day over/unders and prop bets. No real money — just bragging rights.',
}

export default function BetsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-3">For Fun Only · No Real Money</p>
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">The Bets</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 leading-relaxed max-w-sm mx-auto">
              Over/unders and prop bets on the big day. Pick your winners, compete for bragging rights,
              and see the leaderboard after the wedding.
            </p>
          </div>

          <PasswordGate>
            <BetBoard />
          </PasswordGate>
        </div>
      </main>
      <Footer />
    </>
  )
}

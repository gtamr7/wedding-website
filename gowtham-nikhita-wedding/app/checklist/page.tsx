import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ChecklistView from '@/components/Checklist/ChecklistView'

export const metadata: Metadata = {
  title: 'My Status · Gowtham & Nikhita',
  description: 'See everything you have done and what is still ahead for the wedding.',
}

export default function ChecklistPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-gold mb-3">Wedding Prep</p>
            <h1 className="font-display text-5xl sm:text-6xl italic text-charcoal">My Status</h1>
            <div className="gold-divider w-24 mt-4 mx-auto" />
            <p className="text-charcoal/50 text-sm mt-4 max-w-sm mx-auto">
              Enter your name to see what you have done and what is still ahead.
            </p>
          </div>
          <Suspense>
            <ChecklistView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

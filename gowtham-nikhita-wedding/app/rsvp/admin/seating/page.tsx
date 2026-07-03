import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import SeatingAdmin from '@/components/RSVP/SeatingAdmin'

export const metadata: Metadata = {
  title: 'Seating Chart · Coordinator',
  robots: 'noindex',
}

export default function SeatingPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <SeatingAdmin />
      </main>
    </>
  )
}

import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import RsvpAdmin from '@/components/RSVP/RsvpAdmin'

export const metadata: Metadata = {
  title: 'RSVP Admin · Coordinator',
  robots: 'noindex',
}

export default function RsvpAdminPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <RsvpAdmin />
      </main>
    </>
  )
}

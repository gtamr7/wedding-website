import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import AdminBets from '@/components/Bets/AdminBets'

export const metadata: Metadata = {
  title: 'Bets Admin · Coordinator',
  robots: 'noindex',
}

export default function BetsAdminPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <AdminBets />
      </main>
    </>
  )
}

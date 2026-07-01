import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import AdminView from '@/components/PhotoOrder/AdminView'

export const metadata: Metadata = {
  title: 'Photo Admin · Coordinator',
  robots: 'noindex',
}

export default function PhotoAdminPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <AdminView />
      </main>
    </>
  )
}

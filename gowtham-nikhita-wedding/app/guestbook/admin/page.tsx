import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import GuestbookAdmin from '@/components/Guestbook/GuestbookAdmin'

export const metadata: Metadata = {
  title: 'Guestbook Review · Coordinator',
  robots: 'noindex',
}

export default function GuestbookAdminPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-ivory pt-24 pb-16 px-4 sm:px-6">
        <GuestbookAdmin />
      </main>
    </>
  )
}

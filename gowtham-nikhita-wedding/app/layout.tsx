import type { Metadata, Viewport } from 'next'
import { Italiana, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ScrollResetOnRefresh from '@/components/ScrollResetOnRefresh'
import PasswordGate from '@/components/PasswordGate'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Italiana ships exactly one face: weight 400, upright. Asking next/font for
// any other weight, or for an italic, is a build error rather than a silent
// fallback — so this config is the whole family, not a subset of it. The site
// used italic display headings throughout before this; they are all upright
// now, because a sheared fake italic on a face this thin looks cheap.
const italiana = Italiana({
  variable: '--font-italiana',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

// Jost rather than Inter. The body text leans on font-medium (500) in ~58
// places, and Jost carries a real 500 and 600 — Lato, the other candidate,
// has neither and would have flattened every one of them to 400. Jost is not
// a variable font, so the weight list is required.
const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gowthamandnikhita.com'),
  title: 'Gowtham & Nikhita · February 17–18, 2027',
  description:
    'Join us for our wedding celebration — a Tamil/Telugu Hindu celebration of love.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Gowtham & Nikhita · February 17–18, 2027',
    description: 'A Tamil/Telugu Hindu celebration of love.',
    type: 'website',
    images: [{ url: '/gallery/IMG_0314.jpg', width: 1200, height: 800, alt: 'Gowtham & Nikhita' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${italiana.variable} ${jost.variable}`}>
      <body className="min-h-screen bg-ivory text-charcoal font-sans antialiased">
        <ScrollResetOnRefresh />
        {/* Wraps every route, so the password is asked once and remembered.
            Analytics stays outside it — it renders no UI, and keeping it here
            means a visit still registers even if someone never gets in. */}
        <PasswordGate>{children}</PasswordGate>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

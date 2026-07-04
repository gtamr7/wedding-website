import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gowthamandnikhita.com'),
  title: 'Gowtham & Nikhita · February 17–18, 2027',
  description:
    'Join us for our wedding celebration at Powel Crosley Estate, Sarasota, FL — A Tamil/Telugu Hindu celebration of love.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Gowtham & Nikhita · February 17–18, 2027',
    description: 'A Tamil/Telugu Hindu celebration of love at Powel Crosley Estate, Sarasota, FL.',
    type: 'website',
    images: [{ url: '/gallery/IMG_0314.jpg', width: 1200, height: 800, alt: 'Gowtham & Nikhita' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory text-charcoal font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

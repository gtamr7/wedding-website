import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-olive-light py-16 px-6 border-t border-gold/15" style={{ backgroundColor: '#111A0A' }}>
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Names */}
        <div>
          <p className="font-display text-3xl italic text-gold-light">Gowtham &amp; Nikhita</p>
          <p className="text-olive-light/70 mt-1 text-sm tracking-widest uppercase">
            February 17–18, 2027 · Powel Crosley Estate · Sarasota, FL
          </p>
        </div>

        {/* Divider */}
        <div className="gold-divider w-48 mx-auto opacity-50" />

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-olive-light/60 tracking-widest uppercase">
          {[
            { label: 'Our Story', href: '/#story' },
            { label: 'Schedule', href: '/#schedule' },
            { label: 'Travel', href: '/#travel' },
            { label: 'Registry', href: '/#registry' },
            { label: 'RSVP', href: '/rsvp' },
            { label: 'Photos', href: '/photos' },
            { label: 'The Bets', href: '/bets' },
            { label: 'Guestbook', href: '/guestbook' },
            { label: 'My Checklist', href: '/checklist' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold-light transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Made with love */}
        <p className="text-xs text-olive-light/40">Made with love in Atlanta 🌿</p>
        <p className="text-xs text-olive-light/30 italic">Created by yours truly, the groom</p>
      </div>
    </footer>
  )
}

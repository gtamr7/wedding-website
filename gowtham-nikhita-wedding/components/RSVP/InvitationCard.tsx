// Cream card stock with a double gold rule, sitting on the site's olive.
// Every RSVP step, including the paused and closed notices, renders on it.

// Faint paper grain. fractalNoise at low opacity reads as texture without
// muddying the cream.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.38 0 0 0 0 0.2 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`absolute w-7 h-7 sm:w-9 sm:h-9 text-gold ${className}`} fill="none" aria-hidden="true">
      <path d="M2 38 V14 C2 7 7 2 14 2 H38" stroke="currentColor" strokeWidth="1" />
      <path d="M8 38 V18 C8 12 12 8 18 8 H38" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
      <path d="M14 14 C17 10 22 11 22 15 C22 19 17 19 16 16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" />
    </svg>
  )
}

export default function InvitationCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative mx-auto max-w-2xl bg-ivory text-charcoal rounded-[3px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55),0_10px_20px_-10px_rgba(0,0,0,0.35)]"
      style={{ backgroundImage: PAPER_GRAIN }}
    >
      {/* Double gold rule, inset from the card edge */}
      <div className="pointer-events-none absolute inset-2.5 sm:inset-3.5 border border-gold/60 rounded-[2px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-4 sm:inset-5 border border-gold/30" aria-hidden="true" />
      <Corner className="top-4 left-4 sm:top-5 sm:left-5" />
      <Corner className="top-4 right-4 sm:top-5 sm:right-5 rotate-90" />
      <Corner className="bottom-4 right-4 sm:bottom-5 sm:right-5 rotate-180" />
      <Corner className="bottom-4 left-4 sm:bottom-5 sm:left-5 -rotate-90" />

      <div className="relative px-7 py-12 sm:px-14 sm:py-16">
        {children}
      </div>
    </div>
  )
}

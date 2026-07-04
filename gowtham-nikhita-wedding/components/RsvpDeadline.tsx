'use client'

const DEADLINE = new Date('2026-08-24T23:59:59')

export default function RsvpDeadline() {
  const days = Math.ceil((DEADLINE.getTime() - Date.now()) / 86_400_000)

  if (days <= 0) {
    return (
      <p className="text-charcoal/40 text-xs mt-2 tracking-wide">
        RSVP deadline has passed.
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2.5 mt-2">
      <p className="text-gold text-xs font-medium tracking-wide">
        Please RSVP by August 24
      </p>
      <span className="text-charcoal/25 text-xs">·</span>
      <span className="flex items-baseline gap-1">
        <span className="font-display italic text-xl leading-none text-gold">{days}</span>
        <span className="text-xs text-charcoal/45 tracking-wide">
          {days === 1 ? 'day' : 'days'} left
        </span>
      </span>
    </div>
  )
}

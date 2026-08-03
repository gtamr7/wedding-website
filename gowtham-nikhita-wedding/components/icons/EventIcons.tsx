type IconProps = { size?: number; className?: string }

// One system for all three: 24x24 box, no fills, a single 1.8 stroke with
// round caps and joins, and shapes simple enough to survive being rendered at
// 11px in the admin tables. Detail is deliberately withheld — the previous set
// mixed seven stroke widths and four fill opacities, which is what made them
// look generated rather than drawn.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Two beamed notes — Sangeet */
export function SangeetIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* Stems and beam drawn as one stroke, so the corner joins cleanly */}
      <path d="M9.5 17V6.2l10-2.1V15" {...base} />
      <circle cx="7" cy="17.2" r="2.6" {...base} />
      <circle cx="17" cy="15.1" r="2.6" {...base} />
    </svg>
  )
}

/** Diya — Ceremony (Kalyaanam) */
export function DiyaIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* The flame sits over the spout, not the centre of the bowl. That
          off-centre placement is what distinguishes a diya from a generic
          lamp — the wick rests in the pinched lip at one end. */}
      <path d="M18.6 3.4c1.6 2.7 2.4 4.2 2.4 5.5a2.4 2.4 0 0 1-4.8 0c0-1.3.8-2.8 2.4-5.5Z" {...base} />
      {/* Shallow clay vessel, rim rising to a point at the spout */}
      <path d="M2.4 15 19.8 12.4c-.6 5-4.6 7.8-9 7.8-4.8 0-8.4-2-8.4-5.2Z" {...base} />
    </svg>
  )
}

/** Two flutes raised — Reception */
export function CheersIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {/* Tilted toward each other so the pair reads as a toast, without
          resorting to sparkle marks */}
      <g transform="rotate(-11 8.5 12)">
        <path d="M5.9 3.4h5.2l-1.7 8.4a.9.9 0 0 1-1.8 0Z" {...base} />
        <path d="M8.5 12.6V19.6M6.1 20.4h4.8" {...base} />
      </g>
      <g transform="rotate(11 15.5 12)">
        <path d="M12.9 3.4h5.2l-1.7 8.4a.9.9 0 0 1-1.8 0Z" {...base} />
        <path d="M15.5 12.6V19.6M13.1 20.4h4.8" {...base} />
      </g>
    </svg>
  )
}

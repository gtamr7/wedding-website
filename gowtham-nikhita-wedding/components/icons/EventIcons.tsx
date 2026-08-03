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
      {/* The flame carries the icon and has to be the taller of the two
          shapes. Drawn small it reads as a droplet sitting in a bowl, and
          pushed off to one side to imply a spout it just looks lopsided. */}
      <path d="M12 2.6c2.9 4.6 4 7.2 4 9.1a4 4 0 0 1-8 0c0-1.9 1.1-4.5 4-9.1Z" {...base} />
      {/* Shallow vessel, with a short foot to sit it on the ground */}
      <path d="M4 15h16c0 3.2-3.6 5.2-8 5.2S4 18.2 4 15Z" {...base} />
      <path d="M9.5 21.6h5" {...base} />
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

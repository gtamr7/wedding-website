type IconProps = { size?: number; className?: string }

/** Beamed eighth notes — Sangeet */
export function SangeetIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {/* Note heads */}
      <ellipse cx="5.5" cy="18.2" rx="2.6" ry="1.9" transform="rotate(-12 5.5 18.2)" />
      <ellipse cx="14" cy="16" rx="2.6" ry="1.9" transform="rotate(-12 14 16)" />
      {/* Stems */}
      <line x1="7.9" y1="17.3" x2="7.9" y2="5.5" />
      <line x1="16.4" y1="15.1" x2="16.4" y2="3.5" />
      {/* Double beam */}
      <path d="M7.9 5.5 L16.4 3.5" />
      <path d="M7.9 7.7 L16.4 5.7" />
    </svg>
  )
}

/** Diya oil lamp — Ceremony (Kalyaanam) */
export function DiyaIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {/* Flame */}
      <path d="M12 14C12 14 9 11.5 10 9C10.5 7.5 12 6 12 6C12 6 13.5 7.5 14 9C15 11.5 12 14 12 14Z" />
      {/* Lamp body */}
      <path d="M3.5 18C3.5 15.8 7.4 14 12 14C16.6 14 20.5 15.8 20.5 18C20.5 20.2 16.6 21.5 12 21.5C7.4 21.5 3.5 20.2 3.5 18Z" />
      {/* Spout / wick */}
      <path d="M19.5 16.2 Q21.5 15.5 22.5 14.5" />
    </svg>
  )
}

/** Crossed champagne flutes — Reception */
export function CheersIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {/* Left flute */}
      <path d="M6 3 L10 3 L8.5 12 Q8.5 14 7 14 L7 19.5" />
      <path d="M8.5 12 Q8.5 14 10 14" strokeWidth="1" opacity="0.6" />
      <line x1="5" y1="21" x2="9" y2="21" />
      <line x1="7" y1="19.5" x2="7" y2="21" />
      {/* Right flute */}
      <path d="M18 3 L14 3 L15.5 12 Q15.5 14 17 14 L17 19.5" />
      <path d="M15.5 12 Q15.5 14 14 14" strokeWidth="1" opacity="0.6" />
      <line x1="19" y1="21" x2="15" y2="21" />
      <line x1="17" y1="19.5" x2="17" y2="21" />
      {/* Bubbles inside left flute */}
      <circle cx="7.5" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      {/* Bubbles inside right flute */}
      <circle cx="16.5" cy="9" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      {/* Clink sparkle */}
      <path d="M12 4.5 L12 2.5 M11 3.5 L13 3.5" strokeWidth="1.2" />
    </svg>
  )
}

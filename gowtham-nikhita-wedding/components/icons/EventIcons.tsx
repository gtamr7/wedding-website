type IconProps = { size?: number; className?: string }

/** Beamed eighth notes — Sangeet */
export function SangeetIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      className={className} aria-hidden="true"
    >
      {/* Filled note heads — larger for visual weight */}
      <ellipse
        cx="5.5" cy="18.5" rx="3.3" ry="2.4"
        transform="rotate(-18 5.5 18.5)"
        fill="currentColor"
      />
      <ellipse
        cx="14.5" cy="16" rx="3.3" ry="2.4"
        transform="rotate(-18 14.5 16)"
        fill="currentColor"
      />
      {/* Stems */}
      <line x1="8.6" y1="17.3" x2="8.6" y2="4"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <line x1="17.6" y1="14.6" x2="17.6" y2="1.5"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      {/* Thick double beams */}
      <line x1="8.6" y1="4" x2="17.6" y2="1.5"
        stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="8.6" y1="7" x2="17.6" y2="4.5"
        stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

/** Diya oil lamp — Ceremony (Kalyaanam) */
export function DiyaIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" className={className} aria-hidden="true"
    >
      {/* Outer flame — outlined + semi-filled */}
      <path
        d="M12 13.5C12 13.5 9 11 10 8.5C10.5 7 12 5.5 12 5.5C12 5.5 13.5 7 14 8.5C15 11 12 13.5 12 13.5Z"
        fill="currentColor" fillOpacity="0.4"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Inner flame — solid fill for glow effect */}
      <path
        d="M12 12C12 12 10.5 10 11.2 8.5C11.5 7.8 12 7 12 7C12 7 12.5 7.8 12.8 8.5C13.5 10 12 12 12 12Z"
        fill="currentColor"
      />
      {/* Lamp body — subtle fill + bold stroke */}
      <path
        d="M4 18C4 15.8 7.6 14 12 14C16.4 14 20 15.8 20 18C20 20 17 21.5 12 21.5C7 21.5 4 20 4 18Z"
        fill="currentColor" fillOpacity="0.12"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
      />
      {/* Spout */}
      <path
        d="M18.5 15.8C20 15 21.5 14.2 22.5 13.5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      {/* Bowl highlight */}
      <path
        d="M8 20C9.5 20.7 14.5 20.7 16 20"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"
      />
    </svg>
  )
}

/** Champagne flutes — Reception */
export function CheersIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" className={className} aria-hidden="true"
    >
      {/* Left flute cup — trapezoid with subtle fill */}
      <path
        d="M4 3 L10 3 L7.5 13 L6.5 13 Z"
        fill="currentColor" fillOpacity="0.1"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
      />
      {/* Left stem */}
      <line x1="7" y1="13" x2="7" y2="19.5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Left base */}
      <line x1="4.5" y1="21" x2="9.5" y2="21"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="19.5" x2="7" y2="21"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Left bubbles */}
      <circle cx="6.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="7.5" cy="6.5" r="0.8" fill="currentColor" />

      {/* Right flute cup */}
      <path
        d="M20 3 L14 3 L16.5 13 L17.5 13 Z"
        fill="currentColor" fillOpacity="0.1"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
      />
      {/* Right stem */}
      <line x1="17" y1="13" x2="17" y2="19.5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Right base */}
      <line x1="19.5" y1="21" x2="14.5" y2="21"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="19.5" x2="17" y2="21"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Right bubbles */}
      <circle cx="17.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="6.5" r="0.8" fill="currentColor" />

      {/* Bold clink sparkle */}
      <line x1="12" y1="0.5" x2="12" y2="5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9.5" y1="2.75" x2="14.5" y2="2.75"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="10.2" y1="0.9" x2="13.8" y2="4.6"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13.8" y1="0.9" x2="10.2" y2="4.6"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

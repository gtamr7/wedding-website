// The G&N wax seal. It closes the envelope in the reveal and stamps down on
// the success screen, so both moments share one mark.
export default function WaxSeal({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="wax-fill" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#E3C766" />
          <stop offset="45%" stopColor="#B8972A" />
          <stop offset="100%" stopColor="#7A6118" />
        </radialGradient>
      </defs>
      {/* Uneven outer edge, where the wax spread past the stamp */}
      <path
        d="M50 3 C60 4 64 9 72 10 C80 12 84 18 89 25 C94 32 92 40 96 48 C99 56 93 62 91 70 C88 79 81 82 74 88 C67 94 59 93 50 97 C41 99 35 93 27 90 C19 86 14 81 10 73 C6 65 8 58 4 50 C1 41 8 35 10 27 C13 19 20 15 27 11 C35 6 41 3 50 3 Z"
        fill="url(#wax-fill)"
      />
      {/* Pressed rim of the stamp */}
      <circle cx="50" cy="50" r="33" fill="none" stroke="#6B5415" strokeOpacity="0.55" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="#F2DC8C" strokeOpacity="0.35" strokeWidth="1" />
      <text
        x="50" y="51" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-italiana), Didot, Georgia, serif" fontSize="25"
        fill="#5E4A12" fillOpacity="0.85" letterSpacing="0.5"
      >
        G&amp;N
      </text>
      {/* Highlight catching the light on the raised wax */}
      <ellipse cx="34" cy="26" rx="14" ry="6" fill="#FFF3C4" fillOpacity="0.28" transform="rotate(-28 34 26)" />
    </svg>
  )
}

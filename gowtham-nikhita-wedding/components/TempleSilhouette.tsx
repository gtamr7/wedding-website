export default function TempleSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C1C1A" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#1C1C1A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1C1C1A" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="tierGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8972A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#B8972A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Ground plane ── */}
      <rect x="0" y="760" width="1440" height="140" fill="url(#templeGrad)" />

      {/* ── Left wing wall ── */}
      <path
        d="M 0,760 L 0,700 L 120,700 L 120,680 L 200,680 L 200,700 L 545,700 L 545,760 Z"
        fill="#1C1C1A"
        fillOpacity="0.55"
      />
      {/* Left wall battlements */}
      {[30, 80, 130, 180, 230, 280, 330, 380, 430, 480].map((x) => (
        <rect key={x} x={x} y={672} width={18} height={28} fill="#1C1C1A" fillOpacity="0.55" />
      ))}

      {/* ── Right wing wall ── */}
      <path
        d="M 895,700 L 1240,700 L 1240,680 L 1320,680 L 1320,700 L 1440,700 L 1440,760 L 895,760 Z"
        fill="#1C1C1A"
        fillOpacity="0.55"
      />
      {/* Right wall battlements */}
      {[910, 960, 1010, 1060, 1110, 1160, 1210, 1260, 1310, 1360].map((x) => (
        <rect key={x} x={x} y={672} width={18} height={28} fill="#1C1C1A" fillOpacity="0.55" />
      ))}

      {/* ══════════════════════════════════
          MAIN GOPURAM TOWER
          Center: x=720, base y=760
          ══════════════════════════════════ */}

      {/* Plinth / base platform */}
      <path
        d="M 545,760 L 545,720 L 565,720 L 565,700 L 875,700 L 875,720 L 895,720 L 895,760 Z"
        fill="#1C1C1A"
        fillOpacity="0.75"
      />

      {/* Tier 1 — widest */}
      <path
        d="M 565,700 L 565,640 L 585,640 L 895-20,640"
        fill="none"
      />
      <path
        d="M 575,700 L 575,635 L 865,635 L 865,700 Z"
        fill="#1C1C1A"
        fillOpacity="0.78"
      />
      {/* Tier 1 niche row */}
      {[615, 660, 705, 750, 795].map((x) => (
        <path key={x} d={`M ${x},695 L ${x},665 Q ${x + 12},650 ${x + 24},665 L ${x + 24},695 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 2 */}
      <path d="M 590,635 L 590,578 L 850,578 L 850,635 Z" fill="#1C1C1A" fillOpacity="0.80" />
      {[630, 672, 714, 756, 798].map((x) => (
        <path key={x} d={`M ${x},630 L ${x},604 Q ${x + 11},590 ${x + 22},604 L ${x + 22},630 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 3 */}
      <path d="M 604,578 L 604,525 L 836,525 L 836,578 Z" fill="#1C1C1A" fillOpacity="0.82" />
      {[640, 679, 718, 757, 796].map((x) => (
        <path key={x} d={`M ${x},573 L ${x},549 Q ${x + 10},536 ${x + 20},549 L ${x + 20},573 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 4 */}
      <path d="M 617,525 L 617,476 L 823,476 L 823,525 Z" fill="#1C1C1A" fillOpacity="0.83" />
      {[648, 685, 722, 759].map((x) => (
        <path key={x} d={`M ${x},520 L ${x},497 Q ${x + 10},484 ${x + 20},497 L ${x + 20},520 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 5 */}
      <path d="M 629,476 L 629,431 L 811,431 L 811,476 Z" fill="#1C1C1A" fillOpacity="0.84" />
      {[656, 691, 726, 761].map((x) => (
        <path key={x} d={`M ${x},471 L ${x},450 Q ${x + 9},438 ${x + 18},450 L ${x + 18},471 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 6 */}
      <path d="M 640,431 L 640,390 L 800,390 L 800,431 Z" fill="#1C1C1A" fillOpacity="0.85" />
      {[663, 696, 730, 763].map((x) => (
        <path key={x} d={`M ${x},426 L ${x},407 Q ${x + 8},395 ${x + 17},407 L ${x + 17},426 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 7 */}
      <path d="M 650,390 L 650,353 L 790,353 L 790,390 Z" fill="#1C1C1A" fillOpacity="0.86" />
      {[667, 698, 730, 762].map((x) => (
        <path key={x} d={`M ${x},385 L ${x},368 Q ${x + 8},357 ${x + 16},368 L ${x + 16},385 Z`}
          fill="#2A2A28" fillOpacity="0.5" />
      ))}

      {/* Tier 8 — narrow */}
      <path d="M 659,353 L 659,320 L 781,320 L 781,353 Z" fill="#1C1C1A" fillOpacity="0.87" />

      {/* Finial shaft */}
      <path d="M 668,320 L 668,285 L 772,285 L 772,320 Z" fill="#1C1C1A" fillOpacity="0.88" />

      {/* Barrel vault / dome (kumbha) */}
      <path
        d="M 668,285 L 668,268 C 668,230 690,205 720,202 C 750,205 772,230 772,268 L 772,285 Z"
        fill="#1C1C1A"
        fillOpacity="0.88"
      />

      {/* Top finial (kalasha) */}
      <ellipse cx="720" cy="200" rx="12" ry="8" fill="#B8972A" fillOpacity="0.35" />
      <line x1="720" y1="192" x2="720" y2="175" stroke="#B8972A" strokeOpacity="0.3" strokeWidth="3" />
      <ellipse cx="720" cy="172" rx="7" ry="5" fill="#B8972A" fillOpacity="0.3" />

      {/* ── Tier separator lines (subtle gold) ── */}
      {[635, 578, 525, 476, 431, 390, 353, 320].map((y) => (
        <line
          key={y}
          x1="545" y1={y} x2="895" y2={y}
          stroke="#B8972A"
          strokeOpacity="0.07"
          strokeWidth="1"
        />
      ))}

      {/* Gold shimmer overlay on tower */}
      <path
        d={[
          'M 575,700 L 575,635 L 590,635 L 590,578 L 604,578 L 604,525',
          'L 617,525 L 617,476 L 629,476 L 629,431 L 640,431 L 640,390',
          'L 650,390 L 650,353 L 659,353 L 659,320 L 668,320 L 668,285',
          'C 668,230 690,205 720,202 C 750,205 772,230 772,285',
          'L 772,320 L 781,320 L 781,353 L 790,353 L 790,390',
          'L 800,390 L 800,431 L 811,431 L 811,476 L 823,476 L 823,525',
          'L 836,525 L 836,578 L 850,578 L 850,635 L 865,635 L 865,700 Z',
        ].join(' ')}
        fill="url(#tierGrad)"
      />
    </svg>
  )
}

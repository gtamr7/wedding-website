import type { JSX } from 'react'

// Tamil Dravidian gopuram — stepped tiered profile with proper architectural silhouette
export default function TempleSilhouette({ className }: { className?: string }) {

  // ── Stepped gopuram profile builder ─────────────────────────────────────────
  // A real gopuram narrows in discrete rectangular tiers, each slightly smaller than the last.
  // This builds the outline polygon for such a tower.
  function gopuramPoints(
    cx: number,
    baseY: number,
    tiers: { height: number; halfWidth: number }[],
  ): string {
    // Build left edge top→down, right edge bottom→top
    const left: [number, number][] = []
    const right: [number, number][] = []
    let y = baseY
    for (let i = tiers.length - 1; i >= 0; i--) {
      const { height, halfWidth } = tiers[i]
      left.unshift([cx - halfWidth, y])
      left.unshift([cx - halfWidth, y - height])
      right.push([cx + halfWidth, y])
      right.push([cx + halfWidth, y - height])
      y -= height
    }
    return [...left, ...right.reverse()].map(([x, yy]) => `${x},${yy}`).join(' ')
  }

  // ── Tier definitions ─────────────────────────────────────────────────────────
  // Main central gopuram — 9 tiers (tall, narrow at top)
  const mainTiers = [
    { height: 55, halfWidth: 118 }, // base plinth
    { height: 72, halfWidth: 108 }, // tier 1
    { height: 66, halfWidth:  96 }, // tier 2
    { height: 60, halfWidth:  84 }, // tier 3
    { height: 54, halfWidth:  72 }, // tier 4
    { height: 48, halfWidth:  60 }, // tier 5
    { height: 42, halfWidth:  48 }, // tier 6
    { height: 36, halfWidth:  36 }, // tier 7
    { height: 30, halfWidth:  26 }, // tier 8 — neck
    { height: 45, halfWidth:  18 }, // shikhara vault
  ]
  const MCX = 720
  const M_BASE_Y = 875
  const mainPts = gopuramPoints(MCX, M_BASE_Y, mainTiers)
  const M_TOP_Y = M_BASE_Y - mainTiers.reduce((s, t) => s + t.height, 0)

  // Flanking gopurams — 6 tiers, shorter
  const flankTiers = [
    { height: 38, halfWidth: 66 },
    { height: 48, halfWidth: 58 },
    { height: 42, halfWidth: 50 },
    { height: 36, halfWidth: 42 },
    { height: 30, halfWidth: 33 },
    { height: 24, halfWidth: 23 },
    { height: 28, halfWidth: 14 },
  ]
  const FL_CX = 400, FR_CX = 1040
  const F_BASE_Y = 875
  const flankLPts = gopuramPoints(FL_CX, F_BASE_Y, flankTiers)
  const flankRPts = gopuramPoints(FR_CX, F_BASE_Y, flankTiers)
  const F_TOP_Y = F_BASE_Y - flankTiers.reduce((s, t) => s + t.height, 0)

  // Background gopurams — 4 tiers, very distant
  const bgTiers = [
    { height: 28, halfWidth: 44 },
    { height: 36, halfWidth: 38 },
    { height: 30, halfWidth: 30 },
    { height: 24, halfWidth: 22 },
    { height: 20, halfWidth: 14 },
  ]
  const BL_CX = 190, BR_CX = 1250
  const B_BASE_Y = 875
  const bgLPts = gopuramPoints(BL_CX, B_BASE_Y, bgTiers)
  const bgRPts = gopuramPoints(BR_CX, B_BASE_Y, bgTiers)
  const B_TOP_Y = B_BASE_Y - bgTiers.reduce((s, t) => s + t.height, 0)

  // ── Tier groove lines (horizontal shadow lines between tiers) ────────────────
  function tierGrooves(
    cx: number, baseY: number,
    tiers: { height: number; halfWidth: number }[],
    color: string, opacity: number, strokeW: number
  ): JSX.Element[] {
    const lines: JSX.Element[] = []
    let y = baseY
    for (let i = tiers.length - 1; i >= 0; i--) {
      y -= tiers[i].height
      if (i > 0) {
        const hw = tiers[i].halfWidth
        // Shadow under the tier ledge
        lines.push(
          <line key={`g-${i}`} x1={cx - hw} y1={y} x2={cx + hw} y2={y}
            stroke={color} strokeWidth={strokeW} opacity={opacity} />
        )
        // Highlight just above (lit edge of ledge)
        lines.push(
          <line key={`gh-${i}`} x1={cx - hw - 1} y1={y + 2} x2={cx + hw + 1} y2={y + 2}
            stroke="#C4943A" strokeWidth={strokeW * 0.5} opacity={opacity * 0.35} />
        )
      }
    }
    return lines
  }

  // ── Fine horizontal stone-course lines within each tier ─────────────────────
  function stoneCourses(
    cx: number, baseY: number,
    tiers: { height: number; halfWidth: number }[],
    spacing: number, color: string, opacity: number
  ): JSX.Element[] {
    const lines: JSX.Element[] = []
    let y = baseY
    for (let i = tiers.length - 1; i >= 0; i--) {
      const { height, halfWidth } = tiers[i]
      const topY = y - height
      for (let ly = y - spacing; ly > topY; ly -= spacing) {
        lines.push(
          <line key={`sc-${i}-${ly}`} x1={cx - halfWidth + 1} y1={ly} x2={cx + halfWidth - 1} y2={ly}
            stroke={color} strokeWidth={0.5} opacity={opacity} />
        )
      }
      y = topY
    }
    return lines
  }

  // ── Stars ───────────────────────────────────────────────────────────────────
  const starSeeds = [
    [3,2],[11,6],[19,3],[28,8],[37,4],[46,11],[55,5],[63,9],[72,3],[81,7],[89,4],[97,10],
    [6,15],[14,19],[23,13],[32,17],[41,12],[50,16],[59,14],[68,18],[77,12],[86,16],[94,13],
    [2,24],[10,28],[18,22],[27,26],[36,20],[45,25],[54,21],[63,27],[71,23],[80,27],[88,21],[96,25],
    [7,33],[16,37],[24,31],[33,35],[42,29],[51,34],[60,30],[69,36],[78,32],[87,36],[95,30],
    [4,42],[13,46],[21,40],[30,44],[39,38],[48,43],[57,39],[66,45],[75,41],[84,45],[92,39],
    [9,51],[17,55],[26,49],[35,53],[44,47],[53,52],[62,48],[71,54],[80,50],[89,54],[97,48],
    [5,60],[14,64],[22,58],[31,62],[40,56],[49,61],[58,57],[67,63],[76,59],[85,63],[93,57],
  ]

  // ── Niche arches on main tower ──────────────────────────────────────────────
  function nicheArches(
    cx: number, baseY: number,
    tiers: { height: number; halfWidth: number }[],
  ): JSX.Element[] {
    const arches: JSX.Element[] = []
    let y = baseY
    for (let i = tiers.length - 1; i >= 1; i--) {
      const { height, halfWidth } = tiers[i]
      const tierTopY = y - height
      const midY = tierTopY + height * 0.52
      // How many niches fit? Roughly every 22px of width
      const count = Math.max(1, Math.floor((halfWidth * 1.5) / 22))
      const spacing = (halfWidth * 1.6) / count
      const startX = cx - halfWidth * 0.8 + spacing * 0.5
      const nh = Math.min(height * 0.6, 22)
      const nw = Math.min(spacing * 0.55, 10)
      for (let n = 0; n < count; n++) {
        const nx = startX + n * spacing
        arches.push(
          <path
            key={`arch-${i}-${n}`}
            d={`M ${nx - nw},${midY} L ${nx - nw},${midY - nh * 0.45} Q ${nx},${midY - nh} ${nx + nw},${midY - nh * 0.45} L ${nx + nw},${midY} Z`}
            fill="#120C04"
            fillOpacity="0.5"
          />
        )
      }
      y = tierTopY
    }
    return arches
  }

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Night sky */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#020108" />
          <stop offset="30%"  stopColor="#050210" />
          <stop offset="60%"  stopColor="#0A0612" />
          <stop offset="80%"  stopColor="#100808" />
          <stop offset="100%" stopColor="#160C04" />
        </linearGradient>

        {/* Warm lamp glow at horizon — oil lamps lining the temple walls */}
        <radialGradient id="horizonGlow" cx="50%" cy="100%" r="65%">
          <stop offset="0%"   stopColor="#C4721A" stopOpacity="0.38" />
          <stop offset="25%"  stopColor="#8A4A10" stopOpacity="0.22" />
          <stop offset="60%"  stopColor="#4A2808" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#200E04" stopOpacity="0" />
        </radialGradient>

        {/* Secondary warm bloom behind main tower */}
        <radialGradient id="towerGlow" cx="50%" cy="97%" r="30%">
          <stop offset="0%"   stopColor="#E8901A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#C4721A" stopOpacity="0" />
        </radialGradient>

        {/* Main tower — warm sandstone, top-lit */}
        <linearGradient id="stoneMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#9E7030" />
          <stop offset="20%"  stopColor="#8A5E24" />
          <stop offset="55%"  stopColor="#6A4418" />
          <stop offset="85%"  stopColor="#3E2810" />
          <stop offset="100%" stopColor="#1E1408" />
        </linearGradient>

        {/* Flanking towers — slightly cooler, in partial shadow */}
        <linearGradient id="stoneSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7A5828" />
          <stop offset="40%"  stopColor="#5A3E18" />
          <stop offset="100%" stopColor="#1A1008" />
        </linearGradient>

        {/* Background towers — most distant, near-silhouette */}
        <linearGradient id="stoneFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4A3820" />
          <stop offset="100%" stopColor="#120C06" />
        </linearGradient>

        {/* Compound wall */}
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3A2A12" />
          <stop offset="100%" stopColor="#160E06" />
        </linearGradient>

        {/* Ground platform */}
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#241808" />
          <stop offset="100%" stopColor="#0C0804" />
        </linearGradient>

        {/* Kalasha gold */}
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#E8C050" />
          <stop offset="100%" stopColor="#A07828" />
        </linearGradient>

        {/* Mist / ground haze */}
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2A1E0E" stopOpacity="0" />
          <stop offset="100%" stopColor="#1A1208" stopOpacity="0.75" />
        </linearGradient>

        {/* Moonlight — subtle cool tint at top of main tower */}
        <radialGradient id="moonlit" cx="50%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#C8D0E0" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#C8D0E0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Sky ── */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#sky)" />

      {/* ── Stars ── */}
      {starSeeds.map(([px, py], i) => {
        const x = (px / 100) * 1440
        const y = (py / 70) * 530
        const r = i % 7 === 0 ? 1.4 : i % 3 === 0 ? 1.0 : 0.65
        const op = 0.25 + (i % 5) * 0.13
        return <circle key={i} cx={x} cy={y} r={r} fill="#E0D4C0" fillOpacity={op} />
      })}

      {/* ── Horizon warm glow ── */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#horizonGlow)" />
      <rect x="0" y="0" width="1440" height="900" fill="url(#towerGlow)" />

      {/* ── Compound outer walls ── */}
      <rect x="0" y="820" width="1440" height="55" fill="url(#wall)" />
      {/* Battlements */}
      {Array.from({ length: 72 }, (_, i) => (
        <rect key={`bm-${i}`} x={i * 20} y="810" width="12" height="12" fill="url(#wall)" opacity="0.8" />
      ))}

      {/* ── Background towers (most distant, behind compound wall) ── */}
      <polygon points={bgLPts} fill="url(#stoneFar)" opacity="0.5" />
      {stoneCourses(BL_CX, B_BASE_Y, bgTiers, 8, '#080604', 0.5)}
      {tierGrooves(BL_CX, B_BASE_Y, bgTiers, '#060402', 0.7, 1.5)}

      <polygon points={bgRPts} fill="url(#stoneFar)" opacity="0.5" />
      {stoneCourses(BR_CX, B_BASE_Y, bgTiers, 8, '#080604', 0.5)}
      {tierGrooves(BR_CX, B_BASE_Y, bgTiers, '#060402', 0.7, 1.5)}

      {/* Bg kalasha */}
      {[BL_CX, BR_CX].map(cx => (
        <g key={cx}>
          <ellipse cx={cx} cy={B_TOP_Y - 8} rx={6} ry={5} fill="url(#gold)" opacity="0.4" />
          <ellipse cx={cx} cy={B_TOP_Y - 15} rx={4} ry={3.5} fill="url(#gold)" opacity="0.35" />
        </g>
      ))}

      {/* ── Flanking towers ── */}
      <polygon points={flankLPts} fill="url(#stoneSide)" />
      {stoneCourses(FL_CX, F_BASE_Y, flankTiers, 7, '#0A0806', 0.55)}
      {tierGrooves(FL_CX, F_BASE_Y, flankTiers, '#080604', 0.8, 2)}
      {nicheArches(FL_CX, F_BASE_Y, flankTiers)}

      <polygon points={flankRPts} fill="url(#stoneSide)" />
      {stoneCourses(FR_CX, F_BASE_Y, flankTiers, 7, '#0A0806', 0.55)}
      {tierGrooves(FR_CX, F_BASE_Y, flankTiers, '#080604', 0.8, 2)}
      {nicheArches(FR_CX, F_BASE_Y, flankTiers)}

      {/* Flanking kalasha */}
      {[FL_CX, FR_CX].map(cx => (
        <g key={cx}>
          <rect x={cx - 3} y={F_TOP_Y - 14} width={6} height={12} fill="url(#gold)" opacity="0.55" />
          <ellipse cx={cx} cy={F_TOP_Y - 20} rx={9} ry={7.5} fill="url(#gold)" opacity="0.6" />
          <rect x={cx - 2} y={F_TOP_Y - 30} width={4} height={10} fill="url(#gold)" opacity="0.5" />
          <ellipse cx={cx} cy={F_TOP_Y - 35} rx={6} ry={5} fill="url(#gold)" opacity="0.55" />
          <circle cx={cx} cy={F_TOP_Y - 42} r={3} fill="url(#gold)" opacity="0.5" />
        </g>
      ))}

      {/* ── Main central gopuram ── */}
      <polygon points={mainPts} fill="url(#stoneMain)" />

      {/* Moonlit highlight on upper portion */}
      <polygon points={mainPts} fill="url(#moonlit)" />

      {/* Stone courses (fine horizontal lines) */}
      {stoneCourses(MCX, M_BASE_Y, mainTiers, 6, '#0C0806', 0.6)}

      {/* Tier grooves — the defining feature: sharp horizontal ledges */}
      {tierGrooves(MCX, M_BASE_Y, mainTiers, '#080504', 0.9, 3)}

      {/* Niche deity arches */}
      {nicheArches(MCX, M_BASE_Y, mainTiers)}

      {/* Side-edge shadow — gives the tower dimensionality */}
      <polygon
        points={mainPts}
        fill="none"
        stroke="#060402"
        strokeWidth="3"
        opacity="0.5"
      />

      {/* ── Shikhara / Barrel vault at top ── */}
      {(() => {
        const topTier = mainTiers[mainTiers.length - 1]
        const vaultBase = M_TOP_Y + topTier.height
        const hw = topTier.halfWidth
        return (
          <path
            d={`M ${MCX - hw},${vaultBase} L ${MCX - hw},${vaultBase - 10} Q ${MCX},${vaultBase - 52} ${MCX + hw},${vaultBase - 10} L ${MCX + hw},${vaultBase} Z`}
            fill="url(#stoneMain)"
            opacity="0.9"
          />
        )
      })()}

      {/* ── Kalasha finials (main tower) ── */}
      {/* Neck 1 */}
      <rect x={MCX - 5} y={M_TOP_Y - 18} width={10} height={18} fill="url(#gold)" opacity="0.75" rx="1" />
      {/* Pot 1 */}
      <ellipse cx={MCX} cy={M_TOP_Y - 28} rx={16} ry={13} fill="url(#gold)" opacity="0.82" />
      {/* Neck 2 */}
      <rect x={MCX - 3.5} y={M_TOP_Y - 44} width={7} height={16} fill="url(#gold)" opacity="0.7" rx="1" />
      {/* Pot 2 */}
      <ellipse cx={MCX} cy={M_TOP_Y - 52} rx={11} ry={9} fill="url(#gold)" opacity="0.78" />
      {/* Neck 3 */}
      <rect x={MCX - 2.5} y={M_TOP_Y - 63} width={5} height={11} fill="url(#gold)" opacity="0.65" rx="1" />
      {/* Crown pot */}
      <ellipse cx={MCX} cy={M_TOP_Y - 70} rx={7} ry={6} fill="url(#gold)" opacity="0.72" />
      {/* Spire */}
      <line x1={MCX} y1={M_TOP_Y - 76} x2={MCX} y2={M_TOP_Y - 88} stroke="url(#gold)" strokeWidth="2.5" opacity="0.65" />
      <circle cx={MCX} cy={M_TOP_Y - 90} r={3.5} fill="url(#gold)" opacity="0.7" />
      {/* Kalasha glow */}
      <ellipse cx={MCX} cy={M_TOP_Y - 55} rx={24} ry={50} fill="#E8C050" fillOpacity="0.04" />

      {/* ── Oil lamp glow dots along wall top ── */}
      {Array.from({ length: 18 }, (_, i) => {
        const x = 120 + i * 68
        return (
          <g key={i}>
            <circle cx={x} cy={816} r={3} fill="#F0A030" fillOpacity="0.7" />
            <ellipse cx={x} cy={816} rx={10} ry={6} fill="#F0A030" fillOpacity="0.12" />
          </g>
        )
      })}

      {/* ── Ground mist / base haze ── */}
      <rect x="0" y="760" width="1440" height="140" fill="url(#mist)" />

      {/* ── Ground ── */}
      <rect x="0" y="870" width="1440" height="30" fill="url(#ground)" />
    </svg>
  )
}

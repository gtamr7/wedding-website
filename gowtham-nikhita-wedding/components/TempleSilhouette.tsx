import type { JSX } from 'react'

// Srirangam-style gopuram silhouette — atmospheric stone illustration
export default function TempleSilhouette({ className }: { className?: string }) {
  // Main central tower geometry
  const MCX = 720
  const M_BASE_Y = 880, M_TOP_Y = 95
  const M_BASE_HW = 120, M_TOP_HW = 34

  // Flanking towers (left/right)
  const FL_CX = 395, FR_CX = 1045
  const F_BASE_Y = 880, F_TOP_Y = 430
  const F_BASE_HW = 68, F_TOP_HW = 22

  // Distant background towers for depth
  const BL_CX = 200, BR_CX = 1240
  const B_BASE_Y = 880, B_TOP_Y = 600
  const B_BASE_HW = 45, B_TOP_HW = 16

  function lerpHW(baseY: number, topY: number, baseHW: number, topHW: number, y: number) {
    const t = (y - baseY) / (topY - baseY)
    return baseHW + t * (topHW - baseHW)
  }

  // Dense horizontal stripe lines across a tapered tower
  function towerStripes(
    cx: number, baseY: number, topY: number,
    baseHW: number, topHW: number,
    spacing: number, color: string, opacity: number, strokeW: number
  ) {
    const lines: JSX.Element[] = []
    for (let y = topY + spacing; y < baseY; y += spacing) {
      const hw = lerpHW(baseY, topY, baseHW, topHW, y)
      lines.push(
        <line
          key={y}
          x1={cx - hw} y1={y}
          x2={cx + hw} y2={y}
          stroke={color}
          strokeWidth={strokeW}
          opacity={opacity}
        />
      )
    }
    return lines
  }

  // Tower polygon points string
  function towerPoly(cx: number, baseY: number, topY: number, baseHW: number, topHW: number) {
    return `${cx - baseHW},${baseY} ${cx - topHW},${topY} ${cx + topHW},${topY} ${cx + baseHW},${baseY}`
  }

  // Star positions (pre-computed)
  const stars = [
    [8,4],[18,9],[33,5],[47,14],[61,7],[74,3],[88,11],[95,18],
    [5,22],[22,18],[38,25],[52,11],[67,20],[81,8],[92,26],
    [12,32],[28,38],[44,30],[59,35],[75,28],[89,40],
    [15,48],[35,42],[50,52],[65,44],[82,50],
    [3,58],[25,55],[45,60],[62,57],[78,62],[96,54],
    [10,68],[30,65],[55,70],[72,67],[91,72],
    // Extra fine stars
    [42,8],[56,3],[70,15],[84,4],[100,10],
    [20,28],[36,15],[58,24],[76,14],[94,22],
  ]

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Night sky - very dark blue-black */}
        <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#04020A" />
          <stop offset="45%" stopColor="#07040D" />
          <stop offset="75%" stopColor="#0E0808" />
          <stop offset="100%" stopColor="#130C05" />
        </linearGradient>

        {/* Horizon glow — warm lamp light from the temple complex */}
        <radialGradient id="tHorizon" cx="50%" cy="100%" r="55%" fx="50%" fy="100%">
          <stop offset="0%"   stopColor="#7A4E18" stopOpacity="0.45" />
          <stop offset="45%"  stopColor="#4A2E0A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4A2E0A" stopOpacity="0" />
        </radialGradient>

        {/* Main tower stone — warm sandstone, lit from above */}
        <linearGradient id="tStoneMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8B6838" />
          <stop offset="30%"  stopColor="#7A5A2E" />
          <stop offset="65%"  stopColor="#5C4220" />
          <stop offset="100%" stopColor="#281808" />
        </linearGradient>

        {/* Flanking tower stone — slightly cooler/more in shadow */}
        <linearGradient id="tStoneSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6B5028" />
          <stop offset="60%"  stopColor="#4A3418" />
          <stop offset="100%" stopColor="#1E1206" />
        </linearGradient>

        {/* Background tower stone — furthest, darkest */}
        <linearGradient id="tStoneFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4A3820" />
          <stop offset="100%" stopColor="#16100A" />
        </linearGradient>

        {/* Vault highlight — slightly warm edge light */}
        <linearGradient id="tVaultEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#9E7A40" />
          <stop offset="100%" stopColor="#7A5A2E" />
        </linearGradient>

        {/* Wing wall */}
        <linearGradient id="tWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3A2A12" />
          <stop offset="100%" stopColor="#18100A" />
        </linearGradient>

        {/* Ground / base platform */}
        <linearGradient id="tGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1E1408" />
          <stop offset="100%" stopColor="#0C0806" />
        </linearGradient>

        {/* Mist at base of towers */}
        <linearGradient id="tMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2A1E0E" stopOpacity="0" />
          <stop offset="100%" stopColor="#2A1E0E" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* ─── Sky ─── */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#tSky)" />

      {/* ─── Horizon warm glow ─── */}
      <ellipse cx="720" cy="900" rx="720" ry="280" fill="url(#tHorizon)" />

      {/* ─── Stars ─── */}
      {stars.map(([px, py], i) => {
        const x = px * 14.4
        const y = py * 7.2
        const r = i % 5 === 0 ? 1.2 : i % 3 === 0 ? 0.9 : 0.6
        const op = 0.3 + (i % 4) * 0.15
        return <circle key={i} cx={x} cy={y} r={r} fill="#E8D8C0" fillOpacity={op} />
      })}

      {/* ─── Distant background towers ─── */}
      <polygon
        points={towerPoly(BL_CX, B_BASE_Y, B_TOP_Y, B_BASE_HW, B_TOP_HW)}
        fill="url(#tStoneFar)"
        opacity="0.55"
      />
      {towerStripes(BL_CX, B_BASE_Y, B_TOP_Y, B_BASE_HW, B_TOP_HW, 9, '#0C0806', 0.6, 0.6)}

      <polygon
        points={towerPoly(BR_CX, B_BASE_Y, B_TOP_Y, B_BASE_HW, B_TOP_HW)}
        fill="url(#tStoneFar)"
        opacity="0.55"
      />
      {towerStripes(BR_CX, B_BASE_Y, B_TOP_Y, B_BASE_HW, B_TOP_HW, 9, '#0C0806', 0.6, 0.6)}

      {/* ─── Flanking towers (mid-ground) ─── */}
      <polygon
        points={towerPoly(FL_CX, F_BASE_Y, F_TOP_Y, F_BASE_HW, F_TOP_HW)}
        fill="url(#tStoneSide)"
      />
      {towerStripes(FL_CX, F_BASE_Y, F_TOP_Y, F_BASE_HW, F_TOP_HW, 7, '#150E06', 0.75, 0.7)}
      {/* Flanking vault */}
      <path
        d={`M ${FL_CX - F_TOP_HW},${F_TOP_Y} L ${FL_CX - F_TOP_HW},${F_TOP_Y - 14} Q ${FL_CX},${F_TOP_Y - 42} ${FL_CX + F_TOP_HW},${F_TOP_Y - 14} L ${FL_CX + F_TOP_HW},${F_TOP_Y} Z`}
        fill="url(#tStoneSide)"
      />
      <ellipse cx={FL_CX} cy={F_TOP_Y - 50} rx={5} ry={7} fill="#B8972A" fillOpacity="0.5" />

      <polygon
        points={towerPoly(FR_CX, F_BASE_Y, F_TOP_Y, F_BASE_HW, F_TOP_HW)}
        fill="url(#tStoneSide)"
      />
      {towerStripes(FR_CX, F_BASE_Y, F_TOP_Y, F_BASE_HW, F_TOP_HW, 7, '#150E06', 0.75, 0.7)}
      <path
        d={`M ${FR_CX - F_TOP_HW},${F_TOP_Y} L ${FR_CX - F_TOP_HW},${F_TOP_Y - 14} Q ${FR_CX},${F_TOP_Y - 42} ${FR_CX + F_TOP_HW},${F_TOP_Y - 14} L ${FR_CX + F_TOP_HW},${F_TOP_Y} Z`}
        fill="url(#tStoneSide)"
      />
      <ellipse cx={FR_CX} cy={F_TOP_Y - 50} rx={5} ry={7} fill="#B8972A" fillOpacity="0.5" />

      {/* ─── Wing connecting walls ─── */}
      <path
        d={`M 0,860 L 0,800 L ${FL_CX - F_BASE_HW - 10},800 L ${FL_CX - F_BASE_HW - 10},820 L ${MCX - M_BASE_HW - 20},820 L ${MCX - M_BASE_HW - 20},860 Z`}
        fill="url(#tWall)"
        opacity="0.85"
      />
      <path
        d={`M 1440,860 L 1440,800 L ${FR_CX + F_BASE_HW + 10},800 L ${FR_CX + F_BASE_HW + 10},820 L ${MCX + M_BASE_HW + 20},820 L ${MCX + M_BASE_HW + 20},860 Z`}
        fill="url(#tWall)"
        opacity="0.85"
      />

      {/* ─── Main central tower platform / plinth ─── */}
      <path
        d={`M ${MCX - M_BASE_HW - 30},860 L ${MCX - M_BASE_HW - 30},840 L ${MCX - M_BASE_HW - 10},840 L ${MCX - M_BASE_HW - 10},820 L ${MCX + M_BASE_HW + 10},820 L ${MCX + M_BASE_HW + 10},840 L ${MCX + M_BASE_HW + 30},840 L ${MCX + M_BASE_HW + 30},860 Z`}
        fill="url(#tGround)"
      />

      {/* ─── MAIN GOPURAM TOWER ─── */}
      <polygon
        points={towerPoly(MCX, M_BASE_Y, M_TOP_Y, M_BASE_HW, M_TOP_HW)}
        fill="url(#tStoneMain)"
      />

      {/* Dense horizontal banding — the signature of Dravidian temple architecture */}
      {towerStripes(MCX, M_BASE_Y, M_TOP_Y, M_BASE_HW, M_TOP_HW, 6, '#1A1006', 0.85, 0.9)}

      {/* Heavier accent lines every ~36px to define major tier breaks */}
      {Array.from({ length: 22 }, (_, i) => {
        const y = M_TOP_Y + 36 + i * 36
        if (y >= M_BASE_Y) return null
        const hw = lerpHW(M_BASE_Y, M_TOP_Y, M_BASE_HW, M_TOP_HW, y)
        return (
          <line
            key={`tier-${i}`}
            x1={MCX - hw} y1={y}
            x2={MCX + hw} y2={y}
            stroke="#0D0805"
            strokeWidth="2.2"
            opacity="0.7"
          />
        )
      })}

      {/* Niche row silhouettes — dark arches suggesting deity alcoves */}
      {[240, 276, 312, 348, 384, 420, 456, 492, 528, 564, 600, 636, 672, 708, 744, 780, 816].map((y) => {
        const hw = lerpHW(M_BASE_Y, M_TOP_Y, M_BASE_HW, M_TOP_HW, y)
        const nicheCount = Math.max(2, Math.floor(hw / 22))
        const nicheW = (hw * 1.6) / nicheCount
        return Array.from({ length: nicheCount }, (_, n) => {
          const nx = MCX - hw * 0.8 + n * nicheW + nicheW * 0.5
          const nh = 18
          return (
            <path
              key={`n-${y}-${n}`}
              d={`M ${nx - 6},${y} L ${nx - 6},${y - nh * 0.55} Q ${nx},${y - nh} ${nx + 6},${y - nh * 0.55} L ${nx + 6},${y} Z`}
              fill="#120C06"
              fillOpacity="0.55"
            />
          )
        })
      })}

      {/* ─── Barrel vault / Shikhara (top of tower) ─── */}
      <path
        d={`M ${MCX - M_TOP_HW},${M_TOP_Y} L ${MCX - M_TOP_HW},${M_TOP_Y - 16} Q ${MCX},${M_TOP_Y - 58} ${MCX + M_TOP_HW},${M_TOP_Y - 16} L ${MCX + M_TOP_HW},${M_TOP_Y} Z`}
        fill="url(#tVaultEdge)"
      />
      {/* Vault banding */}
      {[8, 16, 24, 32, 40].map((dy) => {
        const y2 = M_TOP_Y - dy
        const hw = M_TOP_HW * Math.cos((dy / 58) * (Math.PI / 2)) * 0.95
        return (
          <line key={dy} x1={MCX - hw} y1={y2} x2={MCX + hw} y2={y2}
            stroke="#1A1006" strokeWidth="0.8" opacity="0.7" />
        )
      })}

      {/* ─── Kalasha (pot-shaped finials) — sacred gold vessels ─── */}
      {/* Neck */}
      <rect x={MCX - 4} y={M_TOP_Y - 74} width={8} height={16} fill="#A07828" fillOpacity="0.7" />
      {/* Lower pot */}
      <ellipse cx={MCX} cy={M_TOP_Y - 82} rx={12} ry={10} fill="#B8972A" fillOpacity="0.75" />
      {/* Upper neck */}
      <rect x={MCX - 2.5} y={M_TOP_Y - 94} width={5} height={12} fill="#9E7A20" fillOpacity="0.65" />
      {/* Upper pot */}
      <ellipse cx={MCX} cy={M_TOP_Y - 100} rx={8} ry={6.5} fill="#B8972A" fillOpacity="0.7" />
      {/* Tip */}
      <ellipse cx={MCX} cy={M_TOP_Y - 110} rx={4} ry={5.5} fill="#C4A030" fillOpacity="0.65" />
      {/* Crown point */}
      <line x1={MCX} y1={M_TOP_Y - 115} x2={MCX} y2={M_TOP_Y - 122} stroke="#C4A030" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx={MCX} cy={M_TOP_Y - 124} r={2.5} fill="#D4B040" fillOpacity="0.6" />

      {/* ─── Atmospheric mist at base — warm lamp glow ─── */}
      <rect x="0" y="780" width="1440" height="120" fill="url(#tMist)" />

      {/* Ground */}
      <rect x="0" y="860" width="1440" height="40" fill="url(#tGround)" />
    </svg>
  )
}

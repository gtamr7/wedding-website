// Three-layer parallax scene: Arashiyama garden meets Sarasota waterfront
// Sky → Mid (bamboo grove + hills) → Fore (water + close bamboo + branches)
// Hero.tsx drives each layer at a different scroll speed for real depth.

// ── Layer 1: Sky ─────────────────────────────────────────────────────────────
export function SceneSky({ className }: { className?: string }) {
  const stars = [
    [4,3],[12,7],[21,2],[31,9],[40,4],[51,8],[62,3],[72,11],[83,5],[93,9],
    [7,16],[17,12],[26,18],[36,14],[47,19],[58,13],[68,17],[79,11],[89,15],[98,18],
    [3,24],[14,28],[24,22],[34,27],[44,21],[55,26],[65,23],[76,29],[86,24],[96,27],
    [9,34],[19,38],[29,32],[39,37],[49,31],[60,36],[70,33],[81,39],[91,34],
    [6,44],[16,48],[27,42],[37,47],[47,41],[57,46],[68,43],[78,49],[88,44],[97,48],
    [11,55],[22,51],[32,57],[42,53],[52,58],[63,52],[73,56],[84,50],[94,54],
  ]

  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#020510" />
          <stop offset="25%"  stopColor="#04091A" />
          <stop offset="55%"  stopColor="#060C14" />
          <stop offset="80%"  stopColor="#080A0C" />
          <stop offset="100%" stopColor="#0A0C0A" />
        </linearGradient>
        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="72%" cy="18%" r="18%">
          <stop offset="0%"   stopColor="#F0E8D0" stopOpacity="0.18" />
          <stop offset="40%"  stopColor="#D4C8A0" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#C0B080" stopOpacity="0" />
        </radialGradient>
        {/* Moon itself */}
        <radialGradient id="moon" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#F8F0E0" />
          <stop offset="60%"  stopColor="#EDE0C4" />
          <stop offset="100%" stopColor="#D8C8A0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#sky)" />

      {/* Stars */}
      {stars.map(([px, py], i) => {
        const x = (px / 100) * 1440
        const y = (py / 65) * 520
        const r = i % 8 === 0 ? 1.5 : i % 4 === 0 ? 1.0 : 0.6
        const op = 0.2 + (i % 5) * 0.14
        return <circle key={i} cx={x} cy={y} r={r} fill="#E8E0D0" fillOpacity={op} />
      })}

      {/* Moon glow bloom */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#moonGlow)" />

      {/* Moon */}
      <circle cx={1036} cy={162} r={52} fill="url(#moon)" opacity="0.92" />
      {/* Subtle craters */}
      <circle cx={1018} cy={148} r={8}  fill="#D4C498" fillOpacity="0.3" />
      <circle cx={1048} cy={175} r={5}  fill="#D4C498" fillOpacity="0.25" />
      <circle cx={1030} cy={168} r={3}  fill="#D4C498" fillOpacity="0.2" />
    </svg>
  )
}

// ── Layer 2: Mid — bamboo grove + rolling hills ───────────────────────────────
export function SceneMid({ className }: { className?: string }) {
  // Bamboo stalk data: [x, height, width, opacity]
  const stalks: [number, number, number, number][] = []
  const rng = (seed: number) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x) }
  for (let i = 0; i < 120; i++) {
    const x = rng(i * 3.1) * 1440
    const h = 280 + rng(i * 7.3) * 320
    const w = 5 + rng(i * 2.7) * 9
    const op = 0.55 + rng(i * 5.1) * 0.45
    stalks.push([x, h, w, op])
  }
  stalks.sort((a, b) => a[3] - b[3]) // paint darker (taller) last

  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0C1A0C" />
          <stop offset="100%" stopColor="#060C06" />
        </linearGradient>
        <linearGradient id="stalkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1A2E14" />
          <stop offset="50%"  stopColor="#0E1E0A" />
          <stop offset="100%" stopColor="#060C06" />
        </linearGradient>
        <linearGradient id="horizonFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0A1A0A" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A1A0A" stopOpacity="1" />
        </linearGradient>
        {/* Warm ambient light from waterfront */}
        <radialGradient id="waterAmbient" cx="50%" cy="100%" r="70%">
          <stop offset="0%"   stopColor="#4A7A6A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2A4A3A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rolling hill silhouette */}
      <path
        d="M0,720 C180,680 340,700 520,680 C650,665 720,660 800,655 C900,650 1000,665 1100,670 C1220,678 1340,690 1440,685 L1440,900 L0,900 Z"
        fill="url(#hillGrad)"
      />
      {/* Second hill layer for depth */}
      <path
        d="M0,760 C200,730 380,750 560,735 C700,722 800,718 900,720 C1040,724 1180,738 1440,730 L1440,900 L0,900 Z"
        fill="#060C06"
        opacity="0.8"
      />

      {/* Bamboo stalks */}
      {stalks.map(([x, h, w, op], i) => {
        const baseY = 720 + rng(i * 4.2) * 60
        const topY = baseY - h
        const nodeCount = Math.floor(h / 38)
        const color = op > 0.8 ? '#1A2E14' : op > 0.65 ? '#142410' : '#0C1A0C'
        return (
          <g key={i} opacity={op}>
            {/* Stalk */}
            <rect x={x - w / 2} y={topY} width={w} height={h} fill={color} rx={w * 0.3} />
            {/* Nodes (bamboo joints) */}
            {Array.from({ length: nodeCount }, (_, n) => {
              const ny = baseY - (n + 1) * (h / (nodeCount + 1))
              return (
                <rect
                  key={n}
                  x={x - w / 2 - 1.5}
                  y={ny - 2}
                  width={w + 3}
                  height={4}
                  fill={color}
                  rx={1}
                  opacity="0.9"
                />
              )
            })}
            {/* Leaf clusters at top */}
            {[[-18, -8], [14, -14], [-8, -22], [20, -4], [-22, -18]].map(([lx, ly], li) => (
              <ellipse
                key={li}
                cx={x + lx * (w / 10)}
                cy={topY + ly * (w / 10) - 5}
                rx={w * 1.4}
                ry={w * 0.6}
                fill={color}
                opacity="0.7"
                transform={`rotate(${lx * 3},${x + lx * (w / 10)},${topY + ly * (w / 10) - 5})`}
              />
            ))}
          </g>
        )
      })}

      {/* Ambient glow from water below */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#waterAmbient)" />

      {/* Fade bottom so mid layer blends into foreground */}
      <rect x="0" y="640" width="1440" height="260" fill="url(#horizonFade)" />
    </svg>
  )
}

// ── Layer 3: Foreground — water, moon reflection, close bamboo, branches ──────
export function SceneFore({ className }: { className?: string }) {
  const rng = (seed: number) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x) }

  // Close foreground bamboo — very dark, partially off-frame left and right
  const closeStalks: [number, number, number][] = []
  for (let i = 0; i < 28; i++) {
    const side = i < 14 ? rng(i * 2.1) * 260 : 1180 + rng(i * 3.3) * 260
    const h = 500 + rng(i * 5.7) * 300
    const w = 12 + rng(i * 1.9) * 18
    closeStalks.push([side, h, w])
  }

  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060E18" />
          <stop offset="30%"  stopColor="#040C14" />
          <stop offset="100%" stopColor="#020810" />
        </linearGradient>
        {/* Moon reflection column on water */}
        <radialGradient id="moonReflect" cx="50%" cy="15%" r="55%">
          <stop offset="0%"   stopColor="#D4C890" stopOpacity="0.35" />
          <stop offset="40%"  stopColor="#A09060" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#806840" stopOpacity="0" />
        </radialGradient>
        {/* Water shimmer lines clip */}
        <linearGradient id="rippleFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="20%"  stopColor="white" stopOpacity="1" />
          <stop offset="80%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="branchLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#0A160A" />
          <stop offset="100%" stopColor="#06100A" />
        </linearGradient>
        <linearGradient id="waterFadeTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060E18" stopOpacity="0" />
          <stop offset="100%" stopColor="#060E18" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Water surface */}
      <rect x="0" y="600" width="1440" height="300" fill="url(#water)" />
      {/* Fade in from above */}
      <rect x="0" y="560" width="1440" height="80" fill="url(#waterFadeTop)" />

      {/* Moon reflection on water */}
      <rect x="0" y="600" width="1440" height="300" fill="url(#moonReflect)" />

      {/* Water shimmer / ripple lines */}
      {Array.from({ length: 28 }, (_, i) => {
        const y = 630 + i * 10 + rng(i * 3.7) * 6
        const len = 60 + rng(i * 2.3) * 180
        const cx = 680 + (rng(i * 4.1) - 0.5) * 200
        const op = 0.04 + rng(i * 1.7) * 0.1
        return (
          <line key={i}
            x1={cx - len / 2} y1={y}
            x2={cx + len / 2} y2={y}
            stroke="#C8B880" strokeWidth={0.8 + rng(i) * 1.2} opacity={op}
          />
        )
      })}

      {/* Stronger shimmer at reflection center */}
      {Array.from({ length: 14 }, (_, i) => {
        const y = 615 + i * 18
        const len = 30 + i * 8
        return (
          <line key={`s${i}`}
            x1={720 - len / 2} y1={y}
            x2={720 + len / 2} y2={y}
            stroke="#E0D090" strokeWidth={1} opacity={0.12 - i * 0.006}
          />
        )
      })}

      {/* Close foreground bamboo (dark, framing the scene) */}
      {closeStalks.map(([x, h, w], i) => {
        const baseY = 900
        const topY = baseY - h
        const nodeCount = Math.floor(h / 45)
        return (
          <g key={i} opacity={0.85 + rng(i) * 0.15}>
            <rect x={x - w / 2} y={topY} width={w} height={h} fill="#060E06" rx={w * 0.25} />
            {Array.from({ length: nodeCount }, (_, n) => {
              const ny = baseY - (n + 1) * (h / (nodeCount + 1))
              return (
                <rect key={n}
                  x={x - w / 2 - 2} y={ny - 2.5}
                  width={w + 4} height={5}
                  fill="#040C04" rx={1.5}
                />
              )
            })}
          </g>
        )
      })}

      {/* Cherry blossom / wisteria branches drooping from top-left */}
      <g opacity="0.9">
        <path d="M0,0 Q120,80 200,160 Q260,220 240,310 Q220,360 180,400" fill="none" stroke="#0A1A0A" strokeWidth="8" strokeLinecap="round" />
        <path d="M0,0 Q80,60 140,130 Q190,190 160,270" fill="none" stroke="#0A1A0A" strokeWidth="5" strokeLinecap="round" />
        <path d="M200,160 Q280,200 320,260 Q340,300 300,340" fill="none" stroke="#0A1A0A" strokeWidth="4" strokeLinecap="round" />
        <path d="M140,130 Q200,150 240,200 Q260,240 230,280" fill="none" stroke="#0A1A0A" strokeWidth="3" strokeLinecap="round" />
        {/* Blossom clusters */}
        {[
          [200,160],[240,310],[160,270],[300,340],[230,280],
          [170,200],[260,240],[140,310],[280,180],[190,350],
          [220,260],[150,240],[310,300],[250,380],[170,320],
        ].map(([bx, by], i) => (
          <g key={i}>
            <circle cx={bx} cy={by} r={4 + rng(i * 2.3) * 5} fill="#E8C0C8" fillOpacity={0.55 + rng(i) * 0.3} />
            <circle cx={bx + 6} cy={by - 4} r={3 + rng(i * 1.7) * 3} fill="#F0D0D8" fillOpacity={0.4 + rng(i * 3) * 0.3} />
            <circle cx={bx - 5} cy={by + 5} r={2 + rng(i * 4.1) * 4} fill="#E0B0C0" fillOpacity={0.35 + rng(i * 2) * 0.3} />
          </g>
        ))}
      </g>

      {/* Mirror branch top-right */}
      <g opacity="0.85" transform="scale(-1,1) translate(-1440,0)">
        <path d="M0,0 Q100,70 180,150 Q240,210 220,300 Q200,350 160,390" fill="none" stroke="#0A1A0A" strokeWidth="7" strokeLinecap="round" />
        <path d="M0,0 Q70,55 130,120 Q180,180 150,260" fill="none" stroke="#0A1A0A" strokeWidth="4" strokeLinecap="round" />
        <path d="M180,150 Q260,190 300,250 Q320,290 280,330" fill="none" stroke="#0A1A0A" strokeWidth="3.5" strokeLinecap="round" />
        {[
          [180,150],[220,300],[150,260],[280,330],[200,250],
          [160,190],[250,230],[130,300],[270,170],[185,340],
        ].map(([bx, by], i) => (
          <g key={i}>
            <circle cx={bx} cy={by} r={4 + rng(i * 3.1) * 5} fill="#E8C0C8" fillOpacity={0.5 + rng(i * 1.3) * 0.3} />
            <circle cx={bx + 6} cy={by - 4} r={3 + rng(i * 2.1) * 3} fill="#F0D0D8" fillOpacity={0.35 + rng(i * 2.7) * 0.3} />
          </g>
        ))}
      </g>
    </svg>
  )
}

// Default export for any legacy imports
export default SceneSky

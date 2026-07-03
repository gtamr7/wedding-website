// Parallax scene: moonlit Japanese garden meets Florida waterfront
// Three layers — sky, treeline, water+branches — move at different scroll speeds in Hero.tsx

// ── Layer 1: Sky + Moon ───────────────────────────────────────────────────────
export function SceneSky({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#01030E" />
          <stop offset="35%"  stopColor="#020614" />
          <stop offset="70%"  stopColor="#040A18" />
          <stop offset="100%" stopColor="#060C14" />
        </linearGradient>
        <radialGradient id="moonHalo" cx="68%" cy="22%" r="22%">
          <stop offset="0%"   stopColor="#C8D8F0" stopOpacity="0.22" />
          <stop offset="50%"  stopColor="#A0B8D8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#8090B0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonFace" cx="38%" cy="32%" r="58%">
          <stop offset="0%"   stopColor="#F4EEE0" />
          <stop offset="55%"  stopColor="#EAE0C8" />
          <stop offset="100%" stopColor="#D8CEB0" />
        </radialGradient>
        <radialGradient id="horizonWarm" cx="50%" cy="100%" r="60%">
          <stop offset="0%"   stopColor="#3A6878" stopOpacity="0.2" />
          <stop offset="55%"  stopColor="#1E3A48" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0A1820" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#sky)" />

      {/* Stars — hand-placed for natural feel */}
      {[
        [72,28,1.2,0.9],[168,55,0.7,0.6],[285,18,1.0,0.8],[412,42,0.8,0.7],[530,11,1.3,0.9],
        [647,38,0.6,0.5],[753,24,1.1,0.8],[831,61,0.7,0.6],[944,15,0.9,0.8],[1066,47,1.0,0.7],
        [1181,29,0.6,0.5],[1298,51,1.2,0.9],[1378,19,0.8,0.7],[38,88,0.7,0.5],
        [143,104,1.0,0.7],[259,79,0.6,0.5],[374,118,0.8,0.6],[488,92,1.1,0.8],
        [603,108,0.7,0.5],[718,85,0.9,0.7],[837,113,1.0,0.8],[952,97,0.6,0.5],
        [1067,120,0.8,0.6],[1184,89,1.1,0.8],[1312,107,0.7,0.5],[1406,94,0.9,0.7],
        [55,148,0.8,0.6],[196,162,1.0,0.7],[327,139,0.6,0.5],[461,155,0.9,0.7],
        [592,142,0.7,0.5],[724,168,1.1,0.8],[858,151,0.8,0.6],[989,164,0.6,0.5],
        [1123,146,1.0,0.7],[1256,159,0.7,0.5],[1389,143,0.9,0.7],
      ].map(([x, y, r, op], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#E8E4D8" fillOpacity={op} />
      ))}

      {/* Moon halo */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#moonHalo)" />

      {/* Moon */}
      <circle cx={979} cy={198} r={58} fill="url(#moonFace)" />
      {/* Subtle surface detail */}
      <circle cx={962} cy={183} r={10} fill="#DDD4B8" fillOpacity="0.25" />
      <circle cx={994} cy={208} r={6}  fill="#DDD4B8" fillOpacity="0.2" />
      <circle cx={975} cy={221} r={4}  fill="#DDD4B8" fillOpacity="0.18" />

      {/* Warm horizon ambient from water */}
      <rect x="0" y="0" width="1440" height="900" fill="url(#horizonWarm)" />
    </svg>
  )
}

// ── Layer 2: Treeline — silhouette hills + bamboo/willow shapes ───────────────
export function SceneMid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0C1E10" />
          <stop offset="100%" stopColor="#04080A" />
        </linearGradient>
        <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#081408" />
          <stop offset="100%" stopColor="#030608" />
        </linearGradient>
        <linearGradient id="midFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060C0E" stopOpacity="0" />
          <stop offset="100%" stopColor="#040810" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Far background hill */}
      <path
        d="M0,780 C200,740 380,755 560,738 C720,722 840,718 960,722 C1100,728 1260,742 1440,735 L1440,900 L0,900 Z"
        fill="#060E0A"
        opacity="0.6"
      />

      {/* Main treeline hill */}
      <path
        d="M0,810 C160,768 300,782 480,765 C620,751 730,745 840,748 C980,753 1120,768 1280,762 C1360,759 1400,764 1440,760 L1440,900 L0,900 Z"
        fill="url(#hill1)"
      />

      {/* Tree canopy bumps along the hill — organic rounded silhouettes */}
      <path
        d="M0,810 C40,795 60,780 80,785 C100,790 110,775 130,768 C155,760 170,750 195,745
           C220,740 240,730 265,728 C290,726 310,718 335,715
           C365,712 385,705 410,708 C430,712 445,700 468,698
           C492,696 512,688 538,690 C558,692 574,682 598,680
           C622,678 644,670 668,672 C688,674 704,664 726,662
           C752,660 774,652 798,655 C818,658 836,648 858,650
           C880,652 900,644 924,648 C944,652 962,642 984,645
           C1008,648 1028,640 1052,644 C1072,648 1090,638 1112,641
           C1138,645 1158,638 1182,642 C1202,646 1220,636 1242,640
           C1268,645 1290,638 1314,642 C1334,646 1358,638 1380,642 C1400,646 1420,640 1440,638
           L1440,900 L0,900 Z"
        fill="url(#hill1)"
      />

      {/* Bamboo-like vertical elements — simple and stylized */}
      {[
        // [cx, height, width] — placed in clusters
        // Left cluster
        [85,310,6],[92,275,5],[78,290,5],[100,255,4],[70,240,4],
        [110,295,6],[120,260,5],[128,280,5],[65,268,4],
        // Left-center cluster
        [280,340,7],[290,300,6],[270,315,6],[302,280,5],[260,295,5],
        [312,320,6],[325,285,5],[338,305,6],[255,278,4],
        // Center-left
        [490,360,8],[502,320,7],[478,335,6],[514,295,5],[468,308,5],
        [526,345,7],[540,308,6],[554,328,6],[462,292,4],
        // Center
        [680,380,8],[692,338,7],[668,352,7],[706,312,6],[656,325,5],
        [718,362,7],[732,325,6],[748,348,7],[644,308,4],
        // Center-right
        [870,355,7],[882,315,6],[858,330,6],[896,290,5],[846,303,5],
        [908,340,7],[922,302,6],[936,322,6],[840,286,4],
        // Right-center
        [1060,340,7],[1072,300,6],[1048,315,6],[1086,278,5],[1036,290,5],
        [1098,325,6],[1112,288,5],[1126,308,6],[1028,274,4],
        // Right cluster
        [1250,320,6],[1262,282,5],[1238,296,5],[1276,260,4],[1226,272,4],
        [1288,305,6],[1302,268,5],[1316,288,5],[1220,255,4],
        // Far right
        [1390,285,5],[1402,250,4],[1376,262,4],[1414,232,4],[1368,245,4],
      ].map(([cx, h, w], i) => {
        const baseY = 760
        const topY = baseY - h
        const nodeSpacing = 42
        const nodeCount = Math.floor(h / nodeSpacing)
        const shade = i % 3 === 0 ? '#0E1E0E' : i % 3 === 1 ? '#0A1A0A' : '#081408'
        return (
          <g key={i} opacity={0.7 + (i % 5) * 0.06}>
            {/* Stalk */}
            <rect x={cx - w/2} y={topY} width={w} height={h} fill={shade} rx={w * 0.3} />
            {/* Nodes */}
            {Array.from({ length: nodeCount }, (_, n) => (
              <rect key={n}
                x={cx - w/2 - 1.5} y={baseY - (n+1)*nodeSpacing - 2}
                width={w+3} height={3.5}
                fill={shade} rx={1} opacity="0.85"
              />
            ))}
            {/* Simple leaf spray at top — 3 diagonal ellipses */}
            <ellipse cx={cx - w*1.8} cy={topY + 8}  rx={w*2.2} ry={w*0.7} fill={shade} opacity="0.8"
              transform={`rotate(-30,${cx - w*1.8},${topY + 8})`} />
            <ellipse cx={cx + w*1.6} cy={topY + 4}  rx={w*2.0} ry={w*0.65} fill={shade} opacity="0.75"
              transform={`rotate(28,${cx + w*1.6},${topY + 4})`} />
            <ellipse cx={cx}         cy={topY - 6}   rx={w*1.8} ry={w*0.6} fill={shade} opacity="0.7"
              transform={`rotate(-8,${cx},${topY - 6})`} />
          </g>
        )
      })}

      {/* Fade base into water layer */}
      <rect x="0" y="650" width="1440" height="250" fill="url(#midFade)" />
    </svg>
  )
}

// ── Layer 3: Water + foreground branches ─────────────────────────────────────
export function SceneFore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060E1A" />
          <stop offset="40%"  stopColor="#040C16" />
          <stop offset="100%" stopColor="#020810" />
        </linearGradient>
        <radialGradient id="moonReflect" cx="68%" cy="5%" r="80%">
          <stop offset="0%"   stopColor="#C0D0E8" stopOpacity="0.28" />
          <stop offset="35%"  stopColor="#8098B8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#405878" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="waterTopFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040C16" stopOpacity="0" />
          <stop offset="100%" stopColor="#040C16" stopOpacity="1" />
        </linearGradient>
        {/* Shimmer band in reflection column */}
        <linearGradient id="shimmerCol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#B0C4E0" stopOpacity="0" />
          <stop offset="40%"  stopColor="#B0C4E0" stopOpacity="1" />
          <stop offset="60%"  stopColor="#B0C4E0" stopOpacity="1" />
          <stop offset="100%" stopColor="#B0C4E0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Water surface */}
      <rect x="0" y="620" width="1440" height="280" fill="url(#water)" />
      <rect x="0" y="580" width="1440" height="70"  fill="url(#waterTopFade)" />

      {/* Moon reflection column */}
      <rect x="0" y="620" width="1440" height="280" fill="url(#moonReflect)" />

      {/* Ripple lines */}
      {[
        [979-90, 979+90, 634, 0.20], [979-70, 979+70, 645, 0.16],
        [979-110,979+110,655, 0.12], [979-55, 979+55, 665, 0.18],
        [979-130,979+130,674, 0.09], [979-80, 979+80, 683, 0.14],
        [979-150,979+150,692, 0.07], [979-95, 979+95, 700, 0.11],
        [979-170,979+170,709, 0.06], [979-115,979+115,717, 0.09],
        [979-190,979+190,725, 0.05], [979-140,979+140,733, 0.08],
        [979-210,979+210,741, 0.04], [979-165,979+165,749, 0.07],
        [979-240,979+240,758, 0.04], [979-200,979+200,766, 0.06],
        [979-280,979+280,775, 0.03], [979-230,979+230,783, 0.05],
        [979-320,979+320,792, 0.03], [979-270,979+270,800, 0.04],
      ].map(([x1, x2, y, op], i) => (
        <line key={i} x1={x1} y1={y} x2={x2} y2={y}
          stroke="#C0D4F0" strokeWidth={0.8} opacity={op} />
      ))}

      {/* ── Left hanging cherry blossom branch ── */}
      <g>
        {/* Main branch */}
        <path d="M-20,0 Q80,120 150,240 Q200,320 170,420 Q150,480 120,540"
          fill="none" stroke="#0C180C" strokeWidth="9" strokeLinecap="round" />
        {/* Sub-branch 1 */}
        <path d="M80,120 Q160,155 210,210 Q240,255 215,310"
          fill="none" stroke="#0C180C" strokeWidth="5.5" strokeLinecap="round" />
        {/* Sub-branch 2 */}
        <path d="M150,240 Q230,265 270,330 Q295,375 265,420"
          fill="none" stroke="#0C180C" strokeWidth="4" strokeLinecap="round" />
        {/* Sub-branch 3 */}
        <path d="M80,120 Q30,160 15,230 Q5,280 25,340"
          fill="none" stroke="#0C180C" strokeWidth="4" strokeLinecap="round" />
        {/* Blossom clusters */}
        {[
          [80,120],[150,240],[170,420],[210,210],[215,310],[270,330],[265,420],[25,340],
          [50,175],[120,190],[185,285],[240,375],[30,290],[155,380],[195,460],[90,310],
        ].map(([bx, by], i) => (
          <g key={i}>
            <circle cx={bx}    cy={by}    r={5+i%3*2} fill="#E8B8C8" fillOpacity={0.55+i%3*0.12} />
            <circle cx={bx+7}  cy={by-5}  r={3+i%2*2} fill="#F4CCD8" fillOpacity={0.45+i%4*0.1} />
            <circle cx={bx-6}  cy={by+6}  r={4+i%3*1} fill="#DCA8BC" fillOpacity={0.4+i%3*0.1} />
            <circle cx={bx+4}  cy={by+8}  r={3+i%2*1} fill="#F0C4D0" fillOpacity={0.35+i%5*0.08} />
          </g>
        ))}
      </g>

      {/* ── Right hanging branch (mirrored) ── */}
      <g transform="scale(-1,1) translate(-1440,0)">
        <path d="M-20,0 Q80,120 150,240 Q200,320 170,420 Q150,480 120,540"
          fill="none" stroke="#0C180C" strokeWidth="9" strokeLinecap="round" />
        <path d="M80,120 Q160,155 210,210 Q240,255 215,310"
          fill="none" stroke="#0C180C" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M150,240 Q230,265 270,330 Q295,375 265,420"
          fill="none" stroke="#0C180C" strokeWidth="4" strokeLinecap="round" />
        <path d="M80,120 Q30,160 15,230 Q5,280 25,340"
          fill="none" stroke="#0C180C" strokeWidth="4" strokeLinecap="round" />
        {[
          [80,120],[150,240],[170,420],[210,210],[215,310],[270,330],[265,420],[25,340],
          [50,175],[120,190],[185,285],[240,375],[30,290],[155,380],[195,460],[90,310],
        ].map(([bx, by], i) => (
          <g key={i}>
            <circle cx={bx}    cy={by}    r={5+i%3*2} fill="#E8B8C8" fillOpacity={0.5+i%3*0.12} />
            <circle cx={bx+7}  cy={by-5}  r={3+i%2*2} fill="#F4CCD8" fillOpacity={0.4+i%4*0.1} />
            <circle cx={bx-6}  cy={by+6}  r={4+i%3*1} fill="#DCA8BC" fillOpacity={0.38+i%3*0.1} />
          </g>
        ))}
      </g>

      {/* Foreground close bamboo — very dark, framing edges */}
      {[
        [0,520,16],[18,480,13],[36,560,15],[54,500,12],[-10,440,11],
        [1440,520,16],[1422,475,13],[1404,555,15],[1386,495,12],[1450,440,11],
        [72,380,10],[88,410,9],[104,350,9],
        [1368,380,10],[1352,405,9],[1336,345,9],
      ].map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x - w/2} y={900 - h} width={w} height={h} fill="#040A04" rx={w*0.25} />
          {Array.from({ length: Math.floor(h/50) }, (_, n) => (
            <rect key={n}
              x={x - w/2 - 2} y={900 - (n+1)*50 - 2}
              width={w+4} height={4} fill="#030804" rx={1.5}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default SceneSky

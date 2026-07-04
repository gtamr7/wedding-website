const PETALS = [
  { left: '4%',  size: 10, dur: 13, delay:   0, opacity: 0.20 },
  { left: '14%', size:  7, dur: 10, delay:  -4, opacity: 0.14 },
  { left: '23%', size: 12, dur: 15, delay:  -8, opacity: 0.22 },
  { left: '33%', size:  8, dur: 11, delay:  -2, opacity: 0.16 },
  { left: '44%', size: 11, dur: 14, delay:  -6, opacity: 0.20 },
  { left: '54%', size:  7, dur: 12, delay: -10, opacity: 0.13 },
  { left: '63%', size: 10, dur: 16, delay:  -3, opacity: 0.19 },
  { left: '72%', size:  9, dur: 13, delay:  -7, opacity: 0.17 },
  { left: '81%', size: 13, dur: 11, delay:  -1, opacity: 0.23 },
  { left: '91%', size:  8, dur: 15, delay:  -9, opacity: 0.15 },
  { left: '9%',  size:  9, dur: 17, delay: -12, opacity: 0.18 },
  { left: '49%', size:  6, dur: 10, delay: -14, opacity: 0.12 },
]

export default function FloatingPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PETALS.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size * 1.6,
            opacity: p.opacity,
            animationName: 'petalFall',
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <svg viewBox="0 0 10 16" width="100%" height="100%" fill={i % 2 === 0 ? '#D4B84A' : '#FDFCF8'}>
            <path d="M5 0 C9 5, 9 11, 5 16 C1 11, 1 5, 5 0Z" />
          </svg>
        </div>
      ))}
    </div>
  )
}

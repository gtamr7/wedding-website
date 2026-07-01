export default function BotanicalSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top-left branch */}
      <g opacity="0.18">
        <path d="M20 80 Q60 40 120 60 Q80 100 20 80Z" fill="#6B7D4A" />
        <path d="M40 60 Q90 10 150 30 Q100 80 40 60Z" fill="#4A5C2F" />
        <path d="M10 50 Q50 20 90 40 Q55 75 10 50Z" fill="#6B7D4A" />
        <path d="M60 30 Q100 0 140 15 Q100 55 60 30Z" fill="#4A5C2F" />
        <path d="M20 80 Q90 70 150 30" stroke="#6B7D4A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 80 Q60 50 90 40" stroke="#4A5C2F" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M150 30 Q110 60 80 90 Q60 110 30 120" stroke="#6B7D4A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M80 90 Q100 80 130 60" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
        <path d="M80 90 Q70 100 55 115 Q70 105 90 100Z" fill="#6B7D4A" />
        <path d="M55 115 Q75 105 90 100" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Top-right branch */}
      <g opacity="0.18">
        <path d="M780 80 Q740 40 680 60 Q720 100 780 80Z" fill="#6B7D4A" />
        <path d="M760 60 Q710 10 650 30 Q700 80 760 60Z" fill="#4A5C2F" />
        <path d="M790 50 Q750 20 710 40 Q745 75 790 50Z" fill="#6B7D4A" />
        <path d="M740 30 Q700 0 660 15 Q700 55 740 30Z" fill="#4A5C2F" />
        <path d="M780 80 Q710 70 650 30" stroke="#6B7D4A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M780 80 Q740 50 710 40" stroke="#4A5C2F" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M650 30 Q690 60 720 90 Q740 110 770 120" stroke="#6B7D4A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M720 90 Q700 80 670 60" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
        <path d="M720 90 Q730 100 745 115 Q730 105 710 100Z" fill="#6B7D4A" />
      </g>

      {/* Bottom-left corner */}
      <g opacity="0.15">
        <path d="M10 560 Q50 530 100 540 Q70 570 10 560Z" fill="#6B7D4A" />
        <path d="M30 550 Q80 510 130 525 Q90 565 30 550Z" fill="#4A5C2F" />
        <path d="M10 560 Q80 545 130 525" stroke="#6B7D4A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M10 560 Q50 545 80 535" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
        <path d="M80 535 Q65 545 50 555" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
        <path d="M65 545 Q80 538 100 530 Q82 545 65 545Z" fill="#6B7D4A" />
      </g>

      {/* Bottom-right corner */}
      <g opacity="0.15">
        <path d="M790 560 Q750 530 700 540 Q730 570 790 560Z" fill="#6B7D4A" />
        <path d="M770 550 Q720 510 670 525 Q710 565 770 550Z" fill="#4A5C2F" />
        <path d="M790 560 Q720 545 670 525" stroke="#6B7D4A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M670 525 Q710 535 740 545" stroke="#4A5C2F" strokeWidth="1" strokeLinecap="round" />
        <path d="M735 538 Q720 545 710 550 Q725 542 740 536Z" fill="#6B7D4A" />
      </g>

      {/* Center subtle leaf cluster */}
      <g opacity="0.07">
        <path d="M380 280 Q400 250 430 260 Q410 285 380 280Z" fill="#4A5C2F" />
        <path d="M400 260 Q420 235 450 245 Q425 270 400 260Z" fill="#6B7D4A" />
        <path d="M370 290 Q380 260 400 260" stroke="#4A5C2F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M400 260 Q415 275 410 300" stroke="#6B7D4A" strokeWidth="1" strokeLinecap="round" />
        <path d="M410 300 Q395 285 380 295 Q393 305 410 300Z" fill="#4A5C2F" />
      </g>
    </svg>
  )
}

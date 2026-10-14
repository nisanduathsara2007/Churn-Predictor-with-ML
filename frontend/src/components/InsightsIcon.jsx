import { useId } from 'react'

// Custom header badge icon: rising bars with an upward trend arrow and a sparkle
export default function InsightsIcon({ className }) {
  const gradientId = useId()
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="48" x2="0" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Bars */}
      <rect x="7" y="30" width="7" height="12" rx="2" fill={`url(#${gradientId})`} />
      <rect x="18" y="24" width="7" height="18" rx="2" fill={`url(#${gradientId})`} />
      <rect x="29" y="18" width="7" height="24" rx="2" fill={`url(#${gradientId})`} />

      {/* Baseline */}
      <path d="M5 44h38" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Trend line with arrow head */}
      <path
        d="M6 25l9.5-8 7 4.5L37 9"
        stroke="#1d4ed8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.5 8.5H37.5V15.5"
        stroke="#1d4ed8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sparkle */}
      <path
        d="M42 21c.4 1.9 1.1 2.6 3 3-1.9.4-2.6 1.1-3 3-.4-1.9-1.1-2.6-3-3 1.9-.4 2.6-1.1 3-3z"
        fill="#3b82f6"
      />
    </svg>
  )
}

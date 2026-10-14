import { useEffect, useState } from 'react'

// After this long, assume the hosted API is waking up from sleep and say so
const SLOW_AFTER_MS = 4000

export default function LoadingOverlay() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-linear-to-br from-slate-950/85 via-blue-950/80 to-slate-900/85 px-6 text-center backdrop-blur-sm"
    >
      <div className="size-16 animate-spin rounded-full border-4 border-blue-500/25 border-t-blue-500" />
      <p className="text-sm font-medium text-blue-100">Predicting churn&hellip;</p>
      {slow && (
        <p className="max-w-xs text-xs text-blue-200/80">
          Waking up the server. The first prediction can take up to a minute.
        </p>
      )}
    </div>
  )
}

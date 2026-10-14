import { useEffect, useRef, useState } from 'react'
import { predictChurn, wakeServer } from './api'
import CustomerForm from './components/CustomerForm'
import Header from './components/Header'
import LoadingOverlay from './components/LoadingOverlay'
import ResultPanel from './components/ResultPanel'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    wakeServer()
  }, [])

  async function handlePredict(payload) {
    if (loading) return
    setLoading(true)
    const response = await predictChurn(payload)
    setResult(response)
    setLoading(false)

    // On stacked layouts the result card sits below the form, so bring it into view
    if (window.matchMedia('(max-width: 1023px)').matches) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-blue-100/60">
      <main
        aria-busy={loading}
        className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      >
        <Header />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <CustomerForm loading={loading} onPredict={handlePredict} />
          <ResultPanel ref={resultRef} result={result} />
        </div>
      </main>
      {loading && <LoadingOverlay />}
    </div>
  )
}

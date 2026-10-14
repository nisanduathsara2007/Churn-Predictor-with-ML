// Set VITE_API_URL at build time (e.g. on Render) to point at the deployed API
const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
// Free hosting puts the API to sleep when idle and waking it can take about a minute
const TIMEOUT_MS = 90000

// Pings the API so a sleeping server starts waking up while the user fills in the form
export function wakeServer() {
  fetch(`${API_URL}/health`).catch(() => {
    // Ignore: the real request will report any connection problem
  })
}

// Sends the validated form data to the API and always resolves to
// { success, prediction, probability, message }
export async function predictChurn(payload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    let body = null
    try {
      body = await response.json()
    } catch {
      // Non-JSON response, handled below
    }

    if (body && typeof body.success === 'boolean') return body

    return {
      success: false,
      prediction: -1,
      probability: -1,
      message: `The server returned an unexpected response (status ${response.status}).`,
    }
  } catch (error) {
    return {
      success: false,
      prediction: -1,
      probability: -1,
      message:
        error.name === 'AbortError'
          ? 'The prediction server took too long to respond. Please try again in a moment.'
          : 'Could not reach the prediction server. Make sure the API is running.',
    }
  } finally {
    clearTimeout(timer)
  }
}

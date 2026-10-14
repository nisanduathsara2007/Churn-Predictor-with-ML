import {
  Check,
  CircleAlert,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UserRound,
  UserRoundCheck,
} from 'lucide-react'

// Placeholder: replace with the real GitHub repository URL
const PROJECT_URL = 'https://github.com/your-username/churn-prediction'

const BENEFITS = [
  'Churn prediction (Yes / No)',
  'Probability score',
  'Risk level indicator',
  'Quick and easy to use',
]

const RISK_LEVELS = [
  { min: 0.7, label: 'High', className: 'bg-red-100 text-red-700' },
  { min: 0.4, label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  { min: 0, label: 'Low', className: 'bg-green-100 text-green-700' },
]

const percent = (value) => `${(value * 100).toFixed(1)}%`

function Placeholder() {
  return (
    <div className="flex flex-col items-center rounded-xl bg-linear-to-b from-blue-50 to-slate-50 px-6 py-10 text-center">
      <div className="relative flex size-28 items-center justify-center rounded-full bg-blue-100">
        <UserRound className="size-12 text-blue-900" strokeWidth={1.75} />
        <ShieldCheck className="absolute right-5 bottom-6 size-8 fill-blue-600 text-white" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-blue-950">Enter customer details</h3>
      <p className="mt-2 max-w-xs text-sm text-slate-600">
        Fill in the form and click &ldquo;Predict Churn&rdquo; to see the result here.
      </p>
    </div>
  )
}

function ErrorResult({ message }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-red-100">
        <CircleAlert className="size-10 text-red-600" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-red-800">Prediction failed</h3>
      <p className="mt-2 max-w-xs text-sm text-red-700">{message}</p>
    </div>
  )
}

function SuccessResult({ prediction, probability }) {
  const churns = prediction === 1
  // The API returns the confidence of the predicted class; convert it to the chance of churning
  const churnProbability = churns ? probability : 1 - probability
  const risk = RISK_LEVELS.find((level) => churnProbability >= level.min)
  const Icon = churns ? TriangleAlert : UserRoundCheck

  return (
    <div
      className={`rounded-xl border px-6 py-8 ${
        churns ? 'border-red-200 bg-red-50/60' : 'border-green-200 bg-green-50/60'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex size-20 items-center justify-center rounded-full ${
            churns ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}
        >
          <Icon className="size-10" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Prediction
        </p>
        <h3 className={`mt-1 text-2xl font-bold ${churns ? 'text-red-700' : 'text-green-700'}`}>
          {churns ? 'Likely to churn' : 'Likely to stay'}
        </h3>
      </div>

      <dl className="mt-6 space-y-4">
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <dt className="font-medium text-slate-600">Churn probability</dt>
            <dd className="font-semibold text-slate-900">{percent(churnProbability)}</dd>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${churns ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: percent(churnProbability) }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="font-medium text-slate-600">Risk level</dt>
          <dd className={`rounded-full px-3 py-0.5 text-xs font-semibold ${risk.className}`}>
            {risk.label}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default function ResultPanel({ ref, result }) {
  let content = <Placeholder />
  if (result?.success) {
    content = <SuccessResult prediction={result.prediction} probability={result.probability} />
  } else if (result) {
    content = <ErrorResult message={result.message} />
  }

  return (
    <aside
      ref={ref}
      className="flex scroll-mt-6 flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-6"
    >
      <div className="flex items-center gap-3">
        <Sparkles className="size-6 fill-blue-600 text-blue-600" />
        <h2 className="text-lg font-semibold text-blue-950 sm:text-xl">Prediction Result</h2>
      </div>

      <div aria-live="polite">{content}</div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-blue-600" />
          <h3 className="font-semibold text-blue-950">What will you get?</h3>
        </div>
        <ul className="mt-4 space-y-3">
          {BENEFITS.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="size-4 shrink-0 text-blue-600" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-slate-700">Powered by Machine Learning</p>
            <p className="text-xs text-slate-500">Built with FastAPI + React</p>
          </div>
        </div>
        <a
          href={PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Rocket className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          View Project
        </a>
      </div>
    </aside>
  )
}

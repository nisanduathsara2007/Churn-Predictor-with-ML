import InsightsIcon from './InsightsIcon'

export default function Header() {
  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl lg:text-4xl">
          Customer Churn Prediction
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Enter the customer details below to predict whether they are likely to churn or stay
          with your service.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-50 shadow-inner shadow-blue-200/60 ring-1 ring-blue-200/70 sm:size-20">
          <InsightsIcon className="size-9 sm:size-11" />
        </div>
        <p className="text-sm font-medium whitespace-nowrap text-blue-700">
          Data-driven insights
          <br />
          for a stronger tomorrow
        </p>
      </div>
    </header>
  )
}

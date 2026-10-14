import { ArrowRight, CircleAlert, Sparkles, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { FORM_FIELDS, isLocked } from '../fields'
import { applyChange, INITIAL_FORM, validate } from '../validation'
import { NumberField, SelectField, ToggleField } from './FormFields'

const FIELD_COMPONENTS = { select: SelectField, toggle: ToggleField, number: NumberField }

export default function CustomerForm({ loading, onPredict }) {
  const [form, setForm] = useState(INITIAL_FORM)
  // Errors only show after the first submit attempt, then update live as fields are fixed
  const [submitted, setSubmitted] = useState(false)
  // Answers a user gave before a field got locked, restored when it unlocks
  const savedAnswers = useRef({})

  const { errors, summary, payload } = validate(form)
  const shownErrors = submitted ? errors : {}

  function handleChange(name, value) {
    setForm((current) => applyChange(current, name, value, savedAnswers.current))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    setSubmitted(true)

    if (!payload) {
      const firstInvalid = FORM_FIELDS.find((field) => errors[field.name])
      if (firstInvalid) document.getElementById(firstInvalid.name)?.focus()
      return
    }

    onPredict(payload)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <UserRound className="size-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-950 sm:text-xl">Customer Information</h2>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Step 1 of 1
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {FORM_FIELDS.map((field) => {
            const Field = FIELD_COMPONENTS[field.type]
            return (
              <Field
                key={field.name}
                field={field}
                value={form[field.name]}
                error={shownErrors[field.name]}
                locked={isLocked(field, form)}
                onChange={handleChange}
              />
            )
          })}
        </div>

        <div aria-live="polite">
          {submitted && summary && (
            <p className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <CircleAlert className="size-4 shrink-0" />
              {summary}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-500/30 focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none disabled:active:scale-100"
        >
          <Sparkles className="size-5" />
          {loading ? 'Predicting…' : 'Predict Churn'}
          <ArrowRight className="size-5" />
        </button>
      </form>
    </section>
  )
}

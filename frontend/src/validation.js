import { FORM_FIELDS, isLocked, selectPrompt } from './fields'

// Same summary messages the API returns
export const MISSING_MESSAGE = 'Some data are missing. Check Them.'
export const INVALID_MESSAGE = 'Some data are invalid. Check Them.'

export const INITIAL_FORM = Object.fromEntries(FORM_FIELDS.map((field) => [field.name, '']))

const isEmpty = (value) => value === '' || value == null

function checkSelect(field, value) {
  if (isEmpty(value)) {
    const prompt = selectPrompt(field)
    return { type: 'missing', message: `Please ${prompt[0].toLowerCase()}${prompt.slice(1)}.` }
  }
  if (!field.options.includes(value)) {
    return { type: 'invalid', message: 'Please choose one of the listed options.' }
  }
  return null
}

function checkToggle(field, value) {
  if (isEmpty(value)) {
    return { type: 'missing', message: 'Please choose Yes or No.' }
  }
  if (!field.choices.some((choice) => choice.value === value)) {
    return { type: 'invalid', message: 'Please choose Yes or No.' }
  }
  return null
}

function checkNumber(field, raw) {
  const label = field.shortLabel ?? field.label
  if (String(raw).trim() === '') {
    return { type: 'missing', message: `Please enter ${label.toLowerCase()}.` }
  }
  const value = Number(raw)
  if (!Number.isFinite(value)) {
    return { type: 'invalid', message: `${label} must be a number.` }
  }
  if (value < 0) {
    return { type: 'invalid', message: `${label} can't be negative.` }
  }
  if (field.integer && !Number.isInteger(value)) {
    return { type: 'invalid', message: `${label} must be a whole number.` }
  }
  return null
}

const CHECKS = { select: checkSelect, toggle: checkToggle, number: checkNumber }

// Returns field errors, the API summary message, and the JSON payload when everything is valid
export function validate(form) {
  const errors = {}

  for (const field of FORM_FIELDS) {
    let error = CHECKS[field.type](field, form[field.name])
    if (!error && isLocked(field, form) && form[field.name] !== field.lock.value) {
      error = { type: 'invalid', message: field.lock.reason }
    }
    if (error) errors[field.name] = error
  }

  const problems = Object.values(errors)
  if (problems.length > 0) {
    const summary = problems.some((error) => error.type === 'missing')
      ? MISSING_MESSAGE
      : INVALID_MESSAGE
    return { errors, summary, payload: null }
  }

  const payload = {
    ...form,
    tenure: Number(form.tenure),
    MonthlyCharges: Number(form.MonthlyCharges),
  }
  return { errors, summary: null, payload }
}

// Applies one field change, locking dependent fields to "No" as soon as their condition is met
// and restoring the user's earlier answer when the condition is lifted
export function applyChange(form, name, value, savedAnswers) {
  const next = { ...form, [name]: value }
  for (const field of FORM_FIELDS) {
    if (!field.lock) continue
    const wasLocked = isLocked(field, form)
    const nowLocked = isLocked(field, next)
    if (!wasLocked && nowLocked) {
      savedAnswers[field.name] = form[field.name]
      next[field.name] = field.lock.value
    } else if (wasLocked && !nowLocked) {
      next[field.name] = savedAnswers[field.name] ?? ''
    }
  }
  return next
}

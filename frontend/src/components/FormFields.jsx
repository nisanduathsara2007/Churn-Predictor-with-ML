import { Check, CircleAlert, ChevronDown, Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { selectPrompt } from '../fields'

const inputClass =
  'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm transition outline-none placeholder:text-slate-400 focus:ring-2'

function borderClass(error) {
  return error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/20'
}

function FieldLabel({ htmlFor, icon: Icon, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
    >
      <Icon className="size-4 text-blue-600" />
      {children}
    </label>
  )
}

function FieldError({ id, error }) {
  if (!error) return null
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <CircleAlert className="size-3.5 shrink-0" />
      {error.message}
    </p>
  )
}

// Themed dropdown following the WAI-ARIA "select-only combobox" pattern:
// focus stays on the trigger and the highlighted option is announced via aria-activedescendant
export function SelectField({ field, value, error, onChange }) {
  const { name, options } = field
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)
  const listRef = useRef(null)

  const errorId = `${name}-error`
  const listId = `${name}-listbox`
  const optionId = (index) => `${name}-option-${index}`
  const selectedIndex = options.indexOf(value)

  // Close when clicking anywhere outside the dropdown
  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // Keep the highlighted option visible while moving with the keyboard
  useEffect(() => {
    if (open && activeIndex >= 0) {
      listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeIndex])

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  function choose(index) {
    onChange(name, options[index])
    setOpen(false)
  }

  function handleKeyDown(event) {
    const last = options.length - 1

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        openList()
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0) choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        // Type a letter to jump to the first option starting with it
        if (event.key.length === 1) {
          const match = options.findIndex((option) =>
            option.toLowerCase().startsWith(event.key.toLowerCase()),
          )
          if (match >= 0) setActiveIndex(match)
        }
    }
  }

  const triggerState = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : open
      ? 'border-blue-500 ring-2 ring-blue-500/20'
      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 focus:border-blue-500 focus:ring-blue-500/20'

  return (
    <div ref={rootRef}>
      <FieldLabel htmlFor={name} icon={field.icon}>
        {field.label}
      </FieldLabel>
      <div className="relative">
        <button
          type="button"
          id={name}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
          className={`${inputClass} ${triggerState} flex cursor-pointer items-center justify-between gap-2 text-left`}
        >
          <span className={`truncate ${selectedIndex >= 0 ? 'text-slate-800' : 'text-slate-400'}`}>
            {selectedIndex >= 0 ? value : selectPrompt(field)}
          </span>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
              open ? 'rotate-180 text-blue-600' : 'text-slate-500'
            }`}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={name}
            // Keep focus on the trigger when an option is clicked
            onMouseDown={(event) => event.preventDefault()}
            className="absolute top-full right-0 left-0 z-30 mt-2 max-h-60 origin-top animate-dropdown-in overflow-auto rounded-lg border border-blue-100 bg-white p-1 shadow-lg shadow-blue-900/10 motion-reduce:animate-none"
          >
            {options.map((option, index) => {
              const selected = index === selectedIndex
              const active = index === activeIndex
              return (
                <li
                  key={option}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-100 ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  } ${selected ? 'font-semibold text-blue-700' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-4 w-0.5 rounded-full transition-colors ${
                        active ? 'bg-blue-500' : 'bg-transparent'
                      }`}
                    />
                    {option}
                  </span>
                  {selected && <Check className="size-4 shrink-0 text-blue-600" strokeWidth={2.5} />}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  )
}

export function NumberField({ field, value, error, onChange }) {
  const errorId = `${field.name}-error`
  return (
    <div>
      <FieldLabel htmlFor={field.name} icon={field.icon}>
        {field.label}
      </FieldLabel>
      <input
        id={field.name}
        name={field.name}
        type="number"
        inputMode={field.integer ? 'numeric' : 'decimal'}
        min="0"
        step={field.step}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${borderClass(error)}`}
      />
      <FieldError id={errorId} error={error} />
    </div>
  )
}

export function ToggleField({ field, value, error, locked, onChange }) {
  const Icon = field.icon
  const errorId = `${field.name}-error`
  const lockId = `${field.name}-lock`
  const selectedIndex = field.choices.findIndex((choice) => choice.value === value)
  return (
    <fieldset disabled={locked} aria-describedby={error ? errorId : locked ? lockId : undefined}>
      <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="size-4 text-blue-600" />
        {field.label}
        {locked && <Lock className="size-3.5 text-slate-400" aria-label="Locked" />}
      </legend>
      <div
        className={`relative grid grid-cols-2 gap-1 rounded-lg border p-1 shadow-sm ${
          error ? 'border-red-400' : 'border-slate-200'
        } ${locked ? 'bg-slate-100' : 'bg-white'}`}
      >
        {/* Sliding highlight behind the selected choice: half the inner width, shifted by one cell plus the gap */}
        <span
          aria-hidden="true"
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-6px)] rounded-md shadow-sm transition-[translate,opacity,background-color] duration-200 ease-out motion-reduce:transition-none ${
            locked ? 'bg-slate-400' : 'bg-blue-600'
          } ${selectedIndex === -1 ? 'opacity-0' : 'opacity-100'} ${
            selectedIndex === 1 ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
          }`}
        />
        {field.choices.map((choice, index) => (
          <label
            key={choice.value}
            className={`relative ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              id={index === 0 ? field.name : undefined}
              name={field.name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(field.name, choice.value)}
              className="peer sr-only"
            />
            <span
              className={`block rounded-md py-1.5 text-center text-sm font-medium transition-colors duration-200 select-none peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 motion-reduce:transition-none ${
                locked ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {choice.label}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <FieldError id={errorId} error={error} />
      ) : (
        locked && (
          <p id={lockId} className="mt-1.5 text-xs text-slate-500">
            {field.lock.reason}
          </p>
        )
      )}
    </fieldset>
  )
}

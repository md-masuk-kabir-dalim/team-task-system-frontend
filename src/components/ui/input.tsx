import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string
  hint?: string
  label: string
}

export function Input({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input
        {...props}
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error)}
        className={cn('input', error && 'input--error', className)}
        id={inputId}
      />
      {error ? <span className="field__error" id={descriptionId}>{error}</span> : null}
      {!error && hint ? <span className="field__hint" id={descriptionId}>{hint}</span> : null}
    </label>
  )
}

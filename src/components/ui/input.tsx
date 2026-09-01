import { LoaderCircle } from 'lucide-react'
import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'
import { mergeDescribedBy } from '../../lib/form-utils.ts'

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'aria-describedby'> {
  'aria-describedby'?: string
  error?: string
  helperText?: string
  label: string
  loading?: boolean
}

export function Input({
  'aria-describedby': ariaDescribedBy,
  className,
  disabled,
  error,
  helperText,
  id,
  label,
  loading = false,
  required,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">
        {label}
        {required ? <span aria-hidden="true" className="field__required">*</span> : null}
      </span>
      <span className="field__control">
        <input
          {...props}
          aria-busy={loading || undefined}
          aria-describedby={mergeDescribedBy(ariaDescribedBy, messageId)}
          aria-invalid={Boolean(error)}
          className={cn('input', error && 'input--error', loading && 'input--loading', className)}
          disabled={disabled || loading}
          id={inputId}
          required={required}
        />
        {loading ? <LoaderCircle aria-hidden="true" className="field__loading" size={16} /> : null}
      </span>
      {error ? <span className="field__error" id={messageId}>{error}</span> : null}
      {!error && helperText ? <span className="field__hint" id={messageId}>{helperText}</span> : null}
    </label>
  )
}

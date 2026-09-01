import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'
import { mergeDescribedBy } from '../../lib/form-utils.ts'

export interface SelectOption {
  disabled?: boolean
  label: string
  value: string
}

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'aria-describedby' | 'children'> {
  'aria-describedby'?: string
  error?: string | undefined
  helperText?: string
  label: string
  options: readonly SelectOption[]
  placeholder?: string
}

export function Select({
  'aria-describedby': ariaDescribedBy,
  className,
  error,
  helperText,
  id,
  label,
  options,
  placeholder,
  required,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const messageId = error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined

  return (
    <label className="field" htmlFor={selectId}>
      <span className="field__label">
        {label}
        {required ? <span aria-hidden="true" className="field__required">*</span> : null}
      </span>
      <select
        {...props}
        aria-describedby={mergeDescribedBy(ariaDescribedBy, messageId)}
        aria-invalid={Boolean(error)}
        className={cn('select', error && 'select--error', className)}
        id={selectId}
        required={required}
      >
        {placeholder ? <option disabled value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field__error" id={messageId}>{error}</span> : null}
      {!error && helperText ? <span className="field__hint" id={messageId}>{helperText}</span> : null}
    </label>
  )
}

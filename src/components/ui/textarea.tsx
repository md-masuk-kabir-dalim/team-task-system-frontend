import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'
import { mergeDescribedBy } from '../../lib/form-utils.ts'

interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'aria-describedby'> {
  'aria-describedby'?: string
  error?: string | undefined
  helperText?: string
  label: string
}

export function Textarea({
  'aria-describedby': ariaDescribedBy,
  className,
  error,
  helperText,
  id,
  label,
  required,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const messageId = error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined

  return (
    <label className="field" htmlFor={textareaId}>
      <span className="field__label">
        {label}
        {required ? <span aria-hidden="true" className="field__required">*</span> : null}
      </span>
      <textarea
        {...props}
        aria-describedby={mergeDescribedBy(ariaDescribedBy, messageId)}
        aria-invalid={Boolean(error)}
        className={cn('textarea', error && 'textarea--error', className)}
        id={textareaId}
        required={required}
      />
      {error ? <span className="field__error" id={messageId}>{error}</span> : null}
      {!error && helperText ? <span className="field__hint" id={messageId}>{helperText}</span> : null}
    </label>
  )
}

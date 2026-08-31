import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  description?: string
  label: string
}

export function Checkbox({ className, description, id, label, ...props }: CheckboxProps) {
  return (
    <label className={cn('checkbox', className)} htmlFor={id}>
      <input {...props} className="checkbox__input" id={id} type="checkbox" />
      <span className="checkbox__content">
        <span className="checkbox__label">{label}</span>
        {description ? <span className="checkbox__description">{description}</span> : null}
      </span>
    </label>
  )
}

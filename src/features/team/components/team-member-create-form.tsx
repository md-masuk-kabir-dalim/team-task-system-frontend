import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button.tsx'
import { Input } from '@/shared/components/ui/input.tsx'
import { Select } from '@/shared/components/ui/select.tsx'
import { employeeDepartments, employeeStatuses, type EmployeeDepartment, type EmployeeDraft, type EmployeeStatus } from '../types/team-directory-types.ts'

interface TeamMemberCreateFormProps {
  draft: EmployeeDraft
  onCancel: () => void
  onSubmit: () => void
  onUpdate: (values: Partial<EmployeeDraft>) => void
}

function toOptions(values: readonly string[]) {
  return values.map((value) => ({ label: value === 'on-leave' ? 'On leave' : value.charAt(0).toUpperCase() + value.slice(1), value }))
}

export function TeamMemberCreateForm({ draft, onCancel, onSubmit, onUpdate }: TeamMemberCreateFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <section aria-labelledby="team-member-create-title" className="team-member-create-form">
      <div>
        <p>New employee</p>
        <h2 id="team-member-create-title">Add team member</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <Input label="Full name" onChange={(event) => onUpdate({ name: event.target.value })} required value={draft.name} />
        <Input label="Work email" onChange={(event) => onUpdate({ email: event.target.value })} required type="email" value={draft.email} />
        <Input label="Phone" onChange={(event) => onUpdate({ phone: event.target.value })} required type="tel" value={draft.phone} />
        <Input label="Designation" onChange={(event) => onUpdate({ designation: event.target.value })} required value={draft.designation} />
        <Select
          label="Department"
          onChange={(event) => onUpdate({ department: event.target.value as EmployeeDepartment })}
          options={toOptions(employeeDepartments)}
          value={draft.department}
        />
        <Select
          label="Status"
          onChange={(event) => onUpdate({ status: event.target.value as EmployeeStatus })}
          options={toOptions(employeeStatuses)}
          value={draft.status}
        />
        <footer>
          <Button onClick={onCancel} type="button" variant="ghost">Cancel</Button>
          <Button type="submit">Add employee</Button>
        </footer>
      </form>
    </section>
  )
}

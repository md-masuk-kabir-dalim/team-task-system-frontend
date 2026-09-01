import { useState } from 'react'
import { InlineError } from '../../../components/feedback/inline-error.tsx'
import { Button } from '../../../components/ui/button.tsx'
import { Input } from '../../../components/ui/input.tsx'
import { Select } from '../../../components/ui/select.tsx'
import { Textarea } from '../../../components/ui/textarea.tsx'
import type { CreateTaskInput } from '../api/task-service.ts'
import type { TaskPriority, TaskStatus, TeamMember } from '../types/task-types.ts'

const statusOptions = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Done', value: 'done' },
] as const

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

interface TaskFormValues {
  assigneeId: string
  description: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  title: string
}

type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>

const defaultTaskFormValues: TaskFormValues = {
  assigneeId: 'unassigned',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
  title: '',
}

interface TaskFormProps {
  members: readonly TeamMember[]
  onCancel: () => void
  onSubmit: (input: CreateTaskInput) => Promise<void>
}

function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {}

  if (values.title.trim().length < 3) {
    errors.title = 'Enter a task title with at least 3 characters.'
  }

  if (values.title.trim().length > 180) {
    errors.title = 'Keep the task title under 180 characters.'
  }

  if (values.description.length > 2_000) {
    errors.description = 'Keep the description under 2,000 characters.'
  }

  if (values.dueDate && Number.isNaN(Date.parse(`${values.dueDate}T12:00:00`))) {
    errors.dueDate = 'Enter a valid due date.'
  }

  return errors
}

export function TaskForm({ members, onCancel, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(defaultTaskFormValues)
  const [errors, setErrors] = useState<TaskFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const assigneeOptions = [
    { label: 'Unassigned', value: 'unassigned' },
    ...members.map((member) => ({ label: member.name, value: member.id })),
  ]

  const updateValue = <Key extends keyof TaskFormValues>(key: Key, value: TaskFormValues[Key]) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }))
    setSubmitError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validateTaskForm(values)

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit({
        assigneeId: values.assigneeId === 'unassigned' ? null : values.assigneeId,
        description: values.description.trim() || null,
        dueDate: values.dueDate || null,
        priority: values.priority,
        status: values.status,
        title: values.title.trim(),
      })
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create the task. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form" noValidate onSubmit={handleSubmit}>
      {submitError ? <InlineError message={submitError} /> : null}
      <Input
        autoFocus
        error={errors.title}
        label="Task title"
        onChange={(event) => updateValue('title', event.target.value)}
        placeholder="What needs to happen?"
        required
        value={values.title}
      />
      <Textarea
        error={errors.description}
        label="Description"
        onChange={(event) => updateValue('description', event.target.value)}
        placeholder="Add useful context, links, or acceptance notes."
        value={values.description}
      />
      <div className="task-form__grid">
        <Select
          label="Status"
          onChange={(event) => updateValue('status', event.target.value as TaskStatus)}
          options={statusOptions}
          value={values.status}
        />
        <Select
          label="Priority"
          onChange={(event) => updateValue('priority', event.target.value as TaskPriority)}
          options={priorityOptions}
          value={values.priority}
        />
        <Select
          label="Assignee"
          onChange={(event) => updateValue('assigneeId', event.target.value)}
          options={assigneeOptions}
          value={values.assigneeId}
        />
        <Input
          error={errors.dueDate}
          label="Due date"
          onChange={(event) => updateValue('dueDate', event.target.value)}
          type="date"
          value={values.dueDate}
        />
      </div>
      <div className="task-form__actions">
        <Button disabled={isSubmitting} onClick={onCancel} variant="ghost">Cancel</Button>
        <Button loading={isSubmitting} type="submit">Create task</Button>
      </div>
    </form>
  )
}

import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { InlineError } from '../../../components/feedback/inline-error.tsx'
import { Select } from '../../../components/ui/select.tsx'
import type { TaskStatus } from '../types/task-types.ts'

const statusOptions = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Done', value: 'done' },
] as const

interface TaskStatusControlProps {
  onStatusChange: (status: TaskStatus) => Promise<void>
  status: TaskStatus
}

export function TaskStatusControl({ onStatusChange, status }: TaskStatusControlProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (nextStatus: TaskStatus) => {
    if (nextStatus === status) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await onStatusChange(nextStatus)
    } catch (submissionError: unknown) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to update the task status.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section aria-label="Task workflow" className="task-status-control">
      <Select
        disabled={isSaving}
        label="Move task to"
        onChange={(event) => void handleChange(event.target.value as TaskStatus)}
        options={statusOptions}
        value={status}
      />
      {isSaving ? <span aria-live="polite" className="task-status-control__saving"><LoaderCircle aria-hidden="true" size={15} />Saving status</span> : null}
      {error ? <InlineError message={error} /> : null}
    </section>
  )
}

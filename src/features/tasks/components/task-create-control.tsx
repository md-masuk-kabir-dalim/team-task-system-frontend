import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button.tsx'
import { Dialog } from '../../../components/ui/dialog.tsx'
import { Sheet } from '../../../components/ui/sheet.tsx'
import { useMediaQuery } from '../../../hooks/use-media-query.ts'
import { appRoutes } from '../../../lib/navigation.ts'
import { useTaskStore } from '../../../stores/task-store.ts'
import { useUiStore } from '../../../stores/ui-store.ts'
import { TaskForm } from './task-form.tsx'
import type { TeamMember } from '../types/task-types.ts'

interface TaskCreateControlProps {
  label?: string
  members: readonly TeamMember[]
}

export function TaskCreateControl({ label = 'Add New Task', members }: TaskCreateControlProps) {
  const closeCreateTask = useUiStore((state) => state.closeCreateTask)
  const createTask = useTaskStore((state) => state.createTask)
  const isCreateTaskOpen = useUiStore((state) => state.isCreateTaskOpen)
  const openCreateTask = useUiStore((state) => state.openCreateTask)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const navigate = useNavigate()

  const handleSubmit = async (...[input]: Parameters<typeof createTask>) => {
    const task = await createTask(input)
    closeCreateTask()
    navigate(appRoutes.taskDetails(task.id))
  }

  const form = <TaskForm members={members} onCancel={closeCreateTask} onSubmit={handleSubmit} />

  return (
    <>
      <Button onClick={openCreateTask}>
        <Plus aria-hidden="true" size={17} />
        {label}
      </Button>
      {isMobile ? (
        <Sheet
          description="Capture a clear next step for your team."
          onClose={closeCreateTask}
          open={isCreateTaskOpen}
          side="bottom"
          title="Create task"
        >
          {form}
        </Sheet>
      ) : (
        <Dialog
          description="Capture a clear next step for your team."
          onClose={closeCreateTask}
          open={isCreateTaskOpen}
          title="Create task"
        >
          {form}
        </Dialog>
      )}
    </>
  )
}

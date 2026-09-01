import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button.tsx'
import { Dialog } from '../../../components/ui/dialog.tsx'
import { Sheet } from '../../../components/ui/sheet.tsx'
import { useMediaQuery } from '../../../hooks/use-media-query.ts'
import { appRoutes } from '../../../lib/navigation.ts'
import { useTaskUiStore } from '../../../stores/task-ui-store.ts'
import { createTask } from '../api/task-service.ts'
import { TaskForm } from './task-form.tsx'
import type { TeamMember } from '../types/task-types.ts'

interface TaskCreateControlProps {
  members: readonly TeamMember[]
  onCreated: () => void
}

export function TaskCreateControl({ members, onCreated }: TaskCreateControlProps) {
  const closeCreateTask = useTaskUiStore((state) => state.closeCreateTask)
  const isCreateTaskOpen = useTaskUiStore((state) => state.isCreateTaskOpen)
  const openCreateTask = useTaskUiStore((state) => state.openCreateTask)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const navigate = useNavigate()

  const handleSubmit = async (...[input]: Parameters<typeof createTask>) => {
    const task = await createTask(input)
    closeCreateTask()
    onCreated()
    navigate(appRoutes.taskDetails(task.id))
  }

  const form = <TaskForm members={members} onCancel={closeCreateTask} onSubmit={handleSubmit} />

  return (
    <>
      <Button onClick={openCreateTask}>
        <Plus aria-hidden="true" size={17} />
        Add New Task
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

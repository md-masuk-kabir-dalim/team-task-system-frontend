import {
  Check,
  CircleCheck,
  Download,
  EllipsisVertical,
  FileSpreadsheet,
  FileText,
  Image,
  Link2,
  Pencil,
  Send,
  Share2,
} from 'lucide-react'
import { useEffect } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/button.tsx'
import { Checkbox } from '../../../components/ui/checkbox.tsx'
import { Dialog } from '../../../components/ui/dialog.tsx'
import { Input } from '../../../components/ui/input.tsx'
import { Select } from '../../../components/ui/select.tsx'
import { Textarea } from '../../../components/ui/textarea.tsx'
import { emptyTaskDetailsViewState, useTaskDetailsStore } from '../../../stores/task-details-store.ts'
import type { UpdateTaskInput } from '../api/task-service.ts'
import type { Task, TaskPriority, TaskStatus, TeamMember } from '../types/task-types.ts'
import { isTaskOverdue } from '../utils/task-date-utils.ts'
import { TaskAssignee } from './task-assignee.tsx'
import { TaskPriorityBadge } from './task-priority-badge.tsx'
import { TaskStatusBadge } from './task-status-badge.tsx'

interface TaskDetailsProps {
  members: readonly TeamMember[]
  onStatusChange: (status: TaskStatus) => Promise<void>
  onTaskUpdate: (input: UpdateTaskInput) => Promise<void>
  task: Task
}

const attachments = [
  { icon: FileText, name: 'task-brief.pdf', size: '2.4 MB', tone: 'pdf' },
  { icon: FileSpreadsheet, name: 'project-forecast.xlsx', size: '860 KB', tone: 'spreadsheet' },
  { icon: Image, name: 'dashboard-mockup.png', size: '1.1 MB', tone: 'image' },
  { icon: FileText, name: 'scope-notes.docx', size: '320 KB', tone: 'document' },
] as const

const statusOptions: readonly { label: string; value: TaskStatus }[] = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'In review', value: 'blocked' },
  { label: 'Completed', value: 'done' },
]

const priorityOptions: readonly { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function formatFullDate(date: string | null) {
  if (!date) {
    return 'No date'
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function downloadFile(name: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.download = name
  link.href = url
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  globalThis.setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const input = document.createElement('textarea')
  input.value = text
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.append(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

export function TaskDetails({ members, onStatusChange, onTaskUpdate, task }: TaskDetailsProps) {
  const viewState = useTaskDetailsStore((state) => state.byTaskId[task.id]) ?? emptyTaskDetailsViewState
  const addActivity = useTaskDetailsStore((state) => state.addActivity)
  const addSubtask = useTaskDetailsStore((state) => state.addSubtask)
  const closeActionMenu = useTaskDetailsStore((state) => state.closeActionMenu)
  const closeEdit = useTaskDetailsStore((state) => state.closeEdit)
  const ensureTask = useTaskDetailsStore((state) => state.ensureTask)
  const openEdit = useTaskDetailsStore((state) => state.openEdit)
  const postComment = useTaskDetailsStore((state) => state.postComment)
  const setActionError = useTaskDetailsStore((state) => state.setActionError)
  const setActiveTab = useTaskDetailsStore((state) => state.setActiveTab)
  const setComment = useTaskDetailsStore((state) => state.setComment)
  const setEditError = useTaskDetailsStore((state) => state.setEditError)
  const setEditValues = useTaskDetailsStore((state) => state.setEditValues)
  const setFeedback = useTaskDetailsStore((state) => state.setFeedback)
  const setMarkingComplete = useTaskDetailsStore((state) => state.setMarkingComplete)
  const setSavingEdit = useTaskDetailsStore((state) => state.setSavingEdit)
  const setUpdatingStatus = useTaskDetailsStore((state) => state.setUpdatingStatus)
  const toggleActionMenu = useTaskDetailsStore((state) => state.toggleActionMenu)
  const toggleSubtask = useTaskDetailsStore((state) => state.toggleSubtask)
  const assignee = task.assigneeId ? members.find((member) => member.id === task.assigneeId) : undefined
  const isOverdue = isTaskOverdue(task)
  const completedSubtasks = viewState.subtasks.filter((subtask) => subtask.completed).length
  const progress = Math.round((completedSubtasks / viewState.subtasks.length) * 100)
  const taskUrl = `${window.location.origin}/tasks/${task.id}`
  const assigneeOptions = [
    { label: 'Unassigned', value: 'unassigned' },
    ...members.map((member) => ({ label: member.name, value: member.id })),
  ]

  useEffect(() => {
    ensureTask(task)
  }, [ensureTask, task])

  const setStatus = async (status: TaskStatus) => {
    if (status === task.status) {
      closeActionMenu(task.id)
      return
    }

    setActionError(task.id, null)
    setUpdatingStatus(task.id, true)

    try {
      await onStatusChange(status)
      const statusLabel = statusOptions.find((option) => option.value === status)?.label ?? status
      setFeedback(task.id, `Task moved to ${statusLabel}.`)
      addActivity(task.id, `Moved the task to ${statusLabel}`)
      closeActionMenu(task.id)
    } catch (error: unknown) {
      setActionError(task.id, error instanceof Error ? error.message : 'Unable to update the task status.')
    } finally {
      setUpdatingStatus(task.id, false)
    }
  }

  const markComplete = async () => {
    if (task.status === 'done') {
      return
    }

    setMarkingComplete(task.id, true)
    await setStatus('done')
    setMarkingComplete(task.id, false)
  }

  const handleCopyLink = async () => {
    try {
      await copyText(taskUrl)
      setFeedback(task.id, 'Task link copied to your clipboard.')
    } catch {
      setActionError(task.id, 'Unable to copy the task link. Please copy it from the address bar.')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const shareData = task.description
          ? { text: task.description, title: task.title, url: taskUrl }
          : { title: task.title, url: taskUrl }
        await navigator.share(shareData)
        setFeedback(task.id, 'Task share sheet opened.')
      } else {
        await handleCopyLink()
      }
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setActionError(task.id, 'Unable to share this task right now.')
      }
    }
  }

  const downloadAttachment = (attachment: typeof attachments[number]) => {
    downloadFile(attachment.name, `${attachment.name}\n\nAttachment for: ${task.title}\n\nThis demo file was downloaded from the task details page.`)
    setFeedback(task.id, `${attachment.name} downloaded.`)
  }

  const downloadAllAttachments = () => {
    attachments.forEach(downloadAttachment)
    setFeedback(task.id, `${attachments.length} attachments downloaded.`)
  }

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    postComment(task.id)
  }

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = viewState.editValues.title.trim()

    if (title.length < 3) {
      setEditError(task.id, 'Enter a task title with at least 3 characters.')
      return
    }

    setEditError(task.id, null)
    setSavingEdit(task.id, true)

    try {
      await onTaskUpdate({
        assigneeId: viewState.editValues.assigneeId === 'unassigned' ? null : viewState.editValues.assigneeId,
        description: viewState.editValues.description.trim() || null,
        dueDate: viewState.editValues.dueDate || null,
        priority: viewState.editValues.priority,
        title,
      })
      closeEdit(task.id)
      setFeedback(task.id, 'Task details saved.')
      addActivity(task.id, 'Updated the task details')
    } catch (error: unknown) {
      setEditError(task.id, error instanceof Error ? error.message : 'Unable to save task details.')
    } finally {
      setSavingEdit(task.id, false)
    }
  }

  return (
    <div className="task-details-layout">
      <div className="task-details-layout__main">
        {viewState.feedback ? <p aria-live="polite" className="task-details__feedback">{viewState.feedback}</p> : null}
        {viewState.actionError ? <p className="task-details__error" role="alert">{viewState.actionError}</p> : null}
        <article className="task-details task-details--overview">
          <header className="task-details__heading">
            <div>
              <TaskStatusBadge status={task.status} />
              <h1>{task.title}</h1>
              <p>{assignee?.name ?? 'Unassigned'} · Created {formatTimestamp(task.createdAt)}</p>
            </div>
            <div aria-label="Task actions" className="task-details__actions">
              <button aria-label="Edit task" onClick={() => openEdit(task)} type="button"><Pencil aria-hidden="true" size={15} /></button>
              <button aria-label="Copy task link" onClick={() => void handleCopyLink()} type="button"><Link2 aria-hidden="true" size={15} /></button>
              <button aria-label="Share task" onClick={() => void handleShare()} type="button"><Share2 aria-hidden="true" size={15} /></button>
              <div className="task-details__action-menu">
                <button aria-controls="task-status-actions" aria-expanded={viewState.isActionMenuOpen} aria-label="More task actions" onClick={() => toggleActionMenu(task.id)} type="button"><EllipsisVertical aria-hidden="true" size={16} /></button>
                {viewState.isActionMenuOpen ? (
                  <div aria-label="Task status actions" className="task-details__action-menu-panel" id="task-status-actions" role="menu">
                    <span>Move task to</span>
                    {statusOptions.map((option) => (
                      <button disabled={viewState.isUpdatingStatus || option.value === task.status} key={option.value} onClick={() => void setStatus(option.value)} role="menuitem" type="button">
                        {option.value === task.status ? <Check aria-hidden="true" size={13} /> : null}
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <section aria-labelledby="task-attachments" className="task-details__attachments">
            <header>
              <h2 id="task-attachments">Attachments <span>({attachments.length})</span></h2>
              <button onClick={downloadAllAttachments} type="button"><Download aria-hidden="true" size={13} />Download all</button>
            </header>
            <div className="task-details__attachment-grid">
              {attachments.map((attachment) => {
                const Icon = attachment.icon

                return (
                  <button aria-label={`Download ${attachment.name}`} className="task-details__attachment" key={attachment.name} onClick={() => downloadAttachment(attachment)} type="button">
                    <span className={`task-details__attachment-icon task-details__attachment-icon--${attachment.tone}`}><Icon aria-hidden="true" size={16} /></span>
                    <span><strong>{attachment.name}</strong><small>{attachment.size}</small></span>
                    <Download aria-hidden="true" size={13} />
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="task-description" className="task-details__description">
            <h2 id="task-description">Description</h2>
            <p>{task.description ?? 'No description was added to this task.'}</p>
            <p>Keep the work visible, document decisions, and share clear progress with everyone involved.</p>
          </section>
        </article>

        <section aria-label="Task details content" className="task-details-subtasks">
          <nav aria-label="Task detail sections" className="task-details-subtasks__tabs" role="tablist">
            {(['subtasks', 'comments', 'activity'] as const).map((tab) => (
              <button aria-selected={viewState.activeTab === tab} key={tab} onClick={() => setActiveTab(task.id, tab)} role="tab" type="button">
                {tab === 'subtasks' ? 'Subtasks' : tab === 'comments' ? 'Comments' : 'Activity'}
              </button>
            ))}
          </nav>

          {viewState.activeTab === 'subtasks' ? (
            <>
              <div className="task-details-subtasks__heading">
                <h2>Task checklist</h2>
                <span>{completedSubtasks}/{viewState.subtasks.length} completed</span>
              </div>
              <div aria-label={`${progress}% complete`} className="task-details-subtasks__progress"><i style={{ width: `${progress}%` }} /></div>
              <div className="task-details-subtasks__items">
                {viewState.subtasks.map((subtask) => (
                  <Checkbox
                    checked={subtask.completed}
                    id={subtask.id}
                    key={subtask.id}
                    label={subtask.label}
                    onChange={() => toggleSubtask(task.id, subtask.id)}
                  />
                ))}
              </div>
              <button className="task-details-subtasks__add" onClick={() => addSubtask(task.id)} type="button">+ Add subtask</button>
            </>
          ) : null}

          {viewState.activeTab === 'comments' ? (
            <section aria-label="Task comments" className="task-details-comments">
              <form onSubmit={submitComment}>
                <Textarea
                  label="Add a comment"
                  onChange={(event) => setComment(task.id, event.target.value)}
                  placeholder="Share an update or ask a question…"
                  value={viewState.comment}
                />
                <Button disabled={!viewState.comment.trim()} size="sm" type="submit"><Send aria-hidden="true" size={14} />Post comment</Button>
              </form>
              {viewState.comments.length ? (
                <ul>
                  {viewState.comments.map((entry, index) => <li key={`${entry}-${index}`}><strong>Alex Morgan</strong><p>{entry}</p></li>)}
                </ul>
              ) : <p className="task-details-subtasks__empty">No comments yet. Start the conversation.</p>}
            </section>
          ) : null}

          {viewState.activeTab === 'activity' ? (
            <section aria-label="Task activity" className="task-details-activity">
              <ul>
                {viewState.activity.map((entry) => <li key={entry.id}>{entry.label}</li>)}
              </ul>
            </section>
          ) : null}
        </section>
      </div>

      <aside className="task-details-side-panel">
        <h2>Details</h2>
        <dl>
          <div><dt>Status</dt><dd><TaskStatusBadge status={task.status} /></dd></div>
          <div><dt>Priority</dt><dd><TaskPriorityBadge priority={task.priority} /></dd></div>
          <div><dt>Assignee</dt><dd><TaskAssignee assignee={assignee} /></dd></div>
          <div><dt>Start date</dt><dd>{formatFullDate(task.createdAt.slice(0, 10))}</dd></div>
          <div><dt>Due date</dt><dd className={isOverdue ? 'task-details__overdue' : undefined}>{formatFullDate(task.dueDate)}</dd></div>
          <div><dt>Tags</dt><dd><span className="task-details-side-panel__tag">Sales</span><span className="task-details-side-panel__tag">Finance</span></dd></div>
        </dl>
        <div className="task-details-side-panel__progress">
          <span><span>Overall progress</span><strong>{progress}%</strong></span>
          <span className="task-details-side-panel__progress-track"><i aria-hidden="true" style={{ width: `${progress}%` }} /></span>
        </div>
        <Button className="task-details-side-panel__complete" disabled={task.status === 'done' || viewState.isUpdatingStatus} loading={viewState.isMarkingComplete} onClick={() => void markComplete()}>
          <CircleCheck aria-hidden="true" size={15} />
          {task.status === 'done' ? 'Completed' : 'Mark complete'}
        </Button>
      </aside>

      <Dialog
        description="Update the task information shared with your workspace."
        onClose={() => closeEdit(task.id)}
        open={viewState.isEditDialogOpen}
        title="Edit task"
      >
        <form className="task-edit-form" noValidate onSubmit={(event) => void submitEdit(event)}>
          {viewState.editError ? <p className="task-details__error" role="alert">{viewState.editError}</p> : null}
          <Input
            label="Task title"
            onChange={(event) => setEditValues(task.id, { title: event.target.value })}
            required
            value={viewState.editValues.title}
          />
          <Textarea
            label="Description"
            onChange={(event) => setEditValues(task.id, { description: event.target.value })}
            value={viewState.editValues.description}
          />
          <div className="task-edit-form__grid">
            <Select
              label="Priority"
              onChange={(event) => setEditValues(task.id, { priority: event.target.value as TaskPriority })}
              options={priorityOptions}
              value={viewState.editValues.priority}
            />
            <Select
              label="Assignee"
              onChange={(event) => setEditValues(task.id, { assigneeId: event.target.value })}
              options={assigneeOptions}
              value={viewState.editValues.assigneeId}
            />
            <Input
              label="Due date"
              onChange={(event) => setEditValues(task.id, { dueDate: event.target.value })}
              type="date"
              value={viewState.editValues.dueDate}
            />
          </div>
          <div className="task-edit-form__actions">
            <Button disabled={viewState.isSavingEdit} onClick={() => closeEdit(task.id)} type="button" variant="ghost">Cancel</Button>
            <Button loading={viewState.isSavingEdit} type="submit">Save changes</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

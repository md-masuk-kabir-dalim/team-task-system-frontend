import { CalendarRange, Upload } from 'lucide-react'
import { useMemo, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { Button } from '../../components/ui/button.tsx'
import { useCalendarStore } from '../../stores/calendar-store.ts'
import { useUiStore } from '../../stores/ui-store.ts'
import { defaultTaskListQuery } from '../tasks/api/task-service.ts'
import { TaskCreateControl } from '../tasks/components/task-create-control.tsx'
import { useTaskList } from '../tasks/hooks/use-task-list.ts'
import { CalendarSidebar } from './components/calendar-sidebar.tsx'
import { CalendarToolbar } from './components/calendar-toolbar.tsx'
import { TaskCalendarGrid } from './components/task-calendar-grid.tsx'
import { formatDayHeading, formatMonthTitle, formatWeekRange, getVisibleDays, parseDateKey } from './utils/calendar-utils.ts'

export function CalendarPage() {
  const calendarQuery = useMemo(() => ({
    ...defaultTaskListQuery,
    pageSize: 100,
    sort: { direction: 'asc' as const, field: 'dueDate' as const },
  }), [])
  const { error, isInitialLoading, result, retry } = useTaskList(calendarQuery)
  const activeCategories = useCalendarStore((state) => state.activeCategories)
  const goToToday = useCalendarStore((state) => state.goToToday)
  const importNotice = useCalendarStore((state) => state.importNotice)
  const moveDate = useCalendarStore((state) => state.moveDate)
  const selectedDateKey = useCalendarStore((state) => state.selectedDate)
  const setImportNotice = useCalendarStore((state) => state.setImportNotice)
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate)
  const setView = useCalendarStore((state) => state.setView)
  const toggleCategory = useCalendarStore((state) => state.toggleCategory)
  const view = useCalendarStore((state) => state.view)
  const openCreateTask = useUiStore((state) => state.openCreateTask)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedDate = parseDateKey(selectedDateKey)
  const days = getVisibleDays(view, selectedDate)
  const tasks = result?.items ?? []
  const members = result?.members ?? []
  const rangeLabel = view === 'month' ? formatMonthTitle(selectedDate) : view === 'day' ? formatDayHeading(selectedDate) : formatWeekRange(selectedDate)

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? [])
    setImportNotice(file ? `${file.name} is ready to map to calendar tasks.` : null)
    event.target.value = ''
  }

  return (
    <section className="page calendar-page">
      <header className="calendar-page__intro">
        <div>
          <span><CalendarRange aria-hidden="true" size={15} />Workspace calendar</span>
          <h1>Project Management Calendar</h1>
          <p>Plan and review tasks across your team&apos;s delivery schedule.</p>
        </div>
        <div className="calendar-page__actions">
          <input accept=".csv,.ics" className="sr-only" onChange={handleImport} ref={fileInputRef} type="file" />
          <Button onClick={() => fileInputRef.current?.click()} variant="secondary"><Upload aria-hidden="true" size={16} />Import</Button>
          {result ? <TaskCreateControl label="Create task" members={result.members} /> : null}
        </div>
      </header>

      {importNotice ? <p aria-live="polite" className="calendar-page__notice">{importNotice}</p> : null}
      {isInitialLoading ? <div aria-live="polite" className="calendar-page__loading">Loading your task calendar…</div> : null}
      {error && !result ? <ErrorState description="The task calendar could not be loaded. Please retry." onRetry={retry} title="Unable to load calendar" /> : null}

      {result ? (
        <div className="calendar-page__workspace">
          <CalendarSidebar
            activeCategories={activeCategories}
            onAddTask={openCreateTask}
            onSelectDate={setSelectedDate}
            onToggleCategory={toggleCategory}
            selectedDate={selectedDate}
            tasks={tasks}
          />
          <section aria-label="Task calendar" className="calendar-page__calendar">
            <CalendarToolbar onMoveDate={moveDate} onToday={goToToday} onViewChange={setView} rangeLabel={rangeLabel} view={view} />
            <TaskCalendarGrid activeCategories={activeCategories} days={days} members={members} selectedDate={selectedDate} tasks={tasks} view={view} />
          </section>
        </div>
      ) : null}
    </section>
  )
}

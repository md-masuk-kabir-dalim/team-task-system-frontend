import { ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-react'
import { Button } from '../../components/ui/button.tsx'
import { useTeamDirectoryStore } from '../../stores/team-directory-store.ts'
import { TeamDirectoryBoard } from './components/team-directory-board.tsx'
import { TeamDirectoryList } from './components/team-directory-list.tsx'
import { TeamDirectorySummary } from './components/team-directory-summary.tsx'
import { TeamDirectoryToolbar } from './components/team-directory-toolbar.tsx'
import { TeamMemberCreateForm } from './components/team-member-create-form.tsx'
import { TeamMemberInspector } from './components/team-member-inspector.tsx'
import { useTeamDirectoryQueryParams } from './hooks/use-team-directory-query-params.ts'
import { filterEmployees, getEmployeeStats, toEmployeeCsv } from './utils/team-directory-utils.ts'

const pageSize = 6

function downloadEmployeeCsv(csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.download = 'hr-project-employees.csv'
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

export function TeamPage() {
  const createDraft = useTeamDirectoryStore((state) => state.createDraft)
  const createEmployee = useTeamDirectoryStore((state) => state.createEmployee)
  const employees = useTeamDirectoryStore((state) => state.employees)
  const isCreateFormOpen = useTeamDirectoryStore((state) => state.isCreateFormOpen)
  const openCreateForm = useTeamDirectoryStore((state) => state.openCreateForm)
  const closeCreateForm = useTeamDirectoryStore((state) => state.closeCreateForm)
  const selectedEmployeeId = useTeamDirectoryStore((state) => state.selectedEmployeeId)
  const selectedEmployeeIds = useTeamDirectoryStore((state) => state.selectedEmployeeIds)
  const setSelectedEmployee = useTeamDirectoryStore((state) => state.setSelectedEmployee)
  const toggleEmployeeSelection = useTeamDirectoryStore((state) => state.toggleEmployeeSelection)
  const toggleVisibleSelection = useTeamDirectoryStore((state) => state.toggleVisibleSelection)
  const updateCreateDraft = useTeamDirectoryStore((state) => state.updateCreateDraft)
  const { query, setDepartment, setPage, setSearch, setView } = useTeamDirectoryQueryParams()
  const { department, page, search, view } = query

  const filteredEmployees = filterEmployees(employees, search, department)
  const stats = getEmployeeStats(employees)
  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visibleEmployees = filteredEmployees.slice((safePage - 1) * pageSize, safePage * pageSize)
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId)

  return (
    <section className="page page--team-directory">
      <header className="team-directory-header">
        <div>
          <h1>Team Management</h1>
          <p>Manage your team members and their information.</p>
        </div>
        <div className="team-directory-header__actions">
          <Button onClick={() => downloadEmployeeCsv(toEmployeeCsv(filteredEmployees))} size="sm" variant="outline">
            <Upload aria-hidden="true" size={15} />Export
          </Button>
          <Button onClick={() => openCreateForm()} size="sm">
            <Plus aria-hidden="true" size={18} />Add New Employee
          </Button>
        </div>
      </header>

      {isCreateFormOpen ? (
        <TeamMemberCreateForm
          draft={createDraft}
          onCancel={closeCreateForm}
          onSubmit={createEmployee}
          onUpdate={updateCreateDraft}
        />
      ) : null}

      <TeamDirectorySummary {...stats} />
      <TeamDirectoryToolbar
        department={department}
        onDepartmentChange={setDepartment}
        onSearchChange={setSearch}
        onViewChange={setView}
        search={search}
        view={view}
      />

      {selectedEmployeeIds.length ? <p className="team-directory-selection">{selectedEmployeeIds.length} employee{selectedEmployeeIds.length === 1 ? '' : 's'} selected</p> : null}

      {view === 'board' ? (
        <TeamDirectoryBoard
          employees={filteredEmployees}
          onAddEmployee={openCreateForm}
          onOpenEmployee={setSelectedEmployee}
        />
      ) : (
        <>
          <TeamDirectoryList
            employees={visibleEmployees}
            onOpenEmployee={setSelectedEmployee}
            onToggleEmployee={toggleEmployeeSelection}
            onToggleVisible={() => toggleVisibleSelection(visibleEmployees.map((employee) => employee.id))}
            selectedEmployeeIds={selectedEmployeeIds}
          />
          <nav aria-label="Employee list pages" className="team-directory-pagination">
            <Button aria-label="Previous employee page" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} size="icon" variant="outline"><ChevronLeft aria-hidden="true" size={16} /></Button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <button aria-current={item === safePage ? 'page' : undefined} key={item} onClick={() => setPage(item)} type="button">{item}</button>
            ))}
            <Button aria-label="Next employee page" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)} size="icon" variant="outline"><ChevronRight aria-hidden="true" size={16} /></Button>
          </nav>
        </>
      )}

      {selectedEmployee ? <TeamMemberInspector employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} /> : null}
    </section>
  )
}

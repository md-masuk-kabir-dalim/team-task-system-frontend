import { LayoutGrid, List, Search } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { employeeDepartments, type EmployeeDepartment, type TeamDirectoryView } from '../types/team-directory-types.ts'

interface TeamDirectoryToolbarProps {
  department: EmployeeDepartment | 'all'
  onDepartmentChange: (department: EmployeeDepartment | 'all') => void
  onSearchChange: (search: string) => void
  onViewChange: (view: TeamDirectoryView) => void
  search: string
  view: TeamDirectoryView
}

export function TeamDirectoryToolbar({
  department,
  onDepartmentChange,
  onSearchChange,
  onViewChange,
  search,
  view,
}: TeamDirectoryToolbarProps) {
  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onDepartmentChange(event.target.value as EmployeeDepartment | 'all')
  }

  return (
    <section className="team-directory-toolbar">
      <div aria-label="Directory view" className="team-directory-toolbar__views" role="tablist">
        <button aria-selected={view === 'board'} onClick={() => onViewChange('board')} role="tab" type="button">
          <LayoutGrid aria-hidden="true" size={14} />Board
        </button>
        <button aria-selected={view === 'list'} onClick={() => onViewChange('list')} role="tab" type="button">
          <List aria-hidden="true" size={14} />List
        </button>
      </div>

      <div className="team-directory-toolbar__filters">
        <label className="team-directory-toolbar__search">
          <span className="sr-only">Search employees</span>
          <Search aria-hidden="true" size={15} />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employee..."
            type="search"
            value={search}
          />
        </label>
        <label className="team-directory-toolbar__department">
          <span className="sr-only">Filter by department</span>
          <select onChange={handleDepartmentChange} value={department}>
            <option value="all">All departments</option>
            {employeeDepartments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
    </section>
  )
}

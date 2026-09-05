import { ArrowLeft, BriefcaseBusiness, Download, FileText, Mail, MessageCircle, Pencil, Phone, Save, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/shared/components/feedback/empty-state.tsx'
import { Avatar } from '@/shared/components/ui/avatar.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { appRoutes } from '@/app/navigation.ts'
import { useTeamDirectoryStore } from './model/team-directory-store.ts'
import { employeeDepartments, employeeStatuses, type DirectoryEmployee, type EmployeeProfileUpdate } from './types/team-directory-types.ts'
import { createEmployeeDocumentContent, getEmployeeDetails, type EmployeeDocument } from './utils/employee-details-utils.ts'
import { formatEmployeeDate } from './utils/team-directory-utils.ts'

type EmployeeEditValues = EmployeeProfileUpdate

function getStatusLabel(status: DirectoryEmployee['status']) {
  return status === 'on-leave' ? 'On leave' : status.charAt(0).toUpperCase() + status.slice(1)
}

function createEditValues(employee: DirectoryEmployee): EmployeeEditValues {
  return {
    department: employee.department,
    designation: employee.designation,
    phone: employee.phone,
    status: employee.status,
  }
}

function downloadDocument(employee: DirectoryEmployee, employeeDocument: EmployeeDocument) {
  const blob = new Blob([createEmployeeDocumentContent(employee, employeeDocument)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.download = `${employee.id.toLowerCase()}-${employeeDocument.fileName}`
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

function DetailField({ label, value }: { label: string; value: string }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>
}

interface ProfileEditorProps {
  employee: DirectoryEmployee
  onCancel: () => void
  onSave: (values: EmployeeEditValues) => void
}

function ProfileEditor({ employee, onCancel, onSave }: ProfileEditorProps) {
  const [values, setValues] = useState<EmployeeEditValues>(() => createEditValues(employee))

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(values)
  }

  return (
    <form aria-label="Edit employee" className="employee-details__editor" onSubmit={submit}>
      <label><span>Designation</span><input onChange={(event) => setValues((current) => ({ ...current, designation: event.target.value }))} required value={values.designation} /></label>
      <label><span>Phone</span><input onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} required value={values.phone} /></label>
      <label><span>Department</span><select onChange={(event) => setValues((current) => ({ ...current, department: event.target.value as EmployeeEditValues['department'] }))} value={values.department}>{employeeDepartments.map((department) => <option key={department} value={department}>{department}</option>)}</select></label>
      <label><span>Status</span><select onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as EmployeeEditValues['status'] }))} value={values.status}>{employeeStatuses.map((status) => <option key={status} value={status}>{getStatusLabel(status)}</option>)}</select></label>
      <footer>
        <Button onClick={onCancel} size="sm" variant="secondary"><X aria-hidden="true" size={15} />Cancel</Button>
        <Button size="sm" type="submit"><Save aria-hidden="true" size={15} />Save changes</Button>
      </footer>
    </form>
  )
}

export function EmployeeDetailsPage() {
  const { employeeId } = useParams()
  const employee = useTeamDirectoryStore((state) => state.employees.find((item) => item.id === employeeId))
  const updateEmployee = useTeamDirectoryStore((state) => state.updateEmployee)
  const [isEditing, setIsEditing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  if (!employee) {
    return (
      <section className="page page--employee-details">
        <EmptyState
          description="This employee may have been removed or the profile link is incomplete."
          icon={<UserRound aria-hidden="true" size={26} />}
          primaryAction={<Link className="button button--secondary button--md" to={appRoutes.team}><ArrowLeft aria-hidden="true" size={16} />Back to Team</Link>}
          title="Employee not found"
        />
      </section>
    )
  }

  const details = getEmployeeDetails(employee)

  const handleSave = (values: EmployeeEditValues) => {
    updateEmployee(employee.id, values)
    setIsEditing(false)
    setFeedback('Employee information saved.')
  }

  return (
    <section className="page page--employee-details">
      <nav aria-label="Breadcrumb" className="employee-details__breadcrumb">
        <Link to={appRoutes.team}><ArrowLeft aria-hidden="true" size={15} />Employees</Link>
        <span aria-hidden="true">/</span>
        <strong>Employee Details</strong>
      </nav>

      <div className="employee-details__layout">
        <aside className="employee-details__sidebar">
          <section className="employee-details__profile">
            <Avatar name={employee.name} size="lg" {...(employee.avatarUrl ? { src: employee.avatarUrl } : {})} />
            <h1>{employee.name}</h1>
            <p>{employee.designation}</p>
            <span className={`employee-status employee-status--${employee.status}`}><span aria-hidden="true" />{getStatusLabel(employee.status)}</span>
            <div className="employee-details__actions">
              <Button onClick={() => setIsEditing((open) => !open)} size="sm"><Pencil aria-hidden="true" size={15} />{isEditing ? 'Close edit' : 'Edit'}</Button>
              <a href={`mailto:${employee.email}`}><MessageCircle aria-hidden="true" size={15} />Message</a>
            </div>
            {isEditing ? <ProfileEditor employee={employee} onCancel={() => setIsEditing(false)} onSave={handleSave} /> : null}
          </section>

          <section className="employee-details__contact">
            <h2>Contact</h2>
            <dl>
              <DetailField label="Email" value={employee.email} />
              <DetailField label="Phone" value={employee.phone} />
              <DetailField label="Location" value={details.work.workLocation} />
              <DetailField label="Department" value={employee.department} />
            </dl>
            <div className="employee-details__contact-actions">
              <a href={`mailto:${employee.email}`}><Mail aria-hidden="true" size={15} />Email</a>
              <a href={`tel:${employee.phone.replaceAll(' ', '')}`}><Phone aria-hidden="true" size={15} />Call</a>
            </div>
          </section>
        </aside>

        <div className="employee-details__content">
          <section className="employee-details__section">
            <header><UserRound aria-hidden="true" size={16} /><h2>Personal Information</h2></header>
            <dl className="employee-details__grid">
              <DetailField label="Full name" value={employee.name} />
              <DetailField label="Date of birth" value={details.personal.dateOfBirth} />
              <DetailField label="Gender" value={details.personal.gender} />
              <DetailField label="Marital status" value={details.personal.maritalStatus} />
              <DetailField label="Nationality" value={details.personal.nationality} />
              <DetailField label="Address" value={details.personal.address} />
            </dl>
          </section>

          <section className="employee-details__section">
            <header><BriefcaseBusiness aria-hidden="true" size={16} /><h2>Work Information</h2></header>
            <dl className="employee-details__grid">
              <DetailField label="Employee ID" value={`#${employee.id}`} />
              <DetailField label="Department" value={employee.department} />
              <DetailField label="Designation" value={employee.designation} />
              <DetailField label="Join date" value={formatEmployeeDate(employee.joinDate)} />
              <DetailField label="Employment type" value={details.work.employmentType} />
              <DetailField label="Reporting to" value={details.work.reportingTo} />
              <DetailField label="Work location" value={details.work.workLocation} />
              <DetailField label="Shift" value={details.work.shift} />
            </dl>
          </section>

          <section className="employee-details__section employee-details__documents">
            <header><FileText aria-hidden="true" size={16} /><h2>Documents</h2></header>
            <ul>
              {details.documents.map((document) => (
                <li key={document.fileName}>
                  <span className={`employee-details__document-icon employee-details__document-icon--${document.type}`}><FileText aria-hidden="true" size={17} /></span>
                  <span><strong>{document.fileName}</strong><small>{document.description}</small></span>
                  <Button aria-label={`Download ${document.fileName}`} onClick={() => { downloadDocument(employee, document); setFeedback(`${document.fileName} downloaded.`) }} size="icon" variant="ghost"><Download aria-hidden="true" size={16} /></Button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {feedback ? <p aria-live="polite" className="employee-details__feedback">{feedback}</p> : null}
    </section>
  )
}

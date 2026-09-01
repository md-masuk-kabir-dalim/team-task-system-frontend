import { describe, expect, it } from 'vitest'
import { teamDirectoryFixtures } from '../data/team-directory-fixtures.ts'
import { createEmployeeDocumentContent, getEmployeeDetails } from './employee-details-utils.ts'

describe('employee detail utilities', () => {
  it('derives a complete detail profile for directory employees', () => {
    const employee = teamDirectoryFixtures[1]

    if (!employee) {
      throw new Error('Expected an employee fixture.')
    }

    const details = getEmployeeDetails(employee)

    expect(details.personal.address).toBeTruthy()
    expect(details.work.reportingTo).toBe('Alex Morgan')
    expect(details.documents).toHaveLength(2)
  })

  it('creates an honest text document for download', () => {
    const employee = teamDirectoryFixtures[0]

    if (!employee) {
      throw new Error('Expected an employee fixture.')
    }

    const document = getEmployeeDetails(employee).documents[0]

    if (!document) {
      throw new Error('Expected an employee document fixture.')
    }

    expect(createEmployeeDocumentContent(employee, document)).toContain('Employee: Alex Morgan')
  })
})

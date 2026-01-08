import { describe, it, expect } from 'vitest'
import { formatSyncReportText, formatSyncReportJson } from '../lib/report'
import type { SyncReport } from '@/types'

describe('formatSyncReportText', () => {
  it('formats successful sync', () => {
    const report: SyncReport = {
      success: true,
      candidateId: '123456',
      email: 'john@example.com',
      jobId: '789',
      candidate: 'success',
      jobApplication: 'success',
      answers: [
        { field: '3165763', value: 'Yes', status: 'success' },
        { field: '3165766', value: '5', status: 'success' },
      ],
      customFields: [
        { field: 'source', value: 'Instagram', status: 'success' },
      ],
      notes: 'success',
    }

    const text = formatSyncReportText(report)

    expect(text).toContain('Sync Report: john@example.com')
    expect(text).toContain('Status: Success')
    expect(text).toContain('Candidate ID: 123456')
    expect(text).toContain('Job ID: 789')
    expect(text).toContain('Candidate: Success')
    expect(text).toContain('Job Application: Success')
    expect(text).toContain('Answers (2/2):')
    expect(text).toContain('[3165763] Yes - Success')
    expect(text).toContain('Custom Fields (1/1):')
    expect(text).toContain('[source] Instagram - Success')
    expect(text).toContain('Notes: Success')
  })

  it('formats partial failure', () => {
    const report: SyncReport = {
      success: true,
      candidateId: '123456',
      email: 'john@example.com',
      jobId: '789',
      candidate: 'success',
      jobApplication: 'failed',
      answers: [
        { field: '3165763', value: 'Yes', status: 'success' },
        { field: '9999999', value: 'Test', status: 'failed', error: 'Question not found' },
      ],
      customFields: [],
      notes: null,
    }

    const text = formatSyncReportText(report)

    expect(text).toContain('Answers (1/2):')
    expect(text).toContain('[9999999] Test - Failed (Question not found)')
    expect(text).not.toContain('Notes:')
  })

  it('formats complete failure', () => {
    const report: SyncReport = {
      success: false,
      email: 'john@example.com',
      jobId: '789',
      candidate: 'failed',
      jobApplication: 'skipped',
      answers: [],
      customFields: [],
      notes: null,
      error: 'API error: 401 Unauthorized',
    }

    const text = formatSyncReportText(report)

    expect(text).toContain('Status: Failed')
    expect(text).toContain('Error: API error: 401 Unauthorized')
    expect(text).not.toContain('Candidate ID:')
  })

  it('formats upsert scenarios with updated and already_exists statuses', () => {
    const report: SyncReport = {
      success: true,
      candidateId: '123456',
      email: 'john@example.com',
      jobId: '789',
      candidate: 'success',
      jobApplication: 'already_exists',
      answers: [
        { field: '3165763', value: 'Yes', status: 'updated' },
        { field: '3165766', value: '5', status: 'success' },
      ],
      customFields: [
        { field: 'source', value: 'Instagram', status: 'updated' },
      ],
      notes: 'already_exists',
    }

    const text = formatSyncReportText(report)

    expect(text).toContain('Job Application: Already Exists')
    expect(text).toContain('[3165763] Yes - Updated')
    expect(text).toContain('[3165766] 5 - Success')
    expect(text).toContain('[source] Instagram - Updated')
    expect(text).toContain('Notes: Already Exists')
    // Updated and already_exists should count as success
    expect(text).toContain('Answers (2/2):')
    expect(text).toContain('Custom Fields (1/1):')
  })
})

describe('formatSyncReportJson', () => {
  it('returns structured JSON report', () => {
    const report: SyncReport = {
      success: true,
      candidateId: '123456',
      email: 'john@example.com',
      jobId: '789',
      candidate: 'success',
      jobApplication: 'success',
      answers: [
        { field: '3165763', value: 'Yes', status: 'success' },
        { field: '9999999', value: 'Test', status: 'not_found', error: 'Question not found' },
      ],
      customFields: [
        { field: 'source', value: 'Instagram', status: 'success' },
      ],
      notes: 'success',
    }

    const json = formatSyncReportJson(report)

    expect(json.success).toBe(true)
    expect(json.candidateId).toBe('123456')
    expect(json.email).toBe('john@example.com')
    expect(json.jobId).toBe('789')
    expect(json.summary.total).toBe(6) // candidate + job app + 2 answers + 1 custom field + notes
    expect(json.summary.success).toBe(5)
    expect(json.summary.failed).toBe(0)
    expect(json.summary.notFound).toBe(1)
    expect(json.fields).toHaveLength(3)
    expect(json.fields[0]).toEqual({
      type: 'answer',
      field: '3165763',
      value: 'Yes',
      status: 'success',
    })
    expect(json.fields[1]).toEqual({
      type: 'answer',
      field: '9999999',
      value: 'Test',
      status: 'not_found',
      error: 'Question not found',
    })
  })

  it('omits optional fields when not present', () => {
    const report: SyncReport = {
      success: false,
      email: 'john@example.com',
      jobId: '789',
      candidate: 'failed',
      jobApplication: 'skipped',
      answers: [],
      customFields: [],
      notes: null,
      error: 'Failed',
    }

    const json = formatSyncReportJson(report)

    expect(json.candidateId).toBeUndefined()
    expect(json.error).toBe('Failed')
  })

  it('counts updated and already_exists as success in summary', () => {
    const report: SyncReport = {
      success: true,
      candidateId: '123456',
      email: 'john@example.com',
      jobId: '789',
      candidate: 'success',
      jobApplication: 'already_exists',
      answers: [
        { field: '3165763', value: 'Yes', status: 'updated' },
        { field: '3165766', value: '5', status: 'success' },
      ],
      customFields: [
        { field: 'source', value: 'Instagram', status: 'updated' },
      ],
      notes: 'already_exists',
    }

    const json = formatSyncReportJson(report)

    expect(json.success).toBe(true)
    // Total: candidate + job app + 2 answers + 1 custom field + notes = 6
    expect(json.summary.total).toBe(6)
    // All should count as success: candidate(success) + jobApp(already_exists) +
    // answer1(updated) + answer2(success) + customField(updated) + notes(already_exists) = 6
    expect(json.summary.success).toBe(6)
    expect(json.summary.failed).toBe(0)
    expect(json.summary.notFound).toBe(0)
    expect(json.jobApplication).toBe('already_exists')
    expect(json.notes).toBe('already_exists')
  })
})

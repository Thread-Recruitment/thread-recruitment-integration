import type { SyncReport, FieldResult, FieldStatus } from '@/types'

function statusLabel(status: FieldStatus): string {
  switch (status) {
    case 'success':
      return 'Success'
    case 'updated':
      return 'Updated'
    case 'already_exists':
      return 'Already Exists'
    case 'failed':
      return 'Failed'
    case 'skipped':
      return 'Skipped'
    case 'not_found':
      return 'Not Found'
  }
}

function isSuccessStatus(status: FieldStatus): boolean {
  return status === 'success' || status === 'updated' || status === 'already_exists'
}

function formatFieldResult(result: FieldResult): string {
  const base = `  [${result.field}] ${result.value} - ${statusLabel(result.status)}`
  return result.error ? `${base} (${result.error})` : base
}

export function formatSyncReportText(report: SyncReport): string {
  const lines: string[] = []

  lines.push(`Sync Report: ${report.email}`)
  lines.push(`Status: ${report.success ? 'Success' : 'Failed'}`)

  if (report.candidateId) {
    lines.push(`Candidate ID: ${report.candidateId}`)
  }
  lines.push(`Job ID: ${report.jobId}`)

  if (report.error) {
    lines.push(`Error: ${report.error}`)
  }

  lines.push('')
  lines.push(`Candidate: ${statusLabel(report.candidate)}`)
  lines.push(`Job Application: ${statusLabel(report.jobApplication)}`)

  if (report.answers.length > 0) {
    const successCount = report.answers.filter((a) => isSuccessStatus(a.status)).length
    lines.push('')
    lines.push(`Answers (${successCount}/${report.answers.length}):`)
    for (const answer of report.answers) {
      lines.push(formatFieldResult(answer))
    }
  }

  if (report.customFields.length > 0) {
    const successCount = report.customFields.filter((f) => isSuccessStatus(f.status)).length
    lines.push('')
    lines.push(`Custom Fields (${successCount}/${report.customFields.length}):`)
    for (const field of report.customFields) {
      lines.push(formatFieldResult(field))
    }
  }

  if (report.notes !== null) {
    lines.push('')
    lines.push(`Notes: ${statusLabel(report.notes)}`)
  }

  return lines.join('\n')
}

interface JsonReportSummary {
  total: number
  success: number
  failed: number
  notFound: number
}

interface JsonReportField {
  type: 'answer' | 'custom_field'
  field: string
  value: string
  status: FieldStatus
  error?: string
}

interface JsonReport {
  success: boolean
  email: string
  candidateId?: string
  jobId: string
  candidate: FieldStatus
  jobApplication: FieldStatus
  notes: FieldStatus | null
  summary: JsonReportSummary
  fields: JsonReportField[]
  error?: string
}

export function formatSyncReportJson(report: SyncReport): JsonReport {
  const fields: JsonReportField[] = []

  for (const answer of report.answers) {
    fields.push({
      type: 'answer',
      field: answer.field,
      value: answer.value,
      status: answer.status,
      ...(answer.error && { error: answer.error }),
    })
  }

  for (const customField of report.customFields) {
    fields.push({
      type: 'custom_field',
      field: customField.field,
      value: customField.value,
      status: customField.status,
      ...(customField.error && { error: customField.error }),
    })
  }

  const summary: JsonReportSummary = {
    total: fields.length + 2 + (report.notes !== null ? 1 : 0),
    success: fields.filter((f) => isSuccessStatus(f.status)).length +
      (isSuccessStatus(report.candidate) ? 1 : 0) +
      (isSuccessStatus(report.jobApplication) ? 1 : 0) +
      (report.notes !== null && isSuccessStatus(report.notes) ? 1 : 0),
    failed: fields.filter((f) => f.status === 'failed').length +
      (report.candidate === 'failed' ? 1 : 0) +
      (report.jobApplication === 'failed' ? 1 : 0) +
      (report.notes === 'failed' ? 1 : 0),
    notFound: fields.filter((f) => f.status === 'not_found').length,
  }

  return {
    success: report.success,
    email: report.email,
    ...(report.candidateId && { candidateId: report.candidateId }),
    jobId: report.jobId,
    candidate: report.candidate,
    jobApplication: report.jobApplication,
    notes: report.notes,
    summary,
    fields,
    ...(report.error && { error: report.error }),
  }
}

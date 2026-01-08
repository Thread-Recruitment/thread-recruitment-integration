// Shared types

export interface ParsedFields {
  candidate: {
    firstName?: string
    lastName?: string
    email: string
    phone?: string
    tags?: string[]
  }
  answers: Array<{ questionId: string; value: string }>
  customFields: Array<{ apiName: string; value: string }>
  notes?: string
}

export type FieldStatus = 'success' | 'failed' | 'skipped' | 'not_found' | 'updated' | 'already_exists'

export interface FieldResult {
  field: string
  value: string
  status: FieldStatus
  error?: string
}

export interface SyncReport {
  success: boolean
  candidateId?: string
  email: string
  jobId: string

  candidate: FieldStatus
  jobApplication: FieldStatus

  answers: FieldResult[]
  customFields: FieldResult[]
  notes: FieldStatus | null

  error?: string
}

export interface WebhookResponse {
  success: boolean
  candidate_id?: string
  error?: string
}

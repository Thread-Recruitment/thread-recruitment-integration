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

export interface SyncResult {
  success: boolean
  candidateId?: string
  error?: string
}

export interface WebhookResponse {
  success: boolean
  candidate_id?: string
  error?: string
}
